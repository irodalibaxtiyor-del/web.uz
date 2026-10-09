import { z } from 'zod';
import { checkRulesSchema, type CheckRule } from './checks';

export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const EXERCISE_STATUSES = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'PASSED',
  'NEEDS_IMPROVEMENT',
] as const;
export type ExerciseStatus = (typeof EXERCISE_STATUSES)[number];

export const PROJECT_MAX_FILES = 20;
export const PROJECT_FILE_MAX_CHARS = 100_000;
export const PROJECT_TOTAL_MAX_CHARS = 500_000;

/**
 * Relative path of a project file: lowercase-friendly segments, no `..`, no leading slash,
 * no backslashes, only web source extensions. Keeps paths safe for later sandbox/CHECK use.
 */
export const PROJECT_PATH_RE =
  /^(?:[A-Za-z0-9_-]+\/){0,4}[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*\.(?:html|css|js)$/;

export const projectFileSchema = z.object({
  path: z.string().max(200).regex(PROJECT_PATH_RE),
  content: z.string().max(PROJECT_FILE_MAX_CHARS),
});
export type ProjectFile = z.infer<typeof projectFileSchema>;

export const projectFilesSchema = z
  .array(projectFileSchema)
  .min(1)
  .max(PROJECT_MAX_FILES)
  .superRefine((files, ctx) => {
    const seen = new Set<string>();
    for (const f of files) {
      const key = f.path.toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({ code: 'custom', message: `duplicate path: ${f.path}` });
      }
      seen.add(key);
    }
    const total = files.reduce((n, f) => n + f.content.length, 0);
    if (total > PROJECT_TOTAL_MAX_CHARS) {
      ctx.addIssue({ code: 'custom', message: 'project too large' });
    }
  });

const title = z.string().trim().min(2).max(200);
const longText = z.string().max(20_000);
const position = z.number().int().min(0).max(10_000);

export const createExerciseSchema = z.object({
  title,
  description: z.string().trim().max(2000).default(''),
  instructions: longText.default(''),
  expectedBehavior: longText.default(''),
  starterFiles: projectFilesSchema.default([{ path: 'index.html', content: '' }]),
  difficulty: z.enum(DIFFICULTIES).default('EASY'),
  position: position.optional(),
  isActive: z.boolean().default(true),
  /** Hidden CHECK rules (12C). Never sent to students. */
  checks: checkRulesSchema.default([]),
});
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;

export const updateExerciseSchema = z
  .object({
    title: title.optional(),
    description: z.string().trim().max(2000).optional(),
    instructions: longText.optional(),
    expectedBehavior: longText.optional(),
    starterFiles: projectFilesSchema.optional(),
    difficulty: z.enum(DIFFICULTIES).optional(),
    position: position.optional(),
    isActive: z.boolean().optional(),
    checks: checkRulesSchema.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;

export const saveWorkspaceSchema = z.object({ files: projectFilesSchema });
export type SaveWorkspaceInput = z.infer<typeof saveWorkspaceSchema>;

/** Staff dry-run of CHECK rules against arbitrary files (e.g. a reference solution). Not stored. */
export const previewChecksSchema = z.object({
  files: projectFilesSchema,
  /** Unsaved rules from the editor; defaults to the saved rules. */
  checks: checkRulesSchema.optional(),
});
export type PreviewChecksInput = z.infer<typeof previewChecksSchema>;

/** Manual teacher override. CHECK (12C) sets statuses automatically through the same path. */
export const setExerciseStatusSchema = z.object({
  status: z.enum(['PASSED', 'NEEDS_IMPROVEMENT']),
  note: z.string().trim().max(1000).optional(),
});
export type SetExerciseStatusInput = z.infer<typeof setExerciseStatusSchema>;

export interface ExerciseSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  status: ExerciseStatus;
}

/** Student-facing exercise. Contains no hidden CHECK data. */
export interface ExerciseView {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  instructions: string;
  expectedBehavior: string;
  difficulty: Difficulty;
  status: ExerciseStatus;
  files: ProjectFile[];
  teacherNote: string | null;
  updatedAt: string | null;
  /** Whether a server-side CHECK is configured. The rules themselves are never included. */
  checkAvailable: boolean;
}

export interface ExerciseAdmin {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  instructions: string;
  expectedBehavior: string;
  starterFiles: ProjectFile[];
  difficulty: Difficulty;
  position: number;
  isActive: boolean;
  checks: CheckRule[];
}

export interface ExerciseStudentProgress {
  userId: string;
  fullName: string;
  status: ExerciseStatus;
  updatedAt: string | null;
}
