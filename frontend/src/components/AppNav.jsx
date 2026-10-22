import { Link, NavLink } from 'react-router';
import { House, LogIn, Plus, Trophy, User } from 'lucide-react';
import { Logo } from './Logo';

// Навигация телефона и планшета — один компонент, разная раскладка:
// телефон — панель внизу экрана, у большого пальца;
// планшет (md:) — колонка слева, те же пункты в том же порядке;
// десктоп (lg:) — скрыта, её заменяет DesktopHeader.

// Пункт навигации. У NavLink и className, и содержимое могут быть функциями:
// React Router передаёт в них isActive — открыта ли сейчас страница пункта.
function NavItem({ to, icon: Icon, end = false, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center gap-1 pt-2 md:flex-none md:w-[68px] md:py-2 ${isActive ? 'text-ink' : 'text-ink-2'}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="size-6" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
          <span className={`text-[11px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{children}</span>
        </>
      )}
    </NavLink>
  );
}

// Чёрная плитка «Задать вопрос» посередине панели.
function AskButton() {
  return (
    <Link to="/questions/new" className="flex-1 flex justify-center pt-1.5 md:flex-none md:pt-0 md:my-1.5" aria-label="Задать вопрос">
      <span className="h-9 w-14 md:h-10 rounded-xl bg-ink text-white inline-flex items-center justify-center">
        <Plus className="size-[22px]" strokeWidth={2.25} aria-hidden="true" />
      </span>
    </Link>
  );
}

export function AppNav({ role }) {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-10 h-[76px] pb-4 flex border-t border-line bg-paper/95 backdrop-blur
        md:sticky md:top-0 md:h-screen md:w-[84px] md:shrink-0 md:flex-col md:items-center md:pt-5 md:pb-0 md:border-t-0 md:border-r md:bg-paper
        lg:hidden"
    >
      <Link to="/" className="hidden md:block" aria-label="На главную">
        <Logo markClass="size-[34px]" showWord={false} />
      </Link>
      <div className="flex-1 flex md:flex-none md:flex-col md:items-center md:gap-2 md:mt-7">
        <NavItem to="/" icon={House} end>Вопросы</NavItem>
        <NavItem to="/rating" icon={Trophy}>Рейтинг</NavItem>
        {role === 'guest' && <NavItem to="/login" icon={LogIn}>Войти</NavItem>}
        {role !== 'guest' && <AskButton />}
        {role !== 'guest' && <NavItem to="/me" icon={User}>Кабинет</NavItem>}
      </div>
    </nav>
  );
}
