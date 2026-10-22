import { Link } from 'react-router';
import { Clock, Ellipsis, Lock, MessageCircle, Users } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Status } from './Status';
import { Meta } from './Meta';
import { Ruler } from './Ruler';
import { Points, Percent } from './Points';
import { people } from '../data/mock';
import { calculatePoints } from '../utils/score';

// Запись ленты — один вопрос. Четыре состояния: приём открыт, скоро закрытие,
// приём закрыт, исход известен. Гость не видит строк «ваш прогноз» и «ваши очки».
// Заголовок и кнопка ведут на страницу вопроса, имя автора — на его профиль.
export function QuestionItem({ question, role }) {
  const author = people[question.author];
  const showYou = role !== 'guest' && question.you != null;
  const statusTag = getStatusTag(question);
  const link = `/questions/${question.id}`;

  const metaItems = [
    { icon: Users, text: question.participants },
    { icon: MessageCircle, text: question.comments },
  ];
  if (question.status === 'open' && !question.soon) {
    metaItems.push({ icon: Clock, text: question.closesIn.replace('через ', '') });
  }

  return (
    <article className="flex gap-3 px-4 py-4 md:px-6 md:py-5 border-b border-line last:border-b-0">
      <Link to={`/users/${author.username}`} className="self-start">
        <Avatar person={author} size={36} />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[14px] leading-5 h-5">
          <Link to={`/users/${author.username}`} className="font-semibold truncate hover:underline">{author.name}</Link>
          <span className="text-ink-2 truncate">· {question.category} · {question.created}</span>
          <Ellipsis className="ml-auto size-5 shrink-0 text-ink-2" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h2 className="mt-1 text-[16px] leading-[22px] md:text-[17px] md:leading-6 font-medium tracking-[-0.01em] text-pretty">
          <Link to={link} className="hover:underline underline-offset-2">{question.title}</Link>
        </h2>
        {statusTag && <div className="mt-2 flex">{statusTag}</div>}
        <QuestionNumbers question={question} showYou={showYou} />
        <div className="mt-3">
          <Ruler
            crowd={question.crowd}
            you={showYou ? question.you : null}
            model={question.status !== 'open' ? question.model : null}
            outcome={question.status === 'resolved' ? question.outcome : null}
          />
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-3">
          <Meta items={metaItems} />
          <QuestionAction question={question} showYou={showYou} link={link} />
        </div>
      </div>
    </article>
  );
}

// Метка над числами: закрыт, исход или «скоро закрытие». У обычного открытого — нет.
function getStatusTag(question) {
  if (question.status === 'closed') return <Status kind="closed" />;
  if (question.status === 'resolved') return <Status kind={question.outcome === 1 ? 'yes' : 'no'} />;
  if (question.soon) return <Status kind="soon" label={`${question.closesIn.replace('через ', '')} до закрытия`} />;
  return null;
}

// Крупное число слева (мнение группы или исход) и малое справа (ваш прогноз, модель или очки).
function QuestionNumbers({ question, showYou }) {
  const big = 'text-[34px] md:text-[40px] leading-none font-semibold tracking-[-0.035em] tabular-nums';

  if (question.status === 'resolved') {
    return (
      <div className="mt-3 flex items-end justify-between">
        <span className="flex items-baseline gap-2">
          <span className={big}>{question.outcome === 1 ? 'Да' : 'Нет'}</span>
          <span className="text-[13px] text-ink-2">исход</span>
        </span>
        {showYou && <SmallNumber label="ваши очки"><Points value={calculatePoints(question.you, question.outcome)} className="text-[20px] leading-6" /></SmallNumber>}
      </div>
    );
  }

  const isClosed = question.status === 'closed';
  return (
    <div className="mt-3 flex items-end justify-between">
      <span className="flex items-baseline gap-2">
        <span className={`${big} ${isClosed ? 'text-ink-2' : 'text-accent'}`}><Percent value={question.crowd} /></span>
        <span className="text-[13px] text-ink-2 leading-4">мнение<br />группы</span>
      </span>
      {isClosed && <SmallNumber label="модель">{question.model}%</SmallNumber>}
      {!isClosed && showYou && <SmallNumber label="ваш прогноз">{question.you}%</SmallNumber>}
    </div>
  );
}

function SmallNumber({ label, children }) {
  return (
    <span className="text-right">
      <span className="block text-[12px] text-ink-2">{label}</span>
      <span className="text-[20px] leading-6 font-semibold tabular-nums">{children}</span>
    </span>
  );
}

// Кнопка справа внизу: «Итоги», «Изменить», «Прогноз» или надпись «Ждём исход».
function QuestionAction({ question, showYou, link }) {
  if (question.status === 'resolved') return <Button to={link} variant="secondary" size="sm">Итоги</Button>;
  if (question.status === 'closed') {
    return (
      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-2 whitespace-nowrap">
        <Lock className="size-3.5" strokeWidth={2} aria-hidden="true" />Ждём исход
      </span>
    );
  }
  if (showYou) return <Button to={link} variant="secondary" size="sm">Изменить</Button>;
  return <Button to={link} size="sm">Прогноз</Button>;
}
