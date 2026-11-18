import { Link } from 'react-router';
import { Avatar } from './Avatar';
import { formatNumber } from '../utils/score';

// Строки таблицы рейтинга. На телефоне Брайер и число прогнозов — мелкой
// строкой под именем; от планшета (md:) — отдельные столбцы, а под именем @логин.

const ROW = 'flex items-center gap-3 md:gap-4 px-4 md:px-6';

export function LeaderHead() {
  return (
    <div className={`${ROW} pb-3 md:pt-3 text-[12px] font-semibold text-ink-2 border-b border-line`}>
      <span className="flex-1">Место и участник</span>
      <span className="hidden md:block w-24 text-right">Брайер</span>
      <span className="hidden md:block w-24 text-right">Прогнозов</span>
      <span className="md:w-28 text-right">Средние очки</span>
    </div>
  );
}

// isMe — строка текущего пользователя: серый фон и приписка «· вы».
export function LeaderRow({ row, isMe = false }) {
  return (
    <Link to={`/users/${encodeURIComponent(row.username)}`} className={`${ROW} py-3 ${isMe ? 'bg-paper-2' : 'border-b border-line hover:bg-canvas'}`}>
      <span className={`w-7 text-[15px] font-semibold tabular-nums ${row.place <= 3 ? 'text-ink' : 'text-ink-2'}`}>{row.place}</span>
      <Avatar person={row} size={40} />
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold truncate">
          {row.name}
          {isMe && <span className="font-normal text-ink-2"> · вы</span>}
        </div>
        <div className="md:hidden text-[13px] text-ink-2 tabular-nums">Брайер {formatNumber(row.brier, 3)} · {row.count} прогнозов</div>
        <div className="hidden md:block text-[13px] text-ink-2 truncate">@{row.username}</div>
      </div>
      <span className="hidden md:block w-24 text-right text-[15px] tabular-nums">{formatNumber(row.brier, 3)}</span>
      <span className="hidden md:block w-24 text-right text-[15px] text-ink-2 tabular-nums">{row.count}</span>
      <span className="md:w-28 text-right text-[24px] leading-none font-semibold tracking-[-0.03em] tabular-nums">{formatNumber(row.avg, 2)}</span>
    </Link>
  );
}
