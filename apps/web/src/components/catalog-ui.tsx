import type { DirectionSummary, PublicCourseSummary } from '@webdizayn/shared';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { countsLine } from '@/lib/catalog';
import { Icon, type IconName } from './icons';

/** Coloured icon tile per direction (Loms style). Unknown slugs fall back to a neutral tile. */
const DIRECTION_LOOK: Record<string, { icon: IconName; tone: string }> = {
  html: {
    icon: 'html',
    tone: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  },
  css: { icon: 'css', tone: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300' },
  javascript: {
    icon: 'js',
    tone: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  },
  'flexbox-va-grid': {
    icon: 'grid',
    tone: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400',
  },
  'moslashuvchan-dizayn': {
    icon: 'phone',
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  },
  'ui-asoslari': {
    icon: 'palette',
    tone: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
  },
  'figmadan-kodga': {
    icon: 'figma',
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
  },
  portfolio: {
    icon: 'briefcase',
    tone: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400',
  },
  bootstrap: {
    icon: 'bootstrap',
    tone: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  },
  php: {
    icon: 'php',
    tone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
  },
};

const FALLBACK_LOOK = {
  icon: 'book' as IconName,
  tone: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
};

export function DirectionIcon({
  slug,
  className = 'size-14',
}: {
  slug: string;
  className?: string;
}) {
  const look = DIRECTION_LOOK[slug] ?? FALLBACK_LOOK;
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-xl ${look.tone} ${className}`}
    >
      <Icon name={look.icon} className="size-7" />
    </span>
  );
}

/** Breadcrumb for public catalogue pages. The last crumb is the current page (not a link). */
export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((c, i) => (
          <li key={`${i}-${c.label}`} className="flex items-center gap-1">
            {c.href ? (
              <Link
                href={c.href}
                className="hover:text-brand-700 hover:underline dark:hover:text-brand-300"
              >
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink dark:text-white">
                {c.label}
              </span>
            )}
            {i < items.length - 1 && <Icon name="chevronRight" className="size-3.5" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Whole-card link ("stretched link"): the title link's ::after covers the card, so there is
 * exactly one link per card for keyboard and screen-reader users, yet the card is clickable.
 */
function CardLink({
  href,
  title,
  lead,
  children,
}: {
  href: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="card card-hover relative flex h-full flex-col p-6 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200 dark:focus-within:ring-brand-900">
      {lead && <div className="mb-4">{lead}</div>}
      <h3 className="text-heading font-semibold">
        <Link
          href={href}
          className="after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none"
        >
          {title}
        </Link>
      </h3>
      {children}
    </article>
  );
}

export function DirectionCard({ d }: { d: DirectionSummary }) {
  return (
    <CardLink
      href={`/yonalishlar/${d.slug}`}
      title={d.title}
      lead={<DirectionIcon slug={d.slug} />}
    >
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{d.summary}</p>
      <p className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm font-semibold">
        <span className={d.courseCount > 0 ? 'text-ink dark:text-white' : 'text-muted'}>
          {d.courseCount > 0 ? `${d.courseCount} ta kurs` : 'Kurslar tayyorlanmoqda'}
        </span>
        <Icon name="arrowRight" className="size-4 text-brand-700 dark:text-brand-300" />
      </p>
    </CardLink>
  );
}

export function CourseCard({ c }: { c: PublicCourseSummary }) {
  return (
    <CardLink href={`/kurslar/${c.slug}`} title={c.title}>
      {c.description && (
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {c.description}
        </p>
      )}
      <p className="mt-5 border-t border-line pt-4 text-sm text-muted">{countsLine(c.counts)}</p>
    </CardLink>
  );
}

/** Plain-text paragraphs (blank line separated); rendered as text, never as HTML. */
export function Paragraphs({ text }: { text: string }) {
  return (
    <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-fg">
      {text
        .split(/\n\s*\n/)
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i}>{p.trim()}</p>
        ))}
    </div>
  );
}
