'use client';

import type { MeResponse } from '@webdizayn/shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useApi } from '@/lib/use-api';
import { SIDEBAR_COOKIE } from '@/lib/shell';
import { Icon, type IconName } from './icons';
import { Logo } from './logo';

type NavItem = { href: string; label: string; icon: IconName };
type NavSection = { title?: string; items: NavItem[] };

const PERSONAL: NavItem[] = [
  { href: '/dashboard', label: 'Kabinet', icon: 'dashboard' },
  { href: '/analytics', label: 'Natijalarim', icon: 'chart' },
  { href: '/portfolio', label: 'Portfolio', icon: 'briefcase' },
  { href: '/playground', label: 'Playground', icon: 'code' },
];

/** Sidebar sections: personal pages first, then staff tools per organization. */
function sectionsFor(me: MeResponse | null): NavSection[] {
  const sections: NavSection[] = [{ items: PERSONAL }];
  for (const m of me?.memberships ?? []) {
    if (m.role === 'STUDENT') continue;
    const base = `/orgs/${m.organizationId}`;
    const items: NavItem[] = [{ href: `${base}/groups`, label: 'Guruh paneli', icon: 'users' }];
    if (m.role === 'ORG_ADMIN') {
      items.push(
        { href: `${base}/admin/groups`, label: 'Guruhlar', icon: 'school' },
        { href: `${base}/admin/students`, label: 'Talabalar', icon: 'user' },
        { href: `${base}/admin/teachers`, label: 'O‘qituvchilar', icon: 'users' },
        { href: `${base}/analytics`, label: 'Tashkilot analitikasi', icon: 'chart' },
      );
    }
    sections.push({ title: m.organizationName, items });
  }
  return sections;
}

function isActive(pathname: string, href: string) {
  return href === '/dashboard'
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/');
}

const DESKTOP = '(min-width: 1024px)';
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

function saveCollapsed(collapsed: boolean) {
  document.cookie = `${SIDEBAR_COOKIE}=${collapsed ? 'collapsed' : 'expanded'}; path=/; max-age=31536000; SameSite=Lax`;
}

export function AppShell({
  initialCollapsed,
  children,
}: {
  initialCollapsed: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { state } = useApi<MeResponse>('/auth/me');
  const me = state.kind === 'ready' ? state.data : null;
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [drawer, setDrawer] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  // Below lg the sidebar is an off-canvas drawer: keep it out of the tab order while closed.
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
  const drawerToggleRef = useRef<HTMLButtonElement>(null);

  // Route change: close the drawer and start the new page at the top of the content area
  // (Next only resets the window scroll, and here only <main> scrolls).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setDrawer(false);
  }
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawer(false);
        drawerToggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawer]);

  function toggleCollapsed() {
    setCollapsed((c) => {
      saveCollapsed(!c);
      return !c;
    });
  }

  const sections = sectionsFor(me);

  return (
    <div className="app-shell flex flex-col overflow-hidden bg-canvas">
      <header className="z-30 shrink-0 border-b border-line bg-panel pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center gap-2 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(0.5rem,env(safe-area-inset-left))] sm:gap-3">
          <button
            ref={drawerToggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-control text-ink hover:bg-subtle lg:hidden dark:text-white"
            aria-expanded={drawer}
            aria-controls="app-sidebar"
            aria-label={drawer ? 'Menyuni yopish' : 'Menyuni ochish'}
            onClick={() => setDrawer((d) => !d)}
          >
            <Icon name={drawer ? 'x' : 'menu'} />
          </button>
          <button
            type="button"
            className="hidden size-11 place-items-center rounded-control text-muted hover:bg-subtle hover:text-ink xl:grid dark:hover:text-white"
            aria-pressed={collapsed}
            aria-controls="app-sidebar"
            aria-label={collapsed ? 'Yon menyuni yoyish' : 'Yon menyuni yig‘ish'}
            title={collapsed ? 'Yon menyuni yoyish' : 'Yon menyuni yig‘ish'}
            onClick={toggleCollapsed}
          >
            <Icon name={collapsed ? 'sidebarExpand' : 'sidebarCollapse'} />
          </button>
          <Logo className="ml-1 text-lg" />
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <FullscreenButton />
            {me && (
              <span className="hidden max-w-48 truncate text-sm font-medium text-ink md:block dark:text-white">
                {me.fullName}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {drawer && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
            onClick={() => setDrawer(false)}
          />
        )}
        <aside
          id="app-sidebar"
          aria-label="Kabinet bo‘limlari"
          className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-line bg-panel pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] transition-transform duration-200 lg:static lg:z-auto lg:max-w-none lg:translate-x-0 lg:pt-0 lg:transition-[width] ${
            drawer ? 'translate-x-0' : '-translate-x-full'
          } lg:w-[4.5rem] ${collapsed ? 'xl:w-[4.5rem]' : 'xl:w-64'}`}
          data-collapsed={collapsed ? 'true' : 'false'}
          inert={!desktop && !drawer}
        >
          <div className="flex h-14 items-center justify-between border-b border-line px-3 lg:hidden">
            <Logo className="text-lg" />
            <button
              type="button"
              className="grid size-11 place-items-center rounded-control text-muted hover:bg-subtle"
              aria-label="Menyuni yopish"
              onClick={() => setDrawer(false)}
            >
              <Icon name="x" />
            </button>
          </div>
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Kabinet">
            {sections.map((s, i) => (
              <div key={s.title ?? i} className="space-y-1">
                {s.title && (
                  <p className="sidebar-label px-3 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">
                    {s.title}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {s.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={item.label}
                          aria-current={active ? 'page' : undefined}
                          className="flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium text-fg hover:bg-subtle hover:text-ink aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800 dark:hover:text-white dark:aria-[current=page]:bg-brand-950 dark:aria-[current=page]:text-brand-200"
                        >
                          <Icon name={item.icon} className="size-5" />
                          <span className="sidebar-label truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main
          id="main"
          ref={mainRef}
          tabIndex={-1}
          className="min-w-0 flex-1 overflow-y-auto overscroll-contain focus:outline-none"
        >
          <div className="container-page max-w-6xl py-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

const subscribeFullscreen = (cb: () => void) => {
  document.addEventListener('fullscreenchange', cb);
  return () => document.removeEventListener('fullscreenchange', cb);
};

/** Toggles browser full screen; hidden where the Fullscreen API is unavailable (iOS Safari). */
function FullscreenButton() {
  const supported = useSyncExternalStore(
    subscribeFullscreen,
    () => document.fullscreenEnabled,
    () => false,
  );
  const active = useSyncExternalStore(
    subscribeFullscreen,
    () => document.fullscreenElement !== null,
    () => false,
  );

  if (!supported) return null;
  return (
    <button
      type="button"
      className="grid size-11 place-items-center rounded-control text-muted hover:bg-subtle hover:text-ink dark:hover:text-white"
      aria-pressed={active}
      aria-label={active ? 'To‘liq ekrandan chiqish' : 'To‘liq ekran'}
      title={active ? 'To‘liq ekrandan chiqish' : 'To‘liq ekran'}
      onClick={() => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen().catch(() => undefined);
      }}
    >
      <Icon name={active ? 'minimize' : 'maximize'} />
    </button>
  );
}
