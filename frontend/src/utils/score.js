// Формулы и форматирование чисел. Используются на разных страницах,
// поэтому вынесены в один файл.

// Очки за прогноз по правилу Брайера, от −100 до +100.
// p — прогноз в процентах (1–99), outcome — исход: 1 — «Да», 0 — «Нет».
export function calculatePoints(p, outcome) {
  const error = p / 100 - outcome;
  return Math.round(100 * (1 - 2 * error * error));
}

// «1 участник», «2 участника», «5 участников» — окончание зависит от числа.
// 11–14 — исключение: «11 участников», хотя 11 оканчивается на 1.
export function formatParticipants(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} участников`;
  if (lastDigit === 1) return `${count} участник`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} участника`;
  return `${count} участников`;
}

// Число с запятой, как принято в русском тексте: 61.8 → «61,8».
export function formatNumber(value, digits = 1) {
  return value.toFixed(digits).replace('.', ',');
}
