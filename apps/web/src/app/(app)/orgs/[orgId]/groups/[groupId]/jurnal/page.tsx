'use client';

import type { GradebookSummary, GroupOverview } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ScoreBadge } from '@/components/gradebook-ui';
import { Icon } from '@/components/icons';
import { Button, EmptyState, ErrorText, LoadState, PageHeader } from '@/components/ui';
import { send } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

export default function GradebooksPage() {
  const { orgId, groupId } = useParams<{ orgId: string; groupId: string }>();
  const router = useRouter();
  const group = useApi<GroupOverview>(`/orgs/${orgId}/groups/${groupId}`);
  const { state } = useApi<GradebookSummary[]>(`/orgs/${orgId}/groups/${groupId}/gradebooks`);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const base = `/orgs/${orgId}/groups/${groupId}`;
  const groupName = group.state.kind === 'ready' ? group.state.data.group.name : 'Guruh';

  async function create(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const r = await send<GradebookSummary>('POST', `${base}/gradebooks`, { title });
    setPending(false);
    if (!r.ok) return setError(r.message);
    router.push(`${base}/jurnal/${r.data.id}`);
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `/orgs/${orgId}/groups`, label: 'Guruhlarim' },
          { href: base, label: groupName },
        ]}
        title="Baholash jurnali"
        subtitle="Darsda qo‘ygan baholaringiz (100 ballik shkala): har dars uchun ustun, Excel’dan import va eksport."
      />
      <div className="space-y-8">
        <form onSubmit={create} className="card flex flex-wrap items-end gap-3 p-5">
          <div className="min-w-60 flex-1">
            <label htmlFor="gb-title" className="mb-1 block font-semibold">
              Yangi jurnal (fan nomi)
            </label>
            <input
              id="gb-title"
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Veb dizayn"
              required
              minLength={2}
              maxLength={120}
            />
          </div>
          <Button type="submit" disabled={pending}>
            <Icon name="plus" className="size-4" /> Yaratish
          </Button>
          {error && (
            <div className="w-full">
              <ErrorText>{error}</ErrorText>
            </div>
          )}
        </form>

        <LoadState state={state}>
          {(list) =>
            list.length === 0 ? (
              <EmptyState title="Hali jurnal yo‘q">
                Fan nomini yozib jurnal yarating, keyin baholarni qo‘lda kiriting yoki Excel
                faylidan yuklang.
              </EmptyState>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {list.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`${base}/jurnal/${b.id}`}
                      className="card block p-5 transition hover:shadow-md focus-visible:outline-2"
                    >
                      <p className="font-display text-lg font-semibold">{b.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {b.students} talaba · {b.columns} dars · yangilangan{' '}
                        {formatDate(b.updatedAt)}
                      </p>
                      <p className="mt-3 text-sm">
                        Guruh o‘rtachasi: <ScoreBadge score={b.average} />
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          }
        </LoadState>
      </div>
    </>
  );
}
