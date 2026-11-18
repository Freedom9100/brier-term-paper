import { Link } from 'react-router';
import { Panel } from './SidePanels';
import { SectionTitle } from './SectionTitle';
import { formatDeadline, formatQuestionDate } from '../utils/questionDates';

export function QuestionAside({ question }) {
  return (
    <>
      <Panel className="p-5">
        <SectionTitle title="Детали вопроса" />
        <div className="mt-2">
          <DetailRow label="Автор" value={question.author.name} />
          <DetailRow label="Категория" value={question.category} />
          <DetailRow label="Создан" value={formatQuestionDate(question.created_at)} />
          <DetailRow label="Закрытие приёма" value={formatDeadline(question.closes_at)} />
          {question.resolved_at && <DetailRow label="Исход указан" value={formatDeadline(question.resolved_at)} />}
        </div>
      </Panel>

      {question.similar.length > 0 && (
        <Panel className="p-5">
          <SectionTitle title="В той же категории" />
          {question.similar.map((other) => (
            <Link key={other.id} to={`/questions/${other.id}`} className="block py-3 border-b border-line last:border-b-0 text-sm font-medium break-words hover:underline">
              {other.title}
            </Link>
          ))}
        </Panel>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-line last:border-b-0 text-sm">
      <span className="text-ink-2 shrink-0">{label}</span>
      <span className="font-medium text-right min-w-0 break-words">{value}</span>
    </div>
  );
}
