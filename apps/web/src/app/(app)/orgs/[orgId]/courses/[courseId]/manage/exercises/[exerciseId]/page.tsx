'use client';

import {
  DIFFICULTIES,
  updateExerciseSchema,
  type Difficulty,
  type ExerciseAdmin,
  type ExerciseStudentProgress,
  type ProjectFile,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { ChecksEditor } from '@/components/checks-editor';
import { Playground } from '@/components/ide/playground';
import {
  Button,
  DIFFICULTY_LABEL,
  ErrorText,
  ExerciseStatusBadge,
  inputClass,
  LoadState,
  TableScroll,
} from '@/components/ui';
import { send } from '@/lib/api';
import { parseRules } from '@/lib/check-rules';
import { useApi } from '@/lib/use-api';

export default function ManageExercisePage() {
  const { orgId, courseId, exerciseId } = useParams<{
    orgId: string;
    courseId: string;
    exerciseId: string;
  }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<ExerciseAdmin>(`${base}/exercises/${exerciseId}/edit`);

  return (
    <LoadState state={state}>
      {(ex) => (
        <div className="card space-y-12 p-6 sm:p-10">
          <Link
            href={`${base}/manage/lessons/${ex.lessonId}`}
            className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
          >
            ← Darsga qaytish
          </Link>
          <ExerciseForm key={ex.id} initial={ex} base={base} />
          <StudentResults base={base} exerciseId={ex.id} />
        </div>
      )}
    </LoadState>
  );
}

function ExerciseForm({ initial, base }: { initial: ExerciseAdmin; base: string }) {
  const id = useId();
  const [form, setForm] = useState({
    title: initial.title,
    description: initial.description,
    instructions: initial.instructions,
    expectedBehavior: initial.expectedBehavior,
    difficulty: initial.difficulty,
    isActive: initial.isActive,
  });
  const [starterFiles, setStarterFiles] = useState<ProjectFile[]>(initial.starterFiles);
  const [checksText, setChecksText] = useState(
    initial.checks.length ? JSON.stringify(initial.checks, null, 2) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const rules = parseRules(checksText);
    if (!rules.ok) return setError('CHECK qoidalaridagi xatolarni tuzating');
    const parsed = updateExerciseSchema.safeParse({ ...form, starterFiles, checks: rules.rules });
    if (!parsed.success) return setError("Maydonlarni tekshiring (nom, fayl nomlari va o'lchami)");
    setPending(true);
    const res = await send('PATCH', `${base}/exercises/${initial.id}`, parsed.data);
    setPending(false);
    if (!res.ok) return setError(res.message);
    setSaved(true);
  }

  const field = (
    key: 'description' | 'instructions' | 'expectedBehavior',
    label: string,
    rows: number,
  ) => (
    <div className="space-y-1">
      <label htmlFor={`${id}-${key}`} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={`${id}-${key}`}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        rows={rows}
        className={inputClass}
      />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h1 className="text-2xl font-bold">Mashqni tahrirlash</h1>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div className="space-y-1">
          <label htmlFor={`${id}-title`} className="text-sm font-medium">
            Nomi
          </label>
          <input
            id={`${id}-title`}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-diff`} className="text-sm font-medium">
            Qiyinlik
          </label>
          <select
            id={`${id}-diff`}
            value={form.difficulty}
            onChange={(e) => set('difficulty', e.target.value as Difficulty)}
            className={inputClass}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 py-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
          />
          Faol
        </label>
      </div>
      {field('description', 'Qisqa tavsif', 2)}
      {field('instructions', 'Topshiriq (Markdown)', 6)}
      {field('expectedBehavior', 'Kutilgan natija (talabaga ko‘rinadi)', 3)}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Boshlang&apos;ich fayllar</legend>
        <Playground
          files={starterFiles}
          onChange={(f) => {
            setStarterFiles(f);
            setSaved(false);
          }}
        />
      </fieldset>
      <ChecksEditor
        previewUrl={`${base}/exercises/${initial.id}/checks/preview`}
        text={checksText}
        onChange={(t) => {
          setChecksText(t);
          setSaved(false);
        }}
        starterFiles={starterFiles}
      />
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

function StudentResults({ base, exerciseId }: { base: string; exerciseId: string }) {
  const { state, reload } = useApi<ExerciseStudentProgress[]>(
    `${base}/exercises/${exerciseId}/students`,
  );
  const [error, setError] = useState<string | null>(null);

  async function setStatus(userId: string, status: 'PASSED' | 'NEEDS_IMPROVEMENT') {
    let note: string | undefined;
    if (status === 'NEEDS_IMPROVEMENT') {
      const input = window.prompt('Talabaga izoh (ixtiyoriy):') ?? undefined;
      note = input?.trim() || undefined;
    }
    setError(null);
    const res = await send('PUT', `${base}/exercises/${exerciseId}/students/${userId}/status`, {
      status,
      note,
    });
    if (!res.ok) return setError(res.message);
    reload();
  }

  return (
    <section aria-labelledby="results" className="space-y-3">
      <h2 id="results" className="text-xl font-semibold">
        Talabalar natijalari
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        CHECK sozlangan bo&apos;lsa, natija talaba &quot;Tekshirish&quot; tugmasini bosganda
        avtomatik qo&apos;yiladi. Kerak bo&apos;lsa, shu yerda qo&apos;lda o&apos;zgartirishingiz
        mumkin.
      </p>
      {error && <ErrorText>{error}</ErrorText>}
      <LoadState state={state}>
        {(rows) =>
          rows.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Kursga hali talaba yozilmagan.</p>
          ) : (
            <TableScroll label="Talabalar natijalari jadvali">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                    <th scope="col" className="py-2 pr-4">
                      Talaba
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      Holat
                    </th>
                    <th scope="col" className="py-2">
                      <span className="sr-only">Amallar</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.userId} className="border-b border-slate-100 dark:border-slate-900">
                      <td className="py-2 pr-4">{r.fullName}</td>
                      <td className="py-2 pr-4">
                        <ExerciseStatusBadge status={r.status} />
                      </td>
                      <td className="flex flex-wrap justify-end gap-2 py-2">
                        <Button
                          variant="secondary"
                          onClick={() => setStatus(r.userId, 'NEEDS_IMPROVEMENT')}
                          aria-label={`${r.fullName}: tuzatish kerak`}
                        >
                          Tuzatish kerak
                        </Button>
                        <Button
                          onClick={() => setStatus(r.userId, 'PASSED')}
                          aria-label={`${r.fullName}: o'tdi`}
                        >
                          O&apos;tdi
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          )
        }
      </LoadState>
    </section>
  );
}
