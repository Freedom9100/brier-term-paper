import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { LogOut, Plus, Shield } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { CalibrationSection } from '../components/CalibrationSection';
import { StatsRow } from '../components/StatsRow';
import { ProfileIdentity } from '../components/ProfileIdentity';
import { Avatar } from '../components/Avatar';
import { Button, IconButton } from '../components/Button';
import { Tabs } from '../components/Tabs';
import { ActiveForecastRow } from '../components/ActiveForecastRow';
import { ResolvedForecastList } from '../components/ResolvedForecastList';
import { MyQuestionsList } from '../components/MyQuestionsList';
import { ModerationPanel, ScorePanel } from '../components/SidePanels';
import { getJson } from '../api';

const DESKTOP_PANEL = 'lg:bg-paper lg:rounded-[24px] lg:border lg:border-line';

// Личный кабинет. tab — открытая вкладка, приходит из маршрута в App.jsx:
// 'active' (/me), 'resolved' (/me/resolved) или 'questions' (/me/questions).
export function CabinetPage({ role, person, tab, onSignOut, signingOut }) {
  // Кабинет есть только у вошедших: гостя отправляем на страницу входа.
  if (role === 'guest') {
    return <Navigate to="/login" replace />;
  }

  return <MemberCabinet person={person} role={role} tab={tab} onSignOut={onSignOut} signingOut={signingOut} />;
}

function MemberCabinet({ role, person, tab, onSignOut, signingOut }) {
  const [myQuestions, setMyQuestions] = useState(null);
  const [questionError, setQuestionError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setQuestionError(false);
    getJson('/api/questions/mine/', controller.signal).then(setMyQuestions).catch(() => {
      if (!controller.signal.aborted) setQuestionError(true);
    });
    return () => controller.abort();
  }, [tab, person.username]);

  const [activeForecasts, setActiveForecasts] = useState(null);
  const [forecastError, setForecastError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setForecastError(false);
    getJson('/api/forecasts/mine/active/', controller.signal).then(setActiveForecasts).catch(() => {
      if (!controller.signal.aborted) setForecastError(true);
    });
    return () => controller.abort();
  }, [tab, person.username]);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setProfileError(false);
    getJson(`/api/users/${encodeURIComponent(person.username)}/`, controller.signal).then(setProfile).catch(() => {
      if (!controller.signal.aborted) setProfileError(true);
    });
    return () => controller.abort();
  }, [tab, person.username]);

  const tabs = [
    { label: 'Активные', count: activeForecasts?.length, to: '/me' },
    { label: 'Разрешённые', count: profile?.stats.count, to: '/me/resolved' },
    { label: 'Мои вопросы', count: myQuestions?.length, to: '/me/questions' },
  ];
  const tabIndex = ['active', 'resolved', 'questions'].indexOf(tab);

  return (
    <>
      <MobileHeader right={<AccountActions role={role} onSignOut={onSignOut} signingOut={signingOut} variant="ghost" />} />
      <FullTop role={role} person={person} profile={profile} onSignOut={onSignOut} signingOut={signingOut} className={tab === 'active' ? '' : 'hidden lg:flex'} />
      <CompactTop person={person} showAskButton={tab === 'questions'} className={tab === 'active' ? 'hidden' : 'lg:hidden'} />

      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          {tab === 'active' && profile && (
            <section className={`px-4 py-6 md:px-6 lg:p-8 ${DESKTOP_PANEL}`}>
              <CalibrationSection data={profile.calibration} count={profile.stats.count} />
            </section>
          )}
          <section className={`mt-1 md:mt-0 lg:overflow-hidden ${tab === 'active' ? 'lg:mt-5' : ''} ${DESKTOP_PANEL}`}>
            <Tabs items={tabs} activeIndex={tabIndex} className="lg:px-6" />
            <div className="px-4 md:px-6">
              {tab === 'active' && <ActiveForecastList forecasts={activeForecasts} error={forecastError} />}
              {tab === 'resolved' && <ResolvedForecastList forecasts={profile?.forecasts} error={profileError} />}
              {tab === 'questions' && <MyQuestionsList questions={myQuestions} error={questionError} />}
            </div>
          </section>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5">
          {tab === 'questions' && <ModerationPanel />}
          {tab !== 'questions' && <ScorePanel />}
        </aside>
      </div>
    </>
  );
}

// Кнопки «Админ-панель» (только админу) и «Выйти». На телефоне — в шапке,
// на планшете — рядом с именем, в рамке (variant="secondary").
function AccountActions({ role, variant, onSignOut, signingOut }) {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      {role === 'admin' && <IconButton href="/admin/" icon={Shield} label="Админ-панель" variant={variant} />}
      <IconButton onClick={onSignOut} disabled={signingOut} icon={LogOut} label="Выйти" variant={variant} />
    </div>
  );
}

// Имя и действия аккаунта. На телефоне и планшете используется на вкладке «Активные».
function FullTop({ role, person, profile, onSignOut, signingOut, className }) {
  return (
    <section className={`${className} px-4 pt-4 md:px-6 md:pt-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-0 lg:pt-10`}>
      <ProfileIdentity
        person={person}
        row={profile?.stats}
        totalRanked={profile?.total_ranked}
        nameClass="text-[26px] leading-8 md:text-[30px] md:leading-9 lg:text-[34px] lg:leading-10"
        actions={<div className="hidden md:block lg:hidden"><AccountActions role={role} onSignOut={onSignOut} signingOut={signingOut} variant="secondary" /></div>}
      />
      {profile && <StatsRow row={profile.stats} className="mt-5 border-y border-line lg:mt-0 lg:border-0 lg:w-[440px] lg:shrink-0"
        cellClass="py-4 lg:py-1" numberClass="text-[28px]" />}
    </section>
  );
}

// Короткий верх для вкладок «Разрешённые» и «Мои вопросы» на телефоне и планшете.
function CompactTop({ person, showAskButton, className }) {
  return (
    <section className={`${className} flex items-center gap-3 md:gap-4 px-4 pt-2 pb-4 md:px-6 md:pt-8 md:pb-5`}>
      <Avatar person={person} size={48} />
      <div className="flex-1 min-w-0">
        <div className="text-[17px] md:text-[19px] font-semibold tracking-[-0.01em] break-all">{person.name}</div>
      </div>
      {/* Кнопку прячет обёртка: у самой кнопки свой display (inline-flex), он спорил бы с hidden. */}
      {showAskButton && (
        <div className="hidden md:block">
          <Button to="/questions/new" icon={Plus} variant="secondary">Задать новый вопрос</Button>
        </div>
      )}
    </section>
  );
}

function ActiveForecastList({ forecasts, error }) {
  if (error) return <p role="alert" className="py-4 text-sm text-neg">Не удалось загрузить прогнозы. Обновите страницу.</p>;
  if (!forecasts) return <p role="status" className="py-4 text-sm text-ink-2">Загружаем прогнозы…</p>;
  if (forecasts.length === 0) return <p className="py-4 text-sm text-ink-2">У вас пока нет активных прогнозов.</p>;
  return forecasts.map((question) => <ActiveForecastRow key={question.id} question={question} />);
}
