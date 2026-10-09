import type { Role } from '@webdizayn/shared';

export interface AuthContext {
  userId: string;
  sessionId: string;
}

export interface MembershipContext {
  organizationId: string;
  role: Role;
}

declare module 'express-serve-static-core' {
  interface Request {
    /** Set only by AuthGuard from a validated server-side session. */
    auth?: AuthContext;
    /** Set only by OrgRoleGuard from the memberships table. */
    membership?: MembershipContext;
  }
}
