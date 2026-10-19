'use client';

import type {
  CheckRunStatus,
  LessonProgressDetail,
  ScoreEntry,
  StudentDetail,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { td, th, tr } from '@/components/admin-ui';
import { Empty, Section, StatTile } from '@/components/analytics-ui';
import { STRUGGLE_KIND, StruggleBadge } from '@/components/monitoring-ui';
import {
  Button,
  ErrorText,
  ExerciseStatusBadge,
  LoadState,
  PageHeader,
  ProgressBar,
  TableScroll,
} from '@/components/ui';
import { download } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

const CHECK_LABEL: Record<CheckRunStatus, string> = {
  QUEUED: 'Navbatda',
  RUNNING: 'Bajarilmoqda',
  PASSED: 'O‘tdi',
  FAILED: 'O‘tmadi',
  ERROR: 'Texnik xato',
  TIMEOUT: 'Vaqt tugadi',
};

const SUBMISSION_LABEL: Record<ScoreEntry['status'], string> = {
  NOT_SUBMITTED: 'Topshirilmagan',
  DRAFT: 'Topshirilmagan',
  SUBMITTED: 'Topshirilgan',
  IN_REVIEW: 'Ko‘rib chiqilmoqda',
  REVISION_REQUESTED: 'Qayta ishlash so‘ralgan',
  GRADED: 'Baholangan',
  FINALIZED: 'Yakunlangan',
};

const LESSON_STATE: Record<LessonProgressDetail['state'], string> = {
  COMPLETED: '✓ Tugatilgan',
  IN_PROGRESS: '◐ Jarayonda',
  NOT_STARTED: '○ Boshlanmagan',
};

export default function StudentDetailPage() {
  const { orgId, groupId, studentId } = useParams<{
    orgId: string;
    groupId: string;
    studentId: string;
  }>();
  const { state } = useApi<StudentDetail>(`/orgs/${orgId}/groups/${groupId}/students/${studentId}`);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportOne(d: StudentDetail) {
    setBusy(true);
    setError(null);
    const res = await download(
      `/orgs/${orgId}/groups/export.xlsx?groupId=${d.student.group.id}&studentId=${d.student.userId}`,
      { fallbackName: 'ballar.xlsx' },
    );
    setBusy(false);
    if (!res.ok) setError(res.message);
  }

  return (
    <LoadState state={state}>
      {(d) => (
        <>
          <PageHeader
            crumbs={[
              { href: '/dashboard', label: 'Kabinet' },
              { href: `/orgs/${orgId}/groups`, label: 'Guruhlarim' },
              { href: `/orgs/${orgId}/groups/${groupId}`, label: d.student.group.name },
            ]}
            title={d.student.fullName}
            subtitle={
              <>
                Login: <span className="font-mono">{d.student.login ?? '—'}</span> ·{' '}
                {formatDate(d.generatedAt)} holatiga
                {d.student.disabled && ' · hisob faolsiz'}
              </>
            }
            actions={
              <Button variant="accent" onClick={() => exportOne(d)} disabled={busy}>
                {busy ? 'Tayyorlanmoqda…' : 'Excel'}
              </Button>
            }
          />
          <div className="space-y-8">
            {error && <ErrorText>{error}</ErrorText>}
            <div className="grid gap-3 sm:grid-cols-3">
              <StatTile
                label="Ball"
                value={d.maxPoints > 0 ? `${d.points} / ${d.maxPoints}` : '—'}
                hint="Faqat o‘qituvchi baholagan topshiriqlar"
              />
              <StatTile label="Kurslar" value={d.courses.length} />
              <StatTile
                label="Holat"
                value={<StruggleBadge status={d.struggle} count={d.struggles.length} />}
              />
            </div>

            <Section
              title="Qiynalgan topshiriqlar"
              description="Faqat haqiqiy urinishlar va CHECK natijalariga asoslangan. RUN natijalari serverda saqlanmaydi."
            >
              {d.struggles.length === 0 ? (
                <Empty>
                  {d.struggle === 'INSUFFICIENT_DATA'
                    ? 'Ma’lumot yetarli emas: talaba hali CHECK, test yoki topshiriq yubormagan.'
                    : 'Aniq muammo topilmadi.'}
                </Empty>
              ) : (
                <ul className="space-y-3">
                  {d.struggles.map((s, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-amber-200 p-3 dark:border-amber-900"
                    >
                      <p className="font-semibold">
                        {s.itemTitle}{' '}
                        <span className="text-sm font-normal text-amber-700 dark:text-amber-400">
                          — {STRUGGLE_KIND[s.kind]}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {s.courseTitle}
                        {s.lessonTitle && ` · ${s.lessonTitle}`}
                        {s.failedAttempts > 0 &&
                          ` · ${s.failedAttempts} ta muvaffaqiyatsiz urinish`}
                      </p>
                      {s.unmet.length > 0 && (
                        <p className="mt-1 text-sm">
                          Bajarilmagan talablar:{' '}
                          {s.unmet
                            .map((u) => (u.hidden ? `${u.title} (yashirin)` : u.title))
                            .join('; ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {d.courses.length === 0 && (
              <div className="card p-6">
                <Empty>Talaba hali hech qaysi kursga yozilmagan.</Empty>
              </div>
            )}
            {d.courses.map((c) => (
              <Section
                key={c.courseId}
                title={c.title}
                description={`${c.lessonsCompleted}/${c.lessonsTotal} dars · joriy: ${
                  c.currentLesson
                    ? `${c.currentLesson.moduleTitle} — ${c.currentLesson.title}`
                    : 'kurs tugatilgan'
                } · oxirgi faollik: ${c.lastActivityAt ? formatDate(c.lastActivityAt) : 'yo‘q'}`}
              >
                <ProgressBar percent={c.percent} />
                <h3 className="font-bold">Topshiriqlar va ballar</h3>
                {c.assignments.length === 0 ? (
                  <Empty>Bu kursda topshiriq yo‘q.</Empty>
                ) : (
                  <TableScroll label={`${c.title}: topshiriqlar`}>
                    <table className="w-full min-w-[760px] text-sm">
                      <thead>
                        <tr className={tr}>
                          <th className={th}>Topshiriq</th>
                          <th className={th}>Holat</th>
                          <th className={`${th} text-right`}>Ball</th>
                          <th className={`${th} text-right`}>Versiyalar</th>
                          <th className={th}>Baholangan</th>
                          <th className={th}>Izoh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {c.assignments.map((a) => (
                          <tr key={a.assignmentId} className={tr}>
                            <td className={td}>{a.title}</td>
                            <td className={td}>
                              {SUBMISSION_LABEL[a.status]}
                              {a.final && ' (yakuniy)'}
                            </td>
                            <td className={`${td} text-right tabular-nums`}>
                              {a.score === null ? '—' : `${a.score} / ${a.maxScore}`}
                            </td>
                            <td className={`${td} text-right tabular-nums`}>{a.versions}</td>
                            <td className={td}>
                              {a.gradedAt ? (
                                <>
                                  {formatDate(a.gradedAt)}
                                  <span className="block text-xs text-slate-600 dark:text-slate-400">
                                    {a.gradedBy ?? 'o‘chirilgan hisob'}
                                  </span>
                                </>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className={`${td} max-w-xs whitespace-pre-wrap`}>
                              {a.feedback ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableScroll>
                )}
                <h3 className="font-bold">Darslar, mashqlar va CHECK</h3>
                <TableScroll label={`${c.title}: darslar`}>
                  <table className="w-full min-w-[900px] text-sm">
                    <thead>
                      <tr className={tr}>
                        <th className={th}>Dars</th>
                        <th className={th}>Holat</th>
                        <th className={th}>Mashq / test</th>
                        <th className={th}>Natija</th>
                        <th className={`${th} text-right`}>Urinishlar</th>
                        <th className={th}>Oxirgi CHECK</th>
                        <th className={th}>Bajarilmagan talablar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.lessons.flatMap((l) => {
                        const items = [
                          ...l.exercises.map((e) => (
                            <tr key={e.exerciseId} className={tr}>
                              <td className={td}>
                                {l.title}
                                <span className="block text-xs text-slate-600 dark:text-slate-400">
                                  {l.moduleTitle}
                                </span>
                              </td>
                              <td className={td}>{LESSON_STATE[l.state]}</td>
                              <td className={td}>Mashq: {e.title}</td>
                              <td className={td}>
                                <ExerciseStatusBadge status={e.status} />
                              </td>
                              <td className={`${td} text-right tabular-nums`}>
                                {e.checks.runs}{' '}
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  ({e.checks.passed} o‘tdi, {e.checks.failed} o‘tmadi)
                                </span>
                              </td>
                              <td className={td}>
                                {e.checks.lastStatus
                                  ? `${CHECK_LABEL[e.checks.lastStatus]}, ${formatDate(e.checks.lastAt!)}`
                                  : '—'}
                              </td>
                              <td className={td}>
                                {e.unmet.length
                                  ? e.unmet
                                      .map((u) => (u.hidden ? `${u.title} (yashirin)` : u.title))
                                      .join('; ')
                                  : '—'}
                              </td>
                            </tr>
                          )),
                          ...l.quizzes.map((q) => (
                            <tr key={q.quizId} className={tr}>
                              <td className={td}>
                                {l.title}
                                <span className="block text-xs text-slate-600 dark:text-slate-400">
                                  {l.moduleTitle}
                                </span>
                              </td>
                              <td className={td}>{LESSON_STATE[l.state]}</td>
                              <td className={td}>Test: {q.title}</td>
                              <td className={td}>
                                {q.passed
                                  ? '✓ O‘tdi'
                                  : q.attempts
                                    ? '! O‘tilmadi'
                                    : '○ Urinilmagan'}
                                {q.bestPercent !== null && ` · eng yaxshi ${q.bestPercent}%`}
                              </td>
                              <td className={`${td} text-right tabular-nums`}>{q.attempts}</td>
                              <td className={td}>—</td>
                              <td className={td}>—</td>
                            </tr>
                          )),
                        ];
                        return items.length
                          ? items
                          : [
                              <tr key={l.lessonId} className={tr}>
                                <td className={td}>
                                  {l.title}
                                  <span className="block text-xs text-slate-600 dark:text-slate-400">
                                    {l.moduleTitle}
                                  </span>
                                </td>
                                <td className={td}>{LESSON_STATE[l.state]}</td>
                                <td className={td} colSpan={5}>
                                  Nazariy dars
                                </td>
                              </tr>,
                            ];
                      })}
                    </tbody>
                  </table>
                </TableScroll>
              </Section>
            ))}
          </div>
        </>
      )}
    </LoadState>
  );
}
