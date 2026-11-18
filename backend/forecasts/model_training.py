from datetime import timedelta
from random import Random
from statistics import fmean

from django.core.exceptions import ValidationError
from django.utils import timezone
from sklearn.feature_extraction import DictVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from .model_features import question_features
from .model_files import store_model
from .models import Question


MIN_TRAINING_QUESTIONS = 40


def train_model(*, demo=False):
    rows = demo_rows() if demo else historical_rows()
    if len(rows) < MIN_TRAINING_QUESTIONS or len({row["outcome"] for row in rows}) < 2:
        raise ValidationError(
            f"Для обучения нужны хотя бы {MIN_TRAINING_QUESTIONS} разрешённых вопросов "
            "с прогнозами и оба исхода."
        )

    metrics = test_on_later_questions(rows)
    version = store_model(fit_model(rows), demo=demo)
    return {"version": version, "count": len(rows), "metrics": metrics}


def historical_rows():
    cutoff = timezone.now()
    questions = Question.objects.filter(
        status=Question.Status.RESOLVED, resolution__resolved_at__lte=cutoff,
    ).select_related("category", "resolution").order_by("closes_at", "pk")
    rows = []
    for question in questions:
        features = question_features(question)
        if features is not None:
            rows.append({
                "features": features,
                "outcome": int(question.resolution.outcome),
                "closes_at": question.closes_at,
                "resolved_at": question.resolution.resolved_at,
            })
    return rows


def fit_model(rows):
    pipeline = make_pipeline(DictVectorizer(sparse=False), StandardScaler(), LogisticRegression())
    pipeline.fit([row["features"] for row in rows], [row["outcome"] for row in rows])
    return pipeline


def test_on_later_questions(rows):
    split = len(rows) * 4 // 5
    test = rows[split:]
    cutoff = test[0]["closes_at"]
    train = [row for row in rows[:split] if row["resolved_at"] < cutoff]
    if len({row["outcome"] for row in train}) < 2:
        return None

    probabilities = fit_model(train).predict_proba([row["features"] for row in test])[:, 1]
    return {
        "count": len(test),
        "model": fmean((p - row["outcome"]) ** 2 for p, row in zip(probabilities, test, strict=True)),
        "crowd": fmean((row["features"]["crowd_mean"] - row["outcome"]) ** 2 for row in test),
    }


def demo_rows():
    random = Random(19)
    start = timezone.now() - timedelta(days=200)
    rows = []
    for index in range(120):
        crowd = random.uniform(0.1, 0.9)
        closes_at = start + timedelta(days=index)
        rows.append({
            "features": {
                "category": random.choice(["study", "sports", "technology", "weather", "economy", "movies-and-games"]),
                "horizon_days": random.randint(1, 15),
                "participants": random.randint(2, 30),
                "crowd_mean": crowd,
                "crowd_spread": random.uniform(0.02, 0.2),
                "past_brier": random.uniform(0.14, 0.3),
            },
            "outcome": int(random.random() < crowd),
            "closes_at": closes_at,
            "resolved_at": closes_at + timedelta(hours=6),
        })
    return rows
