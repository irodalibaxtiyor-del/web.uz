import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { CourseCard, Crumbs, Paragraphs } from '@/components/catalog-ui';
import { EmptyState } from '@/components/ui';
import { getDirection, SITE_NAME, SITE_URL } from '@/lib/catalog';

// One API call per request, shared by generateMetadata and the page.
const load = cache((slug: string) => getDirection(slug));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await load((await params).slug);
  if (!d) return { title: `Sahifa topilmadi — ${SITE_NAME}` };
  const title = `${d.title} — yo‘nalish | ${SITE_NAME}`;
  const url = `${SITE_URL}/yonalishlar/${d.slug}`;
  return {
    title,
    description: d.summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: d.summary,
      url,
      siteName: SITE_NAME,
      locale: 'uz_UZ',
      type: 'website',
    },
    twitter: { card: 'summary', title, description: d.summary },
  };
}

export default async function DirectionPage({ params }: Props) {
  const d = await load((await params).slug);
  if (!d) notFound();

  return (
    <div className="container-page py-12 sm:py-16">
      <Crumbs
        items={[
          { href: '/', label: 'Bosh sahifa' },
          { href: '/yonalishlar', label: 'Yo‘nalishlar' },
          { label: d.title },
        ]}
      />
      <header className="mb-8">
        <p className="section-eyebrow">Yo‘nalish</p>
        <h1 className="mt-2 text-title font-bold">{d.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted">{d.summary}</p>
      </header>
      <Paragraphs text={d.description} />

      <section aria-labelledby="courses-h" className="mt-12">
        <h2 id="courses-h" className="text-heading font-semibold">
          Kurslar
        </h2>
        {d.courses.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="Bu yo‘nalish bo‘yicha kurs tayyorlanmoqda"
              action={
                <Link href="/yonalishlar" className="btn btn-outline">
                  Boshqa yo‘nalishlar
                </Link>
              }
            >
              Kurs e’lon qilinganda shu yerda paydo bo‘ladi.
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {d.courses.map((c) => (
              <li key={c.slug}>
                <CourseCard c={c} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
