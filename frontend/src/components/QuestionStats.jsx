import { SectionTitle } from './SectionTitle';
import { Histogram } from './Histogram';
import { Legend } from './Ruler';
import { Points, Percent } from './Points';
import { Comparison } from './Comparison';
import { calculatePoints, formatParticipants } from '../utils/score';

// Числа и графики страницы вопроса.

// Пока исход неизвестен: мнение группы крупно, число участников, гистограмма.
export function CrowdBlock({ question, role }) {
  const showYou = role !== 'guest' && question.you != null;
  const [count, participantLabel] = formatParticipants(question.participants).split(' ');
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[13px] font-semibold text-ink-2">Мнение группы</div>
          <div className={`mt-1 text-[72px] md:text-[88px] leading-[0.9] font-semibold tracking-[-0.045em] tabular-nums ${question.status === 'closed' ? 'text-ink-2' : 'text-accent'}`}>
            <Percent value={question.crowd} />
          </div>
        </div>
        <div className="text-right pb-1">
          <div className="text-[32px] leading-none font-semibold tracking-[-0.03em] tabular-nums">{count}</div>
          <div className="mt-1 text-[13px] text-ink-2">{participantLabel}</div>
        </div>
      </div>
      <div className="mt-5">
        <Histogram bins={question.histogram} you={showYou ? question.you : null} mean={question.crowd} />
      </div>
      <div className="mt-3">
        <Legend showYou={showYou} />
      </div>
    </>
  );
}

// Исход известен: «Да» крупно и ваши очки; рядом (от планшета) — сравнение.
export function OutcomeBlock({ question, role }) {
  const showYou = role !== 'guest' && question.you != null;
  return (
    <div className="md:flex md:gap-10">
      <div className="flex items-end justify-between md:block md:w-[188px] lg:w-[200px] md:shrink-0">
        <div>
          <div className="text-[13px] font-semibold text-ink-2">Исход</div>
          <div className="mt-1 md:mt-2 text-[72px] md:text-[88px] leading-[0.9] font-semibold tracking-[-0.045em] md:tracking-[-0.05em]">
            {question.outcome === 1 ? 'Да' : 'Нет'}
          </div>
        </div>
        {showYou && (
          <div className="text-right pb-1 md:text-left md:mt-6 md:pb-0">
            <div className="text-[13px] text-ink-2">ваши очки</div>
            <Points value={calculatePoints(question.you, question.outcome)} className="text-[40px] md:text-[44px] leading-none tracking-[-0.035em]" />
          </div>
        )}
      </div>
      <div className="mt-7 md:mt-0 flex-1 min-w-0">
        <Comparison question={question} role={role} />
      </div>
    </div>
  );
}

// Исход известен: как распределились прогнозы.
export function DistributionBlock({ question, role }) {
  const showYou = role !== 'guest' && question.you != null;
  return (
    <>
      <SectionTitle title="Как распределились прогнозы" right={<span className="text-[13px] text-ink-2 tabular-nums whitespace-nowrap">среднее {question.crowd} %</span>} />
      <div className="mt-4">
        <Histogram bins={question.histogram} you={showYou ? question.you : null} mean={question.crowd} />
      </div>
      <div className="mt-3">
        <Legend showYou={showYou} />
      </div>
    </>
  );
}
