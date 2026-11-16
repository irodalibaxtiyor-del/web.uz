'use client';

import { QUIZ_MAX_QUESTIONS, type QuizQuestion, type QuizQuestionKind } from '@webdizayn/shared';
import { useState } from 'react';
import { Icon } from './icons';
import { blankQuestion, KindSelect, QuestionBodyEditor } from './quiz-editors';
import { Button, inputClass } from './ui';

/** Human-readable hint for the first validation problem ("3-savol: …"). */
export function describeIssue(path: PropertyKey[]): string {
  if (path[0] !== 'questions' || typeof path[1] !== 'number') {
    return 'Tekshiring: nom kamida 2 belgi, foizlar 1–100 oralig‘ida bo‘lsin';
  }
  const field = String(path[2] ?? '');
  const what: Record<string, string> = {
    prompt: 'savol matnini yozing',
    options: 'kamida 2 ta to‘ldirilgan variant kerak',
    correct: 'to‘g‘ri javobni belgilang',
    template: 'har bo‘sh joy {{1}}, {{2}}… bir martadan ishlatilsin',
    blanks: 'har bo‘sh joyga kamida bitta to‘g‘ri javob yozing',
    left: 'juftliklarni to‘ldiring',
    right: 'javoblarni to‘ldiring',
    pairs: 'har chap elementga bitta mos javob kerak',
    items: 'elementlarni to‘ldiring',
    groups: 'guruh nomlarini to‘ldiring',
  };
  return `${path[1] + 1}-savol: ${what[field] ?? 'barcha maydonlarni to‘ldiring'}`;
}

/**
 * Editable list of questions of any kind: prompt, kind, kind-specific body, optional
 * explanation, reorder and delete, and "add question of kind …".
 */
export function QuestionListEditor({
  questions,
  onChange,
  explanations = true,
}: {
  questions: QuizQuestion[];
  onChange: (next: QuizQuestion[]) => void;
  /** Show the per-question explanation field (formative feedback). */
  explanations?: boolean;
}) {
  const [newKind, setNewKind] = useState<QuizQuestionKind>('SINGLE');
  const setQ = (i: number, q: QuizQuestion) => onChange(questions.map((x, j) => (j === i ? q : x)));
  const moveQ = (from: number, to: number) => {
    const next = [...questions];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x!);
    onChange(next);
  };
  return (
    <>
      <ol className="space-y-4">
        {questions.map((q, i) => (
          <li key={q.id} className="space-y-4 rounded-xl border border-line bg-panel p-4">
            <div className="flex flex-wrap items-start gap-3">
              <span className="pt-2 font-semibold">{i + 1}.</span>
              <textarea
                aria-label={`${i + 1}-savol matni`}
                value={q.prompt}
                onChange={(e) => setQ(i, { ...q, prompt: e.target.value })}
                rows={2}
                placeholder="Savol matni"
                className={`${inputClass} min-w-0 flex-1`}
              />
              <KindSelect
                label={`${i + 1}-savol turi`}
                value={q.kind}
                onChange={(k) => setQ(i, blankQuestion(k, q))}
              />
            </div>
            <div className="space-y-4 sm:pl-6">
              <QuestionBodyEditor q={q} n={i + 1} onChange={(next) => setQ(i, next)} />
              {explanations && (
                <div className="space-y-1">
                  <label htmlFor={`${q.id}-why`} className="text-sm font-medium">
                    Izoh (urinishdan keyin talabaga ko&apos;rsatiladi, ixtiyoriy)
                  </label>
                  <textarea
                    id={`${q.id}-why`}
                    value={q.explanation ?? ''}
                    onChange={(e) => setQ(i, { ...q, explanation: e.target.value || undefined })}
                    rows={2}
                    maxLength={1000}
                    placeholder="Nega shunday? Qoidani qisqa tushuntiring"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line pt-3 sm:pl-6">
              <Button variant="ghost" disabled={i === 0} onClick={() => moveQ(i, i - 1)}>
                <Icon name="arrowUp" className="size-4" />
                Yuqoriga
              </Button>
              <Button
                variant="ghost"
                disabled={i === questions.length - 1}
                onClick={() => moveQ(i, i + 1)}
              >
                <Icon name="arrowDown" className="size-4" />
                Pastga
              </Button>
              <Button variant="ghost" onClick={() => onChange(questions.filter((_, j) => j !== i))}>
                <Icon name="trash" className="size-4" />
                Savolni o&apos;chirish
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-2">
        <KindSelect label="Yangi savol turi" value={newKind} onChange={setNewKind} />
        <Button
          variant="secondary"
          disabled={questions.length >= QUIZ_MAX_QUESTIONS}
          onClick={() => onChange([...questions, blankQuestion(newKind)])}
        >
          <Icon name="plus" className="size-4" />
          Savol qo&apos;shish
        </Button>
      </div>
    </>
  );
}
