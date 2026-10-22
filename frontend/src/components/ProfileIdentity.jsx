import { Trophy } from 'lucide-react';
import { Avatar } from './Avatar';
import { totalRanked } from '../data/mock';

// Имя участника, @логин, место в рейтинге и аватар. Общий для профиля и кабинета.
// Телефон: имя слева, аватар 72 px справа, место — отдельной строкой.
// Планшет и десктоп (md:): аватар 84 px слева (order-first), место — в строку с логином.
// actions — кнопки справа (в кабинете: админ-панель и выход), необязательно.
export function ProfileIdentity({ person, row, actions, nameClass = 'text-[26px] leading-8 md:text-[30px] md:leading-9' }) {
  return (
    <div className="flex items-start md:items-center justify-between gap-4">
      <div className="flex items-start md:items-center justify-between md:justify-start gap-4 md:gap-5 min-w-0 flex-1 md:flex-none">
        <Avatar person={person} size={72} className="order-last md:order-first md:size-[84px] md:text-[28px]" />
        <div className="min-w-0">
          <h1 className={`${nameClass} font-semibold tracking-[-0.03em] md:tracking-[-0.035em]`}>{person.name}</h1>
          <div className="mt-1 md:mt-1.5 md:flex md:items-center md:gap-3 text-[15px] text-ink-2">
            <span>@{person.username}</span>
            <span className="mt-3 md:mt-0 flex md:inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
              <Trophy className="size-4" strokeWidth={2} aria-hidden="true" />
              {row.place} место из {totalRanked}
            </span>
          </div>
        </div>
      </div>
      {actions}
    </div>
  );
}
