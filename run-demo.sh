#!/usr/bin/env bash
# Запуск локального демо «Брайера» с отдельной базой данных.
set -euo pipefail
umask 077
cd "$(dirname "$0")"

for command in python3 npm initdb pg_ctl createdb curl; do
  if ! command -v "$command" >/dev/null; then
    printf 'Для запуска нужна команда %s. Проверьте раздел «Локальный запуск без демоданных» в README.\n' "$command" >&2
    exit 1
  fi
done

demo_dir="${BRIER_DEMO_DIR:-$PWD/.demo-local}"
mkdir -p "$demo_dir"
demo_dir="$(cd "$demo_dir" && pwd -P)"
chmod 700 "$demo_dir"
socket_dir="$(mktemp -d /tmp/brier-db.XXXXXX)"
python="$demo_dir/venv/bin/python"
postgres_started=0
django_pid=
vite_pid=
watcher_pid=

cleanup() {
  for pid in "$django_pid" "$vite_pid" "$watcher_pid"; do
    if [ -n "$pid" ]; then
      kill "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
  done
  if [ "$postgres_started" -eq 1 ]; then
    pg_ctl -D "$demo_dir/postgres" -m fast -w stop
  fi
  rmdir "$socket_dir" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if [ ! -x "$python" ]; then
  python3 -m venv "$demo_dir/venv"
fi
if [ ! -f "$demo_dir/python-ready" ] || [ backend/requirements.txt -nt "$demo_dir/python-ready" ]; then
  "$python" -m pip install -r backend/requirements.txt
  touch "$demo_dir/python-ready"
fi
if [ ! -x frontend/node_modules/.bin/vite ] || [ frontend/package-lock.json -nt frontend/node_modules/.package-lock.json ]; then
  npm ci --prefix frontend
fi

export DEBUG=True ALLOWED_HOSTS=127.0.0.1,localhost CSRF_TRUSTED_ORIGINS=
export BRIER_MODEL_DIR="$demo_dir/models"
export BRIER_DJANGO_PORT="${BRIER_DJANGO_PORT:-8000}"
export DB_NAME=brier_demo DB_USER=brier DB_HOST="$socket_dir" DB_PORT=55491 DB_PASSWORD=
if [ ! -s "$demo_dir/django-key" ]; then
  "$python" -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' > "$demo_dir/django-key"
fi
export SECRET_KEY="$(cat "$demo_dir/django-key")"

if [ ! -f "$demo_dir/postgres/PG_VERSION" ]; then
  initdb -D "$demo_dir/postgres" -A trust --username="$DB_USER" --locale=en_US.UTF-8 --encoding=UTF8
fi
pg_ctl -D "$demo_dir/postgres" -l "$demo_dir/postgres.log" -o "-h '' -k '$DB_HOST' -p $DB_PORT" -w start
postgres_started=1
if [ ! -f "$demo_dir/database-ready" ]; then
  createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
  touch "$demo_dir/database-ready"
fi

"$python" backend/manage.py migrate --noinput
"$python" backend/manage.py seed_categories
accounts="$("$python" backend/manage.py seed_demo)"
if [ -n "$accounts" ]; then
  printf '%s\n' "$accounts" >> "$demo_dir/accounts.txt"
fi
"$python" backend/manage.py runserver "127.0.0.1:$BRIER_DJANGO_PORT" --noreload &
django_pid=$!
(cd frontend && exec ./node_modules/.bin/vite --host 127.0.0.1 --port 5173 --strictPort) &
vite_pid=$!
"$python" backend/manage.py close_questions --watch &
watcher_pid=$!

for attempt in {1..30}; do
  if ! kill -0 "$django_pid" "$vite_pid" "$watcher_pid" 2>/dev/null; then
    printf 'Один из сервисов не запустился. Посмотрите сообщение выше.\n' >&2
    exit 1
  fi
  if curl --fail --silent --max-time 1 http://127.0.0.1:5173/api/health/ >/dev/null; then
    printf '\nДемо запущено: http://127.0.0.1:5173/\n'
    if [ -s "$demo_dir/accounts.txt" ]; then
      printf 'Демо-аккаунты (логин и пароль):\n'
      cat "$demo_dir/accounts.txt"
    fi
    printf 'Для остановки нажмите Ctrl+C.\n'
    while kill -0 "$django_pid" "$vite_pid" "$watcher_pid" 2>/dev/null; do sleep 1; done
    exit 1
  fi
  sleep 1
done
printf 'Истекло время ожидания запуска.\n' >&2
exit 1
