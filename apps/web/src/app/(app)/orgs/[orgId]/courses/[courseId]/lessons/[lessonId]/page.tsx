'use client';

import type { CourseMap, LessonView } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmissionStatusBadge } from '@/components/assignment-ui';
import { QuizStatusBadge } from '@/components/quiz-ui';
import { Markdown } from '@/components/markdown';
import {
  Button,
  DIFFICULTY_LABEL,
  ErrorText,
  ExerciseStatusBadge,
  LoadState,
  StateBadge,
} from '@/components/ui';
import { send } from '@/lib/api';
import { formatDateTime } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

export default function LessonPage() {
  const router = useRouter();
  const { orgId, courseId, lessonId } = useParams<{
    orgId: string;
    courseId: string;
    lessonId: string;
  }>();
  const courseBase = `/orgs/${orgId}/courses/${courseId}`;
  const { state, reload } = useApi<LessonView>(`${courseBase}/lessons/${lessonId}`);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function complete() {
    setError(null);
    setPending(true);
    const res = await send<CourseMap>('POST', `${courseBase}/lessons/${lessonId}/complete`);
    setPending(false);
    if (!res.ok) return setError(res.message);
    reload();
  }

  if (state.kind === 'error' && state.code === 'LESSON_LOCKED') {
    return (
      <section className="card mx-auto max-w-xl space-y-4 p-8 text-center">
        <h1 className="text-2xl font-bold">Dars hali yopiq</h1>
        <p>{state.message}</p>
        <Button variant="secondary" onClick={() => router.push(courseBase)}>
          Kurs xaritasiga qaytish
        </Button>
      </section>
    );
  }

  return (
    <LoadState state={state}>
      {(lesson) => (
        <article className="card mx-auto max-w-4xl space-y-8 p-6 sm:p-10">
          <nav className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <Link
              href={courseBase}
              className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              ← Kurs xaritasi
            </Link>
            <span className="section-eyebrow">{lesson.moduleTitle}</span>
          </nav>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-6 dark:border-slate-800">
            <h1 className="text-3xl font-bold sm:text-4xl">{lesson.title}</h1>
            <StateBadge state={lesson.state} />
          </header>
          <Markdown>{lesson.content || '_Bu darsda hali matn yo‘q._'}</Markdown>
          {lesson.exercises.length > 0 && (
            <section aria-labelledby="exercises-heading" className="space-y-3">
              <h2 id="exercises-heading" className="text-xl font-semibold">
                Mashqlar
              </h2>
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-surface/60 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-800/40">
                {lesson.exercises.map((ex) => (
                  <li
                    key={ex.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="space-x-2">
                      <Link
                        href={`${courseBase}/exercises/${ex.id}`}
                        className="font-semibold text-ink hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                      >
                        {ex.title}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {DIFFICULTY_LABEL[ex.difficulty]}
                      </span>
                    </div>
                    <ExerciseStatusBadge status={ex.status} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {lesson.quizzes.length > 0 && (
            <section aria-labelledby="quizzes-heading" className="space-y-3">
              <h2 id="quizzes-heading" className="text-xl font-semibold">
                Testlar
              </h2>
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-surface/60 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-800/40">
                {lesson.quizzes.map((q) => (
                  <li
                    key={q.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <Link
                      href={`${courseBase}/quizzes/${q.id}`}
                      className="font-semibold text-ink hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                    >
                      {q.title}
                    </Link>
                    <QuizStatusBadge status={q.status} bestScore={q.bestScore} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {lesson.assignments.length > 0 && (
            <section aria-labelledby="assignments-heading" className="space-y-3">
              <h2 id="assignments-heading" className="text-xl font-semibold">
                Topshiriqlar
              </h2>
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-surface/60 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-800/40">
                {lesson.assignments.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="space-x-2">
                      <Link
                        href={`${courseBase}/assignments/${a.id}`}
                        className="font-semibold text-ink hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                      >
                        {a.title}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {a.status === 'CLOSED'
                          ? 'Yopilgan'
                          : a.deadline
                            ? `Muddat: ${formatDateTime(a.deadline)}`
                            : 'Muddatsiz'}
                      </span>
                    </div>
                    <SubmissionStatusBadge status={a.submissionStatus} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {error && <ErrorText>{error}</ErrorText>}
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
            {lesson.prevLessonId ? (
              <Link
                href={`${courseBase}/lessons/${lesson.prevLessonId}`}
                className="hover:underline"
              >
                ← Oldingi dars
              </Link>
            ) : (
              <span />
            )}
            {lesson.state === 'COMPLETED' ? (
              lesson.nextLessonId ? (
                <Link
                  href={`${courseBase}/lessons/${lesson.nextLessonId}`}
                  className="btn btn-primary"
                >
                  Keyingi dars →
                </Link>
              ) : (
                <Link href={courseBase} className="font-medium hover:underline">
                  Kurs xaritasiga qaytish
                </Link>
              )
            ) : lesson.exercises.some((ex) => ex.status !== 'PASSED') ||
              lesson.quizzes.some((q) => q.status !== 'PASSED') ? (
              <p className="text-sm text-slate-500">
                Keyingi darsga o&apos;tish uchun barcha mashq va testlardan o&apos;ting
              </p>
            ) : (
              <Button onClick={complete} disabled={pending}>
                {pending ? 'Saqlanmoqda…' : 'Darsni tugatdim'}
              </Button>
            )}
          </footer>
        </article>
      )}
    </LoadState>
  );
}
