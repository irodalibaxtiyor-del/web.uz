'use client';

import { loginSchema, PASSWORD_MIN_LENGTH, registerSchema } from '@webdizayn/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { api } from '@/lib/api';

type Mode = 'login' | 'register';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isRegister = mode === 'register';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = (isRegister ? registerSchema : loginSchema).safeParse(form);
    if (!parsed.success) {
      setError(
        isRegister
          ? `Ma'lumotlarni tekshiring: parol kamida ${PASSWORD_MIN_LENGTH} belgidan iborat bo'lsin`
          : "Email va parolni to'g'ri kiriting",
      );
      return;
    }
    setPending(true);
    const res = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(parsed.data) });
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    // method="post": if the script has not loaded yet, a native submit must never put the
    // password into the URL (browser history, server and proxy logs).
    <form method="post" onSubmit={onSubmit} noValidate className="mx-auto max-w-sm space-y-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isRegister ? "Ro'yxatdan o'tish" : 'Xush kelibsiz!'}
        </h1>
        <p className="text-sm text-slate-500">
          {isRegister
            ? 'Bir necha soniyada akkaunt yarating va birinchi darsni boshlang.'
            : 'Davom etish uchun akkauntingizga kiring.'}
        </p>
      </div>
      {isRegister && (
        <div className="space-y-1.5">
          <label
            htmlFor={`${id}-name`}
            className="text-sm font-semibold text-ink dark:text-slate-200"
          >
            Ism familiya
          </label>
          <input
            id={`${id}-name`}
            name="fullName"
            autoComplete="name"
            required
            className={inputClass}
          />
        </div>
      )}
      <div className="space-y-1.5">
        <label
          htmlFor={`${id}-email`}
          className="text-sm font-semibold text-ink dark:text-slate-200"
        >
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor={`${id}-password`}
          className="text-sm font-semibold text-ink dark:text-slate-200"
        >
          Parol
        </label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          minLength={isRegister ? PASSWORD_MIN_LENGTH : undefined}
          required
          aria-describedby={isRegister ? `${id}-pw-hint` : undefined}
          className={inputClass}
        />
        {isRegister && (
          <p id={`${id}-pw-hint`} className="text-xs text-slate-500">
            Kamida {PASSWORD_MIN_LENGTH} belgi
          </p>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary w-full py-3 text-base">
        {pending ? 'Kuting…' : isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}
      </button>
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {isRegister ? (
          <>
            Akkauntingiz bormi?{' '}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              Kirish
            </Link>
          </>
        ) : (
          <>
            Akkauntingiz yo&apos;qmi?{' '}
            <Link
              href="/register"
              className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
