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
import type { LoginInput, MeResponse, RegisterInput } from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';
import { memberships, organizations, users } from '../db/schema';
import { LoginRateLimiter } from './login-rate-limiter';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';

const INVALID_CREDENTIALS = "Email yoki parol noto'g'ri";

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
    if (this.limiter.isBlocked(ip, input.email)) {
      throw new HttpException(
        "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const [user] = await this.dbs.db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(sql`lower(${users.email})`, input.email))
      .limit(1);

    const ok = await this.passwords.verify(user?.passwordHash ?? null, input.password);
    if (!user || !ok) {
      this.limiter.recordFailure(ip, input.email);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }
    this.limiter.recordSuccess(ip, input.email);
    await this.audit.record({ action: 'auth.login', actorUserId: user.id });
    const session = await this.sessions.create(user.id);
    return { userId: user.id, ...session };
  }

  async logout(sessionId: string, userId: string): Promise<void> {
    await this.sessions.revoke(sessionId);
    await this.audit.record({ action: 'auth.logout', actorUserId: userId });
  }

  async me(userId: string): Promise<MeResponse> {
    const db = this.dbs.db;
    const [user] = await db
      .select({ id: users.id, email: users.email, fullName: users.fullName })
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
