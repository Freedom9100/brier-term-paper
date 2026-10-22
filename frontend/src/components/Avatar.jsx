// Кружок с инициалами вместо фотографии: загрузки файлов в проекте нет.
// Цвет кружка задаёт поле tone участника (1–6), размер — проп size.

const TONE_CLASSES = {
  1: 'bg-tone-1 text-ink',
  2: 'bg-tone-2 text-ink',
  3: 'bg-tone-3 text-ink',
  4: 'bg-tone-4 text-white',
  5: 'bg-tone-5 text-white',
  6: 'bg-tone-6 text-white',
};

const SIZE_CLASSES = {
  32: 'size-8 text-[12px]',
  36: 'size-9 text-[13px]',
  40: 'size-10 text-[14px]',
  48: 'size-12 text-[17px]',
  72: 'size-[72px] text-[24px]',
  84: 'size-[84px] text-[28px]',
};

// «Алина Сафина» → «АС»
function getInitials(name) {
  const words = name.split(' ');
  return words.map((word) => word[0]).slice(0, 2).join('');
}

// className — дополнительные классы, например другой размер на планшете: 'md:size-[84px]'.
export function Avatar({ person, size = 36, className = '' }) {
  return (
    <span
      className={`${SIZE_CLASSES[size]} ${TONE_CLASSES[person.tone]} ${className} inline-flex items-center justify-center rounded-full font-semibold shrink-0 tracking-[-0.02em]`}
    >
      {getInitials(person.name)}
    </span>
  );
}
