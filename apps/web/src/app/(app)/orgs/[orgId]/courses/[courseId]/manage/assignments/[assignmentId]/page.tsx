'use client';

import {
  ASSIGNMENT_MAX_ATTEMPTS,
  updateAssignmentSchema,
  type AssignmentAdmin,
  type AssignmentSubmissionRow,
  type GradingPolicy,
  type ProjectFile,
  type RubricCriterion,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { AssignmentStatusBadge, SubmissionStatusBadge } from '@/components/assignment-ui';
import { ChecksEditor } from '@/components/checks-editor';
import { Playground } from '@/components/ide/playground';
import { BackLink, Button, ErrorText, inputClass, LoadState, TableScroll } from '@/components/ui';
import { send } from '@/lib/api';
import { parseRules } from '@/lib/check-rules';
import { formatDateTime, fromLocalInput, toLocalInput } from '@/lib/dates';
import { useApi } from '@/lib/use-api';
import { Icon } from '@/components/icons';
import { confirmDialog } from '@/components/dialog';

export default function ManageAssignmentPage() {
  const { orgId, courseId, assignmentId } = useParams<{
    orgId: string;
    courseId: string;
    assignmentId: string;
  }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state, reload } = useApi<AssignmentAdmin>(`${base}/assignments/${assignmentId}/edit`);

  return (
    <LoadState state={state}>
      {(a) => (
        <div className="card space-y-12 p-6 sm:p-10">
          <BackLink href={`${base}/manage/lessons/${a.lessonId}`}>Darsga qaytish</BackLink>
          <StatusBar assignment={a} base={base} onChange={reload} />
          <AssignmentForm key={`${a.id}-${a.submittedCount}`} initial={a} base={base} />
          <Submissions base={base} assignmentId={a.id} />
        </div>
      )}
    </LoadState>
  );
}

function StatusBar({
  assignment: a,
  base,
  onChange,
}: {
  assignment: AssignmentAdmin;
  base: string;
  onChange: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function go(action: 'publish' | 'close', question: string) {
    if (!(await confirmDialog(question))) return;
    setError(null);
    setPending(true);
    const res = await send('POST', `${base}/assignments/${a.id}/${action}`);
    setPending(false);
    if (!res.ok) return setError(res.message);
    onChange();
  }

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{a.title}</h1>
          <AssignmentStatusBadge status={a.status} />
        </div>
        <div className="flex gap-2">
          {a.status === 'DRAFT' && (
            <Button
              disabled={pending}
              onClick={() =>
                go(
                  'publish',
                  'Topshiriq talabalarga ko‘rinadi va javob qabul qila boshlaydi. E’lon qilinsinmi?',
                )
              }
            >
              E&apos;lon qilish
            </Button>
          )}
          {a.status === 'PUBLISHED' && (
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() =>
                go(
                  'close',
                  'Yopilgandan keyin yangi javob qabul qilinmaydi va qayta ochib bo‘lmaydi. Yopilsinmi?',
                )
              }
            >
              Topshiriqni yopish
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Holat faqat oldinga o&apos;zgaradi: qoralama → e&apos;lon qilingan → yopilgan.
        {a.publishedAt && ` E’lon qilingan: ${formatDateTime(a.publishedAt)}.`}
        {a.closedAt && ` Yopilgan: ${formatDateTime(a.closedAt)}.`}
      </p>
      {error && <ErrorText>{error}</ErrorText>}
    </header>
  );
}

const newCriterionId = () => `c-${Math.random().toString(36).slice(2, 10)}`;

function AssignmentForm({ initial, base }: { initial: AssignmentAdmin; base: string }) {
  const id = useId();
  const locked = initial.submittedCount > 0;
  const [form, setForm] = useState({
    title: initial.title,
    instructions: initial.instructions,
    requirements: initial.requirements.join('\n'),
    deadline: toLocalInput(initial.deadline),
    maxAttempts: initial.maxAttempts,
  });
  const [policy, setPolicy] = useState<GradingPolicy>(initial.gradingPolicy);
  const [rubric, setRubric] = useState<RubricCriterion[]>(initial.rubric);
  const [starterFiles, setStarterFiles] = useState<ProjectFile[]>(initial.starterFiles);
  const [checksText, setChecksText] = useState(
    initial.checks.length ? JSON.stringify(initial.checks, null, 2) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const touch = () => setSaved(false);
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    touch();
  };
  const rubricTotal = rubric.reduce(
    (n, r) => n + (Number.isFinite(r.maxPoints) ? r.maxPoints : 0),
    0,
  );
  const rubricMismatch = rubric.length > 0 && rubricTotal !== policy.maxScore;

  function setCriterion(i: number, patch: Partial<RubricCriterion>) {
    setRubric((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
    touch();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const rules = parseRules(checksText);
    if (!rules.ok) return setError('CHECK qoidalaridagi xatolarni tuzating');
    if (!locked && rubricMismatch) {
      return setError('Rubrika ballari yig‘indisi maksimal ballga teng bo‘lishi kerak');
    }
    const parsed = updateAssignmentSchema.safeParse({
      title: form.title,
      instructions: form.instructions,
      requirements: form.requirements
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
      deadline: fromLocalInput(form.deadline),
      maxAttempts: Number(form.maxAttempts),
      starterFiles,
      checks: rules.rules,
      // Grading terms are frozen once work has been submitted; do not send them.
      ...(locked ? {} : { rubric, gradingPolicy: policy }),
    });
    if (!parsed.success) {
      return setError('Maydonlarni tekshiring (nom, talablar, urinishlar, rubrika va fayllar)');
    }
    setPending(true);
    const res = await send('PATCH', `${base}/assignments/${initial.id}`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor={`${id}-title`} className="text-sm font-medium">
          Nomi
        </label>
        <input
          id={`${id}-title`}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-instr`} className="text-sm font-medium">
          Ko&apos;rsatma (Markdown)
        </label>
        <textarea
          id={`${id}-instr`}
          value={form.instructions}
          onChange={(e) => set('instructions', e.target.value)}
          rows={8}
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-req`} className="text-sm font-medium">
          Talablar (har qatorda bittasi, talabaga ro&apos;yxat bo&apos;lib ko&apos;rinadi)
        </label>
        <textarea
          id={`${id}-req`}
          value={form.requirements}
          onChange={(e) => set('requirements', e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor={`${id}-deadline`} className="text-sm font-medium">
            Muddat (bo&apos;sh — muddatsiz)
          </label>
          <input
            id={`${id}-deadline`}
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-attempts`} className="text-sm font-medium">
            Urinishlar soni (1–{ASSIGNMENT_MAX_ATTEMPTS})
          </label>
          <input
            id={`${id}-attempts`}
            type="number"
            min={1}
            max={ASSIGNMENT_MAX_ATTEMPTS}
            value={form.maxAttempts}
            onChange={(e) => set('maxAttempts', Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="space-y-4" disabled={locked}>
        <legend className="text-lg font-semibold">Baholash</legend>
        {locked && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Talabalar javob topshirgan, shuning uchun rubrika va baholash siyosati qulflangan.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
          <div className="space-y-1">
            <label htmlFor={`${id}-max`} className="text-sm font-medium">
              Maksimal ball
            </label>
            <input
              id={`${id}-max`}
              type="number"
              min={1}
              value={policy.maxScore}
              onChange={(e) => {
                setPolicy((p) => ({ ...p, maxScore: Number(e.target.value) }));
                touch();
              }}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor={`${id}-pass`} className="text-sm font-medium">
              O&apos;tish bali
            </label>
            <input
              id={`${id}-pass`}
              type="number"
              min={0}
              value={policy.passingScore}
              onChange={(e) => {
                setPolicy((p) => ({ ...p, passingScore: Number(e.target.value) }));
                touch();
              }}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 py-2 text-sm">
            <input
              type="checkbox"
              checked={policy.allowLate}
              onChange={(e) => {
                setPolicy((p) => ({ ...p, allowLate: e.target.checked }));
                touch();
              }}
            />
            Muddatdan keyin ham qabul qilish (kechikkan deb belgilanadi)
          </label>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold">Rubrika</h3>
          {rubric.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Rubrika yo&apos;q: ish umumiy ball bilan baholanadi.
            </p>
          ) : (
            <ul className="space-y-3">
              {rubric.map((r, i) => (
                <li
                  key={r.id}
                  className="grid gap-2 sm:grid-cols-[1fr_2fr_7rem_auto] sm:items-start"
                >
                  <input
                    aria-label={`${i + 1}-mezon nomi`}
                    value={r.title}
                    onChange={(e) => setCriterion(i, { title: e.target.value })}
                    placeholder="Mezon nomi"
                    className={inputClass}
                  />
                  <input
                    aria-label={`${i + 1}-mezon tavsifi`}
                    value={r.description}
                    onChange={(e) => setCriterion(i, { description: e.target.value })}
                    placeholder="Nimaga qaraladi (ixtiyoriy)"
                    className={inputClass}
                  />
                  <input
                    aria-label={`${i + 1}-mezon bali`}
                    type="number"
                    min={1}
                    value={r.maxPoints}
                    onChange={(e) => setCriterion(i, { maxPoints: Number(e.target.value) })}
                    className={inputClass}
                  />
                  <Button
                    variant="secondary"
                    aria-label={`${i + 1}-mezonni o'chirish`}
                    onClick={() => {
                      setRubric((rows) => rows.filter((_, j) => j !== i));
                      touch();
                    }}
                  >
                    O&apos;chirish
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setRubric((rows) => [
                  ...rows,
                  { id: newCriterionId(), title: '', description: '', maxPoints: 10 },
                ]);
                touch();
              }}
            >
              <Icon name="plus" className="size-4" />
              Mezon
            </Button>
            {rubric.length > 0 && (
              <span
                className={`text-sm ${rubricMismatch ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Jami: {rubricTotal} / {policy.maxScore} ball
                {rubricMismatch && ' — yig‘indi maksimal ballga teng bo‘lishi kerak'}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-lg font-semibold">Boshlang&apos;ich loyiha</legend>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Talaba topshiriqni shu fayllardan boshlaydi. O&apos;zgarish faqat hali boshlamagan
          talabalarga ta&apos;sir qiladi.
        </p>
        <Playground
          files={starterFiles}
          onChange={(f) => {
            setStarterFiles(f);
            touch();
          }}
        />
      </fieldset>

      <ChecksEditor
        purpose="assignment"
        previewUrl={`${base}/assignments/${initial.id}/checks/preview`}
        text={checksText}
        onChange={(t) => {
          setChecksText(t);
          touch();
        }}
        starterFiles={starterFiles}
      />

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

function Submissions({ base, assignmentId }: { base: string; assignmentId: string }) {
  const { state } = useApi<AssignmentSubmissionRow[]>(
    `${base}/assignments/${assignmentId}/submissions`,
  );
  return (
    <section aria-labelledby="subs" className="space-y-3">
      <h2 id="subs" className="text-xl font-semibold">
        Talabalar javoblari
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        &quot;Ko&apos;rib chiqish&quot; orqali kodni, CHECK natijasini ko&apos;rasiz, rubrika
        bo&apos;yicha baholaysiz yoki qayta ishlashni so&apos;raysiz.
      </p>
      <LoadState state={state}>
        {(rows) =>
          rows.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Kursga hali talaba yozilmagan.</p>
          ) : (
            <TableScroll label="Talabalar javoblari jadvali">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                    <th scope="col" className="py-2 pr-4">
                      Talaba
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      Holat
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      Versiyalar
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      Oxirgi topshirish
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      Ball
                    </th>
                    <th scope="col" className="py-2">
                      <span className="sr-only">Amallar</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.userId} className="border-b border-slate-100 dark:border-slate-900">
                      <td className="py-2 pr-4">{r.fullName}</td>
                      <td className="py-2 pr-4">
                        <SubmissionStatusBadge status={r.status} />
                      </td>
                      <td className="py-2 pr-4">{r.versions}</td>
                      <td className="py-2 pr-4">
                        {r.lastSubmittedAt ? formatDateTime(r.lastSubmittedAt) : '—'}
                        {r.lastIsLate && (
                          <span className="ml-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                            kechikkan
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4">{r.score ?? '—'}</td>
                      <td className="py-2 text-right">
                        {r.versions > 0 && (
                          <Link
                            href={`${base}/manage/assignments/${assignmentId}/submissions/${r.userId}`}
                            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
                            aria-label={`${r.fullName}: javobni ko'rib chiqish`}
                          >
                            Ko&apos;rib chiqish
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          )
        }
      </LoadState>
    </section>
  );
}
