'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from './logo';

const NAV = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/#yonalishlar', label: "Yo'nalishlar" },
  { href: '/#qanday', label: "Qanday o'qiladi" },
  { href: '/#afzalliklar', label: 'Afzalliklar' },
  { href: '/playground', label: 'Playground' },
];

export function SiteHeader({ hasSession }: { hasSession: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const actions = hasSession ? (
    <Link href="/dashboard" className="btn btn-primary">
      Shaxsiy kabinet
    </Link>
  ) : (
    <>
      <Link href="/login" className="btn btn-outline">
        Kirish
      </Link>
      <Link href="/register" className="btn btn-primary">
        Ro&apos;yxatdan o&apos;tish
      </Link>
    </>
  );

  return (
    <>
      <div className="bg-brand-600 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <p>
            Web dizaynni amalda o&apos;rganing: har bir dars mashq va tekshiruv bilan.{' '}
            <Link href="/register" className="font-semibold underline-offset-4 hover:underline">
              Bepul boshlash →
            </Link>
          </p>
          <p className="hidden text-white/80 md:block">O&apos;zbek tilida · Ketma-ket darslar</p>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur transition-shadow dark:bg-slate-950/90 ${
          scrolled
            ? 'border-slate-200 shadow-[0_6px_20px_-12px_rgb(14_17_51/0.25)] dark:border-slate-800'
            : 'border-transparent'
        }`}
      >
        <nav
          className="container-page flex h-18 items-center justify-between gap-6"
          aria-label="Asosiy"
        >
          <Logo />
          <ul className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-[15px] font-medium text-ink transition-colors hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-3 lg:flex">{actions}</div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg border border-slate-200 lg:hidden dark:border-slate-700"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>
        {open && (
          <div
            id="mobile-menu"
            className="border-t border-slate-200 lg:hidden dark:border-slate-800"
          >
            <ul className="container-page space-y-1 py-4">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 font-medium text-ink hover:bg-surface dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="flex flex-wrap gap-3 pt-3" onClick={() => setOpen(false)}>
                {actions}
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
