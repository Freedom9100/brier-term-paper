// Поле формы: подпись сверху, само поле, подсказка снизу.
// Поле (input, textarea или select) передаётся внутрь как children
// и получает классы INPUT_CLASS — так все поля выглядят одинаково.
// counter — мелкий текст справа от подписи, trailing — иконка справа в поле.

export const INPUT_CLASS =
  'w-full rounded-xl border border-transparent bg-paper-2 px-4 text-[15px] leading-6 text-ink placeholder:text-ink-2 outline-none focus:bg-paper focus:border-ink focus:ring-4 focus:ring-ink/8';

export function Field({ label, hint, counter, trailing, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex justify-between text-[13px] font-semibold text-ink">
        {label}
        {counter && <span className="font-normal text-ink-2 tabular-nums">{counter}</span>}
      </span>
      <span className="relative">
        {children}
        {trailing && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none">{trailing}</span>
        )}
      </span>
      {hint && <span className="text-[13px] text-ink-2">{hint}</span>}
    </label>
  );
}
