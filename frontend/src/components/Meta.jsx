// Строка мелких сведений с иконками: «👥 128  💬 14  🕑 23 дня».
// items — массив { icon, text }, icon — компонент иконки из lucide-react.
export function Meta({ items, className = '' }) {
  return (
    <div className={`${className} flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[13px] text-ink-2`}>
      {/* key — номер в списке: список постоянный, а тексты могут совпасть (два «0»). */}
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <span key={index} className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="tabular-nums">{item.text}</span>
          </span>
        );
      })}
    </div>
  );
}
