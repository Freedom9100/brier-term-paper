import logging

from django.db import transaction
from django.utils import timezone

from .model_features import question_features
from .model_files import model_for_deadline
from .models import ModelPrediction, Question


logger = logging.getLogger(__name__)


def save_model_prediction(question):
    if ModelPrediction.objects.filter(question=question).exists():
        return
    model = model_for_deadline(question.closes_at)
    if model is None:
        return
    features = question_features(question)
    if features is None:
        return

    version, pipeline = model
    try:
        probability = float(pipeline.predict_proba([features])[0, 1])
    except (ValueError, TypeError, AttributeError):
        logger.warning("Не удалось рассчитать прогноз модели %s", version, exc_info=True)
        return
    ModelPrediction.objects.create(question=question, probability=probability, model_version=version)


def close_due_questions():
    due_ids = Question.objects.filter(
        status=Question.Status.OPEN, closes_at__lte=timezone.now(),
    ).values_list("pk", flat=True)
    return sum(close_question(question_id) for question_id in list(due_ids))


@transaction.atomic
def close_question(question_id):
    question = (
        Question.objects.select_for_update()
        .filter(pk=question_id, status=Question.Status.OPEN, closes_at__lte=timezone.now())
        .first()
    )
    if question is None:
        return False
    save_model_prediction(question)
    question.status = Question.Status.CLOSED
    question.save(update_fields=["status"])
    return True
