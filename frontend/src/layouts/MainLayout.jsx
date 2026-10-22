import { Outlet } from 'react-router';
import { DesktopHeader } from '../components/DesktopHeader';
import { AppNav } from '../components/AppNav';
import { Footer } from '../components/Footer';

// Общая рамка всех страниц, кроме входа и регистрации.
// <Outlet /> — место, куда React Router подставляет текущую страницу.
// role — роль пользователя: от неё зависит, какие пункты показывает навигация.
// hideNav — спрятать навигацию и подвал на телефоне и планшете
// (страница создания вопроса: ничто не отвлекает от формы).
export function MainLayout({ role, hideNav = false }) {
  return (
    <div className="min-h-screen bg-paper lg:bg-canvas">
      <DesktopHeader role={role} />

      {/* На планшете (md:flex) навигация встаёт колонкой слева от страницы. */}
      <div className="md:flex">
        {!hideNav && <AppNav role={role} />}

        {/* Высота экрана, а на десктопе — экрана без шапки (4rem = 64 px),
            чтобы подвал на короткой странице прижимался к низу. */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen lg:min-h-[calc(100vh-4rem)]">
          {/* На десктопе страница — колонка шириной не больше 1184 px по центру. */}
          <main className="flex-1 w-full lg:max-w-[1184px] lg:mx-auto lg:px-6">
            <Outlet />
          </main>
          <div className={hideNav ? 'hidden lg:block' : ''}>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
