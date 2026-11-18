from django.db.models import Avg, Case, CharField, Count, OuterRef, Subquery, Value, When
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import serializers

from .models import Category, Comment, Forecast, Question


PUBLIC_STATUSES = (
    Question.Status.OPEN, Question.Status.CLOSED, Question.Status.RESOLVED,
)


class NewQuestionSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=140)
    description = serializers.CharField()
    category = serializers.SlugRelatedField(slug_field="slug", queryset=Category.objects.all())

    class Meta:
        model = Question
        fields = ("title", "description", "category", "closes_at")

    def validate_closes_at(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Выберите время закрытия в будущем.")
        return value


def questions_with_stats(queryset):
    comment_count = (
        Comment.objects.filter(question_id=OuterRef("pk"))
        .values("question_id").annotate(total=Count("pk")).values("total")
    )
    return queryset.select_related("author", "category", "resolution", "modelprediction").annotate(
        public_status=Case(
            When(status=Question.Status.OPEN, closes_at__lte=timezone.now(), then=Value(Question.Status.CLOSED)),
            default="status",
            output_field=CharField(),
        ),
        participants=Count("forecast"),
        crowd=Avg("forecast__probability"),
        comment_count=Coalesce(Subquery(comment_count), 0),
    )


def question_data(question):
    resolution = getattr(question, "resolution", None) if question.public_status == Question.Status.RESOLVED else None
    prediction = None
    if question.public_status != Question.Status.OPEN:
        prediction = getattr(question, "modelprediction", None)
    return {
        "id": question.pk,
        "title": question.title,
        "description": question.description,
        "author": {
            "username": question.author.username,
            "name": question.author.get_full_name() or question.author.username,
        },
        "category": question.category.name,
        "status": question.public_status,
        "created_at": question.created_at,
        "closes_at": question.closes_at,
        "crowd": round(question.crowd) if question.crowd is not None else None,
        "participants": question.participants,
        "comment_count": question.comment_count,
        "outcome": int(resolution.outcome) if resolution else None,
        "resolved_at": resolution.resolved_at if resolution else None,
        "source": resolution.source if resolution else "",
        "model": prediction.probability * 100 if prediction else None,
        "model_demo": prediction.model_version.startswith("demo-") if prediction else False,
    }


def forecast_stats(question_id, viewer_id):
    rows = Forecast.objects.filter(question_id=question_id).values_list("user_id", "probability")
    histogram = [0] * 10
    total = 0
    participants = 0
    own_probability = None

    # Все числа карточки считаются по одному набору сохранённых прогнозов.
    for user_id, probability in rows:
        histogram[(probability - 1) // 10] += 1
        total += probability
        participants += 1
        if user_id == viewer_id:
            own_probability = probability

    return {
        "you": own_probability,
        "crowd": round(total / participants) if participants else None,
        "crowd_exact": total / participants if participants else None,
        "participants": participants,
        "histogram": histogram,
    }
