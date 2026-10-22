import { formatNumber } from '../utils/score';

// Три главных числа участника в строку: средние очки, средний Брайер,
// число разрешённых прогнозов. Стоит в профиле, кабинете и рейтинге,
// везде своего размера, поэтому размеры и рамки приходят пропсами:
// className — рамка всей строки, cellClass — отступы ячейки, numberClass — размер чисел.
export function StatsRow({ row, className = '', cellClass = 'py-4', numberClass = 'text-[32px]' }) {
  const stats = [
    { value: formatNumber(row.avg), label: 'средние очки' },
    { value: formatNumber(row.brier, 3), label: 'средний Брайер' },
    { value: row.count, label: 'разрешённых', labelEnd: ' прогнозов' },
  ];

  return (
    <div className={`${className} flex`}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={`flex-1 ${cellClass} ${index > 0 ? 'pl-4 md:pl-5 border-l border-line' : ''}`}>
          <div className={`${numberClass} leading-none font-semibold tracking-[-0.035em] tabular-nums`}>{stat.value}</div>
          <div className="mt-1.5 md:mt-2 text-[12px] md:text-[13px] text-ink-2">
            {stat.label}
            {/* На телефоне «разрешённых», от планшета — «разрешённых прогнозов». */}
            {stat.labelEnd && <span className="hidden md:inline">{stat.labelEnd}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
