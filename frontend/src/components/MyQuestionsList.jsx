import { Plus } from 'lucide-react';
import { Button } from './Button';
import { MyQuestionRow } from './MyQuestionRow';
import { formatQuestionDate } from '../utils/questionDates';

// Вкладка «Мои вопросы»: список и подсказка про отклонённые вопросы.
export function MyQuestionsList({ questions, error }) {
  return (
    <div className="pt-2">
      {error && <p role="alert" className="py-4 text-sm text-neg">Не удалось загрузить ваши вопросы. Обновите страницу.</p>}
      {!error && !questions && <p role="status" className="py-4 text-sm text-ink-2">Загружаем вопросы…</p>}
      {!error && questions?.length === 0 && <p className="py-4 text-sm text-ink-2">Вы ещё не отправляли вопросы.</p>}
      {!error && questions?.map((question) => (
        <MyQuestionRow key={question.id} question={{
          ...question,
          date: formatQuestionDate(question.created_at),
          status: question.status === 'open' ? 'published' : question.status,
          reason: question.rejection_reason,
          questionId: ['open', 'closed', 'resolved'].includes(question.status) ? question.id : null,
        }} />
      ))}
      <div className="pt-3 pb-8 md:pb-10 lg:hidden">
        <Button to="/questions/new" icon={Plus} variant="secondary" size="lg" full className="md:hidden">Задать новый вопрос</Button>
        <p className="mt-2.5 md:mt-0 text-center md:text-left text-[13px] leading-[18px] text-ink-2 text-pretty">
          Отклонённый вопрос не редактируется — создайте новый с учётом причины.
        </p>
      </div>
    </div>
  );
}
