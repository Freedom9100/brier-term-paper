import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { FeedPage } from './pages/FeedPage';
import { QuestionPage } from './pages/QuestionPage';
import { RatingPage } from './pages/RatingPage';
import { ProfilePage } from './pages/ProfilePage';
import { CabinetPage } from './pages/CabinetPage';
import { CreateQuestionPage } from './pages/CreateQuestionPage';
import { LoginPage, LoginPromo } from './pages/LoginPage';
import { RegisterPage, RegisterPromo } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Button } from './components/Button';
import { getSession, postJson } from './api';

// Все адреса приложения. Страницы внутри <Route element={<MainLayout />}>
// рисуются внутри общей рамки с навигацией, внутри AuthLayout — без неё.
export default function App() {
  const [user, setUser] = useState(undefined);
  const [sessionError, setSessionError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getSession(controller.signal)
      .then((session) => setUser(session.user))
      .catch(() => {
        if (!controller.signal.aborted) setSessionError(true);
      });
    return () => controller.abort();
  }, []);

  function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError('');
    postJson('/api/auth/logout/')
      .then(() => setUser(null))
      .catch(() => setSignOutError('Не удалось выйти. Попробуйте ещё раз.'))
      .finally(() => setSigningOut(false));
  }

  if (user === undefined) {
    return (
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <p role={sessionError ? 'alert' : 'status'}>
          {sessionError ? 'Сервер недоступен. Проверьте, запущен ли Django.' : 'Проверяем вход…'}
        </p>
        {sessionError && <Button onClick={() => window.location.reload()} className="mt-4">Повторить</Button>}
      </main>
    );
  }

  const role = user?.role ?? 'guest';
  const accountActions = { onSignOut: signOut, signingOut };
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout role={role} person={user} {...accountActions} signOutError={signOutError} />}>
          <Route path="/" element={<FeedPage role={role} person={user} />} />
          <Route path="/questions/:id" element={<QuestionPage role={role} person={user} />} />
          <Route path="/rating" element={<RatingPage role={role} person={user} />} />
          <Route path="/users/:username" element={<ProfilePage role={role} person={user} />} />
          <Route path="/me" element={<CabinetPage role={role} person={user} {...accountActions} tab="active" />} />
          <Route path="/me/resolved" element={<CabinetPage role={role} person={user} {...accountActions} tab="resolved" />} />
          <Route path="/me/questions" element={<CabinetPage role={role} person={user} {...accountActions} tab="questions" />} />
          <Route path="*" element={<NotFoundPage role={role} person={user} />} />
        </Route>

        {/* Создание вопроса: на телефоне без нижней панели, чтобы ничто не отвлекало от формы. */}
        <Route element={<MainLayout role={role} person={user} {...accountActions} signOutError={signOutError} hidePhoneNav />}>
          <Route path="/questions/new" element={<CreateQuestionPage role={role} person={user} />} />
        </Route>

        {/* У входа и регистрации на десктопе разная левая половина, поэтому два лейаута. */}
        <Route element={<AuthLayout promo={<LoginPromo />} />}>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onSuccess={setUser} />} />
        </Route>
        <Route element={<AuthLayout promo={<RegisterPromo />} />}>
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage onSuccess={setUser} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
