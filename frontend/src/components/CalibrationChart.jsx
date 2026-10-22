// Калибровочная кривая. По горизонтали — заявленная уверенность,
// по вертикали — сколько процентов таких прогнозов сбылось.
// Синяя пунктирная диагональ — идеальная калибровка: «сказал 70 % — сбылось 70 %».
// Чёрная кривая ниже диагонали — переуверенность, выше — недоуверенность.
//
// data — точки { p, f, n }: уверенность, сколько сбылось, сколько прогнозов.
// highlight — уверенность точки, которую надо выделить с подписью (например, 90).
// width, height — пропорции рисунка. Рисунок растягивается на ширину блока
// через viewBox, поэтому одни и те же координаты работают на любом экране.
// labelAt, labelAbove — где подписать диагональ, чтобы подпись не легла на кривую.

const LEFT = 34; // место слева под подписи оси
const RIGHT = 10;
const TOP = 28; // место сверху под заголовок оси
const BOTTOM = 40; // место снизу под подписи и название оси
const GRID = [0, 25, 50, 75, 100];

// Подписи оси X: крайние прижаты к краю, чтобы не вылезать за рисунок.
function getAxisAnchor(value) {
  if (value === 0) return 'start';
  if (value === 100) return 'end';
  return 'middle';
}

export function CalibrationChart({ data, highlight, width = 358, height = 300, labelAt = 5, labelAbove = false }) {
  const plotWidth = width - LEFT - RIGHT;
  const plotHeight = height - TOP - BOTTOM;

  // Перевод процентов в координаты рисунка. У SVG ось Y идёт сверху вниз,
  // поэтому 0 % — внизу (TOP + plotHeight), а 100 % — вверху (TOP).
  const toX = (percent) => LEFT + (percent / 100) * plotWidth;
  const toY = (percent) => TOP + plotHeight - (percent / 100) * plotHeight;

  // Кривая — ломаная через все точки: «M x y» — начать, «L x y» — линия до точки.
  const curve = data.map((point, index) => `${index === 0 ? 'M' : 'L'}${toX(point.p)} ${toY(point.f)}`).join(' ');

  // Чем больше прогнозов в корзине, тем крупнее точка: радиус от 4 до 7,5.
  const maxCount = Math.max(...data.map((point) => point.n));

  // Угол наклона диагонали в градусах — чтобы подпись шла вдоль неё.
  const angle = (-Math.atan(plotHeight / plotWidth) * 180) / Math.PI;
  const labelX = toX(labelAt) + 4;
  const labelY = toY(labelAt) + (labelAbove ? -14 : 13);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block w-full h-auto font-sans" role="img" aria-label="Калибровочная кривая">
      {GRID.map((value) => (
        <g key={value}>
          <line x1={LEFT} x2={LEFT + plotWidth} y1={toY(value)} y2={toY(value)} className="stroke-tone-1" />
          <text x={LEFT - 8} y={toY(value) + 4} textAnchor="end" fontSize="11" className="fill-ink-2">{value}</text>
          <text x={toX(value)} y={TOP + plotHeight + 18} textAnchor={getAxisAnchor(value)} fontSize="11" className="fill-ink-2">{value}</text>
        </g>
      ))}

      <line x1={toX(0)} y1={toY(0)} x2={toX(100)} y2={toY(100)} strokeWidth="1.5" strokeDasharray="5 5" className="stroke-accent" />
      <text x={labelX} y={labelY} fontSize="11" className="fill-accent" transform={`rotate(${angle} ${labelX} ${labelY})`}>
        идеальная калибровка
      </text>

      <path d={curve} fill="none" strokeWidth="2.25" strokeLinejoin="round" className="stroke-ink" />

      {data.map((point) => (
        <g key={point.p}>
          {/* Пунктир от диагонали до точки — величина ошибки. */}
          <line x1={toX(point.p)} x2={toX(point.p)} y1={toY(point.p)} y2={toY(point.f)} strokeOpacity=".18" strokeWidth="2" strokeDasharray="2 3" className="stroke-ink" />
          <circle cx={toX(point.p)} cy={toY(point.f)} r={4 + (point.n / maxCount) * 3.5} stroke="white" strokeWidth="2" className="fill-ink" />
        </g>
      ))}

      {highlight != null && <HighlightNote point={data.find((point) => point.p === highlight)} x={toX(highlight)} toY={toY} />}

      <text x={LEFT + plotWidth / 2} y={height - 4} textAnchor="middle" fontSize="11" fontWeight="500" className="fill-ink">Заявленная уверенность, %</text>
      <text x="0" y="11" fontSize="11" fontWeight="500" className="fill-ink">Сбылось, %</text>
    </svg>
  );
}

// Выделенная точка: кольцо вокруг неё и чёрная плашка «заявили 90 % / сбылось 64 %».
function HighlightNote({ point, x, toY }) {
  const y = toY(point.f);
  const boxX = x - 96;
  const boxY = y + 24;
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill="none" strokeWidth="1.5" className="stroke-ink" />
      <line x1={x} y1={y + 11} x2={x} y2={boxY} strokeWidth="1.5" className="stroke-ink" />
      <rect x={boxX} y={boxY} width="104" height="38" rx="10" className="fill-ink" />
      <text x={boxX + 52} y={boxY + 16} textAnchor="middle" fontSize="11" fill="white" fillOpacity=".7">заявили {point.p} %</text>
      <text x={boxX + 52} y={boxY + 31} textAnchor="middle" fontSize="12" fontWeight="600" fill="white">сбылось {point.f} %</text>
    </g>
  );
}
