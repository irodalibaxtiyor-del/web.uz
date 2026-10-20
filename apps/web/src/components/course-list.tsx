'use client';

import {
  createCourseSchema,
  slugify,
  type CourseStatus,
  type CourseStructure,
  type CourseSummary,
  type Role,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { send } from '@/lib/api';
import { slugEdited, slugFromTitle, type SlugDraft } from '@/lib/slug-input';
import { useApi } from '@/lib/use-api';
import { Icon } from './icons';
import { SlugField, useSlugPreview } from './slug-field';
import { Button, EmptyState, ErrorText, inputClass, LoadState, ProgressBar } from './ui';

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

export function CourseList({ orgId, role }: { orgId: string; role: Role }) {
  const { state } = useApi<CourseSummary[]>(`/orgs/${orgId}/courses`);
  const isStaff = role !== 'STUDENT';

  return (
    <div className="space-y-4">
      {isStaff && <NewCourseForm orgId={orgId} />}
      <LoadState state={state}>
        {(courses) =>
          courses.length === 0 ? (
            <EmptyState title={isStaff ? "Hali kurs yo'q" : "Hozircha ochiq kurslar yo'q"}>
              {isStaff
                ? '"Yangi kurs" tugmasi bilan birinchi kursni yarating.'
                : "Yangi kurslar e'lon qilinganda shu yerda ko'rinadi."}
            </EmptyState>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => {
                const href = isStaff
                  ? c.canManage
                    ? `/orgs/${orgId}/courses/${c.id}/manage`
                    : null
                  : `/orgs/${orgId}/courses/${c.id}`;
                return (
                  <li
                    key={c.id}
                    className={`card relative flex flex-col ${href ? 'card-hover focus-within:border-brand-500' : ''}`}
                  >
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
                          <span className="font-semibold text-brand-700 dark:text-brand-300">
                            {c.progressPercent}%
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl leading-snug font-semibold">
                        {href ? (
                          <Link
                            href={href}
                            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                          >
                            {c.title}
                          </Link>
                        ) : (
                          c.title
                        )}
                      </h3>
                      {c.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                          {c.description}
                        </p>
                      )}
                      {!isStaff && c.enrolled && <ProgressBar percent={c.progressPercent ?? 0} />}
                      <div className="mt-auto border-t border-line pt-4">
                        {href ? (
                          <span
                            aria-hidden="true"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-300"
                          >
                            {isStaff
                              ? 'Boshqarish'
                              : c.enrolled
                                ? "O'qishni davom ettirish"
                                : "Kursni ko'rish"}
                            <Icon name="arrowRight" className="size-4" />
                          </span>
                        ) : (
                          <span className="text-sm text-muted">Sizga biriktirilmagan</span>
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
  const [title, setTitle] = useState('');
  const [draft, setDraft] = useState<SlugDraft>({ slug: '', manual: false });
  const preview = useSlugPreview(orgId, draft.slug);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const slug = slugify(draft.slug);
    // An empty slug is left to the server (generated from the title).
    const parsed = createCourseSchema.safeParse({ ...form, slug: slug || undefined });
    if (!parsed.success) {
      setError("Nom kamida 2 belgi, manzil esa faqat kichik lotin harflari, raqam va '-' bo'lsin");
      return;
    }
    setPending(true);
    const res = await send<CourseStructure>('POST', `/orgs/${orgId}/courses`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    router.push(`/orgs/${orgId}/courses/${res.data.course.id}/manage`);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Icon name="plus" className="size-4" />
        Yangi kurs
      </Button>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-6">
      <div className="grid items-start gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor={`${id}-title`} className="text-sm font-medium">
            Kurs nomi
          </label>
          <input
            id={`${id}-title`}
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDraft((d) => slugFromTitle(d, e.target.value));
            }}
            className={inputClass}
          />
        </div>
        <SlugField
          id={`${id}-slug`}
          value={draft.slug}
          onChange={(v) => setDraft(slugEdited(v, title))}
          preview={preview}
          manual={draft.manual}
          mode="create"
        />
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
