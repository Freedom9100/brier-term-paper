// Пустое состояние: картинка-линейка с крестиком, заголовок, пояснение и кнопка.
// action — кнопка или ссылка под текстом (необязательно).
export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center text-center px-8 py-12">
      <svg width="120" height="72" viewBox="0 0 120 72" aria-hidden="true" className="mb-5">
        <rect x="0" y="33" width="120" height="6" rx="3" className="fill-line" />
        <rect x="0" y="33" width="60" height="6" rx="3" className="fill-accent" fillOpacity=".25" />
        <circle cx="60" cy="36" r="13" fill="white" strokeWidth="2.5" className="stroke-ink" />
        <path d="M55 31l10 10M65 31 55 41" strokeWidth="2.2" strokeLinecap="round" className="stroke-ink" />
      </svg>
      <div className="text-[17px] font-semibold">{title}</div>
      <p className="mt-1.5 text-[14px] leading-5 text-ink-2 max-w-[280px]">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
