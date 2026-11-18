import { Calendar, CircleCheck, MessageCircle, Users } from 'lucide-react';
import { Avatar } from './Avatar';
import { Status } from './Status';
import { Ruler } from './Ruler';
import { Meta } from './Meta';
import { Panel } from './SidePanels';
import { SectionTitle } from './SectionTitle';

// Пример: как вопрос встанет в ленту после проверки.
export function DraftPreview({ person, className = '' }) {
  return (
    <div className={`${className} flex gap-3`}>
      <Avatar person={person} size={36} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[14px] leading-5">
          <span className="font-semibold truncate">{person.name}</span>
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

export function GoodQuestionPanel() {
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
