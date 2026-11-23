'use client';

import {
  columnLabel,
  GRADE_BAND_LABEL,
  gradeBand,
  type GradeBand,
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
export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-muted">—</span>;
  const band = gradeBand(score);
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
      description="Darsda o‘qituvchingiz qo‘ygan baholar (100 ballik shkala). Ularni faqat siz va o‘qituvchingiz ko‘rasiz."
    >
      <div className="space-y-6">
        {books.map((b) => (
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
        ))}
      </div>
    </Section>
  );
}
