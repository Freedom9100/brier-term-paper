// Линейка вероятности — главный знак интерфейса. Шкала от 1 до 99 %:
// синяя полоса — мнение группы, чёрная риска — ваш прогноз,
// серый ромб — прогноз модели, чёрная точка на краю — исход
// (справа — «Да», слева — «Нет»).
// Все положения задаются в процентах (left: 65%), поэтому линейка
// тянется на любую ширину. Пропсы you, model, outcome необязательны.
export function Ruler({ crowd, you, model, outcome, showLabels = false, heightClass = 'h-1.5' }) {
  return (
    <div>
      <div className={`relative ${heightClass} rounded-full bg-line`}>
        <span className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${crowd}%` }} />
        {model != null && (
          <span
            className="absolute top-1/2 -translate-y-1/2 -ml-[5px] size-2.5 rotate-45 rounded-[2px] bg-paper border-2 border-ink-2"
            style={{ left: `${model}%` }}
          />
        )}
        {you != null && (
          <span
            className="absolute top-1/2 -translate-y-1/2 -ml-[2px] w-1 h-4 rounded-full bg-ink ring-2 ring-paper"
            style={{ left: `${you}%` }}
          />
        )}
        {outcome != null && (
          <span className={`absolute top-1/2 -translate-y-1/2 ${outcome === 1 ? 'right-0' : 'left-0'} size-3 rounded-full bg-ink ring-[3px] ring-paper`} />
        )}
      </div>
      {showLabels && (
        <div className="relative h-4 mt-1.5 text-[11px] text-ink-2 tabular-nums">
          <span className="absolute left-0">1</span>
          <span className="absolute left-1/2 -translate-x-1/2">50</span>
          <span className="absolute right-0">99</span>
        </div>
      )}
    </div>
  );
}

// Подпись к линейке и гистограмме: какой знак что значит.
export function Legend({ showYou = true, showModel = false, showOutcome = false }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-2">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-3 h-1.5 rounded-full bg-accent" />мнение группы
      </span>
      {showYou && (
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1 h-3 rounded-full bg-ink" />ваш прогноз
        </span>
      )}
      {showModel && (
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rotate-45 rounded-[1px] border-[1.5px] border-ink-2" />модель
        </span>
      )}
      {showOutcome && (
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-ink" />исход
        </span>
      )}
    </div>
  );
}
