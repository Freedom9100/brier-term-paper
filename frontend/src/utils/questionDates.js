const shortDate = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Moscow', day: 'numeric', month: 'short',
});
const deadlineDate = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Moscow', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
});

export function formatQuestionDate(date) {
  return shortDate.format(new Date(date));
}

export function formatDeadline(date) {
  return deadlineDate.format(new Date(date));
}
