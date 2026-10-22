// Гистограмма прогнозов: сколько участников поставили 1–10 %, 11–20 % … 91–99 %.
// bins — десять чисел (по одному на столбец), you — ваш прогноз, mean — мнение группы.
//
// Все координаты — в процентах от размеров рисунка. Поэтому график тянется
// на любую ширину и высоту, а текст и толщина линий остаются в пикселях.
// Высоту задаёт класс: 132 px на телефоне, 168 px от планшета.
//
// Разметка по высоте: сверху 14 % — место для подписи «вы 70»,
// посередине 72 % — столбцы, снизу 14 % — подписи шкалы.
const TOP = 14;
const CHART = 72;
const GAP = 1.2; // промежуток между столбцами, % ширины
const BAR_WIDTH = (100 - GAP * 9) / 10; // 10 столбцов и 9 промежутков

// Номер столбца для прогноза: 1–10 → 0, 11–20 → 1 … 91–99 → 9.
function getBinIndex(p) {
  return Math.min(9, Math.floor((p - 1) / 10));
}

export function Histogram({ bins, you, mean }) {
  const maxCount = Math.max(...bins);
  const youBin = you != null ? getBinIndex(you) : null;

  return (
    <svg className="block w-full h-[132px] md:h-[168px] overflow-visible font-sans" role="img" aria-label="Распределение прогнозов участников">
      {/* Линия основания */}
      <line x1="0" x2="100%" y1={`${TOP + CHART}%`} y2={`${TOP + CHART}%`} className="stroke-line" />

      {/* Столбцы. Самый высокий — во всю высоту, остальные пропорционально, не ниже 2 %. */}
      {bins.map((count, index) => {
        const barHeight = Math.max(2, (count / maxCount) * CHART);
        return (
          <rect
            key={index}
            x={`${index * (BAR_WIDTH + GAP)}%`}
            y={`${TOP + CHART - barHeight}%`}
            width={`${BAR_WIDTH}%`}
            height={`${barHeight}%`}
            rx="3"
            className="fill-accent"
            fillOpacity={index === youBin ? 1 : 0.82}
          />
        );
      })}

      {/* Мнение группы — синий треугольник под осью. Вложенный <svg> нужен,
          чтобы поставить фигуру в точку, заданную процентами. */}
      {mean != null && (
        <svg x={`${mean}%`} y={`${TOP + CHART}%`} overflow="visible">
          <path d="M0 3 l4 6 h-8z" className="fill-accent" />
        </svg>
      )}

      {/* Ваш прогноз — чёрная вертикальная линия с подписью сверху. */}
      {you != null && (
        <>
          <line x1={`${you}%`} x2={`${you}%`} y1={`${TOP - 3}%`} y2={`${TOP + CHART + 3}%`} strokeWidth="2" className="stroke-ink" />
          <text x={`${you}%`} y={`${TOP}%`} dy="-7" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-ink">
            вы {you}
          </text>
        </>
      )}

      {/* Подписи шкалы. dy="-2" — сдвиг вверх на 2 px от нижнего края. */}
      <text x="0" y="100%" dy="-2" fontSize="11" className="fill-ink-2">1</text>
      <text x="25%" y="100%" dy="-2" textAnchor="middle" fontSize="11" className="fill-ink-2">25</text>
      <text x="50%" y="100%" dy="-2" textAnchor="middle" fontSize="11" className="fill-ink-2">50</text>
      <text x="75%" y="100%" dy="-2" textAnchor="middle" fontSize="11" className="fill-ink-2">75</text>
      <text x="100%" y="100%" dy="-2" textAnchor="end" fontSize="11" className="fill-ink-2">99</text>
    </svg>
  );
}
