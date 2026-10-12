'use client';

import type { ProjectFile } from '@webdizayn/shared';
import { useEffect, useState, type ReactNode } from 'react';
import { SANDBOX_URL } from '@/lib/sandbox';
import { CodeEditor } from './code-editor';
import { FileTree } from './file-tree';
import { useRunner, type RunStatus } from './use-runner';

const STATUS: Record<RunStatus, { label: string; tone: string }> = {
  idle: { label: 'Ishga tushirilmagan', tone: 'text-slate-400' },
  running: { label: 'Ishlamoqda…', tone: 'text-sky-300' },
  ok: { label: 'Tayyor', tone: 'text-emerald-400' },
  timeout: { label: 'Vaqt tugadi: kod juda uzoq ishladi', tone: 'text-amber-400' },
};

const LINE_TONE = {
  log: 'text-slate-200',
  info: 'text-sky-300',
  warn: 'text-amber-300 bg-amber-500/10',
  error: 'text-red-300 bg-red-500/10',
} as const;

/**
 * Web IDE: file tree + Monaco + sandboxed live preview + console.
 * RUN is a local preview only; it never changes progress or grades.
 */
export function Playground({
  files,
  onChange,
  toolbar,
  namespace = '',
  readOnly = false,
  onRunErrors,
}: {
  files: ProjectFile[];
  onChange: (files: ProjectFile[]) => void;
  /** Error lines of the latest RUN (and a timeout), e.g. for the AI tutor. */
  onRunErrors?: (errors: string[]) => void;
  /** Extra actions (save, reset) rendered next to RUN. */
  toolbar?: ReactNode;
  /** Prefix for editor models, needed when two playgrounds are on one page. */
  namespace?: string;
  /** View and run only: no edits, no file operations. */
  readOnly?: boolean;
}) {
  const [active, setActive] = useState(files[0]?.path ?? 'index.html');
  const current = files.find((f) => f.path === active) ?? files[0];
  const { frameRef, frameKey, status, lines, run, clearConsole } = useRunner();
  const doRun = () => run(files);

  useEffect(() => {
    if (!onRunErrors) return;
    const errors = lines.filter((l) => l.level === 'error').map((l) => l.text);
    if (status === 'timeout')
      errors.push('RUN vaqti tugadi: kod juda uzoq ishladi (cheksiz sikl?)');
    onRunErrors(errors.slice(-5));
  }, [lines, status, onRunErrors]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#1e1e1e] text-slate-200 shadow-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-ink px-4 py-2.5">
        <button
          type="button"
          onClick={doRun}
          className="btn bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-400"
          title="Ctrl+Enter"
        >
          <span aria-hidden="true">▶</span> Ishga tushirish
        </button>
        <span role="status" className={`text-sm ${STATUS[status].tone}`}>
          {STATUS[status].label}
        </span>
        <span className="hidden text-xs text-slate-500 md:inline">Ctrl+Enter</span>
        <div className="ml-auto flex flex-wrap gap-2">{toolbar}</div>
      </div>

      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
        <aside className="border-b border-white/10 p-3 lg:border-r lg:border-b-0">
          <FileTree
            readOnly={readOnly}
            files={files}
            active={current?.path ?? ''}
            onSelect={setActive}
            onChange={(next, select) => {
              onChange(next);
              if (select) setActive(select);
            }}
          />
        </aside>

        <div className="h-[460px] border-b border-white/10 lg:h-[560px] lg:border-r lg:border-b-0">
          {current && (
            <CodeEditor
              path={current.path}
              modelPath={`${namespace}${current.path}`}
              value={current.content}
              readOnly={readOnly}
              onRun={doRun}
              onChange={(content) =>
                onChange(files.map((f) => (f.path === current.path ? { ...f, content } : f)))
              }
            />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-slate-400">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Natija (xavfsiz sandbox)
          </div>
          <iframe
            key={frameKey}
            ref={frameRef}
            title="Natija oynasi"
            src={`${SANDBOX_URL}/runner.html`}
            // Runner gets an opaque origin: no cookies, storage, parent DOM or navigation.
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            className="h-80 w-full bg-white lg:h-[340px]"
          />
          <section
            aria-label="Konsol"
            className="flex min-h-0 flex-1 flex-col border-t border-white/10"
          >
            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400">
              <span>Konsol</span>
              <button type="button" onClick={clearConsole} className="hover:text-white">
                Tozalash
              </button>
            </div>
            <ol
              aria-live="polite"
              className="max-h-48 flex-1 overflow-auto px-2 pb-2 font-mono text-[12.5px] lg:max-h-none"
            >
              {lines.length === 0 && (
                <li className="px-1 py-1 text-slate-500">
                  console.log natijalari shu yerda chiqadi
                </li>
              )}
              {lines.map((l, i) => (
                <li
                  key={i}
                  className={`rounded px-1.5 py-0.5 break-words whitespace-pre-wrap ${LINE_TONE[l.level]}`}
                >
                  {l.text}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
