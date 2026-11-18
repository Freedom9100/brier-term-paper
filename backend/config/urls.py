from django.contrib import admin
from django.db import OperationalError, connection
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response

from forecasts.auth_views import get_session, register_account, sign_in, sign_out
from forecasts.comment_views import delete_comment, question_comments
from forecasts.forecast_views import my_active_forecasts, my_resolved_forecasts, save_forecast
from forecasts.profile_views import participant_profile, rating
from forecasts.question_views import categories, my_questions, question_detail, questions


@api_view(["GET"])
def health(request):
    """Проверяет, что API запустилось и PostgreSQL отвечает."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except OperationalError:
        return Response({"status": "database_unavailable"}, status=503)
    return Response({"status": "ok"})


urlpatterns = [
    path("api/health/", health),
    path("api/auth/session/", get_session),
    path("api/auth/register/", register_account),
    path("api/auth/login/", sign_in),
    path("api/auth/logout/", sign_out),
    path("api/categories/", categories),
    path("api/questions/", questions),
    path("api/questions/mine/", my_questions),
    path("api/questions/<int:question_id>/", question_detail),
    path("api/questions/<int:question_id>/forecast/", save_forecast),
    path("api/forecasts/mine/active/", my_active_forecasts),
    path("api/forecasts/mine/resolved/", my_resolved_forecasts),
    path("api/rating/", rating),
    path("api/users/<str:username>/", participant_profile),
    path("api/questions/<int:question_id>/comments/", question_comments),
    path("api/questions/<int:question_id>/comments/<int:comment_id>/", delete_comment),
    path("admin/", admin.site.urls),
]
