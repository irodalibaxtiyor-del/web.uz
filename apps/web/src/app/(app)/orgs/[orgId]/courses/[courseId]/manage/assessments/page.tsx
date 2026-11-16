'use client';

import {
  ASSESSMENT_KINDS,
  ASSESSMENT_LABEL,
  ASSESSMENT_SLUG,
  effectSizeLabel,
  formatP,
  QUIZ_KIND_LABEL,
  round,
  summarizeAssessment,
  upsertAssessmentSchema,
  type AssessmentAdmin,
  type AssessmentKind,
  type AssessmentResults,
  type QuizQuestion,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useId, useMemo, useState, type FormEvent } from 'react';
import { confirmDialog } from '@/components/dialog';
import { describeIssue, QuestionListEditor } from '@/components/question-list-editor';
import { Button, ErrorText, inputClass, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function ManageAssessmentsPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state, reload } = useApi<AssessmentAdmin[]>(`${base}/assessments`);
  const [tab, setTab] = useState<AssessmentKind>('PRETEST');
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `${base}/manage`, label: 'Kursni boshqarish' },
        ]}
        title="Kirish va yakuniy test"
        subtitle="Pedagogik tajriba uchun o'lchov vositalari: har talabaga bitta urinish, savol bo'yicha izoh ko'rsatilmaydi, savollar birinchi talaba boshlagach qulflanadi."
      />
      <LoadState state={state}>
        {(list) => {
          const byKind = new Map(list.map((a) => [a.kind, a]));
          const pre = byKind.get('PRETEST');
          return (
            <div className="space-y-8">
              <div role="tablist" aria-label="Test turi" className="flex flex-wrap gap-2">
                {ASSESSMENT_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={tab === k}
                    onClick={() => setTab(k)}
                    className={`btn ${tab === k ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {ASSESSMENT_LABEL[k]}
                    {byKind.get(k)?.isOpen && ' · ochiq'}
                  </button>
                ))}
              </div>
              <div role="tabpanel" className="card p-6 sm:p-8">
                <AssessmentForm
                  key={`${tab}-${byKind.get(tab)?.id ?? 'new'}`}
                  base={base}
                  kind={tab}
                  initial={byKind.get(tab)}
                  copyFrom={tab === 'POSTTEST' ? pre : undefined}
                  onSaved={reload}
                />
              </div>
              <Results base={base} />
            </div>
          );
        }}
      </LoadState>
    </>
  );
}

function AssessmentForm({
  base,
  kind,
  initial,
  copyFrom,
  onSaved,
}: {
  base: string;
  kind: AssessmentKind;
  initial: AssessmentAdmin | undefined;
  copyFrom: AssessmentAdmin | undefined;
  onSaved: () => void;
}) {
  const id = useId();
  const [title, setTitle] = useState(initial?.title ?? ASSESSMENT_LABEL[kind]);
  const [description, setDescription] = useState(
    initial?.description ??
      (kind === 'PRETEST'
        ? "Kursni boshlashdan oldin bilimingizni aniqlash uchun. Baho qo'yilmaydi — bilganingizcha javob bering."
        : 'Kurs yakunida bilimingizni o‘lchash uchun. Bitta urinish beriladi.'),
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>(initial?.questions ?? []);
  const [timeLimit, setTimeLimit] = useState<string>(
    initial?.timeLimitMinutes ? String(initial.timeLimitMinutes) : '',
  );
  const [passingPercent, setPassingPercent] = useState(initial?.passingPercent ?? 60);
  const [isOpen, setIsOpen] = useState(initial?.isOpen ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const locked = initial?.locked ?? false;
  const touch = () => setSaved(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = upsertAssessmentSchema.safeParse({
      title,
      description,
      questions,
      timeLimitMinutes: timeLimit ? Number(timeLimit) : null,
      passingPercent: Number(passingPercent),
      isOpen,
    });
    if (!parsed.success) {
      const path = parsed.error.issues[0]?.path ?? [];
      return setError(
        path[0] === 'questions' && path.length === 1
          ? 'Ochiq testda kamida bitta savol bo‘lishi kerak'
          : describeIssue(path),
      );
    }
    setPending(true);
    const res = await send('PUT', `${base}/assessments/${ASSESSMENT_SLUG[kind]}`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
    onSaved();
  }

  async function copyQuestions() {
    if (!copyFrom) return;
    if (
      questions.length > 0 &&
      !(await confirmDialog({
        title: 'Savollarni nusxalash',
        message: 'Joriy savollar kirish testi savollari bilan almashtiriladi.',
        confirmLabel: 'Nusxalash',
      }))
    ) {
      return;
    }
    setQuestions(copyFrom.questions);
    touch();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{ASSESSMENT_LABEL[kind]}</h2>
        {initial && (
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Boshlagan: {initial.started} · topshirgan: {initial.submitted}
          </span>
        )}
      </header>
      <div className="grid gap-4 sm:grid-cols-[1fr_9rem_9rem]">
        <div className="space-y-1">
          <label htmlFor={`${id}-title`} className="text-sm font-medium">
            Nomi
          </label>
          <input
            id={`${id}-title`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              touch();
            }}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-time`} className="text-sm font-medium">
            Vaqt (daqiqa)
          </label>
          <input
            id={`${id}-time`}
            type="number"
            min={1}
            max={180}
            placeholder="cheksiz"
            value={timeLimit}
            disabled={locked}
            onChange={(e) => {
              setTimeLimit(e.target.value);
              touch();
            }}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-pass`} className="text-sm font-medium">
            O&apos;tish chegarasi, %
          </label>
          <input
            id={`${id}-pass`}
            type="number"
            min={1}
            max={100}
            value={passingPercent}
            onChange={(e) => {
              setPassingPercent(Number(e.target.value));
              touch();
            }}
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-desc`} className="text-sm font-medium">
          Talabaga ko&apos;rsatma
        </label>
        <textarea
          id={`${id}-desc`}
          value={description}
          rows={2}
          onChange={(e) => {
            setDescription(e.target.value);
            touch();
          }}
          className={inputClass}
        />
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={isOpen}
          onChange={(e) => {
            setIsOpen(e.target.checked);
            touch();
          }}
        />
        Ochiq (kursga yozilgan talabalar topshira oladi)
      </label>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Savollar ({questions.length})</h3>
          {copyFrom && copyFrom.questions.length > 0 && !locked && (
            <Button variant="secondary" onClick={copyQuestions}>
              Kirish testi savollaridan nusxa olish
            </Button>
          )}
        </div>
        {locked ? (
          <>
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              Talabalar testni boshlagan, shuning uchun savollar va vaqt qulflangan — har bir talaba
              bir xil o&apos;lchov vositasini yechadi. Nom, ko&apos;rsatma va ochiq/yopiqlikni
              o&apos;zgartirish mumkin.
            </p>
            <ol className="list-decimal space-y-1 pl-6 text-sm">
              {questions.map((q) => (
                <li key={q.id}>
                  {q.prompt}{' '}
                  <span className="text-slate-600 dark:text-slate-400">
                    ({QUIZ_KIND_LABEL[q.kind]})
                  </span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <QuestionListEditor
            questions={questions}
            explanations={false}
            onChange={(next) => {
              setQuestions(next);
              touch();
            }}
          />
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

const fmt = (x: number | null, digits = 1) => (x === null ? '—' : String(round(x, digits)));

function Results({ base }: { base: string }) {
  const { state } = useApi<AssessmentResults>(`${base}/assessments/results`);
  const [group, setGroup] = useState('');
  return (
    <section className="card space-y-5 p-6 sm:p-8" aria-labelledby="natijalar">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="natijalar" className="text-xl font-bold">
          Natijalar: kirish → yakuniy
        </h2>
        <a href={`/api${base}/assessments/results.xlsx`} className="btn btn-outline">
          Excel yuklab olish
        </a>
      </div>
      <LoadState state={state}>
        {(all) => <ResultsBody all={all} group={group} setGroup={setGroup} />}
      </LoadState>
    </section>
  );
}

function ResultsBody({
  all,
  group,
  setGroup,
}: {
  all: AssessmentResults;
  group: string;
  setGroup: (g: string) => void;
}) {
  const groups = useMemo(
    () => [...new Set(all.rows.map((r) => r.group ?? 'Guruhsiz'))].sort(),
    [all.rows],
  );
  const r = useMemo(
    () =>
      group ? summarizeAssessment(all.rows.filter((x) => (x.group ?? 'Guruhsiz') === group)) : all,
    [all, group],
  );
  if (all.rows.length === 0) {
    return <p className="text-slate-600 dark:text-slate-400">Kursga hali talaba yozilmagan.</p>;
  }
  const stats: [string, string][] = [
    ['Ikkala testni topshirgan', String(r.paired)],
    ["Kirish: o'rtacha ± SD", `${fmt(r.preMean)} ± ${fmt(r.preSd)}`],
    ["Yakuniy: o'rtacha ± SD", `${fmt(r.postMean)} ± ${fmt(r.postSd)}`],
    ["O'rtacha o'sish", `${fmt(r.meanGain)} punkt`],
    ['Hake g (o‘rtacha)', fmt(r.meanNormalizedGain, 2)],
    ['Juftlangan t-mezoni', r.t === null ? '—' : `t(${r.df}) = ${fmt(r.t, 2)}, ${formatP(r.p)}`],
    ['Effekt kattaligi d_z', `${fmt(r.effectSize, 2)} (${effectSizeLabel(r.effectSize)})`],
    ['Wilcoxon mezoni', r.wilcoxon ? `z = ${fmt(r.wilcoxon.z, 2)}, ${formatP(r.wilcoxon.p)}` : '—'],
    [
      'Farqlar normalligi (Shapiro–Wilk)',
      r.diffNormality
        ? `W = ${fmt(r.diffNormality.w, 3)}, ${formatP(r.diffNormality.p)} → ${r.recommended === 'WILCOXON' ? 'Wilcoxon' : 't-mezoni'}`
        : '—',
    ],
    [
      "Faol vaqt (o'rtacha)",
      r.meanActiveMinutes === null ? '—' : `${fmt(r.meanActiveMinutes, 0)} daq.`,
    ],
    ['Vaqt ↔ yakuniy natija (Pearson r)', fmt(r.timePostCorrelation, 2)],
  ];
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="guruh" className="text-sm font-medium">
          Guruh
        </label>
        <select
          id="guruh"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="">Hammasi</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-canvas p-4 dark:bg-slate-800">
            <dt className="text-sm text-slate-600 dark:text-slate-400">{k}</dt>
            <dd className="mt-1 font-display text-lg font-bold text-ink dark:text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Hake g = (yakuniy − kirish) / (100 − kirish): 0,3 dan past — past, 0,3–0,7 — o&apos;rta, 0,7
        dan yuqori — yuqori o&apos;sish. p &lt; 0,05 bo&apos;lsa, o&apos;zgarish statistik
        ahamiyatli.
      </p>
      <TableScroll label="Talabalar natijalari">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-3">Talaba</th>
              <th className="py-2 pr-3">Guruh</th>
              <th className="py-2 pr-3 text-right">Kirish %</th>
              <th className="py-2 pr-3 text-right">Yakuniy %</th>
              <th className="py-2 pr-3 text-right">O&apos;sish</th>
              <th className="py-2 pr-3 text-right">Hake g</th>
              <th className="py-2 text-right">Faol vaqt, daq.</th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((x) => (
              <tr key={x.userId} className="border-b border-line last:border-0">
                <td className="py-2 pr-3">{x.name}</td>
                <td className="py-2 pr-3">{x.group ?? '—'}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{x.pre ?? '—'}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{x.post ?? '—'}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{x.gain ?? '—'}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{fmt(x.normalizedGain, 2)}</td>
                <td className="py-2 text-right tabular-nums">{fmt(x.activeMinutes, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </>
  );
}
