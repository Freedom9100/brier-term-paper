// Демонстрационные данные для этапа вёрстки. Перенесены из дизайн-макета.
// На следующем этапе их заменят ответы API: каждая страница будет
// получать те же поля через fetch, а не импортом из этого файла.

// Участники. Ключ — имя пользователя, оно же стоит в адресе профиля /users/:username.
// tone — оттенок кружка с инициалами, от 1 (светлый) до 6 (почти чёрный).
export const people = {
  'alina.s': { username: 'alina.s', name: 'Алина Сафина', tone: 3 },
  timur_h: { username: 'timur_h', name: 'Тимур Хасанов', tone: 5 },
  mirakim: { username: 'mirakim', name: 'Мира Ким', tone: 1 },
  'd.orlov': { username: 'd.orlov', name: 'Даниил Орлов', tone: 4 },
  kbelova: { username: 'kbelova', name: 'Ксения Белова', tone: 2 },
  artlbdv: { username: 'artlbdv', name: 'Артём Лебедев', tone: 6 },
  'ruslan.i': { username: 'ruslan.i', name: 'Руслан Ибрагимов', tone: 3 },
  polyaz: { username: 'polyaz', name: 'Полина Зайцева', tone: 1 },
  egorsm: { username: 'egorsm', name: 'Егор Смирнов', tone: 4 },
  emil: { username: 'emil', name: 'Эмиль Тухватуллин', tone: 6 },
  ilyaf: { username: 'ilyaf', name: 'Илья Фёдоров', tone: 2 },
  sofiag: { username: 'sofiag', name: 'София Гарипова', tone: 5 },
};

// Тот, кто сейчас вошёл в систему (для ролей user и admin).
export const currentUser = people.emil;

export const categories = [
  { name: 'Учёба', count: 14 },
  { name: 'Технологии', count: 9 },
  { name: 'Погода', count: 6 },
  { name: 'Экономика', count: 7 },
  { name: 'Кино и игры', count: 5 },
  { name: 'Спорт', count: 8 },
];

// Вопросы. status: open — приём открыт, closed — приём закрыт, resolved — исход известен.
// crowd — мнение группы (средний прогноз), you — прогноз текущего пользователя,
// model — прогноз модели (есть только после закрытия приёма), outcome — исход: 1 «Да», 0 «Нет».
// hist — гистограмма: сколько участников поставили 1–10 %, 11–20 % … 91–99 %.
// Порядок — «скоро закрытие»: так лента и показывает вопросы.
export const questions = {
  matan: {
    id: 'matan', status: 'open', soon: true,
    title: 'Сдаст ли больше половины группы ИС-22 экзамен по матанализу с первого раза?',
    category: 'Учёба', author: 'd.orlov', created: '7 окт',
    closes: '8 октября, 23:59', closesIn: 'через 5 ч',
    crowd: 41, participants: 27, comments: 9,
    hist: [1, 2, 3, 4, 5, 4, 3, 2, 2, 1],
  },
  snow: {
    id: 'snow', status: 'open',
    title: 'Выпадет ли в Москве первый снег до 1 ноября 2026 года?',
    body: 'Засчитывается снег или мокрый снег, отмеченный в сводке Гидрометцентра по Москве. «Следы снега» не считаются.',
    category: 'Погода', author: 'mirakim', created: '2 окт',
    closes: '31 октября, 23:59', closesIn: 'через 23 дня',
    crowd: 65, participants: 128, comments: 14, you: 70,
    hist: [2, 3, 5, 8, 12, 16, 22, 28, 21, 11],
  },
  gta: {
    id: 'gta', status: 'open',
    title: 'Выйдет ли GTA VI 19 ноября 2026 года, как обещал Rockstar?',
    category: 'Кино и игры', author: 'timur_h', created: '29 сен',
    closes: '20 октября, 23:59', closesIn: 'через 12 дней',
    crowd: 58, participants: 342, comments: 61, you: 45,
    hist: [14, 18, 22, 30, 41, 52, 60, 55, 34, 16],
  },
  usd: {
    id: 'usd', status: 'open',
    title: 'Превысит ли официальный курс доллара 100 ₽ на 1 декабря 2026 года?',
    category: 'Экономика', author: 'kbelova', created: '1 окт',
    closes: '7 ноября, 23:59', closesIn: 'через 30 дней',
    crowd: 23, participants: 211, comments: 27,
    hist: [38, 52, 44, 30, 20, 12, 8, 4, 2, 1],
  },
  starship: {
    id: 'starship', status: 'closed',
    title: 'Запустит ли SpaceX корабль Starship с людьми на борту до конца 2026 года?',
    category: 'Технологии', author: 'artlbdv', created: '12 сен',
    closes: '6 октября, 12:00', closesIn: 'приём закрыт 6 окт',
    crowd: 9, model: 6, participants: 176, comments: 33, you: 12,
    hist: [96, 40, 18, 9, 5, 4, 2, 1, 1, 0],
  },
  openday: {
    id: 'openday', status: 'resolved', outcome: 1,
    title: 'Придёт ли на день открытых дверей колледжа больше 300 человек?',
    body: 'Исход — по данным приёмной комиссии, которые публикуются на сайте колледжа в понедельник после дня открытых дверей.',
    category: 'Учёба', author: 'polyaz', created: '15 сен',
    closes: '3 октября, 18:00', resolvedAt: '6 октября', source: 'приёмная комиссия',
    crowd: 71, model: 64, participants: 96, comments: 22, you: 80,
    hist: [1, 1, 2, 4, 6, 9, 14, 24, 22, 13],
  },
};

// Комментарии по id вопроса. author: true — комментарий автора вопроса.
export const comments = {
  snow: [
    { who: 'timur_h', when: '2 ч', text: 'По архиву погоды выходит примерно каждый второй год. Ставлю 55, а не 65.', forecast: 55 },
    { who: 'mirakim', when: '5 ч', text: 'Уточню критерий: считаем по сводке Гидрометцентра, снег или мокрый снег. «Следы» не в счёт.', author: true, forecast: 60 },
    { who: 'd.orlov', when: '1 д', text: 'Двухнедельный прогноз пока тёплый. Толпа слишком уверена.', forecast: 40 },
  ],
  openday: [
    { who: 'polyaz', when: '2 д', text: 'Приёмная комиссия опубликовала цифры: исход — «Да». Спасибо всем, кто участвовал!', author: true, forecast: 75 },
    { who: 'egorsm', when: '2 д', text: 'Модель снова осторожнее толпы. Интересно, это из-за малого числа вопросов в категории?', forecast: 70 },
  ],
};

// Строка рейтинга. Средний Брайер считается из средних очков:
// очки V = 100 · (1 − 2 · B), значит B = (1 − V / 100) / 2.
function makeLeaderRow(username, place, avg, count) {
  return { ...people[username], place, avg, brier: (1 - avg / 100) / 2, count };
}

export const leaderboard = [
  makeLeaderRow('alina.s', 1, 78.4, 112),
  makeLeaderRow('timur_h', 2, 74.0, 64),
  makeLeaderRow('mirakim', 3, 71.2, 88),
  makeLeaderRow('d.orlov', 4, 69.6, 41),
  makeLeaderRow('kbelova', 5, 68.0, 57),
  makeLeaderRow('artlbdv', 6, 66.8, 33),
  makeLeaderRow('ruslan.i', 7, 65.2, 29),
  makeLeaderRow('polyaz', 8, 64.4, 72),
  makeLeaderRow('egorsm', 9, 63.8, 19),
  makeLeaderRow('sofiag', 10, 63.0, 25),
  makeLeaderRow('ilyaf', 11, 62.6, 14),
];
export const myRow = makeLeaderRow('emil', 14, 61.8, 47);
export const totalRanked = 86;

// Калибровка: p — заявленная уверенность, f — сколько процентов сбылось, n — прогнозов.
// Демо-данные есть только у двух участников.
export const calibration = {
  'alina.s': [
    { p: 10, f: 12, n: 18 },
    { p: 30, f: 27, n: 22 },
    { p: 50, f: 52, n: 25 },
    { p: 70, f: 68, n: 27 },
    { p: 90, f: 86, n: 20 },
  ],
  emil: [
    { p: 10, f: 22, n: 6 },
    { p: 30, f: 35, n: 9 },
    { p: 50, f: 48, n: 11 },
    { p: 70, f: 61, n: 10 },
    { p: 90, f: 64, n: 11 },
  ],
};

// Разрешённые прогнозы участника: p — прогноз, outcome — исход.
export const resolvedForecasts = {
  'alina.s': [
    { questionId: 'openday', title: 'Придёт ли на день открытых дверей колледжа больше 300 человек?', p: 75, outcome: 1, date: '6 окт' },
    { title: 'Наберёт ли команда колледжа больше 50 баллов на олимпиаде по программированию?', p: 70, outcome: 1, date: '29 сен' },
    { title: 'Отменят ли пары 2 сентября из-за жары?', p: 15, outcome: 0, date: '2 сен' },
    { title: 'Сдадут ли все курсовые в группе ИС-21 до 20 сентября?', p: 20, outcome: 0, date: '21 сен' },
    { title: 'Откроется ли новая столовая в корпусе Б к 1 сентября?', p: 40, outcome: 0, date: '1 сен' },
  ],
  emil: [
    { questionId: 'openday', title: 'Придёт ли на день открытых дверей колледжа больше 300 человек?', p: 80, outcome: 1, date: '6 окт' },
    { title: 'Наберёт ли команда колледжа больше 50 баллов на олимпиаде по программированию?', p: 60, outcome: 1, date: '29 сен' },
    { title: 'Сдадут ли все курсовые в группе ИС-21 до 20 сентября?', p: 30, outcome: 0, date: '21 сен' },
    { title: 'Отменят ли пары 2 сентября из-за жары?', p: 90, outcome: 0, date: '2 сен' },
  ],
};

// Вопросы, которые задал текущий пользователь, со статусом модерации.
export const myQuestions = [
  { title: 'Будет ли защита курсовых у ИС-23 раньше 20 декабря?', status: 'moderation', date: 'отправлен 7 окт' },
  { title: 'Выиграет ли сборная колледжа городской турнир по футболу?', status: 'rejected', date: 'отклонён 5 окт', reason: 'Нет даты турнира и источника, по которому определится исход. Укажите дату и где опубликуют результат.' },
  { title: 'Придёт ли на день открытых дверей колледжа больше 300 человек?', status: 'resolved', date: 'разрешён 6 окт', participants: 96, questionId: 'openday' },
  { title: 'Наберёт ли команда колледжа больше 50 баллов на олимпиаде по программированию?', status: 'published', date: 'закрытие 14 окт', participants: 58 },
];
