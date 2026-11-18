import { useState } from 'react';
import { Lock, Minus, Plus } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { ForecastSlider } from './ForecastSlider';
import { Payoff } from './Payoff';
import { Percent } from './Points';
import { Button, IconButton } from './Button';
import { putJson } from '../api';
import { formatDeadline } from '../utils/questionDates';

export function ForecastBlock({ question, onSaved, onClosed }) {
  const hasForecast = question.you != null;
  const buttonLabel = hasForecast ? 'Обновить прогноз' : 'Сохранить прогноз';
  const [value, setValue] = useState(question.you ?? 50);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  function saveForecast(event) {
    event.preventDefault();
    if (isSaving) return;

    setError('');
    setIsSaving(true);
    putJson(`/api/questions/${question.id}/forecast/`, { probability: value })
      .then(onSaved)
      .catch((requestError) => {
        if (requestError.status === 409) onClosed();
        setError(requestError.message);
      })
      .finally(() => setIsSaving(false));
  }

  return (
    <form onSubmit={saveForecast}>
      <SectionTitle title="Ваш прогноз" right={<span className="text-[13px] text-ink-2 text-right">можно менять до {formatDeadline(question.closes_at)}</span>} />
      <div className="mt-3 flex items-center justify-between">
        <div className="text-[56px] md:text-[64px] leading-none font-semibold tracking-[-0.045em] tabular-nums">
          <Percent value={value} />
        </div>
        <div className="flex gap-2">
          <IconButton icon={Minus} label="Уменьшить на 1" variant="secondary" onClick={() => setValue(value - 1)} disabled={isSaving || value === 1} />
          <IconButton icon={Plus} label="Увеличить на 1" variant="secondary" onClick={() => setValue(value + 1)} disabled={isSaving || value === 99} />
        </div>
      </div>
      <div className="mt-4">
        <ForecastSlider value={value} crowd={question.crowd} onChange={setValue} disabled={isSaving} />
      </div>
      {/* Телефон: плашки очков, под ними кнопка. Планшет и десктоп: рядом. */}
      <div className="mt-4 md:mt-5 md:flex md:items-center md:gap-4">
        <div className="md:flex-1">
          <Payoff p={value} />
        </div>
        <div className="mt-4 md:mt-0 md:w-[232px] md:shrink-0">
          <Button type="submit" size="lg" full disabled={isSaving || (hasForecast && value === question.you)}>
            {isSaving ? 'Сохраняем…' : buttonLabel}
          </Button>
          <p role="status" className="mt-2.5 md:mt-2 text-center text-[13px] md:text-[12px] text-ink-2">
            {hasForecast ? `Сейчас сохранено ${question.you} %` : 'Прогноза пока нет'}
            <span className="md:hidden">. Учитывается последний прогноз.</span>
          </p>
        </div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-neg-soft px-4 py-3 text-sm text-neg">{error}</p>}
    </form>
  );
}

export function GuestPrompt() {
  return (
    <div className="rounded-2xl border border-line p-4 md:p-5">
      <div className="text-[17px] font-semibold">Ваш прогноз</div>
      <p className="mt-1 text-[14px] leading-5 text-ink-2 text-pretty">
        Войдите, чтобы поставить свою вероятность. Очки начислят, когда станет известен исход.
      </p>
      <div className="mt-4 flex gap-2">
        <Button to="/login">Войти</Button>
        <Button to="/register" variant="secondary">Регистрация</Button>
      </div>
    </div>
  );
}

export function ClosedNote({ question }) {
  return (
    <NoteCard icon={Lock} title="Приём закрыт">
      {question.you != null && `Ваш прогноз — ${question.you} %. `}
      Ждём исход.
    </NoteCard>
  );
}

// Карточка с иконкой в сером круге, заголовком и текстом.
function NoteCard({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-line p-4">
      <span className="size-10 rounded-full bg-paper-2 inline-flex items-center justify-center shrink-0">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        <div className="text-[15px] font-semibold">{title}</div>
        <p className="mt-1 text-[13px] leading-[19px] text-ink-2 text-pretty">{children}</p>
      </div>
    </div>
  );
}
