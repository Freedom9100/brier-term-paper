// Логотип: тёмный квадрат с диагональю и синей точкой — знак калибровки.
// size — размер знака в пикселях, showWord — показывать ли слово «брайер» рядом.
export function Logo({ size = 28, showWord = true, wordClass = 'text-[20px]' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" className="shrink-0">
        <rect width="28" height="28" rx="8" className="fill-ink" />
        <path d="M7 21 21 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="18.6" cy="14.6" r="3.1" strokeWidth="1.4" className="fill-accent stroke-ink" />
      </svg>
      {showWord && <span className={`${wordClass} font-bold tracking-[-0.03em] leading-none`}>брайер</span>}
    </span>
  );
}
