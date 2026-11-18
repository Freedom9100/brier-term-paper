import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ChevronDown, Info, X } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { BackBar } from '../components/BackBar';
import { Field, INPUT_CLASS } from '../components/Field';
import { Button, IconButton } from '../components/Button';
import { SectionTitle } from '../components/SectionTitle';
import { Panel } from '../components/SidePanels';
import { DraftPreview, GoodQuestionPanel } from '../components/DraftPreview';
import { getJson, postJson } from '../api';

export function CreateQuestionPage({ role, person }) {
  if (role === 'guest') {
    return <Navigate to="/login" replace />;
  }
  return <NewQuestionForm person={person} />;
}

function NewQuestionForm({ person }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [categoryError, setCategoryError] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getJson('/api/categories/', controller.signal).then(setCategories).catch(() => {
      if (!controller.signal.aborted) setCategoryError(true);
    });
    return () => controller.abort();
  }, []);

  function submitQuestion(event) {
    event.preventDefault();
    if (isSending || !categories?.length) return;

    const fields = new FormData(event.currentTarget);
    const question = {
      title: fields.get('title'),
      description: fields.get('description'),
      category: fields.get('category'),
      closes_at: `${fields.get('close_date')}T${fields.get('close_time')}`,
    };
    setError('');
    setIsSending(true);
    postJson('/api/questions/', question)
      .then(() => navigate('/me/questions'))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsSending(false));
  }

  return (
    <>
      <MobileHeader backTo="/" backIcon={X} title="Новый вопрос" />
      <div className="hidden md:flex lg:hidden h-14 px-6 items-center border-b border-line">
        <IconButton to="/" icon={X} label="Закрыть" />
      </div>

      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-8 lg:pb-14">
        <div className="flex-1 min-w-0">
          {/* На планшете вместо «← Вопросы» — крестик выше, поэтому строка только для десктопа. */}
          <div className="hidden lg:block">
            <BackBar to="/" label="Вопросы" />
          </div>
          <form onSubmit={submitQuestion} method="post" className="flex flex-col gap-5 md:gap-6 px-4 pt-5 pb-8 md:px-6 md:pt-8 md:pb-10 lg:p-8 lg:bg-paper lg:rounded-[24px] lg:border lg:border-line">
            <div className="hidden md:block">
              <h1 className="text-[34px] leading-10 lg:text-[30px] lg:leading-9 font-semibold tracking-[-0.035em]">Новый вопрос</h1>
              <p className="mt-2 text-[15px] leading-[22px] text-ink-2">Вопрос о будущем, на который можно ответить «Да» или «Нет».</p>
            </div>
            <QuestionFields categories={categories ?? []} />
            {categoryError && <p role="alert" className="text-sm text-neg">Не удалось загрузить категории. Обновите страницу.</p>}
            {!categoryError && !categories && <p role="status" className="text-sm text-ink-2">Загружаем категории…</p>}
            {categories?.length === 0 && <p className="text-sm text-ink-2">Пока нет доступных категорий.</p>}
            {error && <p role="alert" className="rounded-xl bg-neg-soft px-4 py-3 text-sm text-neg">{error}</p>}
            <ModerationNote />
            <div className="hidden md:block lg:hidden pt-2">
              <SectionTitle title="Пример вопроса в ленте" />
              <DraftPreview person={person} className="mt-3 rounded-2xl border border-line p-4" />
            </div>
            <div className="flex justify-end gap-2">
              <div className="hidden md:block">
                <Button to="/" variant="secondary" size="lg">Отмена</Button>
              </div>
              <Button type="submit" disabled={isSending || !categories?.length} size="lg" className="w-full md:w-auto">
                {isSending ? 'Отправляем…' : 'Отправить на модерацию'}
              </Button>
            </div>
          </form>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-9">
          <Panel className="p-5">
            <SectionTitle title="Пример вопроса в ленте" />
            <DraftPreview person={person} className="mt-4" />
          </Panel>
          <GoodQuestionPanel />
        </aside>
      </div>
    </>
  );
}

// Поля формы. Категория, дата и время: на телефоне категория отдельной
// строкой, от планшета все три в одну строку (сетка из трёх колонок).
function QuestionFields({ categories }) {
  return (
    <>
      <Field label="Вопрос" counter="до 140 символов" hint="Сформулируйте так, чтобы ответить можно было только «Да» или «Нет».">
        <textarea name="title" required rows={2} maxLength={140} placeholder="Например: Будет ли защита курсовых раньше 20 декабря?" className={`${INPUT_CLASS} py-3 resize-none`} />
      </Field>
      <Field label="Как определится исход" hint="Источник, по которому администратор укажет исход.">
        <textarea name="description" required rows={3} placeholder="Где и когда станет известен ответ" className={`${INPUT_CLASS} py-3 resize-none`} />
      </Field>
      <div className="grid grid-cols-[1fr_118px] md:grid-cols-[1fr_1fr_124px] gap-x-3 gap-y-5">
        <div className="col-span-2 md:col-span-1">
          <Field label="Категория" trailing={<ChevronDown className="size-5" strokeWidth={2} aria-hidden="true" />}>
            <select name="category" required className={`${INPUT_CLASS} h-12 appearance-none`} defaultValue="">
              <option value="" disabled>Выберите</option>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Закрытие приёма" hint="По Москве.">
          <input name="close_date" type="date" required className={`${INPUT_CLASS} h-12`} />
        </Field>
        <Field label="Время">
          <input name="close_time" type="time" required defaultValue="23:59" className={`${INPUT_CLASS} h-12`} />
        </Field>
      </div>
    </>
  );
}

// Подсказка про модерацию. Телефон и планшет — карточка в рамке,
// десктоп — просто текст под линией.
function ModerationNote() {
  return (
    <div className="flex gap-3 rounded-2xl border border-line p-4 lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:pb-0 lg:pt-5">
      <Info className="size-5 shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
      <p className="text-[13px] leading-[19px] text-ink-2 text-pretty">
        Вопрос появится в ленте после проверки администратором. Статус — в кабинете, в разделе «Мои вопросы». Если вопрос отклонят, там же будет причина.
      </p>
    </div>
  );
}
