'use client';

import type { CheckAssertion, CheckPreviewResult, ProjectFile } from '@webdizayn/shared';
import { useId, useMemo, useState } from 'react';
import { CHECK_ERROR_TEXT, CHECK_STATUS } from '@/components/check-result';
import { Playground } from '@/components/ide/playground';
import { Button, ErrorText } from '@/components/ui';
import { send } from '@/lib/api';
import { EXAMPLE_RULES, parseRules } from '@/lib/check-rules';
import { Icon } from './icons';

function describe(a: CheckAssertion): string {
  switch (a.type) {
    case 'count':
      return a.max === undefined
        ? `"${a.selector}" soni ≥ ${a.min}`
        : `"${a.selector}" soni ${a.min}…${a.max}`;
    case 'text':
      return `"${a.selector}" matni ${a.match === 'equals' ? '=' : '∋'} "${a.value}"`;
    case 'attribute':
      return `"${a.selector}" [${a.name}${a.value === undefined ? '' : `="${a.value}"`}]`;
    case 'style':
      return `"${a.selector}${a.pseudo ?? ''}" { ${a.property}: ${a.value} }`;
    case 'noConsoleErrors':
      return 'Konsolda xato yo‘q';
  }
}

/** Staff-only editor for hidden CHECK rules, with a dry run against a reference solution. */
export function ChecksEditor({
  purpose = 'exercise',
  previewUrl,
  text,
  onChange,
  starterFiles,
}: {
  /** Exercise CHECK sets the status; assignment CHECK is informational only. */
  purpose?: 'exercise' | 'assignment';
  /** Staff dry-run endpoint (exercise or assignment). */
  previewUrl: string;
  text: string;
  onChange: (text: string) => void;
  starterFiles: ProjectFile[];
}) {
  const id = useId();
  const parsed = useMemo(() => parseRules(text), [text]);
  const [solution, setSolution] = useState<ProjectFile[]>(starterFiles);
  const [preview, setPreview] = useState<CheckPreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function runPreview() {
    if (!parsed.ok || parsed.rules.length === 0) return;
    setError(null);
    setPreview(null);
    setPending(true);
    const res = await send<CheckPreviewResult>('POST', previewUrl, {
      files: solution,
      checks: parsed.rules,
    });
    setPending(false);
    if (!res.ok) return setError(res.message);
    setPreview(res.data);
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold">Avtomatik tekshiruv (CHECK)</legend>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Qoidalar talabaga yuborilmaydi. Talaba faqat ko‘rinadigan qoidalarning nomi va maslahatini,
        yashirin qoidalar (<code>&quot;hidden&quot;: true</code>) bo‘yicha esa faqat sonini ko‘radi.
        Tekshiruv serverda haqiqiy brauzerda bajariladi.{' '}
        {purpose === 'exercise'
          ? 'Hamma qoida bajarilsa mashq "O‘tdi" bo‘ladi.'
          : 'Har topshirilgan versiya tekshiriladi. Natija baho emas: u sizga va talabaga ma’lumot uchun.'}
      </p>

      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={`${id}-rules`} className="text-sm font-medium">
            Qoidalar (JSON)
          </label>
          {text.trim() === '' || text.trim() === '[]' ? (
            <Button
              variant="secondary"
              onClick={() => onChange(JSON.stringify(EXAMPLE_RULES, null, 2))}
            >
              Namuna qoidalarni qo‘yish
            </Button>
          ) : null}
        </div>
        <textarea
          id={`${id}-rules`}
          value={text}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(null);
          }}
          rows={14}
          spellCheck={false}
          aria-describedby={`${id}-rules-status`}
          aria-invalid={!parsed.ok}
          className="field font-mono text-xs"
        />
        <details className="text-xs text-slate-500 dark:text-slate-400">
          <summary className="cursor-pointer">Qoida turlari</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <code>count</code>: selector, min, max (max: 0 — element bo‘lmasligi kerak)
            </li>
            <li>
              <code>text</code>: selector, value, match (contains | equals), caseSensitive
            </li>
            <li>
              <code>attribute</code>: selector, name, value (ixtiyoriy)
            </li>
            <li>
              <code>style</code>: selector, property, value (hisoblangan CSS, masalan red = rgb(255,
              0, 0)), pseudo (ixtiyoriy: ::before, ::after, ::first-letter, ::first-line, ::marker,
              ::placeholder); property CSS o‘zgaruvchisi ham bo‘lishi mumkin (--rang)
            </li>
            <li>
              <code>noConsoleErrors</code>: yuklanish va amallarda JS xatosi yo‘q
            </li>
            <li>
              <code>viewport</code>: {'{ width, height }'} — responsive shartlar uchun
            </li>
            <li>
              <code>actions</code>: click, hover, fill (value), press (key), wait (ms) —
              tekshiruvdan oldin bajariladi
            </li>
          </ul>
        </details>
      </div>

      <div id={`${id}-rules-status`}>
        {parsed.ok ? (
          parsed.rules.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {purpose === 'exercise'
                ? 'Qoida yo‘q: talaba "Tekshirish" tugmasini ko‘rmaydi, natijani siz belgilaysiz.'
                : 'Qoida yo‘q: topshirilgan versiyalar avtomatik tekshirilmaydi.'}
            </p>
          ) : (
            <ol className="space-y-1 text-sm">
              {parsed.rules.map((r) => (
                <li key={r.id} className="flex flex-wrap gap-x-2">
                  <span className="font-medium">{r.title}</span>
                  {r.hidden && (
                    <span className="rounded bg-slate-200 px-1.5 text-xs dark:bg-slate-700">
                      yashirin
                    </span>
                  )}
                  {r.viewport && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {r.viewport.width}×{r.viewport.height}
                    </span>
                  )}
                  <code className="text-xs text-slate-500 dark:text-slate-400">
                    {r.actions.length > 0 && `${r.actions.map((a) => a.type).join(' → ')} → `}
                    {describe(r.assert)}
                  </code>
                </li>
              ))}
            </ol>
          )
        ) : (
          <ErrorText>
            <span className="block">Qoidalarda xato:</span>
            {parsed.errors.map((e) => (
              <span key={e} className="block font-mono text-xs">
                {e}
              </span>
            ))}
          </ErrorText>
        )}
      </div>

      {parsed.ok && parsed.rules.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Namuna yechim bilan sinash</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Bu yerga to‘g‘ri yechimni yozing va qoidalarni sinab ko‘ring. Namuna yechim saqlanmaydi
            va talabaga ko‘rinmaydi.
          </p>
          <Playground
            namespace="solution/"
            files={solution}
            onChange={(f) => {
              setSolution(f);
              setPreview(null);
            }}
            toolbar={
              <button
                type="button"
                onClick={runPreview}
                disabled={pending}
                className="btn btn-accent py-2"
              >
                {pending ? 'Tekshirilmoqda…' : 'Sinab ko‘rish'}
              </button>
            }
          />
          {error && <ErrorText>{error}</ErrorText>}
          {preview && (
            <div role="status" className="space-y-2 rounded-xl bg-surface p-4 dark:bg-slate-800/50">
              <p className={`font-semibold ${CHECK_STATUS[preview.status].tone}`}>
                <Icon
                  name={CHECK_STATUS[preview.status].icon}
                  className="inline size-4 align-[-0.2em]"
                />{' '}
                {CHECK_STATUS[preview.status].label}{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({(preview.durationMs / 1000).toFixed(1)} s)
                </span>
              </p>
              {preview.errorCode && (
                <p className="text-sm">{CHECK_ERROR_TEXT[preview.errorCode]}</p>
              )}
              <ul className="space-y-1 text-sm">
                {preview.checks.map((c) => (
                  <li key={c.id}>
                    <Icon
                      name={c.passed ? 'checkCircle' : 'circleX'}
                      className={`inline size-4 align-[-0.2em] ${c.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}
                    />{' '}
                    <span className="sr-only">{c.passed ? 'Bajarildi: ' : 'Bajarilmadi: '}</span>
                    {c.title}
                    {c.hidden && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {' '}
                        (yashirin)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </fieldset>
  );
}
