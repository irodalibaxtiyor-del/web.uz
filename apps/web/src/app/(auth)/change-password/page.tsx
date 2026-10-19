'use client';

import { changePasswordSchema, PASSWORD_MIN_LENGTH, type MeResponse } from '@webdizayn/shared';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { ErrorText, LoadState } from '@/components/ui';
import { api, send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900';

export default function ChangePasswordPage() {
  const router = useRouter();
  const id = useId();
  const { state } = useApi<MeResponse>('/auth/me');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (form.newPassword !== form.confirm) {
      setError('Yangi parol va uning takrori bir xil emas');
      return;
    }
    const parsed = changePasswordSchema.safeParse(form);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message.startsWith('Yangi parol')
          ? parsed.error.issues[0].message
          : `Yangi parol kamida ${PASSWORD_MIN_LENGTH} belgidan iborat bo'lsin`,
      );
      return;
    }
    setPending(true);
    const res = await send('POST', '/auth/password', parsed.data);
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.replace('/dashboard');
    router.refresh();
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <LoadState state={state}>
      {(me) => (
        <form method="post" onSubmit={onSubmit} noValidate className="mx-auto max-w-sm space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Parolni almashtiring</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {me.mustChangePassword
                ? `${me.fullName}, sizga vaqtinchalik parol berilgan. Davom etish uchun o‘zingizning parolingizni o‘rnating.`
                : 'Joriy parolni va yangi parolni kiriting.'}
            </p>
            {me.login && (
              <p className="text-sm">
                Loginingiz: <strong className="font-mono">{me.login}</strong>
              </p>
            )}
          </div>
          {/* Lets password managers attach the new password to the right account. */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={me.login ?? me.email ?? ''}
            readOnly
            hidden
          />
          {(
            [
              ['currentPassword', 'Joriy (vaqtinchalik) parol', 'current-password'],
              ['newPassword', 'Yangi parol', 'new-password'],
              ['confirm', 'Yangi parolni takrorlang', 'new-password'],
            ] as const
          ).map(([name, label, auto]) => (
            <div key={name} className="space-y-1.5">
              <label
                htmlFor={`${id}-${name}`}
                className="text-sm font-semibold text-ink dark:text-slate-200"
              >
                {label}
              </label>
              <input
                id={`${id}-${name}`}
                name={name}
                type="password"
                autoComplete={auto}
                required
                minLength={name === 'currentPassword' ? undefined : PASSWORD_MIN_LENGTH}
                aria-describedby={name === 'newPassword' ? `${id}-hint` : undefined}
                className={inputClass}
              />
              {name === 'newPassword' && (
                <p id={`${id}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
                  Kamida {PASSWORD_MIN_LENGTH} belgi. Boshqa saytlarda ishlatmagan parol tanlang.
                </p>
              )}
            </div>
          ))}
          {error && <ErrorText>{error}</ErrorText>}
          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary w-full py-3 text-base"
          >
            {pending ? 'Kuting…' : 'Parolni saqlash'}
          </button>
          <button
            type="button"
            onClick={logout}
            className="w-full text-center text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
            Chiqish
          </button>
        </form>
      )}
    </LoadState>
  );
}
