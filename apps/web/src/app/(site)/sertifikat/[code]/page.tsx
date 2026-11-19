import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrintButton } from '@/components/certificate-ui';
import { Icon } from '@/components/icons';
import { getCertificate, SITE_NAME, SITE_URL } from '@/lib/catalog';

type Props = { params: Promise<{ code: string }> };

// Certificates carry a person's name: verifiable by code, never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCertificate((await params).code);
  return {
    title: c ? `Sertifikat ${c.code} — ${SITE_NAME}` : `Sertifikat topilmadi — ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

const date = (iso: string) =>
  new Date(iso).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Tashkent',
  });

export default async function CertificatePage({ params }: Props) {
  const c = await getCertificate((await params).code);
  if (!c) notFound();
  const url = `${SITE_URL}/sertifikat/${c.code}`;
  return (
    <div className="container-page space-y-6 py-10 sm:py-14">
      {/* Print just the certificate, on one landscape A4 page. */}
      <style>{`@media print {
  @page { size: A4 landscape; margin: 0; }
  body * { visibility: hidden; }
  .certificate, .certificate * { visibility: visible; }
  header:not(.certificate *), footer:not(.certificate *), .btn, [role='status'] { display: none !important; }
  .certificate { position: fixed; inset: 0; margin: 0; width: 100vw; max-width: none; height: 100vh; aspect-ratio: auto; border-radius: 0; box-shadow: none; }
}`}</style>

      <div
        role="status"
        className={`flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4 print:hidden ${
          c.revoked
            ? 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-100'
            : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100'
        }`}
      >
        <Icon name={c.revoked ? 'circleX' : 'checkCircle'} className="size-6 shrink-0" />
        <p>
          {c.revoked ? (
            <>
              <strong>Bu sertifikat bekor qilingan.</strong>
              {c.revokedReason && <> Sabab: {c.revokedReason}</>}
            </>
          ) : (
            <>
              <strong>Sertifikat haqiqiy.</strong> {SITE_NAME} platformasida berilgan va bekor
              qilinmagan.
            </>
          )}
        </p>
      </div>

      <article
        aria-label="Sertifikat"
        className="certificate relative mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-6 overflow-hidden sm:aspect-[297/210] sm:gap-0 rounded-3xl border-[10px] border-double border-brand-600 bg-white p-[5%] text-center text-slate-900 shadow-xl"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brand-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 size-56 rounded-full border-[18px] border-accent-300"
        />
        <header className="relative space-y-2">
          <p className="text-sm font-bold tracking-[0.3em] text-brand-700 uppercase sm:text-base">
            {SITE_NAME}
          </p>
          <h1 className="text-3xl font-extrabold tracking-wide text-slate-900 uppercase sm:text-5xl">
            Sertifikat
          </h1>
          <p className="text-sm text-slate-600 sm:text-lg">kursni muvaffaqiyatli tugatgani uchun</p>
        </header>
        <div className="relative space-y-3">
          <p className="text-2xl font-bold break-words text-brand-800 sm:text-4xl">{c.fullName}</p>
          <p className="text-sm sm:text-lg">
            «<strong>{c.courseTitle}</strong>» kursining {c.lessons} ta darsini to‘liq o‘zlashtirdi.
          </p>
          <p className="text-xs text-slate-600 sm:text-base">{c.organizationName}</p>
        </div>
        <footer className="relative grid w-full grid-cols-2 items-end gap-4 text-left text-[10px] sm:text-sm">
          <div>
            <p className="text-slate-500">Berilgan sana</p>
            <p className="font-semibold">{date(c.issuedAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">Tekshirish kodi</p>
            <p className="font-mono font-semibold">{c.code}</p>
            <p className="break-all text-slate-500">{url.replace(/^https?:\/\//, '')}</p>
          </div>
        </footer>
        {c.revoked && (
          <p
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-6xl font-black tracking-widest text-rose-600/25 uppercase sm:text-8xl"
            style={{ transform: 'rotate(-20deg)' }}
          >
            Bekor qilingan
          </p>
        )}
      </article>

      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        {!c.revoked && <PrintButton />}
        <Link href="/sertifikat" className="btn btn-outline">
          Boshqa sertifikatni tekshirish
        </Link>
      </div>
    </div>
  );
}
