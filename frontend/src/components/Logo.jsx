// Логотип: тёмный квадрат с диагональю и синей точкой — знак калибровки.
// Размеры задаются классами Tailwind, поэтому могут меняться по ширине экрана:
// markClass — размер знака (например, 'size-7 md:size-9'), wordClass — размер слова.
// showWord — показывать ли слово «брайер» рядом со знаком.
export function Logo({ markClass = 'size-7', wordClass = 'text-[20px]', showWord = true }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`${markClass} shrink-0`}>
        <rect width="28" height="28" rx="8" className="fill-ink" />
        <path d="M7 21 21 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="18.6" cy="14.6" r="3.1" strokeWidth="1.4" className="fill-accent stroke-ink" />
      </svg>
      {showWord && <span className={`${wordClass} font-bold tracking-[-0.03em] leading-none`}>брайер</span>}
    </span>
  );
}
