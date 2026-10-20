'use client';

import { PROJECT_MAX_FILES, PROJECT_PATH_RE, type ProjectFile } from '@webdizayn/shared';
import { useId, useState, type FormEvent } from 'react';
import { Icon } from '../icons';

const ICON_TONE: Record<string, string> = {
  html: 'text-orange-500',
  css: 'text-sky-500',
  js: 'text-yellow-500',
};

const PATH_HELP = 'Masalan: index.html, css/style.css, js/app.js';

export function validateNewPath(
  path: string,
  files: ProjectFile[],
  except?: string,
): string | null {
  if (!PROJECT_PATH_RE.test(path)) return `Fayl nomi noto'g'ri. ${PATH_HELP}`;
  const lower = path.toLowerCase();
  if (files.some((f) => f.path.toLowerCase() === lower && f.path !== except)) {
    return 'Bunday fayl allaqachon bor';
  }
  return null;
}

export function FileTree({
  files,
  active,
  onSelect,
  onChange,
  readOnly = false,
}: {
  files: ProjectFile[];
  active: string;
  onSelect: (path: string) => void;
  onChange: (files: ProjectFile[], select?: string) => void;
  readOnly?: boolean;
}) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));

  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const path = String(new FormData(form).get('path') ?? '').trim();
    if (files.length >= PROJECT_MAX_FILES)
      return setError(`Ko'pi bilan ${PROJECT_MAX_FILES} ta fayl`);
    const problem = validateNewPath(path, files);
    if (problem) return setError(problem);
    setError(null);
    form.reset();
    onChange([...files, { path, content: '' }], path);
  }

  function rename(path: string) {
    const next = window.prompt('Yangi nom:', path)?.trim();
    if (!next || next === path) return;
    const problem = validateNewPath(next, files, path);
    if (problem) return setError(problem);
    setError(null);
    onChange(
      files.map((f) => (f.path === path ? { ...f, path: next } : f)),
      active === path ? next : active,
    );
  }

  function remove(path: string) {
    if (files.length <= 1) return setError("Oxirgi faylni o'chirib bo'lmaydi");
    if (!window.confirm(`${path} faylini o'chirasizmi?`)) return;
    setError(null);
    const rest = files.filter((f) => f.path !== path);
    onChange(rest, active === path ? rest[0]!.path : active);
  }

  return (
    <div className="flex h-full flex-col gap-3 text-sm">
      <p
        id={`${id}-label`}
        className="px-1 text-xs font-semibold tracking-wide text-slate-400 uppercase"
      >
        Fayllar
      </p>
      <ul aria-labelledby={`${id}-label`} className="space-y-0.5">
        {sorted.map((f) => {
          const ext = f.path.split('.').pop() ?? '';
          const isActive = f.path === active;
          return (
            <li key={f.path} className="group flex items-center">
              <button
                type="button"
                onClick={() => onSelect(f.path)}
                aria-current={isActive ? 'true' : undefined}
                className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left font-mono text-[13px] ${
                  isActive
                    ? 'bg-brand-600/20 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`text-[10px] font-bold uppercase ${ICON_TONE[ext] ?? ''}`}
                >
                  {ext}
                </span>
                <span className="truncate">{f.path}</span>
              </button>
              <span
                className={readOnly ? 'hidden' : 'hidden group-focus-within:flex group-hover:flex'}
              >
                <button
                  type="button"
                  onClick={() => rename(f.path)}
                  aria-label={`${f.path}: nomini o'zgartirish`}
                  className="grid size-7 place-items-center rounded text-slate-400 hover:text-white"
                >
                  <Icon name="pencil" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(f.path)}
                  aria-label={`${f.path}: o'chirish`}
                  className="grid size-7 place-items-center rounded text-slate-400 hover:text-red-400"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <form onSubmit={add} noValidate hidden={readOnly} className="mt-auto space-y-2">
        <label htmlFor={`${id}-new`} className="sr-only">
          Yangi fayl nomi
        </label>
        <div className="flex gap-1">
          <input
            id={`${id}-new`}
            name="path"
            placeholder="yangi.css"
            className="w-full min-w-0 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 font-mono text-[13px] text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Fayl qo'shish"
            className="shrink-0 rounded-md bg-white/10 px-2.5 text-white hover:bg-white/20"
          >
            +
          </button>
        </div>
        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
