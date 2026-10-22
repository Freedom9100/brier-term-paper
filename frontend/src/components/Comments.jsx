import { Link } from 'react-router';
import { ArrowUp, Trash2 } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { currentUser, people } from '../data/mock';

// Раздел комментариев страницы вопроса.
// comments — показанные комментарии, total — сколько их всего у вопроса.
// Гость читает, но не пишет: поля ввода у него нет.
export function CommentsSection({ comments, total, role }) {
  const hiddenCount = total - comments.length;
  return (
    <>
      <SectionTitle title="Комментарии" right={<span className="text-[15px] text-ink-2 tabular-nums">{total}</span>} />
      {role !== 'guest' && <CommentInput />}
      <div>
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment} role={role} />
        ))}
      </div>
      {hiddenCount > 0 && (
        <div className="pt-1">
          <Button variant="soft" full>Показать ещё {hiddenCount}</Button>
        </div>
      )}
    </>
  );
}

// Один комментарий. author: true — пишет автор вопроса, рядом метка «автор».
// Свой комментарий можно удалить — показываем значок корзины.
function Comment({ comment, role }) {
  const person = people[comment.who];
  const isMine = role !== 'guest' && comment.who === currentUser.username;

  return (
    <div className="flex gap-3 py-4 border-b border-line last:border-b-0">
      <Link to={`/users/${person.username}`} className="self-start">
        <Avatar person={person} size={32} />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[14px] leading-5">
          <Link to={`/users/${person.username}`} className="font-semibold hover:underline">{person.name}</Link>
          {comment.author && <span className="h-5 px-1.5 rounded-md bg-paper-2 text-[11px] font-semibold text-ink-2 inline-flex items-center">автор</span>}
          <span className="text-ink-2">· {comment.when}</span>
          {isMine && (
            <button type="button" className="ml-auto text-ink-2 hover:text-neg" aria-label="Удалить комментарий">
              <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="mt-1 text-[15px] leading-[22px] text-pretty">{comment.text}</p>
        {comment.forecast != null && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-ink-2">
            <span className="w-1 h-3 rounded-full bg-ink" />прогноз {comment.forecast} %
          </div>
        )}
      </div>
    </div>
  );
}

// Поле нового комментария. Отправка появится вместе с API.
function CommentInput() {
  return (
    <div className="mt-1 flex items-center gap-3 py-3">
      <Avatar person={currentUser} size={32} />
      <label className="flex-1 flex items-center h-11 pl-4 pr-1.5 rounded-full bg-paper-2 text-[15px]">
        <input type="text" placeholder="Добавить комментарий" aria-label="Добавить комментарий" className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-ink-2" />
        <button type="button" className="size-8 rounded-full bg-line text-ink-3 inline-flex items-center justify-center shrink-0" aria-label="Отправить">
          <ArrowUp className="size-4" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </label>
    </div>
  );
}
