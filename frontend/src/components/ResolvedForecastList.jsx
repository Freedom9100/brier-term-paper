import { ForecastRow } from './ForecastRow';
import { formatQuestionDate } from '../utils/questionDates';

export function ResolvedForecastList({ forecasts, error, emptyText = 'У вас пока нет разрешённых прогнозов.' }) {
  if (error) return <p role="alert" className="py-4 text-sm text-neg">Не удалось загрузить очки. Обновите страницу.</p>;
  if (!forecasts) return <p role="status" className="py-4 text-sm text-ink-2">Загружаем результаты…</p>;
  if (forecasts.length === 0) return <p className="py-4 text-sm text-ink-2">{emptyText}</p>;

  return forecasts.map((forecast) => (
    <ForecastRow key={forecast.id} forecast={{
      questionId: forecast.question_id,
      title: forecast.title,
      p: forecast.probability,
      outcome: forecast.outcome,
      date: formatQuestionDate(forecast.resolved_at),
      points: forecast.points,
    }} />
  ));
}
