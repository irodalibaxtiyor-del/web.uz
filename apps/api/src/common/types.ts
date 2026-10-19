import type { Role } from '@webdizayn/shared';

export interface AuthContext {
  userId: string;
  sessionId: string;
  /** An admin issued a temporary password: only the password change routes are open. */
  mustChangePassword: boolean;
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
    /** Set by the request observer; echoed in X-Request-Id and in 500 responses. */
    requestId?: string;
  }
}
