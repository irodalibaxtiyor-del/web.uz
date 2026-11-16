import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookCover, bookFacts, readHref } from '@/components/author-books-ui';
import { Crumbs, Paragraphs } from '@/components/catalog-ui';
import { Icon } from '@/components/icons';
import { getAuthorBook, SITE_NAME, SITE_URL } from '@/lib/catalog';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getAuthorBook((await params).id);
  if (!b) return { title: `Kitob topilmadi — ${SITE_NAME}`, robots: { index: false } };
  const title = `${b.title} — ${SITE_NAME}`;
  const description = b.description.slice(0, 200) || bookFacts(b);
  const url = `${SITE_URL}/muallif-kitoblari/${b.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, locale: 'uz_UZ', type: 'book' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function AuthorBookPage({ params }: Props) {
  const b = await getAuthorBook((await params).id);
  if (!b) notFound();
  // Only picks the button; the reader itself checks the session and access.
  const signedIn = (await cookies()).has('wd_session');
  const facts: [string, string | number | null][] = [
    ['Muallif', b.author || null],
    ['Nashriyot', b.publisher || null],
    ['Yili', b.year],
    ['Betlar', b.pageCount || null],
    ['ISBN', b.isbn || null],
  ];
  return (
    <div className="container-page py-12 sm:py-16">
      <Crumbs
        items={[
          { href: '/', label: 'Bosh sahifa' },
          { href: '/muallif-kitoblari', label: 'Muallif kitoblari' },
          { label: b.title },
        ]}
      />
      <div className="grid gap-10 md:grid-cols-[16rem_1fr]">
        <div className="mx-auto w-48 md:w-full">
          <BookCover id={b.id} title={b.title} />
        </div>
        <div className="min-w-0 space-y-6">
          <h1 className="text-title font-bold">{b.title}</h1>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
            {facts
              .filter(([, v]) => v !== null)
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-sm font-semibold text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          <div className="flex flex-wrap gap-3">
            <Link href={readHref(b.id, signedIn)} className="btn btn-primary px-6 py-3 text-base">
              <Icon name="book" className="size-5" />
              {signedIn ? "Onlayn o'qish" : "Kirib o'qish"}
            </Link>
            {!signedIn && (
              <Link
                href={`/register?next=${encodeURIComponent(`/kitoblar/${b.id}`)}`}
                className="btn btn-outline px-6 py-3 text-base"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            )}
          </div>
          {!signedIn && (
            <p className="text-sm text-muted">
              Kitob bepul o&apos;qiladi — faqat saytga kirish kerak. U yuklab olinmaydi, saytning
              o&apos;zida varaqlab o&apos;qiladi.
            </p>
          )}
          {b.description && (
            <section className="space-y-3">
              <h2 className="text-heading font-semibold">Kitob haqida</h2>
              <Paragraphs text={b.description} />
            </section>
          )}
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Icon name="list" className="size-4 text-brand-700 dark:text-brand-300" />
              Mundarija, betga o&apos;tish va qolgan joydan davom ettirish
            </li>
            {b.searchable && (
              <li className="flex items-center gap-2">
                <Icon name="search" className="size-4 text-brand-700 dark:text-brand-300" />
                Kitob ichidan so&apos;z bo&apos;yicha qidiruv (Ctrl+F), topilgan joy betda
                belgilanadi
              </li>
            )}
            <li className="flex items-center gap-2">
              <Icon name="phone" className="size-4 text-brand-700 dark:text-brand-300" />
              Telefonda ham qulay: bitta bet, suring yoki tugmalar bilan varaqlang
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
