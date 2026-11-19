import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import {
  CERTIFICATE_CODE_RE,
  certificateCodeFromBytes,
  normalizeCertificateCode,
  type CertificateAdminRow,
  type CertificateView,
  type MyCertificateStatus,
  type RevokeCertificateInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import { LearningService } from '../courses/learning.service';
import type { Db } from '../db/client';
import { NotificationsService } from '../notifications/notifications.service';
import { DbService } from '../db/db.module';
import { certificates, lessonProgress, organizations, users } from '../db/schema';

type CertRow = typeof certificates.$inferSelect;
const NOT_FOUND = 'Sertifikat topilmadi';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Student: own certificate (if any) and how far they are from one. */
  async mine(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<MyCertificateStatus> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const progress = await this.progress(db, auth.userId, courseId);
    const row = await this.ofStudent(db, auth.userId, courseId);
    return {
      certificate: row ? toView(row) : null,
      eligible: progress.total > 0 && progress.completed === progress.total,
      ...progress,
    };
  }

  /** Student: issues the certificate once every lesson is completed. Idempotent. */
  async claim(auth: AuthContext, m: MembershipContext, courseId: string): Promise<CertificateView> {
    const course = await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const existing = await this.ofStudent(db, auth.userId, courseId);
    if (existing) return toView(existing);

    const { completed, total } = await this.progress(db, auth.userId, courseId);
    if (total === 0 || completed < total) {
      throw new ConflictException({
        message: `Sertifikat uchun barcha darslarni tugating (${completed}/${total})`,
        code: 'CERTIFICATE_NOT_ELIGIBLE',
      });
    }
    const [user] = await db
      .select({ fullName: users.fullName })
      .from(users)
      .where(eq(users.id, auth.userId));
    const [org] = await db
      .select({ name: organizations.name })
      .from(organizations)
      .where(eq(organizations.id, course.organizationId));

    for (let attempt = 0; attempt < 3; attempt++) {
      const [row] = await db
        .insert(certificates)
        .values({
          code: certificateCodeFromBytes(randomBytes(12)),
          userId: auth.userId,
          courseId,
          fullName: user!.fullName,
          courseTitle: course.title,
          organizationName: org!.name,
          lessons: total,
        })
        .onConflictDoNothing()
        .returning();
      if (row) {
        await this.audit.record({
          action: 'certificate.issue',
          actorUserId: auth.userId,
          organizationId: m.organizationId,
          targetType: 'certificate',
          targetId: row.id,
        });
        await this.notifications.notify(
          auth.userId,
          'CERTIFICATE',
          `Tabriklaymiz! «${row.courseTitle}» kursi sertifikati tayyor.\n` +
            this.notifications.siteUrl(`/sertifikat/${row.code}`),
        );
        return toView(row);
      }
      // Either a parallel claim won (return it) or the random code collided (retry).
      const raced = await this.ofStudent(db, auth.userId, courseId);
      if (raced) return toView(raced);
    }
    throw new ConflictException('Sertifikat yaratilmadi, qayta urinib ko‘ring');
  }

  /** Signed-in user: all own certificates (dashboard). */
  async all(auth: AuthContext): Promise<CertificateView[]> {
    const rows = await this.dbs.db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, auth.userId))
      .orderBy(desc(certificates.issuedAt));
    return rows.map(toView);
  }

  /** Public verification by code. */
  async verify(code: string): Promise<CertificateView> {
    const normalized = normalizeCertificateCode(code);
    if (!CERTIFICATE_CODE_RE.test(normalized)) throw new NotFoundException(NOT_FOUND);
    const [row] = await this.dbs.db
      .select()
      .from(certificates)
      .where(eq(certificates.code, normalized))
      .limit(1);
    if (!row) throw new NotFoundException(NOT_FOUND);
    return toView(row);
  }

  // ---- Staff ----------------------------------------------------------------

  async list(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<CertificateAdminRow[]> {
    await this.access.manageableCourse(auth, m, courseId);
    const rows = await this.dbs.db
      .select()
      .from(certificates)
      .where(eq(certificates.courseId, courseId))
      .orderBy(desc(certificates.issuedAt));
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      fullName: r.fullName,
      issuedAt: r.issuedAt.toISOString(),
      revokedAt: r.revokedAt?.toISOString() ?? null,
      revokedReason: r.revokedReason,
    }));
  }

  async revoke(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    id: string,
    input: RevokeCertificateInput,
  ): Promise<CertificateAdminRow> {
    await this.access.manageableCourse(auth, m, courseId);
    const [row] = await this.dbs.db
      .update(certificates)
      .set({ revokedAt: new Date(), revokedBy: auth.userId, revokedReason: input.reason })
      .where(
        and(
          eq(certificates.id, id),
          eq(certificates.courseId, courseId),
          isNull(certificates.revokedAt),
        ),
      )
      .returning();
    if (!row) {
      const [exists] = await this.dbs.db
        .select({ id: certificates.id })
        .from(certificates)
        .where(and(eq(certificates.id, id), eq(certificates.courseId, courseId)));
      if (!exists) throw new NotFoundException(NOT_FOUND);
      throw new ConflictException({
        message: 'Sertifikat allaqachon bekor qilingan',
        code: 'CERTIFICATE_REVOKED',
      });
    }
    await this.audit.record({
      action: 'certificate.revoke',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'certificate',
      targetId: id,
    });
    return {
      id: row.id,
      code: row.code,
      fullName: row.fullName,
      issuedAt: row.issuedAt.toISOString(),
      revokedAt: row.revokedAt?.toISOString() ?? null,
      revokedReason: row.revokedReason,
    };
  }

  // ---- Helpers ----------------------------------------------------------------

  private async progress(db: Db, userId: string, courseId: string) {
    const ordered = await this.access.orderedLessons(courseId, db);
    if (ordered.length === 0) return { completed: 0, total: 0 };
    const done = await db
      .select({ lessonId: lessonProgress.lessonId })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.status, 'COMPLETED'),
          inArray(
            lessonProgress.lessonId,
            ordered.map((l) => l.id),
          ),
        ),
      );
    return { completed: done.length, total: ordered.length };
  }

  private async ofStudent(db: Db, userId: string, courseId: string) {
    const [row] = await db
      .select()
      .from(certificates)
      .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
      .limit(1);
    return row;
  }
}

function toView(r: CertRow): CertificateView {
  return {
    code: r.code,
    fullName: r.fullName,
    courseTitle: r.courseTitle,
    organizationName: r.organizationName,
    lessons: r.lessons,
    issuedAt: r.issuedAt.toISOString(),
    revoked: r.revokedAt !== null,
    revokedReason: r.revokedReason,
  };
}
