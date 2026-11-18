import { ChevronDown } from 'lucide-react';

// Чип — круглая кнопка фильтра в ленте: «Все», «Учёба», «Скоро закрытие ▾».
// active — выбран ли чип (чёрный), icon — иконка слева, withChevron — стрелка вниз справа.
export function Chip({ children, active = false, icon: Icon, withChevron = false, onClick }) {
  const colors = active ? 'bg-ink text-white border-ink' : 'bg-paper text-ink border-line-2 hover:bg-paper-2';
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`${colors} inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-[14px] font-medium whitespace-nowrap shrink-0`}
    >
      {Icon && <Icon className="size-4" strokeWidth={2} aria-hidden="true" />}
      {children}
      {withChevron && <ChevronDown className="size-4" strokeWidth={2} aria-hidden="true" />}
    </button>
  );
}
