'use client';

import {
  assessmentKindFromSlug,
  isAnswered,
  QUIZ_KIND_LABEL,
  type AssessmentStudentView,
  type QuizAnswer,
  type QuizViewQuestion,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { confirmDialog } from '@/components/dialog';
import { Icon } from '@/components/icons';
import { QuestionText } from '@/components/markdown';
import { KIND_HINT, QuestionInput, type AnswerPatch } from '@/components/quiz-questions';
import { BackLink, Button, ErrorText, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function AssessmentPage() {
  const {
    orgId,
    courseId,
    kind: slug,
  } = useParams<{
    orgId: string;
    courseId: string;
    kind: string;
  }>();
  const courseBase = `/orgs/${orgId}/courses/${courseId}`;
  const kind = assessmentKindFromSlug(slug);
  const path = kind ? `${courseBase}/assessments/${slug}` : null;
  const { state, setState } = useApi<AssessmentStudentView>(path);
  if (!kind) return <ErrorText>Sahifa topilmadi</ErrorText>;
  return (
    <article className="card mx-auto max-w-4xl space-y-6 p-6 sm:p-10">
      <BackLink href={courseBase}>Kurs xaritasiga qaytish</BackLink>
      <LoadState state={state}>
        {(view) => (
          <Assessment
            view={view}
            path={path!}
            onChange={(v) => setState({ kind: 'ready', data: v })}
          />
        )}
      </LoadState>
    </article>
  );
}

function Assessment({
  view,
  path,
  onChange,
}: {
  view: AssessmentStudentView;
  path: string;
  onChange: (v: AssessmentStudentView) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function start() {
    const ok = await confirmDialog({
      title: 'Testni boshlash',
      message: view.timeLimitMinutes
        ? `Test bir marta topshiriladi. Boshlaganingizdan keyin ${view.timeLimitMinutes} daqiqa vaqtingiz bo'ladi; vaqt tugaganda javoblar avtomatik yuboriladi.`
        : 'Test bir marta topshiriladi. Boshlaysizmi?',
      confirmLabel: 'Boshlash',
    });
    if (!ok) return;
    setPending(true);
    const res = await send<AssessmentStudentView>('POST', `${path}/start`);
    setPending(false);
    if (!res.ok) return setError(res.message);
    onChange(res.data);
  }

  return (
    <>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{view.title}</h1>
        {view.description && <p className="whitespace-pre-wrap">{view.description}</p>}
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {view.questionCount} ta savol ·{' '}
          {view.timeLimitMinutes ? `${view.timeLimitMinutes} daqiqa` : 'vaqt cheklanmagan'} · bitta
          urinish
        </p>
      </header>
      {error && <ErrorText>{error}</ErrorText>}
      {view.status === 'NOT_STARTED' && (
        <div className="space-y-4 rounded-xl bg-canvas p-5 dark:bg-slate-800">
          <p>
            Bu test o&apos;qishdagi o&apos;sishingizni o&apos;lchash uchun. Har savolga
            o&apos;zingiz bilganingizcha javob bering — natija baho emas va boshqa talabalarga
            ko&apos;rsatilmaydi.
          </p>
          <Button onClick={start} disabled={pending}>
            <Icon name="play" className="size-4" />
            {pending ? 'Boshlanmoqda…' : 'Testni boshlash'}
          </Button>
        </div>
      )}
      {view.status === 'IN_PROGRESS' && view.questions && (
        <Attempt view={view} questions={view.questions} path={path} onDone={onChange} />
      )}
      {view.status === 'SUBMITTED' && view.result && (
        <section
          role="status"
          className="space-y-2 rounded-xl bg-emerald-50 px-5 py-4 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
        >
          <p className="text-lg font-semibold">
            Natija: {view.result.score}% ({view.result.correct} / {view.result.total})
          </p>
          <p className="text-sm">
            Test topshirildi. Javoblaringiz uchun rahmat!
            {view.result.late && ' Javoblar belgilangan vaqtdan keyin yuborilgan.'}
          </p>
        </section>
      )}
    </>
  );
}

function storageKey(path: string) {
  return `wd-assessment:${path}`;
}

function loadSaved(path: string): Record<string, QuizAnswer> {
  try {
    const raw = sessionStorage.getItem(storageKey(path));
    return raw ? (JSON.parse(raw) as Record<string, QuizAnswer>) : {};
  } catch {
    return {};
  }
}

function Attempt({
  view,
  questions,
  path,
  onDone,
}: {
  view: AssessmentStudentView;
  questions: QuizViewQuestion[];
  path: string;
  onDone: (v: AssessmentStudentView) => void;
}) {
  // Answers survive a reload of the page during the attempt (this browser tab only).
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>(() => loadSaved(path));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const sent = useRef(false);
  const answered = questions.filter((q) => isAnswered(q, answers[q.id])).length;

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey(path), JSON.stringify(answers));
    } catch {
      // Storage unavailable: answers stay in memory only.
    }
  }, [answers, path]);

  const submit = useCallback(async () => {
    if (sent.current) return;
    sent.current = true;
    setPending(true);
    setError(null);
    const payload = questions.map((q) => {
      const a = answers[q.id] ?? { questionId: q.id, optionIds: [] };
      return q.kind === 'ORDERING' && (a.order?.length ?? 0) !== q.items.length
        ? { ...a, order: q.items.map((x) => x.id) }
        : a;
    });
    const res = await send<AssessmentStudentView>('POST', `${path}/submit`, { answers: payload });
    setPending(false);
    if (!res.ok) {
      sent.current = false;
      return setError(res.message);
    }
    try {
      sessionStorage.removeItem(storageKey(path));
    } catch {
      // ignore
    }
    onDone(res.data);
  }, [answers, onDone, path, questions]);

  // Countdown; at zero the answers are sent automatically.
  useEffect(() => {
    if (!view.deadline) return;
    const end = new Date(view.deadline).getTime();
    const tick = () => {
      const s = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) void submit();
    };
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [view.deadline, submit]);

  function update(questionId: string, patch: AnswerPatch) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { optionIds: [], ...prev[questionId], ...patch, questionId },
    }));
  }

  async function onSubmit() {
    const ok = await confirmDialog({
      title: 'Javoblarni yuborish',
      message:
        answered < questions.length
          ? `${questions.length - answered} ta savolga javob berilmagan. Yuborganingizdan keyin o'zgartirib bo'lmaydi.`
          : "Yuborganingizdan keyin javoblarni o'zgartirib bo'lmaydi.",
      confirmLabel: 'Yuborish',
    });
    if (ok) await submit();
  }

  const mm =
    left === null ? null : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return (
    <div className="space-y-6">
      {mm && (
        <p
          className={`sticky top-0 z-10 flex items-center gap-2 rounded-lg px-4 py-2 font-semibold ${
            left! <= 60
              ? 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
              : 'bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200'
          }`}
        >
          <Icon name="clock" className="size-5" />
          Qolgan vaqt: <span className="tabular-nums">{mm}</span>
        </p>
      )}
      <ol className="space-y-6">
        {questions.map((q, i) => (
          <li key={q.id}>
            <fieldset
              aria-describedby={`savol-${q.id}`}
              className="space-y-3 rounded-xl border border-line bg-panel p-5"
            >
              <legend className="flex flex-wrap items-center gap-2 px-1 font-semibold">
                {i + 1}-savol
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {QUIZ_KIND_LABEL[q.kind]}
                </span>
              </legend>
              <div id={`savol-${q.id}`}>
                <QuestionText>{q.prompt}</QuestionText>
              </div>
              {KIND_HINT[q.kind] && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{KIND_HINT[q.kind]}</p>
              )}
              <QuestionInput q={q} answer={answers[q.id]} onChange={(p) => update(q.id, p)} />
            </fieldset>
          </li>
        ))}
      </ol>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onSubmit} disabled={pending}>
          {pending ? 'Yuborilmoqda…' : 'Javoblarni yuborish'}
        </Button>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {answered} / {questions.length} savolga javob berildi
        </span>
      </div>
    </div>
  );
}
