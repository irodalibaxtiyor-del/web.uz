'use client';

import type { CheckErrorCode, CheckRunStatus, CheckRunView } from '@webdizayn/shared';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { api, send } from '@/lib/api';
import { Icon, type IconName } from './icons';

export const CHECK_STATUS: Record<CheckRunStatus, { label: string; icon: IconName; tone: string }> =
  {
    QUEUED: { label: 'Navbatda', icon: 'clock', tone: 'text-slate-600 dark:text-slate-300' },
    RUNNING: {
      label: 'Tekshirilmoqda',
      icon: 'circleHalf',
      tone: 'text-brand-700 dark:text-brand-300',
    },
    PASSED: {
      label: "Tekshiruvdan o'tdi",
      icon: 'checkCircle',
      tone: 'text-emerald-700 dark:text-emerald-400',
    },
    FAILED: {
      label: "Tekshiruvdan o'tmadi",
      icon: 'circleX',
      tone: 'text-red-700 dark:text-red-400',
    },
    ERROR: {
      label: 'Tekshiruvda xatolik',
      icon: 'alertCircle',
      tone: 'text-amber-700 dark:text-amber-400',
    },
    TIMEOUT: { label: 'Vaqt tugadi', icon: 'clock', tone: 'text-amber-700 dark:text-amber-400' },
  };

export const CHECK_ERROR_TEXT: Record<CheckErrorCode, string> = {
  NO_ENTRY: 'Loyihada index.html fayli yo‘q. Tekshiruv shu fayldan boshlanadi.',
  LOAD_TIMEOUT:
    'Sahifa belgilangan vaqtda yuklanmadi yoki javob bermay qoldi. Cheksiz sikl yo‘qligini tekshiring.',
  BUDGET: 'Tekshiruv uchun ajratilgan vaqt tugadi. Kod juda uzoq ishlayapti.',
  PAGE_CRASHED: 'Sahifa ishlashdan to‘xtadi (masalan, juda ko‘p xotira ishlatildi).',
  ENGINE:
    'Tekshiruv xizmati hozir ishlamayapti. Bu sizning xatoingiz emas, keyinroq qayta urinib ko‘ring.',
};

const isDone = (s: CheckRunStatus) => s !== 'QUEUED' && s !== 'RUNNING';
const POLL_MS = 1000;
const POLL_MAX = 90;

/**
 * Starts a server-side CHECK and polls it until it finishes. `onFinished` lets the page
 * refresh the exercise status (CHECK may have changed it).
 */
export function useCheckRun(base: string, onFinished: (run: CheckRunView) => void) {
  const [run, setRun] = useState<CheckRunView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const attempts = useRef(0);
  const finished = useRef(onFinished);
  useEffect(() => {
    finished.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    let cancelled = false;
    void api<{ run: CheckRunView | null }>(`${base}/checks/latest`).then((res) => {
      if (!cancelled && res.ok && res.data.run) setRun(res.data.run);
    });
    return () => {
      cancelled = true;
    };
  }, [base]);

  // Poll while the current run is unfinished; each new snapshot schedules the next poll.
  useEffect(() => {
    if (!run || isDone(run.status)) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const res = await api<CheckRunView>(`${base}/checks/${run.id}`);
      if (cancelled) return;
      if (!res.ok) return setError(res.message);
      if (++attempts.current > POLL_MAX && !isDone(res.data.status)) {
        return setError('Tekshiruv natijasini olish uzoq cho‘zildi. Sahifani yangilang.');
      }
      setRun(res.data);
      if (isDone(res.data.status)) finished.current(res.data);
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [base, run]);

  const start = useCallback(async () => {
    setError(null);
    setStarting(true);
    const res = await send<CheckRunView>('POST', `${base}/checks`);
    setStarting(false);
    if (!res.ok) return setError(res.message);
    attempts.current = 0;
    setRun(res.data);
  }, [base]);

  const busy = starting || (run !== null && !isDone(run.status));
  return { run, error, busy, start };
}

export function CheckResultPanel({ run }: { run: CheckRunView }) {
  const s = CHECK_STATUS[run.status];
  const done = isDone(run.status);
  const verdict = run.status === 'PASSED' || run.status === 'FAILED';
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} aria-live="polite" className="card space-y-4 p-5 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={titleId} className={`text-lg font-semibold ${s.tone}`}>
          <Icon name={s.icon} className="inline size-4 align-[-0.2em]" /> {s.label}
        </h2>
        {verdict && (
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {run.passedCount} / {run.total} shart bajarildi
          </span>
        )}
      </header>

      {!done && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Saqlangan kodingiz serverda haqiqiy brauzerda tekshirilmoqda…
        </p>
      )}
      {run.errorCode && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {CHECK_ERROR_TEXT[run.errorCode]}
        </p>
      )}

      {done && run.checks.length > 0 && (
        <ul className="space-y-2">
          {run.checks.map((c, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <Icon
                name={c.passed ? 'checkCircle' : 'circleX'}
                className={`inline size-4 align-[-0.2em] ${c.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}
              />
              <span>
                <span className="sr-only">{c.passed ? 'Bajarildi: ' : 'Bajarilmadi: '}</span>
                {c.title}
                {c.hint && (
                  <span className="mt-0.5 block text-slate-500 dark:text-slate-400">
                    Maslahat: {c.hint}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {done && verdict && run.hidden.total > 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Yashirin tekshiruvlar: {run.hidden.passed} / {run.hidden.total} bajarildi. Ular topshiriq
          shartlarini to‘liq bajarganingizni tekshiradi.
        </p>
      )}
    </section>
  );
}
