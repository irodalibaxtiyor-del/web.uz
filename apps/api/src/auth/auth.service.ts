import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import type { ChangePasswordInput, LoginInput, MeResponse, RegisterInput } from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';
import { memberships, organizations, users } from '../db/schema';
import { LoginRateLimiter } from './login-rate-limiter';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';

const INVALID_CREDENTIALS = "Login yoki parol noto'g'ri";

@Injectable()
export class AuthService {
  constructor(
    private readonly dbs: DbService,
    private readonly passwords: PasswordService,
    private readonly sessions: SessionService,
    private readonly limiter: LoginRateLimiter,
    private readonly audit: AuditService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /** Self-registration always creates a STUDENT in the default organization. */
  async register(input: RegisterInput) {
    const db = this.dbs.db;
    const [org] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, this.config.DEFAULT_ORG_SLUG))
      .limit(1);
    if (!org) throw new Error('Default organization is missing');

    const passwordHash = await this.passwords.hash(input.password);
    const user = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({ email: input.email, passwordHash, fullName: input.fullName })
        .onConflictDoNothing()
        .returning({ id: users.id });
      if (!created) return null;
      await tx
        .insert(memberships)
        .values({ userId: created.id, organizationId: org.id, role: 'STUDENT' });
      return created;
    });
    if (!user) throw new ConflictException("Bu email bilan ro'yxatdan o'tib bo'lmaydi");

    await this.audit.record({
      action: 'auth.register',
      actorUserId: user.id,
      organizationId: org.id,
    });
    const session = await this.sessions.create(user.id);
    return { userId: user.id, ...session };
  }

  async login(input: LoginInput, ip: string) {
    const id = input.identifier;
    if (await this.limiter.isBlocked(ip, id)) {
      throw new HttpException(
        "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const column = id.includes('@') ? users.email : users.login;
    const [user] = await this.dbs.db
      .select({ id: users.id, passwordHash: users.passwordHash, disabledAt: users.disabledAt })
      .from(users)
      .where(eq(sql`lower(${column})`, id))
      .limit(1);

    // A disabled account fails exactly like a wrong password (same message, same hashing work).
    const ok = await this.passwords.verify(user?.passwordHash ?? null, input.password);
    if (!user || !ok || user.disabledAt) {
      await this.limiter.recordFailure(ip, id);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }
    await this.limiter.recordSuccess(ip, id);
    await this.audit.record({ action: 'auth.login', actorUserId: user.id });
    const session = await this.sessions.create(user.id);
    return { userId: user.id, ...session };
  }

  /**
   * Replaces the password (temporary or not). Other sessions are signed out; the current one
   * stays. Wrong current passwords count against the login limiter of this account.
   */
  async changePassword(
    userId: string,
    sessionId: string,
    input: ChangePasswordInput,
    ip: string,
  ): Promise<void> {
    const limiterKey = `user:${userId}`;
    if (await this.limiter.isBlocked(ip, limiterKey)) {
      throw new HttpException(
        "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const [user] = await this.dbs.db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user || !(await this.passwords.verify(user.passwordHash, input.currentPassword))) {
      await this.limiter.recordFailure(ip, limiterKey);
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'WRONG_PASSWORD',
        message: "Joriy parol noto'g'ri",
      });
    }
    await this.limiter.recordSuccess(ip, limiterKey);
    const passwordHash = await this.passwords.hash(input.newPassword);
    await this.dbs.db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ passwordHash, mustChangePassword: false, passwordChangedAt: new Date() })
        .where(eq(users.id, userId));
      await this.sessions.revokeAll(userId, tx, sessionId);
    });
    await this.audit.record({ action: 'auth.password_change', actorUserId: userId });
  }

  async logout(sessionId: string, userId: string): Promise<void> {
    await this.sessions.revoke(sessionId);
    await this.audit.record({ action: 'auth.logout', actorUserId: userId });
  }

  async me(userId: string): Promise<MeResponse> {
    const db = this.dbs.db;
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        login: users.login,
        fullName: users.fullName,
        mustChangePassword: users.mustChangePassword,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) throw new NotFoundException();
    const rows = await db
      .select({
        organizationId: memberships.organizationId,
        organizationName: organizations.name,
        role: memberships.role,
      })
      .from(memberships)
      .innerJoin(organizations, eq(organizations.id, memberships.organizationId))
      .where(eq(memberships.userId, userId));
    return { ...user, memberships: rows };
  }
}
