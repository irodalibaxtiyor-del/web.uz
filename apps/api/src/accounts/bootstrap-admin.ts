import { and, eq, sql } from 'drizzle-orm';
import { emailSchema, loginNameSchema, PASSWORD_MAX_LENGTH } from '@webdizayn/shared';
import type { PasswordService } from '../auth/password.service';
import type { Db } from '../db/client';
import { auditEvents, memberships, users } from '../db/schema';
import { LOGIN_LOCK } from '../groups/roster-import';

export const BOOTSTRAP_PASSWORD_MIN = 12;

export interface BootstrapAdminInput {
  /** An email, or a login (LOGIN_RE). */
  identifier: string;
  fullName: string;
  password: string;
}

export type BootstrapResult = 'CREATED' | 'ADMIN_EXISTS' | 'IDENTIFIER_TAKEN';

/**
 * One-time creation of the first administrator of an organization. Does nothing when the
 * organization already has an ORG_ADMIN, so it is safe to run on every deploy. The password
 * comes from the operator's environment, is stored as an Argon2id hash and must be changed on
 * the first sign-in.
 */
export async function bootstrapAdmin(
  db: Db,
  passwords: PasswordService,
  organizationId: string,
  input: BootstrapAdminInput,
): Promise<BootstrapResult> {
  const id = input.identifier.trim().toLowerCase();
  const isEmail = id.includes('@');
  const parsed = isEmail ? emailSchema.safeParse(id) : loginNameSchema.safeParse(id);
  if (!parsed.success) throw new Error('BOOTSTRAP_ADMIN_LOGIN is not a valid email or login');
  if (
    input.password.length < BOOTSTRAP_PASSWORD_MIN ||
    input.password.length > PASSWORD_MAX_LENGTH
  ) {
    throw new Error(`BOOTSTRAP_ADMIN_PASSWORD must be ${BOOTSTRAP_PASSWORD_MIN}+ characters`);
  }
  const fullName = input.fullName.trim();
  if (fullName.length < 2) throw new Error('BOOTSTRAP_ADMIN_NAME is required');
  const passwordHash = await passwords.hash(input.password);

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${LOGIN_LOCK}))`);
    const [existingAdmin] = await tx
      .select({ id: memberships.id })
      .from(memberships)
      .where(and(eq(memberships.organizationId, organizationId), eq(memberships.role, 'ORG_ADMIN')))
      .limit(1);
    if (existingAdmin) return 'ADMIN_EXISTS';
    const column = isEmail ? users.email : users.login;
    const [taken] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(sql`lower(${column})`, parsed.data))
      .limit(1);
    if (taken) return 'IDENTIFIER_TAKEN';
    const [u] = await tx
      .insert(users)
      .values({
        ...(isEmail ? { email: parsed.data } : { login: parsed.data }),
        fullName,
        passwordHash,
        mustChangePassword: true,
      })
      .returning({ id: users.id });
    await tx.insert(memberships).values({ userId: u!.id, organizationId, role: 'ORG_ADMIN' });
    await tx.insert(auditEvents).values({
      action: 'admin.bootstrap',
      organizationId,
      targetType: 'user',
      targetId: u!.id,
    });
    return 'CREATED';
  });
}
