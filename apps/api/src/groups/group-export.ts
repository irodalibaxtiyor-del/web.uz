import { NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type {
  ExerciseStatus,
  GroupExportQuery,
  StruggleStatus,
  SubmissionStatus,
} from '@webdizayn/shared';
import type { AuthContext, MembershipContext } from '../common/types';
import { buildXlsx, type Cell } from '../common/xlsx';
import type { Db } from '../db/client';
import { courses, organizations } from '../db/schema';
import type { GroupRef, MonitoringService } from './monitoring.service';

const EXERCISE_LABEL: Record<ExerciseStatus, string> = {
  NOT_STARTED: 'Boshlanmagan',
  IN_PROGRESS: 'Jarayonda',
  PASSED: 'Bajarildi',
  NEEDS_IMPROVEMENT: 'Tuzatish kerak',
};

const SUBMISSION_LABEL: Record<SubmissionStatus | 'NOT_SUBMITTED', string> = {
  NOT_SUBMITTED: 'Topshirilmagan',
  DRAFT: 'Topshirilmagan',
  SUBMITTED: 'Topshirilgan',
  IN_REVIEW: 'Ko‘rib chiqilmoqda',
  REVISION_REQUESTED: 'Qayta ishlash so‘ralgan',
  GRADED: 'Baholangan',
  FINALIZED: 'Yakunlangan',
};

const STRUGGLE_LABEL: Record<StruggleStatus, string> = {
  OK: 'Muammo aniqlanmagan',
  STRUGGLING: 'Qiynalmoqda',
  INSUFFICIENT_DATA: 'Ma’lumot yetarli emas',
};

const CHECK_LABEL: Record<string, string> = {
  PASSED: 'O‘tdi',
  FAILED: 'O‘tmadi',
  ERROR: 'Texnik xato',
  TIMEOUT: 'Vaqt tugadi',
};

const DAY_MS = 86_400_000;

export interface ExportFile {
  fileName: string;
  data: Buffer;
  meta: Record<string, unknown>;
}

/**
 * Teacher's score export. Every id in the query is checked against what the caller may see:
 * groups through MonitoringService.assertGroup, the student through that group's roster, the
 * course through the organization.
 */
export async function buildGroupExport(
  db: Db,
  monitoring: MonitoringService,
  auth: AuthContext,
  m: MembershipContext,
  q: GroupExportQuery,
  now = new Date(),
): Promise<ExportFile> {
  const groupsToExport: GroupRef[] = q.groupId
    ? [await monitoring.assertGroup(auth, m, q.groupId)]
    : (await monitoring.accessibleGroups(auth, m)).map(({ id, name, code }) => ({
        id,
        name,
        code,
      }));
  if (groupsToExport.length === 0) throw new NotFoundException('Sizga biriktirilgan guruh yo‘q');

  let courseTitle: string | null = null;
  if (q.courseId) {
    const [c] = await db
      .select({ title: courses.title })
      .from(courses)
      .where(and(eq(courses.id, q.courseId), eq(courses.organizationId, m.organizationId)));
    if (!c) throw new NotFoundException('Kurs topilmadi');
    courseTitle = c.title;
  }
  const lessonSet = q.courseId
    ? await monitoring.lessonFilter(q.courseId, q.moduleId, q.lessonId)
    : null;
  const range =
    q.from || q.to
      ? {
          from: new Date(`${q.from ?? '2000-01-01'}T00:00:00Z`),
          to: new Date(new Date(`${q.to ?? '2999-12-31'}T00:00:00Z`).getTime() + DAY_MS),
        }
      : undefined;
  const [org] = await db
    .select({ name: organizations.name })
    .from(organizations)
    .where(eq(organizations.id, m.organizationId));

  const summary: Cell[][] = [];
  const scores: Cell[][] = [];
  const work: Cell[][] = [];
  let studentsCount = 0;

  for (const group of groupsToExport) {
    const roster = await monitoring.roster(group);
    let students = roster.students;
    if (q.studentId) {
      students = students.filter((s) => s.userId === q.studentId);
      if (students.length === 0) throw new NotFoundException('Talaba topilmadi');
    }
    studentsCount += students.length;
    const data = await monitoring.load(
      m.organizationId,
      students.map((s) => s.userId),
      { courseId: q.courseId, range },
    );
    const inScope = (lessonId: string | null) =>
      !lessonSet || (lessonId !== null && lessonSet.has(lessonId));

    for (const s of students) {
      const courseIds = data.enrolled.get(s.userId) ?? [];
      const struggle = monitoring.struggles(data, s.userId);
      if (courseIds.length === 0) {
        summary.push([null, s.fullName, group.name, s.login ?? '', 'Kursga yozilmagan']);
      }
      for (const courseId of courseIds) {
        const c = monitoring.courseSummary(data, s.userId, courseId);
        const title = data.courseTitles.get(courseId) ?? '';
        const exercises = data.facts.exercises.filter(
          (e) => e.courseId === courseId && inScope(e.lessonId),
        );
        const assignmentsList = data.facts.assignments.filter((a) => a.courseId === courseId);
        const se = new Map(
          data.facts.studentExercises
            .filter((x) => x.userId === s.userId)
            .map((x) => [x.exerciseId, x.status]),
        );
        const runs = new Map(
          data.facts.runs.filter((r) => r.userId === s.userId).map((r) => [r.exerciseId, r]),
        );
        let runCount = 0;
        let runPassed = 0;
        let runFailed = 0;
        let done = 0;
        for (const e of exercises) {
          const r = runs.get(e.id);
          const status = se.get(e.id) ?? 'NOT_STARTED';
          if (status === 'PASSED') done++;
          runCount += r ? r.passed + r.failed + r.errored : 0;
          runPassed += r?.passed ?? 0;
          runFailed += r?.failed ?? 0;
          const lesson = data.facts.lessons.get(courseId)?.find((l) => l.id === e.lessonId);
          const latest = data.latestRuns.get(`${s.userId}:${e.id}`);
          work.push([
            s.fullName,
            group.name,
            title,
            lesson?.moduleTitle ?? '',
            lesson?.title ?? '',
            e.title,
            EXERCISE_LABEL[status],
            r ? r.passed + r.failed + r.errored : 0,
            r?.passed ?? 0,
            r?.failed ?? 0,
            latest ? (CHECK_LABEL[latest.status] ?? latest.status) : '',
            latest?.at ?? null,
            status === 'PASSED'
              ? ''
              : monitoring
                  .unmet(data, s.userId, e.id)
                  .map((u) => (u.hidden ? `${u.title} (yashirin)` : u.title))
                  .join('; '),
          ]);
        }
        let points = 0;
        let maxPoints = 0;
        // Assignments belong to a course; module/lesson filters do not narrow them.
        for (const a of lessonSet ? [] : assignmentsList) {
          const entry = monitoring.scoreEntry(data, s.userId, a);
          maxPoints += a.maxScore;
          if (entry.score !== null) points += entry.score;
          scores.push([
            s.fullName,
            group.name,
            title,
            a.title,
            SUBMISSION_LABEL[entry.status],
            entry.score,
            a.maxScore,
            entry.versions,
            entry.gradedAt ? new Date(entry.gradedAt) : null,
            entry.gradedBy ?? '',
            entry.final ? 'Ha' : entry.score !== null ? 'Yo‘q' : '',
            entry.feedback ?? '',
          ]);
        }
        summary.push([
          null,
          s.fullName,
          group.name,
          s.login ?? '',
          title,
          c.percent,
          `${c.lessonsCompleted}/${c.lessonsTotal}`,
          c.currentLesson
            ? `${c.currentLesson.moduleTitle} — ${c.currentLesson.title}`
            : 'Kurs tugatilgan',
          done,
          exercises.length,
          runCount,
          runPassed,
          runFailed,
          `${c.quizzes.passed}/${c.quizzes.total}`,
          lessonSet ? null : points,
          lessonSet ? null : maxPoints,
          c.lastActivityAt ? new Date(c.lastActivityAt) : null,
          STRUGGLE_LABEL[struggle.status],
        ]);
      }
    }
  }
  summary.forEach((row, i) => {
    row[0] = i + 1;
  });

  const scopeLabel = q.groupId ? groupsToExport[0]!.name : 'Barcha guruhlar';
  const filters = [
    `Guruh: ${scopeLabel}`,
    q.studentId ? 'Bitta talaba' : null,
    courseTitle ? `Kurs: ${courseTitle}` : null,
    q.moduleId ? 'Bitta modul' : null,
    q.lessonId ? 'Bitta dars' : null,
    range ? `Sana: ${q.from ?? '…'} — ${q.to ?? '…'}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const head = (title: string): Cell[][] => [
    [`${org?.name ?? ''} — ${title}`],
    ['Guruh', scopeLabel],
    ['Eksport sanasi', now],
    ['Filtr', filters],
    [],
  ];
  const H = 5;

  const data = buildXlsx([
    {
      name: 'Umumiy',
      boldRows: [0, H],
      widths: [5, 40, 12, 24, 26, 10, 10, 40, 10, 10, 10, 10, 10, 10, 8, 10, 17, 22],
      rows: [
        ...head('umumiy natijalar'),
        [
          '№',
          'F.I.Sh.',
          'Guruh',
          'Login',
          'Kurs',
          'Progress, %',
          'Darslar',
          'Joriy dars',
          'Mashqlar bajarildi',
          'Mashqlar jami',
          'CHECK urinishlar',
          'CHECK o‘tdi',
          'CHECK o‘tmadi',
          'Testlar o‘tildi',
          'Ball',
          'Maks. ball',
          'Oxirgi faollik',
          'Qiynalish holati',
        ],
        ...summary,
      ],
    },
    {
      name: 'Topshiriqlar',
      boldRows: [0, H],
      widths: [40, 12, 26, 34, 22, 8, 10, 10, 17, 28, 10, 60],
      rows: [
        ...head('topshiriqlar bo‘yicha ballar'),
        [
          'F.I.Sh.',
          'Guruh',
          'Kurs',
          'Topshiriq',
          'Holat',
          'Ball',
          'Maks. ball',
          'Versiyalar',
          'Baholangan sana',
          'Baholagan',
          'Yakuniy',
          'O‘qituvchi izohi',
        ],
        ...scores,
      ],
    },
    {
      name: 'Mashqlar',
      boldRows: [0, H],
      widths: [40, 12, 26, 26, 30, 34, 16, 10, 8, 8, 14, 17, 60],
      rows: [
        ...head('mashqlar va CHECK natijalari'),
        [
          'F.I.Sh.',
          'Guruh',
          'Kurs',
          'Modul',
          'Dars',
          'Mashq',
          'Holat',
          'CHECK urinishlar',
          'O‘tdi',
          'O‘tmadi',
          'Oxirgi CHECK',
          'Oxirgi CHECK sanasi',
          'Bajarilmagan talablar',
        ],
        ...work,
      ],
    },
    {
      name: 'Izoh',
      widths: [100],
      rows: [
        [
          'Ball faqat o‘qituvchi baholagan topshiriqlardan olinadi. Bitta javobning bitta joriy bahosi bor — qayta topshirish ballni ikki marta qo‘shmaydi.',
        ],
        [
          'Progress va mashq holatlari eksport vaqtidagi holat. Sana oralig‘i CHECK urinishlari va baholash sanasiga qo‘llanadi.',
        ],
        [
          'RUN natijalari brauzerda bajariladi va serverda saqlanmaydi, shuning uchun eksportda yo‘q.',
        ],
        ['AI Tutor baho qo‘ymaydi va ballarga ta’sir qilmaydi.'],
        ['Vaqtlar Toshkent vaqtida (UTC+5).'],
      ],
    },
  ]);
  const stamp = now.toISOString().slice(0, 10);
  return {
    fileName: `ballar-${scopeLabel}-${stamp}.xlsx`,
    data,
    meta: {
      groupIds: groupsToExport.map((g) => g.id),
      students: studentsCount,
      courseId: q.courseId ?? null,
      moduleId: q.moduleId ?? null,
      lessonId: q.lessonId ?? null,
      from: q.from ?? null,
      to: q.to ?? null,
    },
  };
}
