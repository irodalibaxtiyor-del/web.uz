'use client';

import type { ContactRequestView } from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { Empty, Section } from '@/components/analytics-ui';
import { Icon } from '@/components/icons';
import { Button, ErrorText, LoadState, PageHeader, StatusLabel } from '@/components/ui';
import { send } from '@/lib/api';
import { formatDateTime } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

type Filter = 'open' | 'all';

export default function AdminContactsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const base = `/orgs/${orgId}/admin/contact-requests`;
  const { state, reload } = useApi<ContactRequestView[]>(base);
  const [filter, setFilter] = useState<Filter>('open');

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="Murojaatlar"
        subtitle="Yordamchi chat orqali administratorga yozilgan savollar. Bu ma’lumotlarni faqat administratorlar ko‘radi."
      />
      <AdminNav orgId={orgId} />
      <LoadState state={state}>
        {(rows) => {
          const open = rows.filter((r) => !r.resolvedAt).length;
          const shown = filter === 'open' ? rows.filter((r) => !r.resolvedAt) : rows;
          return (
            <Section
              title={`Murojaatlar (${open} ta ochiq)`}
              description="Javob berganingizdan keyin “Hal qilindi” deb belgilang. Yangi murojaatlar Telegram orqali xabar qilinishi keyinroq ulanadi."
            >
              <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtr">
                {(
                  [
                    ['open', 'Ochiqlar'],
                    ['all', 'Hammasi'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                    className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
                      filter === value
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-line bg-panel hover:border-brand-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {shown.length === 0 ? (
                <Empty>{filter === 'open' ? 'Ochiq murojaat yo‘q.' : 'Hali murojaat yo‘q.'}</Empty>
              ) : (
                <ul className="divide-y divide-line">
                  {shown.map((r) => (
                    <ContactRow key={r.id} row={r} base={base} onChange={reload} />
                  ))}
                </ul>
              )}
            </Section>
          );
        }}
      </LoadState>
    </>
  );
}

function ContactRow({
  row: r,
  base,
  onChange,
}: {
  row: ContactRequestView;
  base: string;
  onChange: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setError(null);
    setPending(true);
    const res = await send('PUT', `${base}/${r.id}/resolved`, { resolved: !r.resolvedAt });
    setPending(false);
    if (!res.ok) return setError(res.message);
    onChange();
  }

  return (
    <li className="space-y-2 py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="font-semibold">{r.name}</h3>
        {r.resolvedAt ? (
          <StatusLabel icon="checkCircle" tone="success">
            Hal qilindi · {formatDateTime(r.resolvedAt)}
            {r.resolvedBy ? ` · ${r.resolvedBy}` : ''}
          </StatusLabel>
        ) : (
          <StatusLabel icon="clock" tone="warning">
            Ochiq
          </StatusLabel>
        )}
        <span className="text-sm text-muted">{formatDateTime(r.createdAt)}</span>
      </div>
      <p className="text-sm">
        <span className="text-muted">Bog‘lanish: </span>
        <span className="font-medium break-all">{r.contact}</span>
      </p>
      <p className="text-sm whitespace-pre-wrap break-words">{r.message}</p>
      <p className="text-sm text-muted">
        {r.account
          ? `Akkaunt: ${r.account.fullName}${
              r.account.login
                ? ` (${r.account.login})`
                : r.account.email
                  ? ` (${r.account.email})`
                  : ''
            }`
          : 'Tizimga kirmagan holda yozilgan'}
        {r.page ? ` · Sahifa: ${r.page}` : ''}
      </p>
      {error && <ErrorText>{error}</ErrorText>}
      <Button variant={r.resolvedAt ? 'ghost' : 'secondary'} disabled={pending} onClick={toggle}>
        <Icon name={r.resolvedAt ? 'refresh' : 'check'} className="size-4" />
        {r.resolvedAt ? 'Qayta ochish' : 'Hal qilindi'}
      </Button>
    </li>
  );
}
