'use client';

import type { ProgressBucket, Rate, StruggleReason, WeeklyPoint } from '@webdizayn/shared';
import { useId, useState, type ReactNode } from 'react';

export const STRUGGLE_LABEL: Record<StruggleReason, string> = {
  INACTIVE: 'Bir haftadan beri faol emas',
  BEHIND: 'Guruhdan ancha orqada',
  STUCK_ON_CHECK: 'Bitta mashqda qayta-qayta xato',
  NEEDS_IMPROVEMENT: 'Tuzatish kerak bo‘lgan mashq bor',
  REVISION_REQUESTED: 'Topshiriqni qayta ishlash so‘ralgan',
  QUIZ_NOT_PASSED: 'Testdan o‘tolmagan',
};

export const BUCKET_LABEL: Record<ProgressBucket, string> = {
  '0': '0%',
  '1-24': '1–24%',
  '25-49': '25–49%',
  '50-74': '50–74%',
  '75-99': '75–99%',
  '100': '100%',
};

/** A rate as a whole percent; "—" when there is no data (never a misleading 0%). */
export function percent(r: Rate): string {
  return r === null ? '—' : `${Math.round(r * 100)}%`;
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="card p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink dark:text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section className="card space-y-4 p-5 sm:p-6" aria-labelledby={id}>
      <div className="space-y-1">
        <h2 id={id} className="text-lg font-bold">
          {title}
        </h2>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>;
}

export interface Column {
  label: string;
  value: number;
  /** Longer name for the tooltip and the table (defaults to `label`). */
  title?: string;
}

const CHART_H = 140;
const BAR_MAX = 24;

/**
 * Single-series column chart. One hue (no legend: the title names the series), a hairline
 * baseline, 4px rounded tops, value on the last column only. Every column is focusable and
 * shows its value on hover/focus; the same numbers are always in the table below.
 */
export function ColumnChart({
  title,
  unit,
  data,
}: {
  title: string;
  unit: string;
  data: Column[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const tableId = useId();
  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const slot = 100 / data.length;

  return (
    <figure className="space-y-2">
      <figcaption className="text-sm font-semibold">{title}</figcaption>
      <div className="relative" onPointerLeave={() => setActive(null)}>
        <div className="absolute top-0 left-0 text-xs text-slate-500 dark:text-slate-400">
          {maxValue}
        </div>
        <svg
          viewBox={`0 0 100 ${CHART_H}`}
          preserveAspectRatio="none"
          className="h-36 w-full overflow-visible"
          role="img"
          aria-label={`${title}. Qiymatlar quyidagi jadvalda.`}
        >
          <line
            x1="0"
            x2="100"
            y1={CHART_H - 0.5}
            y2={CHART_H - 0.5}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Columns as HTML so the 24px cap and 4px corners stay exact at any width. */}
        <div className="absolute inset-0 flex items-end" style={{ bottom: 1 }}>
          {data.map((d, i) => {
            const h = (d.value / maxValue) * 100;
            return (
              <div
                key={i}
                className="relative flex h-full items-end justify-center"
                style={{ width: `${slot}%` }}
                tabIndex={0}
                aria-label={`${d.title ?? d.label}: ${d.value} ${unit}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <div
                  className={`w-full rounded-t bg-chart transition-opacity ${
                    active !== null && active !== i ? 'opacity-60' : ''
                  }`}
                  style={{ maxWidth: BAR_MAX, height: d.value > 0 ? `${h}%` : 0 }}
                />
                {i === data.length - 1 && d.value > 0 && (
                  <span
                    className="absolute text-xs font-semibold text-ink dark:text-white"
                    style={{ bottom: `calc(${h}% + 4px)` }}
                  >
                    {d.value}
                  </span>
                )}
                {active === i && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute z-10 rounded-lg bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg dark:bg-slate-700"
                    style={{ bottom: `calc(${h}% + 8px)` }}
                  >
                    <strong className="text-sm">{d.value}</strong> {unit}
                    <span className="block text-slate-300">{d.title ?? d.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex text-[11px] text-slate-500 dark:text-slate-400" aria-hidden="true">
        {data.map((d, i) => (
          <span key={i} className="truncate text-center" style={{ width: `${slot}%` }}>
            {d.label}
          </span>
        ))}
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-slate-500 dark:text-slate-400">
          Jadval ko‘rinishi
        </summary>
        <table id={tableId} className="mt-2 w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="py-1 font-semibold">Davr</th>
              <th className="py-1 text-right font-semibold">{unit}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-1">{d.title ?? d.label}</td>
                <td className="py-1 text-right tabular-nums">{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function weekLabel(iso: string) {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
}

export function weekColumns<P extends WeeklyPoint>(
  trend: P[],
  field: { [K in keyof P]: P[K] extends number ? K : never }[keyof P],
) {
  return trend.map((p) => ({
    label: weekLabel(p.weekStart),
    title: `${weekLabel(p.weekStart)} dan boshlangan hafta`,
    value: p[field],
  }));
}

/** A labelled meter for a 0..1 rate (text first, the bar only supports it). */
export function RateMeter({ label, value }: { label: string; value: Rate }) {
  const pct = value === null ? 0 : Math.round(value * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{percent(value)}</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={value === null ? 'Ma’lumot yo‘q' : `${pct}%`}
        className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      >
        <div className="h-full rounded-full bg-chart" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
