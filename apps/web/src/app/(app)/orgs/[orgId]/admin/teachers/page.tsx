'use client';

import {
  createTeacherSchema,
  type AccountState,
  type CreatedTeacher,
  type GroupSummary,
  type TeacherRow,
  type TemporaryCredential,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { AccountStatus, byText, CredentialNotice, Notice, SearchBox } from '@/components/admin-ui';
import { Empty, Section } from '@/components/analytics-ui';
import { Button, ErrorText, LoadState, PageHeader } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function AdminTeachersPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const teachers = useApi<TeacherRow[]>(`/orgs/${orgId}/admin/teachers`);
  const groups = useApi<GroupSummary[]>(`/orgs/${orgId}/admin/groups`);
  const [credential, setCredential] = useState<TemporaryCredential | null>(null);

  const put = (list: TeacherRow[], row: Partial<TeacherRow> & { userId: string }) =>
    teachers.setState({
      kind: 'ready',
      data: list.some((t) => t.userId === row.userId)
        ? list.map((t) => (t.userId === row.userId ? { ...t, ...row } : t))
        : [...list, row as TeacherRow].sort((a, b) => byText(a.fullName, b.fullName)),
    });

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="O‘qituvchilar"
        subtitle="Hisob yaratish, guruhlarga biriktirish, parol va holatni boshqarish."
      />
      <AdminNav orgId={orgId} />
      <div className="space-y-6">
        {credential && (
          <CredentialNotice credential={credential} onClose={() => setCredential(null)} />
        )}
        <LoadState state={teachers.state}>
          {(list) => (
            <LoadState state={groups.state}>
              {(gs) => (
                <>
                  <CreateTeacher
                    orgId={orgId}
                    onCreated={(c) => {
                      put(list, c.teacher);
                      setCredential(c.credential);
                    }}
                  />
                  <TeacherList
                    orgId={orgId}
                    teachers={list}
                    groups={gs}
                    onRow={(r) => put(list, r)}
                    onCredential={setCredential}
                  />
                </>
              )}
            </LoadState>
          )}
        </LoadState>
      </div>
    </>
  );
}

function CreateTeacher({
  orgId,
  onCreated,
}: {
  orgId: string;
  onCreated: (c: CreatedTeacher) => void;
}) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formEl = e.currentTarget;
    const raw = Object.fromEntries(new FormData(formEl)) as Record<string, string>;
    const parsed = createTeacherSchema.safeParse({
      fullName: raw.fullName,
      login: raw.login,
      ...(raw.email?.trim() ? { email: raw.email } : {}),
    });
    if (!parsed.success) {
      setError(
        'F.I.Sh. (kamida 3 belgi), login (lotin harflari, raqam, nuqta yoki chiziqcha) va to‘g‘ri email kiriting.',
      );
      return;
    }
    setPending(true);
    const res = await send<CreatedTeacher>('POST', `/orgs/${orgId}/admin/teachers`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    formEl.reset();
    onCreated(res.data);
  }

  return (
    <Section
      title="Yangi o‘qituvchi"
      description="Tizim vaqtinchalik parol yaratadi va uni bir marta ko‘rsatadi. O‘qituvchi birinchi kirishda parolni almashtiradi."
    >
      <form onSubmit={onSubmit} noValidate className="grid gap-4 md:grid-cols-3">
        {(
          [
            ['fullName', 'F.I.Sh.', 'name', true],
            ['login', 'Login', 'off', true],
            ['email', 'Email (ixtiyoriy)', 'email', false],
          ] as const
        ).map(([name, label, auto, required]) => (
          <div key={name} className="space-y-1">
            <label htmlFor={`${id}-${name}`} className="text-sm font-semibold">
              {label}
            </label>
            <input
              id={`${id}-${name}`}
              name={name}
              autoComplete={auto}
              required={required}
              type={name === 'email' ? 'email' : 'text'}
              autoCapitalize={name === 'fullName' ? undefined : 'none'}
              placeholder={name === 'login' ? 'masalan: qodirova.nodira' : undefined}
              className="field"
            />
          </div>
        ))}
        <div className="md:col-span-3">
          <Button type="submit" disabled={pending}>
            {pending ? 'Yaratilmoqda…' : 'O‘qituvchi yaratish'}
          </Button>
        </div>
        {error && (
          <div className="md:col-span-3">
            <ErrorText>{error}</ErrorText>
          </div>
        )}
      </form>
    </Section>
  );
}

function TeacherList({
  orgId,
  teachers,
  groups,
  onRow,
  onCredential,
}: {
  orgId: string;
  teachers: TeacherRow[];
  groups: GroupSummary[];
  onRow: (r: Partial<TeacherRow> & { userId: string }) => void;
  onCredential: (c: TemporaryCredential) => void;
}) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLocaleLowerCase('uz');
  const shown = teachers.filter(
    (t) =>
      !q || `${t.fullName} ${t.login ?? ''} ${t.email ?? ''}`.toLocaleLowerCase('uz').includes(q),
  );
  return (
    <Section title={`O‘qituvchilar (${teachers.length})`}>
      <SearchBox
        label="Qidirish"
        placeholder="Ism, login yoki email"
        value={query}
        onChange={setQuery}
      />
      {shown.length === 0 ? (
        <Empty>{teachers.length === 0 ? 'Hali o‘qituvchi yo‘q.' : 'Hech narsa topilmadi.'}</Empty>
      ) : (
        <ul className="space-y-4">
          {shown.map((t) => (
            <TeacherCard
              key={t.userId}
              orgId={orgId}
              t={t}
              groups={groups}
              onRow={onRow}
              onCredential={onCredential}
            />
          ))}
        </ul>
      )}
    </Section>
  );
}

function TeacherCard({
  orgId,
  t,
  groups,
  onRow,
  onCredential,
}: {
  orgId: string;
  t: TeacherRow;
  groups: GroupSummary[];
  onRow: (r: Partial<TeacherRow> & { userId: string }) => void;
  onCredential: (c: TemporaryCredential) => void;
}) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(t.groups.map((g) => g.id)));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = selected.size !== t.groups.length || t.groups.some((g) => !selected.has(g.id));

  async function run<T>(
    fn: () => Promise<{ ok: true; data: T } | { ok: false; message: string }>,
    done: (d: T) => void,
  ) {
    setBusy(true);
    setError(null);
    setNotice(null);
    const res = await fn();
    setBusy(false);
    if (!res.ok) return setError(res.message);
    done(res.data);
  }

  const saveGroups = () =>
    run(
      () =>
        send<TeacherRow>('PUT', `/orgs/${orgId}/admin/teachers/${t.userId}/groups`, {
          groupIds: [...selected],
        }),
      (row) => {
        onRow(row);
        setNotice('Guruhlar saqlandi.');
      },
    );

  async function saveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body = {
      fullName: raw.fullName?.trim(),
      login: raw.login?.trim().toLowerCase(),
      email: raw.email?.trim() ? raw.email.trim().toLowerCase() : null,
    };
    await run(
      () => send<TeacherRow>('PATCH', `/orgs/${orgId}/admin/teachers/${t.userId}`, body),
      (row) => {
        onRow(row);
        setEditing(false);
        setNotice('Ma’lumotlar saqlandi.');
      },
    );
  }

  const reset = () => {
    if (!window.confirm(`${t.fullName}: yangi vaqtinchalik parol beriladi. Davom etasizmi?`))
      return;
    return run(
      () =>
        send<{ credential: TemporaryCredential | null; message?: string }>(
          'POST',
          `/orgs/${orgId}/admin/accounts/${t.userId}/reset-password`,
        ),
      (d) => {
        if (!d.credential) return setError(d.message ?? 'Parol berilmadi');
        onCredential(d.credential);
        onRow({ userId: t.userId, hasPassword: true, mustChangePassword: true });
      },
    );
  };

  const toggle = () => {
    if (!t.disabled && !window.confirm(`${t.fullName}: hisob faolsizlantiriladi. Davom etasizmi?`))
      return;
    return run(
      () =>
        send<AccountState>(
          'POST',
          `/orgs/${orgId}/admin/accounts/${t.userId}/${t.disabled ? 'enable' : 'disable'}`,
        ),
      (a) => onRow(a),
    );
  };

  return (
    <li className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold">{t.fullName}</p>
          <p className="font-mono text-sm break-all">
            {t.login ?? '—'}
            {t.email && <span className="text-slate-600 dark:text-slate-400"> · {t.email}</span>}
          </p>
          <AccountStatus a={t} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            onClick={() => setEditing((v) => !v)}
            aria-expanded={editing}
            disabled={busy}
          >
            Tahrirlash
          </Button>
          <Button
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            onClick={reset}
            disabled={busy || t.disabled || !t.login}
          >
            Parolni tiklash
          </Button>
          <Button
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            onClick={toggle}
            disabled={busy}
          >
            {t.disabled ? 'Faollashtirish' : 'Faolsizlantirish'}
          </Button>
        </div>
      </div>
      {editing && (
        <form onSubmit={saveProfile} className="mt-4 grid gap-3 md:grid-cols-3">
          {(
            [
              ['fullName', 'F.I.Sh.', t.fullName],
              ['login', 'Login', t.login ?? ''],
              ['email', 'Email', t.email ?? ''],
            ] as const
          ).map(([name, label, value]) => (
            <div key={name} className="space-y-1">
              <label htmlFor={`${id}-${name}`} className="text-sm font-semibold">
                {label}
              </label>
              <input
                id={`${id}-${name}`}
                name={name}
                defaultValue={value}
                className="field"
                autoCapitalize={name === 'fullName' ? undefined : 'none'}
              />
            </div>
          ))}
          <div className="md:col-span-3">
            <Button type="submit" disabled={busy}>
              Saqlash
            </Button>
          </div>
        </form>
      )}
      <fieldset className="mt-4 space-y-2">
        <legend className="text-sm font-semibold">Ruxsat etilgan guruhlar</legend>
        {groups.length === 0 ? (
          <Empty>Hali guruh yo‘q.</Empty>
        ) : (
          <div className="flex flex-wrap gap-3">
            {groups.map((g) => (
              <label key={g.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.has(g.id)}
                  onChange={(e) => {
                    const next = new Set(selected);
                    if (e.target.checked) next.add(g.id);
                    else next.delete(g.id);
                    setSelected(next);
                  }}
                />
                {g.name}
              </label>
            ))}
          </div>
        )}
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-xs"
          onClick={saveGroups}
          disabled={busy || !dirty}
        >
          Guruhlarni saqlash
        </Button>
      </fieldset>
      <div className="mt-3 space-y-2" aria-live="polite">
        {notice && <Notice>{notice}</Notice>}
        {error && <ErrorText>{error}</ErrorText>}
      </div>
    </li>
  );
}
