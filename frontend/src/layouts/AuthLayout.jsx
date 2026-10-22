import { Link, Outlet } from 'react-router';
import { Logo } from '../components/Logo';

// Рамка для входа и регистрации: без навигации, только логотип и форма.
// Телефон — форма на белом фоне. Планшет — белая карточка по центру серого фона.
// Десктоп — экран делится пополам: слева promo (у входа и регистрации он свой),
// справа форма.
export function AuthLayout({ promo }) {
  return (
    <div className="min-h-screen bg-paper md:bg-canvas lg:bg-paper lg:flex">
      <aside className="hidden lg:flex lg:flex-col w-[720px] shrink-0 bg-canvas border-r border-line px-16 pt-12 pb-16">
        <Link to="/" className="self-start">
          <Logo markClass="size-[34px]" wordClass="text-[23px]" />
        </Link>
        <div className="my-auto">{promo}</div>
      </aside>

      <div className="min-h-screen flex flex-col lg:flex-1">
        <Link to="/" className="self-start px-6 pt-10 md:px-8 md:pt-8 lg:hidden">
          <Logo markClass="size-10 md:size-[34px]" wordClass="text-[26px] md:text-[23px]" />
        </Link>
        <div className="flex-1 flex flex-col md:justify-center md:pb-[66px] lg:items-center lg:pb-0">
          <div className="px-6 pt-10 pb-8 md:mx-auto md:w-[480px] md:mt-8 md:rounded-[24px] md:border md:border-line md:bg-paper md:px-10 md:pb-9 lg:w-[400px] lg:m-0 lg:p-0 lg:border-0 lg:rounded-none">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
