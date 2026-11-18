import { Link } from 'react-router';
import { Field, INPUT_CLASS } from '../components/Field';
import { AuthForm } from '../components/AuthForm';
import { CalibrationChart } from '../components/CalibrationChart';
import { calibration } from '../data/mock';

export function LoginPage({ onSuccess }) {
  return (
    <>
      <h1 className="text-[30px] leading-9 font-semibold tracking-[-0.035em]">Вход</h1>
      <p className="mt-2 text-[15px] leading-[22px] text-ink-2 text-pretty">
        <span className="lg:hidden">Ваши прогнозы, очки и калибровка ждут вас.</span>
        <span className="hidden lg:inline">С возвращением.</span>
      </p>
      <div className="mt-7 flex flex-col gap-4">
        <AuthForm endpoint="/api/auth/login/" onSuccess={onSuccess} label="Войти" pendingLabel="Входим…">
          <Field label="Имя пользователя">
            <input name="username" type="text" autoComplete="username" required className={`${INPUT_CLASS} h-12 text-base`} />
          </Field>
          <Field label="Пароль">
            <input name="password" type="password" autoComplete="current-password" required className={`${INPUT_CLASS} h-12 text-base`} />
          </Field>
        </AuthForm>
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
