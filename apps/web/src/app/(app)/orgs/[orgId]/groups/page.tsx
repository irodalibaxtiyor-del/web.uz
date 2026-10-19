'use client';

import type { GroupCard } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Empty } from '@/components/analytics-ui';
import { Button, ErrorText, LoadState, PageHeader } from '@/components/ui';
import { download } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function GroupsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { state } = useApi<GroupCard[]>(`/orgs/${orgId}/groups`);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportAll() {
    setBusy(true);
    setError(null);
    const res = await download(`/orgs/${orgId}/groups/export.xlsx`, {
      fallbackName: 'ballar.xlsx',
    });
    setBusy(false);
    if (!res.ok) setError(res.message);
  }

  return (
    <LoadState state={state}>
      {(groups) => (
        <>
          <PageHeader
            crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
            title="Guruhlarim"
            subtitle="Sizga biriktirilgan guruhlar. Guruhni tanlab, talabalarning o‘quv natijalarini ko‘ring."
            actions={
              groups.length > 0 && (
                <Button variant="accent" onClick={exportAll} disabled={busy}>
                  {busy ? 'Tayyorlanmoqda…' : 'Barcha guruhlar — Excel'}
                </Button>
              )
            }
          />
          {error && <ErrorText>{error}</ErrorText>}
          {groups.length === 0 ? (
            <div className="card p-6">
              <Empty>Sizga hali guruh biriktirilmagan. Guruhlarni administrator biriktiradi.</Empty>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/orgs/${orgId}/groups/${g.id}`}
                    className="card card-hover block p-6 focus-visible:outline-2"
                  >
                    <p className="section-eyebrow">Guruh</p>
                    <p className="mt-1 text-2xl font-bold">{g.name}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {g.students} nafar talaba
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </LoadState>
  );
}
