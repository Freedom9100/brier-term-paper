import { Link } from 'react-router';

// Вкладки: строка заголовков равной ширины, активный подчёркнут.
// items — массив { label, count, to }: count — число серым рядом (необязательно),
// to — адрес, если вкладка ведёт на другую страницу (вкладки кабинета).
// Без to вкладка — кнопка, и по нажатию вызывается onSelect(номер вкладки)
// (вкладки статусов в ленте).
export function Tabs({ items, activeIndex, onSelect, className = '' }) {
  return (
    <div className={`${className} flex border-b border-line`}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const classes = `-mb-px py-3 px-1 border-b-[1.5px] font-semibold whitespace-nowrap ${item.count != null ? 'text-[14px]' : 'text-[15px]'} ${isActive ? 'text-ink border-ink' : 'text-ink-2 border-transparent hover:text-ink'}`;
        const content = (
          <>
            {item.label}
            {item.count != null && <span className="ml-1 text-[13px] font-medium text-ink-2 tabular-nums">{item.count}</span>}
          </>
        );

        return (
          <span key={item.label} className="flex-1 flex justify-center">
            {item.to && <Link to={item.to} className={classes}>{content}</Link>}
            {!item.to && <button type="button" className={classes} onClick={() => onSelect(index)}>{content}</button>}
          </span>
        );
      })}
    </div>
  );
}
