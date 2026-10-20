import { cookies } from 'next/headers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

/** Public pages: marketing header, normal page scroll, footer. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Presence only decides which nav buttons to show; every protected action is checked by the API.
  const hasSession = (await cookies()).has('wd_session');
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader hasSession={hasSession} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
