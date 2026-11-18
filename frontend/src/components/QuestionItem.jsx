import { Link } from 'react-router';
import { Clock, MessageCircle, Users } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Status } from './Status';
import { Meta } from './Meta';
import { Ruler } from './Ruler';
import { Percent } from './Points';
import { formatDeadline, formatQuestionDate } from '../utils/questionDates';

export function QuestionItem({ question }) {
  const link = `/questions/${question.id}`;
  const metaItems = [
    { icon: Users, text: question.participants },
    { icon: MessageCircle, text: question.comment_count },
  ];
  if (question.status === 'open') {
    metaItems.push({ icon: Clock, text: formatDeadline(question.closes_at) });
  }
  const status = question.outcome === 1 ? 'yes' : 'no';

  return (
    <article className="flex gap-3 px-4 py-4 md:px-6 md:py-5 border-b border-line last:border-b-0">
      <Avatar person={question.author} size={36} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm">
          <Link to={`/users/${encodeURIComponent(question.author.username)}`} className="font-semibold truncate hover:underline">{question.author.name}</Link>
          <span className="text-ink-2 truncate">· {question.category} · {formatQuestionDate(question.created_at)}</span>
        </div>
        <h2 className="mt-1 text-base md:text-[17px] font-medium break-words">
          <Link to={link} className="hover:underline underline-offset-2">{question.title}</Link>
        </h2>
        {question.status === 'closed' && <div className="mt-2"><Status kind="closed" /></div>}
        {question.status === 'resolved' && question.outcome != null && <div className="mt-2"><Status kind={status} /></div>}
        <QuestionNumbers question={question} />
        <div className="mt-3.5 flex items-center justify-between gap-3">
          <Meta items={metaItems} />
          <Button to={link} variant="secondary" size="sm">Открыть</Button>
        </div>
      </div>
    </article>
  );
}

function QuestionNumbers({ question }) {
  if (question.crowd == null) {
    return <p className="mt-2 text-sm text-ink-2">Пока нет прогнозов</p>;
  }

  return (
    <>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[32px] leading-none font-semibold tabular-nums text-accent"><Percent value={question.crowd} /></span>
        <span className="text-sm text-ink-2">мнение группы</span>
      </div>
      <div className="mt-3">
        <Ruler crowd={question.crowd} you={question.you} model={question.model} outcome={question.outcome} />
      </div>
    </>
  );
}
