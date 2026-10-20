'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { api } from '@/lib/api';
import { confirmDialog } from './dialog';
import { Icon, type IconName } from './icons';

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: '/dashboard', label: 'Kabinet', icon: 'dashboard' },
  { href: '/analytics', label: 'Natija', icon: 'chart' },
  { href: '/portfolio', label: 'Portfolio', icon: 'briefcase' },
];

const HOVER_CLOSE_MS = 180;

/**
 * "Shaxsiy kabinet" dropdown: Natija, Portfolio and a confirmed Chiqish. Opens on hover (mouse)
 * and on click/tap; keyboard: Enter/Space/↓ open on the first item, ↑ on the last, ↑/↓/Home/End
 * move, Esc closes and returns focus to the button, Tab closes.
 */
export function AccountMenu({
  label,
  triggerClassName = 'btn btn-primary',
  align = 'right',
  compact = false,
  inline = false,
}: {
  label: string;
  triggerClassName?: string;
  align?: 'left' | 'right';
  /** Phones: show only a user icon (the label stays for screen readers). */
  compact?: boolean;
  /** Render the list in the normal flow (inside a scrolling mobile panel) instead of floating. */
  inline?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Opened by hovering (not yet clicked): a click then pins it open instead of closing it.
  const hoverOpened = useRef(false);
  const menuId = useId();

  const menuItems = () => [
    ...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
  ];
  const focusItem = (i: number) => {
    const items = menuItems();
    items[(i + items.length) % items.length]?.focus();
  };

  // Item to focus once the menu is visible; applied right after the commit (before the next
  // key press is handled), so fast typists never type into the button by mistake.
  const pendingFocus = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (open && pendingFocus.current !== null) {
      focusItem(pendingFocus.current);
      pendingFocus.current = null;
    }
  });

  const openAt = (i: number | null) => {
    hoverOpened.current = false;
    pendingFocus.current = i;
    setOpen(true);
  };

  const close = (returnFocus = false) => {
    hoverOpened.current = false;
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  // Click/tap outside closes.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  // Navigating closes it.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  function onTriggerKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAt(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openAt(-1);
    }
  }

  function onMenuKey(e: KeyboardEvent) {
    const i = menuItems().indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem(i + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(i - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem(-1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') {
      close();
    }
  }

  async function logout() {
    close();
    const ok = await confirmDialog({
      title: 'Tizimdan chiqish',
      message: 'Haqiqatan chiqmoqchimisiz?',
      confirmLabel: 'Chiqish',
    });
    if (!ok) return;
    for (;;) {
      const res = await api('/auth/logout', { method: 'POST' });
      // 401 means the session is already gone — that is a successful logout too.
      if (res.ok || res.status === 401) break;
      const retry = await confirmDialog({
        title: 'Chiqib bo‘lmadi',
        message: 'Server bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.',
        confirmLabel: 'Qayta urinish',
      });
      if (!retry) return;
    }
    // Per-tab state (e.g. chat history) belongs to the session; the server already deleted
    // the session row and cleared the httpOnly cookie.
    try {
      sessionStorage.clear();
    } catch {
      // Storage may be unavailable (private mode); nothing to clear then.
    }
    // A full navigation drops every in-memory client cache (including the router's), and
    // `replace` keeps the protected page out of the Back history.
    window.location.replace(`${window.location.origin}/`);
  }

  const hoverOpen = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!open) hoverOpened.current = true;
    setOpen(true);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse' || !hoverOpened.current) return;
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_MS);
  };

  return (
    <div ref={rootRef} className="relative" onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          if (open && hoverOpened.current) {
            hoverOpened.current = false; // pin: a click after hovering keeps it open
            return;
          }
          hoverOpened.current = false;
          setOpen(!open);
        }}
        onKeyDown={onTriggerKey}
        className={`${triggerClassName} max-w-full`}
      >
        {compact && <Icon name="user" className="size-5" />}
        <span className={compact ? 'sr-only truncate sm:not-sr-only' : 'truncate'}>{label}</span>
        <Icon
          name="chevronDown"
          className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={label}
        hidden={!open}
        onKeyDown={onMenuKey}
        className={
          inline
            ? 'mt-2 rounded-card border border-line bg-panel p-1.5'
            : `absolute top-full z-50 mt-2 w-56 rounded-card border border-line bg-panel p-1.5 shadow-overlay ${
                align === 'right' ? 'right-0' : 'left-0'
              }`
        }
      >
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              tabIndex={-1}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium text-fg hover:bg-subtle hover:text-ink focus:bg-subtle focus:text-ink focus:outline-none aria-[current=page]:text-brand-700 dark:hover:text-white dark:focus:text-white dark:aria-[current=page]:text-brand-300"
            >
              <Icon name={item.icon} className="size-5" />
              {item.label}
              {active && <span className="sr-only"> (joriy sahifa)</span>}
            </Link>
          );
        })}
        <div role="separator" className="my-1.5 border-t border-line" />
        <button
          type="button"
          role="menuitem"
          tabIndex={-1}
          onClick={logout}
          className="flex min-h-11 w-full items-center gap-3 rounded-control px-3 text-left text-sm font-medium text-red-700 hover:bg-red-50 focus:bg-red-50 focus:outline-none dark:text-red-400 dark:hover:bg-red-950/50 dark:focus:bg-red-950/50"
        >
          <Icon name="logout" className="size-5" />
          Chiqish
        </button>
      </div>
    </div>
  );
}
