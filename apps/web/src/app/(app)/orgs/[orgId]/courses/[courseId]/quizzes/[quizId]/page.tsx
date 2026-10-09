'use client';

import type { QuizView } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { QuizStatusBadge } from '@/components/quiz-ui';
import { Button, ErrorText, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function QuizPage() {
  const router = useRouter();
  const { orgId, courseId, quizId } = useParams<{
    orgId: string;
    courseId: string;
    quizId: string;
  }>();
  const courseBase = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<QuizView>(`${courseBase}/quizzes/${quizId}`);

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
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const answered = quiz.questions.filter((q) => (answers[q.id] ?? []).length > 0).length;

  function choose(questionId: string, optionId: string, multiple: boolean, checked: boolean) {
    setJustSubmitted(false);
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      const next = multiple
        ? checked
          ? [...current, optionId]
          : current.filter((x) => x !== optionId)
        : [optionId];
      return { ...prev, [questionId]: next };
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      answered < quiz.questions.length &&
      !window.confirm('Hamma savolga javob berilmagan. Baribir yuborasizmi?')
    ) {
      return;
    }
    setError(null);
    setPending(true);
    const res = await send<QuizView>('POST', `${courseBase}/quizzes/${quiz.id}/attempts`, {
      answers: Object.entries(answers).map(([questionId, optionIds]) => ({
        questionId,
        optionIds,
      })),
    });
    setPending(false);
    if (!res.ok) return setError(res.message);
    setQuiz(res.data);
    setJustSubmitted(true);
  }

  const last = quiz.lastAttempt;
  return (
    <article className="card space-y-6 p-6 sm:p-10">
      <nav className="text-sm">
        <Link
          href={`${courseBase}/lessons/${quiz.lessonId}`}
          className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
        >
          ← Darsga qaytish
        </Link>
      </nav>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <QuizStatusBadge status={quiz.status} bestScore={quiz.bestScore} />
      </header>
      {quiz.description && <p>{quiz.description}</p>}
      <p className="text-sm text-slate-500">
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
              : 'Mavzuni qayta ko‘rib chiqing va yana urinib ko‘ring. Qaysi javob noto‘g‘ri ekani ko‘rsatilmaydi.'}
          </p>
        </section>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <ol className="space-y-6">
          {quiz.questions.map((q, i) => {
            const multiple = q.kind === 'MULTIPLE';
            return (
              <li key={q.id}>
                <fieldset className="space-y-3 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                  <legend className="px-1 font-semibold">
                    {i + 1}. {q.prompt}
                  </legend>
                  {multiple && (
                    <p className="text-xs text-slate-500">
                      Bir nechta to&apos;g&apos;ri javob bo&apos;lishi mumkin
                    </p>
                  )}
                  {q.options.map((o) => (
                    <label key={o.id} className="flex cursor-pointer items-start gap-3">
                      <input
                        type={multiple ? 'checkbox' : 'radio'}
                        name={q.id}
                        value={o.id}
                        checked={(answers[q.id] ?? []).includes(o.id)}
                        onChange={(e) => choose(q.id, o.id, multiple, e.target.checked)}
                        className="mt-1"
                      />
                      <span>{o.text}</span>
                    </label>
                  ))}
                </fieldset>
              </li>
            );
          })}
        </ol>
        {error && <ErrorText>{error}</ErrorText>}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? 'Tekshirilmoqda…' : 'Javoblarni yuborish'}
          </Button>
          <span className="text-sm text-slate-500">
            {answered} / {quiz.questions.length} savolga javob berildi
          </span>
        </div>
      </form>
    </article>
  );
}
