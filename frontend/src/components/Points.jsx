// Два способа показать число: очки со знаком и проценты.

// Очки: «+92,18», «−62», «50». Цвет — относительно 50 (столько даёт ответ «50 %»):
// выше — зелёный, ниже — красный, ровно 50 — серый.
// Минус — типографский «−», а не дефис «-»: так он одной ширины с плюсом.
const pointsFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

export function Points({ value, className = 'text-[15px]' }) {
  let color = 'text-ink-2';
  if (value > 50) color = 'text-pos';
  if (value < 50) color = 'text-neg';

  const number = pointsFormat.format(Math.abs(value));
  let text = number;
  if (value > 0) text = `+${number}`;
  if (value < 0) text = `−${number}`;

  return <span className={`${className} ${color} font-semibold tabular-nums`}>{text}</span>;
}

// Процент крупным числом: знак «%» мельче цифр, как в макете.
export function Percent({ value }) {
  return (
    <>
      {value}
      <span className="text-[0.58em] font-medium ml-[0.04em]">%</span>
    </>
  );
}
