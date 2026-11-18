function getCsrfToken() {
  const tokenCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('csrftoken='));
  return tokenCookie?.slice('csrftoken='.length) ?? '';
}

export function getSession(signal) {
  return getJson('/api/auth/session/', signal);
}

export function getJson(path, signal) {
  return requestJson(path, { signal });
}

export function postJson(path, data = {}) {
  return sendJson('POST', path, data);
}

export function putJson(path, data) {
  return sendJson('PUT', path, data);
}

export function deleteJson(path) {
  return sendJson('DELETE', path);
}

function sendJson(method, path, data) {
  return requestJson(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    body: JSON.stringify(data),
  });
}

function requestJson(path, options) {
  return fetch(path, { ...options, credentials: 'same-origin' })
    .then((response) => response.json().catch(() => null).then((data) => {
      if (response.ok && data) {
        return data;
      }
      if (response.status === 403 && !data) {
        throw new Error('Обновите страницу и попробуйте ещё раз.');
      }
      const messages = Object.values(data?.fields ?? {}).flat();
      const message = data?.error || data?.detail || messages.join(' ') || 'Сервер недоступен. Попробуйте ещё раз.';
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }));
}
