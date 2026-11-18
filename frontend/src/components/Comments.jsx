import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUp, Trash2 } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { deleteJson, getJson, postJson } from '../api';
import { formatQuestionDate } from '../utils/questionDates';

export function CommentsSection({ questionId, person }) {
  const endpoint = `/api/questions/${questionId}/comments/`;
  const [page, setPage] = useState(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getJson(endpoint, controller.signal).then(setPage).catch((failure) => {
      if (!controller.signal.aborted) setError(failure.message);
    });
    return () => controller.abort();
  }, [endpoint]);

  function runCommentAction(action) {
    if (busy) return;
    setBusy(true);
    setError('');
    action.catch((failure) => setError(failure.message)).finally(() => setBusy(false));
  }

  function submitComment(event) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !page || busy) return;
    runCommentAction(postJson(endpoint, { body }).then((comment) => {
      setDraft('');
      setPage((current) => ({
        ...current, items: [comment, ...current.items], total: current.total + 1,
      }));
    }));
  }

  function removeComment(commentId) {
    if (busy) return;
    runCommentAction(deleteJson(`${endpoint}${commentId}/`).then(() => {
      setPage((current) => ({
        ...current,
        items: current.items.filter((comment) => comment.id !== commentId),
        total: Math.max(0, current.total - 1),
      }));
    }));
  }

  function showMore() {
    if (!page?.next || busy) return;
    runCommentAction(getJson(`${endpoint}?before=${page.next}`).then((nextPage) => {
      setPage((current) => ({ ...nextPage, items: [...current.items, ...nextPage.items] }));
    }));
  }

  return (
    <>
      <SectionTitle title="Комментарии" right={page && <span className="text-sm text-ink-2 tabular-nums">{page.total}</span>} />
      {person && (
        <form onSubmit={submitComment} className="mt-3 flex items-start gap-3">
          <Avatar person={person} size={32} className="mt-1" />
          <label htmlFor="comment-body" className="sr-only">Добавить комментарий</label>
          <textarea id="comment-body" rows={2} maxLength={1000} value={draft} onChange={(event) => setDraft(event.target.value)}
            placeholder="Добавить комментарий" className="min-w-0 flex-1 rounded-xl bg-paper-2 px-3 py-2 text-base" />
          <button type="submit" disabled={busy || !draft.trim() || !page} aria-label="Отправить комментарий"
            className="size-10 shrink-0 rounded-full bg-ink text-white inline-flex items-center justify-center disabled:opacity-40">
            <ArrowUp className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </form>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-neg">{error}</p>}
      {!page && !error && <p role="status" className="mt-3 text-sm text-ink-2">Загружаем комментарии…</p>}
      {page?.total === 0 && <p className="mt-3 text-sm text-ink-2">Пока нет комментариев.</p>}
      {page?.items.map((comment) => (
        <Comment key={comment.id} comment={comment} canDelete={comment.author.username === person?.username}
          busy={busy} onDelete={() => removeComment(comment.id)} />
      ))}
      {page?.next != null && <Button onClick={showMore} disabled={busy} variant="soft" full className="mt-3">Показать ещё</Button>}
    </>
  );
}

function Comment({ comment, canDelete, busy, onDelete }) {
  const profile = `/users/${encodeURIComponent(comment.author.username)}`;
  return (
    <div className="flex gap-3 py-4 border-b border-line last:border-b-0">
      <Avatar person={comment.author} size={32} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm">
          <Link to={profile} className="font-semibold truncate hover:underline">{comment.author.name}</Link>
          {comment.is_question_author && <span className="shrink-0 rounded bg-paper-2 px-1.5 text-[11px] text-ink-2">автор</span>}
          <time dateTime={comment.created_at} className="shrink-0 text-ink-2">{formatQuestionDate(comment.created_at)}</time>
          {canDelete && (
            <button type="button" disabled={busy} onClick={onDelete}
              className="ml-auto shrink-0 size-8 inline-flex items-center justify-center text-ink-2 hover:text-neg disabled:opacity-40" aria-label="Удалить комментарий">
              <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="mt-1 text-[15px] leading-[22px] whitespace-pre-wrap break-words">{comment.body}</p>
      </div>
    </div>
  );
}
