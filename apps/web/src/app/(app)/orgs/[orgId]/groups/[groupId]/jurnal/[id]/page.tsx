'use client';

import {
  columnLabel,
  GRADE_BAND_LABEL,
  GRADE_BANDS,
  type GradebookColumn,
  type GradebookImportPreview,
  type GradebookImportResult,
  type GradebookView,
} from '@webdizayn/shared';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useRef, useState, type FormEvent } from 'react';
import { StatTile } from '@/components/analytics-ui';
import { confirmDialog, promptDialog } from '@/components/dialog';
import { BandLegend, ScoreBadge } from '@/components/gradebook-ui';
import { Icon } from '@/components/icons';
import { Button, ErrorText, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { api, download, send, upload } from '@/lib/api';
import { useApi } from '@/lib/use-api';

/** "85,5" → 85.5; "" → null; anything else → undefined (invalid). */
function parseInput(raw: string): number | null | undefined {
  const t = raw.trim().replace(',', '.');
  if (t === '') return null;
  if (!/^\d{1,3}(\.\d)?$/.test(t)) return undefined;
  const n = Number(t);
  return n <= 100 ? n : undefined;
}
const cellKey = (c: string, u: string) => `${c}|${u}`;

export default function GradebookPage() {
  const { orgId, groupId, id } = useParams<{ orgId: string; groupId: string; id: string }>();
  const path = `/orgs/${orgId}/groups/${groupId}/gradebooks/${id}`;
  const { state, setState } = useApi<GradebookView>(path);
  return (
    <LoadState state={state}>
      {(v) => (
        <Editor
          v={v}
          path={path}
          backHref={`/orgs/${orgId}/groups/${groupId}`}
          orgId={orgId}
          onChange={(next) => setState({ kind: 'ready', data: next })}
        />
      )}
    </LoadState>
  );
}

function Editor({
  v,
  path,
  backHref,
  orgId,
  onChange,
}: {
  v: GradebookView;
  path: string;
  backHref: string;
  orgId: string;
  onChange: (v: GradebookView) => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const invalid = useMemo(
    () =>
      Object.entries(draft)
        .filter(([, raw]) => parseInput(raw) === undefined)
        .map(([k]) => k),
    [draft],
  );
  const changed = useMemo(() => {
    return Object.entries(draft).flatMap(([k, raw]) => {
      const [columnId, userId] = k.split('|') as [string, string];
      const score = parseInput(raw);
      const before = v.students.find((s) => s.userId === userId)?.scores[columnId] ?? null;
      return score === undefined || score === before ? [] : [{ columnId, userId, score }];
    });
  }, [draft, v]);

  async function save() {
    if (invalid.length)
      return setError('Ba’zi kataklarda noto‘g‘ri qiymat: 0 dan 100 gacha son yozing.');
    if (changed.length === 0) {
      setEditing(false);
      return;
    }
    setPending(true);
    setError(null);
    const r = await send<GradebookView>('PUT', `${path}/scores`, { entries: changed });
    setPending(false);
    if (!r.ok) return setError(r.message);
    onChange(r.data);
    setDraft({});
    setEditing(false);
    setNotice(`${changed.length} ta baho saqlandi.`);
  }

  async function removeColumn(c: GradebookColumn) {
    const ok = await confirmDialog({
      title: 'Ustunni o‘chirish',
      message: `“${columnLabel(c)}” ustuni va undagi barcha baholar o‘chiriladi.`,
      confirmLabel: 'O‘chirish',
      tone: 'danger',
    });
    if (!ok) return;
    const r = await send<GradebookView>('DELETE', `${path}/columns/${c.id}`);
    if (!r.ok) return setError(r.message);
    onChange(r.data);
  }

  async function renameColumn(c: GradebookColumn) {
    const title = await promptDialog({
      title: 'Mavzu nomi',
      message: c.date ? `Sana: ${columnLabel({ title: '', date: c.date })}` : undefined,
      label: 'Mavzu',
      defaultValue: c.title,
      confirmLabel: 'Saqlash',
    });
    if (title === null) return;
    const r = await send<GradebookView>('PATCH', `${path}/columns/${c.id}`, {
      title,
      date: c.date,
    });
    if (!r.ok) return setError(r.message);
    onChange(r.data);
  }

  async function renameBook() {
    const title = await promptDialog({
      title: 'Jurnal nomi',
      label: 'Fan nomi',
      defaultValue: v.title,
      confirmLabel: 'Saqlash',
    });
    if (title === null) return;
    const r = await send<GradebookView>('PATCH', path, { title });
    if (!r.ok) return setError(r.message);
    onChange(r.data);
  }

  async function removeBook() {
    const ok = await confirmDialog({
      title: 'Jurnalni o‘chirish',
      message: `“${v.title}” jurnali va undagi barcha baholar butunlay o‘chiriladi.`,
      confirmLabel: 'O‘chirish',
      tone: 'danger',
    });
    if (!ok) return;
    const r = await send('DELETE', path);
    if (!r.ok) return setError(r.message);
    router.push(`${backHref}/jurnal`);
  }

  async function exportXlsx() {
    const r = await download(`${path}/export.xlsx`, { fallbackName: 'jurnal.xlsx' });
    if (!r.ok) setError(r.message);
  }

  const s = v.stats;
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `/orgs/${orgId}/groups`, label: 'Guruhlarim' },
          { href: backHref, label: v.group.name },
          { href: `${backHref}/jurnal`, label: 'Baholash jurnali' },
        ]}
        title={v.title}
        subtitle="O‘qituvchi darsda qo‘ygan baholar · 100 ballik shkala"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="accent" onClick={() => void exportXlsx()}>
              <Icon name="arrowDown" className="size-4" /> Excel
            </Button>
            <Button variant="secondary" onClick={() => void renameBook()}>
              <Icon name="pencil" className="size-4" /> Nomi
            </Button>
            <Button variant="secondary" onClick={() => void removeBook()}>
              <Icon name="trash" className="size-4" /> O‘chirish
            </Button>
          </div>
        }
      />
      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Talabalar" value={v.students.length} />
          <StatTile label="Darslar (ustunlar)" value={v.columns.length} />
          <StatTile
            label="Guruh o‘rtachasi"
            value={s.average ?? '—'}
            hint="Barcha qo‘yilgan baholar bo‘yicha"
          />
          <StatTile
            label="To‘ldirilgan"
            value={s.totalCells ? `${Math.round((s.filledCells / s.totalCells) * 100)}%` : '—'}
            hint={`${s.filledCells} / ${s.totalCells} katak`}
          />
        </div>

        <section aria-labelledby="bands-h" className="card space-y-3 p-5">
          <h2 id="bands-h" className="font-semibold">
            Talabalar o‘rtacha bali bo‘yicha darajalar
          </h2>
          <ul className="grid gap-2 sm:grid-cols-4">
            {GRADE_BANDS.map((b) => (
              <li key={b} className="rounded-xl border border-line p-3">
                <p className="text-sm text-muted">{GRADE_BAND_LABEL[b]}</p>
                <p className="text-2xl font-semibold tabular-nums">{s.bands[b]}</p>
              </li>
            ))}
          </ul>
        </section>

        <AddColumn path={path} onChange={onChange} onError={setError} />
        <ImportPanel
          path={path}
          onDone={(msg, next) => {
            setNotice(msg);
            onChange(next);
          }}
        />

        <section aria-labelledby="table-h" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="table-h" className="font-display text-xl font-semibold">
              Jurnal
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {editing ? (
                <>
                  <Button onClick={() => void save()} disabled={pending}>
                    <Icon name="check" className="size-4" /> Saqlash ({changed.length})
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setDraft({});
                      setEditing(false);
                      setError(null);
                    }}
                  >
                    Bekor qilish
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setNotice(null);
                    setEditing(true);
                  }}
                  disabled={v.columns.length === 0}
                >
                  <Icon name="pencil" className="size-4" /> Baholarni tahrirlash
                </Button>
              )}
            </div>
          </div>
          <BandLegend />
          {error && <ErrorText>{error}</ErrorText>}
          {notice && (
            <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
              {notice}
            </p>
          )}
          {v.columns.length === 0 ? (
            <p className="text-muted">
              Hali ustun yo‘q. Yuqorida dars (sana yoki mavzu) qo‘shing yoki Excel faylidan yuklang.
            </p>
          ) : (
            <TableScroll label="Baholash jurnali">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="sticky left-0 z-10 bg-surface px-3 py-2 text-left">
                      №
                    </th>
                    <th
                      scope="col"
                      className="sticky left-10 z-10 min-w-56 bg-surface px-3 py-2 text-left"
                    >
                      F.I.Sh.
                    </th>
                    {v.columns.map((c) => (
                      <th
                        key={c.id}
                        scope="col"
                        className="min-w-28 px-2 py-2 align-bottom text-left"
                      >
                        <span className="block text-xs font-normal text-muted">
                          {c.date ? columnLabel({ title: '', date: c.date }) : ''}
                        </span>
                        <span className="block max-w-40 font-semibold">{c.title || '—'}</span>
                        <span className="mt-1 flex gap-1">
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-subtle"
                            aria-label={`“${columnLabel(c)}” mavzusini o‘zgartirish`}
                            onClick={() => void renameColumn(c)}
                          >
                            <Icon name="pencil" className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-subtle"
                            aria-label={`“${columnLabel(c)}” ustunini o‘chirish`}
                            onClick={() => void removeColumn(c)}
                          >
                            <Icon name="trash" className="size-3.5" />
                          </button>
                        </span>
                      </th>
                    ))}
                    <th scope="col" className="px-3 py-2 text-left">
                      O‘rtacha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {v.students.map((st, i) => (
                    <tr key={st.userId} className="border-t border-line">
                      <td className="sticky left-0 bg-surface px-3 py-1.5 tabular-nums text-muted">
                        {i + 1}
                      </td>
                      <th
                        scope="row"
                        className="sticky left-10 bg-surface px-3 py-1.5 text-left font-medium"
                      >
                        {st.fullName}
                      </th>
                      {v.columns.map((c) => {
                        const k = cellKey(c.id, st.userId);
                        const current = st.scores[c.id] ?? null;
                        return (
                          <td key={c.id} className="px-2 py-1.5">
                            {editing ? (
                              <input
                                className="field w-20 py-1 text-center tabular-nums"
                                inputMode="decimal"
                                aria-label={`${st.fullName}, ${columnLabel(c)}`}
                                aria-invalid={invalid.includes(k) || undefined}
                                value={draft[k] ?? (current === null ? '' : String(current))}
                                onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                              />
                            ) : (
                              <ScoreBadge score={current} />
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-1.5">
                        <ScoreBadge score={st.average} />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-line font-semibold">
                    <td className="sticky left-0 bg-surface" />
                    <th scope="row" className="sticky left-10 bg-surface px-3 py-2 text-left">
                      O‘rtacha
                    </th>
                    {s.columnAverages.map((a, i) => (
                      <td key={v.columns[i]!.id} className="px-2 py-2">
                        <ScoreBadge score={a} />
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <ScoreBadge score={s.average} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </TableScroll>
          )}
        </section>
      </div>
    </>
  );
}

function AddColumn({
  path,
  onChange,
  onError,
}: {
  path: string;
  onChange: (v: GradebookView) => void;
  onError: (e: string | null) => void;
}) {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!date && !title.trim()) return onError('Dars uchun sana yoki mavzu yozing.');
    setPending(true);
    onError(null);
    const r = await send<GradebookView>('POST', `${path}/columns`, { date: date || null, title });
    setPending(false);
    if (!r.ok) return onError(r.message);
    onChange(r.data);
    setTitle('');
  }
  return (
    <form
      onSubmit={submit}
      className="card flex flex-wrap items-end gap-3 p-5"
      aria-label="Dars qo‘shish"
    >
      <div>
        <label htmlFor="col-date" className="mb-1 block text-sm font-semibold">
          Sana
        </label>
        <input
          id="col-date"
          type="date"
          className="field"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="min-w-56 flex-1">
        <label htmlFor="col-title" className="mb-1 block text-sm font-semibold">
          Mavzu
        </label>
        <input
          id="col-title"
          className="field"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masalan: CSS selektorlar"
        />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        <Icon name="plus" className="size-4" /> Dars qo‘shish
      </Button>
    </form>
  );
}

function ImportPanel({
  path,
  onDone,
}: {
  path: string;
  onDone: (message: string, v: GradebookView) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<GradebookImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function pick(file: File | undefined) {
    if (!file) return;
    setError(null);
    setPreview(null);
    setPending(true);
    const form = new FormData();
    form.append('file', file);
    const r = await upload<GradebookImportPreview>(`${path}/import/preview`, form);
    setPending(false);
    if (fileRef.current) fileRef.current.value = '';
    if (!r.ok) return setError(r.message);
    setPreview(r.data);
  }

  async function apply() {
    if (!preview) return;
    setPending(true);
    setError(null);
    const r = await send<GradebookImportResult>('POST', `${path}/import`, {
      columns: preview.columns.map(({ title, date }) => ({ title, date })),
      rows: preview.rows.map(({ userId, scores }) => ({ userId, scores })),
    });
    if (!r.ok) {
      setPending(false);
      return setError(r.message);
    }
    const fresh = await api<GradebookView>(path);
    setPending(false);
    setPreview(null);
    if (!fresh.ok) return setError(fresh.message);
    onDone(
      `Import qilindi: ${r.data.cellsWritten} ta baho, ${r.data.columnsCreated} ta yangi dars ustuni.`,
      fresh.data,
    );
  }

  const filled = preview
    ? preview.rows.reduce((n, r) => n + r.scores.filter((x) => x !== null).length, 0)
    : 0;
  return (
    <section aria-labelledby="imp-h" className="card space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="imp-h" className="font-semibold">
            Excel’dan yuklash
          </h2>
          <p className="text-sm text-muted">
            1-qator — sarlavhalar: “F.I.Sh.” ustuni va har dars uchun sana yoki mavzu (masalan,
            “05.09.2026 — HTML teglari”). Ballar 0–100; “nb” yoki bo‘sh katak — baho yo‘q. Shablon
            sifatida “Excel” tugmasi bilan olingan faylni ishlatish mumkin.
          </p>
        </div>
        <label className={`btn btn-outline cursor-pointer ${pending ? 'opacity-60' : ''}`}>
          <Icon name="upload" className="size-4" /> Fayl tanlash (.xlsx, .csv)
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            className="sr-only"
            disabled={pending}
            onChange={(e) => void pick(e.target.files?.[0])}
          />
        </label>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {preview && (
        <div
          className="space-y-3 rounded-xl bg-subtle p-4"
          role="region"
          aria-label="Import natijasini oldindan ko‘rish"
        >
          <p>
            <strong>{preview.rows.length}</strong> talaba moslandi, <strong>{filled}</strong> ta
            baho, <strong>{preview.columns.length}</strong> ta dars ustuni (
            {preview.columns.filter((c) => !c.existing).length} tasi yangi).
          </p>
          <ul className="flex flex-wrap gap-2 text-sm">
            {preview.columns.map((c) => (
              <li
                key={`${c.date}|${c.title}`}
                className="rounded-md border border-line px-2 py-0.5"
              >
                {columnLabel(c)} {c.existing ? '' : '· yangi'}
              </li>
            ))}
          </ul>
          {preview.issues.length > 0 && (
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                E’tibor bering ({preview.issues.length}) — bu qatorlar yoki kataklar olinmaydi:
              </p>
              <ul className="list-disc pl-5 text-sm">
                {preview.issues.slice(0, 50).map((i, n) => (
                  <li key={n}>
                    {i.row > 0 ? `${i.row}-qator: ` : ''}
                    {i.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {preview.missing.length > 0 && (
            <p className="text-sm">
              Faylda yo‘q talabalar ({preview.missing.length}): {preview.missing.join(', ')}
            </p>
          )}
          <p className="text-sm text-muted">
            Faylda bo‘sh katak bo‘lsa, jurnaldagi mavjud baho o‘chirilmaydi.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void apply()} disabled={pending || preview.rows.length === 0}>
              <Icon name="check" className="size-4" /> Import qilish
            </Button>
            <Button variant="secondary" onClick={() => setPreview(null)}>
              Bekor qilish
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
