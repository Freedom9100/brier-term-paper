import { Navigate } from 'react-router';
import { Calendar, ChevronDown, CircleCheck, Info, MessageCircle, Users, X } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { BackBar } from '../components/BackBar';
import { Field, INPUT_CLASS } from '../components/Field';
import { Button, IconButton } from '../components/Button';
import { SectionTitle } from '../components/SectionTitle';
import { Avatar } from '../components/Avatar';
import { Status } from '../components/Status';
import { Ruler } from '../components/Ruler';
import { Meta } from '../components/Meta';
import { Panel } from '../components/SidePanels';
import { categories, currentUser } from '../data/mock';

// Создание вопроса. Пока это только вид формы: отправки нет, кнопка
// «Отправить на модерацию» ведёт в кабинет, где вопрос ждёт проверки.
// На телефоне — без нижней панели навигации (hidePhoneNav в App.jsx).
export function CreateQuestionPage({ role }) {
  if (role === 'guest') {
    return <Navigate to="/login" replace />;
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
          <div className="flex flex-col gap-5 md:gap-6 px-4 pt-5 pb-8 md:px-6 md:pt-8 md:pb-10 lg:p-8 lg:bg-paper lg:rounded-[24px] lg:border lg:border-line">
            <div className="hidden md:block">
              <h1 className="text-[34px] leading-10 lg:text-[30px] lg:leading-9 font-semibold tracking-[-0.035em]">Новый вопрос</h1>
              <p className="mt-2 text-[15px] leading-[22px] text-ink-2">Вопрос о будущем, на который можно ответить «Да» или «Нет».</p>
            </div>
            <QuestionFields />
            <ModerationNote />
            <div className="hidden md:block lg:hidden pt-2">
              <SectionTitle title="Так вопрос появится в ленте" />
              <DraftPreview className="mt-3 rounded-2xl border border-line p-4" />
            </div>
            <div className="flex justify-end gap-2">
              <div className="hidden md:block">
                <Button to="/" variant="secondary" size="lg">Отмена</Button>
              </div>
              <Button to="/me/questions" size="lg" className="w-full md:w-auto">Отправить на модерацию</Button>
            </div>
          </div>
        </div>

        <aside className="hidden lg:flex w-[376px] shrink-0 flex-col gap-5 pt-9">
          <Panel className="p-5">
            <SectionTitle title="Так вопрос появится в ленте" />
            <DraftPreview className="mt-4" />
          </Panel>
          <GoodQuestionPanel />
        </aside>
      </div>
    </>
  );
}

// Поля формы. Категория, дата и время: на телефоне категория отдельной
// строкой, от планшета все три в одну строку (сетка из трёх колонок).
function QuestionFields() {
  return (
    <>
      <Field label="Вопрос" counter="до 140 символов" hint="Сформулируйте так, чтобы ответить можно было только «Да» или «Нет».">
        <textarea rows={2} maxLength={140} placeholder="Например: Будет ли защита курсовых раньше 20 декабря?" className={`${INPUT_CLASS} py-3 resize-none`} />
      </Field>
      <Field label="Как определится исход" hint="Источник, по которому администратор укажет исход.">
        <textarea rows={3} placeholder="Где и когда станет известен ответ" className={`${INPUT_CLASS} py-3 resize-none`} />
      </Field>
      <div className="grid grid-cols-[1fr_118px] md:grid-cols-[1fr_1fr_124px] gap-x-3 gap-y-5">
        <div className="col-span-2 md:col-span-1">
          <Field label="Категория" trailing={<ChevronDown className="size-5" strokeWidth={2} aria-hidden="true" />}>
            <select className={`${INPUT_CLASS} h-12 appearance-none`} defaultValue="">
              <option value="" disabled>Выберите</option>
              {categories.map((category) => <option key={category.name}>{category.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Закрытие приёма">
          <input type="date" className={`${INPUT_CLASS} h-12`} />
        </Field>
        <Field label="Время">
          <input type="time" defaultValue="23:59" className={`${INPUT_CLASS} h-12`} />
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

// Пример: как вопрос встанет в ленту после проверки.
function DraftPreview({ className = '' }) {
  return (
    <div className={`${className} flex gap-3`}>
      <Avatar person={currentUser} size={36} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[14px] leading-5">
          <span className="font-semibold truncate">{currentUser.name}</span>
          <span className="text-ink-2 whitespace-nowrap">· Учёба</span>
        </div>
        <div className="mt-1 text-[16px] leading-[22px] font-medium tracking-[-0.01em] text-pretty">Будет ли защита курсовых у ИС-23 раньше 20 декабря?</div>
        <div className="mt-2 flex"><Status kind="moderation" /></div>
        <div className="mt-3 text-[13px] leading-[18px] text-ink-2">Мнение группы появится после первых прогнозов</div>
        <div className="mt-2.5"><Ruler crowd={0} /></div>
        <Meta className="mt-3" items={[{ icon: Users, text: 0 }, { icon: MessageCircle, text: 0 }, { icon: Calendar, text: 'до 15 дек' }]} />
      </div>
    </div>
  );
}

function GoodQuestionPanel() {
  const rules = [
    'Ответ — только «Да» или «Нет», без «частично».',
    'Исход можно проверить по открытому источнику.',
    'Приём закрывается раньше, чем станет известен исход.',
  ];
  return (
    <Panel className="p-5">
      <SectionTitle title="Хороший вопрос" />
      <div className="mt-1">
        {rules.map((rule) => (
          <div key={rule} className="flex gap-2.5 py-2.5 text-[14px] leading-5">
            <CircleCheck className="size-[18px] shrink-0 mt-px" strokeWidth={2} aria-hidden="true" />
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
