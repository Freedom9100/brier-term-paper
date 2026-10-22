import { useState } from 'react';
import { ArrowDownWideNarrow } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Search } from '../components/Search';
import { Tabs } from '../components/Tabs';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { PayoffExample } from '../components/Payoff';
import { QuestionItem } from '../components/QuestionItem';
import { CalibrationPanel, CategoriesPanel, ScorePanel, TopForecastersPanel } from '../components/SidePanels';
import { categories, questions } from '../data/mock';

// Вкладки статусов и какой статус вопроса каждой соответствует.
const STATUS_TABS = [{ label: 'Открытые' }, { label: 'Приём закрыт' }, { label: 'Разрешённые' }];
const STATUS_BY_TAB = ['open', 'closed', 'resolved'];

// Лента вопросов — главная страница.
// Телефон: шапка, вкладки, фильтры, список. Планшет: заголовок с поиском.
// Десктоп: список в белой панели, справа колонка панелей.
export function FeedPage({ role }) {
  // Номер открытой вкладки: 0 — открытые, 1 — приём закрыт, 2 — разрешённые.
  const [activeTab, setActiveTab] = useState(0);
  const shownQuestions = Object.values(questions).filter((question) => question.status === STATUS_BY_TAB[activeTab]);
  const openCount = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <>
      <MobileHeader role={role} />
      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          {role === 'guest' && <GuestHero />}

          <div className={`hidden md:flex items-center justify-between gap-6 px-6 pb-5 lg:px-0 lg:items-end ${role === 'guest' ? 'pt-7 lg:pt-10' : 'pt-8 lg:pt-0'}`}>
            <h1 className={`${role === 'guest' ? 'text-[24px] leading-[30px] lg:text-[34px] lg:leading-10' : 'text-[34px] leading-10'} font-semibold tracking-[-0.035em]`}>Вопросы</h1>
            <Search className="w-[340px] lg:hidden" />
            <span className="hidden lg:inline text-[14px] text-ink-2 tabular-nums">{openCount} открытых</span>
          </div>

          <section className="lg:bg-paper lg:rounded-[24px] lg:border lg:border-line lg:overflow-hidden">
            <Tabs items={STATUS_TABS} activeIndex={activeTab} onSelect={setActiveTab} className="lg:px-6" />
            <FilterRow />
            <div className="border-t border-line">
              {shownQuestions.map((question) => (
                <QuestionItem key={question.id} question={question} role={role} />
              ))}
            </div>
          </section>
        </div>

        <aside className={`hidden lg:flex w-[376px] shrink-0 flex-col gap-5 ${role === 'guest' ? '' : 'pt-[60px]'}`}>
          {role === 'guest' && <TopForecastersPanel />}
          {role !== 'guest' && <CalibrationPanel />}
          <CategoriesPanel />
          <ScorePanel />
        </aside>
      </div>
    </>
  );
}

// Фильтры над списком: сортировка и категории. На узком экране листаются вбок.
function FilterRow() {
  return (
    <div className="flex gap-2 px-4 py-3 md:px-6 overflow-x-auto [scrollbar-width:none]">
      <Chip icon={ArrowDownWideNarrow} withChevron>Скоро закрытие</Chip>
      <span className="w-px my-1.5 bg-line shrink-0" />
      <Chip active>Все</Chip>
      {categories.slice(0, 5).map((category) => (
        <Chip key={category.name}>{category.name}</Chip>
      ))}
    </div>
  );
}

// Приветствие для гостя. Сетка перестраивается по ширине:
// телефон — всё в столбик, пример очков между текстом и кнопками;
// планшет (md:) — пример очков переезжает во вторую колонку справа;
// десктоп (lg:) — заголовок над обеими колонками, всё в белой панели.
function GuestHero() {
  return (
    <section className="px-4 pt-3 pb-6 md:px-6 md:pt-10 md:pb-8 md:border-b md:border-line md:grid md:grid-cols-[1fr_312px] md:gap-x-8 md:items-center lg:grid-cols-[1fr_300px] lg:p-8 lg:bg-paper lg:rounded-[24px] lg:border lg:items-start">
      <h1 className="text-[30px] leading-[34px] md:text-[38px] md:leading-[44px] lg:col-span-2 lg:text-[34px] lg:leading-10 font-semibold tracking-[-0.035em] text-balance">
        Ставьте вероятность, а&nbsp;не «да» или «нет»
      </h1>
      <p className="mt-3 md:mt-4 md:text-[16px] md:leading-6 lg:text-[15px] lg:leading-[22px] text-[15px] leading-[22px] text-ink-2 text-pretty">
        Отвечайте на вопросы о будущем числом от 1 до 99 %. Когда станет известен исход, правило Брайера начислит очки за точность, а кривая калибровки покажет, где вы слишком уверены.
      </p>
      <PayoffExample className="mt-5 rounded-2xl border border-line p-4 md:mt-0 md:col-start-2 md:row-start-1 md:row-span-3 lg:row-start-2 lg:row-span-2 lg:mt-4 lg:rounded-none lg:border-0 lg:border-l lg:p-0 lg:pl-8" />
      <div className="mt-5 md:mt-6 flex gap-2">
        <Button to="/register" size="lg" className="flex-1 md:flex-none">Зарегистрироваться</Button>
        <Button to="/login" variant="secondary" size="lg">Войти</Button>
      </div>
    </section>
  );
}
