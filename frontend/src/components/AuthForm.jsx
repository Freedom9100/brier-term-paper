import { useState } from 'react';
import { postJson } from '../api';
import { Button } from './Button';

export function AuthForm({ endpoint, onSuccess, label, pendingLabel, children }) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  function submitAccount(event) {
    event.preventDefault();
    if (isSending) return;

    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setError('');
    setIsSending(true);
    postJson(endpoint, fields)
      .then(({ user }) => onSuccess(user))
      .catch((requestError) => {
        setError(requestError instanceof TypeError ? 'Проверьте подключение и попробуйте ещё раз.' : requestError.message);
      })
      .finally(() => setIsSending(false));
  }

  return (
    <form onSubmit={submitAccount} method="post" className="flex flex-col gap-4">
      {children}
      {error && <p role="alert" className="rounded-xl bg-neg-soft px-4 py-3 text-[14px] text-neg">{error}</p>}
      <div className="pt-2">
        <Button type="submit" disabled={isSending} size="lg" full>{isSending ? pendingLabel : label}</Button>
      </div>
    </form>
  );
}
