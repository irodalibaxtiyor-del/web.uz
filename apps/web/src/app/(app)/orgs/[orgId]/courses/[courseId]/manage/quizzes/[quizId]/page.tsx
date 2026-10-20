'use client';

import {
  QUIZ_MAX_QUESTIONS,
  updateQuizSchema,
  type QuizAdmin,
  type QuizQuestion,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { BackLink, Button, ErrorText, inputClass, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { Icon } from '@/components/icons';

const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const blankQuestion = (): QuizQuestion => {
  const a = newId('o');
  return {
    id: newId('q'),
    prompt: '',
    kind: 'SINGLE',
    options: [
      { id: a, text: '' },
      { id: newId('o'), text: '' },
    ],
    correct: [a],
  };
};

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
  const [questions, setQuestions] = useState<QuizQuestion[]>(initial.questions);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const touch = () => setSaved(false);
  const updateQ = (i: number, patch: Partial<QuizQuestion>) => {
    setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
    touch();
  };

  function setKind(i: number, kind: QuizQuestion['kind']) {
    const q = questions[i]!;
    // Switching to SINGLE keeps only the first correct option.
    updateQ(i, { kind, correct: kind === 'SINGLE' ? q.correct.slice(0, 1) : q.correct });
  }

  function toggleCorrect(i: number, optionId: string, checked: boolean) {
    const q = questions[i]!;
    const correct =
      q.kind === 'SINGLE'
        ? [optionId]
        : checked
          ? [...q.correct, optionId]
          : q.correct.filter((c) => c !== optionId);
    updateQ(i, { correct });
  }

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
      isActive,
      questions,
    });
    if (!parsed.success) {
      return setError(
        'Tekshiring: har savolda matn, kamida 2 ta to‘ldirilgan variant va kamida bitta to‘g‘ri javob bo‘lsin',
      );
    }
    setPending(true);
    const res = await send('PATCH', `${base}/quizzes/${initial.id}`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Testni tahrirlash</h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">
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
        <label className="flex items-center gap-2 py-2 text-sm">
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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          To&apos;g&apos;ri javoblar faqat serverda saqlanadi. Talaba faqat umumiy natijani
          ko&apos;radi, qaysi javob noto&apos;g&apos;ri ekanini emas.
        </p>
        <ol className="space-y-4">
          {questions.map((q, i) => (
            <li
              key={q.id}
              className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <div className="flex flex-wrap items-start gap-3">
                <span className="pt-2 font-semibold">{i + 1}.</span>
                <textarea
                  aria-label={`${i + 1}-savol matni`}
                  value={q.prompt}
                  onChange={(e) => updateQ(i, { prompt: e.target.value })}
                  rows={2}
                  placeholder="Savol matni"
                  className={`${inputClass} min-w-0 flex-1`}
                />
                <select
                  aria-label={`${i + 1}-savol turi`}
                  value={q.kind}
                  onChange={(e) => setKind(i, e.target.value as QuizQuestion['kind'])}
                  className={`${inputClass} w-auto`}
                >
                  <option value="SINGLE">Bitta javob</option>
                  <option value="MULTIPLE">Bir nechta javob</option>
                </select>
              </div>
              <fieldset className="space-y-2 pl-6">
                <legend className="sr-only">{i + 1}-savol variantlari</legend>
                {q.options.map((o, oi) => (
                  <div key={o.id} className="flex items-center gap-2">
                    <input
                      type={q.kind === 'SINGLE' ? 'radio' : 'checkbox'}
                      name={`${q.id}-correct`}
                      aria-label={`${oi + 1}-variant to'g'ri`}
                      checked={q.correct.includes(o.id)}
                      onChange={(e) => toggleCorrect(i, o.id, e.target.checked)}
                    />
                    <input
                      aria-label={`${i + 1}-savol, ${oi + 1}-variant`}
                      value={o.text}
                      onChange={(e) =>
                        updateQ(i, {
                          options: q.options.map((x) =>
                            x.id === o.id ? { ...x, text: e.target.value } : x,
                          ),
                        })
                      }
                      placeholder={`${oi + 1}-variant`}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      disabled={q.options.length <= 2}
                      onClick={() =>
                        updateQ(i, {
                          options: q.options.filter((x) => x.id !== o.id),
                          correct: q.correct.filter((c) => c !== o.id),
                        })
                      }
                      aria-label={`${oi + 1}-variantni o'chirish`}
                      className="rounded px-2 text-slate-500 hover:text-red-600 disabled:opacity-30 dark:text-slate-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="secondary"
                    disabled={q.options.length >= 8}
                    onClick={() =>
                      updateQ(i, { options: [...q.options, { id: newId('o'), text: '' }] })
                    }
                  >
                    <Icon name="plus" className="size-4" />
                    Variant
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuestions((qs) => qs.filter((_, j) => j !== i));
                      touch();
                    }}
                  >
                    Savolni o&apos;chirish
                  </Button>
                </div>
              </fieldset>
            </li>
          ))}
        </ol>
        <Button
          variant="secondary"
          disabled={questions.length >= QUIZ_MAX_QUESTIONS}
          onClick={() => {
            setQuestions((qs) => [...qs, blankQuestion()]);
            touch();
          }}
        >
          <Icon name="plus" className="size-4" />
          Savol
        </Button>
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
