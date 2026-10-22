import { Outlet } from 'react-router';
import { DesktopHeader } from '../components/DesktopHeader';

// Общая рамка всех страниц, кроме входа и регистрации.
// <Outlet /> — место, куда React Router подставляет текущую страницу.
// role — роль пользователя: от неё зависит, какие пункты показывает навигация.
// hideNav — спрятать навигацию телефона и планшета (страница создания вопроса).
export function MainLayout({ role, hideNav = false }) {
  return (
    <div className="min-h-screen bg-paper lg:bg-canvas">
      <DesktopHeader role={role} />
      <div className="flex flex-col min-h-screen">
        {/* На десктопе страница — колонка шириной не больше 1184 px по центру. */}
        <main className="flex-1 w-full min-w-0 lg:max-w-[1184px] lg:mx-auto lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
