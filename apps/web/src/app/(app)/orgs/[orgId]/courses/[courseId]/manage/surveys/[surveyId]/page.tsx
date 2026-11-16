'use client';

import {
  alphaLabel,
  formatP,
  LIKERT_LABELS,
  round,
  SURVEY_PHASE_LABEL,
  SURVEY_PHASES,
  updateSurveySchema,
  type SurveyAdmin,
  type SurveyItem,
  type SurveyPhase,
  type SurveyResults,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { newId } from '@/components/quiz-editors';
import { Button, ErrorText, inputClass, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const fmt = (x: number | null | undefined, digits = 2) =>
  x === null || x === undefined || !Number.isFinite(x) ? '—' : String(round(x, digits));

export default function SurveyPage() {
  const { orgId, courseId, surveyId } = useParams<{
    orgId: string;
    courseId: string;
    surveyId: string;
  }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const path = `${base}/surveys/${surveyId}`;
  const { state } = useApi<SurveyAdmin>(`${path}/edit`);
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `${base}/manage`, label: 'Kursni boshqarish' },
          { href: `${base}/manage/surveys`, label: "So'rovnomalar" },
        ]}
        title="So'rovnoma"
      />
      <LoadState state={state}>
        {(s) => (
          <div className="space-y-8">
            <div className="card p-6 sm:p-8">
              <SurveyForm key={s.id} initial={s} path={path} />
            </div>
            <Results path={path} />
          </div>
        )}
      </LoadState>
    </>
  );
}

function SurveyForm({ initial, path }: { initial: SurveyAdmin; path: string }) {
  const id = useId();
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [phase, setPhase] = useState<SurveyPhase>(initial.phase);
  const [items, setItems] = useState<SurveyItem[]>(initial.items);
  const [anonymous, setAnonymous] = useState(initial.anonymous);
  const [isOpen, setIsOpen] = useState(initial.isOpen);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const locked = initial.locked;
  const touch = () => setSaved(false);
  const setItem = (i: number, patch: Partial<SurveyItem>) => {
    setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...patch } : x)));
    touch();
  };
  const move = (from: number, to: number) => {
    setItems((xs) => {
      const next = [...xs];
      const [x] = next.splice(from, 1);
      next.splice(to, 0, x!);
      return next;
    });
    touch();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = updateSurveySchema.safeParse({
      title,
      description,
      phase,
      anonymous,
      isOpen,
      ...(locked ? {} : { items }),
    });
    if (!parsed.success) {
      const p = parsed.error.issues[0]?.path ?? [];
      return setError(
        p[0] === 'items' && typeof p[1] === 'number'
          ? `${p[1] + 1}-savol matnini yozing`
          : 'Tekshiring: nom kamida 2 belgi bo‘lsin',
      );
    }
    if (isOpen && items.length === 0)
      return setError('Ochiq so‘rovnomada kamida bitta savol kerak');
    setPending(true);
    const res = await send('PATCH', path, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
        <div className="space-y-1">
          <label htmlFor={`${id}-t`} className="text-sm font-medium">
            Nomi
          </label>
          <input
            id={`${id}-t`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              touch();
            }}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-p`} className="text-sm font-medium">
            Qachon o&apos;tkaziladi
          </label>
          <select
            id={`${id}-p`}
            value={phase}
            onChange={(e) => {
              setPhase(e.target.value as SurveyPhase);
              touch();
            }}
            className={inputClass}
          >
            {SURVEY_PHASES.map((p) => (
              <option key={p} value={p}>
                {SURVEY_PHASE_LABEL[p]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-d`} className="text-sm font-medium">
          Talabaga ko&apos;rsatma
        </label>
        <textarea
          id={`${id}-d`}
          value={description}
          rows={2}
          onChange={(e) => {
            setDescription(e.target.value);
            touch();
          }}
          className={inputClass}
        />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => {
              setAnonymous(e.target.checked);
              touch();
            }}
          />
          Anonim (natijalarda ism ko&apos;rsatilmaydi)
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={(e) => {
              setIsOpen(e.target.checked);
              touch();
            }}
          />
          Ochiq (talabalar javob bera oladi)
        </label>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Savollar ({items.length})</h2>
        {locked && (
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Javoblar kelgan, shuning uchun savollar qulflangan — barcha talabalar bir xil
            so&apos;rovnomaga javob beradi.
          </p>
        )}
        <ol className="space-y-3">
          {items.map((it, i) => (
            <li key={it.id} className="space-y-3 rounded-xl border border-line bg-panel p-4">
              <div className="flex flex-wrap items-start gap-3">
                <span className="pt-2 font-semibold">{i + 1}.</span>
                <textarea
                  aria-label={`${i + 1}-savol matni`}
                  value={it.text}
                  disabled={locked}
                  rows={2}
                  onChange={(e) => setItem(i, { text: e.target.value })}
                  className={`${inputClass} min-w-0 flex-1`}
                />
                <select
                  aria-label={`${i + 1}-savol turi`}
                  value={it.kind}
                  disabled={locked}
                  onChange={(e) =>
                    setItem(i, {
                      kind: e.target.value as SurveyItem['kind'],
                      reverse: false,
                      scale: e.target.value === 'TEXT' ? '' : it.scale,
                    })
                  }
                  className={`${inputClass} w-auto`}
                >
                  <option value="LIKERT">Likert (1–5)</option>
                  <option value="TEXT">Ochiq javob</option>
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:pl-6">
                {it.kind === 'LIKERT' && (
                  <>
                    <label className="flex items-center gap-2 text-sm">
                      Subshkala
                      <input
                        value={it.scale}
                        disabled={locked}
                        onChange={(e) => setItem(i, { scale: e.target.value })}
                        placeholder="masalan, Motivatsiya"
                        className={`${inputClass} w-48`}
                      />
                    </label>
                    <label className="flex min-h-11 items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={it.reverse}
                        disabled={locked}
                        onChange={(e) => setItem(i, { reverse: e.target.checked })}
                      />
                      Teskari band (6 − ball)
                    </label>
                  </>
                )}
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={it.required}
                    disabled={locked}
                    onChange={(e) => setItem(i, { required: e.target.checked })}
                  />
                  Majburiy
                </label>
                {!locked && (
                  <span className="flex gap-1">
                    <Button variant="ghost" disabled={i === 0} onClick={() => move(i, i - 1)}>
                      <Icon name="arrowUp" className="size-4" />
                      <span className="sr-only">Yuqoriga</span>
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={i === items.length - 1}
                      onClick={() => move(i, i + 1)}
                    >
                      <Icon name="arrowDown" className="size-4" />
                      <span className="sr-only">Pastga</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setItems((xs) => xs.filter((_, j) => j !== i));
                        touch();
                      }}
                    >
                      <Icon name="trash" className="size-4" />
                      <span className="sr-only">{i + 1}-savolni o&apos;chirish</span>
                    </Button>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
        {!locked && (
          <div className="flex flex-wrap gap-2">
            {(['LIKERT', 'TEXT'] as const).map((kind) => (
              <Button
                key={kind}
                variant="secondary"
                disabled={items.length >= 60}
                onClick={() => {
                  setItems((xs) => [
                    ...xs,
                    {
                      id: newId('s'),
                      text: '',
                      kind,
                      reverse: false,
                      scale: kind === 'LIKERT' ? (xs.at(-1)?.scale ?? '') : '',
                      required: kind === 'LIKERT',
                    },
                  ]);
                  touch();
                }}
              >
                <Icon name="plus" className="size-4" />
                {kind === 'LIKERT' ? 'Likert bandi' : 'Ochiq savol'}
              </Button>
            ))}
          </div>
        )}
      </section>
      {error && <ErrorText>{error}</ErrorText>}
      {saved && (
        <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
          Saqlandi
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Saqlanmoqda…' : 'Saqlash'}
      </Button>
    </form>
  );
}

function Results({ path }: { path: string }) {
  const { state } = useApi<SurveyResults>(`${path}/results`);
  return (
    <section className="card space-y-5 p-6 sm:p-8" aria-labelledby="sr-natija">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="sr-natija" className="text-xl font-bold">
          Natijalar
        </h2>
        <a href={`/api${path}/results.xlsx`} className="btn btn-outline">
          Excel yuklab olish
        </a>
      </div>
      <LoadState state={state}>
        {(r) => (
          <>
            <p>
              Javob berganlar: <strong>{r.respondents}</strong> / {r.enrolled} (kursga yozilgan)
            </p>
            {r.scales.length > 0 && (
              <TableScroll label="Subshkalalar">
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="py-2 pr-3">Subshkala</th>
                      <th className="py-2 pr-3 text-right">n</th>
                      <th className="py-2 pr-3 text-right">O&apos;rtacha ± SD</th>
                      <th className="py-2 pr-3 text-right">Cronbach α</th>
                      <th className="py-2 pr-3 text-right">Tajriba / nazorat</th>
                      <th className="py-2 text-right">Welch t, p</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.scales.map((s) => (
                      <tr key={s.scale} className="border-b border-line last:border-0">
                        <th scope="row" className="py-2 pr-3 font-medium">
                          {s.scale} <span className="font-normal">({s.items} band)</span>
                        </th>
                        <td className="py-2 pr-3 text-right tabular-nums">{s.n}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {fmt(s.mean)} ± {fmt(s.sd)}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {fmt(s.alpha, 3)} ({alphaLabel(s.alpha)})
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {s.experiment
                            ? `${fmt(s.experiment.mean)} / ${fmt(s.control?.mean)}`
                            : '—'}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {s.test ? `${fmt(s.test.t)}, ${formatP(s.test.p)}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableScroll>
            )}
            <ul className="space-y-3">
              {r.items.map((i) => (
                <li key={i.id} className="rounded-xl border border-line p-4">
                  <p className="font-medium">
                    {i.text}
                    {i.reverse && (
                      <span className="ml-2 text-xs font-normal text-slate-600 dark:text-slate-400">
                        (teskari)
                      </span>
                    )}
                  </p>
                  {i.kind === 'LIKERT' ? (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        n = {i.n} · o&apos;rtacha {fmt(i.mean)} ± {fmt(i.sd)}
                      </p>
                      <Distribution counts={i.distribution ?? []} />
                    </>
                  ) : (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                      {(i.texts ?? []).length === 0 && <li>Javob yo&apos;q</li>}
                      {(i.texts ?? []).map((t, k) => (
                        <li key={k}>{t}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </LoadState>
    </section>
  );
}

/** Horizontal bars of how many chose 1..5 (labels as text; values shown, not colour-only). */
function Distribution({ counts }: { counts: number[] }) {
  const max = Math.max(1, ...counts);
  return (
    <ol className="mt-2 space-y-1 text-sm">
      {counts.map((c, i) => (
        <li key={i} className="grid grid-cols-[11rem_1fr_2rem] items-center gap-2">
          <span>
            {i + 1} — {LIKERT_LABELS[i]}
          </span>
          <span className="h-3 rounded-full bg-subtle" aria-hidden="true">
            <span
              className="block h-3 rounded-full bg-[var(--color-chart)]"
              style={{ width: `${(c / max) * 100}%` }}
            />
          </span>
          <span className="text-right tabular-nums">{c}</span>
        </li>
      ))}
    </ol>
  );
}
