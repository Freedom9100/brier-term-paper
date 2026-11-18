import { useEffect, useState } from 'react';
import { ListChecks } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { LeaderHead, LeaderRow } from '../components/LeaderRow';
import { StatsRow } from '../components/StatsRow';
import { SectionTitle } from '../components/SectionTitle';
import { Panel, ArrowLink } from '../components/SidePanels';
import { formatParticipants } from '../utils/score';
import { getJson } from '../api';

export function RatingPage({ role, person }) {
  const [rating, setRating] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getJson('/api/rating/', controller.signal).then(setRating).catch(() => {
      if (!controller.signal.aborted) setError(true);
    });
    return () => controller.abort();
  }, []);

  const ownRow = rating?.rows.find((row) => row.username === person?.username);
  return (
    <>
      <MobileHeader role={role} person={person} />
      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          <div className="px-4 pt-3 md:px-6 md:pt-8 lg:px-0 lg:pt-0 lg:mb-5 lg:flex lg:items-end lg:justify-between">
            <h1 className="text-[30px] leading-9 md:text-[34px] md:leading-10 font-semibold tracking-[-0.035em]">Рейтинг</h1>
            {rating && <span className="hidden lg:inline text-sm text-ink-2 tabular-nums">{formatParticipants(rating.rows.length)}</span>}
          </div>
          <section className="lg:bg-paper lg:rounded-[24px] lg:border lg:border-line lg:overflow-hidden">
            {error && <p role="alert" className="p-5 text-sm text-neg">Не удалось загрузить рейтинг. Обновите страницу.</p>}
            {!error && !rating && <p role="status" className="p-5 text-sm text-ink-2">Загружаем рейтинг…</p>}
            {rating && <RatingResults rating={rating} username={person?.username} />}
          </section>
        </div>
        {rating && (
          <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-[60px]">
            {person && <MyPlacePanel row={ownRow} total={rating.rows.length} minimum={rating.minimum} />}
            <RulesPanel minimum={rating.minimum} />
          </aside>
        )}
      </div>
    </>
  );
}

function RatingResults({ rating, username }) {
  return (
    <>
      <p className="px-4 pt-2 pb-4 md:px-6 lg:pt-5 text-sm text-ink-2">
        Место определяется по средним очкам. Для участия нужно хотя бы {rating.minimum} разрешённых прогнозов.
      </p>
      {rating.rows.length === 0 ? (
        <p className="px-4 pb-5 md:px-6 text-sm text-ink-2">Пока никто не набрал нужное число прогнозов.</p>
      ) : (
        <>
          <LeaderHead />
          {rating.rows.map((row) => <LeaderRow key={row.username} row={row} isMe={row.username === username} />)}
          <CoinRow />
        </>
      )}
    </>
  );
}

function CoinRow() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-t border-line text-[13px] text-ink-2">
      <span className="text-[15px] font-semibold tabular-nums text-ink">50,0</span>
      <span className="flex-1 border-t border-dashed border-line-2" />
      <span>уровень монетки — «50 %» на всё</span>
    </div>
  );
}

function MyPlacePanel({ row, total, minimum }) {
  return (
    <Panel className="p-5">
      <SectionTitle title="Ваше место" right={<ArrowLink to="/me">Кабинет</ArrowLink>} />
      {row ? (
        <>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[56px] leading-none font-semibold tabular-nums">{row.place}</span>
            <span className="text-sm text-ink-2">из {total}</span>
          </div>
          <StatsRow row={row} className="mt-5 border-t border-line" cellClass="pt-4" numberClass="text-2xl" />
        </>
      ) : <p className="mt-2 text-sm text-ink-2">Появится после {minimum} разрешённых прогнозов.</p>}
    </Panel>
  );
}

function RulesPanel({ minimum }) {
  return (
    <Panel className="p-5">
      <SectionTitle title="Как устроен рейтинг" />
      <div className="mt-3 text-[18px] font-semibold tabular-nums">V = 100 · (1 − 2 · (p − o)²)</div>
      <p className="mt-2 text-[13px] leading-[19px] text-ink-2 text-pretty">
        Очки за вопрос — от −100 до +100. Место — по среднему, а не по сумме: иначе выгодно отвечать «50 %» на всё.
      </p>
      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-paper-2 px-3.5 py-2.5 text-[13px] leading-[18px]">
        <ListChecks className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        <span>В рейтинг попадают с <span className="font-semibold">{minimum} разрешённых</span> прогнозов.</span>
      </div>
    </Panel>
  );
}
