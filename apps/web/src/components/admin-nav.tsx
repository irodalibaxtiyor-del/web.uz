'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Section tabs for the organization administrator pages. */
export function AdminNav({ orgId }: { orgId: string }) {
  const pathname = usePathname();
  const items = [
    { href: `/orgs/${orgId}/admin/groups`, label: 'Guruhlar va import' },
    { href: `/orgs/${orgId}/admin/students`, label: 'Talabalar' },
    { href: `/orgs/${orgId}/admin/teachers`, label: 'O‘qituvchilar' },
    { href: `/orgs/${orgId}/groups`, label: 'Guruh paneli' },
  ];
  return (
    <nav aria-label="Administrator bo‘limlari" className="mb-6 overflow-x-auto">
      <ul className="flex min-w-max gap-2">
        {items.map((i) => {
          const active = pathname === i.href || pathname.startsWith(`${i.href}/`);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={active ? 'page' : undefined}
                className={`inline-block rounded-full border px-4 py-2 text-sm font-semibold ${
                  active
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-200 bg-white text-ink hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                }`}
              >
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
