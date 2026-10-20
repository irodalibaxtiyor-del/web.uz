'use client';

import type { CourseMap, CourseMapLesson } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Icon, type IconName } from '@/components/icons';
import {
  Button,
  EmptyState,
  ErrorText,
  LoadState,
  PageHeader,
  ProgressBar,
  StateBadge,
} from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const CRUMBS = [{ href: '/dashboard', label: 'Kabinet' }];

export default function CourseMapPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state, setState } = useApi<CourseMap>(`${base}/map`);
  const [error, setError] = useState<string | null>(null);

  async function enroll() {
    setError(null);
    const res = await send<CourseMap>('POST', `${base}/enroll`);
    if (res.ok) setState({ kind: 'ready', data: res.data });
    else setError(res.message);
  }

  if (state.kind === 'error' && state.code === 'NOT_ENROLLED') {
    return (
      <>
        <PageHeader crumbs={CRUMBS} title="Kursga yozilish" />
        <div className="card mx-auto max-w-xl space-y-5 p-8 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Icon name="book" className="size-8" />
          </span>
          <p>
            Darslarni ko&apos;rish uchun avval kursga yoziling. Darslar ketma-ket ochiladi: har
            birini tugatganingizda keyingisi ochiladi.
          </p>
          {error && <ErrorText>{error}</ErrorText>}
          <Button onClick={enroll} className="px-7 py-3 text-base">
            Kursga yozilish
          </Button>
        </div>
      </>
    );
  }

  return (
    <LoadState state={state}>
      {(map) => {
        const next = map.modules
          .flatMap((m) => m.lessons)
          .find(
            (l) =>
              l.state === 'AVAILABLE' ||
              l.state === 'IN_PROGRESS' ||
              l.state === 'NEEDS_IMPROVEMENT',
          );
        return (
          <>
            <PageHeader
              crumbs={CRUMBS}
              title={map.course.title}
              subtitle={map.course.description}
              actions={
                next && (
                  <Link href={`${base}/lessons/${next.id}`} className="btn btn-primary px-6 py-3">
                    {map.completedLessons === 0 ? 'Boshlash' : 'Davom etish'}
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                )
              }
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              <div className="space-y-6">
                {map.modules.length === 0 && (
                  <EmptyState title="Kursda hali dars yo'q">
                    Darslar qo&apos;shilganda shu yerda ko&apos;rinadi.
                  </EmptyState>
                )}
                {map.modules.map((mod, mi) => (
                  <section key={mod.id} className="card overflow-hidden">
                    <h2 className="border-b border-line px-5 py-4 text-lg font-semibold sm:px-6">
                      <span className="mb-0.5 block text-xs font-semibold tracking-wide text-muted uppercase">
                        {mi + 1}-modul
                      </span>
                      {mod.title}
                    </h2>
                    <ol>
                      {mod.lessons.map((l, li) => (
                        <li
                          key={l.id}
                          className="flex gap-3 border-b border-line px-5 py-4 last:border-0 sm:gap-4 sm:px-6"
                        >
                          <span
                            aria-hidden="true"
                            className="w-8 shrink-0 pt-0.5 font-mono text-sm text-muted tabular-nums"
                          >
                            {mi + 1}.{li + 1}
                          </span>
                          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-1">
                            <div className="min-w-0">
                              {l.state === 'LOCKED' ? (
                                <span className="text-muted">{l.title}</span>
                              ) : (
                                <Link
                                  href={`${base}/lessons/${l.id}`}
                                  className="font-semibold text-ink hover:text-brand-700 hover:underline dark:text-white dark:hover:text-brand-300"
                                >
                                  {l.title}
                                </Link>
                              )}
                              <LessonItems lesson={l} base={base} />
                            </div>
                            <StateBadge state={l.state} />
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
              <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold">Sizning progressingiz</h2>
                <div className="font-display text-4xl font-bold text-ink dark:text-white">
                  {map.progressPercent}%
                </div>
                <ProgressBar percent={map.progressPercent} />
                <dl className="grid grid-cols-2 gap-3 pt-2 text-sm">
                  <div className="rounded-control border border-line p-3">
                    <dt className="text-slate-500 dark:text-slate-400">Tugatilgan</dt>
                    <dd className="font-display text-xl font-bold text-ink dark:text-white">
                      {map.completedLessons}
                    </dd>
                  </div>
                  <div className="rounded-control border border-line p-3">
                    <dt className="text-slate-500 dark:text-slate-400">Jami dars</dt>
                    <dd className="font-display text-xl font-bold text-ink dark:text-white">
                      {map.totalLessons}
                    </dd>
                  </div>
                </dl>
                <dl className="space-y-2 border-t border-line pt-4 text-sm">
                  {(
                    [
                      ['Mashqlar', map.stats.exercises],
                      ['Testlar', map.stats.quizzes],
                      ['Topshiriqlar (baholangan)', map.stats.assignments],
                    ] as const
                  )
                    .filter(([, s]) => s.total > 0)
                    .map(([label, s]) => (
                      <div key={label} className="flex justify-between gap-3">
                        <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                        <dd className="font-semibold">
                          {s.done} / {s.total}
                        </dd>
                      </div>
                    ))}
                </dl>
              </aside>
            </div>
          </>
        );
      }}
    </LoadState>
  );
}

type Chip = {
  key: string;
  kind: string;
  title: string;
  href: string;
  icon: IconName;
  tone: 'ok' | 'warn' | 'todo';
};

/** Exercises, quizzes and assignments of a lesson as compact status chips. */
function LessonItems({ lesson: l, base }: { lesson: CourseMapLesson; base: string }) {
  const chips: Chip[] = [
    ...l.exercises.map((e): Chip => ({
      key: `e-${e.id}`,
      kind: 'Mashq',
      title: e.title,
      href: `${base}/exercises/${e.id}`,
      icon:
        e.status === 'PASSED'
          ? 'checkCircle'
          : e.status === 'NEEDS_IMPROVEMENT'
            ? 'alertCircle'
            : 'circleDashed',
      tone: e.status === 'PASSED' ? 'ok' : e.status === 'NEEDS_IMPROVEMENT' ? 'warn' : 'todo',
    })),
    ...l.quizzes.map((q): Chip => ({
      key: `q-${q.id}`,
      kind: 'Test',
      title: q.bestScore === null ? q.title : `${q.title} · ${q.bestScore}%`,
      href: `${base}/quizzes/${q.id}`,
      icon:
        q.status === 'PASSED'
          ? 'checkCircle'
          : q.status === 'FAILED'
            ? 'alertCircle'
            : 'circleDashed',
      tone: q.status === 'PASSED' ? 'ok' : q.status === 'FAILED' ? 'warn' : 'todo',
    })),
    ...l.assignments.map((a): Chip => {
      const done = a.submissionStatus === 'GRADED' || a.submissionStatus === 'FINALIZED';
      const fix = a.submissionStatus === 'REVISION_REQUESTED';
      return {
        key: `a-${a.id}`,
        kind: 'Topshiriq',
        title: a.title,
        href: `${base}/assignments/${a.id}`,
        icon: done
          ? 'checkCircle'
          : fix
            ? 'alertCircle'
            : a.submissionStatus
              ? 'upload'
              : 'circleDashed',
        tone: done ? 'ok' : fix ? 'warn' : 'todo',
      };
    }),
  ];
  if (chips.length === 0) return null;
  const tone = {
    ok: 'border-emerald-200 text-emerald-800 dark:border-emerald-900 dark:text-emerald-300',
    warn: 'border-amber-300 text-amber-800 dark:border-amber-800 dark:text-amber-300',
    todo: 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400',
  } as const;
  const locked = l.state === 'LOCKED';
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5 text-xs" aria-label={`${l.title}: vazifalar`}>
      {chips.map((c) => {
        const body = (
          <>
            <Icon name={c.icon} className="inline size-4 align-[-0.2em]" /> {c.kind}: {c.title}
          </>
        );
        return (
          <li key={c.key}>
            {locked ? (
              <span
                className={`inline-block rounded-full border border-dashed px-2 py-0.5 ${tone.todo}`}
              >
                {body}
              </span>
            ) : (
              <Link
                href={c.href}
                className={`inline-block rounded-full border px-2 py-0.5 hover:bg-white dark:hover:bg-slate-800 ${tone[c.tone as keyof typeof tone]}`}
              >
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
