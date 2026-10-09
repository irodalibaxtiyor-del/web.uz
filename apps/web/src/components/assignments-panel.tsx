'use client';

import type { AssignmentAdmin } from '@webdizayn/shared';
import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { send } from '@/lib/api';
import { formatDateTime } from '@/lib/dates';
import { useApi } from '@/lib/use-api';
import { AssignmentStatusBadge } from './assignment-ui';
import { Button, ErrorText, inputClass, LoadState } from './ui';

/** Lesson editor section listing a lesson's assignments for course staff. */
export function AssignmentsPanel({ base, lessonId }: { base: string; lessonId: string }) {
  const id = useId();
  const { state, reload } = useApi<AssignmentAdmin[]>(`${base}/lessons/${lessonId}/assignments`);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get('title') ?? '').trim();
    if (title.length < 2) return setError("Nom kamida 2 belgidan iborat bo'lsin");
    setError(null);
    setPending(true);
    const res = await send('POST', `${base}/lessons/${lessonId}/assignments`, { title });
    setPending(false);
    if (!res.ok) return setError(res.message);
    form.reset();
    reload();
  }

  return (
    <section aria-labelledby={`${id}-h`} className="space-y-4">
      <h2 id={`${id}-h`} className="text-xl font-semibold">
        Topshiriqlar
      </h2>
      <p className="text-sm text-slate-500">
        Topshiriq — talaba muddat ichida topshiradigan va siz baholaydigan katta ish. U darsning
        ketma-ket ochilishiga ta&apos;sir qilmaydi. Yangi topshiriq qoralama bo&apos;lib yaratiladi.
      </p>
      <LoadState state={state}>
        {(list) =>
          list.length === 0 ? (
            <p className="text-slate-500">Hali topshiriq yo&apos;q.</p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {list.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{a.title}</span>
                    <AssignmentStatusBadge status={a.status} />
                    <span className="text-xs text-slate-500">
                      {a.deadline ? `Muddat: ${formatDateTime(a.deadline)}` : 'Muddatsiz'}
                      {' · '}
                      {a.submittedCount} ta talaba topshirgan
                    </span>
                  </span>
                  <Link
                    href={`${base}/manage/assignments/${a.id}`}
                    className="text-sm text-brand-600 hover:underline dark:text-brand-400"
                  >
                    Tahrirlash va javoblar
                  </Link>
                </li>
              ))}
            </ul>
          )
        }
      </LoadState>
      <form onSubmit={onSubmit} noValidate className="space-y-2">
        <div className="flex gap-2">
          <label htmlFor={`${id}-title`} className="sr-only">
            Yangi topshiriq nomi
          </label>
          <input
            id={`${id}-title`}
            name="title"
            placeholder="Yangi topshiriq nomi"
            className={inputClass}
          />
          <Button type="submit" variant="secondary" disabled={pending} className="shrink-0">
            + Topshiriq
          </Button>
        </div>
        {error && <ErrorText>{error}</ErrorText>}
      </form>
    </section>
  );
}
