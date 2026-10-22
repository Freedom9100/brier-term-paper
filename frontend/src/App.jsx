import { BrowserRouter, Routes, Route } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { MobileHeader } from './components/MobileHeader';
import { FeedPage } from './pages/FeedPage';
import { QuestionPage } from './pages/QuestionPage';
import { RatingPage } from './pages/RatingPage';
import { ProfilePage } from './pages/ProfilePage';
import { CabinetPage } from './pages/CabinetPage';
import { CreateQuestionPage } from './pages/CreateQuestionPage';
import { LoginPage, LoginPromo } from './pages/LoginPage';
import { RegisterPage, RegisterPromo } from './pages/RegisterPage';

// Роль пользователя: 'guest' — гость, 'user' — участник, 'admin' — администратор.
// Пока входа нет, роль меняется здесь руками, чтобы показать разные варианты страниц.
// На следующем этапе её будет сообщать сервер.
const role = 'user';

// Временная заглушка: показывает название страницы, пока сама страница не свёрстана.
function PagePlaceholder({ title }) {
  return (
    <>
      <MobileHeader role={role} />
      <h1 className="p-6 text-[30px] font-semibold tracking-[-0.035em]">{title}</h1>
    </>
  );
}

// Все адреса приложения. Страницы внутри <Route element={<MainLayout />}>
// рисуются внутри общей рамки с навигацией, внутри AuthLayout — без неё.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout role={role} />}>
          <Route path="/" element={<FeedPage role={role} />} />
          <Route path="/questions/:id" element={<QuestionPage role={role} />} />
          <Route path="/rating" element={<RatingPage role={role} />} />
          <Route path="/users/:username" element={<ProfilePage />} />
          <Route path="/me" element={<CabinetPage role={role} tab="active" />} />
          <Route path="/me/resolved" element={<CabinetPage role={role} tab="resolved" />} />
          <Route path="/me/questions" element={<CabinetPage role={role} tab="questions" />} />
          <Route path="*" element={<PagePlaceholder title="Страница не найдена" />} />
        </Route>

        {/* Создание вопроса: на телефоне без нижней панели, чтобы ничто не отвлекало от формы. */}
        <Route element={<MainLayout role={role} hidePhoneNav />}>
          <Route path="/questions/new" element={<CreateQuestionPage role={role} />} />
        </Route>

        {/* У входа и регистрации на десктопе разная левая половина, поэтому два лейаута. */}
        <Route element={<AuthLayout promo={<LoginPromo />} />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AuthLayout promo={<RegisterPromo />} />}>
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
