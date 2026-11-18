from django.db.models import Avg, Count

from .models import Question, Score


MIN_RANKED_FORECASTS = 10


def resolved_scores():
    return Score.objects.filter(
        forecast__question__status=Question.Status.RESOLVED,
        forecast__question__resolution__isnull=False,
    )


def user_scores(user):
    return (
        resolved_scores().filter(forecast__user=user)
        .select_related("forecast__question__resolution")
        .order_by("-forecast__question__resolution__resolved_at", "-pk")
    )


def score_data(score):
    forecast = score.forecast
    question = forecast.question
    return {
        "id": forecast.pk,
        "question_id": question.pk,
        "title": question.title,
        "probability": forecast.probability,
        "outcome": int(question.resolution.outcome),
        "resolved_at": question.resolution.resolved_at,
        "points": float(score.points),
    }


def ranked_users():
    totals = (
        resolved_scores()
        .values("forecast__user__username", "forecast__user__first_name", "forecast__user__last_name")
        .annotate(count=Count("pk"), avg=Avg("points"), brier=Avg("brier_score"))
        .filter(count__gte=MIN_RANKED_FORECASTS)
        .order_by("-avg", "forecast__user__username")
    )

    previous_average = None
    place = 0
    rows = []
    for index, result in enumerate(totals, start=1):
        if result["avg"] != previous_average:
            place = index
            previous_average = result["avg"]

        username = result["forecast__user__username"]
        name = f'{result["forecast__user__first_name"]} {result["forecast__user__last_name"]}'.strip()
        rows.append({
            "username": username,
            "name": name or username,
            "place": place,
            "avg": float(result["avg"]),
            "brier": float(result["brier"]),
            "count": result["count"],
        })
    return rows


def calibration_points(forecasts):
    probability_buckets = [[] for _ in range(10)]
    for forecast in forecasts:
        bucket = (forecast["probability"] - 1) // 10
        probability_buckets[bucket].append(forecast)

    points = []
    for bucket in probability_buckets:
        if not bucket:
            continue
        count = len(bucket)
        points.append({
            "p": sum(forecast["probability"] for forecast in bucket) / count,
            "f": 100 * sum(forecast["outcome"] for forecast in bucket) / count,
            "n": count,
        })
    return points
