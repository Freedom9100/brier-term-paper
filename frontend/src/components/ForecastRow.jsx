import { Link } from 'react-router';
import { EyeOff } from 'lucide-react';
import { Points } from './Points';
import { calculatePoints } from '../utils/score';

// Строка разрешённого прогноза: вопрос, прогноз, исход, дата и очки за него.
// Если вопрос есть в данных (questionId), заголовок — ссылка на него.
export function ForecastRow({ forecast }) {
  const title = forecast.questionId
    ? <Link to={`/questions/${forecast.questionId}`} className="hover:underline">{forecast.title}</Link>
    : forecast.title;

  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-line last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="text-[15px] leading-[21px] font-medium text-pretty">{title}</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[13px] text-ink-2 tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-3 rounded-full bg-ink" />{forecast.p} %
          </span>
          <span>·</span>
          <span>исход «{forecast.outcome === 1 ? 'Да' : 'Нет'}»</span>
          <span>·</span>
          <span>{forecast.date}</span>
        </div>
      </div>
      <div className="text-right pt-0.5">
        <Points value={forecast.points ?? calculatePoints(forecast.p, forecast.outcome)} className="text-[20px] leading-6" />
        <div className="text-[11px] text-ink-2">очков</div>
      </div>
    </div>
  );
}

// В публичном профиле показываются прогнозы с известным исходом.
export function HiddenForecastsNote({ className = 'rounded-xl bg-paper-2 px-3.5 py-2.5' }) {
  return (
    <div className={`${className} flex items-center gap-2 text-[13px] leading-[18px] text-ink-2`}>
      <EyeOff className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      В профиле видны прогнозы по вопросам с известным исходом.
    </div>
  );
}
