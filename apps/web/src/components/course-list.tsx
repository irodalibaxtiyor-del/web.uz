'use client';

import {
  createCourseSchema,
  type CourseStatus,
  type CourseStructure,
  type CourseSummary,
  type Role,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { Icon } from './icons';
import { Button, ErrorText, inputClass, LoadState, ProgressBar } from './ui';

export const STATUS_LABEL: Record<CourseStatus, string> = {
  DRAFT: 'Qoralama',
  PUBLISHED: "E'lon qilingan",
  ARCHIVED: 'Arxivda',
};

const STATUS_TONE: Record<CourseStatus, string> = {
  DRAFT: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  ARCHIVED: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const COVERS = [
  'from-brand-600 to-brand-400',
  'from-violet-600 to-fuchsia-400',
  'from-emerald-600 to-teal-400',
  'from-orange-500 to-amber-400',
  'from-rose-600 to-pink-400',
  'from-cyan-600 to-sky-400',
];

/** Courses have no images yet; a stable gradient + initials stands in for the cover photo. */
function CourseCover({ title }: { title: string }) {
  let hash = 0;
  for (const ch of title) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <div
      aria-hidden="true"
      className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${COVERS[hash % COVERS.length]}`}
    >
      <div className="dots-pattern absolute inset-0 opacity-30 mix-blend-overlay" />
      <div className="absolute -right-8 -bottom-10 size-36 rounded-full bg-white/15" />
      <span className="relative font-display text-5xl font-bold text-white/95 drop-shadow-sm">
        {initials}
      </span>
    </div>
  );
}

export function CourseList({ orgId, role }: { orgId: string; role: Role }) {
  const { state } = useApi<CourseSummary[]>(`/orgs/${orgId}/courses`);
  const isStaff = role !== 'STUDENT';

  return (
    <div className="space-y-4">
      {isStaff && <NewCourseForm orgId={orgId} />}
      <LoadState state={state}>
        {(courses) =>
          courses.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              {isStaff ? "Hali kurs yo'q. Birinchisini yarating." : "Hozircha ochiq kurslar yo'q."}
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => {
                const href = isStaff
                  ? c.canManage
                    ? `/orgs/${orgId}/courses/${c.id}/manage`
                    : null
                  : `/orgs/${orgId}/courses/${c.id}`;
                return (
                  <li key={c.id} className="card card-hover flex flex-col overflow-hidden">
                    <CourseCover title={c.title} />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        {isStaff ? (
                          <span
                            className={`rounded-full px-2.5 py-1 font-semibold ${STATUS_TONE[c.status]}`}
                          >
                            {STATUS_LABEL[c.status]}
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            Bepul
                          </span>
                        )}
                        {!isStaff && c.enrolled && (
                          <span className="font-semibold text-brand-600 dark:text-brand-300">
                            {c.progressPercent}%
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl leading-snug font-semibold">
                        {href ? (
                          <Link
                            href={href}
                            className="transition-colors hover:text-brand-600 dark:hover:text-brand-300"
                          >
                            {c.title}
                          </Link>
                        ) : (
                          c.title
                        )}
                      </h3>
                      {c.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed">{c.description}</p>
                      )}
                      {!isStaff && c.enrolled && <ProgressBar percent={c.progressPercent ?? 0} />}
                      <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800">
                        {href ? (
                          <Link
                            href={href}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:gap-2.5 dark:text-brand-300"
                            style={{ transition: 'gap 0.2s' }}
                          >
                            {isStaff
                              ? 'Boshqarish'
                              : c.enrolled
                                ? "O'qishni davom ettirish"
                                : "Kursni ko'rish"}
                            <Icon name="arrowRight" className="size-4" />
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Sizga biriktirilmagan
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        }
      </LoadState>
    </div>
  );
}

function NewCourseForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = createCourseSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      setError("Nom kamida 2 belgi, slug esa faqat kichik lotin harflari, raqam va '-' bo'lsin");
      return;
    }
    setPending(true);
    const res = await send<CourseStructure>('POST', `/orgs/${orgId}/courses`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    router.push(`/orgs/${orgId}/courses/${res.data.course.id}/manage`);
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Yangi kurs</Button>;
  }
  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor={`${id}-title`} className="text-sm font-medium">
            Kurs nomi
          </label>
          <input id={`${id}-title`} name="title" required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-slug`} className="text-sm font-medium">
            Slug (URL uchun)
          </label>
          <input
            id={`${id}-slug`}
            name="slug"
            required
            placeholder="html-asoslari"
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-desc`} className="text-sm font-medium">
          Qisqa tavsif
        </label>
        <textarea id={`${id}-desc`} name="description" rows={2} className={inputClass} />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saqlanmoqda…' : 'Yaratish'}
        </Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}
