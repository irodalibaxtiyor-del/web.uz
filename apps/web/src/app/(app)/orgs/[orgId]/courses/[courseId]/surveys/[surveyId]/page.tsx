'use client';

import { LIKERT_LABELS, type SurveyStudentView } from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { BackLink, Button, ErrorText, inputClass, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function StudentSurveyPage() {
  const { orgId, courseId, surveyId } = useParams<{
    orgId: string;
    courseId: string;
    surveyId: string;
  }>();
  const courseBase = `/orgs/${orgId}/courses/${courseId}`;
  const path = `${courseBase}/surveys/${surveyId}`;
  const { state, setState } = useApi<SurveyStudentView>(path);
  return (
    <article className="card mx-auto max-w-3xl space-y-6 p-6 sm:p-10">
      <BackLink href={courseBase}>Kurs xaritasiga qaytish</BackLink>
      <LoadState state={state}>
        {(s) =>
          s.answered ? (
            <>
              <h1 className="text-3xl font-bold">{s.title}</h1>
              <p
                role="status"
                className="rounded-xl bg-emerald-50 px-5 py-4 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              >
                Javoblaringiz qabul qilindi. Rahmat!
              </p>
            </>
          ) : (
            <SurveyForm s={s} path={path} onDone={(v) => setState({ kind: 'ready', data: v })} />
          )
        }
      </LoadState>
    </article>
  );
}

function SurveyForm({
  s,
  path,
  onDone,
}: {
  s: SurveyStudentView;
  path: string;
  onDone: (v: SurveyStudentView) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const missing = s.items.filter(
    (i) => i.required && (answers[i.id] === undefined || answers[i.id] === ''),
  ).length;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (missing > 0) return setError(`${missing} ta majburiy savolga javob berilmagan`);
    setPending(true);
    setError(null);
    const clean = Object.fromEntries(
      Object.entries(answers).filter(([, v]) => !(typeof v === 'string' && v.trim() === '')),
    );
    const res = await send<SurveyStudentView>('POST', `${path}/responses`, { answers: clean });
    setPending(false);
    if (!res.ok) return setError(res.message);
    onDone(res.data);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{s.title}</h1>
        {s.description && <p className="whitespace-pre-wrap">{s.description}</p>}
      </header>
      <ol className="space-y-5">
        {s.items.map((it, n) => (
          <li key={it.id}>
            {it.kind === 'LIKERT' ? (
              <fieldset className="space-y-3 rounded-xl border border-line bg-panel p-4">
                <legend className="px-1 font-semibold">
                  {n + 1}. {it.text}
                  {!it.required && (
                    <span className="ml-1 font-normal text-slate-600 dark:text-slate-400">
                      (ixtiyoriy)
                    </span>
                  )}
                </legend>
                <div className="grid gap-2 sm:grid-cols-5">
                  {LIKERT_LABELS.map((label, i) => {
                    const v = i + 1;
                    const on = answers[it.id] === v;
                    return (
                      <label
                        key={v}
                        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm sm:flex-col sm:text-center ${
                          on
                            ? 'border-brand-600 bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-100'
                            : 'border-line hover:border-brand-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name={it.id}
                          value={v}
                          checked={on}
                          onChange={() => setAnswers((a) => ({ ...a, [it.id]: v }))}
                          className="size-4"
                        />
                        <span>
                          <span className="font-semibold">{v}</span> — {label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <div className="space-y-2 rounded-xl border border-line bg-panel p-4">
                <label htmlFor={`sv-${it.id}`} className="block font-semibold">
                  {n + 1}. {it.text}
                  {!it.required && (
                    <span className="ml-1 font-normal text-slate-600 dark:text-slate-400">
                      (ixtiyoriy)
                    </span>
                  )}
                </label>
                <textarea
                  id={`sv-${it.id}`}
                  rows={3}
                  maxLength={2000}
                  value={(answers[it.id] as string | undefined) ?? ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [it.id]: e.target.value }))}
                  className={inputClass}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Yuborilmoqda…' : 'Javoblarni yuborish'}
        </Button>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Javoblar bir marta yuboriladi
        </span>
      </div>
    </form>
  );
}
