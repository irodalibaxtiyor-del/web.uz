'use client';

import type { PublicPortfolio } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Achievements,
  CompletedCourses,
  PortfolioItemCard,
  Skills,
} from '@/components/portfolio-ui';
import { LoadState } from '@/components/ui';
import { useApi } from '@/lib/use-api';

/** Public portfolio. The API returns 404 for unknown and unpublished slugs alike. */
export default function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const base = `/portfolio/public/${encodeURIComponent(slug)}`;
  const { state } = useApi<PublicPortfolio>(base);

  return (
    <div className="min-h-full bg-surface/70 dark:bg-slate-950">
      <div className="container-page max-w-5xl py-10">
        {state.kind === 'error' && state.status === 404 ? (
          <section className="card space-y-3 p-8 text-center">
            <h1 className="text-2xl font-bold">Portfolio topilmadi</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Bunday portfolio yo‘q yoki egasi uni hali e’lon qilmagan.
            </p>
            <Link href="/" className="btn btn-primary">
              Bosh sahifaga
            </Link>
          </section>
        ) : (
          <LoadState state={state}>{(p) => <Portfolio p={p} base={base} />}</LoadState>
        )}
      </div>
    </div>
  );
}

function Portfolio({ p, base }: { p: PublicPortfolio; base: string }) {
  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-10 text-white sm:px-10">
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-10 size-56 rounded-full bg-white/10"
        />
        <div className="relative flex flex-wrap items-center gap-6">
          <span
            aria-hidden="true"
            className="grid size-20 place-items-center rounded-full bg-accent-400 font-display text-3xl font-bold text-ink"
          >
            {initials(p.displayName)}
          </span>
          <div className="space-y-2">
            <p className="text-sm tracking-wide text-white/75 uppercase">Portfolio</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{p.displayName}</h1>
            {p.headline && <p className="text-lg text-white/90">{p.headline}</p>}
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {p.bio && (
            <section className="card space-y-3 p-6" aria-labelledby="bio-h">
              <h2 id="bio-h" className="text-xl font-bold">
                Men haqimda
              </h2>
              <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">{p.bio}</p>
            </section>
          )}
          <section className="space-y-4" aria-labelledby="works-h">
            <h2 id="works-h" className="text-2xl font-bold">
              Ishlarim
            </h2>
            {p.items.length === 0 ? (
              <p className="text-slate-500">Hali ishlar qo‘shilmagan.</p>
            ) : (
              p.items.map((item) => (
                <PortfolioItemCard
                  key={item.id}
                  item={item}
                  detailPath={`${base}/items/${item.id}`}
                />
              ))
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {p.skills.length > 0 && (
            <section className="card space-y-3 p-5" aria-labelledby="skills-h">
              <h2 id="skills-h" className="text-lg font-bold">
                Ko‘nikmalar
              </h2>
              <Skills list={p.skills} />
            </section>
          )}
          <section className="card space-y-3 p-5" aria-labelledby="ach-h">
            <h2 id="ach-h" className="text-lg font-bold">
              Yutuqlar
            </h2>
            <Achievements list={p.achievements} />
          </section>
          <section className="card space-y-3 p-5" aria-labelledby="courses-h">
            <h2 id="courses-h" className="text-lg font-bold">
              Tugatilgan kurslar
            </h2>
            <CompletedCourses list={p.completedCourses} />
          </section>
          <p className="text-sm text-slate-500">
            Yutuqlar va kurslar WEBDIZAYN.UZ tomonidan avtomatik tasdiqlangan.
          </p>
        </aside>
      </div>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}
