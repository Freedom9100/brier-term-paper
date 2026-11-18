from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Comment, Question
from .question_data import PUBLIC_STATUSES


PAGE_SIZE = 20
MAX_COMMENT_LENGTH = 1000


@api_view(["GET", "POST"])
def question_comments(request, question_id):
    question = public_question(question_id)
    if request.method == "POST":
        return add_comment(request, question)

    comments = Comment.objects.filter(question=question).select_related("user").order_by("-pk")
    total = comments.count()
    before = request.query_params.get("before")
    if before is not None:
        try:
            before_id = int(before)
        except ValueError:
            return Response({"error": "Не удалось открыть предыдущие комментарии."}, status=400)
        if not 0 < before_id < 2 ** 63:
            return Response({"error": "Не удалось открыть предыдущие комментарии."}, status=400)
        comments = comments.filter(pk__lt=before_id)

    page = list(comments[:PAGE_SIZE + 1])
    return Response({
        "items": [comment_data(comment, question.author_id) for comment in page[:PAGE_SIZE]],
        "total": total,
        "next": page[PAGE_SIZE - 1].pk if len(page) > PAGE_SIZE else None,
    })


def add_comment(request, question):
    if not request.user.is_authenticated:
        return Response({"error": "Войдите, чтобы оставить комментарий."}, status=403)

    body = request.data.get("body") if isinstance(request.data, dict) else None
    if not isinstance(body, str) or not body.strip():
        return Response({"error": "Введите текст комментария."}, status=400)
    if len(body.strip()) > MAX_COMMENT_LENGTH:
        return Response({"error": f"Комментарий должен быть не длиннее {MAX_COMMENT_LENGTH} символов."}, status=400)

    comment = Comment.objects.create(question=question, user=request.user, body=body.strip())
    return Response(comment_data(comment, question.author_id), status=201)


@api_view(["DELETE"])
def delete_comment(request, question_id, comment_id):
    if not request.user.is_authenticated:
        return Response({"error": "Войдите, чтобы удалить комментарий."}, status=403)

    question = public_question(question_id)
    comment = get_object_or_404(Comment, question=question, pk=comment_id)
    if comment.user_id != request.user.pk:
        return Response({"error": "Удалить комментарий может его автор."}, status=403)
    comment.delete()
    return Response({"deleted": True})


def public_question(question_id):
    return get_object_or_404(Question, pk=question_id, status__in=PUBLIC_STATUSES)


def comment_data(comment, author_id):
    return {
        "id": comment.pk,
        "body": comment.body,
        "created_at": comment.created_at,
        "author": {
            "username": comment.user.username,
            "name": comment.user.get_full_name() or comment.user.username,
        },
        "is_question_author": comment.user_id == author_id,
    }
