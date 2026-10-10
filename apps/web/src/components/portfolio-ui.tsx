'use client';

import type {
  Achievement,
  CompletedCourse,
  PortfolioItemDetail,
  PortfolioItemKind,
  PortfolioItemSummary,
  ProjectFile,
} from '@webdizayn/shared';
import { useEffect, useState, type ReactNode } from 'react';
import { useRunner } from '@/components/ide/use-runner';
import { Icon, type IconName } from '@/components/icons';
import { ErrorText } from '@/components/ui';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import { SANDBOX_URL } from '@/lib/sandbox';

export const ACHIEVEMENT_INFO: Record<
  Achievement,
  { title: string; text: string; icon: IconName }
> = {
  FIRST_EXERCISE: { title: 'Birinchi qadam', text: 'Birinchi mashq o‘tildi', icon: 'check' },
  TEN_EXERCISES: { title: 'Amaliyotchi', text: '10 ta mashq o‘tildi', icon: 'code' },
  QUIZ_MASTER: { title: 'Test ustasi', text: '5 ta test o‘tildi', icon: 'sparkles' },
  FIRST_GRADED_ASSIGNMENT: {
    title: 'Birinchi loyiha',
    text: 'O‘qituvchi baholagan topshiriq',
    icon: 'briefcase',
  },
  COURSE_COMPLETED: { title: 'Kurs bitiruvchisi', text: 'Kurs to‘liq tugatildi', icon: 'book' },
};

export const ITEM_KIND_LABEL: Record<PortfolioItemKind, string> = {
  EXERCISE: 'Mashq',
  ASSIGNMENT: 'Loyiha',
};

export function Achievements({ list }: { list: Achievement[] }) {
  if (list.length === 0) {
    return <p className="text-sm text-slate-500">Hali yutuqlar yo‘q.</p>;
  }
  return (
    <ul className="grid gap-3">
      {list.map((a) => {
        const info = ACHIEVEMENT_INFO[a];
        return (
          <li
            key={a}
            className="flex items-center gap-3 rounded-xl bg-surface p-3 dark:bg-slate-800"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-400 text-ink">
              <Icon name={info.icon} className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">{info.title}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{info.text}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function CompletedCourses({ list }: { list: CompletedCourse[] }) {
  if (list.length === 0) {
    return <p className="text-sm text-slate-500">Hali tugatilgan kurs yo‘q.</p>;
  }
  return (
    <ul className="space-y-2">
      {list.map((c) => (
        <li key={c.title + c.completedAt} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-medium">
            <Icon name="check" className="size-4 text-emerald-600" aria-hidden="true" />
            {c.title}
          </span>
          <span className="text-sm text-slate-500">{formatDate(c.completedAt)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Skills({ list }: { list: string[] }) {
  if (list.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Ko‘nikmalar">
      {list.map((s) => (
        <li
          key={s}
          className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-200"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

/**
 * Live, read-only render of a project in the sandbox runner (separate site, opaque origin).
 * This is the portfolio "screenshot": it always reflects the stored snapshot.
 */
export function ProjectPreview({ files, title }: { files: ProjectFile[]; title: string }) {
  const { frameRef, frameKey, status, run } = useRunner();
  useEffect(() => {
    run(files);
  }, [files, run, frameKey]);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <iframe
        key={frameKey}
        ref={frameRef}
        title={`${title} — ko‘rinishi`}
        src={`${SANDBOX_URL}/runner.html`}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        loading="lazy"
        className="h-72 w-full bg-white"
      />
      {status === 'timeout' && (
        <p className="border-t border-slate-200 px-3 py-2 text-sm text-amber-700 dark:border-slate-700">
          Loyiha juda uzoq yuklandi va to‘xtatildi.
        </p>
      )}
    </div>
  );
}

/** Item card; files are fetched only when the visitor opens the preview. */
export function PortfolioItemCard({
  item,
  detailPath,
  actions,
}: {
  item: PortfolioItemSummary;
  detailPath: string;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<ProjectFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (open) return setOpen(false);
    setOpen(true);
    if (files) return;
    const res = await api<PortfolioItemDetail>(detailPath);
    if (res.ok) setFiles(res.data.files);
    else setError(res.message);
  }

  const previewId = `preview-${item.id}`;
  return (
    <article className="card space-y-3 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="section-eyebrow">
            {ITEM_KIND_LABEL[item.kind]} · {item.courseTitle}
          </p>
          <h3 className="text-lg font-bold">{item.title}</h3>
        </div>
        {actions}
      </div>
      {item.description && (
        <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">{item.description}</p>
      )}
      <button
        type="button"
        className="btn btn-outline"
        aria-expanded={open}
        aria-controls={previewId}
        onClick={toggle}
      >
        <Icon name="play" className="size-4" aria-hidden="true" />
        {open ? 'Yopish' : 'Natijani ko‘rish'}
      </button>
      <div id={previewId} hidden={!open}>
        {error && <ErrorText>{error}</ErrorText>}
        {open && files && <ProjectPreview files={files} title={item.title} />}
        {open && !files && !error && <p role="status">Yuklanmoqda…</p>}
      </div>
    </article>
  );
}
