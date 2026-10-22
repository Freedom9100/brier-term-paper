import { Sigma } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { Ruler } from './Ruler';
import { Points } from './Points';
import { calculatePoints, formatNumber } from '../utils/score';

// «Кто был ближе к исходу»: вы, группа и модель на одной линейке и в таблице
// с очками каждого. Гость в таблице не участвует — у него нет прогноза.
export function Comparison({ question, role }) {
  const showYou = role !== 'guest' && question.you != null;
  const rows = [];
  if (showYou) {
    rows.push({ who: 'Вы', mark: <span className="w-1 h-4 rounded-full bg-ink" />, p: question.you });
  }
  rows.push({ who: 'Группа', mark: <span className="w-4 h-2 rounded-full bg-accent" />, p: question.crowd, note: `среднее ${question.participants} участников` });
  rows.push({ who: 'Модель', mark: <span className="size-3 rotate-45 rounded-[2px] border-2 border-ink-2" />, p: question.model, note: 'прогноз при закрытии приёма' });

  // Очки каждого и лучший результат — ему достанется метка «ближе всех».
  for (const row of rows) {
    row.points = calculatePoints(row.p, question.outcome);
  }
  const bestPoints = Math.max(...rows.map((row) => row.points));

  return (
    <>
      <SectionTitle title="Кто был ближе к исходу" />
      <div className="mt-4">
        <Ruler crowd={question.crowd} you={showYou ? question.you : null} model={question.model} outcome={question.outcome} heightClass="h-2" showLabels />
      </div>
      <div className="mt-3 rounded-2xl border border-line divide-y divide-line">
        {rows.map((row) => (
          <div key={row.who} className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-4 flex justify-center">{row.mark}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold flex items-center gap-2">
                {row.who}
                {row.points === bestPoints && <span className="h-5 px-1.5 rounded-md bg-pos-soft text-pos text-[11px] font-semibold inline-flex items-center">ближе всех</span>}
              </div>
              {row.note && <div className="text-[12px] text-ink-2">{row.note}</div>}
            </div>
            <span className="w-14 text-right text-[17px] font-semibold tabular-nums">{row.p} %</span>
            <span className="w-14 text-right"><Points value={row.points} className="text-[20px] md:text-[22px]" /></span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[14px] leading-5 text-ink-2 text-pretty">{getVerdict(question)}</p>
    </>
  );
}

// Вывод под таблицей: кто точнее — группа или модель, и на сколько очков.
function getVerdict(question) {
  const crowdPoints = calculatePoints(question.crowd, question.outcome);
  const modelPoints = calculatePoints(question.model, question.outcome);
  if (crowdPoints >= modelPoints) {
    return `Группа оказалась ближе модели на ${crowdPoints - modelPoints} очков.`;
  }
  return `Модель оказалась ближе группы на ${modelPoints - crowdPoints} очков.`;
}

// Формула очков и подстановка в неё вашего прогноза.
// className — фон и отступы: на телефоне серая плашка, в боковой панели — без фона.
export function ScoreFormula({ question, role, className = 'rounded-2xl bg-paper-2 p-4' }) {
  const showYou = role !== 'guest' && question.you != null;
  const p = formatNumber(question.you / 100, 2);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-[15px] font-semibold">
        <Sigma className="size-[18px]" strokeWidth={2} aria-hidden="true" />
        {showYou ? 'Как посчитаны ваши очки' : 'Как считаются очки'}
      </div>
      <div className="mt-3 text-[20px] font-semibold tracking-[-0.01em] tabular-nums">V = 100 · (1 − 2 · (p − o)²)</div>
      {showYou && (
        <div className="mt-1 text-[14px] text-ink-2 tabular-nums">
          100 · (1 − 2 · ({p} − {question.outcome})²) = <Points value={calculatePoints(question.you, question.outcome)} className="text-[14px]" />
        </div>
      )}
      <p className="mt-3 text-[13px] leading-[19px] text-ink-2 text-pretty">
        p — ваш прогноз, o — исход: 1, если «Да», 0, если «Нет». Диапазон от −100 до +100, ответ «50 %» всегда даёт 50.
      </p>
    </div>
  );
}
