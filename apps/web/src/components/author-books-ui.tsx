import type { PublicBook } from '@webdizayn/shared';
import Link from 'next/link';
import { Icon } from './icons';

/** Where "read" leads: the reader when signed in, otherwise sign-in and back to the reader. */
export function readHref(id: string, signedIn: boolean) {
  const reader = `/kitoblar/${id}`;
  return signedIn ? reader : `/login?next=${encodeURIComponent(reader)}`;
}

export function bookFacts(b: PublicBook): string {
  return [b.author, b.publisher, b.year, b.pageCount ? `${b.pageCount} bet` : null]
    .filter(Boolean)
    .join(' · ');
}

/** Cover from the public API (served as an image, the PDF itself is never available). */
export function BookCover({
  id,
  title,
  className = '',
}: {
  id: string;
  title: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- API image, already sized on the server
    <img
      src={`/api/public/books/${id}/cover`}
      alt={`«${title}» muqovasi`}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`aspect-[3/4] w-full rounded-xl border border-line bg-subtle object-cover shadow-card ${className}`}
    />
  );
}

export function AuthorBookCard({ b }: { b: PublicBook }) {
  return (
    <article className="card card-hover relative flex h-full flex-col gap-4 p-5 focus-within:border-brand-500 sm:flex-row">
      <div className="w-32 shrink-0 self-center sm:self-start">
        <BookCover id={b.id} title={b.title} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="text-heading font-semibold">
          <Link
            href={`/muallif-kitoblari/${b.id}`}
            className="after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none"
          >
            {b.title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-muted">{bookFacts(b)}</p>
        {b.description && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">{b.description}</p>
        )}
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-sm font-semibold text-brand-700 dark:text-brand-300">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="book" className="size-4" />
            Onlayn o&apos;qish
          </span>
          {b.searchable && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Icon name="search" className="size-4" />
              Ichidan qidirish
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
