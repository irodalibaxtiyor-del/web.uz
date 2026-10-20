'use client';

import type { ExerciseView, ProjectFile } from '@webdizayn/shared';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CheckResultPanel, useCheckRun } from '@/components/check-result';
import { Playground } from '@/components/ide/playground';
import { Markdown } from '@/components/markdown';
import { TutorPanel } from '@/components/tutor-panel';
import {
  BackLink,
  Button,
  DIFFICULTY_LABEL,
  ErrorText,
  ExerciseStatusBadge,
  LoadState,
} from '@/components/ui';
import { api, send } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import { Icon } from '@/components/icons';
import { confirmDialog } from '@/components/dialog';

export default function ExercisePage() {
  const router = useRouter();
  const { orgId, courseId, exerciseId } = useParams<{
    orgId: string;
    courseId: string;
    exerciseId: string;
  }>();
  const courseBase = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<ExerciseView>(`${courseBase}/exercises/${exerciseId}`);

  if (state.kind === 'error' && state.code === 'LESSON_LOCKED') {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Mashq hali yopiq</h1>
        <p className="text-slate-600 dark:text-slate-400">{state.message}</p>
        <Button variant="secondary" onClick={() => router.push(courseBase)}>
          Kurs xaritasiga qaytish
        </Button>
      </section>
    );
  }

  return (
    <LoadState state={state}>
      {(ex) => <Workspace key={ex.id} initial={ex} courseBase={courseBase} />}
    </LoadState>
  );
}

function Workspace({ initial, courseBase }: { initial: ExerciseView; courseBase: string }) {
  const [ex, setEx] = useState(initial);
  const [files, setFiles] = useState<ProjectFile[]>(initial.files);
  const [runErrors, setRunErrors] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const exerciseUrl = `${courseBase}/exercises/${ex.id}`;
  const path = `${exerciseUrl}/workspace`;

  // CHECK may change the status (and complete the lesson); refresh it, keep local edits.
  const refreshStatus = useCallback(async () => {
    const res = await api<ExerciseView>(exerciseUrl);
    if (res.ok) {
      setEx((prev) => ({ ...prev, status: res.data.status, teacherNote: res.data.teacherNote }));
    }
  }, [exerciseUrl]);
  const check = useCheckRun(exerciseUrl, refreshStatus);

  async function run(
    method: 'PUT' | 'POST',
    url: string,
    body?: unknown,
    done: string | null = 'Saqlandi',
  ): Promise<boolean> {
    setError(null);
    setNotice(null);
    setPending(true);
    const res = await send<ExerciseView>(method, url, body);
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return false;
    }
    setEx(res.data);
    setFiles(res.data.files);
    setDirty(false);
    setNotice(done);
    return true;
  }

  /** CHECK runs on the server copy, so unsaved edits are saved first. */
  async function runCheck() {
    if (dirty && !(await run('PUT', path, { files }, null))) return;
    await check.start();
  }

  async function reset() {
    if (
      !(await confirmDialog({
        title: "Boshlang'ich kodga qaytish",
        message: "Barcha o'zgarishlaringiz o'chadi va boshlang'ich kod tiklanadi.",
        confirmLabel: 'Qaytarish',
        tone: 'danger',
      }))
    ) {
      return;
    }
    void run('POST', `${path}/reset`, undefined, "Boshlang'ich kod tiklandi");
  }

  return (
    <article className="space-y-6">
      <div className="card space-y-6 p-6 sm:p-10">
        <nav className="text-sm">
          <BackLink href={`${courseBase}/lessons/${ex.lessonId}`}>Darsga qaytish</BackLink>
        </nav>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{ex.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {DIFFICULTY_LABEL[ex.difficulty]}
            </p>
          </div>
          <ExerciseStatusBadge status={ex.status} />
        </header>
        {ex.teacherNote && (
          <aside
            aria-label="O'qituvchi izohi"
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950"
          >
            <strong>O&apos;qituvchi izohi:</strong> {ex.teacherNote}
          </aside>
        )}
        {ex.description && <p>{ex.description}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {ex.instructions && (
            <section aria-labelledby="instr" className="space-y-2">
              <h2 id="instr" className="text-lg font-semibold">
                Topshiriq
              </h2>
              <Markdown>{ex.instructions}</Markdown>
            </section>
          )}
          {ex.expectedBehavior && (
            <section
              aria-labelledby="expected"
              className="space-y-2 rounded-xl bg-surface p-5 dark:bg-slate-800/50"
            >
              <h2 id="expected" className="text-lg font-semibold">
                Kutilgan natija
              </h2>
              <Markdown>{ex.expectedBehavior}</Markdown>
            </section>
          )}
        </div>
      </div>

      <section aria-label="Kod muharriri" className="space-y-3">
        <Playground
          files={files}
          onRunErrors={setRunErrors}
          onChange={(f) => {
            setFiles(f);
            setDirty(true);
            setNotice(null);
          }}
          toolbar={
            <>
              <button
                type="button"
                onClick={() => run('PUT', path, { files })}
                disabled={pending || !dirty}
                className="btn btn-primary py-2"
              >
                {pending ? 'Saqlanmoqda…' : dirty ? 'Saqlash' : 'Saqlangan'}
              </button>
              {ex.checkAvailable && (
                <button
                  type="button"
                  onClick={runCheck}
                  disabled={pending || check.busy}
                  className="btn btn-accent py-2"
                >
                  <Icon
                    name={check.busy ? 'loader' : 'checkCircle'}
                    className={`size-4 ${check.busy ? 'animate-spin' : ''}`}
                  />
                  {check.busy ? 'Tekshirilmoqda…' : 'Tekshirish'}
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                disabled={pending}
                className="btn border border-white/20 py-2 text-slate-200 hover:bg-white/10"
              >
                Boshlang&apos;ich kod
              </button>
            </>
          }
        />
        {error && <ErrorText>{error}</ErrorText>}
        {check.error && <ErrorText>{check.error}</ErrorText>}
        {notice && (
          <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
            {notice}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          &quot;Ishga tushirish&quot; natijani faqat sizga ko&apos;rsatadi va baho qo&apos;ymaydi.
          {ex.checkAvailable
            ? ' Rasmiy natija "Tekshirish" orqali serverda aniqlanadi: saqlangan kodingiz haqiqiy brauzerda tekshiriladi.'
            : " Bu mashq natijasini o'qituvchi belgilaydi."}
        </p>
      </section>
      {check.run && <CheckResultPanel run={check.run} />}
      <TutorPanel
        courseBase={courseBase}
        targetKind="EXERCISE"
        targetId={ex.id}
        runErrors={runErrors}
      />
    </article>
  );
}
