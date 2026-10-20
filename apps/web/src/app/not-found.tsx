import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NotFoundView } from '@/components/not-found-view';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Sahifa topilmadi — WEBDIZAYN.UZ',
  robots: { index: false },
};

/** 404 for URLs that match no route at all (rendered in the root layout only). */
export default async function NotFound() {
  const hasSession = (await cookies()).has('wd_session');
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader hasSession={hasSession} />
      <main id="main" className="flex-1">
        <NotFoundView />
      </main>
      <SiteFooter />
    </div>
  );
}
