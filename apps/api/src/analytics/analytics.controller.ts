import { Controller, Get, Param } from '@nestjs/common';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { AnalyticsService } from './analytics.service';

/**
 * Three scopes, each enforced on the server:
 * - `/analytics/me`: the session user's own data only;
 * - course analytics: teachers assigned to the course and org admins;
 * - organization analytics: org admins.
 */
@Controller()
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('analytics/me')
  mine(@CurrentAuth() auth: AuthContext) {
    return this.analytics.student(auth);
  }

  @Get('orgs/:orgId/courses/:courseId/analytics')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  course(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.analytics.course(auth, m, courseId);
  }

  @Get('orgs/:orgId/analytics')
  @OrgRoles('ORG_ADMIN')
  organization(@CurrentMembership() m: MembershipContext) {
    return this.analytics.organization(m);
  }
}
