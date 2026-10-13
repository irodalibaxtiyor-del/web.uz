import type { Difficulty, ExerciseStatus, LessonState } from '@webdizayn/shared';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Loadable } from '@/lib/use-api';

export const inputClass = 'field';

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'accent' }) {
  const styles = { primary: 'btn-primary', secondary: 'btn-outline', accent: 'btn-accent' }[
    variant
  ];
  return <button type="button" {...props} className={`btn ${styles} ${className}`} />;
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    >
      {children}
    </p>
  );
}

/** Blue page banner with breadcrumb, used at the top of inner pages. */
export function PageHeader({
  title,
  subtitle,
  crumbs = [],
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  crumbs?: { href: string; label: string }[];
  actions?: ReactNode;
}) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-3xl bg-brand-600 px-6 py-9 text-white sm:px-10">
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-10 size-56 rounded-full bg-brand-700/60"
      />
      <div
        aria-hidden="true"
        className="absolute top-6 right-[38%] size-10 rounded-full border-[5px] border-accent-400"
      />
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-2">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white">
                {crumbs.map((c) => (
                  <li key={c.href} className="flex items-center gap-1.5">
                    <Link href={c.href} className="hover:text-white hover:underline">
                      {c.label}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          {subtitle && <div className="max-w-2xl text-white">{subtitle}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}

/** Renders loading and error states uniformly; calls `children` once data is ready. */
export function LoadState<T>({
  state,
  children,
}: {
  state: Loadable<T>;
  children: (data: T) => ReactNode;
}) {
  if (state.kind === 'loading') {
    return (
      <div
        role="status"
        className="flex items-center gap-3 py-10 text-slate-500 dark:text-slate-400"
      >
        <span className="size-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        Yuklanmoqda…
      </div>
    );
  }
  if (state.kind === 'error') {
    return <ErrorText>{state.status === 404 ? 'Sahifa topilmadi' : state.message}</ErrorText>;
  }
  return <>{children(state.data)}</>;
}

/** Horizontally scrollable table wrapper; focusable so keyboard users can scroll it. */
export function TableScroll({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative overflow-x-auto" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Kurs bo'yicha progress"
      className="h-2.5 w-full overflow-hidden rounded-full bg-brand-50 dark:bg-slate-800"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export const STATE_LABEL: Record<LessonState, string> = {
  LOCKED: 'Yopiq',
  AVAILABLE: 'Ochiq',
  IN_PROGRESS: 'Jarayonda',
  NEEDS_IMPROVEMENT: 'Tuzatish kerak',
  COMPLETED: 'Tugatilgan',
};

const STATE_ICON: Record<LessonState, string> = {
  LOCKED: '🔒',
  AVAILABLE: '○',
  IN_PROGRESS: '◐',
  NEEDS_IMPROVEMENT: '!',
  COMPLETED: '✓',
};

export function StateBadge({ state }: { state: LessonState }) {
  const tone =
    state === 'COMPLETED'
      ? 'text-emerald-700 dark:text-emerald-400'
      : state === 'LOCKED'
        ? 'text-slate-500 dark:text-slate-400'
        : state === 'NEEDS_IMPROVEMENT'
          ? 'text-amber-700 dark:text-amber-400'
          : 'text-brand-700 dark:text-brand-300';
  return (
    <span className={`text-sm ${tone}`}>
      <span aria-hidden="true">{STATE_ICON[state]}</span> {STATE_LABEL[state]}
    </span>
  );
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: 'Oson',
  MEDIUM: "O'rta",
  HARD: 'Qiyin',
};

const EXERCISE_STATUS: Record<ExerciseStatus, { label: string; icon: string; tone: string }> = {
  NOT_STARTED: { label: 'Boshlanmagan', icon: '○', tone: 'text-slate-500 dark:text-slate-400' },
  IN_PROGRESS: { label: 'Jarayonda', icon: '◐', tone: 'text-brand-700 dark:text-brand-300' },
  PASSED: { label: "O'tdi", icon: '✓', tone: 'text-emerald-700 dark:text-emerald-400' },
  NEEDS_IMPROVEMENT: {
    label: 'Tuzatish kerak',
    icon: '!',
    tone: 'text-amber-700 dark:text-amber-400',
  },
};

export function ExerciseStatusBadge({ status }: { status: ExerciseStatus }) {
  const s = EXERCISE_STATUS[status];
  return (
    <span className={`text-sm ${s.tone}`}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  );
}
