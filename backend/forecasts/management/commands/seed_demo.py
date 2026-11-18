from datetime import timedelta
from secrets import token_urlsafe

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from forecasts.demo_scenario import CURRENT, FORECASTERS, HISTORY, HISTORY_COMMENTS, PEOPLE
from forecasts.model_files import model_directory, model_for_deadline
from forecasts.model_predictions import save_model_prediction
from forecasts.model_training import train_model
from forecasts.models import Category, Comment, Forecast, ModelPrediction, Question, Resolution, Score
from forecasts.scoring import resolve_question


def demo_account(username, first_name, last_name="", *, can_sign_in=False, administrator=False):
    email = f"{username}@example.invalid"
    user, created = get_user_model().objects.get_or_create(
        username=username,
        defaults={
            "first_name": first_name, "last_name": last_name, "email": email,
            "is_staff": administrator, "is_superuser": administrator,
        },
    )
    if not created:
        if user.email != email or user.is_superuser != administrator:
            raise CommandError(f"Логин {username} уже используется. Запустите показ с отдельной базой.")
        return user, None

    password = token_urlsafe(15) if can_sign_in else None
    user.set_password(password)
    user.save(update_fields=["password"])
    return user, password


def seed_question(author, category, title, description, closes_at, created_at, status):
    question, created = Question.objects.get_or_create(
        author=author, title=title,
        defaults={
            "category": category, "description": description,
            "closes_at": closes_at, "status": status,
        },
    )
    if not created:
        return None
    Question.objects.filter(pk=question.pk).update(created_at=created_at)
    return question


def add_activity(question, people, votes, replies, start, end):
    # Реплики идут в заданном порядке. Часть прогнозов появляется уже после начала разговора.
    span = end - start
    for index, (person, probability) in enumerate(votes.items(), start=1):
        forecast = Forecast.objects.create(question=question, user=people[person], probability=probability)
        placed_at = start + span * index / (len(votes) + 1)
        Forecast.objects.filter(pk=forecast.pk).update(created_at=placed_at, updated_at=placed_at)
    for index, (person, body) in enumerate(replies, start=1):
        comment = Comment.objects.create(question=question, user=people[person], body=body)
        written_at = start + span * index / (len(replies) + 1)
        Comment.objects.filter(pk=comment.pk).update(created_at=written_at)


def seed_history(people, categories, administrator, now):
    # В новой базе дедлайн последнего вопроса наступает сразу после обучения демомодели.
    recent_close = now - timedelta(hours=2)
    if not model_for_deadline(recent_close):
        recent_close = now

    for index, (days, author, slug, title, description, outcome, source, probabilities) in enumerate(HISTORY):
        closes_at = now + timedelta(days=days) if days else recent_close
        created_at = closes_at - timedelta(days=2 + index % 4, hours=index)
        question = seed_question(
            people[author], categories[slug], title, description, closes_at, created_at, Question.Status.CLOSED,
        )
        if question is None:
            continue
        votes = {person: value for person, value in zip(FORECASTERS, probabilities, strict=True) if value}
        add_activity(question, people, votes, HISTORY_COMMENTS.get(days, []), created_at, closes_at)
        resolution = resolve_question(question.pk, outcome, source, administrator)
        resolved_at = min(closes_at + timedelta(hours=1 + index % 10), timezone.now())
        Resolution.objects.filter(pk=resolution.pk).update(resolved_at=resolved_at)
        Score.objects.filter(forecast__question=question).update(calculated_at=resolved_at)
        ModelPrediction.objects.filter(question=question).update(created_at=closes_at)


def seed_current(people, categories, now):
    now = timezone.localtime(now)
    for index, (days, author, slug, title, description, votes, replies) in enumerate(CURRENT):
        closes_at = (now + timedelta(days=days)).replace(hour=18, minute=0, second=0, microsecond=0)
        created_at = min(closes_at, now) - timedelta(days=1 + index % 5, hours=3 * index)
        status = Question.Status.OPEN if days > 0 else Question.Status.CLOSED
        question = seed_question(people[author], categories[slug], title, description, closes_at, created_at, status)
        if question is None:
            continue
        add_activity(question, people, votes, replies, created_at, min(closes_at, now))
        if status == Question.Status.CLOSED:
            save_model_prediction(question)
            ModelPrediction.objects.filter(question=question).update(created_at=closes_at)

    seed_question(
        people["sasha"], categories["study"], "Откроют ли мастерскую на два вечера перед показом?",
        "В расписании мастерской к 18:00 должны быть два дополнительных вечерних окна перед показом макетов.",
        now + timedelta(days=8), now, Question.Status.MODERATION,
    )


class Command(BaseCommand):
    help = "Заполняет локальную базу вымышленной активностью для защиты."

    @transaction.atomic
    def handle(self, *args, **options):
        categories = {}
        for category in Category.objects.select_for_update().order_by("pk"):
            categories[category.slug] = category
        required_slugs = {row[2] for row in HISTORY + CURRENT}
        if not required_slugs.issubset(categories):
            raise CommandError("Сначала добавьте категории командой seed_categories.")

        administrator, admin_password = demo_account(
            "brier-demo-admin", "Демо-администратор", can_sign_in=True, administrator=True,
        )
        lead, lead_password = demo_account("brier-demo-user", "Демо-участник", can_sign_in=True)
        people = {key: demo_account(*identity)[0] for key, identity in PEOPLE.items()}

        if not any(model_directory().glob("demo-*.joblib")):
            train_model(demo=True)
        now = timezone.now()
        seed_history(people, categories, administrator, now)
        seed_current(people, categories, now)

        for user, password in ((lead, lead_password), (administrator, admin_password)):
            if password:
                self.stdout.write(f"{user.username}  {password}")
