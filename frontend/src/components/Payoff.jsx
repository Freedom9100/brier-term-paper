import { Points } from './Points';
import { calculatePoints } from '../utils/score';

// Сколько очков даст прогноз p при каждом исходе. Две серые плашки рядом.
export function Payoff({ p }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-xl bg-paper-2 px-3.5 py-2.5">
        <div className="text-[12px] text-ink-2">Если исход «Да»</div>
        <Points value={calculatePoints(p, 1)} className="text-[20px] leading-7" />
      </div>
      <div className="rounded-xl bg-paper-2 px-3.5 py-2.5">
        <div className="text-[12px] text-ink-2">Если исход «Нет»</div>
        <Points value={calculatePoints(p, 0)} className="text-[20px] leading-7" />
      </div>
    </div>
  );
}

// Блок-пример для гостя: что будет, если ответить 70 %.
// className — рамка и отступы, их задаёт место, где стоит блок.
export function PayoffExample({ className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold">Пример: вы ответили 70 %</span>
        <span className="text-[12px] text-ink-2">очки за прогноз</span>
      </div>
      <div className="mt-3">
        <Payoff p={70} />
      </div>
      <p className="mt-3 text-[12px] leading-[17px] text-ink-2 text-pretty">
        Ответ «50 %» всегда даёт 50 очков. Больше — только за уверенность, которая оправдалась.
      </p>
    </div>
  );
}
