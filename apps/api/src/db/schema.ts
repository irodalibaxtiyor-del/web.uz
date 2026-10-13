import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  ASSIGNMENT_STATUSES,
  CHECK_RUN_STATUSES,
  COURSE_STATUSES,
  DIFFICULTIES,
  HANDOFF_CATEGORIES,
  TUTOR_LEVELS,
  TUTOR_MODES,
  TUTOR_TARGET_KINDS,
  EXERCISE_STATUSES,
  REVIEW_ACTIONS,
  ROLES,
  PORTFOLIO_ITEM_KINDS,
  SUBMISSION_STATUSES,
  type CheckEngineResult,
  type CheckErrorCode,
  type CheckRule,
  type GradingPolicy,
  type ProjectFile,
  type QuizQuestion,
  type RubricCriterion,
  type RubricScore,
} from '@webdizayn/shared';

export const roleEnum = pgEnum('role', ROLES);
export const courseStatusEnum = pgEnum('course_status', COURSE_STATUSES);
export const progressStatusEnum = pgEnum('progress_status', ['IN_PROGRESS', 'COMPLETED']);
export const difficultyEnum = pgEnum('difficulty', DIFFICULTIES);
export const exerciseStatusEnum = pgEnum('exercise_status', EXERCISE_STATUSES);
export const checkRunStatusEnum = pgEnum('check_run_status', CHECK_RUN_STATUSES);
export const assignmentStatusEnum = pgEnum('assignment_status', ASSIGNMENT_STATUSES);
export const submissionStatusEnum = pgEnum('submission_status', SUBMISSION_STATUSES);
export const reviewActionEnum = pgEnum('review_action', REVIEW_ACTIONS);
export const portfolioItemKindEnum = pgEnum('portfolio_item_kind', PORTFOLIO_ITEM_KINDS);
export const tutorModeEnum = pgEnum('tutor_mode', TUTOR_MODES);
export const tutorLevelEnum = pgEnum('tutor_level', TUTOR_LEVELS);
export const tutorTargetKindEnum = pgEnum('tutor_target_kind', TUTOR_TARGET_KINDS);
export const handoffCategoryEnum = pgEnum('handoff_category', HANDOFF_CATEGORIES);

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  createdAt: createdAt(),
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('users_email_lower_idx').on(sql`lower(${t.email})`)],
);

export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    role: roleEnum('role').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('memberships_user_org_idx').on(t.userId, t.organizationId),
    index('memberships_org_idx').on(t.organizationId),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** SHA-256 of the cookie token; the raw token is never stored. */
    tokenHash: text('token_hash').notNull().unique(),
    createdAt: createdAt(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => [index('sessions_user_idx').on(t.userId)],
);

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    organizationId: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'set null',
    }),
    action: text('action').notNull(),
    targetType: text('target_type'),
    targetId: text('target_id'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [
    index('audit_events_org_idx').on(t.organizationId, t.createdAt),
    index('audit_events_actor_idx').on(t.actorUserId),
  ],
);

const updatedAt = () => timestamp('updated_at', { withTimezone: true }).notNull().defaultNow();

export const courses = pgTable(
  'courses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    status: courseStatusEnum('status').notNull().default('DRAFT'),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('courses_org_slug_idx').on(t.organizationId, t.slug),
    index('courses_org_status_idx').on(t.organizationId, t.status),
    index('courses_created_by_idx').on(t.createdBy),
  ],
);

/** Teachers assigned to a course. A TEACHER may manage only courses listed here. */
export const courseTeachers = pgTable(
  'course_teachers',
  {
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.courseId, t.userId] }),
    index('course_teachers_user_idx').on(t.userId),
  ],
);

export const modules = pgTable(
  'modules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    position: integer('position').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('modules_course_pos_idx').on(t.courseId, t.position),
    check('modules_position_nonneg', sql`${t.position} >= 0`),
  ],
);

export const lessons = pgTable(
  'lessons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    moduleId: uuid('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    /** Denormalized for course-scoped lookups and ownership checks. */
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    content: text('content').notNull().default(''),
    position: integer('position').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('lessons_module_pos_idx').on(t.moduleId, t.position),
    index('lessons_course_idx').on(t.courseId),
    check('lessons_position_nonneg', sql`${t.position} >= 0`),
  ],
);

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('enrollments_user_course_idx').on(t.userId, t.courseId),
    index('enrollments_course_idx').on(t.courseId),
  ],
);

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    status: progressStatusEnum('status').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('lesson_progress_user_lesson_idx').on(t.userId, t.lessonId),
    index('lesson_progress_user_course_idx').on(t.userId, t.courseId),
    // Course-wide reads (analytics, teacher views).
    index('lesson_progress_course_idx').on(t.courseId),
    index('lesson_progress_lesson_idx').on(t.lessonId),
  ],
);

export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    /** Denormalized for course-scoped ownership checks. */
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    instructions: text('instructions').notNull().default(''),
    /** Student-visible description of the expected result. Hidden CHECK rules live elsewhere (12C). */
    expectedBehavior: text('expected_behavior').notNull().default(''),
    starterFiles: jsonb('starter_files').$type<ProjectFile[]>().notNull(),
    difficulty: difficultyEnum('difficulty').notNull().default('EASY'),
    position: integer('position').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    /** Hidden CHECK rules. Staff-only; students get a safe summary of run results. */
    checks: jsonb('checks').$type<CheckRule[]>().notNull().default([]),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('exercises_lesson_pos_idx').on(t.lessonId, t.position),
    index('exercises_course_idx').on(t.courseId),
    check('exercises_position_nonneg', sql`${t.position} >= 0`),
  ],
);

/** A student's own workspace and status for one exercise. Only that student may read it. */
export const studentExercises = pgTable(
  'student_exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    status: exerciseStatusEnum('status').notNull().default('NOT_STARTED'),
    files: jsonb('files').$type<ProjectFile[]>().notNull(),
    teacherNote: text('teacher_note'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    passedAt: timestamp('passed_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('student_exercises_user_exercise_idx').on(t.userId, t.exerciseId),
    index('student_exercises_exercise_idx').on(t.exerciseId),
    index('student_exercises_user_lesson_idx').on(t.userId, t.lessonId),
    index('student_exercises_course_idx').on(t.courseId),
    index('student_exercises_lesson_idx').on(t.lessonId),
  ],
);

/**
 * One server-side CHECK of a student's saved workspace. Files and rules are snapshotted at
 * enqueue time, so a run is immutable evidence of what was checked against what.
 */
export const checkRuns = pgTable(
  'check_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    status: checkRunStatusEnum('status').notNull().default('QUEUED'),
    errorCode: text('error_code').$type<CheckErrorCode>(),
    files: jsonb('files').$type<ProjectFile[]>().notNull(),
    rules: jsonb('rules').$type<CheckRule[]>().notNull(),
    results: jsonb('results').$type<CheckEngineResult['results']>(),
    durationMs: integer('duration_ms'),
    createdAt: createdAt(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
  },
  (t) => [
    index('check_runs_user_exercise_idx').on(t.userId, t.exerciseId, t.createdAt),
    index('check_runs_user_created_idx').on(t.userId, t.createdAt),
    index('check_runs_status_idx').on(t.status),
    // Course analytics: runs and common errors (status = FAILED) per course.
    index('check_runs_course_status_idx').on(t.courseId, t.status, t.createdAt),
    index('check_runs_exercise_idx').on(t.exerciseId),
  ],
);

export const assignments = pgTable(
  'assignments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    /** Denormalized for course-scoped ownership checks. */
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    instructions: text('instructions').notNull().default(''),
    requirements: jsonb('requirements').$type<string[]>().notNull().default([]),
    starterFiles: jsonb('starter_files').$type<ProjectFile[]>().notNull(),
    rubric: jsonb('rubric').$type<RubricCriterion[]>().notNull().default([]),
    gradingPolicy: jsonb('grading_policy').$type<GradingPolicy>().notNull(),
    deadline: timestamp('deadline', { withTimezone: true }),
    maxAttempts: integer('max_attempts').notNull().default(3),
    /** Hidden CHECK rules run on each submitted version. Staff-only. */
    checks: jsonb('checks').$type<CheckRule[]>().notNull().default([]),
    position: integer('position').notNull(),
    status: assignmentStatusEnum('status').notNull().default('DRAFT'),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
  },
  (t) => [
    index('assignments_lesson_pos_idx').on(t.lessonId, t.position),
    index('assignments_course_idx').on(t.courseId),
    index('assignments_created_by_idx').on(t.createdBy),
    check('assignments_position_nonneg', sql`${t.position} >= 0`),
    check('assignments_attempts_range', sql`${t.maxAttempts} between 1 and 20`),
  ],
);

/** One per student and assignment: status and the mutable working draft. */
export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    assignmentId: uuid('assignment_id')
      .notNull()
      .references(() => assignments.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    status: submissionStatusEnum('status').notNull().default('DRAFT'),
    files: jsonb('files').$type<ProjectFile[]>().notNull(),
    /** Current grade, set only through the teacher review workflow. */
    score: integer('score'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    lastSubmittedAt: timestamp('last_submitted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('submissions_assignment_user_idx').on(t.assignmentId, t.userId),
    index('submissions_user_idx').on(t.userId),
    index('submissions_course_status_idx').on(t.courseId, t.status),
  ],
);

/** Each submit creates a new row. Rows are never updated (enforced by a DB trigger). */
export const submissionVersions = pgTable(
  'submission_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    assignmentId: uuid('assignment_id')
      .notNull()
      .references(() => assignments.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    files: jsonb('files').$type<ProjectFile[]>().notNull(),
    isLate: boolean('is_late').notNull().default(false),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('submission_versions_submission_version_idx').on(t.submissionId, t.version),
    index('submission_versions_assignment_idx').on(t.assignmentId, t.submittedAt),
    index('submission_versions_user_idx').on(t.userId),
    check('submission_versions_version_pos', sql`${t.version} >= 1`),
  ],
);

/** CHECK of one submitted version; kept apart so versions stay insert-only. */
export const submissionChecks = pgTable(
  'submission_checks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    versionId: uuid('version_id')
      .notNull()
      .references(() => submissionVersions.id, { onDelete: 'cascade' }),
    status: checkRunStatusEnum('status').notNull().default('QUEUED'),
    errorCode: text('error_code').$type<CheckErrorCode>(),
    rules: jsonb('rules').$type<CheckRule[]>().notNull(),
    results: jsonb('results').$type<CheckEngineResult['results']>(),
    durationMs: integer('duration_ms'),
    createdAt: createdAt(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('submission_checks_version_idx').on(t.versionId),
    index('submission_checks_status_idx').on(t.status),
  ],
);

/** Teacher review history. Insert-only (enforced by a DB trigger); the latest row is current. */
export const submissionReviews = pgTable(
  'submission_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    versionId: uuid('version_id')
      .notNull()
      .references(() => submissionVersions.id, { onDelete: 'cascade' }),
    reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
    action: reviewActionEnum('action').notNull(),
    feedback: text('feedback').notNull().default(''),
    score: integer('score'),
    scores: jsonb('scores').$type<RubricScore[]>(),
    createdAt: createdAt(),
  },
  (t) => [
    index('submission_reviews_submission_idx').on(t.submissionId, t.createdAt),
    // Teacher activity per reviewer (organization analytics).
    index('submission_reviews_reviewer_idx').on(t.reviewerId, t.createdAt),
    index('submission_reviews_version_idx').on(t.versionId),
  ],
);

export const quizzes = pgTable(
  'quizzes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    /** Denormalized for course-scoped ownership checks and the course map. */
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    /** Includes the correct answers: staff-only, never serialized to students. */
    questions: jsonb('questions').$type<QuizQuestion[]>().notNull().default([]),
    passingPercent: integer('passing_percent').notNull().default(70),
    isActive: boolean('is_active').notNull().default(false),
    position: integer('position').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('quizzes_lesson_pos_idx').on(t.lessonId, t.position),
    index('quizzes_course_idx').on(t.courseId),
    check('quizzes_position_nonneg', sql`${t.position} >= 0`),
    check('quizzes_passing_range', sql`${t.passingPercent} between 1 and 100`),
  ],
);

/** Graded attempts. The quiz counts as passed once any attempt passed. */
export const quizAttempts = pgTable(
  'quiz_attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    quizId: uuid('quiz_id')
      .notNull()
      .references(() => quizzes.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    answers: jsonb('answers').$type<{ questionId: string; optionIds: string[] }[]>().notNull(),
    correct: integer('correct').notNull(),
    total: integer('total').notNull(),
    score: integer('score').notNull(),
    passed: boolean('passed').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('quiz_attempts_user_quiz_idx').on(t.userId, t.quizId, t.createdAt),
    index('quiz_attempts_quiz_idx').on(t.quizId),
    index('quiz_attempts_course_idx').on(t.courseId, t.createdAt),
  ],
);

/** One per user. Private until `isPublished`; the public view is looked up by `slug`. */
export const portfolios = pgTable(
  'portfolios',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** Lowercase; required before publishing. */
    slug: text('slug'),
    displayName: text('display_name').notNull(),
    headline: text('headline').notNull().default(''),
    bio: text('bio').notNull().default(''),
    skills: jsonb('skills').$type<string[]>().notNull().default([]),
    isPublished: boolean('is_published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('portfolios_slug_idx').on(t.slug),
    check('portfolios_published_has_slug', sql`not ${t.isPublished} or ${t.slug} is not null`),
  ],
);

/**
 * Work the owner chose to show. Files and titles are snapshots taken when the item was added,
 * so the item does not depend on the source (which may change or be deleted later).
 */
export const portfolioItems = pgTable(
  'portfolio_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => portfolios.userId, { onDelete: 'cascade' }),
    kind: portfolioItemKindEnum('kind').notNull(),
    /** Exercise or assignment id. Not a foreign key: the snapshot outlives the source. */
    sourceId: uuid('source_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    courseTitle: text('course_title').notNull(),
    files: jsonb('files').$type<ProjectFile[]>().notNull(),
    position: integer('position').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('portfolio_items_user_source_idx').on(t.userId, t.kind, t.sourceId),
    index('portfolio_items_user_pos_idx').on(t.userId, t.position),
    check('portfolio_items_position_nonneg', sql`${t.position} >= 0`),
  ],
);

/**
 * One AI tutor exchange: the student's request and the (guarded) reply shown to them.
 * Only the student who asked can read it. The context sent to the model is not stored.
 */
export const aiInteractions = pgTable(
  'ai_interactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    targetKind: tutorTargetKindEnum('target_kind').notNull(),
    /** Exercise or assignment id (re-validated against the course on every request). */
    targetId: uuid('target_id').notNull(),
    requestMode: tutorModeEnum('request_mode').notNull(),
    mode: tutorModeEnum('mode').notNull(),
    level: tutorLevelEnum('level').notNull(),
    hintNumber: integer('hint_number'),
    message: text('message').notNull().default(''),
    reply: text('reply').notNull(),
    comprehensionQuestion: text('comprehension_question'),
    refused: text('refused'),
    blocked: boolean('blocked').notNull().default(false),
    /** Why the output guard intervened. Staff/audit only, never shown to the student. */
    guardReasons: jsonb('guard_reasons').$type<string[]>().notNull().default([]),
    provider: text('provider').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('ai_interactions_user_target_idx').on(t.userId, t.targetKind, t.targetId, t.createdAt),
    index('ai_interactions_course_idx').on(t.courseId),
    index('ai_interactions_org_idx').on(t.organizationId),
  ],
);

/** Hint progression survives page refreshes: one row per student and target. */
export const aiHintStates = pgTable(
  'ai_hint_states',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetKind: tutorTargetKindEnum('target_kind').notNull(),
    targetId: uuid('target_id').notNull(),
    hintsUsed: integer('hints_used').notNull().default(0),
    updatedAt: updatedAt(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.targetKind, t.targetId] }),
    check('ai_hint_states_range', sql`${t.hintsUsed} between 0 and 3`),
  ],
);

/** Usage ledger for quotas and cost: one row per provider call, including failed ones. */
export const aiUsage = pgTable(
  'ai_usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    interactionId: uuid('interaction_id').references(() => aiInteractions.id, {
      onDelete: 'set null',
    }),
    provider: text('provider').notNull(),
    model: text('model').notNull(),
    /** OK, ERROR or BLOCKED. */
    status: text('status').notNull(),
    promptChars: integer('prompt_chars').notNull(),
    completionChars: integer('completion_chars').notNull().default(0),
    attempts: integer('attempts').notNull().default(1),
    estimatedCostMicroUsd: integer('estimated_cost_micro_usd').notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [
    index('ai_usage_user_created_idx').on(t.userId, t.createdAt),
    index('ai_usage_org_idx').on(t.organizationId),
    index('ai_usage_interaction_idx').on(t.interactionId),
  ],
);

/** Helpful / not helpful. Never affects grades or progress. */
export const aiFeedback = pgTable(
  'ai_feedback',
  {
    interactionId: uuid('interaction_id')
      .primaryKey()
      .references(() => aiInteractions.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    helpful: boolean('helpful').notNull(),
    reason: text('reason'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('ai_feedback_user_idx').on(t.userId)],
);

/** A student asked for a teacher. A record for staff only; grades and progress are untouched. */
export const aiHandoffs = pgTable(
  'ai_handoffs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    interactionId: uuid('interaction_id').references(() => aiInteractions.id, {
      onDelete: 'set null',
    }),
    targetKind: tutorTargetKindEnum('target_kind').notNull(),
    targetId: uuid('target_id').notNull(),
    category: handoffCategoryEnum('category').notNull(),
    note: text('note').notNull().default(''),
    createdAt: createdAt(),
  },
  (t) => [
    index('ai_handoffs_course_idx').on(t.courseId, t.createdAt),
    index('ai_handoffs_user_idx').on(t.userId),
    index('ai_handoffs_org_idx').on(t.organizationId),
    index('ai_handoffs_interaction_idx').on(t.interactionId),
  ],
);

/**
 * Sliding-window rate limiting shared by every API instance. Keys are SHA-256 hashes, so
 * emails and IP addresses are not stored in clear text. Old rows are pruned regularly.
 */
export const rateLimitEvents = pgTable(
  'rate_limit_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    keyHash: text('key_hash').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('rate_limit_events_key_idx').on(t.keyHash, t.createdAt)],
);
