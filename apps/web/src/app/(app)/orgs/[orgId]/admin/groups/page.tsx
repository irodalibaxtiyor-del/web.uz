'use client';

import {
  parseRosterText,
  type GroupSummary,
  type RosterImportInput,
  type RosterImportResult,
  type RosterPreview,
  type RosterResolution,
  type RosterRowStatus,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useId, useState } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { Notice, td, th, tr } from '@/components/admin-ui';
import { Empty, Section } from '@/components/analytics-ui';
import { Button, ErrorText, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { download, send } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

const ROW_STATUS: Record<RosterRowStatus, { label: string; icon: string; tone: string }> = {
  NEW: { label: 'Yangi hisob', icon: '+', tone: 'text-brand-700 dark:text-brand-300' },
  ALREADY_IMPORTED: {
    label: 'Allaqachon bor',
    icon: '✓',
    tone: 'text-emerald-700 dark:text-emerald-400',
  },
  DUPLICATE_IN_INPUT: {
    label: 'Ro‘yxatda takror',
    icon: '!',
    tone: 'text-red-700 dark:text-red-400',
  },
  IN_OTHER_GROUP: { label: 'Boshqa guruhda', icon: '!', tone: 'text-red-700 dark:text-red-400' },
  NAME_MATCH: {
    label: 'Ismdosh bor — tanlang',
    icon: '?',
    tone: 'text-amber-700 dark:text-amber-400',
  },
};

export default function AdminGroupsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { state, reload } = useApi<GroupSummary[]>(`/orgs/${orgId}/admin/groups`);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportLogins() {
    setBusy(true);
    setError(null);
    const res = await download(`/orgs/${orgId}/admin/logins.xlsx`, {
      fallbackName: 'loginlar.xlsx',
    });
    setBusy(false);
    if (!res.ok) setError(res.message);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="Guruhlar va talabalar"
        subtitle="Guruhlar ro‘yxati, talabalarni import qilish va loginlar eksporti."
        actions={
          <Button variant="accent" onClick={exportLogins} disabled={busy}>
            {busy ? 'Tayyorlanmoqda…' : 'Loginlar (Excel)'}
          </Button>
        }
      />
      <AdminNav orgId={orgId} />
      <div className="space-y-8">
        {error && <ErrorText>{error}</ErrorText>}
        <Section title="Guruhlar">
          <LoadState state={state}>
            {(groups) =>
              groups.length === 0 ? (
                <Empty>Hali guruh yo‘q. Quyidagi forma orqali ro‘yxatni import qiling.</Empty>
              ) : (
                <TableScroll label="Guruhlar jadvali">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className={tr}>
                        <th className={th}>Guruh</th>
                        <th className={`${th} text-right`}>Talabalar</th>
                        <th className={`${th} text-right`}>O‘qituvchilar</th>
                        <th className={th}>Yaratilgan</th>
                        <th className={th}>
                          <span className="sr-only">Amallar</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((g) => (
                        <tr key={g.id} className={tr}>
                          <td className={`${td} font-semibold`}>{g.name}</td>
                          <td className={`${td} text-right tabular-nums`}>{g.students}</td>
                          <td className={`${td} text-right tabular-nums`}>{g.teachers}</td>
                          <td className={td}>{formatDate(g.createdAt)}</td>
                          <td className={`${td} whitespace-nowrap`}>
                            <Link
                              href={`/orgs/${orgId}/admin/groups/${g.id}`}
                              className="font-semibold text-brand-700 underline dark:text-brand-300"
                              aria-label={`${g.name}: talabalar va loginlar`}
                            >
                              Talabalar va loginlar
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className={`${td} font-semibold`}>Jami</td>
                        <td className={`${td} text-right font-semibold tabular-nums`}>
                          {groups.reduce((s, g) => s + g.students, 0)}
                        </td>
                        <td colSpan={3} />
                      </tr>
                    </tfoot>
                  </table>
                </TableScroll>
              )
            }
          </LoadState>
        </Section>
        <RosterImport orgId={orgId} onImported={reload} />
      </div>
    </>
  );
}

function RosterImport({ orgId, onImported }: { orgId: string; onImported: () => void }) {
  const id = useId();
  const [text, setText] = useState('');
  const [input, setInput] = useState<RosterImportInput | null>(null);
  const [preview, setPreview] = useState<RosterPreview | null>(null);
  const [resolutions, setResolutions] = useState<Record<string, RosterResolution>>({});
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RosterImportResult | null>(null);
  const [pending, setPending] = useState(false);

  async function runPreview(nextResolutions = resolutions) {
    setError(null);
    setResult(null);
    const parsed = parseRosterText(text);
    if (parsed.orphanLines.length > 0) {
      setError(
        `Guruh sarlavhasisiz qatorlar bor (${parsed.orphanLines.join(', ')}-qatorlar). Avval guruh nomini yozing, masalan: “### 8-24 ATT — 23 nafar talaba”.`,
      );
      return;
    }
    const empty = parsed.groups.filter((g) => g.students.length === 0);
    if (parsed.groups.length === 0 || empty.length > 0) {
      setError(
        parsed.groups.length === 0
          ? 'Ro‘yxat bo‘sh.'
          : `Talabasiz guruh: ${empty.map((g) => g.name).join(', ')}.`,
      );
      return;
    }
    const body: RosterImportInput = { groups: parsed.groups, resolutions: nextResolutions };
    setPending(true);
    const res = await send<RosterPreview>('POST', `/orgs/${orgId}/admin/roster/preview`, body);
    setPending(false);
    if (!res.ok) {
      setError(
        res.status === 400
          ? 'Ro‘yxat formati noto‘g‘ri: har bir ismda familiya va ism bo‘lsin.'
          : res.message,
      );
      return;
    }
    setInput(body);
    setPreview(res.data);
  }

  async function choose(key: string, r: RosterResolution) {
    const next = { ...resolutions, [key]: r };
    setResolutions(next);
    await runPreview(next);
  }

  async function runImport() {
    if (!input || !preview?.canImport) return;
    const total = preview.totals.NEW + preview.totals.NAME_MATCH;
    if (
      !window.confirm(
        `${preview.groups.length} ta guruh, ${total} ta yangi yoki bog‘lanadigan talaba import qilinadi. Davom etasizmi?`,
      )
    )
      return;
    setPending(true);
    const res = await send<RosterImportResult>('POST', `/orgs/${orgId}/admin/roster/import`, input);
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setResult(res.data);
    setPreview(null);
    setText('');
    setResolutions({});
    onImported();
  }

  return (
    <Section
      title="Talabalar ro‘yxatini import qilish"
      description="Guruh nomi alohida qatorda, talabalar raqamlangan qatorlarda. Ismlar o‘zgartirilmaydi; takrorlar va mos kelmaydigan sonlar import qilinmaydi, ro‘yxatda ko‘rsatiladi."
    >
      <div className="space-y-1.5">
        <label htmlFor={id} className="text-sm font-semibold">
          Ro‘yxat matni
        </label>
        <textarea
          id={id}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setPreview(null);
          }}
          rows={10}
          spellCheck={false}
          placeholder={'### 8-24 ATT — 23 nafar talaba\n1. FAMILIYA ISM OTASINING ISMI\n2. …'}
          className="field font-mono text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => runPreview()} disabled={pending || !text.trim()}>
          {pending ? 'Tekshirilmoqda…' : 'Ko‘rib chiqish'}
        </Button>
        {preview && (
          <Button variant="accent" onClick={runImport} disabled={pending || !preview.canImport}>
            Import qilish
          </Button>
        )}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {result && (
        <Notice>
          Import tugadi: {result.created} ta yangi hisob, {result.linked} ta bog‘landi,{' '}
          {result.skipped} ta allaqachon bor edi. Guruhlar:{' '}
          {result.groups.map((g) => `${g.name} — ${g.students} nafar`).join('; ')}.
        </Notice>
      )}
      {preview && (
        <div className="space-y-4" aria-live="polite">
          <p className="text-sm">
            Jami {preview.totals.rows} ta qator: {preview.totals.NEW} yangi,{' '}
            {preview.totals.ALREADY_IMPORTED} allaqachon bor, {preview.totals.NAME_MATCH} ismdosh,{' '}
            {preview.totals.DUPLICATE_IN_INPUT + preview.totals.IN_OTHER_GROUP} xato.
          </p>
          {preview.problems.length > 0 && (
            <ErrorText>
              Import qilishdan oldin hal qiling:
              <span className="mt-1 block">
                {preview.problems.map((p) => (
                  <span key={p} className="block">
                    • {p}
                  </span>
                ))}
              </span>
            </ErrorText>
          )}
          {preview.groups.map((g) => (
            <div key={g.code} className="space-y-2">
              <h3 className="font-bold">
                {g.name}{' '}
                <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                  {g.count} ta ism
                  {g.expectedCount !== null && ` (ro‘yxatda: ${g.expectedCount} nafar)`}
                  {g.exists ? ' · guruh mavjud' : ' · yangi guruh'}
                </span>
              </h3>
              <TableScroll label={`${g.name}: import ko‘rinishi`}>
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className={tr}>
                      <th className={th}>№</th>
                      <th className={th}>F.I.Sh.</th>
                      <th className={th}>Login</th>
                      <th className={th}>Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r) => {
                      const s = ROW_STATUS[r.status];
                      return (
                        <tr key={`${r.position}-${r.rosterKey}`} className={tr}>
                          <td className={`${td} tabular-nums`}>{r.position}</td>
                          <td className={td}>{r.fullName}</td>
                          <td className={`${td} font-mono`}>{r.login ?? '—'}</td>
                          <td className={td}>
                            <span className={s.tone}>
                              <span aria-hidden="true">{s.icon}</span> {s.label}
                              {r.otherGroup && `: ${r.otherGroup}`}
                            </span>
                            {r.status === 'NAME_MATCH' && r.candidates && (
                              <fieldset className="mt-2 space-y-1">
                                <legend className="sr-only">
                                  {r.fullName}: nima qilish kerak?
                                </legend>
                                {r.candidates.map((c) => (
                                  <label key={c.userId} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`res-${r.rosterKey}`}
                                      checked={
                                        r.resolution?.action === 'LINK' &&
                                        r.resolution.userId === c.userId
                                      }
                                      onChange={() =>
                                        choose(r.rosterKey, { action: 'LINK', userId: c.userId })
                                      }
                                    />
                                    Mavjud hisobga bog‘lash ({c.login ?? c.email ?? 'loginsiz'})
                                  </label>
                                ))}
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`res-${r.rosterKey}`}
                                    checked={r.resolution?.action === 'CREATE'}
                                    onChange={() => choose(r.rosterKey, { action: 'CREATE' })}
                                  />
                                  Yangi hisob ochish
                                </label>
                              </fieldset>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableScroll>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
