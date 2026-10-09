'use client';

import { LESSON_CONTENT_MAX } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { AssignmentsPanel } from '@/components/assignments-panel';
import { ExercisesPanel } from '@/components/exercises-panel';
import { Markdown } from '@/components/markdown';
import { Button, ErrorText, inputClass, LoadState } from '@/components/ui';
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
      <Link href={`${base}/manage`} className="text-sm text-slate-500 hover:underline">
        ← Kurs tuzilmasi
      </Link>
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
            id={`${id}-content`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            maxLength={LESSON_CONTENT_MAX}
            className={`${inputClass} font-mono text-sm`}
          />
        )}
        <p className="text-xs text-slate-500">
          {content.length.toLocaleString()} / {LESSON_CONTENT_MAX.toLocaleString()} belgi
        </p>
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
