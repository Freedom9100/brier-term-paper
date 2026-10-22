import { useParams } from 'react-router';
import { MobileHeader } from '../components/MobileHeader';
import { BackBar } from '../components/BackBar';
import { ProfileIdentity } from '../components/ProfileIdentity';
import { StatsRow } from '../components/StatsRow';
import { SectionTitle } from '../components/SectionTitle';
import { CalibrationChart } from '../components/CalibrationChart';
import { CalibrationTable } from '../components/CalibrationTable';
import { ForecastRow, HiddenForecastsNote } from '../components/ForecastRow';
import { Panel, TopForecastersPanel } from '../components/SidePanels';
import { calibration, leaderboard, myRow, people, resolvedForecasts } from '../data/mock';

// Белая панель на десктопе; на телефоне и планшете — без рамки.
const DESKTOP_PANEL = 'lg:bg-paper lg:rounded-[24px] lg:border lg:border-line';

// Профиль участника: имя, место, три числа, калибровка, разрешённые прогнозы.
// Открыт всем, в том числе гостю. Прогнозы по открытым вопросам не показываются.
export function ProfilePage() {
  // useParams достаёт имя пользователя из адреса /users/alina.s.
  const { username } = useParams();
  const person = people[username];
  // Строка рейтинга участника: ищем среди лучших и среди строки текущего пользователя.
  const allRows = [...leaderboard, myRow];
  const row = allRows.find((leader) => leader.username === username);

  if (!person || !row) {
    return <p className="p-6 text-[17px]">Участник не найден.</p>;
  }

  const forecasts = resolvedForecasts[username] ?? [];

  return (
    <>
      <MobileHeader backTo="/rating" title="Профиль" />
      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          <BackBar to="/rating" label="Рейтинг" />
          <section className={`px-4 pt-4 md:px-6 md:pt-8 lg:p-0 ${DESKTOP_PANEL}`}>
            <div className="lg:px-8 lg:pt-8 lg:pb-2">
              <ProfileIdentity person={person} row={row} />
            </div>
            <StatsRow row={row} className="mt-5 md:mt-6 border-y border-line lg:mt-0 lg:border-0 lg:px-8" cellClass="py-4 md:py-5" numberClass="text-[32px] md:text-[40px]" />
          </section>

          {/* Планшет: калибровка и прогнозы — две колонки. Десктоп: две панели друг под другом. */}
          <div className="md:flex md:gap-8 md:items-start md:px-6 md:pt-8 md:pb-10 lg:block lg:p-0">
            <section className={`px-4 py-6 border-b border-line md:p-0 md:border-0 md:w-[330px] md:shrink-0 lg:w-auto lg:mt-5 lg:p-8 ${DESKTOP_PANEL}`}>
              <CalibrationSection data={calibration[username]} count={row.count} />
            </section>
            <section className={`px-4 pt-6 md:p-0 md:flex-1 md:min-w-0 lg:mt-5 lg:px-8 lg:pt-7 lg:pb-4 ${DESKTOP_PANEL}`}>
              <SectionTitle title="Разрешённые прогнозы" right={<span className="text-[15px] text-ink-2 tabular-nums">{row.count}</span>} />
              <HiddenForecastsNote className="mt-3 rounded-xl bg-paper-2 px-3.5 py-2.5 lg:hidden" />
              <div className="mt-1">
                {forecasts.map((forecast) => (
                  <ForecastRow key={forecast.title} forecast={forecast} />
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-9">
          <TopForecastersPanel highlight={username} />
          <Panel className="p-5">
            <HiddenForecastsNote className="" />
          </Panel>
        </aside>
      </div>
    </>
  );
}

// Калибровка участника. Телефон: текст и кривая. Планшет: ещё таблица под кривой.
// Десктоп (lg:grid): кривая слева, текст и таблица справа.
function CalibrationSection({ data, count }) {
  return (
    <>
      <SectionTitle title="Калибровка" right={<span className="text-[13px] text-ink-2">по {count} прогнозам</span>} />
      {!data && <p className="mt-1.5 text-[14px] leading-5 text-ink-2">Кривая появится, когда наберётся достаточно разрешённых прогнозов.</p>}
      {data && (
        <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-x-8 lg:mt-4">
          <p className="mt-1.5 text-[14px] leading-5 lg:text-[15px] lg:leading-[22px] text-ink-2 lg:text-ink text-pretty lg:col-start-2 lg:row-start-1 lg:mt-0 lg:pt-6">
            Точки близко к диагонали: уверенность совпадает с тем, как часто прогнозы сбываются.
          </p>
          <div className="mt-4 lg:mt-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <CalibrationChart data={data} width={358} height={310} labelAt={11} labelAbove />
          </div>
          <div className="hidden md:block mt-5 lg:col-start-2 lg:row-start-2">
            <CalibrationTable data={data} />
          </div>
        </div>
      )}
    </>
  );
}
