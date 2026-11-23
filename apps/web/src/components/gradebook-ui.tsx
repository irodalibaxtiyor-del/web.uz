'use client';

import {
  columnLabel,
  CREDIT_CONTROL_INFO,
  CREDIT_YN_PASS,
  GRADE_BAND_LABEL,
  GRADE_BAND_MARK,
  gradeBand,
  type CreditFinal,
  type GradeBand,
  type SectionMark,
  type MeResponse,
  type MyGradebook,
} from '@webdizayn/shared';
import { useEffect, useState } from 'react';
import { Empty, Section } from '@/components/analytics-ui';
import { TableScroll } from '@/components/ui';
import { api } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const BAND_STYLE: Record<GradeBand, string> = {
  EXCELLENT: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100',
  GOOD: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100',
  SATISFACTORY: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
  FAIL: 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100',
};

/** Score with its band shown as colour AND as text (for screen readers and colour-blind users). */
export function ScoreBadge({ score, max = 100 }: { score: number | null; max?: number }) {
  if (score === null) return <span className="text-muted">—</span>;
  const band = gradeBand(score, max);
  return (
    <span
      className={`inline-block min-w-12 rounded-md px-2 py-0.5 text-center font-semibold tabular-nums ${BAND_STYLE[band]}`}
      title={GRADE_BAND_LABEL[band]}
    >
      {score}
      <span className="sr-only">, {GRADE_BAND_LABEL[band]}</span>
    </span>
  );
}

export function BandLegend() {
  return (
    <ul className="flex flex-wrap gap-2 text-xs" aria-label="Baho darajalari">
      {(Object.keys(GRADE_BAND_LABEL) as GradeBand[]).map((b) => (
        <li key={b} className={`rounded-md px-2 py-0.5 ${BAND_STYLE[b]}`}>
          {GRADE_BAND_LABEL[b]}
        </li>
      ))}
    </ul>
  );
}

export const columnHeader = columnLabel;

/** “5”, “4”, “3”, “2” mark with its band colour and a text label. */
export function MarkBadge({ band }: { band: GradeBand | null }) {
  if (band === null) return <span className="text-muted">—</span>;
  return (
    <span
      className={`inline-block min-w-8 rounded-md px-2 py-0.5 text-center font-bold ${BAND_STYLE[band]}`}
      title={GRADE_BAND_LABEL[band]}
    >
      {GRADE_BAND_MARK[band]}
      <span className="sr-only">, {GRADE_BAND_LABEL[band]}</span>
    </span>
  );
}

/** JN / ON sum “38 / 40” with its mark. */
export function SectionCell({ mark }: { mark: SectionMark | null }) {
  if (!mark) return <span className="text-muted">—</span>;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="font-semibold tabular-nums">
        {mark.score}
        <span className="font-normal text-muted"> / {mark.max}</span>
      </span>
      <MarkBadge band={mark.band} />
    </span>
  );
}

export const FINAL_TEXT: Record<CreditFinal, string> = {
  PENDING: 'YaN hali qo‘yilmagan',
  PASSED: 'Yakuniy baho',
  YN_FAILED: `YaN ${CREDIT_YN_PASS} balldan kam — topshirilmagan`,
};

/** Column header text: “JN-1 (20)” for credit controls, the topic/date otherwise. */
export function controlLabel(c: {
  control: keyof typeof CREDIT_CONTROL_INFO | null;
  title: string;
  date: string | null;
  maxScore: number;
}) {
  return c.control ? `${CREDIT_CONTROL_INFO[c.control].short} (${c.maxScore})` : columnLabel(c);
}

/** Student: grades the teacher gave in class, from every organization the student is in. */
export function MyGradebooks() {
  const me = useApi<MeResponse>('/auth/me');
  const [books, setBooks] = useState<MyGradebook[] | null>(null);
  useEffect(() => {
    if (me.state.kind !== 'ready') return;
    const orgs = me.state.data.memberships.filter((m) => m.role === 'STUDENT');
    let cancelled = false;
    Promise.all(
      orgs.map((m) => api<MyGradebook[]>(`/orgs/${m.organizationId}/gradebooks/mine`)),
    ).then((rs) => !cancelled && setBooks(rs.flatMap((r) => (r.ok ? r.data : []))));
    return () => {
      cancelled = true;
    };
  }, [me.state]);

  if (books === null || books.length === 0) return null;
  return (
    <Section
      title="O‘qituvchi baholari"
      description="O‘qituvchingiz qo‘ygan baholar. Ularni faqat siz va o‘qituvchingiz ko‘rasiz."
    >
      <div className="space-y-6">
        {books.map((b) =>
          b.scheme === 'CREDIT' ? (
            <CreditCard key={b.id} b={b} />
          ) : (
            <div key={b.id} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {b.title} <span className="font-normal text-muted">· {b.groupName}</span>
                </h3>
                <p className="text-sm">
                  O‘rtacha: <ScoreBadge score={b.average} />
                </p>
              </div>
              {b.columns.length === 0 ? (
                <Empty>Hali baho qo‘yilmagan.</Empty>
              ) : (
                <TableScroll label={`${b.title} baholari`}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted">
                        <th scope="col" className="py-2 pr-4 font-medium">
                          Dars
                        </th>
                        <th scope="col" className="py-2 font-medium">
                          Baho
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {b.columns.map((c) => (
                        <tr key={c.id} className="border-t border-line">
                          <td className="py-2 pr-4">{columnLabel(c)}</td>
                          <td className="py-2">
                            <ScoreBadge score={c.score} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableScroll>
              )}
            </div>
          ),
        )}
      </div>
    </Section>
  );
}

/** Student: one credit gradebook — JN first (the current-control mark), then ON, YaN, total. */
function CreditCard({ b }: { b: MyGradebook }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">
        {b.title} <span className="font-normal text-muted">· {b.groupName}</span>
      </h3>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line p-3">
          <dt className="text-sm text-muted">Joriy nazorat (JN)</dt>
          <dd className="mt-1 text-lg">
            <SectionCell mark={b.sections?.JN ?? null} />
          </dd>
        </div>
        <div className="rounded-xl border border-line p-3">
          <dt className="text-sm text-muted">Oraliq nazorat (ON)</dt>
          <dd className="mt-1 text-lg">
            <SectionCell mark={b.sections?.ON ?? null} />
          </dd>
        </div>
        <div className="rounded-xl border border-line p-3">
          <dt className="text-sm text-muted">Jami ball</dt>
          <dd className="mt-1 text-lg">
            <span className="font-semibold tabular-nums">
              {b.total ?? '—'}
              <span className="font-normal text-muted">
                {' '}
                / {b.final === 'PENDING' ? (b.heldMax ?? 100) : 100}
              </span>
            </span>{' '}
            {b.final !== 'PENDING' && <MarkBadge band={b.band} />}
          </dd>
          {b.final && <dd className="mt-1 text-xs text-muted">{FINAL_TEXT[b.final]}</dd>}
        </div>
      </dl>
      <TableScroll label={`${b.title} baholari`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">
                Nazorat
              </th>
              <th scope="col" className="py-2 font-medium">
                Ball
              </th>
            </tr>
          </thead>
          <tbody>
            {b.columns.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="py-2 pr-4">
                  {c.control ? CREDIT_CONTROL_INFO[c.control].title : columnLabel(c)}
                </td>
                <td className="py-2">
                  {c.score === null ? (
                    <span className="text-muted">—</span>
                  ) : (
                    <span className="tabular-nums">
                      {c.score}
                      <span className="text-muted"> / {c.maxScore}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </div>
  );
}
