'use client';

import { LESSON_CONTENT_MAX, validateLessonBlocks } from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { AssignmentsPanel } from '@/components/assignments-panel';
import { ExercisesPanel } from '@/components/exercises-panel';
import { LESSON_BLOCK_TEMPLATES } from '@/components/lesson-block-templates';
import { Markdown } from '@/components/markdown';
import { QuizzesPanel } from '@/components/quizzes-panel';
import { BackLink, Button, ErrorText, inputClass, LoadState } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

interface EditableLesson {
  id: string;
  title: string;
  content: string;
  position: number;
}

export default function EditLessonPage() {
  const { orgId, courseId, lessonId } = useParams<{
    orgId: string;
    courseId: string;
    lessonId: string;
  }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<EditableLesson>(`${base}/lessons/${lessonId}/edit`);

  return (
    <LoadState state={state}>
      {(lesson) => (
        <div className="card space-y-12 p-6 sm:p-10">
          <Editor key={lesson.id} lesson={lesson} base={base} />
          <ExercisesPanel base={base} lessonId={lesson.id} />
          <QuizzesPanel base={base} lessonId={lesson.id} />
          <AssignmentsPanel base={base} lessonId={lesson.id} />
        </div>
      )}
    </LoadState>
  );
}

function Editor({ lesson, base }: { lesson: EditableLesson; base: string }) {
  const id = useId();
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  // Same checks as the server, shown while typing.
  const blockProblems = useMemo(() => validateLessonBlocks(content), [content]);

  /** Inserts an interactive block template at the cursor (on its own paragraph). */
  function insertBlock(text: string) {
    setPreview(false);
    const el = area.current;
    const at = el ? el.selectionStart : content.length;
    const before = content.slice(0, at).replace(/\s*$/, '');
    const after = content.slice(at).replace(/^\s*/, '');
    const next = [before, text, after].filter(Boolean).join('\n\n');
    setContent(next);
    requestAnimationFrame(() => {
      const pos = (before ? before.length + 2 : 0) + text.length;
      area.current?.focus();
      area.current?.setSelectionRange(pos, pos);
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (title.trim().length < 2) return setError("Nom kamida 2 belgidan iborat bo'lsin");
    setPending(true);
    const res = await send('PATCH', `${base}/lessons/${lesson.id}`, { title, content });
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <BackLink href={`${base}/manage`}>Kurs tuzilmasi</BackLink>
      <div className="space-y-1">
        <label htmlFor={`${id}-title`} className="text-sm font-medium">
          Dars nomi
        </label>
        <input
          id={`${id}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={`${id}-content`} className="text-sm font-medium">
            Matn (Markdown)
          </label>
          <Button variant="secondary" onClick={() => setPreview((p) => !p)} aria-pressed={preview}>
            {preview ? 'Tahrirlash' : "Ko'rib chiqish"}
          </Button>
        </div>
        {preview ? (
          <div className="min-h-64 rounded-lg border border-slate-300 p-4 dark:border-slate-700">
            <Markdown>{content || '_Bo‘sh_'}</Markdown>
          </div>
        ) : (
          <textarea
            ref={area}
            id={`${id}-content`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            maxLength={LESSON_CONTENT_MAX}
            className={`${inputClass} font-mono text-sm`}
          />
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {content.length.toLocaleString()} / {LESSON_CONTENT_MAX.toLocaleString()} belgi
        </p>
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Interaktiv blok qo‘shish"
        >
          <span className="text-sm font-medium">Interaktiv blok:</span>
          {LESSON_BLOCK_TEMPLATES.map((t) => (
            <Button key={t.label} variant="secondary" onClick={() => insertBlock(t.text)}>
              {t.label}
            </Button>
          ))}
        </div>
        {blockProblems.length > 0 && (
          <div
            role="alert"
            className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
          >
            <p className="font-semibold">Interaktiv bloklarda xato bor (saqlab bo‘lmaydi):</p>
            <ul className="mt-1 list-disc pl-5">
              {blockProblems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {saved && (
        <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
          Saqlandi
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Saqlanmoqda…' : 'Saqlash'}
      </Button>
    </form>
  );
}
