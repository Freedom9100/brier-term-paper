import { Link } from 'react-router';
import { Logo } from './Logo';

// Подвал. Телефон — всё в столбик, снизу большой отступ, чтобы последнюю
// строку не закрывала нижняя панель навигации. Планшет — в строку с переносом.
// Десктоп — одна строка по ширине контейнера 1184 px.
export function Footer() {
  return (
    <footer className="border-t border-line bg-paper px-4 pt-7 pb-[104px] md:px-6 md:py-8 lg:px-0 lg:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-x-8 lg:flex-nowrap lg:gap-10 lg:max-w-[1184px] lg:mx-auto lg:px-6">
        <Link to="/" className="self-start md:self-auto">
          <Logo markClass="size-6" wordClass="text-[17px]" />
        </Link>
        <nav className="flex gap-5 text-[14px] font-medium text-ink-2">
          <Link to="/" className="hover:text-ink">Вопросы</Link>
          <Link to="/rating" className="hover:text-ink">Рейтинг</Link>
          <Link to="/questions/new" className="hover:text-ink">Задать вопрос</Link>
        </nav>
        <div className="text-[13px] text-ink-2 md:w-full lg:w-auto lg:ml-auto">
          Курсовой проект · Эмиль Тухватуллин, 2026
        </div>
      </div>
    </footer>
  );
}
