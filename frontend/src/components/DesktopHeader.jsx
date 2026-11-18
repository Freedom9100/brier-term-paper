import { Link, NavLink } from 'react-router';
import { LogOut, Plus, Shield } from 'lucide-react';
import { Logo } from './Logo';
import { Search } from './Search';
import { Avatar } from './Avatar';
import { Button, IconButton } from './Button';

// Пункт меню. NavLink сам знает, открыта ли сейчас его страница,
// и передаёт это в функцию className как isActive: активный пункт подчёркнут.
function MenuLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `h-16 inline-flex items-center border-b-2 text-[15px] font-semibold ${isActive ? 'border-ink text-ink' : 'border-transparent text-ink-2 hover:text-ink'}`
      }
    >
      {children}
    </NavLink>
  );
}

// Правая часть шапки: гостю — вход и регистрация, остальным — кабинет и выход.
function HeaderActions({ role, person, onSignOut, signingOut }) {
  if (role === 'guest') {
    return (
      <>
        <Button to="/login" variant="secondary">Войти</Button>
        <Button to="/register">Регистрация</Button>
      </>
    );
  }
  return (
    <>
      {/* Админ-панель — страница Django, а не React, поэтому обычная ссылка <a>. */}
      {role === 'admin' && (
        <a href="/admin/" className="whitespace-nowrap inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink-2 hover:text-ink">
          <Shield className="size-4" strokeWidth={2} aria-hidden="true" />
          Админ-панель
        </a>
      )}
      <Button to="/questions/new" icon={Plus}>Задать вопрос</Button>
      <Link to="/me" className="inline-flex items-center gap-2.5 pl-2">
        <Avatar person={person} size={36} />
        <span className="text-[14px] font-semibold">Кабинет</span>
      </Link>
      <IconButton onClick={onSignOut} disabled={signingOut} icon={LogOut} label="Выйти" size={36} />
    </>
  );
}

// Шапка десктопа. Видна только от 1024 px (lg:block): на телефоне и планшете
// её заменяет AppNav.
export function DesktopHeader({ role, person, onSignOut, signingOut }) {
  return (
    <header className="hidden lg:block h-16 border-b border-line bg-paper">
      <div className="max-w-[1184px] mx-auto px-6 h-full flex items-center gap-8">
        <Link to="/" className="shrink-0">
          <Logo markClass="size-[30px]" wordClass="text-[21px]" />
        </Link>
        <nav className="flex items-center gap-7 h-full">
          <MenuLink to="/">Вопросы</MenuLink>
          <MenuLink to="/rating">Рейтинг</MenuLink>
        </nav>
        <Search className="flex-1 max-w-[340px] ml-2" />
        <div className="ml-auto flex items-center gap-3">
          <HeaderActions role={role} person={person} onSignOut={onSignOut} signingOut={signingOut} />
        </div>
      </div>
    </header>
  );
}
