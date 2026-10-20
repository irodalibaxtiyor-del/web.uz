import type { Metadata } from 'next';
import { NotFoundView } from '@/components/not-found-view';

export const metadata: Metadata = {
  title: 'Sahifa topilmadi — WEBDIZAYN.UZ',
  robots: { index: false },
};

/** 404 inside the public site (keeps the site header and footer). */
export default function SiteNotFound() {
  return <NotFoundView />;
}
