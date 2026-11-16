'use client';

import Editor, { loader, type BeforeMount, type OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

// Serve Monaco from our own origin (copied to public/monaco by scripts/copy-monaco.mjs).
loader.config({ paths: { vs: '/monaco/vs' } });

const THEME = 'wd-dark';

const LANGUAGE: Record<string, string> = { html: 'html', css: 'css', js: 'javascript' };

export function languageFor(path: string): string {
  return LANGUAGE[path.split('.').pop()?.toLowerCase() ?? ''] ?? 'plaintext';
}

export function CodeEditor({
  path,
  modelPath = path,
  value,
  onChange,
  onRun,
  readOnly = false,
}: {
  path: string;
  /** Monaco model URI; differs from `path` when several editors share a page. */
  modelPath?: string;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
}) {
  // Monaco registers commands once; keep the latest callback in a ref.
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  // vs-dark with line numbers that meet WCAG AA on #1e1e1e (the dimmed final-line number
  // is #474747 there, 1.8:1).
  const beforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme(THEME, {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editorLineNumber.foreground': '#9d9d9d',
        'editorLineNumber.dimmedForeground': '#8f8f8f',
        'editorLineNumber.activeForeground': '#e6e6e6',
      },
    });
  };

  const onMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
  };

  return (
    <Editor
      // `path` gives each file its own model, undo history and language.
      path={modelPath}
      language={languageFor(path)}
      value={value}
      theme={THEME}
      onChange={(v) => onChange(v ?? '')}
      beforeMount={beforeMount}
      onMount={onMount}
      loading={<span className="text-sm text-slate-400">Muharrir yuklanmoqda…</span>}
      options={{
        ariaLabel: `${path} fayli muharriri`,
        readOnly,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 2,
        wordWrap: 'on',
        automaticLayout: true,
        padding: { top: 12 },
      }}
    />
  );
}
