import type { Metadata, Viewport } from 'next';
import { Inter, Jost } from 'next/font/google';
import { cookies } from 'next/headers';
import { ChatWidget } from '@/components/chat-widget';
import { DialogHost } from '@/components/dialog';
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

// `viewport-fit=cover` lets the layout use env(safe-area-inset-*) on notched phones.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Reading cookies keeps every page dynamic, which the per-request CSP nonce (proxy.ts) needs.
  await cookies();

  return (
    <html lang="uz" className={`${body.variable} ${heading.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card dark:focus:bg-slate-800"
        >
          Asosiy kontentga o&apos;tish
        </a>
        {children}
        <ChatWidget />
        <DialogHost />
      </body>
    </html>
  );
}
