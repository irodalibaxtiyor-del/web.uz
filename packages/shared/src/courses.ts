import { z } from 'zod';
import type { ExerciseSummary } from './exercises';
import type { AssignmentSummary } from './assignments';

export const COURSE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

/** Server-computed lesson state for a student. NEEDS_IMPROVEMENT arrives with 13A. */
export const LESSON_STATES = ['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'] as const;
export type LessonState = (typeof LESSON_STATES)[number];

export const LESSON_CONTENT_MAX = 100_000;

const title = z.string().trim().min(2).max(200);

export const createCourseSchema = z.object({
  title,
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(80),
  description: z.string().trim().max(2000).default(''),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = z
  .object({
    title: title.optional(),
    description: z.string().trim().max(2000).optional(),
    status: z.enum(COURSE_STATUSES).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

const position = z.number().int().min(0).max(10_000);

export const createModuleSchema = z.object({ title, position: position.optional() });
export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export const updateModuleSchema = z
  .object({ title: title.optional(), position: position.optional() })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

export const createLessonSchema = z.object({
  title,
  content: z.string().max(LESSON_CONTENT_MAX).default(''),
  position: position.optional(),
});
export type CreateLessonInput = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z
  .object({
    title: title.optional(),
    content: z.string().max(LESSON_CONTENT_MAX).optional(),
    position: position.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: CourseStatus;
  /** Present for students only. */
  enrolled?: boolean;
  progressPercent?: number;
  /** Present for staff only: whether the caller may edit this course. */
  canManage?: boolean;
}

export interface CourseMapLesson {
  id: string;
  title: string;
  state: LessonState;
}

export interface CourseMapModule {
  id: string;
  title: string;
  lessons: CourseMapLesson[];
}

export interface CourseMap {
  course: { id: string; title: string; description: string };
  modules: CourseMapModule[];
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
}

export interface LessonView {
  id: string;
  title: string;
  content: string;
  state: Exclude<LessonState, 'LOCKED'>;
  moduleTitle: string;
  prevLessonId: string | null;
  nextLessonId: string | null;
  /** Active exercises. When non-empty, the lesson completes only when all are PASSED. */
  exercises: ExerciseSummary[];
  /** Published or closed assignments of this lesson. They do not gate lesson completion. */
  assignments: AssignmentSummary[];
}

export interface CourseStructure {
  course: { id: string; slug: string; title: string; description: string; status: CourseStatus };
  modules: {
    id: string;
    title: string;
    position: number;
    lessons: { id: string; title: string; position: number; contentLength: number }[];
  }[];
}
