import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Calendar, Lock } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { BackBar } from '../components/BackBar';
import { QuestionHeader } from '../components/QuestionHeader';
import { QuestionAside } from '../components/QuestionAside';
import { Meta } from '../components/Meta';
import { Points } from '../components/Points';
import { Comparison } from '../components/Comparison';
import { CommentsSection } from '../components/Comments';
import { formatNumber } from '../utils/score';
import { CrowdBlock } from '../components/QuestionStats';
import { ClosedNote, ForecastBlock, GuestPrompt } from '../components/ForecastBlock';
import { NotFoundPage } from './NotFoundPage';
import { getJson } from '../api';
import { formatDeadline } from '../utils/questionDates';

export function QuestionPage({ role, person }) {
  const { id } = useParams();
  if (!Number.isSafeInteger(Number(id)) || Number(id) < 1) return <NotFoundPage role={role} person={person} />;
  return <PublishedQuestion key={id} id={id} role={role} person={person} />;
}

function PublishedQuestion({ id, role, person }) {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getJson(`/api/questions/${id}/`, controller.signal).then(setQuestion).catch((requestError) => {
      if (!controller.signal.aborted) setError(requestError);
    });
    return () => controller.abort();
  }, [id]);

  if (error?.status === 404) return <NotFoundPage role={role} person={person} />;
  if (error) return <p role="alert" className="p-6 text-neg">Не удалось загрузить вопрос. Обновите страницу.</p>;
  if (!question) return <p role="status" className="p-6 text-ink-2">Загружаем вопрос…</p>;

  function showLatestStatus() {
    getJson(`/api/questions/${id}/`).then(setQuestion).catch(() => {
      setQuestion((current) => ({ ...current, status: 'closed' }));
    });
  }

  const dateIcon = question.status === 'open' ? Calendar : Lock;
  return (
    <>
      <MobileHeader backTo="/" title="Вопрос" />
      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-6 lg:pb-14">
        <div className="flex-1 min-w-0">
          <BackBar to="/" label="Все вопросы" />
          <article className="lg:bg-paper lg:rounded-[24px] lg:border lg:border-line">
            <section className="px-4 py-5 md:px-6 md:py-7 lg:px-8 border-b border-line">
              <QuestionHeader question={question} />
              <Meta items={[{ icon: dateIcon, text: formatDeadline(question.closes_at) }]} className="mt-4" />
            </section>
            <QuestionSummary question={question} role={role} />
            {question.status !== 'open' && question.model == null && (
              <p className="border-t border-line px-4 py-4 text-sm text-ink-2 md:px-6 lg:px-8">
                Для этого вопроса нет прогноза модели.
              </p>
            )}
            {question.status === 'open' && (
              <section className="border-t border-line px-4 py-6 md:px-6 lg:px-8">
                {role === 'guest' ? <GuestPrompt /> : (
                  <ForecastBlock question={question} onClosed={showLatestStatus}
                    onSaved={(statistics) => setQuestion((current) => ({ ...current, ...statistics }))} />
                )}
              </section>
            )}
            {question.outcome != null && question.model != null && question.crowd_exact != null && (
              <section className="border-t border-line px-4 py-6 md:px-6 lg:px-8">
                <Comparison question={question} role={role} />
              </section>
            )}
            {question.status === 'closed' && (
              <section className="border-t border-line px-4 py-6 md:px-6 lg:px-8">
                <ClosedNote question={question} />
                {question.model != null && (
                  <p className="mt-4 text-sm text-ink-2">
                    Прогноз модели <span className="font-semibold text-ink">{formatNumber(question.model, 1)} %</span>
                    {question.model_demo && ' · обучена на искусственных примерах'}
                  </p>
                )}
              </section>
            )}
            <section className="border-t border-line px-4 py-6 md:px-6 lg:px-8">
              <CommentsSection questionId={question.id} person={person} />
            </section>
          </article>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-[38px]">
          <QuestionAside question={question} />
        </aside>
      </div>
    </>
  );
}

function QuestionSummary({ question, role }) {
  return (
    <section className="px-4 py-6 md:px-6 lg:px-8">
      {question.outcome != null && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Исход: {question.outcome === 1 ? 'Да' : 'Нет'}</h2>
          {question.source && <p className="mt-1 text-sm text-ink-2 whitespace-pre-wrap break-words">{question.source}</p>}
          {question.points != null && (
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-sm text-ink-2">Ваши очки</span>
              <Points value={question.points} className="text-xl" />
            </div>
          )}
        </div>
      )}
      {question.crowd == null
        ? <p className="text-sm text-ink-2">Пока нет прогнозов.</p>
        : <CrowdBlock question={question} role={role} />}
    </section>
  );
}
