import { useSearchParams } from 'react-router';
import { Search as SearchIcon } from 'lucide-react';

export function Search({ className = '' }) {
  const [params] = useSearchParams();

  return (
    <form action="/" method="get" role="search" className={`${className} flex items-center gap-2.5 h-11 px-4 rounded-full border border-transparent bg-paper-2 text-[15px] focus-within:bg-paper focus-within:border-ink focus-within:ring-4 focus-within:ring-ink/8`}>
      <input key={params.get('q')} name="q" type="search" defaultValue={params.get('q') ?? ''} maxLength={140}
        placeholder="Поиск по вопросам" aria-label="Поиск по вопросам"
        className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-ink-2" />
      {['status', 'category', 'sort'].map((name) => (
        params.has(name) && <input key={name} name={name} type="hidden" value={params.get(name)} />
      ))}
      <button type="submit" aria-label="Найти" className="text-ink-2">
        <SearchIcon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
      </button>
    </form>
  );
}
