import { ListChecks } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { LeaderHead, LeaderRow } from '../components/LeaderRow';
import { StatsRow } from '../components/StatsRow';
import { SectionTitle } from '../components/SectionTitle';
import { Panel, ArrowLink } from '../components/SidePanels';
import { leaderboard, myRow, totalRanked } from '../data/mock';
import { formatParticipants } from '../utils/score';

// Рейтинг участников по средним очкам за разрешённый вопрос.
// Вошедший пользователь видит и свою строку, даже если он не в первой десятке.
export function RatingPage({ role }) {
  const showMe = role !== 'guest';
  const lastShown = leaderboard.length; // сколько мест показано сверху

  return (
    <>
      <MobileHeader role={role} />
      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          <div className="px-4 pt-3 md:px-6 md:pt-8 lg:px-0 lg:pt-0 lg:mb-5 lg:flex lg:items-end lg:justify-between">
            <h1 className="text-[30px] leading-9 md:text-[34px] md:leading-10 font-semibold tracking-[-0.035em]">Рейтинг</h1>
            <span className="hidden lg:inline text-[14px] text-ink-2 tabular-nums">{formatParticipants(totalRanked)}</span>
          </div>

          <section className="lg:bg-paper lg:rounded-[24px] lg:border lg:border-line lg:overflow-hidden">
            <p className="px-4 pt-1.5 pb-5 md:px-6 md:pt-2 lg:pt-5 lg:pb-2 max-w-[60ch] text-[14px] leading-5 md:text-[15px] md:leading-[22px] lg:text-[14px] lg:leading-5 text-ink-2 text-pretty">
              Средние очки за разрешённый вопрос. В рейтинге — {formatParticipants(totalRanked)}, у которых 10 и больше разрешённых прогнозов.
            </p>
            <LeaderHead />
            {leaderboard.map((row) => (
              <LeaderRow key={row.username} row={row} />
            ))}
            {showMe && (
              <>
                <GapRow from={lastShown + 1} to={myRow.place - 1} />
                <div className="border-y border-line">
                  <LeaderRow row={myRow} isMe />
                </div>
                <GapRow from={myRow.place + 1} to={totalRanked} />
              </>
            )}
            {!showMe && <GapRow from={lastShown + 1} to={totalRanked} />}
            <CoinRow />
          </section>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-[60px]">
          {showMe && <MyPlacePanel />}
          <RulesPanel />
        </aside>
      </div>
    </>
  );
}

// Строка-пропуск между частями таблицы: «12–13 · ещё 2 участника».
function GapRow({ from, to }) {
  return (
    <div className="px-4 md:px-6 py-2 text-[13px] text-ink-2 tabular-nums">
      {from}–{to} · ещё {formatParticipants(to - from + 1)}
    </div>
  );
}

// Нижняя строка: 50 очков — уровень «монетки», ответа «50 %» на всё.
function CoinRow() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-t border-line text-[13px] text-ink-2">
      <span className="text-[15px] font-semibold tabular-nums text-ink">50,0</span>
      <span className="flex-1 border-t border-dashed border-line-2" />
      <span>уровень монетки — «50 %» на всё</span>
    </div>
  );
}

function MyPlacePanel() {
  return (
    <Panel className="p-5">
      <SectionTitle title="Ваше место" right={<ArrowLink to="/me">Кабинет</ArrowLink>} />
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[56px] leading-none font-semibold tracking-[-0.045em] tabular-nums">{myRow.place}</span>
        <span className="text-[15px] text-ink-2">из {totalRanked}</span>
      </div>
      <StatsRow row={myRow} className="mt-5 border-t border-line" cellClass="pt-4" numberClass="text-[24px]" />
    </Panel>
  );
}

function RulesPanel() {
  return (
    <Panel className="p-5">
      <SectionTitle title="Как устроен рейтинг" />
      <div className="mt-3 text-[18px] font-semibold tabular-nums">V = 100 · (1 − 2 · (p − o)²)</div>
      <p className="mt-2 text-[13px] leading-[19px] text-ink-2 text-pretty">
        Очки за вопрос — от −100 до +100. Место — по среднему, а не по сумме: иначе выгодно отвечать «50 %» на всё.
      </p>
      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-paper-2 px-3.5 py-2.5 text-[13px] leading-[18px]">
        <ListChecks className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        <span>В рейтинг попадают с <span className="font-semibold">10 разрешённых</span> прогнозов.</span>
      </div>
    </Panel>
  );
}
