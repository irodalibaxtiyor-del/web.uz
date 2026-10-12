'use client';

import type { CourseAnalytics, SubmissionStatus } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BUCKET_LABEL,
  ColumnChart,
  Empty,
  percent,
  Section,
  StatTile,
  STRUGGLE_LABEL,
  weekColumns,
} from '@/components/analytics-ui';
import { LoadState, PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

const SUBMISSION_LABEL: Record<SubmissionStatus, string> = {
  DRAFT: 'Qoralama',
  SUBMITTED: 'Topshirilgan',
  IN_REVIEW: 'Ko‘rilmoqda',
  REVISION_REQUESTED: 'Qayta ishlash',
  GRADED: 'Baholangan',
  FINALIZED: 'Yakunlangan',
};

const th = 'py-2 pr-3 text-left font-semibold';
const td = 'py-2 pr-3 align-top';
const row = 'border-b border-slate-100 dark:border-slate-800';

export default function CourseAnalyticsPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<CourseAnalytics>(`${base}/analytics`);

  return (
    <LoadState state={state}>
      {(a) => (
        <>
          <PageHeader
            crumbs={[
              { href: '/dashboard', label: 'Kabinet' },
              { href: `${base}/manage`, label: a.course.title },
            ]}
            title="Kurs analitikasi"
            subtitle={`${a.students} ta talaba · ${formatDate(a.generatedAt)} holatiga`}
          />
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile label="Talabalar" value={a.students} />
              <StatTile label="O‘rtacha progress" value={`${a.progress.averagePercent}%`} />
              <StatTile label="Kursni tugatganlar" value={a.progress.completedCount} />
              <StatTile
                label="Qayta ishlash ulushi"
                value={percent(a.revisions.rate)}
                hint={`${a.revisions.reviewed} ta ko‘rib chiqilgan javobdan ${a.revisions.revisionRequested} tasida`}
              />
            </div>

            <Section title="Guruh progressi" description="Talabalar progress oralig‘i bo‘yicha.">
              {a.students === 0 ? (
                <Empty>Kursga hali hech kim yozilmagan.</Empty>
              ) : (
                <ColumnChart
                  title="Talabalar soni"
                  unit="ta talaba"
                  data={a.progress.distribution.map((d) => ({
                    label: BUCKET_LABEL[d.bucket],
                    title: `Progress ${BUCKET_LABEL[d.bucket]}`,
                    value: d.count,
                  }))}
                />
              )}
            </Section>

            <Section
              title="Yordam kerak bo‘lishi mumkin bo‘lgan talabalar"
              description="Har bir sabab — tekshirib ko‘rish mumkin bo‘lgan aniq fakt."
            >
              {a.strugglingStudents.length === 0 ? (
                <Empty>Hozircha hech kim qiynalayotgani ko‘rinmayapti.</Empty>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {a.strugglingStudents.map((s) => (
                    <li key={s.userId} className="flex flex-wrap justify-between gap-2 py-3">
                      <div>
                        <p className="font-semibold">{s.fullName}</p>
                        <ul className="mt-1 flex flex-wrap gap-1.5">
                          {s.reasons.map((r) => (
                            <li
                              key={r}
                              className="rounded-full bg-accent-300/40 px-2 py-0.5 text-xs text-ink dark:bg-accent-500/20 dark:text-accent-300"
                            >
                              ⚠ {STRUGGLE_LABEL[r]}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                        <p>Progress: {s.progressPercent}%</p>
                        <p>
                          Oxirgi faollik: {s.lastActivityAt ? formatDate(s.lastActivityAt) : 'yo‘q'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <div className="grid gap-8 lg:grid-cols-2">
              <Section
                title="Tiqilib qolgan joylar"
                description="Talabalar hozir to‘xtab turgan darslar (birinchi tugatilmagan dars)."
              >
                {a.bottlenecks.length === 0 ? (
                  <Empty>Ma’lumot yo‘q.</Empty>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={row}>
                        <th className={th}>Dars</th>
                        <th className={`${th} text-right`}>Talabalar</th>
                        <th className={`${th} text-right`}>CHECK xatolari</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.bottlenecks.map((b) => (
                        <tr key={b.lessonId} className={row}>
                          <td className={td}>
                            <Link
                              href={`${base}/manage/lessons/${b.lessonId}`}
                              className="underline"
                            >
                              {b.lessonTitle}
                            </Link>
                            <span className="block text-xs text-slate-500">{b.moduleTitle}</span>
                          </td>
                          <td className={`${td} text-right tabular-nums`}>{b.stuckStudents}</td>
                          <td className={`${td} text-right tabular-nums`}>
                            {percent(b.checkFailRate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Section>

              <Section
                title="Ko‘p uchraydigan xatolar"
                description="Eng ko‘p talabani yiqitgan CHECK qoidalari."
              >
                {a.commonErrors.length === 0 ? (
                  <Empty>Muvaffaqiyatsiz tekshiruvlar yo‘q.</Empty>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={row}>
                        <th className={th}>Qoida</th>
                        <th className={`${th} text-right`}>Talabalar</th>
                        <th className={`${th} text-right`}>Urinishlar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.commonErrors.map((e) => (
                        <tr key={`${e.exerciseId}:${e.ruleId}`} className={row}>
                          <td className={td}>
                            {e.ruleTitle}
                            {e.hidden && (
                              <span className="ml-1 rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">
                                yashirin
                              </span>
                            )}
                            <Link
                              href={`${base}/manage/exercises/${e.exerciseId}`}
                              className="block text-xs text-slate-500 underline"
                            >
                              {e.exerciseTitle}
                            </Link>
                          </td>
                          <td className={`${td} text-right tabular-nums`}>{e.students}</td>
                          <td className={`${td} text-right tabular-nums`}>{e.failedRuns}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {(a.checkIssues.timeouts > 0 || a.checkIssues.errors > 0) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Texnik natijalar: {a.checkIssues.timeouts} ta vaqt tugashi (ko‘pincha cheksiz
                    sikl), {a.checkIssues.errors} ta xato.
                  </p>
                )}
              </Section>
            </div>

            <Section title="Topshiriqlar holati">
              {a.assignments.length === 0 ? (
                <Empty>E’lon qilingan topshiriq yo‘q.</Empty>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className={row}>
                        <th className={th}>Topshiriq</th>
                        <th className={`${th} text-right`}>Topshirmagan</th>
                        <th className={th}>Holatlar</th>
                        <th className={`${th} text-right`}>Kechikkan</th>
                        <th className={`${th} text-right`}>O‘rtacha ball</th>
                        <th className={`${th} text-right`}>Qayta ishlash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.assignments.map((s) => (
                        <tr key={s.assignmentId} className={row}>
                          <td className={td}>
                            <Link
                              href={`${base}/manage/assignments/${s.assignmentId}`}
                              className="underline"
                            >
                              {s.title}
                            </Link>
                            {s.deadline && (
                              <span className="block text-xs text-slate-500">
                                Muddat: {formatDate(s.deadline)}
                              </span>
                            )}
                          </td>
                          <td className={`${td} text-right tabular-nums`}>{s.notSubmitted}</td>
                          <td className={td}>
                            {(Object.keys(s.statuses) as SubmissionStatus[])
                              .filter((k) => s.statuses[k] > 0)
                              .map((k) => `${SUBMISSION_LABEL[k]}: ${s.statuses[k]}`)
                              .join(' · ') || '—'}
                          </td>
                          <td className={`${td} text-right tabular-nums`}>{s.late}</td>
                          <td className={`${td} text-right tabular-nums`}>
                            {percent(s.averageScore)}
                          </td>
                          <td className={`${td} text-right tabular-nums`}>
                            {percent(s.revisionRate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            <Section title="Haftalik faollik" description="Oxirgi 8 hafta, butun kurs bo‘yicha.">
              <div className="grid gap-8 md:grid-cols-2">
                <ColumnChart
                  title="CHECK tekshiruvlari"
                  unit="ta tekshiruv"
                  data={weekColumns(a.trend, 'checkRuns')}
                />
                <ColumnChart
                  title="Tugatilgan darslar"
                  unit="ta dars"
                  data={weekColumns(a.trend, 'lessonsCompleted')}
                />
              </div>
            </Section>
          </div>
        </>
      )}
    </LoadState>
  );
}
