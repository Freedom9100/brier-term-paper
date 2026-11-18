from django.db import transaction
from django.db.models import OuterRef, Subquery
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.cache import never_cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Forecast, Question
from .profile_data import score_data, user_scores
from .question_data import PUBLIC_STATUSES, forecast_stats, question_data, questions_with_stats


@api_view(["PUT"])
@never_cache
def save_forecast(request, question_id):
    if not request.user.is_authenticated:
        return Response({"error": "Войдите, чтобы сохранить прогноз."}, status=403)

    probability = request.data.get("probability") if isinstance(request.data, dict) else None
    if type(probability) is not int or not 1 <= probability <= 99:
        return Response({"error": "Введите целое число от 1 до 99."}, status=400)

    with transaction.atomic():
        questions = Question.objects.select_for_update().filter(status__in=PUBLIC_STATUSES)
        question = get_object_or_404(questions, pk=question_id)
        accepted_at = timezone.now()
        if question.status != Question.Status.OPEN or question.closes_at <= accepted_at:
            return Response({"error": "Приём прогнозов закрыт."}, status=409)

        forecast, _ = Forecast.objects.update_or_create(
            question=question, user=request.user, defaults={"probability": probability},
        )
        if forecast.updated_at > question.closes_at:
            # При записи на границе срока для модели важен момент проверки под блокировкой.
            Forecast.objects.filter(pk=forecast.pk).update(updated_at=accepted_at)
        data = forecast_stats(question.pk, request.user.pk)
    return Response(data)


@api_view(["GET"])
@never_cache
def my_active_forecasts(request):
    if not request.user.is_authenticated:
        return Response({"error": "Войдите, чтобы открыть свои прогнозы."}, status=403)

    own_forecast = Forecast.objects.filter(user=request.user, question_id=OuterRef("pk"))
    active_questions = Question.objects.filter(status__in=(Question.Status.OPEN, Question.Status.CLOSED))
    questions = (
        questions_with_stats(active_questions)
        .annotate(you=Subquery(own_forecast.values("probability")))
        .filter(you__isnull=False)
        .order_by("closes_at", "id")
    )
    return Response([{**question_data(question), "you": question.you} for question in questions])


@api_view(["GET"])
@never_cache
def my_resolved_forecasts(request):
    if not request.user.is_authenticated:
        return Response({"error": "Войдите, чтобы открыть свои прогнозы."}, status=403)

    return Response([score_data(score) for score in user_scores(request.user)])
