const rate = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

// Те же данные, что на калибровочной кривой, но числами — таблицей.
// highlight — уверенность строки, которую выделить жирным.
export function CalibrationTable({ data, highlight }) {
  return (
    <div className="text-[14px] tabular-nums">
      <div className="grid grid-cols-3 pb-2 text-[12px] font-semibold text-ink-2 border-b border-line">
        <span>Уверенность</span>
        <span className="text-right">Сбылось</span>
        <span className="text-right">Прогнозов</span>
      </div>
      {data.map((point) => (
        <div key={point.p} className={`grid grid-cols-3 py-2 border-b border-line ${point.p === highlight ? 'font-semibold' : ''}`}>
          <span>{rate.format(point.p)} %</span>
          <span className="text-right">{rate.format(point.f)} %</span>
          <span className="text-right text-ink-2">{point.n}</span>
        </div>
      ))}
    </div>
  );
}
