'use client';

import {
  DEFINITION_MAX,
  filterTerms,
  TERM_EXAMPLE_MAX,
  TERM_MAX,
  type GlossaryView,
  type TermView,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useId, useMemo, useState, type FormEvent } from 'react';
import { confirmDialog } from '@/components/dialog';
import { TermBody } from '@/components/glossary-ui';
import { Icon } from '@/components/icons';
import { Button, EmptyState, ErrorText, inputClass, LoadState, PageHeader } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

type Lessons = NonNullable<GlossaryView['lessons']>;
type Draft = { term: string; definition: string; example: string; lessonId: string };
const EMPTY: Draft = { term: '', definition: '', example: '', lessonId: '' };

export default function ManageGlossaryPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state, reload } = useApi<GlossaryView>(`${base}/glossary`);
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `${base}/manage`, label: 'Kursni boshqarish' },
        ]}
        title="Atamalar lug‘ati"
        subtitle="Atamani u kiritilgan darsga bog‘lang: talaba darsni tugatgach, atama takrorlash kartalariga qo‘shiladi (oraliqli takrorlash)."
        actions={
          <Link href={`${base}/glossary`} className="btn btn-outline">
            <Icon name="eye" className="size-4" /> Talaba ko‘rinishi
          </Link>
        }
      />
      <LoadState state={state}>{(g) => <Editor g={g} base={base} reload={reload} />}</LoadState>
    </>
  );
}

function Editor({ g, base, reload }: { g: GlossaryView; base: string; reload: () => void }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const lessons = g.lessons ?? [];
  const found = useMemo(() => filterTerms(g.terms, query), [g.terms, query]);

  async function remove(t: TermView) {
    const ok = await confirmDialog({
      title: 'Atamani o‘chirish',
      message: `“${t.term}” lug‘atdan o‘chiriladi. Talabalarning shu kartadagi takrorlash tarixi ham o‘chadi.`,
      confirmLabel: 'O‘chirish',
      tone: 'danger',
    });
    if (!ok) return;
    const res = await send('DELETE', `${base}/glossary/${t.id}`);
    if (res.ok) reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="card h-fit space-y-4 p-6" aria-labelledby="new-term">
        <h2 id="new-term" className="text-lg font-semibold">
          Yangi atama
        </h2>
        <TermForm
          lessons={lessons}
          initial={EMPTY}
          submitLabel="Qo‘shish"
          onSave={async (body) => {
            const res = await send('POST', `${base}/glossary`, body);
            if (res.ok) reload();
            return res.ok ? null : res.message;
          }}
          resetOnSave
        />
      </section>

      <section className="space-y-4" aria-labelledby="terms-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="terms-h" className="text-lg font-semibold">
            Atamalar ({g.terms.length})
          </h2>
          <div className="w-full sm:w-72">
            <label htmlFor="mg-q" className="sr-only">
              Qidirish
            </label>
            <input
              id="mg-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidirish…"
              className={inputClass}
            />
          </div>
        </div>
        {g.terms.length === 0 ? (
          <EmptyState title="Lug‘at bo‘sh">
            Chapdagi forma orqali birinchi atamani qo‘shing.
          </EmptyState>
        ) : found.length === 0 ? (
          <EmptyState title="Hech narsa topilmadi">Boshqa so‘z bilan qidirib ko‘ring.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {found.map((t) =>
              editing === t.id ? (
                <li key={t.id} className="card space-y-3 p-5">
                  <TermForm
                    lessons={lessons}
                    initial={{
                      term: t.term,
                      definition: t.definition,
                      example: t.example,
                      lessonId: t.lessonId ?? '',
                    }}
                    submitLabel="Saqlash"
                    onCancel={() => setEditing(null)}
                    onSave={async (body) => {
                      const res = await send('PATCH', `${base}/glossary/${t.id}`, body);
                      if (!res.ok) return res.message;
                      setEditing(null);
                      reload();
                      return null;
                    }}
                  />
                </li>
              ) : (
                <li key={t.id} className="card space-y-2 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold">{t.term}</h3>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="btn btn-outline px-3 py-1.5 text-sm"
                        onClick={() => setEditing(t.id)}
                        aria-label={`“${t.term}” ni tahrirlash`}
                      >
                        <Icon name="pencil" className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline px-3 py-1.5 text-sm text-rose-700 dark:text-rose-400"
                        onClick={() => void remove(t)}
                        aria-label={`“${t.term}” ni o‘chirish`}
                      >
                        <Icon name="trash" className="size-4" />
                      </button>
                    </div>
                  </div>
                  <TermBody definition={t.definition} example={t.example} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t.lessonTitle
                      ? `Dars: ${t.lessonTitle}`
                      : 'Darsga bog‘lanmagan — talabalarga darhol ochiq'}
                  </p>
                </li>
              ),
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

function TermForm({
  lessons,
  initial,
  submitLabel,
  onSave,
  onCancel,
  resetOnSave = false,
}: {
  lessons: Lessons;
  initial: Draft;
  submitLabel: string;
  onSave: (body: object) => Promise<string | null>;
  onCancel?: () => void;
  resetOnSave?: boolean;
}) {
  const id = useId();
  const [d, setD] = useState<Draft>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const set = (k: keyof Draft) => (e: { target: { value: string } }) =>
    setD((x) => ({ ...x, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!d.term.trim() || d.definition.trim().length < 3) {
      return setError('Atama va ta’rifni yozing');
    }
    setPending(true);
    setError(null);
    const message = await onSave({
      term: d.term,
      definition: d.definition,
      example: d.example,
      lessonId: d.lessonId || null,
    });
    setPending(false);
    if (message) return setError(message);
    if (resetOnSave) setD({ ...EMPTY, lessonId: d.lessonId });
  }

  // Lessons grouped by module for the select.
  const modules = useMemo(() => {
    const m = new Map<string, Lessons>();
    for (const l of lessons) m.set(l.module, [...(m.get(l.module) ?? []), l]);
    return [...m.entries()];
  }, [lessons]);

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div className="space-y-1">
        <label htmlFor={`${id}-t`} className="block text-sm font-semibold">
          Atama
        </label>
        <input
          id={`${id}-t`}
          value={d.term}
          onChange={set('term')}
          maxLength={TERM_MAX}
          className={inputClass}
          required
        />
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-d`} className="block text-sm font-semibold">
          Ta’rif
        </label>
        <textarea
          id={`${id}-d`}
          value={d.definition}
          onChange={set('definition')}
          maxLength={DEFINITION_MAX}
          rows={3}
          className={inputClass}
          aria-describedby={`${id}-dh`}
          required
        />
        <p id={`${id}-dh`} className="text-xs text-slate-600 dark:text-slate-400">
          Kodni `teskari tirnoq` ichida yozing.
        </p>
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-e`} className="block text-sm font-semibold">
          Kod misoli{' '}
          <span className="font-normal text-slate-600 dark:text-slate-400">(ixtiyoriy)</span>
        </label>
        <textarea
          id={`${id}-e`}
          value={d.example}
          onChange={set('example')}
          maxLength={TERM_EXAMPLE_MAX}
          rows={2}
          spellCheck={false}
          className={`${inputClass} font-mono text-sm`}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-l`} className="block text-sm font-semibold">
          Dars
        </label>
        <select id={`${id}-l`} value={d.lessonId} onChange={set('lessonId')} className={inputClass}>
          <option value="">— darsga bog‘lanmagan —</option>
          {modules.map(([mod, ls]) => (
            <optgroup key={mod} label={mod}>
              {ls.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saqlanmoqda…' : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Bekor qilish
          </Button>
        )}
      </div>
    </form>
  );
}
