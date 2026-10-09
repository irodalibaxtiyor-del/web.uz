'use client';

import type { CourseMap, LessonState } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Button, ErrorText, LoadState, PageHeader, ProgressBar, StateBadge } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const CRUMBS = [{ href: '/dashboard', label: 'Kabinet' }];

const DOT: Record<LessonState, string> = {
  COMPLETED: 'bg-emerald-500 text-white',
  IN_PROGRESS: 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900',
  AVAILABLE: 'bg-white text-brand-600 ring-2 ring-brand-600 dark:bg-slate-900',
  LOCKED: 'bg-slate-100 text-slate-400 dark:bg-slate-800',
};

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
          .find((l) => l.state === 'AVAILABLE' || l.state === 'IN_PROGRESS');
        return (
          <>
            <PageHeader
              crumbs={CRUMBS}
              title={map.course.title}
              subtitle={map.course.description}
              actions={
                next && (
                  <Link href={`${base}/lessons/${next.id}`} className="btn btn-accent px-6 py-3">
                    {map.completedLessons === 0 ? 'Boshlash' : 'Davom etish'}
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                )
              }
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              <div className="space-y-6">
                {map.modules.length === 0 && (
                  <p className="text-slate-500">Kursda hali dars yo&apos;q.</p>
                )}
                {map.modules.map((mod, mi) => (
                  <section key={mod.id} className="card overflow-hidden">
                    <h2 className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4 text-lg font-semibold dark:border-slate-800 dark:bg-slate-800/40">
                      <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-sm text-white">
                        {mi + 1}
                      </span>
                      {mod.title}
                    </h2>
                    <ol>
                      {mod.lessons.map((l, li) => (
                        <li
                          key={l.id}
                          className="flex items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-0 dark:border-slate-800"
                        >
                          <span
                            className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${DOT[l.state]}`}
                          >
                            {l.state === 'COMPLETED' ? (
                              <Icon name="check" className="size-5" />
                            ) : l.state === 'LOCKED' ? (
                              <svg
                                viewBox="0 0 24 24"
                                className="size-4"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z" />
                              </svg>
                            ) : (
                              li + 1
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            {l.state === 'LOCKED' ? (
                              <span className="text-slate-400">{l.title}</span>
                            ) : (
                              <Link
                                href={`${base}/lessons/${l.id}`}
                                className="font-semibold text-ink transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                              >
                                {l.title}
                              </Link>
                            )}
                          </div>
                          <StateBadge state={l.state} />
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
              <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold">Sizning progressingiz</h2>
                <div className="font-display text-4xl font-bold text-brand-600 dark:text-brand-300">
                  {map.progressPercent}%
                </div>
                <ProgressBar percent={map.progressPercent} />
                <dl className="grid grid-cols-2 gap-3 pt-2 text-sm">
                  <div className="rounded-xl bg-surface p-3 dark:bg-slate-800">
                    <dt className="text-slate-500">Tugatilgan</dt>
                    <dd className="font-display text-xl font-bold text-ink dark:text-white">
                      {map.completedLessons}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3 dark:bg-slate-800">
                    <dt className="text-slate-500">Jami dars</dt>
                    <dd className="font-display text-xl font-bold text-ink dark:text-white">
                      {map.totalLessons}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </>
        );
      }}
    </LoadState>
  );
}
