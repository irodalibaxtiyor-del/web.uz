import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, max } from 'drizzle-orm';
import type {
  CreateExerciseInput,
  ExerciseAdmin,
  ExerciseStatus,
  ExerciseStudentProgress,
  ExerciseView,
  ProjectFile,
  SetExerciseStatusInput,
  UpdateExerciseInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import { LearningService, LOCKED } from '../courses/learning.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { enrollments, exercises, studentExercises, users } from '../db/schema';

const adminColumns = {
  id: exercises.id,
  lessonId: exercises.lessonId,
  title: exercises.title,
  description: exercises.description,
  instructions: exercises.instructions,
  expectedBehavior: exercises.expectedBehavior,
  starterFiles: exercises.starterFiles,
  difficulty: exercises.difficulty,
  position: exercises.position,
  isActive: exercises.isActive,
  checks: exercises.checks,
};

@Injectable()
export class ExercisesService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
    private readonly audit: AuditService,
  ) {}

  // ---- Staff ------------------------------------------------------------

  async create(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
    input: CreateExerciseInput,
  ): Promise<ExerciseAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const db = this.dbs.db;
    let position = input.position;
    if (position === undefined) {
      const [row] = await db
        .select({ max: max(exercises.position) })
        .from(exercises)
        .where(eq(exercises.lessonId, lessonId));
      position = row?.max === null || row?.max === undefined ? 0 : row.max + 1;
    }
    const [created] = await db
      .insert(exercises)
      .values({ ...input, position, lessonId, courseId })
      .returning(adminColumns);
    await this.audit.record({
      action: 'exercise.create',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'exercise',
      targetId: created!.id,
    });
    return created!;
  }

  async listForLesson(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
  ): Promise<ExerciseAdmin[]> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    return this.dbs.db
      .select(adminColumns)
      .from(exercises)
      .where(eq(exercises.lessonId, lessonId))
      .orderBy(asc(exercises.position), asc(exercises.createdAt));
  }

  async getForEdit(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
  ): Promise<ExerciseAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    return this.exerciseInCourse(this.dbs.db, courseId, exerciseId);
  }

  async update(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
    input: UpdateExerciseInput,
  ): Promise<ExerciseAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.exerciseInCourse(this.dbs.db, courseId, exerciseId);
    const [row] = await this.dbs.db
      .update(exercises)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(exercises.id, exerciseId))
      .returning(adminColumns);
    return row!;
  }

  /** Enrolled students and their status. Never includes workspace files or emails. */
  async studentProgress(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
  ): Promise<ExerciseStudentProgress[]> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.exerciseInCourse(this.dbs.db, courseId, exerciseId);
    const rows = await this.dbs.db
      .select({
        userId: users.id,
        fullName: users.fullName,
        status: studentExercises.status,
        updatedAt: studentExercises.updatedAt,
      })
      .from(enrollments)
      .innerJoin(users, eq(users.id, enrollments.userId))
      .leftJoin(
        studentExercises,
        and(
          eq(studentExercises.userId, enrollments.userId),
          eq(studentExercises.exerciseId, exerciseId),
        ),
      )
      .where(eq(enrollments.courseId, courseId))
      .orderBy(asc(users.fullName));
    return rows.map((r) => ({
      userId: r.userId,
      fullName: r.fullName,
      status: r.status ?? 'NOT_STARTED',
      updatedAt: r.updatedAt?.toISOString() ?? null,
    }));
  }

  /** Manual teacher override. The student must be enrolled in this course. */
  async setStatusByTeacher(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
    studentId: string,
    input: SetExerciseStatusInput,
  ) {
    await this.access.manageableCourse(auth, m, courseId);
    await this.dbs.db.transaction(async (tx) => {
      const db = tx as unknown as Db;
      const exercise = await this.exerciseInCourse(db, courseId, exerciseId);
      const [enrolled] = await db
        .select({ id: enrollments.id })
        .from(enrollments)
        .where(and(eq(enrollments.userId, studentId), eq(enrollments.courseId, courseId)))
        .limit(1);
      if (!enrolled) throw new NotFoundException('Talaba topilmadi');
      await this.applyStatus(db, studentId, courseId, exercise, input.status, input.note ?? null);
    });
    await this.audit.record({
      action: 'exercise.status_set',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'exercise',
      targetId: exerciseId,
      metadata: { studentId, status: input.status },
    });
    return { status: input.status };
  }

  /**
   * Single entry point for status changes (teacher override and the CHECK engine).
   * A PASSED result may complete the lesson. `teacherNote: undefined` keeps the current note.
   */
  async applyStatus(
    db: Db,
    userId: string,
    courseId: string,
    exercise: ExerciseAdmin,
    status: ExerciseStatus,
    teacherNote?: string | null,
  ) {
    const now = new Date();
    await db
      .insert(studentExercises)
      .values({
        userId,
        exerciseId: exercise.id,
        courseId,
        lessonId: exercise.lessonId,
        status,
        files: exercise.starterFiles,
        teacherNote: teacherNote ?? null,
        passedAt: status === 'PASSED' ? now : null,
      })
      .onConflictDoUpdate({
        target: [studentExercises.userId, studentExercises.exerciseId],
        set: {
          status,
          ...(teacherNote !== undefined ? { teacherNote } : {}),
          updatedAt: now,
          ...(status === 'PASSED' ? { passedAt: now } : {}),
        },
      });
    if (status === 'PASSED') {
      await this.learning.completeIfExercisesPassed(db, userId, courseId, exercise.lessonId);
    }
  }

  // ---- Student ----------------------------------------------------------

  async view(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
  ): Promise<ExerciseView> {
    const exercise = await this.accessibleExercise(auth, m, courseId, exerciseId);
    const row = await this.ensureWorkspace(this.dbs.db, auth.userId, courseId, exercise);
    return this.toView(exercise, row);
  }

  async saveWorkspace(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
    files: ProjectFile[],
  ): Promise<ExerciseView> {
    const exercise = await this.accessibleExercise(auth, m, courseId, exerciseId);
    return this.writeFiles(auth.userId, courseId, exercise, files);
  }

  async resetWorkspace(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
  ): Promise<ExerciseView> {
    const exercise = await this.accessibleExercise(auth, m, courseId, exerciseId);
    return this.writeFiles(auth.userId, courseId, exercise, exercise.starterFiles);
  }

  // ---- Helpers ----------------------------------------------------------

  private async writeFiles(
    userId: string,
    courseId: string,
    exercise: ExerciseAdmin,
    files: ProjectFile[],
  ): Promise<ExerciseView> {
    const db = this.dbs.db;
    const current = await this.ensureWorkspace(db, userId, courseId, exercise);
    const [row] = await db
      .update(studentExercises)
      .set({
        files,
        updatedAt: new Date(),
        ...(current.status === 'NOT_STARTED' ? { status: 'IN_PROGRESS' as const } : {}),
      })
      .where(eq(studentExercises.id, current.id))
      .returning();
    return this.toView(exercise, row!);
  }

  /** Published course, enrolled student, active exercise, and its lesson must not be locked. */
  async accessibleExercise(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
  ): Promise<ExerciseAdmin> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    const exercise = await this.exerciseInCourse(db, courseId, exerciseId);
    if (!exercise.isActive) throw new NotFoundException('Mashq topilmadi');
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const state = await this.learning.lessonState(db, auth.userId, courseId, exercise.lessonId);
    if (state === 'LOCKED') throw new ForbiddenException(LOCKED);
    return exercise;
  }

  async exerciseInCourse(db: Db, courseId: string, exerciseId: string) {
    const [row] = await db
      .select(adminColumns)
      .from(exercises)
      .where(and(eq(exercises.id, exerciseId), eq(exercises.courseId, courseId)))
      .limit(1);
    if (!row) throw new NotFoundException('Mashq topilmadi');
    return row;
  }

  async ensureWorkspace(db: Db, userId: string, courseId: string, ex: ExerciseAdmin) {
    await db
      .insert(studentExercises)
      .values({
        userId,
        exerciseId: ex.id,
        courseId,
        lessonId: ex.lessonId,
        files: ex.starterFiles,
      })
      .onConflictDoNothing();
    const [row] = await db
      .select()
      .from(studentExercises)
      .where(and(eq(studentExercises.userId, userId), eq(studentExercises.exerciseId, ex.id)));
    return row!;
  }

  private toView(ex: ExerciseAdmin, row: typeof studentExercises.$inferSelect): ExerciseView {
    return {
      id: ex.id,
      lessonId: ex.lessonId,
      title: ex.title,
      description: ex.description,
      instructions: ex.instructions,
      expectedBehavior: ex.expectedBehavior,
      difficulty: ex.difficulty,
      status: row.status,
      files: row.files,
      teacherNote: row.teacherNote,
      updatedAt: row.updatedAt.toISOString(),
      checkAvailable: ex.checks.length > 0,
    };
  }
}
