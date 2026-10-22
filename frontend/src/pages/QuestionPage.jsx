import { useParams } from 'react-router';
import { Calendar, CircleCheck, Clock, Lock, Share } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { BackBar } from '../components/BackBar';
import { IconButton } from '../components/Button';
import { QuestionHeader } from '../components/QuestionHeader';
import { Meta } from '../components/Meta';
import { CrowdBlock, OutcomeBlock, DistributionBlock } from '../components/QuestionStats';
import { ForecastBlock, GuestPrompt, ClosedNote, ModelLockedNote } from '../components/ForecastBlock';
import { ScoreFormula } from '../components/Comparison';
import { CommentsSection } from '../components/Comments';
import { QuestionAside } from '../components/QuestionAside';
import { NotFoundPage } from './NotFoundPage';
import { comments, questions } from '../data/mock';

// Отступы раздела: телефон 16 px, планшет 24 px, десктоп 32 px; линия снизу.
const SECTION = 'px-4 md:px-6 lg:px-8 border-b border-line';

// Страница вопроса. Один компонент на все состояния: приём открыт,
// приём закрыт, исход известен — что показать, решают данные вопроса.
export function QuestionPage({ role }) {
  // useParams достаёт из адреса /questions/snow часть :id, то есть 'snow'.
  const { id } = useParams();
  const question = questions[id];

  if (!question) {
    return <NotFoundPage role={role} />;
  }

  const shareButton = <IconButton icon={Share} label="Поделиться" />;

  return (
    <>
      <MobileHeader backTo="/" title="Вопрос" right={shareButton} />
      <div className="lg:flex lg:gap-8 lg:items-start lg:pt-6 lg:pb-14">
        <div className="flex-1 min-w-0">
          <BackBar to="/" label="Все вопросы" right={shareButton} />
          <article className="lg:bg-paper lg:rounded-[24px] lg:border lg:border-line">
            <div className="px-4 pt-5 md:px-6 md:pt-7 lg:px-8 lg:pb-8 lg:border-b lg:border-line">
              <QuestionHeader question={question} />
              <Meta items={getMetaItems(question)} className="mt-4 md:mt-5" />
            </div>
            <QuestionBody question={question} role={role} />
            <section className="px-4 pt-6 pb-4 md:px-6 lg:px-8 lg:pt-7 lg:pb-6">
              <CommentsSection comments={comments[question.id] ?? []} total={question.comments} role={role} />
            </section>
          </article>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-[38px]">
          <QuestionAside question={question} role={role} />
        </aside>
      </div>
    </>
  );
}

// Средняя часть страницы — разная для каждого состояния вопроса.
function QuestionBody({ question, role }) {
  if (question.status === 'resolved') {
    return (
      <>
        <section className={`py-7 md:py-8 ${SECTION}`}><OutcomeBlock question={question} role={role} /></section>
        <section className={`py-7 md:py-8 ${SECTION}`}><DistributionBlock question={question} role={role} /></section>
        {/* На десктопе формула стоит в боковой колонке, здесь её прячем. */}
        <section className={`py-6 lg:hidden ${SECTION}`}><ScoreFormula question={question} role={role} /></section>
      </>
    );
  }

  if (question.status === 'closed') {
    return (
      <>
        <section className={`pt-7 pb-7 md:pt-8 md:pb-8 ${SECTION}`}><CrowdBlock question={question} role={role} /></section>
        <section className={`py-6 ${SECTION}`}><ClosedNote question={question} role={role} /></section>
      </>
    );
  }

  return (
    <>
      <section className={`pt-7 pb-7 md:pt-8 md:pb-8 ${SECTION}`}><CrowdBlock question={question} role={role} /></section>
      <section className={`py-7 md:py-8 ${SECTION}`}>
        {role === 'guest' ? <GuestPrompt /> : <ForecastBlock question={question} />}
      </section>
      <section className={`py-6 ${SECTION}`}><ModelLockedNote /></section>
    </>
  );
}

// Строка сведений под заголовком: даты. Число участников сюда не входит —
// оно уже есть ниже, в блоке мнения группы или в таблице сравнения.
function getMetaItems(question) {
  if (question.status === 'resolved') {
    return [
      { icon: Lock, text: `Приём закрыт ${question.closes.split(',')[0]}` },
      { icon: CircleCheck, text: `Исход ${question.resolvedAt}` },
    ];
  }
  if (question.status === 'closed') {
    return [{ icon: Lock, text: `Приём закрыт ${question.closes}` }];
  }
  return [
    { icon: Calendar, text: `Закрытие ${question.closes}` },
    { icon: Clock, text: question.closesIn },
  ];
}
