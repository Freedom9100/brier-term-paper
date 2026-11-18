import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { MobileHeader } from '../components/MobileHeader';
import { Search } from '../components/Search';
import { Tabs } from '../components/Tabs';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { PayoffExample } from '../components/Payoff';
import { QuestionItem } from '../components/QuestionItem';
import { CategoriesPanel, ScorePanel } from '../components/SidePanels';
import { getJson } from '../api';

const STATUS_TABS = [{ label: 'Открытые' }, { label: 'Приём закрыт' }, { label: 'Разрешённые' }];
const STATUS_BY_TAB = ['open', 'closed', 'resolved'];

export function FeedPage({ role, person }) {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [feed, setFeed] = useState(null);
  const query = params.toString();
  const activeTab = Math.max(0, STATUS_BY_TAB.indexOf(params.get('status')));
  const openCount = categories.reduce((sum, category) => sum + category.count, 0);
  const currentFeed = feed?.query === query ? feed : null;

  useEffect(() => {
    const controller = new AbortController();
    getJson('/api/categories/', controller.signal).then(setCategories).catch(() => {
      if (!controller.signal.aborted) setCategoryError(true);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getJson(`/api/questions/?${query}`, controller.signal)
      .then((questions) => setFeed({ query, questions }))
      .catch((error) => {
        if (!controller.signal.aborted) setFeed({ query, error: error.message });
      });
    return () => controller.abort();
  }, [query]);

  function setFilter(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    if (next.toString() !== query) setParams(next);
  }

  return (
    <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
      <div className="flex min-w-0 flex-1 flex-col">
        <FeedHeader role={role} person={person}>
          <div className="flex items-center justify-between gap-6 px-4 py-4 md:px-6 lg:px-0 lg:pt-0">
            <h1 className="hidden md:block text-[30px] font-semibold tracking-[-0.035em]">Вопросы</h1>
            <Search className="w-full md:w-[340px] lg:hidden" />
            {!categoryError && <span className="hidden lg:inline text-sm text-ink-2">{openCount} открытых</span>}
          </div>

          <div className="border-b border-line lg:bg-paper lg:rounded-t-[24px] lg:border lg:border-b-0 lg:overflow-hidden">
            <Tabs items={STATUS_TABS} activeIndex={activeTab} onSelect={(index) => setFilter('status', STATUS_BY_TAB[index])} className="lg:px-6" />
            <FilterRow categories={categories} category={params.get('category') ?? ''} sort={params.get('sort') ?? 'closing'} onChange={setFilter} />
            {categoryError && <p role="alert" className="px-4 pb-3 text-sm text-neg">Не удалось загрузить категории.</p>}
          </div>
        </FeedHeader>
        {role === 'guest' && <GuestHero />}
        <section className="lg:bg-paper lg:rounded-b-[24px] lg:border lg:border-line lg:overflow-hidden">
          <FeedResults feed={currentFeed} />
        </section>
      </div>
      <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-[60px]">
        {categories.length > 0 && <CategoriesPanel categories={categories} />}
        <ScorePanel />
      </aside>
    </div>
  );
}

function FeedHeader({ role, person, children }) {
  const [header, setHeader] = useState(null);

  useEffect(() => {
    if (!header) return;

    const page = document.scrollingElement;
    let lastPosition = page.scrollTop;
    let offset = 0;

    function updateHeader() {
      // Отскок у края страницы не должен менять направление шапки.
      const maxScroll = page.scrollHeight - page.clientHeight;
      const position = Math.max(0, Math.min(page.scrollTop, maxScroll));
      const delta = position - lastPosition;
      lastPosition = position;

      // Сдвиг ограничен высотой блока и расстоянием от начала страницы.
      offset = Math.max(0, Math.min(header.offsetHeight, position, offset + delta));
      header.style.setProperty('--feed-header-y', `${-offset}px`);
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, [header]);

  return (
    <div
      ref={setHeader}
      className="max-md:sticky max-md:top-0 max-md:z-20 max-md:bg-paper max-md:translate-y-[var(--feed-header-y,0px)] max-md:has-[:focus-visible]:translate-y-0"
    >
      <MobileHeader role={role} person={person} />
      {children}
    </div>
  );
}

function FeedResults({ feed }) {
  if (!feed) return <p role="status" className="p-6 text-ink-2">Загружаем вопросы…</p>;
  if (feed.error) return <p role="alert" className="p-6 text-neg">{feed.error}</p>;
  if (feed.questions.length === 0) return <p className="p-6 text-ink-2">Вопросов с такими условиями нет.</p>;
  return feed.questions.map((question) => <QuestionItem key={question.id} question={question} />);
}

function FilterRow({ categories, category, sort, onChange }) {
  return (
    <div className="flex gap-2 px-4 py-3 md:px-6 overflow-x-auto">
      <select aria-label="Сортировка вопросов" value={sort} onChange={(event) => onChange('sort', event.target.value)}
        className="h-9 shrink-0 rounded-full border border-line-2 bg-paper px-3.5 text-sm">
        <option value="closing">Скоро закрытие</option>
        <option value="new">Сначала новые</option>
        <option value="popular">Больше участников</option>
      </select>
      <span className="w-px my-1.5 bg-line shrink-0" />
      <Chip active={!category} onClick={() => onChange('category', '')}>Все</Chip>
      {categories.map((item) => (
        <Chip key={item.slug} active={item.slug === category} onClick={() => onChange('category', item.slug)}>{item.name}</Chip>
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
    <section className="px-4 pt-3 pb-6 md:order-first md:px-6 md:pt-10 md:pb-8 md:border-b md:border-line md:grid md:grid-cols-[1fr_312px] md:gap-x-8 md:items-center lg:grid-cols-[1fr_300px] lg:p-8 lg:bg-paper lg:rounded-[24px] lg:border lg:items-start">
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
