'use client';

import type { ReviewQueue } from '@webdizayn/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/icons';
import { OptionText } from '@/components/markdown';
import { api } from '@/lib/api';

/** Course map card: glossary link and today's review count. Hidden when the course has no terms. */
export function ReviewBanner({ base }: { base: string }) {
  const [q, setQ] = useState<ReviewQueue | null>(null);
  useEffect(() => {
    let alive = true;
    void api<ReviewQueue>(`${base}/glossary/review`).then((r) => {
      if (alive && r.ok) setQ(r.data);
    });
    return () => {
      alive = false;
    };
  }, [base]);
  if (!q || q.counts.total === 0) return null;
  const todo = q.cards.length;
  return (
    <section
      aria-label="Atamalar lug‘ati va takrorlash"
      className="card flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-brand-500 p-5"
    >
      <div className="flex items-start gap-3">
        <Icon name="book" className="mt-0.5 size-6 text-brand-600 dark:text-brand-300" />
        <div>
          <p className="font-semibold">Atamalar lug‘ati va takrorlash</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {q.counts.learned === 0
              ? 'Darsni tugatganingizdan keyin uning atamalarini takrorlay olasiz.'
              : todo > 0
                ? `Bugun takrorlash uchun ${todo} ta karta.`
                : 'Bugungi takrorlash tugadi.'}{' '}
            O‘rganilgan atamalar: {q.counts.learned} / {q.counts.total}.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`${base}/glossary`} className="btn btn-outline">
          Lug‘at
        </Link>
        {todo > 0 && (
          <Link href={`${base}/review`} className="btn btn-primary">
            Takrorlash ({todo})
          </Link>
        )}
      </div>
    </section>
  );
}

/** Definition text (inline `code` formatted) and an optional code example. */
export function TermBody({ definition, example }: { definition: string; example: string }) {
  return (
    <>
      <p className="leading-relaxed">
        <OptionText>{definition}</OptionText>
      </p>
      {example && (
        <pre className="overflow-x-auto rounded-lg bg-ink p-3 font-mono text-sm text-slate-100">
          <code>{example}</code>
        </pre>
      )}
    </>
  );
}
