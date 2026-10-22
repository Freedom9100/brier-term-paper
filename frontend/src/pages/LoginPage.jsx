import { Link } from 'react-router';
import { Eye } from 'lucide-react';
import { Field, INPUT_CLASS } from '../components/Field';
import { Button } from '../components/Button';
import { CalibrationChart } from '../components/CalibrationChart';
import { calibration } from '../data/mock';

// Вход. Рамку рисует AuthLayout. Пока только вид формы: «Войти» ведёт на ленту.
// Плашка «Неверное имя пользователя или пароль» из макета появится вместе
// с проверкой на сервере — сейчас ошибке неоткуда взяться.
export function LoginPage() {
  return (
    <>
      <h1 className="text-[30px] leading-9 font-semibold tracking-[-0.035em]">Вход</h1>
      <p className="mt-2 text-[15px] leading-[22px] text-ink-2 text-pretty">
        <span className="lg:hidden">Ваши прогнозы, очки и калибровка ждут вас.</span>
        <span className="hidden lg:inline">С возвращением.</span>
      </p>
      <div className="mt-7 flex flex-col gap-4">
        <Field label="Имя пользователя">
          <input type="text" autoComplete="username" className={`${INPUT_CLASS} h-12`} />
        </Field>
        <Field label="Пароль" trailing={<Eye className="size-5" strokeWidth={1.75} aria-hidden="true" />}>
          <input type="password" autoComplete="current-password" className={`${INPUT_CLASS} h-12 pr-12`} />
        </Field>
        <div className="pt-2">
          <Button to="/" size="lg" full>Войти</Button>
        </div>
        <p className="text-center text-[14px] text-ink-2">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-semibold text-ink underline underline-offset-4 decoration-line-2">Зарегистрироваться</Link>
        </p>
      </div>
      <Link to="/" className="block mt-8 text-center text-[14px] font-medium text-ink-2 hover:text-ink">Продолжить без входа</Link>
    </>
  );
}

// Левая половина экрана на десктопе: калибровочная кривая как обещание того,
// что ждёт после входа.
export function LoginPromo() {
  return (
    <>
      <h2 className="max-w-[540px] text-[48px] leading-[54px] font-semibold tracking-[-0.035em] text-balance">
        Ваши прогнозы, очки и калибровка ждут вас
      </h2>
      <div className="mt-10 w-full max-w-[460px] rounded-[24px] border border-line bg-paper p-5">
        <div className="text-[15px] font-semibold">При уверенности 90 % сбывается 64 %</div>
        <div className="mt-3">
          <CalibrationChart data={calibration.emil} highlight={90} width={418} height={300} />
        </div>
      </div>
    </>
  );
}
