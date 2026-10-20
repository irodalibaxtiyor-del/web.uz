'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
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
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navigating closes the mobile menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Esc and a click/tap outside the header close the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

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
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b bg-panel/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-colors ${
        scrolled || open ? 'border-line' : 'border-transparent'
      }`}
    >
      <nav
        className="container-page flex h-16 items-center justify-between gap-6 lg:h-18"
        aria-label="Asosiy"
      >
        <Logo />
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={n.href === pathname ? 'page' : undefined}
                className="text-[15px] font-medium text-ink transition-colors hover:text-brand-700 aria-[current=page]:text-brand-700 dark:text-slate-200 dark:hover:text-brand-300 dark:aria-[current=page]:text-brand-300"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 lg:flex">{actions}</div>
        <button
          ref={toggleRef}
          type="button"
          className="grid size-11 place-items-center rounded-control border border-line text-ink lg:hidden dark:text-white"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'x' : 'menu'} />
        </button>
      </nav>
      <div id="mobile-menu" hidden={!open} className="border-t border-line lg:hidden">
        <ul className="container-page max-h-[calc(100dvh-4rem)] space-y-1 overflow-y-auto py-3">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={n.href === pathname ? 'page' : undefined}
                className="flex min-h-11 items-center rounded-control px-3 font-medium text-ink hover:bg-subtle aria-[current=page]:bg-subtle dark:text-slate-200"
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li className="flex flex-wrap gap-3 pt-3 pb-1" onClick={() => setOpen(false)}>
            {actions}
          </li>
        </ul>
      </div>
    </header>
  );
}
