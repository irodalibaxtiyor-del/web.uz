import type { Metadata } from 'next';
import { Inter, Jost } from 'next/font/google';
import { cookies } from 'next/headers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

const body = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-body', display: 'swap' });
const heading = Jost({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WEBDIZAYN.UZ',
  description: "Web dizayn va web dasturlashni amalda o'rganish platformasi",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Presence only decides which nav buttons to show; every protected action is checked by the API.
  const hasSession = (await cookies()).has('wd_session');

  return (
    <html lang="uz" className={`${body.variable} ${heading.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card dark:focus:bg-slate-800"
        >
          Asosiy kontentga o&apos;tish
        </a>
        <SiteHeader hasSession={hasSession} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
