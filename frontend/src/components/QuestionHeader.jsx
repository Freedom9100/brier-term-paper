import { Link } from 'react-router';
import { Avatar } from './Avatar';
import { Status } from './Status';
import { formatQuestionDate } from '../utils/questionDates';

export function QuestionHeader({ question }) {
  let status = question.status;
  if (status === 'resolved' && question.outcome != null) {
    status = question.outcome === 1 ? 'yes' : 'no';
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar person={question.author} size={36} />
        <div className="flex-1 min-w-0">
          <Link to={`/users/${encodeURIComponent(question.author.username)}`} className="block text-sm font-semibold truncate hover:underline">{question.author.name}</Link>
          <div className="text-[13px] text-ink-2">{question.category} · {formatQuestionDate(question.created_at)}</div>
        </div>
        <Status kind={status} />
      </div>
      <h1 className="mt-4 text-[24px] leading-[30px] md:text-[32px] md:leading-[38px] font-semibold tracking-[-0.03em] text-balance break-words">
        {question.title}
      </h1>
      <p className="mt-2.5 text-base leading-6 text-ink-2 whitespace-pre-wrap break-words max-w-[62ch]">{question.description}</p>
    </>
  );
}
