'use client';

import type { AccountState, TemporaryCredential } from '@webdizayn/shared';
import { useId, useMemo, useState, type ReactNode } from 'react';
import { Button } from './ui';
import { Icon, type IconName } from './icons';

export const th = 'py-2 pr-3 text-left font-semibold';
export const td = 'py-2 pr-3 align-top';
export const tr = 'border-b border-slate-100 dark:border-slate-800';

export type SortDir = 'asc' | 'desc';

/** Uzbek-aware text comparison (o‘ and g‘ sort as written, case-insensitive). */
export const byText = (a: string, b: string) => a.localeCompare(b, 'uz', { sensitivity: 'base' });

/**
 * Client-side search, sort and paging for admin/teacher tables. The server already returns
 * only rows the caller may see; this is presentation only.
 */
export function useTable<T, K extends string>(
  rows: T[],
  opts: {
    text: (row: T) => string;
    sorters: Record<K, (a: T, b: T) => number>;
    initialSort: NoInfer<K>;
    filter?: (row: T) => boolean;
    pageSize?: number;
  },
) {
  const [query, setQueryRaw] = useState('');
  const [sort, setSort] = useState<{ key: K; dir: SortDir }>({ key: opts.initialSort, dir: 'asc' });
  const [page, setPage] = useState(0);
  const pageSize = opts.pageSize ?? 25;
  const { text, sorters, filter } = opts;

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('uz');
    const list = rows.filter(
      (r) => (!filter || filter(r)) && (!q || text(r).toLocaleLowerCase('uz').includes(q)),
    );
    const cmp = sorters[sort.key];
    list.sort((a, b) => (sort.dir === 'asc' ? cmp(a, b) : cmp(b, a)));
    return list;
  }, [rows, query, sort, text, sorters, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  return {
    query,
    setQuery: (q: string) => {
      setQueryRaw(q);
      setPage(0);
    },
    sort,
    toggleSort: (key: K) =>
      setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' })),
    page: current,
    setPage,
    pages,
    total: filtered.length,
    start: current * pageSize,
    rows: filtered.slice(current * pageSize, (current + 1) * pageSize),
    all: filtered,
    resetPage: () => setPage(0),
  };
}

export function SortHeader<K extends string>({
  label,
  k,
  sort,
  onSort,
  className = '',
}: {
  label: string;
  k: K;
  sort: { key: K; dir: SortDir };
  onSort: (k: K) => void;
  className?: string;
}) {
  const active = sort.key === k;
  return (
    <th
      className={`${th} ${className}`}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className="inline-flex min-h-11 items-center gap-1 font-semibold hover:underline sm:min-h-0"
      >
        {label}
        <Icon
          name={active ? (sort.dir === 'asc' ? 'chevronUp' : 'chevronDown') : 'selector'}
          className="size-4"
        />
      </button>
    </th>
  );
}

export function SearchBox({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="min-w-0 flex-1 space-y-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Pager({
  page,
  pages,
  start,
  shown,
  total,
  onPage,
}: {
  page: number;
  pages: number;
  start: number;
  shown: number;
  total: number;
  onPage: (p: number) => void;
}) {
  if (total === 0) return null;
  return (
    <nav
      aria-label="Sahifalar"
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <p className="text-slate-600 dark:text-slate-400" aria-live="polite">
        {start + 1}–{start + shown} / {total}
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled={page === 0} onClick={() => onPage(page - 1)}>
            <Icon name="chevronLeft" className="size-4" />
            Oldingi
          </Button>
          <span>
            {page + 1} / {pages}
          </span>
          <Button variant="secondary" disabled={page >= pages - 1} onClick={() => onPage(page + 1)}>
            Keyingi
            <Icon name="chevronRight" className="size-4" />
          </Button>
        </div>
      )}
    </nav>
  );
}

export function AccountStatus({ a }: { a: AccountState }) {
  const s: { icon: IconName; label: string; tone: string } = a.disabled
    ? { icon: 'ban', label: 'Faolsiz', tone: 'text-red-700 dark:text-red-400' }
    : !a.hasPassword
      ? {
          icon: 'circleDashed',
          label: 'Parol berilmagan',
          tone: 'text-slate-600 dark:text-slate-400',
        }
      : a.mustChangePassword
        ? {
            icon: 'circleHalf',
            label: 'Vaqtinchalik parol',
            tone: 'text-amber-700 dark:text-amber-400',
          }
        : { icon: 'checkCircle', label: 'Faol', tone: 'text-emerald-700 dark:text-emerald-400' };
  return (
    <span className={`text-sm whitespace-nowrap ${s.tone}`}>
      <Icon name={s.icon} className="inline size-4 align-[-0.2em]" /> {s.label}
    </span>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
    >
      {children}
    </p>
  );
}

/** A freshly issued temporary password. Shown once; it cannot be read back later. */
export function CredentialNotice({
  credential,
  onClose,
}: {
  credential: TemporaryCredential;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const headingId = useId();
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `Login: ${credential.login}\nVaqtinchalik parol: ${credential.temporaryPassword}`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <section
      role="alert"
      aria-labelledby={headingId}
      className="space-y-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950"
    >
      <h3 id={headingId} className="font-bold text-amber-900 dark:text-amber-200">
        {credential.fullName}: vaqtinchalik parol
      </h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt>Login</dt>
        <dd className="font-mono font-semibold break-all">{credential.login}</dd>
        <dt>Parol</dt>
        <dd className="font-mono font-semibold break-all">{credential.temporaryPassword}</dd>
      </dl>
      <p className="text-sm text-amber-900 dark:text-amber-200">
        Bu parol faqat hozir ko‘rinadi va serverda ochiq saqlanmaydi. Birinchi kirishda
        foydalanuvchi uni almashtiradi.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} className="size-4" />
          {copied ? 'Nusxa olindi' : 'Nusxa olish'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Yopish
        </Button>
      </div>
    </section>
  );
}
