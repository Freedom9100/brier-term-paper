import { Link } from 'react-router';
import { Eye } from 'lucide-react';
import { Field, INPUT_CLASS } from '../components/Field';
import { Button } from '../components/Button';
import { PayoffExample } from '../components/Payoff';

// Регистрация. Рамку (логотип, фон, карточку) рисует AuthLayout.
// Пока только вид формы: «Создать аккаунт» ведёт на ленту.
export function RegisterPage() {
  const eyeIcon = <Eye className="size-5" strokeWidth={1.75} aria-hidden="true" />;

  return (
    <>
      <h1 className="text-[30px] leading-9 font-semibold tracking-[-0.035em]">Регистрация</h1>
      <p className="mt-2 text-[15px] leading-[22px] text-ink-2 text-pretty">
        <span className="lg:hidden">Ставьте вероятность, а не «да» или «нет». Очки начисляются за точность.</span>
        <span className="hidden lg:inline">Займёт минуту. Имя пользователя будет видно в рейтинге.</span>
      </p>
      <div className="mt-7 flex flex-col gap-4">
        <Field label="Имя пользователя" hint="Латиница, цифры, точка и подчёркивание. Видно в рейтинге.">
          <input type="text" autoComplete="username" className={`${INPUT_CLASS} h-12`} />
        </Field>
        <Field label="Электронная почта">
          <input type="email" autoComplete="email" className={`${INPUT_CLASS} h-12`} />
        </Field>
        <Field label="Пароль" hint="Не короче 8 символов." trailing={eyeIcon}>
          <input type="password" autoComplete="new-password" className={`${INPUT_CLASS} h-12 pr-12`} />
        </Field>
        <Field label="Повторите пароль" trailing={eyeIcon}>
          <input type="password" autoComplete="new-password" placeholder="Ещё раз пароль" className={`${INPUT_CLASS} h-12 pr-12`} />
        </Field>
        <div className="pt-2">
          <Button to="/" size="lg" full>Создать аккаунт</Button>
        </div>
        <p className="text-center text-[14px] text-ink-2">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-semibold text-ink underline underline-offset-4 decoration-line-2">Войти</Link>
        </p>
      </div>
    </>
  );
}

// Левая половина экрана на десктопе. App.jsx передаёт её в AuthLayout пропом promo.
export function RegisterPromo() {
  return (
    <>
      <h2 className="max-w-[540px] text-[48px] leading-[54px] font-semibold tracking-[-0.035em] text-balance">
        Ставьте вероятность, а&nbsp;не «да» или «нет»
      </h2>
      <p className="mt-5 max-w-[500px] text-[17px] leading-[26px] text-ink-2 text-pretty">
        Отвечайте на вопросы о будущем числом от 1 до 99 %. После исхода правило Брайера начислит очки за точность.
      </p>
      <PayoffExample className="mt-10 w-full max-w-[440px] rounded-2xl border border-line bg-paper p-4" />
    </>
  );
}
