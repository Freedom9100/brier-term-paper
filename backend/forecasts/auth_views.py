import json

from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .auth_forms import RegistrationForm


def read_json_object(request):
    try:
        data = json.loads(request.body)
    except (ValueError, UnicodeError):
        return None
    if not isinstance(data, dict):
        return None
    if any(not isinstance(value, str) for value in data.values()):
        return None
    return data


def session_data(user):
    if not user.is_authenticated:
        return {"user": None}
    return {
        "user": {
            "username": user.username,
            "name": user.get_full_name() or user.username,
            "role": "admin" if user.is_staff else "user",
        }
    }


@require_GET
@never_cache
@ensure_csrf_cookie
def get_session(request):
    return JsonResponse(session_data(request.user))


@require_POST
@never_cache
def register_account(request):
    data = read_json_object(request)
    if data is None:
        return JsonResponse({"error": "Проверьте данные формы."}, status=400)
    form = RegistrationForm(data)
    if not form.is_valid():
        return JsonResponse({"fields": dict(form.errors)}, status=400)

    user_model = get_user_model()
    username = form.cleaned_data["username"]
    try:
        user = user_model.objects.create_user(
            username=username, email=form.cleaned_data["email"],
            password=form.cleaned_data["password"],
        )
    except IntegrityError:
        if not user_model.objects.filter(username=username).exists():
            raise
        return JsonResponse({"fields": {"username": ["Это имя пользователя уже занято."]}}, status=400)

    login(request, user)
    return JsonResponse(session_data(user), status=201)


@require_POST
@never_cache
def sign_in(request):
    data = read_json_object(request)
    if data is None:
        return JsonResponse({"error": "Проверьте данные формы."}, status=400)
    form = AuthenticationForm(request, data=data)
    if not form.is_valid():
        return JsonResponse({"error": "Неверное имя пользователя или пароль."}, status=400)

    user = form.get_user()
    login(request, user)
    return JsonResponse(session_data(user))


@require_POST
@never_cache
def sign_out(request):
    logout(request)
    return JsonResponse({"user": None})
