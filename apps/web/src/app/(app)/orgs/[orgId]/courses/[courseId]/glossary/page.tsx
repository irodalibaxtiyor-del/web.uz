'use client';

import { filterTerms, termLetter, type GlossaryView, type TermView } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { TermBody } from '@/components/glossary-ui';
import { Icon } from '@/components/icons';
import { BackLink, EmptyState, inputClass, LoadState } from '@/components/ui';
import { useApi } from '@/lib/use-api';

export default function GlossaryPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<GlossaryView>(`${base}/glossary`);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <BackLink href={base}>Kurs xaritasiga qaytish</BackLink>
      <LoadState state={state}>{(g) => <Glossary g={g} base={base} />}</LoadState>
    </div>
  );
}

function Glossary({ g, base }: { g: GlossaryView; base: string }) {
  const [query, setQuery] = useState('');
  const staff = Boolean(g.lessons);
  const found = useMemo(() => filterTerms(g.terms, query), [g.terms, query]);
  const searching = query.trim().length > 0;
  const groups = useMemo(() => {
    const m = new Map<string, TermView[]>();
    for (const t of found) {
      const l = termLetter(t.term);
      m.set(l, [...(m.get(l) ?? []), t]);
    }
    return [...m.entries()];
  }, [found]);
  const learned = g.terms.filter((t) => t.learned).length;

  return (
    <>
      <header className="card space-y-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Atamalar lug‘ati</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {g.terms.length} ta atama
              {!staff && ` · o‘rganilgan: ${learned}`}
            </p>
          </div>
          {staff ? (
            <Link href={`${base}/manage/glossary`} className="btn btn-outline">
              <Icon name="pencil" className="size-4" /> Tahrirlash
            </Link>
          ) : (
            learned > 0 && (
              <Link href={`${base}/review`} className="btn btn-primary">
                <Icon name="refresh" className="size-4" /> Takrorlash
              </Link>
            )
          )}
        </div>
        <div>
          <label htmlFor="glossary-q" className="sr-only">
            Atama qidirish
          </label>
          <div className="relative">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-500"
            />
            <input
              id="glossary-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Atama yoki ta’rif bo‘yicha qidiring…"
              className={`${inputClass} pl-10`}
              autoComplete="off"
            />
          </div>
          <p aria-live="polite" className="sr-only">
            {searching ? `${found.length} ta natija` : ''}
          </p>
        </div>
        {!searching && groups.length > 1 && (
          <nav aria-label="Harflar bo‘yicha" className="flex flex-wrap gap-1">
            {groups.map(([letter]) => (
              <a
                key={letter}
                href={`#harf-${encodeURIComponent(letter)}`}
                className="min-w-9 rounded-lg border border-line px-2 py-1 text-center text-sm font-semibold hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
              >
                {letter}
              </a>
            ))}
          </nav>
        )}
      </header>

      {g.terms.length === 0 ? (
        <EmptyState title="Lug‘at hali bo‘sh">
          O‘qituvchi atamalar qo‘shganda shu yerda ko‘rinadi.
        </EmptyState>
      ) : found.length === 0 ? (
        <EmptyState title="Hech narsa topilmadi">Boshqa so‘z bilan qidirib ko‘ring.</EmptyState>
      ) : (
        groups.map(([letter, terms]) => (
          <section
            key={letter}
            id={`harf-${encodeURIComponent(letter)}`}
            aria-labelledby={`h-${encodeURIComponent(letter)}`}
            className="scroll-mt-24 space-y-3"
          >
            {!searching && (
              <h2
                id={`h-${encodeURIComponent(letter)}`}
                className="text-xl font-bold text-brand-700 dark:text-brand-300"
              >
                {letter}
              </h2>
            )}
            <dl className="space-y-3">
              {terms.map((t) => (
                <div key={t.id} className="card space-y-2 p-5">
                  <dt className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold">{t.term}</span>
                    {!staff && t.learned && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        <Icon name="check" className="mr-1 inline size-3" />
                        o‘rganilgan
                      </span>
                    )}
                  </dt>
                  <dd className="space-y-2">
                    <TermBody definition={t.definition} example={t.example} />
                    {t.lessonId && t.lessonTitle && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Dars:{' '}
                        <Link
                          href={
                            staff
                              ? `${base}/manage/lessons/${t.lessonId}`
                              : `${base}/lessons/${t.lessonId}`
                          }
                          className="underline hover:text-brand-700 dark:hover:text-brand-300"
                        >
                          {t.lessonTitle}
                        </Link>
                      </p>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </>
  );
}
