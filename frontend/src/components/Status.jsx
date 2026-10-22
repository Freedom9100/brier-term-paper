import { CircleCheck, CircleX, Hourglass, Lock } from 'lucide-react';

// Метка статуса — маленькая плашка: «Приём закрыт», «Исход: Да», «Отклонён»…
// Для каждого статуса: классы цвета, текст и иконка (null — без иконки).
const STATUSES = {
  open: { classes: 'bg-paper-2 text-ink-2', text: 'Приём открыт', icon: null },
  soon: { classes: 'bg-paper-2 text-ink', text: 'Скоро закрытие', icon: Hourglass },
  closed: { classes: 'bg-paper-2 text-ink', text: 'Приём закрыт', icon: Lock },
  yes: { classes: 'bg-ink text-white', text: 'Исход: Да', icon: CircleCheck },
  no: { classes: 'bg-ink text-white', text: 'Исход: Нет', icon: CircleX },
  moderation: { classes: 'bg-paper-2 text-ink', text: 'На модерации', icon: Hourglass },
  rejected: { classes: 'bg-neg-soft text-neg', text: 'Отклонён', icon: CircleX },
  published: { classes: 'bg-paper-2 text-ink', text: 'Опубликован', icon: CircleCheck },
  resolved: { classes: 'bg-paper-2 text-ink', text: 'Разрешён', icon: CircleCheck },
};

// kind — ключ из STATUSES; label — свой текст вместо стандартного (необязательно).
export function Status({ kind, label }) {
  const status = STATUSES[kind];
  const Icon = status.icon;
  return (
    <span className={`${status.classes} inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[12px] font-semibold whitespace-nowrap`}>
      {Icon && <Icon className="size-3.5" strokeWidth={2.25} aria-hidden="true" />}
      {label ?? status.text}
    </span>
  );
}
