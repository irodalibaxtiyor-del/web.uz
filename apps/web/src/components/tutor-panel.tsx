'use client';

import {
  HANDOFF_CATEGORIES,
  TUTOR_LEVELS,
  TUTOR_MESSAGE_MAX,
  type HandoffCategory,
  type TutorExchange,
  type TutorLevel,
  type TutorReply,
  type TutorRequestMode,
  type TutorState,
  type TutorTargetKind,
} from '@webdizayn/shared';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Markdown } from '@/components/markdown';
import { send } from '@/lib/api';
import { formatDateTime } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

export const MODE_LABEL: Record<TutorRequestMode, string> = {
  HINT: 'Maslahat',
  CODE_EXPLANATION: 'Kodimni tushuntir',
  ERROR_EXPLANATION: 'Xatoni tushuntir',
  COMPREHENSION_QUESTION: 'Meni tekshir',
  FLEXBOX_HELP: 'Flexbox yordami',
  ASSIGNMENT_GUIDANCE: 'Topshiriq bo‘yicha yo‘l-yo‘riq',
  TEACHER_HANDOFF: 'O‘qituvchiga murojaat',
};

const LEVEL_LABEL: Record<TutorLevel, string> = {
  BEGINNER: 'Boshlang‘ich',
  INTERMEDIATE: 'O‘rta',
  ADVANCED: 'Yuqori',
};

const HANDOFF_LABEL: Record<HandoffCategory, string> = {
  STUCK: 'Qotib qoldim',
  CONCEPT: 'Mavzuni tushunmadim',
  BUG: 'Kodim ishlamayapti',
  OTHER: 'Boshqa',
};

const ERROR_TEXT: Record<string, string> = {
  AI_QUOTA_EXCEEDED:
    'Bugungi limit tugadi. Ertaga yana urinib ko‘ring yoki o‘qituvchiga murojaat qiling.',
  AI_RATE_LIMITED: 'Juda tez-tez so‘ralyapti. Bir daqiqa kutib, qayta urinib ko‘ring.',
  AI_UNAVAILABLE: 'AI yordamchi hozir javob bera olmadi. Birozdan keyin urinib ko‘ring.',
};

const LEVEL_KEY = 'wd:tutor-level';

function readLevel(): TutorLevel {
  if (typeof window === 'undefined') return 'BEGINNER';
  try {
    const v = window.localStorage.getItem(LEVEL_KEY);
    return (TUTOR_LEVELS as readonly string[]).includes(v ?? '') ? (v as TutorLevel) : 'BEGINNER';
  } catch {
    return 'BEGINNER';
  }
}

/**
 * Second line of defence for assignments: even if the server let a long code answer through,
 * it is not rendered here.
 */
export function looksLikeFullSolution(text: string, kind: TutorTargetKind): boolean {
  if (kind !== 'ASSIGNMENT') return false;
  const lines = [...text.matchAll(/```[\w-]*\n([\s\S]*?)```/g)]
    .map((m) => m[1]!.split('\n').filter((l) => l.trim()).length)
    .reduce((a, b) => a + b, 0);
  return lines > 8 || /<!doctype\s+html|<html[\s>]/i.test(text);
}

export function TutorPanel({
  courseBase,
  targetKind,
  targetId,
  runErrors = [],
}: {
  courseBase: string;
  targetKind: TutorTargetKind;
  targetId: string;
  runErrors?: string[];
}) {
  const { state } = useApi<TutorState>(
    `${courseBase}/tutor?targetKind=${targetKind}&targetId=${targetId}`,
  );
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="card space-y-4 p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id={headingId} className="text-lg font-bold">
            <span aria-hidden="true">🤖 </span>AI yordamchi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Maslahat beradi va tushuntiradi. Tayyor yechim bermaydi va baho qo‘ymaydi.
          </p>
        </div>
        {state.kind === 'ready' && state.data.provider === 'mock' && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Namuna rejimi
          </span>
        )}
      </header>
      {state.kind === 'loading' && <p className="text-sm text-slate-500">Yuklanmoqda…</p>}
      {state.kind === 'error' && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {state.status === 403 || state.status === 404
            ? 'AI yordamchi faqat sizga ochiq bo‘lgan mashq va topshiriqlar uchun ishlaydi.'
            : state.message}
        </p>
      )}
      {state.kind === 'ready' && (
        <Conversation
          initial={state.data}
          courseBase={courseBase}
          targetKind={targetKind}
          targetId={targetId}
          runErrors={runErrors}
        />
      )}
    </section>
  );
}

function Conversation({
  initial,
  courseBase,
  targetKind,
  targetId,
  runErrors,
}: {
  initial: TutorState;
  courseBase: string;
  targetKind: TutorTargetKind;
  targetId: string;
  runErrors: string[];
}) {
  const [history, setHistory] = useState<TutorExchange[]>(initial.history);
  const [hintsUsed, setHintsUsed] = useState(initial.hintsUsed);
  const [quota, setQuota] = useState(initial.quota);
  // Rendered only after the tutor state loaded on the client, so localStorage is available.
  const [level, setLevel] = useState<TutorLevel>(readLevel);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<TutorRequestMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [category, setCategory] = useState<HandoffCategory>('STUCK');
  const endRef = useRef<HTMLDivElement>(null);
  const messageId = useId();

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [history.length]);

  function changeLevel(v: TutorLevel) {
    setLevel(v);
    try {
      window.localStorage.setItem(LEVEL_KEY, v);
    } catch {
      // storage unavailable: keep the choice for this page only
    }
  }

  async function ask(mode: TutorRequestMode) {
    setError(null);
    setPending(mode);
    const text = message.trim();
    const res = await send<TutorReply>('POST', `${courseBase}/tutor/ask`, {
      targetKind,
      targetId,
      mode,
      level,
      message: text,
      ...(mode === 'TEACHER_HANDOFF' ? { handoffCategory: category } : {}),
      ...(runErrors.length ? { run: { errors: runErrors } } : {}),
    });
    setPending(null);
    if (!res.ok) {
      setError(
        res.status === 403 || res.status === 404
          ? 'AI yordamchi faqat sizga ochiq bo‘lgan mashq va topshiriqlar uchun ishlaydi.'
          : (res.code && ERROR_TEXT[res.code]) || res.message,
      );
      return;
    }
    setHistory((h) => [
      ...h,
      { request: { mode, message: text, createdAt: res.data.createdAt }, reply: res.data },
    ]);
    if (res.data.hintNumber) setHintsUsed((n) => Math.max(n, res.data.hintNumber!));
    setQuota((q) => ({
      ...q,
      requestsUsed:
        q.requestsUsed +
        (res.data.mode === 'TEACHER_HANDOFF' || res.data.mode === 'OUT_OF_SCOPE' ? 0 : 1),
    }));
    setMessage('');
    setHandoffOpen(false);
  }

  async function rate(interactionId: string, helpful: boolean) {
    const res = await send<{ helpful: boolean }>(
      'POST',
      `${courseBase}/tutor/interactions/${interactionId}/feedback`,
      { helpful },
    );
    if (res.ok) {
      setHistory((h) =>
        h.map((x) =>
          x.reply.interactionId === interactionId
            ? { ...x, reply: { ...x.reply, feedback: { helpful } } }
            : x,
        ),
      );
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void ask(targetKind === 'ASSIGNMENT' ? 'ASSIGNMENT_GUIDANCE' : 'CODE_EXPLANATION');
  }

  const modes: TutorRequestMode[] = [
    'HINT',
    'CODE_EXPLANATION',
    'ERROR_EXPLANATION',
    'COMPREHENSION_QUESTION',
    'FLEXBOX_HELP',
    ...(targetKind === 'ASSIGNMENT' ? (['ASSIGNMENT_GUIDANCE'] as const) : []),
  ];
  const outOfQuota = quota.requestsUsed >= quota.requestsLimit;

  return (
    <div className="space-y-4">
      {history.length > 0 && (
        <ol className="max-h-[28rem] space-y-4 overflow-y-auto pr-1" aria-label="Suhbat tarixi">
          {history.map((x) => (
            <li key={x.reply.interactionId} className="space-y-2">
              <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-brand-600 px-3 py-2 text-sm text-white">
                <strong>{MODE_LABEL[x.request.mode]}</strong>
                {x.request.message && (
                  <span className="block whitespace-pre-wrap">{x.request.message}</span>
                )}
              </p>
              <ReplyCard exchange={x} targetKind={targetKind} onRate={rate} />
            </li>
          ))}
          <div ref={endRef} />
        </ol>
      )}

      <div aria-live="polite" className="sr-only">
        {pending ? 'Javob tayyorlanmoqda' : history.length ? 'Yangi javob keldi' : ''}
      </div>

      <form onSubmit={submit} className="space-y-3">
        <label htmlFor={messageId} className="text-sm font-semibold">
          Savolingiz (ixtiyoriy)
        </label>
        <textarea
          id={messageId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={TUTOR_MESSAGE_MAX}
          rows={3}
          className="field"
          placeholder="Masalan: nega sarlavham markazda emas?"
        />
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <label className="flex items-center gap-2">
            Daraja:
            <select
              value={level}
              onChange={(e) => changeLevel(e.target.value as TutorLevel)}
              className="field w-auto py-1"
            >
              {TUTOR_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_LABEL[l]}
                </option>
              ))}
            </select>
          </label>
          <span>
            Bugun: {quota.requestsUsed}/{quota.requestsLimit} so‘rov
          </span>
          {runErrors.length > 0 && <span>RUN xatolari: {runErrors.length} ta (yuboriladi)</span>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Yordam turi">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => ask(mode)}
              disabled={pending !== null || outOfQuota}
              className={`btn py-2 text-sm ${mode === 'HINT' ? 'btn-primary' : 'btn-outline'}`}
            >
              {pending === mode ? 'Kutilmoqda…' : MODE_LABEL[mode]}
              {mode === 'HINT' &&
                ` (${Math.min(hintsUsed + 1, initial.maxHints)}/${initial.maxHints})`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setHandoffOpen((v) => !v)}
            aria-expanded={handoffOpen}
            disabled={pending !== null}
            className="btn btn-outline py-2 text-sm"
          >
            {MODE_LABEL.TEACHER_HANDOFF}
          </button>
        </div>
        {handoffOpen && (
          <fieldset className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <legend className="px-1 text-sm font-semibold">O‘qituvchiga nima deymiz?</legend>
            <div className="flex flex-wrap gap-3 text-sm">
              {HANDOFF_CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="handoff"
                    checked={category === c}
                    onChange={() => setCategory(c)}
                  />
                  {HANDOFF_LABEL[c]}
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Yuqoridagi matn o‘qituvchiga izoh sifatida yuboriladi. Baho va progressga ta’sir
              qilmaydi.
            </p>
            <button
              type="button"
              onClick={() => ask('TEACHER_HANDOFF')}
              disabled={pending !== null}
              className="btn btn-accent py-2 text-sm"
            >
              Yuborish
            </button>
          </fieldset>
        )}
        {outOfQuota && (
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {ERROR_TEXT.AI_QUOTA_EXCEEDED}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

function ReplyCard({
  exchange,
  targetKind,
  onRate,
}: {
  exchange: TutorExchange;
  targetKind: TutorTargetKind;
  onRate: (id: string, helpful: boolean) => void;
}) {
  const r = exchange.reply;
  const hiddenSolution = !r.blocked && looksLikeFullSolution(r.message, targetKind);
  const teaching = r.mode !== 'TEACHER_HANDOFF' && r.mode !== 'OUT_OF_SCOPE' && !r.blocked;

  return (
    <div className="max-w-[95%] space-y-2 rounded-2xl rounded-bl-sm bg-surface p-3 text-sm dark:bg-slate-800">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        {r.hintNumber && (
          <span className="rounded-full bg-brand-100 px-2 py-0.5 font-semibold text-brand-800 dark:bg-brand-900 dark:text-brand-100">
            Maslahat {r.hintNumber}/3
          </span>
        )}
        {r.refused === 'FULL_SOLUTION' && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
            Tayyor yechim berilmaydi
          </span>
        )}
        {r.mode === 'TEACHER_HANDOFF' && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
            ✓ O‘qituvchiga yuborildi
          </span>
        )}
        <time dateTime={r.createdAt}>{formatDateTime(r.createdAt)}</time>
      </div>
      {r.blocked || hiddenSolution ? (
        <p role="note" className="text-amber-800 dark:text-amber-300">
          ⚠{' '}
          {hiddenSolution
            ? 'Bu javobda tayyor yechim bor edi, shuning uchun u ko‘rsatilmaydi.'
            : r.message}
        </p>
      ) : (
        <div className="lesson-content text-sm">
          <Markdown>{r.message}</Markdown>
        </div>
      )}
      {r.comprehensionQuestion && !hiddenSolution && (
        <p className="rounded-lg border-l-4 border-accent-400 bg-white px-3 py-2 dark:bg-slate-900">
          <strong>Savol: </strong>
          {r.comprehensionQuestion}
        </p>
      )}
      {teaching && (
        <div
          className="flex items-center gap-2 text-xs"
          role="group"
          aria-label="Javob foydali bo‘ldimi?"
        >
          <span className="text-slate-500 dark:text-slate-400">Foydali bo‘ldimi?</span>
          <button
            type="button"
            aria-pressed={r.feedback?.helpful === true}
            onClick={() => onRate(r.interactionId, true)}
            className={`rounded-full border px-2 py-0.5 ${r.feedback?.helpful === true ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : 'border-slate-300 dark:border-slate-600'}`}
          >
            👍 Ha
          </button>
          <button
            type="button"
            aria-pressed={r.feedback?.helpful === false}
            onClick={() => onRate(r.interactionId, false)}
            className={`rounded-full border px-2 py-0.5 ${r.feedback?.helpful === false ? 'border-red-400 bg-red-50 dark:bg-red-950' : 'border-slate-300 dark:border-slate-600'}`}
          >
            👎 Yo‘q
          </button>
        </div>
      )}
    </div>
  );
}
