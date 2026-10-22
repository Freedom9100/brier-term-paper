import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { CalibrationChart } from './CalibrationChart';
import { Avatar } from './Avatar';
import { calibration, categories, currentUser, leaderboard } from '../data/mock';
import { formatNumber } from '../utils/score';

// Белые панели боковой колонки десктопа. На телефоне и планшете их нет:
// колонку прячет сама страница классом hidden lg:flex.

// Белая карточка со скруглением — основа каждой панели.
export function Panel({ children, className = '' }) {
  return <div className={`${className} bg-paper rounded-[24px] border border-line`}>{children}</div>;
}

// Ссылка «Весь рейтинг →» в правом углу заголовка панели.
export function ArrowLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-[13px] font-semibold whitespace-nowrap hover:underline">
      {children}
      <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
    </Link>
  );
}

export function CalibrationPanel() {
  return (
    <Panel className="p-5">
      <SectionTitle title="Ваша калибровка" right={<ArrowLink to="/me">Кабинет</ArrowLink>} />
      <p className="mt-1 text-[14px] leading-5 text-ink-2">При уверенности 90 % сбывается 64 %.</p>
      <div className="mt-3">
        <CalibrationChart data={calibration[currentUser.username]} highlight={90} width={318} height={250} />
      </div>
    </Panel>
  );
}

export function CategoriesPanel() {
  return (
    <Panel className="p-5">
      <SectionTitle title="Категории" />
      <div className="mt-2">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between py-2.5 border-b border-line last:border-b-0 text-[15px]">
            <span className="font-medium">{category.name}</span>
            <span className="text-ink-2 tabular-nums">{category.count} открытых</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function ScorePanel() {
  return (
    <Panel className="p-5">
      <SectionTitle title="Как считаются очки" />
      <div className="mt-3 text-[18px] font-semibold tabular-nums">V = 100 · (1 − 2 · (p − o)²)</div>
      <p className="mt-2 text-[13px] leading-[19px] text-ink-2 text-pretty">
        p — прогноз, o — исход (1 или 0). От −100 до +100. «50 %» всегда даёт 50, поэтому рейтинг — по среднему, а не по сумме.
      </p>
    </Panel>
  );
}

// Пять лучших прогнозистов. highlight — имя пользователя, чью строку выделить серым.
export function TopForecastersPanel({ highlight }) {
  return (
    <Panel className="px-5 pt-5 pb-3 overflow-hidden">
      <SectionTitle title="Лучшие прогнозисты" right={<ArrowLink to="/rating">Весь рейтинг</ArrowLink>} />
      <div className="mt-2">
        {leaderboard.slice(0, 5).map((row) => (
          <MiniLeaderRow key={row.username} row={row} highlighted={row.username === highlight} />
        ))}
      </div>
    </Panel>
  );
}

// Короткая строка рейтинга: место, аватар, имя, средние очки.
export function MiniLeaderRow({ row, highlighted = false }) {
  const isMe = row.username === currentUser.username;
  return (
    <Link
      to={`/users/${row.username}`}
      className={`flex items-center gap-3 py-2.5 ${highlighted ? '-mx-5 px-5 bg-paper-2' : 'border-b border-line last:border-b-0'}`}
    >
      <span className={`w-5 text-[14px] font-semibold tabular-nums ${row.place <= 3 ? 'text-ink' : 'text-ink-2'}`}>{row.place}</span>
      <Avatar person={row} size={32} />
      <span className="flex-1 min-w-0 text-[14px] font-semibold truncate">
        {row.name}
        {highlighted && isMe && <span className="font-normal text-ink-2"> · вы</span>}
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.02em] tabular-nums">{formatNumber(row.avg)}</span>
    </Link>
  );
}
