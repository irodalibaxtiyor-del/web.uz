'use client';

import type { StudentAnalytics, StudentCourseAnalytics } from '@webdizayn/shared';
import Link from 'next/link';
import {
  ColumnChart,
  Empty,
  percent,
  RateMeter,
  Section,
  StatTile,
  weekColumns,
} from '@/components/analytics-ui';
import { LoadState, PageHeader, ProgressBar } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

export default function MyAnalyticsPage() {
  const { state } = useApi<StudentAnalytics>('/analytics/me');
  return (
    <LoadState state={state}>
      {(data) => (
        <>
          <PageHeader
            crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
            title="Mening natijalarim"
            subtitle="O‘qish jarayoningiz: progress, tekshiruvlar, testlar va topshiriqlar. Bu ma’lumotlarni faqat siz ko‘rasiz."
          />
          <div className="space-y-8">
            {data.courses.length === 0 ? (
              <Section title="Hali kurs yo‘q">
                <Empty>
                  Kursga yozilganingizdan keyin natijalaringiz shu yerda paydo bo‘ladi.{' '}
                  <Link href="/dashboard" className="text-brand-600 underline">
                    Kurslarni ko‘rish
                  </Link>
                </Empty>
              </Section>
            ) : (
              <>
                <Section
                  title="Haftalik faollik"
                  description="Oxirgi 8 hafta, barcha kurslaringiz bo‘yicha."
                >
                  <div className="grid gap-8 md:grid-cols-2">
                    <ColumnChart
                      title="CHECK tekshiruvlari"
                      unit="ta tekshiruv"
                      data={weekColumns(data.trend, 'checkRuns')}
                    />
                    <ColumnChart
                      title="Tugatilgan darslar"
                      unit="ta dars"
                      data={weekColumns(data.trend, 'lessonsCompleted')}
                    />
                  </div>
                </Section>
                {data.courses.map((c) => (
                  <CourseCard key={c.courseId} c={c} />
                ))}
              </>
            )}
            <Section title="AI yordamchidan foydalanish">
              <Empty>
                AI yordamchi hali ishga tushirilmagan, shuning uchun bu bo‘limda ma’lumot yo‘q.
              </Empty>
            </Section>
          </div>
        </>
      )}
    </LoadState>
  );
}

function CourseCard({ c }: { c: StudentCourseAnalytics }) {
  const href = `/orgs/${c.organizationId}/courses/${c.courseId}`;
  return (
    <Section title={c.title}>
      <div className="space-y-2">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <span>
            {c.progress.lessonsCompleted} / {c.progress.lessonsTotal} dars tugatildi
            {c.progress.completed && ' · Kurs tugatildi ✓'}
          </span>
          <span className="font-semibold">{c.progress.percent}%</span>
        </div>
        <ProgressBar percent={c.progress.percent} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Mashqlar"
          value={`${c.exercises.passed} / ${c.exercises.total}`}
          hint={
            c.exercises.needsImprovement > 0
              ? `${c.exercises.needsImprovement} tasini tuzatish kerak`
              : 'o‘tilgan'
          }
        />
        <StatTile
          label="CHECK muvaffaqiyati"
          value={percent(c.checks.successRate)}
          hint={`${c.checks.runs} ta tekshiruv · ${c.checks.passed} tasi o‘tdi`}
        />
        <StatTile
          label="Testlar"
          value={`${c.quizzes.passed} / ${c.quizzes.total}`}
          hint={`Eng yaxshi natijalar o‘rtachasi: ${percent(c.quizzes.averageBest)}`}
        />
        <StatTile
          label="Topshiriqlar"
          value={`${c.assignments.graded} / ${c.assignments.available}`}
          hint={`baholangan · o‘rtacha ball: ${percent(c.assignments.averageScore)}`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <RateMeter label="Birinchi urinishda o‘tgan mashqlar" value={c.checks.firstTryRate} />
          <RateMeter label="CHECK’dan o‘tgan tekshiruvlar" value={c.checks.successRate} />
          {c.checks.errored > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {c.checks.errored} ta tekshiruv texnik sabab (vaqt tugashi yoki xato) bilan yakunlandi
              — ular foizga kirmaydi.
            </p>
          )}
          {c.assignments.revisionsRequested > 0 && (
            <p className="text-sm">
              {c.assignments.revisionsRequested} ta topshiriqda o‘qituvchi qayta ishlashni so‘ragan.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">E’tibor berish kerak bo‘lgan mavzular</h3>
          {c.weakTopics.length === 0 ? (
            <Empty>Hozircha qiyin mavzu yo‘q — zo‘r!</Empty>
          ) : (
            <ul className="space-y-2">
              {c.weakTopics.map((w) => (
                <li
                  key={w.lessonId}
                  className="rounded-lg bg-surface p-3 text-sm dark:bg-slate-800"
                >
                  <Link href={`${href}/lessons/${w.lessonId}`} className="font-semibold underline">
                    {w.lessonTitle}
                  </Link>
                  <span className="text-slate-500 dark:text-slate-400"> · {w.moduleTitle}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {[
                      w.failedChecks > 0 && `${w.failedChecks} ta muvaffaqiyatsiz tekshiruv`,
                      w.needsImprovement > 0 && `${w.needsImprovement} ta mashqni tuzatish kerak`,
                      w.failedQuizAttempts > 0 &&
                        `${w.failedQuizAttempts} ta test urinishi o‘tmadi`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>Oxirgi faollik: {c.lastActivityAt ? formatDate(c.lastActivityAt) : 'hali yo‘q'}</span>
        <Link href={href} className="btn btn-outline">
          Kursga o‘tish
        </Link>
      </div>
    </Section>
  );
}
