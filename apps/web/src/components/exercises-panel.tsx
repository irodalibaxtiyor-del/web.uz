'use client';

import type { ExerciseAdmin } from '@webdizayn/shared';
import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { Button, DIFFICULTY_LABEL, ErrorText, inputClass, LoadState } from './ui';

/** Lesson editor section listing a lesson's exercises for course staff. */
export function ExercisesPanel({ base, lessonId }: { base: string; lessonId: string }) {
  const id = useId();
  const { state, reload } = useApi<ExerciseAdmin[]>(`${base}/lessons/${lessonId}/exercises`);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get('title') ?? '').trim();
    if (title.length < 2) return setError("Nom kamida 2 belgidan iborat bo'lsin");
    setError(null);
    setPending(true);
    const res = await send('POST', `${base}/lessons/${lessonId}/exercises`, { title });
    setPending(false);
    if (!res.ok) return setError(res.message);
    form.reset();
    reload();
  }

  return (
    <section aria-labelledby={`${id}-h`} className="space-y-4">
      <h2 id={`${id}-h`} className="text-xl font-semibold">
        Mashqlar
      </h2>
      <p className="text-sm text-slate-500">
        Darsda faol mashq bo&apos;lsa, talaba barcha mashqlardan o&apos;tgandan keyingina keyingi
        dars ochiladi.
      </p>
      <LoadState state={state}>
        {(list) =>
          list.length === 0 ? (
            <p className="text-slate-500">Hali mashq yo&apos;q.</p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {list.map((ex) => (
                <li
                  key={ex.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="space-x-2">
                    <span className={ex.isActive ? '' : 'text-slate-400 line-through'}>
                      {ex.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {DIFFICULTY_LABEL[ex.difficulty]}
                      {!ex.isActive && ' · faol emas'}
                    </span>
                  </span>
                  <Link
                    href={`${base}/manage/exercises/${ex.id}`}
                    className="text-sm text-brand-600 hover:underline dark:text-brand-400"
                  >
                    Tahrirlash va natijalar
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
            Yangi mashq nomi
          </label>
          <input
            id={`${id}-title`}
            name="title"
            placeholder="Yangi mashq nomi"
            className={inputClass}
          />
          <Button type="submit" variant="secondary" disabled={pending} className="shrink-0">
            + Mashq
          </Button>
        </div>
        {error && <ErrorText>{error}</ErrorText>}
      </form>
    </section>
  );
}
