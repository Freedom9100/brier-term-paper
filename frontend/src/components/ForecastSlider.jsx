// Риски под шкалой каждые 10 %; на 0, 50 и 100 — длиннее и темнее.
const TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export function ForecastSlider({ value, crowd, onChange, disabled }) {
  return (
    <div className="relative select-none">
      <div className="relative h-12 rounded-xl focus-within:ring-2 focus-within:ring-ink">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-line" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-ink" style={{ width: `${value}%` }} />
        {crowd != null && (
          <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: `${crowd}%` }}>
            <span className="text-[11px] font-semibold text-accent leading-3 tabular-nums">{crowd}</span>
            <span className="mt-0.5 w-[3px] h-7 rounded-full bg-accent ring-2 ring-paper" />
          </div>
        )}
        <span
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-8 rounded-full bg-paper border-[2.5px] border-ink shadow-[0_2px_8px_rgb(11_11_12/0.18)]"
          style={{ left: `${value}%` }}
          aria-hidden="true"
        />
        <input type="range" min={1} max={99} step={1} value={value} disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Вероятность" aria-valuetext={`${value} %`}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" />
      </div>
      <div className="relative h-3 mt-0.5">
        {TICKS.map((tick) => (
          <span
            key={tick}
            className={`absolute top-0 w-px ${tick % 50 === 0 ? 'h-2.5 bg-ink-2' : 'h-1.5 bg-line-2'}`}
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>
      <div className="relative h-4 text-[11px] text-ink-2 tabular-nums">
        <span className="absolute left-0">1</span>
        <span className="absolute left-1/4 -translate-x-1/2">25</span>
        <span className="absolute left-1/2 -translate-x-1/2">50</span>
        <span className="absolute left-3/4 -translate-x-1/2">75</span>
        <span className="absolute right-0">99</span>
      </div>
    </div>
  );
}
