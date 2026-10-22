import { Link } from 'react-router';
import { Clock } from 'lucide-react';
import { Status } from './Status';
import { Ruler } from './Ruler';

// Строка вкладки «Активные» в кабинете: вопрос, по которому есть ваш прогноз,
// а исхода ещё нет. Три числа — вы, группа и (после закрытия) модель.
export function ActiveForecastRow({ question }) {
  const isClosed = question.status === 'closed';

  return (
    <Link to={`/questions/${question.id}`} className="block py-4 border-b border-line last:border-b-0 group">
      <div className="flex items-center gap-2 text-[13px] text-ink-2">
        {isClosed && <Status kind="closed" />}
        {!isClosed && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {question.closesIn}
          </span>
        )}
        <span>· {question.category}</span>
      </div>
      <div className="mt-2 text-[15px] leading-[21px] font-medium text-pretty group-hover:underline">{question.title}</div>
      <div className="mt-3 flex items-baseline gap-5 tabular-nums">
        <ForecastNumber value={question.you} label="вы" />
        <ForecastNumber value={question.crowd} label="группа" className={isClosed ? 'text-ink-2' : 'text-accent'} />
        {question.model != null && <ForecastNumber value={question.model} label="модель" />}
      </div>
      <div className="mt-2.5">
        <Ruler crowd={question.crowd} you={question.you} model={question.model} />
      </div>
    </Link>
  );
}

function ForecastNumber({ value, label, className = '' }) {
  return (
    <span>
      <span className={`text-[22px] font-semibold tracking-[-0.02em] ${className}`}>{value}%</span>{' '}
      <span className="text-[12px] text-ink-2">{label}</span>
    </span>
  );
}
