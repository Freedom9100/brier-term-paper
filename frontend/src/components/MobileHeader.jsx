import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { Avatar } from './Avatar';
import { Button, IconButton } from './Button';

// Верхняя полоса на телефоне. На каждой странице своя, поэтому её рисует
// сама страница, а не лейаут. От 768 px (md:hidden) её нет.
// Два вида:
//   backTo задан — стрелка «назад», заголовок по центру, справа кнопка right;
//   backTo не задан — логотип, справа right или стандартные кнопки по роли.
export function MobileHeader({ role, person, title, backTo, backIcon = ArrowLeft, right }) {
  if (backTo) {
    return (
      <header className="md:hidden h-14 px-2 flex items-center border-b border-line bg-paper">
        <IconButton to={backTo} icon={backIcon} label="Назад" />
        <span className="flex-1 text-center text-[16px] font-semibold">{title}</span>
        {right ?? <span className="size-10" />}
      </header>
    );
  }

  return (
    <header className="md:hidden h-14 px-4 flex items-center justify-between bg-paper">
      <Link to="/">
        <Logo markClass="size-7" wordClass="text-[19px]" />
      </Link>
      {right ?? <DefaultActions role={role} person={person} />}
    </header>
  );
}

// Кнопки справа по умолчанию: поиск, а дальше вход для гостя или аватар.
function DefaultActions({ role, person }) {
  return (
    <div className="flex items-center gap-1">
      {role === 'guest' && <Button to="/login" size="sm" className="ml-1">Войти</Button>}
      {person && (
        <Link to="/me" className="ml-1" aria-label="Кабинет">
          <Avatar person={person} size={32} />
        </Link>
      )}
    </div>
  );
}
