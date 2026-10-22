import { Link } from 'react-router';
import { Avatar } from './Avatar';
import { Status } from './Status';
import { people } from '../data/mock';

// Верх страницы вопроса: автор, категория, статус, заголовок и пояснение.
// На планшете и десктопе (md:) заголовок крупнее.
export function QuestionHeader({ question }) {
  const author = people[question.author];
  const profileLink = `/users/${author.username}`;

  return (
    <>
      <div className="flex items-center gap-3">
        <Link to={profileLink}>
          <Avatar person={author} size={36} />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={profileLink} className="text-[14px] font-semibold leading-5 hover:underline">{author.name}</Link>
          <div className="text-[13px] text-ink-2 leading-[18px]">{question.category} · создан {question.created}</div>
        </div>
        <Status kind={getStatusKind(question)} />
      </div>
      <h1 className="mt-4 text-[24px] leading-[30px] md:text-[32px] md:leading-[38px] font-semibold tracking-[-0.03em] text-balance">
        {question.title}
      </h1>
      {question.body && (
        <p className="mt-2.5 text-[15px] leading-[22px] md:text-[16px] md:leading-6 text-ink-2 text-pretty max-w-[62ch]">{question.body}</p>
      )}
    </>
  );
}

// Какую метку показать справа от автора.
function getStatusKind(question) {
  if (question.status === 'resolved') return question.outcome === 1 ? 'yes' : 'no';
  if (question.status === 'closed') return 'closed';
  return 'open';
}
