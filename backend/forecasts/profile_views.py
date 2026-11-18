from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .profile_data import MIN_RANKED_FORECASTS, calibration_points, ranked_users, score_data, user_scores


@api_view(["GET"])
def rating(request):
    return Response({"rows": ranked_users(), "minimum": MIN_RANKED_FORECASTS})


@api_view(["GET"])
def participant_profile(request, username):
    user = get_object_or_404(get_user_model(), username=username)
    scores = list(user_scores(user))
    forecasts = [score_data(score) for score in scores]
    rows = ranked_users()
    place = next((row["place"] for row in rows if row["username"] == username), None)
    count = len(scores)

    return Response({
        "person": {"username": user.username, "name": user.get_full_name() or user.username},
        "stats": {
            "place": place,
            "count": count,
            "avg": float(sum(score.points for score in scores) / count) if count else None,
            "brier": float(sum(score.brier_score for score in scores) / count) if count else None,
        },
        "forecasts": forecasts,
        "calibration": calibration_points(forecasts),
        "total_ranked": len(rows),
        "leaders": rows[:5],
        "minimum": MIN_RANKED_FORECASTS,
    })
