'use client';

import {
  EXPERIMENT_ROLE_LABEL,
  effectSizeLabel,
  formatP,
  round,
  type Comparison,
  type ExperimentRole,
  type ExperimentView,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Button, ErrorText, inputClass, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const fmt = (x: number | null | undefined, digits = 1) =>
  x === null || x === undefined || !Number.isFinite(x) ? '—' : String(round(x, digits));

export default function ExperimentPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state, setState } = useApi<ExperimentView>(`${base}/experiment`);
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `${base}/manage`, label: 'Kursni boshqarish' },
        ]}
        title="Pedagogik tajriba"
        subtitle="Tajriba va nazorat guruhlarini kirish va yakuniy test natijalari bo'yicha statistik taqqoslash."
        actions={
          <a href={`/api${base}/experiment/report.xlsx`} className="btn btn-outline">
            Hisobot (Excel)
          </a>
        }
      />
      <LoadState state={state}>
        {(v) => (
          <div className="space-y-8">
            <Groups
              base={base}
              view={v}
              onSaved={(next) => setState({ kind: 'ready', data: next })}
            />
            <Conclusions list={v.conclusions} />
            <Descriptive v={v} />
            <Comparisons v={v} />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Natijalar{' '}
              <Link
                href={`${base}/manage/assessments`}
                className="font-semibold text-brand-700 underline dark:text-brand-300"
              >
                kirish va yakuniy test
              </Link>{' '}
              bo&apos;yicha hisoblanadi. Welch t-mezoni guruhlar dispersiyasi teng bo&apos;lishini
              talab qilmaydi; Cohen d: 0,2 — kichik, 0,5 — o&apos;rtacha, 0,8 — katta samara.
            </p>
          </div>
        )}
      </LoadState>
    </>
  );
}

function Groups({
  base,
  view,
  onSaved,
}: {
  base: string;
  view: ExperimentView;
  onSaved: (v: ExperimentView) => void;
}) {
  const [roles, setRoles] = useState<Record<string, ExperimentRole | ''>>(() =>
    Object.fromEntries(view.groups.map((g) => [g.id, g.role ?? ''])),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setPending(true);
    setError(null);
    const res = await send<ExperimentView>('PUT', `${base}/experiment/groups`, {
      groups: view.groups.map((g) => ({ groupId: g.id, role: roles[g.id] || null })),
    });
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
    onSaved(res.data);
  }

  return (
    <section className="card space-y-4 p-6" aria-labelledby="guruhlar">
      <h2 id="guruhlar" className="text-xl font-bold">
        Guruhlar
      </h2>
      {view.groups.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">
          Tashkilotda hali guruh yo&apos;q. Administrator guruhlarni yaratgach, shu yerda
          belgilaysiz.
        </p>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {view.groups.map((g) => (
              <li
                key={g.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line p-3"
              >
                <span>
                  <span className="block font-semibold">{g.name}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Kursga yozilgan: {g.students}
                  </span>
                </span>
                <select
                  aria-label={`${g.name} guruhining roli`}
                  value={roles[g.id] ?? ''}
                  onChange={(e) => {
                    setRoles((r) => ({ ...r, [g.id]: e.target.value as ExperimentRole | '' }));
                    setSaved(false);
                  }}
                  className={`${inputClass} w-auto`}
                >
                  <option value="">Tajribada emas</option>
                  <option value="EXPERIMENT">{EXPERIMENT_ROLE_LABEL.EXPERIMENT}</option>
                  <option value="CONTROL">{EXPERIMENT_ROLE_LABEL.CONTROL}</option>
                </select>
              </li>
            ))}
          </ul>
          {error && <ErrorText>{error}</ErrorText>}
          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={pending}>
              {pending ? 'Saqlanmoqda…' : 'Saqlash va hisoblash'}
            </Button>
            {saved && (
              <span role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
                Saqlandi
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function Conclusions({ list }: { list: string[] }) {
  return (
    <section className="card space-y-3 border-l-4 border-l-brand-600 p-6" aria-labelledby="xulosa">
      <h2 id="xulosa" className="flex items-center gap-2 text-xl font-bold">
        <Icon name="sparkles" className="size-5 text-brand-700 dark:text-brand-300" />
        Xulosa
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        {list.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
}

function Descriptive({ v }: { v: ExperimentView }) {
  const e = v.stats.experiment;
  const c = v.stats.control;
  const rows: [string, string, string][] = [
    ['Talabalar soni', String(e.rows.length), String(c.rows.length)],
    ['Ikkala testni topshirgan', String(e.paired), String(c.paired)],
    [
      "Kirish testi, o'rtacha ± SD",
      `${fmt(e.preMean)} ± ${fmt(e.preSd)}`,
      `${fmt(c.preMean)} ± ${fmt(c.preSd)}`,
    ],
    [
      "Yakuniy test, o'rtacha ± SD",
      `${fmt(e.postMean)} ± ${fmt(e.postSd)}`,
      `${fmt(c.postMean)} ± ${fmt(c.postSd)}`,
    ],
    ["O'rtacha o'sish (punkt)", fmt(e.meanGain), fmt(c.meanGain)],
    ['Hake g (o‘rtacha)', fmt(e.meanNormalizedGain, 2), fmt(c.meanNormalizedGain, 2)],
    ["Faol vaqt, daq. (o'rtacha)", fmt(e.meanActiveMinutes, 0), fmt(c.meanActiveMinutes, 0)],
    ['Vaqt ↔ yakuniy natija (r)', fmt(e.timePostCorrelation, 2), fmt(c.timePostCorrelation, 2)],
    [
      'Guruh ichida kirish → yakuniy',
      e.t === null ? '—' : `t(${e.df}) = ${fmt(e.t, 2)}, ${formatP(e.p)}`,
      c.t === null ? '—' : `t(${c.df}) = ${fmt(c.t, 2)}, ${formatP(c.p)}`,
    ],
    [
      `Yakuniy testdan o'tgan (≥ ${v.postPassingPercent}%)`,
      `${v.stats.passRate.experiment.passed} / ${v.stats.passRate.experiment.total}`,
      `${v.stats.passRate.control.passed} / ${v.stats.passRate.control.total}`,
    ],
  ];
  return (
    <section className="card space-y-4 p-6" aria-labelledby="tavsifiy">
      <h2 id="tavsifiy" className="text-xl font-bold">
        Tavsifiy statistika
      </h2>
      <TableScroll label="Tavsifiy statistika">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-3">Ko&apos;rsatkich</th>
              <th className="py-2 pr-3">{EXPERIMENT_ROLE_LABEL.EXPERIMENT}</th>
              <th className="py-2">{EXPERIMENT_ROLE_LABEL.CONTROL}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, a, b]) => (
              <tr key={k} className="border-b border-line last:border-0">
                <th scope="row" className="py-2 pr-3 font-medium">
                  {k}
                </th>
                <td className="py-2 pr-3 tabular-nums">{a}</td>
                <td className="py-2 tabular-nums">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </section>
  );
}

function Comparisons({ v }: { v: ExperimentView }) {
  const s = v.stats;
  const rows: [string, Comparison][] = [
    ['Kirish testi (boshlang‘ich tenglik)', s.baseline],
    ['Yakuniy test', s.post],
    ["O'sish (yakuniy − kirish)", s.gain],
    ['Hake g', s.normalizedGain],
    ['Faol vaqt, daq.', s.time],
  ];
  return (
    <section className="card space-y-4 p-6" aria-labelledby="taqqoslash">
      <h2 id="taqqoslash" className="text-xl font-bold">
        Guruhlarni taqqoslash (tajriba − nazorat)
      </h2>
      <TableScroll label="Guruhlarni taqqoslash">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-3">Ko&apos;rsatkich</th>
              <th className="py-2 pr-3 text-right">Farq</th>
              <th className="py-2 pr-3 text-right">Welch t (df)</th>
              <th className="py-2 pr-3 text-right">p (Welch)</th>
              <th className="py-2 pr-3 text-right">Mann–Whitney z, p</th>
              <th className="py-2 pr-3 text-right">Normallik (SW p) T / N</th>
              <th className="py-2 text-right">Cohen d</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, c]) => (
              <tr key={label} className="border-b border-line last:border-0">
                <th scope="row" className="py-2 pr-3 font-medium">
                  {label}
                </th>
                <td className="py-2 pr-3 text-right tabular-nums">{fmt(c.difference, 2)}</td>
                <td className="py-2 pr-3 text-right tabular-nums">
                  {c.test ? `${fmt(c.test.t, 2)} (${fmt(c.test.df, 1)})` : '—'}
                </td>
                <td
                  className={`py-2 pr-3 text-right tabular-nums ${c.recommended === 'WELCH' ? 'font-semibold' : ''}`}
                >
                  {c.test ? formatP(c.test.p).replace('p ', '') : '—'}
                  {c.recommended === 'WELCH' && c.test && ' ★'}
                </td>
                <td
                  className={`py-2 pr-3 text-right tabular-nums ${c.recommended === 'MANN_WHITNEY' ? 'font-semibold' : ''}`}
                >
                  {c.mannWhitney
                    ? `${fmt(c.mannWhitney.z, 2)}, ${formatP(c.mannWhitney.p).replace('p ', '')}`
                    : '—'}
                  {c.recommended === 'MANN_WHITNEY' && c.mannWhitney && ' ★'}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums">
                  {fmt(c.normalityP.experiment, 3)} / {fmt(c.normalityP.control, 3)}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {c.d === null ? '—' : `${fmt(c.d, 2)} (${effectSizeLabel(c.d)})`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        ★ — asosiy deb olingan mezon: ikkala guruhda Shapiro–Wilk p ≥ 0,05 bo&apos;lsa Welch t, aks
        holda Mann–Whitney U (taqsimot normal emas).
      </p>
      <p className="text-sm">
        Yakuniy testdan o&apos;tish ulushi, Pearson χ²:{' '}
        <strong>
          {s.passRate.chi2 === null
            ? 'hisoblab bo‘lmaydi (ma’lumot yetarli emas)'
            : `χ²(1) = ${fmt(s.passRate.chi2, 2)}, ${formatP(s.passRate.p)}`}
        </strong>
      </p>
    </section>
  );
}
