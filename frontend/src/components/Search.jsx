import { Search as SearchIcon } from 'lucide-react';

// Поле поиска по вопросам. Пока только внешний вид: искать начнём,
// когда появится API. className — ширина и отступы, их задаёт место, где поле стоит.
// Иконка импортирована под именем SearchIcon, чтобы не совпадать с именем компонента.
export function Search({ className = '' }) {
  return (
    <label className={`${className} flex items-center gap-2.5 h-11 px-4 rounded-full border border-transparent bg-paper-2 text-[15px] focus-within:bg-paper focus-within:border-ink focus-within:ring-4 focus-within:ring-ink/8`}>
      <SearchIcon className="size-[18px] text-ink-2 shrink-0" strokeWidth={2} aria-hidden="true" />
      <input
        type="search"
        placeholder="Поиск по вопросам"
        aria-label="Поиск по вопросам"
        className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-ink-2"
      />
    </label>
  );
}
