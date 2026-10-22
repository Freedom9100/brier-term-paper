import { Link } from 'react-router';
import { Status } from './Status';

// Строка вкладки «Мои вопросы»: статус модерации, дата, заголовок.
// У отклонённого вопроса — красная плашка с причиной отклонения.
export function MyQuestionRow({ question }) {
  return (
    <div className="py-3.5 border-b border-line last:border-b-0">
      <div className="flex items-center gap-2">
        <Status kind={question.status} />
        <span className="text-[13px] text-ink-2">{question.date}</span>
      </div>
      <div className="mt-2 text-[15px] leading-[21px] font-medium text-pretty">
        {question.questionId && <Link to={`/questions/${question.questionId}`} className="hover:underline">{question.title}</Link>}
        {!question.questionId && question.title}
      </div>
      {question.reason && (
        <div className="mt-2.5 rounded-xl bg-neg-soft px-3.5 py-2.5 text-[13px] leading-[19px] text-ink">
          <span className="font-semibold text-neg">Причина отклонения.</span> {question.reason}
        </div>
      )}
      {question.participants && (
        <div className="mt-1.5 text-[13px] text-ink-2 tabular-nums">{question.participants} участников</div>
      )}
    </div>
  );
}
