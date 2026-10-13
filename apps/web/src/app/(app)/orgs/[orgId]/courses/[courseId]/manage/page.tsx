'use client';

import type { CourseStatus, CourseStructure } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { STATUS_LABEL } from '@/components/course-list';
import { Button, ErrorText, inputClass, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function ManageCoursePage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state, setState, reload } = useApi<CourseStructure>(`${base}/structure`);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(status: CourseStatus) {
    setError(null);
    const res = await send<CourseStructure>('PATCH', base, { status });
    if (res.ok) setState({ kind: 'ready', data: res.data });
    else setError(res.message);
  }

  return (
    <LoadState state={state}>
      {(s) => {
        const lessonCount = s.modules.reduce((n, m) => n + m.lessons.length, 0);
        return (
          <section className="card space-y-8 p-6 sm:p-10">
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
            >
              ← Boshqaruv paneli
            </Link>
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{s.course.title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Holati: <strong>{STATUS_LABEL[s.course.status]}</strong> · {s.modules.length}{' '}
                  modul · {lessonCount} dars
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`${base}/manage/analytics`} className="btn btn-outline">
                  Analitika
                </Link>
                {s.course.status !== 'PUBLISHED' && (
                  <Button onClick={() => setStatus('PUBLISHED')} disabled={lessonCount === 0}>
                    E&apos;lon qilish
                  </Button>
                )}
                {s.course.status === 'PUBLISHED' && (
                  <Button variant="secondary" onClick={() => setStatus('DRAFT')}>
                    Qoralamaga qaytarish
                  </Button>
                )}
                {s.course.status !== 'ARCHIVED' && (
                  <Button variant="secondary" onClick={() => setStatus('ARCHIVED')}>
                    Arxivlash
                  </Button>
                )}
              </div>
            </header>
            {lessonCount === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                E&apos;lon qilish uchun kamida bitta dars qo&apos;shing.
              </p>
            )}
            {error && <ErrorText>{error}</ErrorText>}

            <ol className="space-y-6">
              {s.modules.map((mod, mi) => (
                <li
                  key={mod.id}
                  className="space-y-3 rounded-xl border border-slate-200 p-5 dark:border-slate-800"
                >
                  <h2 className="font-semibold">
                    {mi + 1}. {mod.title}
                  </h2>
                  {mod.lessons.length > 0 && (
                    <ol className="space-y-1">
                      {mod.lessons.map((l, li) => (
                        <li key={l.id} className="flex items-center justify-between gap-3">
                          <span>
                            {mi + 1}.{li + 1} {l.title}
                            {l.contentLength === 0 && (
                              <span className="ml-2 text-xs text-amber-600">matn yo&apos;q</span>
                            )}
                          </span>
                          <Link
                            href={`${base}/manage/lessons/${l.id}`}
                            className="text-sm text-brand-600 hover:underline dark:text-brand-400"
                          >
                            Tahrirlash
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                  <InlineCreate
                    label="Yangi dars nomi"
                    button="+ Dars"
                    onCreate={(title) =>
                      send('POST', `${base}/modules/${mod.id}/lessons`, { title })
                    }
                    onDone={reload}
                  />
                </li>
              ))}
            </ol>
            <InlineCreate
              label="Yangi modul nomi"
              button="+ Modul"
              onCreate={(title) => send('POST', `${base}/modules`, { title })}
              onDone={reload}
            />
          </section>
        );
      }}
    </LoadState>
  );
}

function InlineCreate({
  label,
  button,
  onCreate,
  onDone,
}: {
  label: string;
  button: string;
  onCreate: (title: string) => Promise<{ ok: boolean; message?: string }>;
  onDone: () => void;
}) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get('title') ?? '').trim();
    if (title.length < 2) return setError("Nom kamida 2 belgidan iborat bo'lsin");
    setError(null);
    setPending(true);
    const res = await onCreate(title);
    setPending(false);
    if (!res.ok) return setError(res.message ?? 'Xatolik');
    form.reset();
    onDone();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input id={id} name="title" placeholder={label} className={inputClass} />
        <Button type="submit" variant="secondary" disabled={pending} className="shrink-0">
          {button}
        </Button>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </form>
  );
}
