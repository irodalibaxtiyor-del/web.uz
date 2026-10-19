'use client';

import type {
  AccountState,
  GroupStudentRow,
  GroupSummary,
  TemporaryCredential,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AdminNav } from '@/components/admin-nav';
import {
  AccountStatus,
  byText,
  CredentialNotice,
  Notice,
  Pager,
  SearchBox,
  SortHeader,
  td,
  th,
  tr,
  useTable,
} from '@/components/admin-ui';
import { Empty, Section } from '@/components/analytics-ui';
import { Button, ErrorText, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { download, send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

type Data = { group: GroupSummary; students: GroupStudentRow[] };

const SORTERS = {
  name: (a: GroupStudentRow, b: GroupStudentRow) => byText(a.fullName, b.fullName),
  login: (a: GroupStudentRow, b: GroupStudentRow) => byText(a.login ?? '', b.login ?? ''),
  status: (a: GroupStudentRow, b: GroupStudentRow) => rank(a) - rank(b),
};
const rank = (a: AccountState) =>
  a.disabled ? 3 : !a.hasPassword ? 0 : a.mustChangePassword ? 1 : 2;

export default function AdminGroupPage() {
  const { orgId, groupId } = useParams<{ orgId: string; groupId: string }>();
  const { state, setState } = useApi<Data>(`/orgs/${orgId}/admin/groups/${groupId}/students`);

  return (
    <LoadState state={state}>
      {(data) => (
        <GroupView
          orgId={orgId}
          data={data}
          onAccount={(a) =>
            setState({
              kind: 'ready',
              data: {
                ...data,
                students: data.students.map((s) => (s.userId === a.userId ? { ...s, ...a } : s)),
              },
            })
          }
          onAllHavePasswords={(ids) =>
            setState({
              kind: 'ready',
              data: {
                ...data,
                students: data.students.map((s) =>
                  ids.has(s.userId) ? { ...s, hasPassword: true, mustChangePassword: true } : s,
                ),
              },
            })
          }
        />
      )}
    </LoadState>
  );
}

function GroupView({
  orgId,
  data,
  onAccount,
  onAllHavePasswords,
}: {
  orgId: string;
  data: Data;
  onAccount: (a: AccountState) => void;
  onAllHavePasswords: (ids: Set<string>) => void;
}) {
  const { group, students } = data;
  const table = useTable(students, {
    text: (s) => `${s.fullName} ${s.login ?? ''}`,
    sorters: SORTERS,
    initialSort: 'name',
  });
  const [credential, setCredential] = useState<TemporaryCredential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const without = students.filter((s) => !s.hasPassword && !s.disabled).length;

  async function reset(s: GroupStudentRow) {
    if (
      !window.confirm(
        `${s.fullName}: yangi vaqtinchalik parol beriladi, eski parol ishlamay qoladi. Davom etasizmi?`,
      )
    )
      return;
    setBusy(s.userId);
    setError(null);
    const res = await send<{ credential: TemporaryCredential | null; message?: string }>(
      'POST',
      `/orgs/${orgId}/admin/accounts/${s.userId}/reset-password`,
    );
    setBusy(null);
    if (!res.ok) return setError(res.message);
    if (!res.data.credential) return setError(res.data.message ?? 'Parol berilmadi');
    setCredential(res.data.credential);
    onAccount({
      userId: s.userId,
      disabled: s.disabled,
      hasPassword: true,
      mustChangePassword: true,
    });
  }

  async function toggle(s: GroupStudentRow) {
    const disable = !s.disabled;
    if (
      disable &&
      !window.confirm(
        `${s.fullName}: hisob faolsizlantiriladi va tizimdan chiqariladi. Davom etasizmi?`,
      )
    )
      return;
    setBusy(s.userId);
    setError(null);
    const res = await send<AccountState>(
      'POST',
      `/orgs/${orgId}/admin/accounts/${s.userId}/${disable ? 'disable' : 'enable'}`,
    );
    setBusy(null);
    if (!res.ok) return setError(res.message);
    onAccount(res.data);
  }

  async function bulk(onlyWithoutPassword: boolean) {
    const n = onlyWithoutPassword ? without : students.filter((s) => !s.disabled).length;
    const q = onlyWithoutPassword
      ? `Parol berilmagan ${n} ta talabaga vaqtinchalik parol beriladi va Excel fayl yuklab olinadi. Davom etasizmi?`
      : `Guruhdagi ${n} ta faol talabaning HAMMASIGA yangi parol beriladi — eski parollar ishlamay qoladi. Davom etasizmi?`;
    if (!window.confirm(q)) return;
    setBusy('bulk');
    setError(null);
    setNotice(null);
    const res = await download(`/orgs/${orgId}/admin/credentials/reset.xlsx`, {
      method: 'POST',
      body: { groupId: group.id, onlyWithoutPassword },
      fallbackName: `parollar-${group.name}.xlsx`,
    });
    setBusy(null);
    if (!res.ok) return setError(res.message);
    const count = res.data.headers.get('x-credentials-count') ?? '0';
    setNotice(
      `${count} ta vaqtinchalik parol berildi va “${res.data.fileName}” yuklab olindi. Fayl qayta yuklab olinmaydi — uni xavfsiz joyda saqlang va talabalarga bering.`,
    );
    const ids = new Set(
      students
        .filter((s) => !s.disabled && (!onlyWithoutPassword || !s.hasPassword) && s.login)
        .map((s) => s.userId),
    );
    onAllHavePasswords(ids);
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `/orgs/${orgId}/admin/groups`, label: 'Guruhlar' },
        ]}
        title={group.name}
        subtitle={`${group.students} nafar talaba · ${group.teachers} ta o‘qituvchi biriktirilgan`}
        actions={
          <Link href={`/orgs/${orgId}/groups/${group.id}`} className="btn btn-accent">
            O‘quv natijalari
          </Link>
        }
      />
      <AdminNav orgId={orgId} />
      <div className="space-y-6">
        <Section
          title="Kirish ma’lumotlari"
          description="Parollar faqat Argon2id xeshi sifatida saqlanadi, shuning uchun ularni qayta ko‘rsatib bo‘lmaydi. Yangi vaqtinchalik parollar berilganda ular bir martalik Excel faylga yoziladi."
        >
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => bulk(true)} disabled={busy !== null || without === 0}>
              Parol berilmaganlarga ({without}) — Excel
            </Button>
            <Button variant="secondary" onClick={() => bulk(false)} disabled={busy !== null}>
              Hammaga yangi parol — Excel
            </Button>
          </div>
          {notice && <Notice>{notice}</Notice>}
          {credential && (
            <CredentialNotice credential={credential} onClose={() => setCredential(null)} />
          )}
          {error && <ErrorText>{error}</ErrorText>}
        </Section>
        <Section title="Talabalar">
          <SearchBox
            label="Qidirish"
            placeholder="Ism yoki login"
            value={table.query}
            onChange={table.setQuery}
          />
          {table.total === 0 ? (
            <Empty>
              {students.length === 0 ? 'Guruhda talaba yo‘q.' : 'Hech narsa topilmadi.'}
            </Empty>
          ) : (
            <TableScroll label={`${group.name}: talabalar`}>
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className={tr}>
                    <th className={th}>№</th>
                    <SortHeader
                      label="F.I.Sh."
                      k="name"
                      sort={table.sort}
                      onSort={table.toggleSort}
                    />
                    <SortHeader
                      label="Login"
                      k="login"
                      sort={table.sort}
                      onSort={table.toggleSort}
                    />
                    <SortHeader
                      label="Holat"
                      k="status"
                      sort={table.sort}
                      onSort={table.toggleSort}
                    />
                    <th className={th}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((s, i) => (
                    <tr key={s.userId} className={tr}>
                      <td className={`${td} tabular-nums`}>{table.start + i + 1}</td>
                      <td className={td}>{s.fullName}</td>
                      <td className={`${td} font-mono`}>{s.login ?? s.email ?? '—'}</td>
                      <td className={td}>
                        <AccountStatus a={s} />
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            className="px-3 py-1.5 text-xs"
                            disabled={busy !== null || s.disabled || !s.login}
                            onClick={() => reset(s)}
                            aria-label={`${s.fullName}: parolni tiklash`}
                          >
                            Parolni tiklash
                          </Button>
                          <Button
                            variant="secondary"
                            className="px-3 py-1.5 text-xs"
                            disabled={busy !== null}
                            onClick={() => toggle(s)}
                            aria-label={`${s.fullName}: ${s.disabled ? 'faollashtirish' : 'faolsizlantirish'}`}
                          >
                            {s.disabled ? 'Faollashtirish' : 'Faolsizlantirish'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          )}
          <Pager
            page={table.page}
            pages={table.pages}
            start={table.start}
            shown={table.rows.length}
            total={table.total}
            onPage={table.setPage}
          />
        </Section>
      </div>
    </>
  );
}
