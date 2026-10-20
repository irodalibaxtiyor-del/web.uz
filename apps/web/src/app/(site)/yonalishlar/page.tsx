import type { Metadata } from 'next';
import { Crumbs, DirectionCard } from '@/components/catalog-ui';
import { getDirections, SITE_NAME, SITE_URL } from '@/lib/catalog';

const TITLE = 'Yo‘nalishlar';
const DESCRIPTION =
  'HTML, CSS, JavaScript, moslashuvchan dizayn, UI, Figma’dan kodga, portfolio, Bootstrap va PHP — ' +
  'o‘zbek tilidagi amaliy kurslar yo‘nalishlari.';

export const metadata: Metadata = {
  title: `${TITLE} — ${SITE_NAME}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/yonalishlar` },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/yonalishlar`,
    siteName: SITE_NAME,
    locale: 'uz_UZ',
    type: 'website',
  },
};

export default async function DirectionsPage() {
  const directions = (await getDirections()) ?? [];
  return (
    <div className="container-page py-12 sm:py-16">
      <Crumbs items={[{ href: '/', label: 'Bosh sahifa' }, { label: TITLE }]} />
      <header className="max-w-3xl">
        <h1 className="text-title font-bold">{TITLE}</h1>
        <p className="mt-3 text-lg text-muted">
          Qaysi sohani o‘rganmoqchi ekaningizni tanlang. Har bir yo‘nalishda darslar ketma-ket
          ochiladi va har darsdan keyin amaliy mashq bor.
        </p>
      </header>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {directions.map((d) => (
          <li key={d.slug}>
            <DirectionCard d={d} />
          </li>
        ))}
      </ul>
    </div>
  );
}
