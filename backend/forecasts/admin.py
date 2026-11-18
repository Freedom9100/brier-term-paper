from django import forms
from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path, reverse
from django.views.decorators.http import require_http_methods, require_POST
from django.utils import timezone

from .model_training import train_model
from .models import Category, Comment, Question
from .scoring import can_resolve_question, resolve_question


class QuestionModerationForm(forms.ModelForm):
    status = forms.ChoiceField(label="Решение", choices=[
        (Question.Status.MODERATION, "Оставить на модерации"),
        (Question.Status.OPEN, "Одобрить"),
        (Question.Status.REJECTED, "Отклонить"),
    ])

    class Meta:
        model = Question
        fields = ("status", "rejection_reason")

    def clean(self):
        data = super().clean()
        status = data.get("status")
        if status == Question.Status.OPEN and self.instance.closes_at <= timezone.now():
            self.add_error("status", "Время приёма уже истекло. Такой вопрос нельзя опубликовать.")
        if status == Question.Status.REJECTED and not data.get("rejection_reason"):
            self.add_error("rejection_reason", "Укажите причину отклонения для автора.")
            # Форма не должна менять статус объекта в памяти, пока решение не прошло проверку.
            data.pop("status", None)
        if status != Question.Status.REJECTED:
            data["rejection_reason"] = ""
        return data


class ResolveQuestionForm(forms.Form):
    outcome = forms.TypedChoiceField(
        label="Исход", choices=[("", "Выберите исход"), ("1", "Да"), ("0", "Нет")],
        coerce=int,
    )
    source = forms.CharField(label="Источник или обоснование", widget=forms.Textarea(attrs={"rows": 4}))


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    form = QuestionModerationForm
    list_display = ("title", "category", "author", "current_status", "closes_at")
    list_filter = ("status", "category")
    list_select_related = ("category", "author")
    search_fields = ("title", "author__username")
    ordering = ("-created_at", "-id")
    fields = (
        "title", "description", "category", "author", "closes_at", "resolves_at",
        "created_at", "status", "rejection_reason", "recorded_outcome",
    )
    readonly_fields = (
        "title", "description", "category", "author", "closes_at", "resolves_at", "created_at", "recorded_outcome",
    )

    def get_urls(self):
        return [
            path(
                "train-model/",
                self.admin_site.admin_view(require_POST(self.train_view)),
                name="forecasts_question_train",
            ),
            path(
                "<int:question_id>/resolve/",
                self.admin_site.admin_view(require_http_methods(["GET", "POST"])(self.resolve_view)),
                name="forecasts_question_resolve",
            ),
        ] + super().get_urls()

    def changelist_view(self, request, extra_context=None):
        extra_context = dict(extra_context or {})
        if self.has_change_permission(request):
            extra_context["train_url"] = reverse("admin:forecasts_question_train")
        return super().changelist_view(request, extra_context)

    def train_view(self, request):
        if not self.has_change_permission(request):
            raise PermissionDenied
        try:
            result = train_model()
        except ValidationError as error:
            self.message_user(request, error.message, messages.ERROR)
        else:
            self.message_user(request, f'Модель обучена. Вопросов: {result["count"]}.', messages.SUCCESS)
        return redirect("admin:forecasts_question_changelist")

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = dict(extra_context or {})
        question = self.get_object(request, object_id) if request.method == "GET" else None
        if question and can_resolve_question(question) and super().has_change_permission(request, question):
            extra_context["resolve_url"] = reverse("admin:forecasts_question_resolve", args=[question.pk])
        return super().change_view(request, object_id, form_url, extra_context)

    def resolve_view(self, request, question_id):
        question = get_object_or_404(Question, pk=question_id)
        if not super().has_change_permission(request, question):
            raise PermissionDenied

        question_url = reverse("admin:forecasts_question_change", args=[question_id])
        if not can_resolve_question(question):
            self.message_user(request, "Исход можно указать один раз после закрытия приёма.", messages.ERROR)
            return redirect(question_url)

        form = ResolveQuestionForm(request.POST if request.method == "POST" else None)
        if form.is_valid():
            try:
                resolve_question(question_id, bool(form.cleaned_data["outcome"]), form.cleaned_data["source"], request.user)
            except ValidationError as error:
                self.message_user(request, error.message, messages.ERROR)
            else:
                self.message_user(request, "Исход записан. Очки начислены.", messages.SUCCESS)
            return redirect(question_url)

        return render(request, "admin/forecasts/question/resolve.html", {
            **self.admin_site.each_context(request),
            "title": "Указать исход",
            "form": form,
            "question": question,
            "question_url": question_url,
        })

    @admin.display(description="Статус", ordering="status")
    def current_status(self, obj):
        if obj.status == Question.Status.OPEN and can_resolve_question(obj):
            return Question.Status.CLOSED.label
        return obj.get_status_display()

    @admin.display(description="Итог")
    def recorded_outcome(self, obj):
        resolution = getattr(obj, "resolution", None)
        if not resolution:
            return "Ожидает исхода"
        label = "Да" if resolution.outcome else "Нет"
        return f"«{label}». {resolution.source}"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.method == "POST" and request.resolver_match.url_name == "forecasts_question_change":
            # Django сохраняет форму админки в транзакции. Второе решение ждёт первое.
            return queryset.select_for_update()
        return queryset

    def get_fields(self, request, obj=None):
        if obj and obj.status != Question.Status.MODERATION:
            return tuple("current_status" if field == "status" else field for field in self.fields)
        return self.fields

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status != Question.Status.MODERATION:
            return self.get_fields(request, obj)
        return self.readonly_fields

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        if obj and obj.status != Question.Status.MODERATION:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("body", "user", "question", "created_at")
    list_select_related = ("user", "question")
    search_fields = ("body", "user__username", "question__title")
    readonly_fields = ("body", "user", "question", "created_at")
    ordering = ("-created_at", "-pk")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
