import {
  Body,
  Controller,
  HttpCode,
  Injectable,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { and, eq, inArray, sql } from 'drizzle-orm';
import {
  activityPingSchema,
  creditedSeconds,
  type ActivityKind,
  type ActivityPingInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { CourseAccessService } from '../courses/course-access.service';
import { LearningService } from '../courses/learning.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  activityLastPing,
  activityTime,
  assignments,
  exercises,
  lessons,
  quizzes,
} from '../db/schema';

/** Asia/Tashkent calendar day (UTC+5, no DST). */
function tashkentDay(now: Date): string {
  return new Date(now.getTime() + 5 * 3600_000).toISOString().slice(0, 10);
}

const TARGET = {
  LESSON: lessons,
  EXERCISE: exercises,
  QUIZ: quizzes,
  ASSIGNMENT: assignments,
} as const;

@Injectable()
export class ActivityService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
  ) {}

  /** Credits active seconds for a learning item of the course; returns what was credited. */
  async ping(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    input: ActivityPingInput,
  ): Promise<{ credited: number }> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    await this.requireTarget(db, courseId, input.kind, input.targetId);
    const now = new Date();
    const credited = await db.transaction(async (tx) => {
      const t = tx as unknown as Db;
      // Serializes the student's pings (parallel tabs) so time is never counted twice.
      await t.execute(sql`select pg_advisory_xact_lock(hashtext(${'activity:' + auth.userId}))`);
      const [last] = await t
        .select({ at: activityLastPing.at })
        .from(activityLastPing)
        .where(eq(activityLastPing.userId, auth.userId));
      const seconds = creditedSeconds(input.seconds, now.getTime(), last?.at.getTime() ?? null);
      await t
        .insert(activityLastPing)
        .values({ userId: auth.userId, at: now })
        .onConflictDoUpdate({ target: activityLastPing.userId, set: { at: now } });
      if (seconds > 0) {
        await t
          .insert(activityTime)
          .values({
            userId: auth.userId,
            courseId,
            kind: input.kind,
            targetId: input.targetId,
            day: tashkentDay(now),
            seconds,
          })
          .onConflictDoUpdate({
            target: [activityTime.userId, activityTime.targetId, activityTime.day],
            set: { seconds: sql`${activityTime.seconds} + ${seconds}` },
          });
      }
      return seconds;
    });
    return { credited };
  }

  private async requireTarget(db: Db, courseId: string, kind: ActivityKind, id: string) {
    const table = TARGET[kind];
    const [row] = await db
      .select({ id: table.id })
      .from(table)
      .where(and(eq(table.id, id), eq(table.courseId, courseId)))
      .limit(1);
    if (!row) throw new NotFoundException('Topilmadi');
  }
}

/** Active seconds per student in a course (optionally limited to some students). */
export async function activeSecondsByUser(
  db: Db,
  courseId: string,
  userIds?: string[],
): Promise<Map<string, number>> {
  if (userIds && userIds.length === 0) return new Map();
  const rows = await db
    .select({
      userId: activityTime.userId,
      seconds: sql<number>`sum(${activityTime.seconds})::int`,
    })
    .from(activityTime)
    .where(
      and(
        eq(activityTime.courseId, courseId),
        userIds ? inArray(activityTime.userId, userIds) : undefined,
      ),
    )
    .groupBy(activityTime.userId);
  return new Map(rows.map((r) => [r.userId, r.seconds]));
}

@Controller('orgs/:orgId/courses/:courseId/activity')
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Post()
  @HttpCode(200)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  ping(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Body(new ZodPipe(activityPingSchema)) body: ActivityPingInput,
  ) {
    return this.activity.ping(auth, m, courseId, body);
  }
}
