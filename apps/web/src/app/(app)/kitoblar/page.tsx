'use client';

import type { BookSummary } from '@webdizayn/shared';
import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { EmptyState, LoadState, PageHeader, ProgressBar, inputClass } from '@/components/ui';
import { BOOK_SORTS, collator, filterBooks, type BookSort as Sort } from '@/lib/books';
import { useApi } from '@/lib/use-api';

export default function BooksPage() {
  const { state } = useApi<BookSummary[]>('/books');
  const id = useId();
  const [q, setQ] = useState('');
  const [direction, setDirection] = useState('');
  const [sort, setSort] = useState<Sort>('recent');

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="Elektron darslik"
        subtitle="Darsliklarni sayt ichida, kitob ko‘rinishida o‘qing. Oxirgi o‘qigan betingiz eslab qolinadi."
      />
      <LoadState state={state} skeleton={<BooksSkeleton />}>
        {(books) => (
          <BooksView
            books={books}
            id={id}
            q={q}
            setQ={setQ}
            direction={direction}
            setDirection={setDirection}
            sort={sort}
            setSort={setSort}
          />
        )}
      </LoadState>
    </>
  );
}

function BooksView({
  books,
  id,
  q,
  setQ,
  direction,
  setDirection,
  sort,
  setSort,
}: {
  books: BookSummary[];
  id: string;
  q: string;
  setQ: (v: string) => void;
  direction: string;
  setDirection: (v: string) => void;
  sort: Sort;
  setSort: (v: Sort) => void;
}) {
  const directions = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of books) if (b.direction) m.set(b.direction.slug, b.direction.title);
    return [...m].sort((a, b) => collator.compare(a[1], b[1]));
  }, [books]);
  const shown = useMemo(() => filterBooks(books, q, direction, sort), [books, q, direction, sort]);

  if (books.length === 0) {
    return (
      <EmptyState title="Hozircha darslik yo‘q">
        Administrator darslik qo‘shganda u shu yerda paydo bo‘ladi.
      </EmptyState>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]" role="search">
        <div className="space-y-1">
          <label htmlFor={`${id}-q`} className="text-sm font-medium">
            Qidirish
          </label>
          <div className="relative">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            />
            <input
              id={`${id}-q`}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nomi, muallifi yoki tavsifi"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-dir`} className="text-sm font-medium">
            Yo‘nalish
          </label>
          <select
            id={`${id}-dir`}
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className={inputClass}
          >
            <option value="">Hammasi</option>
            {directions.map(([slug, title]) => (
              <option key={slug} value={slug}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-sort`} className="text-sm font-medium">
            Saralash
          </label>
          <select
            id={`${id}-sort`}
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={inputClass}
          >
            {BOOK_SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-sm text-muted" role="status">
        {shown.length} ta darslik
      </p>
      {shown.length === 0 ? (
        <EmptyState title="Hech narsa topilmadi">
          Boshqa so‘z bilan qidirib ko‘ring yoki filtrni olib tashlang.
        </EmptyState>
      ) : (
        <ul className="grid gap-6 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {shown.map((b) => (
            <li key={b.id}>
              <BookCard book={b} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BookCard({ book: b }: { book: BookSummary }) {
  const href = `/kitoblar/${b.id}`;
  return (
    <article className="card card-hover relative flex h-full flex-col overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden border-b border-line bg-subtle">
        {/* Cover is a small preview; the pages themselves are never plain images. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- session-protected API image */}
        <img
          src={`/api/books/${b.id}/cover`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="size-full object-cover select-none"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {b.direction && <p className="section-eyebrow">{b.direction.title}</p>}
        <h2 className="font-display text-lg leading-snug font-semibold">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {b.title}
          </Link>
        </h2>
        <p className="text-sm text-muted">
          {[b.author, b.year, `${b.pageCount} bet`].filter(Boolean).join(' · ')}
        </p>
        {b.description && <p className="line-clamp-3 text-sm">{b.description}</p>}
        <div className="mt-auto space-y-3 pt-3">
          {b.progress && (
            <div className="space-y-1">
              <ProgressBar percent={b.progress.percent} label={`${b.title}: o‘qilgan qismi`} />
              <p className="text-xs text-muted">
                {b.progress.page}-bet · {b.progress.percent}%
              </p>
            </div>
          )}
          <span className="btn btn-primary w-full" aria-hidden="true">
            <Icon name="book" className="size-4" />
            {b.progress ? 'Davom ettirish' : 'O‘qish'}
          </span>
        </div>
      </div>
    </article>
  );
}

function BooksSkeleton() {
  return (
    <div role="status" className="grid gap-6 xs:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Yuklanmoqda…</span>
      {[0, 1, 2].map((i) => (
        <div key={i} aria-hidden="true" className="card overflow-hidden">
          <div className="skeleton aspect-[3/4] rounded-none" />
          <div className="space-y-2 p-5">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
