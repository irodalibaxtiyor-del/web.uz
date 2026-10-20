'use client';

import type { ProjectFile } from '@webdizayn/shared';
import { useEffect, useState } from 'react';
import { Playground } from '@/components/ide/playground';
import { confirmDialog } from '@/components/dialog';

const STORAGE_KEY = 'wd-playground-v1';

const STARTER: ProjectFile[] = [
  {
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <title>Mening sahifam</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Salom, dunyo!</h1>
    <button id="btn">Bos</button>
    <script src="app.js"></script>
  </body>
</html>
`,
  },
  {
    path: 'style.css',
    content: `body {
  font-family: system-ui, sans-serif;
  padding: 24px;
}

h1 {
  color: #0071dc;
}
`,
  },
  {
    path: 'app.js',
    content: `const btn = document.getElementById('btn');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  console.log('Bosildi:', count);
});
`,
  },
];

function load(): ProjectFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (
      Array.isArray(parsed) &&
      parsed.every((f) => typeof f?.path === 'string' && typeof f?.content === 'string')
    ) {
      return parsed.length ? (parsed as ProjectFile[]) : STARTER;
    }
  } catch {
    // Storage unavailable or corrupt: fall back to the starter project.
  }
  return STARTER;
}

export default function PlaygroundPage() {
  const [files, setFiles] = useState<ProjectFile[] | null>(null);

  // localStorage only exists in the browser; read it after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setFiles(load());
  }, []);

  function update(next: ProjectFile[]) {
    setFiles(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Quota or privacy mode: keep working in memory.
    }
  }

  return (
    <div className="bg-surface/70 py-10 dark:bg-slate-950">
      <div className="container-page space-y-6">
        <header className="space-y-2">
          <span className="section-eyebrow">Playground</span>
          <h1 className="text-3xl font-bold sm:text-4xl">Erkin kod maydoni</h1>
          <p className="max-w-2xl">
            HTML, CSS va JavaScript yozing, so&apos;ng &quot;Ishga tushirish&quot; tugmasini bosing.
            Kod xavfsiz sandbox&apos;da ishlaydi va faqat shu brauzerda saqlanadi.
          </p>
        </header>
        {files ? (
          <Playground
            files={files}
            onChange={update}
            toolbar={
              <button
                type="button"
                onClick={async () => {
                  const ok = await confirmDialog({
                    title: 'Namunaga qaytarish',
                    message: "Kodingiz o'chadi va boshlang'ich namuna tiklanadi.",
                    confirmLabel: 'Qaytarish',
                    tone: 'danger',
                  });
                  if (ok) update(STARTER);
                }}
                className="btn border border-white/20 py-2 text-slate-200 hover:bg-white/10"
              >
                Namunaga qaytarish
              </button>
            }
          />
        ) : (
          <div
            role="status"
            className="h-[560px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        )}
      </div>
    </div>
  );
}
