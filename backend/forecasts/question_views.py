from django.db.models import Count, Max, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.cache import never_cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Category, Question, Score
from .question_data import PUBLIC_STATUSES, NewQuestionSerializer, forecast_stats, question_data, questions_with_stats


SORT_ORDERS = {
    "closing": ("closes_at", "id"),
    "new": ("-created_at", "-id"),
    "popular": ("-participants", "closes_at", "id"),
}


@api_view(["GET"])
def categories(request):
    items = Category.objects.annotate(count=Count("question", filter=Q(
        question__status=Question.Status.OPEN, question__closes_at__gt=timezone.now(),
    )))
    return Response(list(items.values("slug", "name", "count")))


@api_view(["GET", "POST"])
@never_cache
def questions(request):
    if request.method == "POST":
        return create_question(request)

    status = request.query_params.get("status", Question.Status.OPEN)
    order = SORT_ORDERS.get(request.query_params.get("sort", "closing"))
    if status not in PUBLIC_STATUSES or order is None:
        return Response({"error": "Проверьте статус и сортировку."}, status=400)

    items = questions_with_stats(Question.objects.all()).filter(public_status=status)
    category = request.query_params.get("category", "")
    search = request.query_params.get("q", "").strip()
    if category:
        items = items.filter(category__slug=category)
    if search:
        items = items.filter(title__icontains=search)
    # У пользователя не больше одного прогноза на вопрос. Фильтр действует
    # только на личное значение, среднее и число участников считаются по всем.
    items = items.annotate(you=Max("forecast__probability", filter=Q(forecast__user_id=request.user.pk)))
    return Response([
        {**question_data(question), "you": question.you}
        for question in items.order_by(*order)
    ])


def create_question(request):
    if not request.user.is_authenticated:
        return Response({"error": "Войдите, чтобы задать вопрос."}, status=403)

    serializer = NewQuestionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"fields": serializer.errors}, status=400)
    question = serializer.save(author=request.user)
    return Response({"id": question.pk, "status": question.status}, status=201)


@api_view(["GET"])
@never_cache
def my_questions(request):
    if not request.user.is_authenticated:
        return Response({"error": "Войдите, чтобы открыть свои вопросы."}, status=403)

    items = questions_with_stats(Question.objects.filter(author=request.user)).order_by("-created_at", "-id")
    return Response([
        {
            "id": question.pk,
            "title": question.title,
            "status": question.public_status,
            "created_at": question.created_at,
            "rejection_reason": question.rejection_reason,
            "participants": question.participants,
        }
        for question in items
    ])


@api_view(["GET"])
@never_cache
def question_detail(request, question_id):
    items = questions_with_stats(Question.objects.filter(status__in=PUBLIC_STATUSES))
    question = get_object_or_404(items, pk=question_id)
    data = question_data(question)
    data.update(forecast_stats(question.pk, request.user.pk))
    if question.status == Question.Status.RESOLVED and request.user.is_authenticated:
        points = Score.objects.filter(forecast__question=question, forecast__user=request.user).values_list("points", flat=True).first()
        data["points"] = float(points) if points is not None else None
    similar = items.filter(category=question.category, public_status=Question.Status.OPEN).exclude(pk=question.pk)
    data["similar"] = list(similar.order_by("closes_at", "id").values("id", "title")[:2])
    return Response(data)
