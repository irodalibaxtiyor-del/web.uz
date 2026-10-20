import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Crumbs, Paragraphs } from '@/components/catalog-ui';
import { Icon } from '@/components/icons';
import { countsLine, getPublicCourse, SITE_NAME, SITE_URL } from '@/lib/catalog';

const load = cache((slug: string) => getPublicCourse(slug));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await load((await params).slug);
  if (!c) return { title: `Sahifa topilmadi — ${SITE_NAME}` };
  const title = `${c.title} — ${SITE_NAME}`;
  const description = c.description || `${c.title}: ${countsLine(c.counts)}.`;
  const url = `${SITE_URL}/kurslar/${c.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, locale: 'uz_UZ', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function PublicCoursePage({ params }: Props) {
  const c = await load((await params).slug);
  if (!c) notFound();
  // Only decides which button to show; the course map itself checks the session and enrolment.
  const signedIn = (await cookies()).has('wd_session');
  const mapPath = `/orgs/${c.organizationId}/courses/${c.id}`;
  const primary = c.directions[0];

  return (
    <div className="container-page py-12 sm:py-16">
      <Crumbs
        items={[
          { href: '/', label: 'Bosh sahifa' },
          { href: '/yonalishlar', label: 'Yo‘nalishlar' },
          ...(primary ? [{ href: `/yonalishlar/${primary.slug}`, label: primary.title }] : []),
          { label: c.title },
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 lg:col-start-1">
          <header>
            <p className="section-eyebrow">Kurs</p>
            <h1 className="mt-2 text-title font-bold">{c.title}</h1>
            <p className="mt-3 text-muted">{countsLine(c.counts)}</p>
          </header>
          {c.description && (
            <div className="mt-6">
              <Paragraphs text={c.description} />
            </div>
          )}
        </div>

        {/* After the intro in the DOM, so phones see "start" before the long programme. */}
        <aside className="h-fit lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="card space-y-4 p-6">
            <p className="font-semibold text-ink dark:text-white">O‘qishni boshlash</p>
            <p className="text-sm text-muted">
              Darslar ketma-ket ochiladi. Mashqlarni bajarish va natijani saqlash uchun tizimga
              kiring.
            </p>
            {signedIn ? (
              <Link href={mapPath} className="btn btn-primary w-full">
                Kursni ochish <Icon name="arrowRight" className="size-4" />
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href={`/login?next=${encodeURIComponent(mapPath)}`}
                  className="btn btn-primary w-full"
                >
                  Kirish va boshlash
                </Link>
                <Link
                  href={`/register?next=${encodeURIComponent(mapPath)}`}
                  className="btn btn-outline w-full"
                >
                  Ro‘yxatdan o‘tish
                </Link>
              </div>
            )}
            {c.directions.length > 0 && (
              <div className="border-t border-line pt-4">
                <p className="text-sm text-muted">Yo‘nalishlar</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {c.directions.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/yonalishlar/${d.slug}`}
                        className="inline-flex min-h-9 items-center rounded-full border border-line px-3 text-sm hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300"
                      >
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1">
          <section aria-labelledby="program-h">
            <h2 id="program-h" className="text-heading font-semibold">
              Kurs dasturi
            </h2>
            <ol className="mt-5 space-y-4">
              {c.modules.map((m, mi) => (
                <li key={m.title + mi} className="card overflow-hidden">
                  <h3 className="border-b border-line px-5 py-4 font-semibold">
                    <span className="mb-0.5 block text-xs font-semibold tracking-wide text-muted uppercase">
                      {mi + 1}-modul
                    </span>
                    {m.title}
                  </h3>
                  <ol className="divide-y divide-line">
                    {m.lessons.map((l, li) => (
                      <li key={l + li} className="flex gap-3 px-5 py-3 text-sm">
                        <span
                          aria-hidden="true"
                          className="w-8 shrink-0 font-mono text-muted tabular-nums"
                        >
                          {mi + 1}.{li + 1}
                        </span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
