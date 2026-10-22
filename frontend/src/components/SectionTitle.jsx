// Заголовок раздела страницы: слева название, справа мелкая подпись или ссылка.
export function SectionTitle({ title, right, className = '' }) {
  return (
    <div className={`${className} flex items-baseline justify-between gap-3`}>
      <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h2>
      {right}
    </div>
  );
}
