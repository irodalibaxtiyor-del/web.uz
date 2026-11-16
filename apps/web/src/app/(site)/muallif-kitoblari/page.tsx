import type { Metadata } from 'next';
import { AuthorBookCard } from '@/components/author-books-ui';
import { Crumbs } from '@/components/catalog-ui';
import { Icon } from '@/components/icons';
import { getAuthorBooks, SITE_NAME, SITE_URL } from '@/lib/catalog';

const TITLE = 'Muallif kitoblari';
const DESCRIPTION =
  "Muallifning nashr etilgan kitoblari: onlayn o'qish, mundarija va kitob ichidan qidiruv bilan.";

export const metadata: Metadata = {
  title: `${TITLE} — ${SITE_NAME}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/muallif-kitoblari` },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/muallif-kitoblari`,
    siteName: SITE_NAME,
    locale: 'uz_UZ',
    type: 'website',
  },
};

export default async function AuthorBooksPage() {
  const books = (await getAuthorBooks()) ?? [];
  return (
    <div className="container-page py-12 sm:py-16">
      <Crumbs items={[{ href: '/', label: 'Bosh sahifa' }, { label: TITLE }]} />
      <header className="max-w-3xl">
        <span className="section-eyebrow">Kitoblar</span>
        <h1 className="mt-4 text-title font-bold">{TITLE}</h1>
        <p className="mt-4 text-lg leading-relaxed">{DESCRIPTION}</p>
      </header>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        {[
          ['book', "Saytning o'zida, varaqlab o'qiladi"],
          ['search', "Kitob ichidan so'z bo'yicha qidiruv"],
          ['list', 'Mundarija va o‘qilgan joyni eslab qolish'],
        ].map(([icon, text]) => (
          <li key={text} className="flex items-center gap-2">
            <Icon name={icon as 'book'} className="size-4 text-brand-700 dark:text-brand-300" />
            {text}
          </li>
        ))}
      </ul>
      {books.length === 0 ? (
        <p className="mt-12 rounded-card border border-dashed border-line-strong px-6 py-10 text-center text-muted">
          Kitoblar tez orada joylanadi.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {books.map((b) => (
            <li key={b.id}>
              <AuthorBookCard b={b} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
