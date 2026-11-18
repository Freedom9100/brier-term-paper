from statistics import fmean, pstdev

from django.db.models import Avg

from .models import Forecast, Score


def question_features(question):
    cutoff = question.closes_at
    forecasts = dict(Forecast.objects.filter(
        question=question, updated_at__lte=cutoff,
    ).values_list("user_id", "probability"))
    if not forecasts:
        return None

    player_history = list(
        Score.objects.filter(
            forecast__user_id__in=forecasts,
            forecast__question__resolution__resolved_at__lt=cutoff,
        )
        .values("forecast__user_id")
        .annotate(average=Avg("brier_score"))
        .values_list("average", flat=True)
    )
    return {
        "category": question.category.slug,
        "horizon_days": max(0, (cutoff - question.created_at).total_seconds() / 86400),
        "participants": len(forecasts),
        "crowd_mean": fmean(forecasts.values()) / 100,
        "crowd_spread": pstdev(forecasts.values()) / 100,
        "past_brier": fmean(player_history) if player_history else 0.25,
    }
