import { Link } from 'react-router';

// Кнопки двух видов: Button — с текстом, IconButton — круглая, только с иконкой.
// Если передан to, кнопка становится ссылкой на другую страницу приложения.

const VARIANT_CLASSES = {
  primary: 'bg-ink text-white hover:bg-ink-hover',
  secondary: 'bg-paper text-ink border border-line-2 hover:bg-paper-2',
  soft: 'bg-paper-2 text-ink hover:bg-line',
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3.5 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-[14px] gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

// icon: Icon — переименование пропа: компонент иконки в JSX пишется с большой буквы.
export function Button({ children, to, variant = 'primary', size = 'md', icon: Icon, full = false, className = '' }) {
  const classes = `${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${full ? 'w-full' : ''} inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap ${className}`;
  const iconClass = size === 'sm' ? 'size-4' : 'size-[18px]';
  const content = (
    <>
      {Icon && <Icon className={iconClass} strokeWidth={2} aria-hidden="true" />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return <Link to={to} className={classes}>{content}</Link>;
  }
  return <button type="button" className={classes}>{content}</button>;
}

const ICON_BUTTON_VARIANTS = {
  ghost: 'hover:bg-paper-2',
  soft: 'bg-paper-2',
  secondary: 'border border-line-2 hover:bg-paper-2',
};

// label обязателен: на кнопке нет текста, и программа чтения с экрана прочтёт label.
// to — переход внутри приложения, href — обычная ссылка (например, на админку Django).
export function IconButton({ icon: Icon, label, to, href, size = 40, variant = 'ghost' }) {
  const sizeClass = size === 36 ? 'size-9' : 'size-10';
  const classes = `${sizeClass} ${ICON_BUTTON_VARIANTS[variant]} inline-flex items-center justify-center rounded-full text-ink shrink-0`;
  const icon = <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden="true" />;

  if (to) {
    return <Link to={to} className={classes} aria-label={label}>{icon}</Link>;
  }
  if (href) {
    return <a href={href} className={classes} aria-label={label}>{icon}</a>;
  }
  return <button type="button" className={classes} aria-label={label}>{icon}</button>;
}
