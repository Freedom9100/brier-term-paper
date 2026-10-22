import { Navigate } from 'react-router';
import { LogOut, Plus, Shield } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { ProfileIdentity } from '../components/ProfileIdentity';
import { StatsRow } from '../components/StatsRow';
import { Avatar } from '../components/Avatar';
import { Button, IconButton } from '../components/Button';
import { Tabs } from '../components/Tabs';
import { SectionTitle } from '../components/SectionTitle';
import { CalibrationChart } from '../components/CalibrationChart';
import { CalibrationTable } from '../components/CalibrationTable';
import { ActiveForecastRow } from '../components/ActiveForecastRow';
import { ForecastRow } from '../components/ForecastRow';
import { MyQuestionRow } from '../components/MyQuestionRow';
import { MyPlaceNearbyPanel, ModerationPanel, ScorePanel } from '../components/SidePanels';
import { calibration, currentUser, myQuestions, myRow, questions, resolvedForecasts } from '../data/mock';
import { formatNumber } from '../utils/score';

const DESKTOP_PANEL = 'lg:bg-paper lg:rounded-[24px] lg:border lg:border-line';

// Личный кабинет. tab — открытая вкладка, приходит из маршрута в App.jsx:
// 'active' (/me), 'resolved' (/me/resolved) или 'questions' (/me/questions).
export function CabinetPage({ role, tab }) {
  // Кабинет есть только у вошедших: гостя отправляем на страницу входа.
  if (role === 'guest') {
    return <Navigate to="/login" replace />;
  }

  const activeQuestions = Object.values(questions).filter((question) => question.you != null && question.status !== 'resolved');
  const myResolved = resolvedForecasts[currentUser.username];
  const tabs = [
    { label: 'Активные', count: activeQuestions.length, to: '/me' },
    { label: 'Разрешённые', count: myRow.count, to: '/me/resolved' },
    { label: 'Мои вопросы', count: myQuestions.length, to: '/me/questions' },
  ];
  const tabIndex = ['active', 'resolved', 'questions'].indexOf(tab);

  return (
    <>
      <MobileHeader right={<AccountActions role={role} variant="ghost" />} />
      <FullTop role={role} className={tab === 'active' ? '' : 'hidden lg:flex'} />
      <CompactTop showAskButton={tab === 'questions'} className={tab === 'active' ? 'hidden' : 'lg:hidden'} />

      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          {tab === 'active' && <CalibrationSection />}
          <section className={`mt-1 md:mt-0 lg:overflow-hidden ${tab === 'active' ? 'lg:mt-5' : ''} ${DESKTOP_PANEL}`}>
            <Tabs items={tabs} activeIndex={tabIndex} className="lg:px-6" />
            <div className="px-4 md:px-6">
              {tab === 'active' && activeQuestions.map((question) => <ActiveForecastRow key={question.id} question={question} />)}
              {tab === 'resolved' && myResolved.map((forecast) => <ForecastRow key={forecast.title} forecast={forecast} />)}
              {tab === 'questions' && <MyQuestionsList />}
            </div>
          </section>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5">
          {tab === 'questions' && <ModerationPanel />}
          {tab !== 'questions' && <MyPlaceNearbyPanel myRow={myRow} />}
          {tab !== 'questions' && <ScorePanel />}
        </aside>
      </div>
    </>
  );
}

// Кнопки «Админ-панель» (только админу) и «Выйти». На телефоне — в шапке,
// на планшете — рядом с именем, в рамке (variant="secondary").
function AccountActions({ role, variant }) {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      {role === 'admin' && <IconButton href="/admin/" icon={Shield} label="Админ-панель" variant={variant} />}
      <IconButton to="/" icon={LogOut} label="Выйти" variant={variant} />
    </div>
  );
}

// Полный верх: имя, место, три числа. Телефон и планшет — только на вкладке
// «Активные»; десктоп — всегда, имя слева и числа справа в одну строку.
function FullTop({ role, className }) {
  return (
    <section className={`${className} px-4 pt-4 md:px-6 md:pt-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-0 lg:pt-10`}>
      <ProfileIdentity
        person={currentUser}
        row={myRow}
        nameClass="text-[26px] leading-8 md:text-[30px] md:leading-9 lg:text-[34px] lg:leading-10"
        actions={<div className="hidden md:block lg:hidden"><AccountActions role={role} variant="secondary" /></div>}
      />
      <StatsRow row={myRow} className="mt-5 md:mt-6 border-y border-line lg:mt-0 lg:border-0 lg:w-[520px] lg:shrink-0" cellClass="py-4 md:py-5 lg:py-1" numberClass="text-[32px] md:text-[40px] lg:text-[34px]" />
    </section>
  );
}

// Короткий верх для вкладок «Разрешённые» и «Мои вопросы» на телефоне и планшете.
function CompactTop({ showAskButton, className }) {
  return (
    <section className={`${className} flex items-center gap-3 md:gap-4 px-4 pt-2 pb-4 md:px-6 md:pt-8 md:pb-5`}>
      <Avatar person={currentUser} size={48} />
      <div className="flex-1 min-w-0">
        <div className="text-[17px] md:text-[19px] font-semibold tracking-[-0.01em]">{currentUser.name}</div>
        <div className="text-[13px] text-ink-2 tabular-nums">{myRow.place} место · {formatNumber(myRow.avg)} средние очки</div>
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

// Калибровка с выводом. Телефон: вывод и кривая. Планшет и десктоп:
// слева вывод и таблица, справа кривая.
function CalibrationSection() {
  const data = calibration[currentUser.username];
  return (
    <section className={`px-4 pt-6 pb-6 border-b border-line md:px-6 md:pt-8 md:pb-8 lg:p-8 ${DESKTOP_PANEL}`}>
      <SectionTitle title="Ваша калибровка" right={<span className="text-[13px] text-ink-2">по {myRow.count} прогнозам</span>} />
      <div className="mt-3 md:mt-4 md:flex md:gap-8 md:items-start">
        <div className="md:flex-1 md:min-w-0">
          <div className="rounded-2xl bg-ink text-white p-4 md:p-5">
            <div className="text-[20px] leading-[26px] font-semibold tracking-[-0.02em] text-balance">При уверенности 90 % ваши прогнозы сбываются в 64 % случаев</div>
            <p className="mt-2 text-[13px] leading-[19px] text-white/70 text-pretty">Это переуверенность: правый край кривой ниже диагонали. Там, где хочется поставить 90, честнее 65–70.</p>
          </div>
          <div className="hidden md:block mt-5">
            <CalibrationTable data={data} highlight={90} />
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:w-[340px] md:shrink-0">
          <CalibrationChart data={data} highlight={90} width={340} height={320} />
        </div>
      </div>
    </section>
  );
}

// Вкладка «Мои вопросы»: список и подсказка про отклонённые вопросы.
function MyQuestionsList() {
  return (
    <div className="pt-2">
      {myQuestions.map((question) => <MyQuestionRow key={question.title} question={question} />)}
      <div className="pt-3 pb-8 md:pb-10 lg:hidden">
        <Button to="/questions/new" icon={Plus} variant="secondary" size="lg" full className="md:hidden">Задать новый вопрос</Button>
        <p className="mt-2.5 md:mt-0 text-center md:text-left text-[13px] leading-[18px] text-ink-2 text-pretty">
          Отклонённый вопрос не редактируется — создайте новый с учётом причины.
        </p>
      </div>
    </div>
  );
}
