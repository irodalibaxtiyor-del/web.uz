'use client';

import type { ExerciseAdmin, QuizAdmin } from '@webdizayn/shared';
import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { Button, ErrorText, inputClass, LoadState } from './ui';
import { Icon } from './icons';

/** Lesson editor section listing a lesson's quizzes for course staff. */
export function QuizzesPanel({ base, lessonId }: { base: string; lessonId: string }) {
  const id = useId();
  const { state, reload } = useApi<QuizAdmin[]>(`${base}/lessons/${lessonId}/quizzes`);
  const exercises = useApi<ExerciseAdmin[]>(`${base}/lessons/${lessonId}/exercises`);
  const exerciseList = exercises.state.kind === 'ready' ? exercises.state.data : [];
  const exerciseTitle = (id: string) => exerciseList.find((x) => x.id === id)?.title ?? 'mashq';
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const title = String(data.get('title') ?? '').trim();
    const exerciseId = String(data.get('exerciseId') ?? '') || null;
    if (title.length < 2) return setError("Nom kamida 2 belgidan iborat bo'lsin");
    setError(null);
    setPending(true);
    const res = await send('POST', `${base}/lessons/${lessonId}/quizzes`, { title, exerciseId });
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
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Test server tomonida avtomatik tekshiriladi, to&apos;g&apos;ri javoblar talabaga
        yuborilmaydi. Faol test, xuddi mashq kabi, darsni tugatish sharti bo&apos;ladi. Yangi test
        faol emas holda yaratiladi.
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <strong className="font-semibold">Mashq mini-testi</strong> — mashqqa bog&apos;langan
        o&apos;zini tekshirish testi: talaba uni mashq sahifasida ko&apos;radi, cheksiz urinish
        mumkin, darsni tugatish sharti emas.
      </p>
      <LoadState state={state}>
        {(list) =>
          list.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Hali test yo&apos;q.</p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {list.map((q) => (
                <li
                  key={q.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={
                        q.isActive ? '' : 'text-slate-500 line-through dark:text-slate-400'
                      }
                    >
                      {q.title}
                    </span>
                    {q.exerciseId && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        Mini-test: {exerciseTitle(q.exerciseId)}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
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
          {exerciseList.length > 0 && (
            <>
              <label htmlFor={`${id}-kind`} className="sr-only">
                Test turi
              </label>
              <select
                id={`${id}-kind`}
                name="exerciseId"
                defaultValue=""
                className={`${inputClass} w-auto max-w-[45%]`}
              >
                <option value="">Dars testi</option>
                {exerciseList.map((x) => (
                  <option key={x.id} value={x.id}>
                    Mini-test: {x.title}
                  </option>
                ))}
              </select>
            </>
          )}
          <Button type="submit" variant="secondary" disabled={pending} className="shrink-0">
            <Icon name="plus" className="size-4" />
            Test
          </Button>
        </div>
        {error && <ErrorText>{error}</ErrorText>}
      </form>
    </section>
  );
}
