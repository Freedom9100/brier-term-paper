import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

// Ссылка «← Все вопросы» над страницей на планшете и десктопе
// (на телефоне её роль играет стрелка в MobileHeader).
// Планшет — полоса высотой 56 px с линией снизу и кнопкой right справа.
// Десктоп — просто ссылка над белой панелью, кнопка right скрыта.
export function BackBar({ to, label, right }) {
  return (
    <div className="hidden md:flex h-14 px-6 items-center justify-between border-b border-line lg:h-5 lg:px-0 lg:mb-4 lg:border-0">
      <Link to={to} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        {label}
      </Link>
      {right && <div className="lg:hidden">{right}</div>}
    </div>
  );
}
