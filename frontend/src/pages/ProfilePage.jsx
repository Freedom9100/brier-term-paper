import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MobileHeader } from '../components/MobileHeader';
import { BackBar } from '../components/BackBar';
import { ProfileIdentity } from '../components/ProfileIdentity';
import { StatsRow } from '../components/StatsRow';
import { SectionTitle } from '../components/SectionTitle';
import { CalibrationSection } from '../components/CalibrationSection';
import { ResolvedForecastList } from '../components/ResolvedForecastList';
import { HiddenForecastsNote } from '../components/ForecastRow';
import { Panel, TopForecastersPanel } from '../components/SidePanels';
import { NotFoundPage } from './NotFoundPage';
import { getJson } from '../api';

const DESKTOP_PANEL = 'lg:bg-paper lg:rounded-[24px] lg:border lg:border-line';

export function ProfilePage({ role, person: account }) {
  const { username } = useParams();
  return <ParticipantProfile key={username} username={username} role={role} account={account} />;
}

function ParticipantProfile({ username, role, account }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getJson(`/api/users/${encodeURIComponent(username)}/`, controller.signal)
      .then(setProfile)
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError);
      });
    return () => controller.abort();
  }, [username]);

  if (error?.status === 404) return <NotFoundPage role={role} person={account} />;
  if (error) return <p role="alert" className="p-6 text-sm text-neg">Не удалось загрузить профиль. Обновите страницу.</p>;
  if (!profile) return <p role="status" className="p-6 text-sm text-ink-2">Загружаем профиль…</p>;

  return (
    <>
      <MobileHeader backTo="/rating" title="Профиль" />
      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          <BackBar to="/rating" label="Рейтинг" />
          <section className={`px-4 pt-4 md:px-6 md:pt-8 lg:p-0 ${DESKTOP_PANEL}`}>
            <div className="lg:px-8 lg:pt-8 lg:pb-2">
              <ProfileIdentity person={profile.person} row={profile.stats} totalRanked={profile.total_ranked} />
            </div>
            <StatsRow row={profile.stats} className="mt-5 md:mt-6 border-y border-line lg:mt-0 lg:border-0 lg:px-8"
              cellClass="py-4 md:py-5" numberClass="text-[28px] md:text-[32px]" />
          </section>

          <div className="md:flex md:gap-8 md:items-start md:px-6 md:pt-8 md:pb-10 lg:block lg:p-0">
            <section className={`px-4 py-6 border-b border-line md:p-0 md:border-0 md:w-[330px] md:shrink-0 lg:w-auto lg:mt-5 lg:p-8 ${DESKTOP_PANEL}`}>
              <CalibrationSection data={profile.calibration} count={profile.stats.count} />
            </section>
            <section className={`px-4 pt-6 md:p-0 md:flex-1 md:min-w-0 lg:mt-5 lg:px-8 lg:pt-7 lg:pb-4 ${DESKTOP_PANEL}`}>
              <SectionTitle title="Разрешённые прогнозы" right={<span className="text-sm text-ink-2">{profile.stats.count}</span>} />
              <HiddenForecastsNote className="mt-3 rounded-xl bg-paper-2 px-3.5 py-2.5 lg:hidden" />
              <ResolvedForecastList forecasts={profile.forecasts} emptyText="У участника пока нет разрешённых прогнозов." />
            </section>
          </div>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-9">
          <TopForecastersPanel rows={profile.leaders} highlight={username} />
          <Panel className="p-5"><HiddenForecastsNote className="" /></Panel>
        </aside>
      </div>
    </>
  );
}
