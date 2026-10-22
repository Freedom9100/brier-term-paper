// Формулы и форматирование чисел. Используются на разных страницах,
// поэтому вынесены в один файл.

// Очки за прогноз по правилу Брайера, от −100 до +100.
// p — прогноз в процентах (1–99), outcome — исход: 1 — «Да», 0 — «Нет».
export function calculatePoints(p, outcome) {
  const error = p / 100 - outcome;
  return Math.round(100 * (1 - 2 * error * error));
}

// Число с запятой, как принято в русском тексте: 61.8 → «61,8».
export function formatNumber(value, digits = 1) {
  return value.toFixed(digits).replace('.', ',');
}
