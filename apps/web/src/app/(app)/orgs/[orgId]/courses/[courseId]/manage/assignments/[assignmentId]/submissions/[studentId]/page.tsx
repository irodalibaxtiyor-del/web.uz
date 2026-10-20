'use client';

import {
  scoreTotal,
  type ReviewAction,
  type StaffVersionView,
  type SubmissionReviewView,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { SubmissionStatusBadge } from '@/components/assignment-ui';
import { CHECK_ERROR_TEXT, CHECK_STATUS } from '@/components/check-result';
import { Playground } from '@/components/ide/playground';
import { BackLink, Button, ErrorText, inputClass, LoadState } from '@/components/ui';
import { api, send } from '@/lib/api';
import { formatDateTime } from '@/lib/dates';
import { useApi } from '@/lib/use-api';
import { Icon } from '@/components/icons';

const ACTION_LABEL: Record<ReviewAction, string> = {
  REVISION_REQUESTED: 'Qayta ishlash so‘raldi',
  GRADED: 'Baholandi',
  FINALIZED: 'Yakunlandi',
};

export default function ReviewPage() {
  const { orgId, courseId, assignmentId, studentId } = useParams<{
    orgId: string;
    courseId: string;
    assignmentId: string;
    studentId: string;
  }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const url = `${base}/assignments/${assignmentId}/submissions/${studentId}`;
  const { state, setState } = useApi<SubmissionReviewView>(url);

  return (
    <LoadState state={state}>
      {(view) => (
        <div className="space-y-6">
          <div className="card space-y-4 p-6 sm:p-10">
            <BackLink href={`${base}/manage/assignments/${assignmentId}`}>
              {view.assignment.title}
            </BackLink>
            <header className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold">{view.student.fullName}: javob</h1>
              <div className="flex items-center gap-4">
                {view.score !== null && (
                  <span className="font-semibold">
                    {view.score} / {view.assignment.gradingPolicy.maxScore} ball
                  </span>
                )}
                <SubmissionStatusBadge status={view.status} />
              </div>
            </header>
          </div>
          {view.versions.length === 0 ? (
            <p className="card p-6 text-slate-500 dark:text-slate-400">
              Talaba hali javob topshirmagan.
            </p>
          ) : (
            <>
              <VersionViewer view={view} url={url} />
              <ReviewActions
                key={`${view.status}-${view.versions[0]!.version}-${view.reviews.length}`}
                view={view}
                url={url}
                onDone={(next) => setState({ kind: 'ready', data: next })}
              />
            </>
          )}
          <History view={view} />
        </div>
      )}
    </LoadState>
  );
}

function VersionViewer({ view, url }: { view: SubmissionReviewView; url: string }) {
  const [selected, setSelected] = useState(view.versions[0]!.version);
  const [code, setCode] = useState<StaffVersionView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const v = view.versions.find((x) => x.version === selected)!;

  useEffect(() => {
    let cancelled = false;
    void api<StaffVersionView>(`${url}/versions/${selected}`).then((res) => {
      if (cancelled) return;
      if (res.ok) setCode(res.data);
      else setError(res.message);
    });
    return () => {
      cancelled = true;
    };
  }, [url, selected]);

  return (
    <section aria-labelledby="code-h" className="card space-y-4 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="code-h" className="text-xl font-semibold">
          Kod va natija
        </h2>
        <label className="flex items-center gap-2 text-sm">
          Versiya
          <select
            value={selected}
            onChange={(e) => {
              setCode(null);
              setSelected(Number(e.target.value));
            }}
            className={`${inputClass} w-auto`}
          >
            {view.versions.map((x) => (
              <option key={x.version} value={x.version}>
                {x.version}-versiya · {formatDateTime(x.submittedAt)}
                {x.isLate ? ' · kechikkan' : ''}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {code && code.version === selected ? (
        <Playground
          key={selected}
          namespace={`review-${selected}/`}
          files={code.files}
          readOnly
          onChange={() => {}}
        />
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Kod yuklanmoqda…</p>
      )}
      {v.check && (
        <div className="space-y-2 rounded-xl bg-surface p-4 dark:bg-slate-800/50">
          <p className={`font-semibold ${CHECK_STATUS[v.check.status].tone}`}>
            <Icon
              name={CHECK_STATUS[v.check.status].icon}
              className="inline size-4 align-[-0.2em]"
            />{' '}
            CHECK: {CHECK_STATUS[v.check.status].label}
          </p>
          {v.check.errorCode && <p className="text-sm">{CHECK_ERROR_TEXT[v.check.errorCode]}</p>}
          <ul className="space-y-1 text-sm">
            {v.check.checks.map((c) => (
              <li key={c.id}>
                <Icon
                  name={c.passed ? 'checkCircle' : 'circleX'}
                  className={`inline size-4 align-[-0.2em] ${c.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}
                />{' '}
                <span className="sr-only">{c.passed ? 'Bajarildi: ' : 'Bajarilmadi: '}</span>
                {c.title}
                {c.hidden && (
                  <span className="text-xs text-slate-500 dark:text-slate-400"> (yashirin)</span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            CHECK baho emas: u qaror qabul qilishingizga yordam beradi.
          </p>
        </div>
      )}
    </section>
  );
}

function ReviewActions({
  view,
  url,
  onDone,
}: {
  view: SubmissionReviewView;
  url: string;
  onDone: (next: SubmissionReviewView) => void;
}) {
  const id = useId();
  const { rubric, gradingPolicy } = view.assignment;
  const latest = view.versions[0]!.version;
  const lastGrade = [...view.reviews].reverse().find((r) => r.action === 'GRADED');
  const [points, setPoints] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      rubric.map((r) => [
        r.id,
        lastGrade?.scores?.find((s) => s.criterionId === r.id)?.points ?? 0,
      ]),
    ),
  );
  const [score, setScore] = useState(lastGrade?.score ?? 0);
  const [feedback, setFeedback] = useState(lastGrade?.feedback ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const input =
    rubric.length > 0
      ? { scores: rubric.map((r) => ({ criterionId: r.id, points: points[r.id] ?? 0 })) }
      : { score };
  const total = scoreTotal(rubric, gradingPolicy, input);

  async function act(action: string, body: object, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null);
    setPending(true);
    const res = await send<SubmissionReviewView>('POST', `${url}/${action}`, {
      version: latest,
      // The history this page shows: if another teacher acted meanwhile, the server refuses.
      basedOn: view.reviews.length,
      ...body,
    });
    setPending(false);
    if (!res.ok) {
      // STALE_VERSION and REVIEW_CHANGED already tell the teacher to reload.
      return setError(res.message);
    }
    onDone(res.data);
  }

  if (view.status === 'DRAFT') return null;
  if (view.status === 'SUBMITTED') {
    return (
      <section className="card space-y-3 p-6 sm:p-8">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ko&apos;rib chiqish boshlangach, talaba javobini almashtira olmaydi.
        </p>
        <Button disabled={pending} onClick={() => act('start-review', {})}>
          {latest}-versiyani ko&apos;rib chiqishni boshlash
        </Button>
        {error && <ErrorText>{error}</ErrorText>}
      </section>
    );
  }
  if (view.status === 'REVISION_REQUESTED' || view.status === 'FINALIZED') {
    return (
      <p className="card p-6 text-sm text-slate-600 dark:text-slate-400">
        {view.status === 'FINALIZED'
          ? 'Baho yakunlangan. Uni endi o‘zgartirib bo‘lmaydi.'
          : 'Talaba qayta ishlab, yangi versiya topshirishi kutilmoqda.'}
      </p>
    );
  }

  // IN_REVIEW or GRADED
  return (
    <section aria-labelledby={`${id}-h`} className="card space-y-5 p-6 sm:p-8">
      <h2 id={`${id}-h`} className="text-xl font-semibold">
        Baholash ({latest}-versiya)
      </h2>
      {rubric.length > 0 ? (
        <table className="w-full text-sm">
          <tbody>
            {rubric.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 pr-3">
                  <label htmlFor={`${id}-${r.id}`} className="font-medium">
                    {r.title}
                  </label>
                  {r.description && (
                    <span className="block text-slate-500 dark:text-slate-400">
                      {r.description}
                    </span>
                  )}
                </td>
                <td className="w-40 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      id={`${id}-${r.id}`}
                      type="number"
                      min={0}
                      max={r.maxPoints}
                      value={points[r.id] ?? 0}
                      onChange={(e) => setPoints((p) => ({ ...p, [r.id]: Number(e.target.value) }))}
                      className={inputClass}
                    />
                    <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
                      / {r.maxPoints}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center gap-2">
          <label htmlFor={`${id}-score`} className="text-sm font-medium">
            Ball
          </label>
          <input
            id={`${id}-score`}
            type="number"
            min={0}
            max={gradingPolicy.maxScore}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className={`${inputClass} w-28`}
          />
          <span className="text-slate-500 dark:text-slate-400">/ {gradingPolicy.maxScore}</span>
        </div>
      )}
      <p role="status" className="text-sm">
        {total.ok ? (
          <>
            Jami: <strong>{total.total}</strong> / {gradingPolicy.maxScore} —{' '}
            {total.total >= gradingPolicy.passingScore ? (
              <span className="text-emerald-700 dark:text-emerald-400">o&apos;tdi</span>
            ) : (
              <span className="text-amber-700 dark:text-amber-400">
                o&apos;tish balidan ({gradingPolicy.passingScore}) past
              </span>
            )}
          </>
        ) : (
          <span className="text-red-700 dark:text-red-400">
            Ballarni tekshiring: har mezon 0 dan maksimalgacha bo&apos;lsin
          </span>
        )}
      </p>
      <div className="space-y-1">
        <label htmlFor={`${id}-fb`} className="text-sm font-medium">
          Talabaga izoh (qayta ishlash so&apos;ralganda majburiy)
        </label>
        <textarea
          id={`${id}-fb`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
          className={inputClass}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={pending || !total.ok}
          onClick={() => act('grade', { ...input, feedback })}
        >
          {view.status === 'GRADED' ? 'Bahoni yangilash' : 'Baholash'}
        </Button>
        <Button
          variant="secondary"
          disabled={pending || feedback.trim() === ''}
          onClick={() =>
            act(
              'request-revision',
              { feedback },
              'Talabaga qayta ishlash so‘raladi va u yangi versiya topshira oladi. Davom etasizmi?',
            )
          }
        >
          Qayta ishlashni so&apos;rash
        </Button>
        {view.status === 'GRADED' && (
          <Button
            variant="primary"
            disabled={pending}
            onClick={() =>
              act(
                'finalize',
                {},
                `Baho ${view.score} ball bilan yakunlanadi va keyin o‘zgartirib bo‘lmaydi. Yakunlansinmi?`,
              )
            }
          >
            Yakunlash
          </Button>
        )}
      </div>
      {view.status === 'GRADED' && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Baho talabaga ko&apos;rinadi, lekin yakunlanmaguncha o&apos;zgartirish mumkin.
        </p>
      )}
    </section>
  );
}

function History({ view }: { view: SubmissionReviewView }) {
  if (view.reviews.length === 0) return null;
  return (
    <section aria-labelledby="hist" className="card space-y-3 p-6 sm:p-8">
      <h2 id="hist" className="text-xl font-semibold">
        Tarix
      </h2>
      <ol className="space-y-3">
        {[...view.reviews].reverse().map((r, i) => (
          <li
            key={i}
            className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800"
          >
            <p className="font-semibold">
              {ACTION_LABEL[r.action]} · {r.version}-versiya
              {r.score !== null && ` · ${r.score} ball`}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {formatDateTime(r.createdAt)} · {r.reviewerName ?? 'o‘chirilgan foydalanuvchi'}
            </p>
            {r.feedback && <p className="mt-2 whitespace-pre-wrap">{r.feedback}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
