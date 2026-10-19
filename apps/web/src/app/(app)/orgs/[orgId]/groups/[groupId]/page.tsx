'use client';

import type { GroupOverview, GroupStudentOverview } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useId, useMemo, useState, type FormEvent } from 'react';
import {
  byText,
  Pager,
  SearchBox,
  Select,
  SortHeader,
  td,
  th,
  tr,
  useTable,
} from '@/components/admin-ui';
import { Empty, Section, StatTile } from '@/components/analytics-ui';
import { STRUGGLE } from '@/components/monitoring-ui';
import { Button, ErrorText, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { download } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

const time = (d: string | null) => (d ? Date.parse(d) : 0);
const SORTERS = {
  name: (a: GroupStudentOverview, b: GroupStudentOverview) => byText(a.fullName, b.fullName),
  progress: (a: GroupStudentOverview, b: GroupStudentOverview) =>
    (a.averagePercent ?? -1) - (b.averagePercent ?? -1),
  points: (a: GroupStudentOverview, b: GroupStudentOverview) => a.points - b.points,
  activity: (a: GroupStudentOverview, b: GroupStudentOverview) =>
    time(a.lastActivityAt) - time(b.lastActivityAt),
  struggle: (a: GroupStudentOverview, b: GroupStudentOverview) => a.struggleCount - b.struggleCount,
};

export default function GroupPanelPage() {
  const { orgId, groupId } = useParams<{ orgId: string; groupId: string }>();
  const { state } = useApi<GroupOverview>(`/orgs/${orgId}/groups/${groupId}`);
  return <LoadState state={state}>{(o) => <Panel orgId={orgId} o={o} />}</LoadState>;
}

function Panel({ orgId, o }: { orgId: string; o: GroupOverview }) {
  const [courseId, setCourseId] = useState(o.courses[0]?.courseId ?? '');
  const [struggle, setStruggle] = useState('all');
  const filter = useCallback(
    (s: GroupStudentOverview) => struggle === 'all' || s.struggle === struggle,
    [struggle],
  );
  const table = useTable(o.students, {
    text: (s) => `${s.fullName} ${s.login ?? ''}`,
    sorters: SORTERS,
    initialSort: 'name',
    filter,
  });
  const struggling = o.students.filter((s) => s.struggle === 'STRUGGLING').length;
  const noData = o.students.filter((s) => s.struggle === 'INSUFFICIENT_DATA').length;
  const withProgress = o.students.filter((s) => s.averagePercent !== null);
  const avg = withProgress.length
    ? Math.round(
        withProgress.reduce((n, s) => n + (s.averagePercent ?? 0), 0) / withProgress.length,
      )
    : null;

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `/orgs/${orgId}/groups`, label: 'Guruhlarim' },
        ]}
        title={o.group.name}
        subtitle={`${o.students.length} nafar talaba · ${formatDate(o.generatedAt)} holatiga`}
      />
      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Talabalar" value={o.students.length} />
          <StatTile
            label="O‘rtacha progress"
            value={avg === null ? '—' : `${avg}%`}
            hint={
              avg === null
                ? 'Hech kim kursga yozilmagan'
                : `${withProgress.length} ta kursga yozilgan talaba bo‘yicha`
            }
          />
          <StatTile
            label="Qiynalayotganlar"
            value={struggling}
            hint="Aniq faktlar bo‘yicha (takroriy CHECK xatolari, tuzatish so‘rovlari, o‘tilmagan testlar)"
          />
          <StatTile
            label="Ma’lumot yetarli emas"
            value={noData}
            hint="Hali CHECK, test yoki topshiriq yo‘q"
          />
        </div>

        <Section
          title="Talabalar"
          description="RUN natijalari brauzerda bajariladi va serverda saqlanmaydi; jadvalda rasmiy CHECK natijalari ko‘rsatiladi. Ball faqat o‘qituvchi baholagan topshiriqlardan."
        >
          <div className="flex flex-wrap items-end gap-3">
            <SearchBox
              label="Qidirish"
              placeholder="Ism yoki login"
              value={table.query}
              onChange={table.setQuery}
            />
            {o.courses.length > 1 && (
              <Select
                label="Kurs ustunlari"
                value={courseId}
                onChange={setCourseId}
                options={o.courses.map((c) => ({ value: c.courseId, label: c.title }))}
              />
            )}
            <Select
              label="Holat"
              value={struggle}
              onChange={(v) => {
                setStruggle(v);
                table.resetPage();
              }}
              options={[
                { value: 'all', label: 'Hammasi' },
                { value: 'STRUGGLING', label: 'Qiynalmoqda' },
                { value: 'INSUFFICIENT_DATA', label: 'Ma’lumot yetarli emas' },
                { value: 'OK', label: 'Muammo aniqlanmagan' },
              ]}
            />
          </div>
          {table.total === 0 ? (
            <Empty>
              {o.students.length === 0 ? 'Guruhda talaba yo‘q.' : 'Hech narsa topilmadi.'}
            </Empty>
          ) : (
            <TableScroll label={`${o.group.name}: talabalar natijalari`}>
              <table className="w-full min-w-[1080px] text-sm">
                <thead>
                  <tr className={tr}>
                    <SortHeader
                      label="F.I.Sh."
                      k="name"
                      sort={table.sort}
                      onSort={table.toggleSort}
                    />
                    <th className={th}>Login</th>
                    <SortHeader
                      label="Progress"
                      k="progress"
                      sort={table.sort}
                      onSort={table.toggleSort}
                    />
                    <th className={th}>Joriy dars</th>
                    <th className={`${th} text-right`}>Mashqlar</th>
                    <th className={`${th} text-right`}>CHECK (o‘tdi / jami)</th>
                    <SortHeader
                      label="Ball"
                      k="points"
                      sort={table.sort}
                      onSort={table.toggleSort}
                      className="text-right"
                    />
                    <SortHeader
                      label="Oxirgi faollik"
                      k="activity"
                      sort={table.sort}
                      onSort={table.toggleSort}
                    />
                    <SortHeader
                      label="Holat"
                      k="struggle"
                      sort={table.sort}
                      onSort={table.toggleSort}
                    />
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((s) => {
                    const c = s.courses.find((x) => x.courseId === courseId);
                    const st = STRUGGLE[s.struggle];
                    return (
                      <tr key={s.userId} className={tr}>
                        <td className={td}>
                          <Link
                            href={`/orgs/${orgId}/groups/${o.group.id}/students/${s.userId}`}
                            className="font-semibold text-brand-700 underline dark:text-brand-300"
                          >
                            {s.fullName}
                          </Link>
                          {s.disabled && (
                            <span className="block text-xs text-red-700 dark:text-red-400">
                              Hisob faolsiz
                            </span>
                          )}
                        </td>
                        <td className={`${td} font-mono`}>{s.login ?? '—'}</td>
                        <td className={`${td} tabular-nums`}>
                          {c
                            ? `${c.percent}% (${c.lessonsCompleted}/${c.lessonsTotal})`
                            : 'Yozilmagan'}
                        </td>
                        <td className={td}>
                          {!c ? (
                            '—'
                          ) : c.currentLesson ? (
                            <>
                              {c.currentLesson.title}
                              <span className="block text-xs text-slate-600 dark:text-slate-400">
                                {c.currentLesson.moduleTitle}
                              </span>
                            </>
                          ) : (
                            'Kurs tugatilgan'
                          )}
                        </td>
                        <td className={`${td} text-right tabular-nums`}>
                          {c ? `${c.exercises.passed}/${c.exercises.total}` : '—'}
                        </td>
                        <td className={`${td} text-right tabular-nums`}>
                          {c ? `${c.checks.passed} / ${c.checks.runs}` : '—'}
                        </td>
                        <td className={`${td} text-right tabular-nums`}>
                          {s.maxPoints > 0 ? `${s.points} / ${s.maxPoints}` : '—'}
                        </td>
                        <td className={td}>
                          {s.lastActivityAt ? formatDate(s.lastActivityAt) : 'Faollik yo‘q'}
                        </td>
                        <td className={td}>
                          <span className={st.tone}>
                            <span aria-hidden="true">{st.icon}</span> {st.label}
                            {s.struggleCount > 0 && ` (${s.struggleCount})`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroll>
          )}
          <Pager
            page={table.page}
            pages={table.pages}
            start={table.start}
            shown={table.rows.length}
            total={table.total}
            onPage={table.setPage}
          />
        </Section>

        <ExportForm orgId={orgId} o={o} />
      </div>
    </>
  );
}

function ExportForm({ orgId, o }: { orgId: string; o: GroupOverview }) {
  const id = useId();
  const [scope, setScope] = useState<'group' | 'all'>('group');
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const course = o.courses.find((c) => c.courseId === courseId);
  const mod = course?.modules.find((m) => m.moduleId === moduleId);
  const students = useMemo(
    () => [...o.students].sort((a, b) => byText(a.fullName, b.fullName)),
    [o.students],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(null);
    const form = new FormData(e.currentTarget);
    const from = String(form.get('from') ?? '');
    const to = String(form.get('to') ?? '');
    if (from && to && from > to)
      return setError('Sana oralig‘ining oxiri boshidan oldin bo‘lmasin.');
    const q = new URLSearchParams();
    if (scope === 'group') q.set('groupId', o.group.id);
    if (scope === 'group' && studentId) q.set('studentId', studentId);
    if (courseId) q.set('courseId', courseId);
    if (courseId && moduleId) q.set('moduleId', moduleId);
    if (courseId && lessonId) q.set('lessonId', lessonId);
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    setBusy(true);
    const res = await download(`/orgs/${orgId}/groups/export.xlsx?${q}`, {
      fallbackName: 'ballar.xlsx',
    });
    setBusy(false);
    if (!res.ok) return setError(res.message);
    setDone(`“${res.data.fileName}” yuklab olindi.`);
  }

  return (
    <Section
      title="Ballarni Excelga eksport qilish"
      description="Fayl guruh nomi va eksport sanasi bilan. Sana oralig‘i CHECK urinishlari va baholash sanasiga qo‘llanadi; progress — hozirgi holat."
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
        <Select
          label="Qamrov"
          value={scope}
          onChange={(v) => setScope(v as 'group' | 'all')}
          options={[
            { value: 'group', label: `Faqat ${o.group.name}` },
            { value: 'all', label: 'Barcha ruxsat etilgan guruhlar' },
          ]}
        />
        {scope === 'group' && (
          <Select
            label="Talaba"
            value={studentId}
            onChange={setStudentId}
            options={[
              { value: '', label: 'Hamma talabalar' },
              ...students.map((s) => ({ value: s.userId, label: s.fullName })),
            ]}
          />
        )}
        <Select
          label="Kurs"
          value={courseId}
          onChange={(v) => {
            setCourseId(v);
            setModuleId('');
            setLessonId('');
          }}
          options={[
            { value: '', label: 'Barcha kurslar' },
            ...o.courses.map((c) => ({ value: c.courseId, label: c.title })),
          ]}
        />
        {course && (
          <Select
            label="Modul"
            value={moduleId}
            onChange={(v) => {
              setModuleId(v);
              setLessonId('');
            }}
            options={[
              { value: '', label: 'Barcha modullar' },
              ...course.modules.map((m) => ({ value: m.moduleId, label: m.title })),
            ]}
          />
        )}
        {mod && (
          <Select
            label="Dars"
            value={lessonId}
            onChange={setLessonId}
            options={[
              { value: '', label: 'Barcha darslar' },
              ...mod.lessons.map((l) => ({ value: l.lessonId, label: l.title })),
            ]}
          />
        )}
        <div className="space-y-1">
          <label htmlFor={`${id}-from`} className="text-sm font-semibold">
            Sanadan
          </label>
          <input id={`${id}-from`} name="from" type="date" className="field" />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-to`} className="text-sm font-semibold">
            Sanagacha
          </label>
          <input id={`${id}-to`} name="to" type="date" className="field" />
        </div>
        <div className="md:col-span-3 space-y-3">
          <Button type="submit" disabled={busy}>
            {busy ? 'Tayyorlanmoqda…' : 'Excel faylni yuklab olish'}
          </Button>
          <div aria-live="polite">
            {done && (
              <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
                {done}
              </p>
            )}
            {error && <ErrorText>{error}</ErrorText>}
          </div>
        </div>
      </form>
    </Section>
  );
}
