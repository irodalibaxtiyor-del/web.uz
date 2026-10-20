import type { Difficulty, ExerciseStatus, LessonState } from '@webdizayn/shared';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Loadable } from '@/lib/use-api';
import { Icon, type IconName } from './icons';

export const inputClass = 'field';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-outline',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button type="button" {...props} className={`btn ${BUTTON_STYLES[variant]} ${className}`} />
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-control border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    >
      <Icon name="alertCircle" className="mt-px size-4" />
      <span>{children}</span>
    </p>
  );
}

/** "Back to …" link shown above inner pages. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline sm:min-h-0 dark:text-brand-300"
    >
      <Icon name="arrowLeft" className="size-4" />
      {children}
    </Link>
  );
}

/** Page title with breadcrumb and actions, used at the top of inner pages. */
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
    <header className="mb-8 border-b border-line pb-6">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <Link
                  href={c.href}
                  className="hover:text-brand-700 hover:underline dark:hover:text-brand-300"
                >
                  {c.label}
                </Link>
                <Icon name="chevronRight" className="size-3.5" />
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h1 className="text-title font-bold break-words">{title}</h1>
          {subtitle && <div className="max-w-3xl text-muted">{subtitle}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}

/** Grey placeholder blocks shown while content loads. */
export function Skeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={`space-y-3 py-2 ${className}`}>
      <span className="sr-only">Yuklanmoqda…</span>
      <div aria-hidden="true" className="skeleton h-6 w-2/5" />
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`skeleton h-4 ${i % 3 === 2 ? 'w-3/5' : i % 2 ? 'w-11/12' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

/** A friendly "nothing here yet" block with an optional next step. */
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong px-6 py-10 text-center">
      <p className="font-display text-lg font-semibold text-ink dark:text-white">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</div>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Error block for a failed load, with an optional retry. */
export function ErrorState({
  title = "Ma'lumotni yuklab bo'lmadi",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-card border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900 dark:bg-red-950/60"
    >
      <p className="font-display text-lg font-semibold text-red-800 dark:text-red-300">{title}</p>
      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm text-red-800 dark:text-red-300">{message}</p>
      )}
      {onRetry && (
        <div className="mt-5 flex justify-center">
          <Button variant="secondary" onClick={onRetry}>
            Qayta urinish
          </Button>
        </div>
      )}
    </div>
  );
}

function errorCopy(status: number, message: string) {
  if (status === 404)
    return { title: 'Sahifa topilmadi', message: 'Havola eskirgan yoki sizga ochiq emas.' };
  if (status === 403) return { title: "Ruxsat yo'q", message };
  if (status === 0)
    return {
      title: "Server bilan aloqa yo'q",
      message: "Internet aloqasini tekshirib, qayta urinib ko'ring.",
    };
  if (status >= 500)
    return { title: 'Serverda xatolik', message: "Birozdan keyin qayta urinib ko'ring." };
  return { title: "Ma'lumotni yuklab bo'lmadi", message };
}

/** Renders loading and error states uniformly; calls `children` once data is ready. */
export function LoadState<T>({
  state,
  children,
  onRetry,
  skeleton,
}: {
  state: Loadable<T>;
  children: (data: T) => ReactNode;
  onRetry?: () => void;
  skeleton?: ReactNode;
}) {
  if (state.kind === 'loading') return <>{skeleton ?? <Skeleton />}</>;
  if (state.kind === 'error') {
    const copy = errorCopy(state.status, state.message);
    // Network and server failures are usually transient: offer a retry (default: reload).
    const transient = state.status === 0 || state.status >= 500;
    return (
      <ErrorState
        title={copy.title}
        message={copy.message}
        onRetry={transient ? (onRetry ?? (() => window.location.reload())) : onRetry}
      />
    );
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

export function ProgressBar({
  percent,
  label = "Kurs bo'yicha progress",
}: {
  percent: number;
  label?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-subtle"
    >
      <div
        className="h-full rounded-full bg-brand-600 transition-[width] dark:bg-brand-400"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export const TONE_TEXT: Record<StatusTone, string> = {
  neutral: 'text-slate-600 dark:text-slate-400',
  info: 'text-brand-700 dark:text-brand-300',
  success: 'text-emerald-700 dark:text-emerald-400',
  warning: 'text-amber-700 dark:text-amber-400',
  danger: 'text-red-700 dark:text-red-400',
};

/** Status shown as icon + text (never colour alone). */
export function StatusLabel({
  icon,
  tone,
  children,
  className = '',
}: {
  icon: IconName;
  tone: StatusTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${TONE_TEXT[tone]} ${className}`}>
      <Icon name={icon} className="size-4" />
      <span>{children}</span>
    </span>
  );
}

export const STATE_LABEL: Record<LessonState, string> = {
  LOCKED: 'Yopiq',
  AVAILABLE: 'Ochiq',
  IN_PROGRESS: 'Jarayonda',
  NEEDS_IMPROVEMENT: 'Tuzatish kerak',
  COMPLETED: 'Tugatilgan',
};

export const STATE_STYLE: Record<LessonState, { icon: IconName; tone: StatusTone }> = {
  LOCKED: { icon: 'lock', tone: 'neutral' },
  AVAILABLE: { icon: 'circle', tone: 'info' },
  IN_PROGRESS: { icon: 'circleHalf', tone: 'info' },
  NEEDS_IMPROVEMENT: { icon: 'alertCircle', tone: 'warning' },
  COMPLETED: { icon: 'checkCircle', tone: 'success' },
};

export function StateBadge({ state }: { state: LessonState }) {
  const s = STATE_STYLE[state];
  return (
    <StatusLabel icon={s.icon} tone={s.tone}>
      {STATE_LABEL[state]}
    </StatusLabel>
  );
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: 'Oson',
  MEDIUM: "O'rta",
  HARD: 'Qiyin',
};

const EXERCISE_STATUS: Record<ExerciseStatus, { label: string; icon: IconName; tone: StatusTone }> =
  {
    NOT_STARTED: { label: 'Boshlanmagan', icon: 'circleDashed', tone: 'neutral' },
    IN_PROGRESS: { label: 'Jarayonda', icon: 'circleHalf', tone: 'info' },
    PASSED: { label: "O'tdi", icon: 'checkCircle', tone: 'success' },
    NEEDS_IMPROVEMENT: { label: 'Tuzatish kerak', icon: 'alertCircle', tone: 'warning' },
  };

export function ExerciseStatusBadge({ status }: { status: ExerciseStatus }) {
  const s = EXERCISE_STATUS[status];
  return (
    <StatusLabel icon={s.icon} tone={s.tone}>
      {s.label}
    </StatusLabel>
  );
}
