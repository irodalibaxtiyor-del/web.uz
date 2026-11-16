'use client';

import {
  isAnswered,
  QUIZ_KIND_LABEL,
  type QuizAnswer,
  type QuizQuestionReview,
  type QuizView,
} from '@webdizayn/shared';
import { Icon } from '@/components/icons';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { QuestionText } from '@/components/markdown';
import { KIND_HINT, QuestionInput, type AnswerPatch } from '@/components/quiz-questions';
import { QuizStatusBadge } from '@/components/quiz-ui';
import { BackLink, Button, ErrorText, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useActivity } from '@/lib/use-activity';
import { useApi } from '@/lib/use-api';
import { confirmDialog } from '@/components/dialog';

export default function QuizPage() {
  const router = useRouter();
  const { orgId, courseId, quizId } = useParams<{
    orgId: string;
    courseId: string;
    quizId: string;
  }>();
  const courseBase = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<QuizView>(`${courseBase}/quizzes/${quizId}`);
  // Time on task (research analytics); only once the page actually opened.
  useActivity(courseBase, 'QUIZ', state.kind === 'ready' ? quizId : null);

  if (state.kind === 'error' && state.code === 'LESSON_LOCKED') {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Test hali yopiq</h1>
        <p className="text-slate-600 dark:text-slate-400">{state.message}</p>
        <Button variant="secondary" onClick={() => router.push(courseBase)}>
          Kurs xaritasiga qaytish
        </Button>
      </section>
    );
  }

  return (
    <LoadState state={state}>
      {(q) => <Quiz key={q.id} initial={q} courseBase={courseBase} />}
    </LoadState>
  );
}

function Quiz({ initial, courseBase }: { initial: QuizView; courseBase: string }) {
  const [quiz, setQuiz] = useState(initial);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const answered = quiz.questions.filter((q) => isAnswered(q, answers[q.id])).length;

  function update(questionId: string, patch: AnswerPatch) {
    setJustSubmitted(false);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { optionIds: [], ...prev[questionId], ...patch, questionId },
    }));
  }

  /** Every question is sent; an untouched ordering question keeps the order shown. */
  function payload(): QuizAnswer[] {
    return quiz.questions.map((q) => {
      const a = answers[q.id] ?? { questionId: q.id, optionIds: [] };
      if (q.kind === 'ORDERING' && (a.order?.length ?? 0) !== q.items.length) {
        return { ...a, order: q.items.map((x) => x.id) };
      }
      return a;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      answered < quiz.questions.length &&
      !(await confirmDialog({
        title: 'Testni yuborish',
        message: 'Hamma savolga javob berilmagan. Baribir yuborasizmi?',
        confirmLabel: 'Yuborish',
      }))
    ) {
      return;
    }
    setError(null);
    setPending(true);
    const res = await send<QuizView>('POST', `${courseBase}/quizzes/${quiz.id}/attempts`, {
      answers: payload(),
    });
    setPending(false);
    if (!res.ok) return setError(res.message);
    setQuiz(res.data);
    setJustSubmitted(true);
  }

  const last = quiz.lastAttempt;
  const review = new Map((last?.review ?? []).map((r) => [r.questionId, r]));
  const wrong = (last?.review ?? []).filter((r) => !r.correct).length;
  return (
    <article className="card space-y-6 p-6 sm:p-10">
      <nav className="text-sm">
        <BackLink href={`${courseBase}/lessons/${quiz.lessonId}`}>Darsga qaytish</BackLink>
      </nav>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <QuizStatusBadge status={quiz.status} bestScore={quiz.bestScore} />
      </header>
      {quiz.description && <p>{quiz.description}</p>}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {quiz.questions.length} ta savol · o&apos;tish uchun kamida {quiz.passingPercent}% ·
        urinishlar: {quiz.attempts}
      </p>

      {last && (
        <section
          role="status"
          aria-live="polite"
          className={`rounded-xl px-5 py-4 ${
            last.passed
              ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
              : 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
          }`}
        >
          <p className="font-semibold">
            {justSubmitted ? 'Natija' : 'Oxirgi urinish'}: {last.score}% ({last.correct} /{' '}
            {last.total} to&apos;g&apos;ri) — {last.passed ? 'o‘tdingiz' : 'o‘tilmadi'}
          </p>
          <p className="mt-1 text-sm">
            {quiz.status === 'PASSED'
              ? 'Test bajarildi. Xohlasangiz yana mashq qilishingiz mumkin, natija saqlanib qoladi.'
              : quiz.feedback === 'PER_QUESTION'
                ? `${wrong} ta savolda xato bor — ular ostida izoh ko‘rsatildi. Mavzuni qayta ko‘rib chiqing va yana urinib ko‘ring.`
                : 'Mavzuni qayta ko‘rib chiqing va yana urinib ko‘ring. Bu testda faqat umumiy natija ko‘rsatiladi.'}
          </p>
        </section>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <ol className="space-y-6">
          {quiz.questions.map((q, i) => (
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
                <QuestionInput
                  q={q}
                  answer={answers[q.id]}
                  onChange={(patch) => update(q.id, patch)}
                />
                <QuestionReview review={review.get(q.id)} />
              </fieldset>
            </li>
          ))}
        </ol>
        {error && <ErrorText>{error}</ErrorText>}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? 'Tekshirilmoqda…' : 'Javoblarni yuborish'}
          </Button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {answered} / {quiz.questions.length} savolga javob berildi
          </span>
        </div>
      </form>
    </article>
  );
}

/** Formative feedback for one question from the last attempt: right/wrong and the "why". */
function QuestionReview({ review }: { review: QuizQuestionReview | undefined }) {
  if (!review) return null;
  return (
    <div
      className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm ${
        review.correct
          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
          : 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
      }`}
    >
      <Icon name={review.correct ? 'checkCircle' : 'alertCircle'} className="mt-0.5 size-5" />
      <div>
        <p className="font-semibold">
          Oxirgi urinishda: {review.correct ? 'to‘g‘ri' : 'noto‘g‘ri'}
        </p>
        {review.explanation && <p className="mt-1 whitespace-pre-wrap">{review.explanation}</p>}
      </div>
    </div>
  );
}
