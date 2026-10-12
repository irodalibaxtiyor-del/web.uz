'use client';

import type { OrgAnalytics, Role } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ColumnChart,
  Empty,
  percent,
  Section,
  StatTile,
  weekColumns,
} from '@/components/analytics-ui';
import { STATUS_LABEL } from '@/components/course-list';
import { LoadState, PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

const ROLE_LABEL: Record<Role, string> = {
  STUDENT: 'Talaba',
  TEACHER: 'O‘qituvchi',
  ORG_ADMIN: 'Administrator',
};

const th = 'py-2 pr-3 text-left font-semibold';
const td = 'py-2 pr-3 align-top';
const row = 'border-b border-slate-100 dark:border-slate-800';

export default function OrgAnalyticsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { state } = useApi<OrgAnalytics>(`/orgs/${orgId}/analytics`);

  return (
    <LoadState state={state}>
      {(a) => (
        <>
          <PageHeader
            crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
            title="Tashkilot analitikasi"
            subtitle={`${formatDate(a.generatedAt)} holatiga`}
          />
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="A’zolar"
                value={a.members.students + a.members.teachers + a.members.admins}
                hint={`${a.members.students} talaba · ${a.members.teachers} o‘qituvchi · ${a.members.admins} admin`}
              />
              <StatTile
                label="Faol talabalar (7 kun)"
                value={a.engagement.activeLast7}
                hint={`30 kunda: ${a.engagement.activeLast30} · kursga yozilgan: ${a.engagement.enrolledStudents}`}
              />
              <StatTile
                label="Kursni tugatish"
                value={percent(a.completion.rate)}
                hint={`${a.completion.enrollments} ta yozilishdan ${a.completion.completed} tasi`}
              />
              <StatTile label="Kurslar" value={a.courses.length} />
            </div>

            <Section
              title="Haftalik faollik"
              description="Oxirgi 8 hafta, barcha kurslar bo‘yicha."
            >
              <div className="grid gap-8 md:grid-cols-2">
                <ColumnChart
                  title="Faol talabalar"
                  unit="ta talaba"
                  data={weekColumns(a.trend, 'activeStudents')}
                />
                <ColumnChart
                  title="CHECK tekshiruvlari"
                  unit="ta tekshiruv"
                  data={weekColumns(a.trend, 'checkRuns')}
                />
              </div>
            </Section>

            <Section title="Kurslar faolligi" description="Faollik — oxirgi 30 kun.">
              {a.courses.length === 0 ? (
                <Empty>Tashkilotda hali kurs yo‘q.</Empty>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className={row}>
                        <th className={th}>Kurs</th>
                        <th className={`${th} text-right`}>Talabalar</th>
                        <th className={`${th} text-right`}>Faol</th>
                        <th className={`${th} text-right`}>O‘rtacha progress</th>
                        <th className={`${th} text-right`}>Tugatgan</th>
                        <th className={`${th} text-right`}>CHECK</th>
                        <th className={`${th} text-right`}>Topshirishlar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.courses.map((c) => (
                        <tr key={c.courseId} className={row}>
                          <td className={td}>
                            <Link
                              href={`/orgs/${orgId}/courses/${c.courseId}/manage/analytics`}
                              className="underline"
                            >
                              {c.title}
                            </Link>
                            <span className="block text-xs text-slate-500">
                              {STATUS_LABEL[c.status]}
                            </span>
                          </td>
                          <td className={`${td} text-right tabular-nums`}>{c.students}</td>
                          <td className={`${td} text-right tabular-nums`}>{c.activeLast30}</td>
                          <td className={`${td} text-right tabular-nums`}>{c.averagePercent}%</td>
                          <td className={`${td} text-right tabular-nums`}>{c.completedCount}</td>
                          <td className={`${td} text-right tabular-nums`}>{c.checkRunsLast30}</td>
                          <td className={`${td} text-right tabular-nums`}>{c.submissionsLast30}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            <Section
              title="O‘qituvchilar faolligi"
              description="Ko‘rib chiqishlar — baholash va qayta ishlash so‘rovlari. Kutayotganlar — o‘qituvchi kurslaridagi topshirilgan, hali ko‘rilmagan javoblar."
            >
              {a.teachers.length === 0 ? (
                <Empty>O‘qituvchilar yo‘q.</Empty>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className={row}>
                        <th className={th}>Ism</th>
                        <th className={`${th} text-right`}>Kurslar</th>
                        <th className={`${th} text-right`}>Ko‘rib chiqish (30 kun)</th>
                        <th className={`${th} text-right`}>Jami</th>
                        <th className={th}>Oxirgisi</th>
                        <th className={`${th} text-right`}>Kutayotgan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.teachers.map((t) => (
                        <tr key={t.userId} className={row}>
                          <td className={td}>
                            {t.fullName}
                            <span className="block text-xs text-slate-500">
                              {ROLE_LABEL[t.role]}
                            </span>
                          </td>
                          <td className={`${td} text-right tabular-nums`}>{t.courses}</td>
                          <td className={`${td} text-right tabular-nums`}>{t.reviewsLast30}</td>
                          <td className={`${td} text-right tabular-nums`}>{t.reviewsTotal}</td>
                          <td className={td}>
                            {t.lastReviewAt ? formatDate(t.lastReviewAt) : '—'}
                          </td>
                          <td className={`${td} text-right tabular-nums`}>{t.pendingReviews}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </div>
        </>
      )}
    </LoadState>
  );
}
