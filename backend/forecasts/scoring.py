from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .model_predictions import save_model_prediction
from .models import Forecast, Question, Resolution, Score


def can_resolve_question(question):
    return (
        question.status in (Question.Status.OPEN, Question.Status.CLOSED)
        and question.closes_at <= timezone.now()
    )


def score_forecast(probability, outcome):
    # Измеряем ошибку в процентных пунктах, чтобы считать без округления.
    squared_error = (probability - 100 * int(outcome)) ** 2
    brier_score = Decimal(squared_error) / 10000
    points = Decimal(10000 - 2 * squared_error) / 100
    return brier_score, points


@transaction.atomic
def resolve_question(question_id, outcome, source, administrator):
    # За этот же объект блокируется запись прогноза. Список участников не меняется
    # между проверкой срока и начислением очков.
    question = Question.objects.select_for_update().get(pk=question_id)
    if not can_resolve_question(question):
        raise ValidationError("Исход можно указать один раз после закрытия приёма.")

    save_model_prediction(question)
    resolution = Resolution.objects.create(
        question=question, outcome=outcome, source=source, resolved_by=administrator,
    )
    scores = []
    forecasts = Forecast.objects.filter(question=question).values_list("pk", "probability")
    for forecast_id, probability in forecasts:
        brier_score, points = score_forecast(probability, outcome)
        scores.append(Score(forecast_id=forecast_id, brier_score=brier_score, points=points))
    Score.objects.bulk_create(scores)
    question.status = Question.Status.RESOLVED
    question.save(update_fields=["status"])
    return resolution
