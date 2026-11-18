from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Category(models.Model):
    name = models.CharField("название", max_length=100, unique=True)
    slug = models.SlugField("код", unique=True)

    class Meta:
        verbose_name = "категория"
        verbose_name_plural = "категории"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Question(models.Model):
    class Status(models.TextChoices):
        MODERATION = "moderation", "На модерации"
        OPEN = "open", "Приём открыт"
        REJECTED = "rejected", "Отклонён"
        CLOSED = "closed", "Приём закрыт"
        RESOLVED = "resolved", "Разрешён"

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, models.PROTECT, verbose_name="автор",
    )
    category = models.ForeignKey(Category, models.PROTECT, verbose_name="категория")
    title = models.CharField("заголовок", max_length=200)
    description = models.TextField("условия разрешения")
    status = models.CharField(
        "статус", max_length=20, choices=Status.choices, default=Status.MODERATION,
    )
    rejection_reason = models.TextField("причина отклонения", blank=True)
    closes_at = models.DateTimeField("закрытие приёма")
    resolves_at = models.DateTimeField("ожидаемый исход", blank=True, null=True)
    created_at = models.DateTimeField("создан", auto_now_add=True)

    class Meta:
        verbose_name = "вопрос"
        verbose_name_plural = "вопросы"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(resolves_at__isnull=True)
                | models.Q(resolves_at__gt=models.F("closes_at")),
                name="expected_outcome_after_closing",
            ),
        ]

    def __str__(self):
        return self.title


class Forecast(models.Model):
    question = models.ForeignKey(Question, models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT)
    probability = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(99)],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["question", "user"], name="one_forecast_per_user_and_question",
            ),
            models.CheckConstraint(
                condition=models.Q(probability__gte=1, probability__lte=99),
                name="forecast_probability_between_1_and_99",
            ),
        ]

    def __str__(self):
        return f"{self.user}: {self.probability} %"


class Resolution(models.Model):
    question = models.OneToOneField(Question, models.CASCADE)
    outcome = models.BooleanField()
    source = models.TextField()
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT)
    resolved_at = models.DateTimeField(auto_now_add=True)


class Score(models.Model):
    forecast = models.OneToOneField(Forecast, models.CASCADE)
    brier_score = models.DecimalField(max_digits=5, decimal_places=4)
    points = models.DecimalField(max_digits=5, decimal_places=2)
    calculated_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    question = models.ForeignKey(Question, models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "комментарий"
        verbose_name_plural = "комментарии"

    def __str__(self):
        return self.body[:80]


class ModelPrediction(models.Model):
    question = models.OneToOneField(Question, models.CASCADE)
    probability = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(1)],
    )
    model_version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(probability__gte=0, probability__lte=1),
                name="model_probability_between_0_and_1",
            ),
        ]
