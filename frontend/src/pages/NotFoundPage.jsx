import { MobileHeader } from '../components/MobileHeader';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

// Страница 404: адреса нет в списке маршрутов, или вопроса / участника нет в данных.
export function NotFoundPage({ role }) {
  return (
    <>
      <MobileHeader role={role} />
      <div className="md:pt-16 lg:pt-8 lg:pb-14">
        <div className="lg:bg-paper lg:rounded-[24px] lg:border lg:border-line lg:py-16">
          <EmptyState
            title="Страница не найдена"
            text="Такого адреса нет. Возможно, в ссылке опечатка или вопрос удалили."
            action={<Button to="/">К вопросам</Button>}
          />
        </div>
      </div>
    </>
  );
}
