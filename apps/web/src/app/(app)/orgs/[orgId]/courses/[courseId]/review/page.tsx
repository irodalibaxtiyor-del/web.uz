'use client';

import {
  formatInterval,
  REVIEW_GRADE_LABEL,
  REVIEW_GRADES,
  scheduleReview,
  type ReviewCard,
  type ReviewGrade,
  type ReviewQueue,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TermBody } from '@/components/glossary-ui';
import { Icon } from '@/components/icons';
import { BackLink, ErrorText, LoadState, ProgressBar } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const GRADE_STYLE: Record<ReviewGrade, string> = {
  AGAIN: 'border-rose-300 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950',
  HARD: 'border-amber-300 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950',
  GOOD: 'border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950',
  EASY: 'border-sky-300 hover:bg-sky-50 dark:border-sky-800 dark:hover:bg-sky-950',
};

export default function ReviewPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<ReviewQueue>(`${base}/glossary/review`);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink href={base}>Kurs xaritasiga qaytish</BackLink>
      <LoadState state={state}>{(q) => <Session queue={q} base={base} />}</LoadState>
    </div>
  );
}

function Session({ queue, base }: { queue: ReviewQueue; base: string }) {
  const [cards, setCards] = useState<ReviewCard[]>(queue.cards);
  const [pos, setPos] = useState(0);
  const [shown, setShown] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answered, setAnswered] = useState(0);
  const [remembered, setRemembered] = useState(0);
  const firstTotal = queue.cards.length;
  const card = cards[pos];
  const revealRef = useRef<HTMLButtonElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const grade = useCallback(
    async (g: ReviewGrade) => {
      if (!card || pending) return;
      setPending(true);
      setError(null);
      const res = await send<{ intervalDays: number }>(
        'POST',
        `${base}/glossary/review/${card.termId}`,
        { grade: g },
      );
      setPending(false);
      if (!res.ok) return setError(res.message);
      setAnswered((n) => n + 1);
      if (g !== 'AGAIN') setRemembered((n) => n + 1);
      else {
        // A forgotten card comes back at the end of this session.
        const next = scheduleReview(card.state, g, new Date());
        setCards((cs) => [
          ...cs,
          {
            ...card,
            isNew: false,
            state: {
              ease: next.ease,
              intervalDays: next.intervalDays,
              reps: next.reps,
              lapses: next.lapses,
            },
          },
        ]);
      }
      setPos((p) => p + 1);
      setShown(false);
    },
    [base, card, pending],
  );

  useEffect(() => {
    if (shown) answerRef.current?.focus();
    else revealRef.current?.focus();
  }, [shown, pos]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (!shown && e.key === ' ') {
        e.preventDefault();
        setShown(true);
      } else if (shown && /^[1-4]$/.test(e.key)) {
        e.preventDefault();
        void grade(REVIEW_GRADES[Number(e.key) - 1]!);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shown, grade]);

  if (!card) {
    return (
      <section className="card space-y-4 p-6 text-center sm:p-10">
        <Icon name="trophy" className="mx-auto size-12 text-accent-500" />
        <h1 className="text-2xl font-bold">
          {answered > 0 ? 'Bugungi takrorlash tugadi!' : 'Hozircha takrorlash yo‘q'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {answered > 0
            ? `${firstTotal} ta karta takrorlandi, javoblar: ${answered} (eslanganlari ${remembered}).`
            : queue.counts.learned === 0
              ? 'Darsni tugatganingizdan keyin uning atamalari takrorlash uchun ochiladi.'
              : 'Hamma kartalar keyinroq takrorlanadi.'}
          {queue.nextDueAt && answered === 0 && (
            <> Keyingi takrorlash: {new Date(queue.nextDueAt).toLocaleString('uz-UZ')}.</>
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={`${base}/glossary`} className="btn btn-outline">
            Lug‘atni ochish
          </Link>
          <Link href={base} className="btn btn-primary">
            Kurs xaritasi
          </Link>
        </div>
      </section>
    );
  }

  const now = new Date();
  const done = Math.min(answered, cards.length);
  return (
    <section aria-labelledby="review-term" className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
        <span>
          Karta {pos + 1} / {cards.length}
        </span>
        <span>{card.isNew ? 'Yangi atama' : 'Takrorlash'}</span>
      </div>
      <ProgressBar percent={Math.round((done / cards.length) * 100)} label="Takrorlash jarayoni" />
      <div className="card space-y-5 p-6 sm:p-10">
        <div className="space-y-1 text-center">
          {card.lessonTitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400">Dars: {card.lessonTitle}</p>
          )}
          <h1 id="review-term" className="text-3xl font-bold break-words">
            {card.term}
          </h1>
          {!shown && (
            <p className="text-slate-600 dark:text-slate-400">
              Bu atama nimani bildiradi? Avval o‘zingiz eslab ko‘ring.
            </p>
          )}
        </div>
        {!shown ? (
          <div className="flex justify-center">
            <button
              ref={revealRef}
              type="button"
              className="btn btn-primary px-6 py-3"
              onClick={() => setShown(true)}
            >
              <Icon name="eye" className="size-4" /> Javobni ko‘rish
              <kbd className="ml-1 hidden rounded border border-white/40 px-1 text-xs sm:inline">
                Probel
              </kbd>
            </button>
          </div>
        ) : (
          <div ref={answerRef} tabIndex={-1} className="space-y-5 focus:outline-none">
            <div className="space-y-3 rounded-xl bg-subtle p-4">
              <TermBody definition={card.definition} example={card.example} />
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-center font-semibold">
                Qanchalik yaxshi esladingiz?
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {REVIEW_GRADES.map((g, i) => (
                  <button
                    key={g}
                    type="button"
                    disabled={pending}
                    onClick={() => void grade(g)}
                    className={`flex min-h-16 flex-col items-center justify-center rounded-xl border-2 px-2 py-2 text-sm font-semibold disabled:opacity-60 ${GRADE_STYLE[g]}`}
                  >
                    <span>{REVIEW_GRADE_LABEL[g]}</span>
                    <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                      {formatInterval(scheduleReview(card.state, g, now), now)}
                      <span className="hidden sm:inline"> · {i + 1}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}
        {error && <ErrorText>{error}</ErrorText>}
      </div>
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Kartalar unutish ehtimoli oshganda qaytadi: yaxshi eslaganingiz sari oraliq uzayadi.
      </p>
    </section>
  );
}
