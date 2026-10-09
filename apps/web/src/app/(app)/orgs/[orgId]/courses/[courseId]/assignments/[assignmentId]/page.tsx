'use client';

import type { AssignmentView, ProjectFile, SubmissionVersionView } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AssignmentStatusBadge,
  BLOCKER_TEXT,
  SubmissionStatusBadge,
} from '@/components/assignment-ui';
import { CheckResultPanel } from '@/components/check-result';
import { Playground } from '@/components/ide/playground';
import { Markdown } from '@/components/markdown';
import { Button, ErrorText, LoadState } from '@/components/ui';
import { api, send } from '@/lib/api';
import { formatDateTime } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

export default function AssignmentPage() {
  const router = useRouter();
  const { orgId, courseId, assignmentId } = useParams<{
    orgId: string;
    courseId: string;
    assignmentId: string;
  }>();
  const courseBase = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<AssignmentView>(`${courseBase}/assignments/${assignmentId}`);

  if (state.kind === 'error' && state.code === 'LESSON_LOCKED') {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Topshiriq hali yopiq</h1>
        <p className="text-slate-600 dark:text-slate-400">{state.message}</p>
        <Button variant="secondary" onClick={() => router.push(courseBase)}>
          Kurs xaritasiga qaytish
        </Button>
      </section>
    );
  }

  return (
    <LoadState state={state}>
      {(a) => <Workspace key={a.id} initial={a} courseBase={courseBase} />}
    </LoadState>
  );
}

function Workspace({ initial, courseBase }: { initial: AssignmentView; courseBase: string }) {
  const [a, setA] = useState(initial);
  const [files, setFiles] = useState<ProjectFile[]>(initial.submission.files);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const url = `${courseBase}/assignments/${a.id}`;
  const sub = a.submission;
  // The draft is editable whenever a new version could be submitted later.
  const editable = sub.blockedBy !== 'ASSIGNMENT_CLOSED' && sub.blockedBy !== 'SUBMISSION_LOCKED';
  const deadlinePassed = a.deadline !== null && new Date(a.deadline) < new Date();
  const left = a.maxAttempts - sub.attemptsUsed;

  function apply(view: AssignmentView, message: string) {
    setA(view);
    setFiles(view.submission.files);
    setDirty(false);
    setNotice(message);
  }

  async function save(): Promise<boolean> {
    setError(null);
    setNotice(null);
    setPending(true);
    const res = await send<AssignmentView>('PUT', `${url}/draft`, { files });
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return false;
    }
    apply(res.data, 'Qoralama saqlandi');
    return true;
  }

  async function submit() {
    const question =
      `Bu ${sub.attemptsUsed + 1}-urinish (${a.maxAttempts} tadan). ` +
      'Topshirilgan versiyani keyin o‘zgartirib bo‘lmaydi.' +
      (sub.wouldBeLate ? ' Muddat o‘tgan: javob kechikkan deb belgilanadi.' : '') +
      ' Topshirasizmi?';
    if (!window.confirm(question)) return;
    if (dirty && !(await save())) return;
    setPending(true);
    const res = await send<AssignmentView>('POST', `${url}/submit`);
    setPending(false);
    if (!res.ok) return setError(res.message);
    apply(res.data, `${res.data.submission.attemptsUsed}-versiya topshirildi`);
  }

  // CHECK of a submitted version finishes asynchronously; poll until every result is final.
  const checking = a.versions.some(
    (v) => v.check && (v.check.status === 'QUEUED' || v.check.status === 'RUNNING'),
  );
  useEffect(() => {
    if (!checking) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const res = await api<AssignmentView>(url);
      if (!cancelled && res.ok) setA((prev) => ({ ...prev, versions: res.data.versions }));
    }, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [checking, a.versions, url]);

  return (
    <article className="space-y-6">
      <div className="card space-y-6 p-6 sm:p-10">
        <nav className="text-sm">
          <Link
            href={`${courseBase}/lessons/${a.lessonId}`}
            className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
          >
            ← Darsga qaytish
          </Link>
        </nav>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{a.title}</h1>
            {a.status === 'CLOSED' && <AssignmentStatusBadge status="CLOSED" />}
          </div>
          <SubmissionStatusBadge status={sub.status} />
        </header>

        <dl className="grid gap-4 rounded-xl bg-surface p-5 text-sm sm:grid-cols-3 dark:bg-slate-800/50">
          <div>
            <dt className="text-slate-500">Muddat</dt>
            <dd className="font-semibold">
              {a.deadline ? formatDateTime(a.deadline) : 'Muddatsiz'}
              {deadlinePassed && (
                <span className="ml-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  o&apos;tgan
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Urinishlar</dt>
            <dd className="font-semibold">
              {sub.attemptsUsed} / {a.maxAttempts} ishlatildi
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Baholash</dt>
            <dd className="font-semibold">
              {a.gradingPolicy.maxScore} ball, o&apos;tish: {a.gradingPolicy.passingScore}
            </dd>
          </div>
        </dl>

        {a.instructions && (
          <section aria-labelledby="instr" className="space-y-2">
            <h2 id="instr" className="text-lg font-semibold">
              Ko&apos;rsatma
            </h2>
            <Markdown>{a.instructions}</Markdown>
          </section>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {a.requirements.length > 0 && (
            <section aria-labelledby="req" className="space-y-2">
              <h2 id="req" className="text-lg font-semibold">
                Talablar
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                {a.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
          )}
          {a.rubric.length > 0 && (
            <section aria-labelledby="rubric" className="space-y-2">
              <h2 id="rubric" className="text-lg font-semibold">
                Baholash mezonlari
              </h2>
              <table className="w-full text-sm">
                <tbody>
                  {a.rubric.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 pr-3">
                        <span className="font-medium">{r.title}</span>
                        {r.description && (
                          <span className="block text-slate-500">{r.description}</span>
                        )}
                      </td>
                      <td className="py-2 text-right font-semibold whitespace-nowrap">
                        {r.maxPoints} ball
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>

      {a.review && <ReviewPanel view={a} />}

      <section aria-label="Javob muharriri" className="space-y-3">
        <Playground
          files={files}
          readOnly={!editable}
          onChange={(f) => {
            setFiles(f);
            setDirty(true);
            setNotice(null);
          }}
          toolbar={
            editable && (
              <>
                <button
                  type="button"
                  onClick={() => void save()}
                  disabled={pending || !dirty}
                  className="btn border border-white/20 py-2 text-slate-200 hover:bg-white/10"
                >
                  {dirty ? 'Qoralamani saqlash' : 'Saqlangan'}
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={pending || sub.blockedBy !== null}
                  className="btn btn-accent py-2"
                >
                  {pending ? 'Yuborilmoqda…' : 'Topshirish'}
                </button>
              </>
            )
          }
        />
        {error && <ErrorText>{error}</ErrorText>}
        {notice && (
          <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
            {notice}
          </p>
        )}
        {sub.blockedBy ? (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {BLOCKER_TEXT[sub.blockedBy]}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Qoralama faqat sizga ko&apos;rinadi. &quot;Topshirish&quot; uning nusxasini
            o&apos;qituvchiga yuboradi (qolgan urinishlar: {left}).
            {sub.wouldBeLate && ' Muddat o‘tgan: javob kechikkan deb belgilanadi.'}
            {a.checkAvailable &&
              ' Topshirilgan har bir versiya serverda avtomatik tekshiriladi; bu baho emas.'}
          </p>
        )}
      </section>

      <Versions view={a} url={url} />
    </article>
  );
}

function Versions({ view, url }: { view: AssignmentView; url: string }) {
  const [open, setOpen] = useState<SubmissionVersionView | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function show(version: number) {
    setError(null);
    const res = await api<SubmissionVersionView>(`${url}/versions/${version}`);
    if (!res.ok) return setError(res.message);
    setOpen(res.data);
  }

  if (view.versions.length === 0) return null;
  return (
    <section aria-labelledby="versions" className="card space-y-4 p-6 sm:p-8">
      <h2 id="versions" className="text-xl font-semibold">
        Topshirilgan versiyalar
      </h2>
      <p className="text-sm text-slate-500">Har bir versiya o&apos;zgarmas holda saqlanadi.</p>
      <ol className="space-y-4">
        {view.versions.map((v) => (
          <li
            key={v.version}
            className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <span className="font-semibold">{v.version}-versiya</span>{' '}
                <span className="text-sm text-slate-500">{formatDateTime(v.submittedAt)}</span>
                {v.isLate && (
                  <span className="ml-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    kechikkan
                  </span>
                )}
              </span>
              <Button variant="secondary" onClick={() => show(v.version)}>
                Kodni ko&apos;rish
              </Button>
            </div>
            {v.check && <CheckResultPanel run={v.check} />}
          </li>
        ))}
      </ol>
      {error && <ErrorText>{error}</ErrorText>}
      {open && (
        <div className="space-y-2">
          <h3 className="font-semibold">{open.version}-versiya kodi (faqat o&apos;qish uchun)</h3>
          <Playground
            key={open.version}
            namespace={`version-${open.version}/`}
            files={open.files}
            readOnly
            onChange={() => {}}
          />
        </div>
      )}
    </section>
  );
}

/** Latest teacher feedback and grade. GRADED may still change; FINALIZED is final. */
function ReviewPanel({ view }: { view: AssignmentView }) {
  const r = view.review!;
  const g = r.grade;
  const titles = new Map(view.rubric.map((c) => [c.id, c]));
  // After a resubmit the revision request is history, not a pending task.
  const pending = !g && view.submission.status === 'REVISION_REQUESTED';
  return (
    <section
      aria-labelledby="review-h"
      className={`card space-y-4 p-6 sm:p-8 ${
        pending ? 'border border-amber-300 dark:border-amber-800' : ''
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="review-h" className="text-xl font-semibold">
          {g
            ? g.final
              ? 'Yakuniy baho'
              : 'Baho'
            : pending
              ? 'O‘qituvchi qayta ishlashni so‘radi'
              : 'O‘qituvchining oldingi izohi'}
        </h2>
        <span className="text-sm text-slate-500">
          {r.version}-versiya · {formatDateTime(r.createdAt)}
        </span>
      </header>
      {g && (
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold">
            {g.score}
            <span className="text-lg font-normal text-slate-500"> / {g.maxScore}</span>
          </span>
          <span
            className={`text-sm font-semibold ${
              g.passed
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {g.passed ? '✓ O‘tdi' : `! O‘tish bali: ${view.gradingPolicy.passingScore}`}
          </span>
          {!g.final && (
            <span className="text-xs text-slate-500">
              Baho hali yakunlanmagan va o‘zgarishi mumkin.
            </span>
          )}
        </div>
      )}
      {g?.scores && (
        <table className="w-full text-sm">
          <tbody>
            {g.scores.map((s) => (
              <tr key={s.criterionId} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 pr-3">{titles.get(s.criterionId)?.title ?? s.criterionId}</td>
                <td className="py-2 text-right font-semibold whitespace-nowrap">
                  {s.points} / {titles.get(s.criterionId)?.maxPoints ?? '?'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {r.feedback && (
        <blockquote className="rounded-xl bg-surface px-4 py-3 whitespace-pre-wrap dark:bg-slate-800/50">
          {r.feedback}
        </blockquote>
      )}
      {pending && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Izohni hisobga olib kodni tuzating va yangi versiyani topshiring.
        </p>
      )}
    </section>
  );
}
