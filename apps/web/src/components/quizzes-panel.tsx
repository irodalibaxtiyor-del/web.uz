'use client';

import type { QuizAdmin } from '@webdizayn/shared';
import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { Button, ErrorText, inputClass, LoadState } from './ui';

/** Lesson editor section listing a lesson's quizzes for course staff. */
export function QuizzesPanel({ base, lessonId }: { base: string; lessonId: string }) {
  const id = useId();
  const { state, reload } = useApi<QuizAdmin[]>(`${base}/lessons/${lessonId}/quizzes`);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get('title') ?? '').trim();
    if (title.length < 2) return setError("Nom kamida 2 belgidan iborat bo'lsin");
    setError(null);
    setPending(true);
    const res = await send('POST', `${base}/lessons/${lessonId}/quizzes`, { title });
    setPending(false);
    if (!res.ok) return setError(res.message);
    form.reset();
    reload();
  }

  return (
    <section aria-labelledby={`${id}-h`} className="space-y-4">
      <h2 id={`${id}-h`} className="text-xl font-semibold">
        Testlar
      </h2>
      <p className="text-sm text-slate-500">
        Test server tomonida avtomatik tekshiriladi, to&apos;g&apos;ri javoblar talabaga
        yuborilmaydi. Faol test, xuddi mashq kabi, darsni tugatish sharti bo&apos;ladi. Yangi test
        faol emas holda yaratiladi.
      </p>
      <LoadState state={state}>
        {(list) =>
          list.length === 0 ? (
            <p className="text-slate-500">Hali test yo&apos;q.</p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {list.map((q) => (
                <li
                  key={q.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={q.isActive ? '' : 'text-slate-400 line-through'}>
                      {q.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {q.questions.length} ta savol · o&apos;tish {q.passingPercent}%
                      {!q.isActive && ' · faol emas'}
                      {' · '}
                      {q.passedBy}/{q.attemptedBy} talaba o&apos;tgan
                    </span>
                  </span>
                  <Link
                    href={`${base}/manage/quizzes/${q.id}`}
                    className="text-sm text-brand-600 hover:underline dark:text-brand-400"
                  >
                    Tahrirlash
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
            Yangi test nomi
          </label>
          <input
            id={`${id}-title`}
            name="title"
            placeholder="Yangi test nomi"
            className={inputClass}
          />
          <Button type="submit" variant="secondary" disabled={pending} className="shrink-0">
            + Test
          </Button>
        </div>
        {error && <ErrorText>{error}</ErrorText>}
      </form>
    </section>
  );
}
