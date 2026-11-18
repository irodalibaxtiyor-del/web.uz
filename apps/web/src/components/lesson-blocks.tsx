'use client';

import { parseCheckBlock, type CheckBlock, type LessonBlockKind } from '@webdizayn/shared';
import { useEffect, useId, useState } from 'react';
import { Icon } from './icons';
import { useRunner } from './ide/use-runner';
import { Markdown, OptionText, QuestionText } from './markdown';
import { SANDBOX_URL } from '@/lib/sandbox';

/** Renders one interactive lesson block (see `lesson-blocks.ts` in shared for the syntax). */
export function LessonBlock({
  kind,
  meta,
  body,
}: {
  kind: LessonBlockKind;
  meta: string;
  body: string;
}) {
  if (kind === 'tekshir') {
    const r = parseCheckBlock(body);
    // Broken blocks cannot be saved; this only guards very old content.
    if ('errors' in r) return null;
    return <SelfCheck block={r.block} />;
  }
  if (kind === 'jonli') return <LiveExample code={body} />;
  return <Reveal title={meta || 'Javobni ko‘rish'} body={body} />;
}

/** Instant formative self-check: nothing is graded or stored. */
function SelfCheck({ block }: { block: CheckBlock }) {
  const id = useId();
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(false);
  const right =
    picked.length > 0 && block.options.every((o, i) => o.correct === picked.includes(i));

  function toggle(i: number) {
    setChecked(false);
    setShown(false);
    setPicked((p) =>
      block.multiple ? (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]) : [i],
    );
  }

  return (
    <section
      aria-labelledby={`${id}-q`}
      className="not-prose my-6 space-y-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/40"
    >
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-brand-700 uppercase dark:text-brand-300">
        <Icon name="checkCircle" className="size-4" />
        O‘zingizni tekshiring
      </p>
      <div id={`${id}-q`} className="font-medium">
        <QuestionText>{block.prompt}</QuestionText>
      </div>
      {block.multiple && (
        <p className="text-sm text-slate-600 dark:text-slate-400">Bir nechta javobni belgilang.</p>
      )}
      <fieldset className="space-y-2">
        <legend className="sr-only">Variantlar</legend>
        {block.options.map((o, i) => (
          <label
            key={i}
            className="quiz-option flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line bg-panel px-3 py-2"
          >
            <input
              type={block.multiple ? 'checkbox' : 'radio'}
              name={`${id}-o`}
              checked={picked.includes(i)}
              onChange={() => toggle(i)}
              className="size-4 accent-brand-600"
            />
            <span>
              <OptionText>{o.text}</OptionText>
            </span>
            {shown && o.correct && (
              <span className="ml-auto text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                to‘g‘ri javob
              </span>
            )}
          </label>
        ))}
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-primary py-2"
          disabled={picked.length === 0}
          onClick={() => setChecked(true)}
        >
          Tekshirish
        </button>
        {checked && (
          <button
            type="button"
            className="btn border border-line py-2"
            onClick={() => {
              setPicked([]);
              setChecked(false);
              setShown(false);
            }}
          >
            Qayta urinish
          </button>
        )}
        {checked && !right && !shown && (
          <button
            type="button"
            className="btn border border-line py-2"
            onClick={() => setShown(true)}
          >
            Javobni ko‘rsatish
          </button>
        )}
      </div>
      <div aria-live="polite">
        {checked && (
          <div
            className={`quiz-option rounded-lg px-4 py-3 text-sm ${
              right
                ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
            }`}
          >
            <p className="font-semibold">
              {right ? 'To‘g‘ri!' : 'Hali emas — yana o‘ylab ko‘ring.'}
            </p>
            {(right || shown) && (
              <p className="mt-1 whitespace-pre-line">
                <OptionText>{block.explanation}</OptionText>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** Editable example run in the sandbox runner (separate site, sandboxed iframe). */
function LiveExample({ code }: { code: string }) {
  const id = useId();
  const [text, setText] = useState(code);
  const { frameRef, frameKey, status, run } = useRunner();

  useEffect(() => {
    run([{ path: 'index.html', content: code }]);
  }, [code, run]);

  return (
    <section
      aria-labelledby={`${id}-h`}
      className="not-prose my-6 overflow-hidden rounded-2xl border border-line"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-subtle px-4 py-2">
        <p id={`${id}-h`} className="flex items-center gap-2 text-sm font-semibold">
          <Icon name="code" className="size-4" />
          Jonli misol — kodni o‘zgartirib, natijani ko‘ring
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary py-1.5 text-sm"
            onClick={() => run([{ path: 'index.html', content: text }])}
          >
            Ishga tushirish
          </button>
          <button
            type="button"
            className="btn border border-line py-1.5 text-sm"
            onClick={() => {
              setText(code);
              run([{ path: 'index.html', content: code }]);
            }}
          >
            Asl holiga
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2">
        <label htmlFor={`${id}-code`} className="sr-only">
          Misol kodi
        </label>
        <textarea
          id={`${id}-code`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          rows={Math.min(16, Math.max(6, text.split('\n').length + 1))}
          className="w-full resize-y bg-ink p-4 font-mono text-sm text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        />
        <div className="min-h-48 bg-white">
          <iframe
            key={frameKey}
            ref={frameRef}
            title="Jonli misol natijasi"
            src={`${SANDBOX_URL}/runner.html`}
            sandbox="allow-scripts"
            className="h-full min-h-48 w-full border-0"
          />
        </div>
      </div>
      {status === 'timeout' && (
        <p role="status" className="px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
          Kod juda uzoq ishladi va to‘xtatildi.
        </p>
      )}
    </section>
  );
}

function Reveal({ title, body }: { title: string; body: string }) {
  return (
    <details className="not-prose my-6 rounded-2xl border border-line bg-subtle p-4 [&[open]>summary]:mb-3">
      <summary className="cursor-pointer font-semibold text-brand-700 dark:text-brand-300">
        {title}
      </summary>
      <Markdown>{body}</Markdown>
    </details>
  );
}
