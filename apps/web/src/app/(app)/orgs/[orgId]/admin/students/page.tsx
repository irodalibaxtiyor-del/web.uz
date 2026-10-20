'use client';

import type {
  AccountState,
  AdminStudentRow,
  GroupSummary,
  TemporaryCredential,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { AdminNav } from '@/components/admin-nav';
import {
  AccountStatus,
  byText,
  CredentialNotice,
  Pager,
  SearchBox,
  Select,
  SortHeader,
  td,
  th,
  tr,
  useTable,
} from '@/components/admin-ui';
import { Empty, Section } from '@/components/analytics-ui';
import { Button, ErrorText, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { confirmDialog } from '@/components/dialog';

const rank = (a: AccountState) =>
  a.disabled ? 3 : !a.hasPassword ? 0 : a.mustChangePassword ? 1 : 2;
const SORTERS = {
  name: (a: AdminStudentRow, b: AdminStudentRow) => byText(a.fullName, b.fullName),
  group: (a: AdminStudentRow, b: AdminStudentRow) =>
    byText(a.group?.name ?? '~', b.group?.name ?? '~') || byText(a.fullName, b.fullName),
  login: (a: AdminStudentRow, b: AdminStudentRow) =>
    byText(a.login ?? a.email ?? '', b.login ?? b.email ?? ''),
  status: (a: AdminStudentRow, b: AdminStudentRow) => rank(a) - rank(b),
};

export default function AdminStudentsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const students = useApi<AdminStudentRow[]>(`/orgs/${orgId}/admin/students`);
  const groups = useApi<GroupSummary[]>(`/orgs/${orgId}/admin/groups`);

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="Talabalar"
        subtitle="Barcha talabalar hisoblari, guruhlari va holati."
      />
      <AdminNav orgId={orgId} />
      <LoadState state={students.state}>
        {(rows) => (
          <LoadState state={groups.state}>
            {(gs) => (
              <StudentsTable
                orgId={orgId}
                rows={rows}
                groups={gs}
                onRow={(row) =>
                  students.setState({
                    kind: 'ready',
                    data: rows.map((r) => (r.userId === row.userId ? { ...r, ...row } : r)),
                  })
                }
              />
            )}
          </LoadState>
        )}
      </LoadState>
    </>
  );
}

function StudentsTable({
  orgId,
  rows,
  groups,
  onRow,
}: {
  orgId: string;
  rows: AdminStudentRow[];
  groups: GroupSummary[];
  onRow: (row: Partial<AdminStudentRow> & { userId: string }) => void;
}) {
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const filter = useCallback(
    (r: AdminStudentRow) =>
      (groupFilter === 'all' ||
        (groupFilter === 'none' ? r.group === null : r.group?.id === groupFilter)) &&
      (statusFilter === 'all' ||
        (statusFilter === 'disabled' && r.disabled) ||
        (statusFilter === 'nopassword' && !r.disabled && !r.hasPassword) ||
        (statusFilter === 'temporary' && !r.disabled && r.hasPassword && r.mustChangePassword) ||
        (statusFilter === 'active' && !r.disabled && r.hasPassword && !r.mustChangePassword)),
    [groupFilter, statusFilter],
  );
  const table = useTable(rows, {
    text: (s) => `${s.fullName} ${s.login ?? ''} ${s.email ?? ''}`,
    sorters: SORTERS,
    initialSort: 'group',
    filter,
  });
  const [credential, setCredential] = useState<TemporaryCredential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function move(s: AdminStudentRow, groupId: string) {
    const target = groups.find((g) => g.id === groupId);
    const q = target
      ? `${s.fullName} “${target.name}” guruhiga o‘tkaziladi. Davom etasizmi?`
      : `${s.fullName} guruhdan chiqariladi. Davom etasizmi?`;
    if (!(await confirmDialog(q))) return;
    setBusy(s.userId);
    setError(null);
    const res = await send<AdminStudentRow>(
      'PUT',
      `/orgs/${orgId}/admin/students/${s.userId}/group`,
      {
        groupId: groupId || null,
      },
    );
    setBusy(null);
    if (!res.ok) return setError(res.message);
    onRow(res.data);
  }

  async function reset(s: AdminStudentRow) {
    if (
      !(await confirmDialog({
        title: 'Parolni tiklash',
        message: `${s.fullName}: yangi vaqtinchalik parol beriladi, eski parol ishlamay qoladi.`,
        confirmLabel: 'Parolni tiklash',
        tone: 'danger',
      }))
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
    onRow({ userId: s.userId, hasPassword: true, mustChangePassword: true });
  }

  async function toggle(s: AdminStudentRow) {
    const disable = !s.disabled;
    if (
      disable &&
      !(await confirmDialog({
        title: 'Hisobni faolsizlantirish',
        message: `${s.fullName}: hisob faolsizlantiriladi va tizimdan chiqariladi.`,
        confirmLabel: 'Faolsizlantirish',
        tone: 'danger',
      }))
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
    onRow(res.data);
  }

  return (
    <Section title={`Talabalar (${rows.length})`}>
      <div className="flex flex-wrap items-end gap-3">
        <SearchBox
          label="Qidirish"
          placeholder="Ism, login yoki email"
          value={table.query}
          onChange={table.setQuery}
        />
        <Select
          label="Guruh"
          value={groupFilter}
          onChange={(v) => {
            setGroupFilter(v);
            table.resetPage();
          }}
          options={[
            { value: 'all', label: 'Barcha guruhlar' },
            ...groups.map((g) => ({ value: g.id, label: g.name })),
            { value: 'none', label: 'Guruhsiz' },
          ]}
        />
        <Select
          label="Holat"
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            table.resetPage();
          }}
          options={[
            { value: 'all', label: 'Hammasi' },
            { value: 'nopassword', label: 'Parol berilmagan' },
            { value: 'temporary', label: 'Vaqtinchalik parol' },
            { value: 'active', label: 'Faol' },
            { value: 'disabled', label: 'Faolsiz' },
          ]}
        />
      </div>
      {credential && (
        <CredentialNotice credential={credential} onClose={() => setCredential(null)} />
      )}
      {error && <ErrorText>{error}</ErrorText>}
      {table.total === 0 ? (
        <Empty>Hech narsa topilmadi.</Empty>
      ) : (
        <TableScroll label="Talabalar jadvali">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className={tr}>
                <SortHeader label="F.I.Sh." k="name" sort={table.sort} onSort={table.toggleSort} />
                <SortHeader label="Guruh" k="group" sort={table.sort} onSort={table.toggleSort} />
                <SortHeader label="Login" k="login" sort={table.sort} onSort={table.toggleSort} />
                <SortHeader label="Holat" k="status" sort={table.sort} onSort={table.toggleSort} />
                <th className={th}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((s) => (
                <tr key={s.userId} className={tr}>
                  <td className={td}>{s.fullName}</td>
                  <td className={td}>
                    <label className="sr-only" htmlFor={`g-${s.userId}`}>
                      {s.fullName}: guruh
                    </label>
                    <select
                      id={`g-${s.userId}`}
                      className="field py-1.5 text-sm"
                      value={s.group?.id ?? ''}
                      disabled={busy !== null}
                      onChange={(e) => move(s, e.target.value)}
                    >
                      <option value="">Guruhsiz</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`${td} font-mono break-all`}>{s.login ?? s.email ?? '—'}</td>
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
                        title={
                          s.login
                            ? undefined
                            : 'O‘zi ro‘yxatdan o‘tgan (email bilan) — parolni o‘zi boshqaradi'
                        }
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
  );
}
