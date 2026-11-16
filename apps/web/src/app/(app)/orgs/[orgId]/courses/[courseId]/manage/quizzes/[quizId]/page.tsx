'use client';

import {
  QUIZ_KIND_LABEL,
  updateQuizSchema,
  type QuizAdmin,
  type QuizFeedbackMode,
  type QuizQuestion,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { BackLink, Button, ErrorText, inputClass, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { describeIssue, QuestionListEditor } from '@/components/question-list-editor';

export default function ManageQuizPage() {
  const { orgId, courseId, quizId } = useParams<{
    orgId: string;
    courseId: string;
    quizId: string;
  }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<QuizAdmin>(`${base}/quizzes/${quizId}/edit`);
  return (
    <LoadState state={state}>
      {(q) => (
        <div className="card space-y-8 p-6 sm:p-10">
          <BackLink href={`${base}/manage/lessons/${q.lessonId}`}>Darsga qaytish</BackLink>
          <QuizForm key={q.id} initial={q} base={base} />
        </div>
      )}
    </LoadState>
  );
}

function QuizForm({ initial, base }: { initial: QuizAdmin; base: string }) {
  const id = useId();
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [passingPercent, setPassingPercent] = useState(initial.passingPercent);
  const [isActive, setIsActive] = useState(initial.isActive);
  const [feedback, setFeedback] = useState<QuizFeedbackMode>(initial.feedback);
  const [questions, setQuestions] = useState<QuizQuestion[]>(initial.questions);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const touch = () => setSaved(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (isActive && questions.length === 0) {
      return setError('Faol testda kamida bitta savol bo‘lishi kerak');
    }
    const parsed = updateQuizSchema.safeParse({
      title,
      description,
      passingPercent: Number(passingPercent),
      feedback,
      isActive,
      questions,
    });
    if (!parsed.success) return setError(describeIssue(parsed.error.issues[0]?.path ?? []));
    setPending(true);
    const res = await send('PATCH', `${base}/quizzes/${initial.id}`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
  }

  const kindsUsed = [...new Set(questions.map((q) => QUIZ_KIND_LABEL[q.kind]))];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Testni tahrirlash</h1>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {initial.passedBy} / {initial.attemptedBy} talaba o&apos;tgan
        </span>
      </header>
      <div className="grid gap-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
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
          <label htmlFor={`${id}-pass`} className="text-sm font-medium">
            O&apos;tish foizi
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
        <label className="flex min-h-11 items-center gap-2 py-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => {
              setIsActive(e.target.checked);
              touch();
            }}
          />
          Faol (darsni tugatish sharti)
        </label>
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-feedback`} className="text-sm font-medium">
          Urinishdan keyin talaba nimani ko&apos;radi
        </label>
        <select
          id={`${id}-feedback`}
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value as QuizFeedbackMode);
            touch();
          }}
          className={inputClass}
        >
          <option value="PER_QUESTION">
            Har savol: to&apos;g&apos;ri/xato va izoh (formativ fikr, tavsiya etiladi)
          </option>
          <option value="TOTAL_ONLY">Faqat umumiy natija</option>
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-desc`} className="text-sm font-medium">
          Tavsif
        </label>
        <textarea
          id={`${id}-desc`}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            touch();
          }}
          rows={2}
          className={inputClass}
        />
      </div>

      <section aria-labelledby={`${id}-qs`} className="space-y-4">
        <h2 id={`${id}-qs`} className="text-lg font-semibold">
          Savollar ({questions.length})
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          To&apos;g&apos;ri javoblar faqat serverda saqlanadi va talabaga yuborilmaydi; izohlar
          faqat urinishdan keyin ko&apos;rsatiladi. Tartiblash va moslashtirish savollarida
          variantlar har talabaga aralashtirib ko&apos;rsatiladi.
          {kindsUsed.length > 0 && ` Turlar: ${kindsUsed.join(', ')}.`}
        </p>
        <QuestionListEditor
          questions={questions}
          onChange={(next) => {
            setQuestions(next);
            touch();
          }}
        />
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
