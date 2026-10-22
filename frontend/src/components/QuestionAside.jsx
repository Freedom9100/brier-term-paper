import { Link } from 'react-router';
import { Panel } from './SidePanels';
import { SectionTitle } from './SectionTitle';
import { ScoreFormula } from './Comparison';
import { people, questions } from '../data/mock';

// Боковая колонка страницы вопроса на десктопе:
// детали вопроса, формула очков (если исход известен) и похожие вопросы.
export function QuestionAside({ question, role }) {
  // Похожие — два других открытых вопроса.
  const similar = Object.values(questions)
    .filter((other) => other.status === 'open' && other.id !== question.id)
    .slice(0, 2);

  return (
    <>
      <Panel className="p-5">
        <SectionTitle title="Детали вопроса" />
        <div className="mt-2">
          <DetailRow label="Автор" value={people[question.author].name} />
          <DetailRow label="Категория" value={question.category} />
          <DetailRow label="Создан" value={question.created} />
          <DetailRow label={question.status === 'open' ? 'Закрытие приёма' : 'Приём закрыт'} value={question.closes} />
          {question.resolvedAt && <DetailRow label="Исход указан" value={question.resolvedAt} />}
          {question.source && <DetailRow label="Источник исхода" value={question.source} />}
        </div>
      </Panel>

      {question.status === 'resolved' && (
        <Panel className="p-5">
          <ScoreFormula question={question} role={role} className="" />
        </Panel>
      )}

      <Panel className="p-5">
        <SectionTitle title="Похожие вопросы" />
        {similar.map((other) => (
          <Link key={other.id} to={`/questions/${other.id}`} className="block py-3 border-b border-line last:border-b-0 group">
            <div className="text-[14px] leading-5 font-medium group-hover:underline">{other.title}</div>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="text-[17px] font-semibold text-accent tabular-nums">{other.crowd}%</span>
              <span className="text-[12px] text-ink-2">{other.participants} участников · {other.closesIn}</span>
            </div>
          </Link>
        ))}
      </Panel>
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-line last:border-b-0 text-[14px]">
      <span className="text-ink-2">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
