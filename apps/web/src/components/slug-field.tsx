'use client';

import { slugify, type SlugSuggestion } from '@webdizayn/shared';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { inputClass } from './ui';

type Preview = { kind: 'idle' } | { kind: 'ready'; data: SlugSuggestion } | { kind: 'error' };

/**
 * Asks the server which slug it would assign (debounced). Only a preview: create and update
 * check uniqueness again inside a transaction.
 */
export function useSlugPreview(orgId: string, slug: string, courseId?: string): Preview {
  const [preview, setPreview] = useState<Preview>({ kind: 'idle' });
  const final = slugify(slug);
  useEffect(() => {
    if (!final) return;
    let live = true;
    const t = setTimeout(async () => {
      const q = new URLSearchParams({ slug: final, ...(courseId ? { courseId } : {}) });
      const res = await api<SlugSuggestion>(`/orgs/${orgId}/courses/slug-suggestion?${q}`);
      if (live) setPreview(res.ok ? { kind: 'ready', data: res.data } : { kind: 'error' });
    }, 300);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [orgId, final, courseId]);
  if (!final) return { kind: 'idle' };
  if (preview.kind === 'ready' && preview.data.requested !== final) return { kind: 'idle' };
  return preview;
}

export function SlugField({
  id,
  value,
  onChange,
  preview,
  manual,
  mode,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  preview: Preview;
  manual: boolean;
  /** create: a taken slug gets "-2"; edit: a taken slug is refused. */
  mode: 'create' | 'edit';
}) {
  const final = slugify(value);
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        Manzil (slug)
      </label>
      <div className="flex items-stretch overflow-hidden rounded-control border border-line-strong bg-panel focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600">
        <span className="flex items-center border-r border-line bg-subtle px-3 text-sm text-muted">
          /kurslar/
        </span>
        <input
          id={id}
          name="slug"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={80}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={`${id}-hint`}
          className={`${inputClass} min-w-0 flex-1 rounded-none border-0 focus:outline-none focus-visible:outline-none`}
        />
      </div>
      <p id={`${id}-hint`} className="text-sm text-muted" aria-live="polite">
        {!final ? (
          'Kichik lotin harflari, raqamlar va “-”. Nomdan avtomatik yasaladi.'
        ) : preview.kind === 'ready' && !preview.data.available ? (
          mode === 'create' ? (
            <>
              “{preview.data.requested}” band — kurs <strong>{preview.data.slug}</strong> manzilini
              oladi.
            </>
          ) : (
            <span className="text-red-700 dark:text-red-400">
              “{preview.data.requested}” boshqa kursda band. Masalan, “{preview.data.slug}”ni
              tanlang.
            </span>
          )
        ) : (
          <>
            {manual ? 'Qo‘lda kiritilgan' : 'Nomdan yasaldi'}
            {preview.kind === 'ready' ? ' · bo‘sh' : ''}
            {preview.kind === 'error' ? ' · bandligini tekshirib bo‘lmadi' : ''}
          </>
        )}
      </p>
    </div>
  );
}
