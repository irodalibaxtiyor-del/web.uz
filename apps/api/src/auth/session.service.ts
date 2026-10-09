import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt } from 'drizzle-orm';
import { createHash, randomBytes } from 'node:crypto';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';
import { sessions } from '../db/schema';
import type { AuthContext } from '../common/types';

export const SESSION_COOKIE = 'wd_session';
const HOUR_MS = 60 * 60 * 1000;
/** Avoid a write on every request; idle tracking only needs coarse precision. */
const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class SessionService {
  constructor(
    private readonly dbs: DbService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  async create(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + this.config.SESSION_TTL_HOURS * HOUR_MS);
    await this.dbs.db.insert(sessions).values({ userId, tokenHash: hashToken(token), expiresAt });
    return { token, expiresAt };
  }

  async validate(token: string | undefined): Promise<AuthContext | null> {
    if (!token || token.length > 128) return null;
    const now = new Date();
    const [row] = await this.dbs.db
      .select({ id: sessions.id, userId: sessions.userId, lastSeenAt: sessions.lastSeenAt })
      .from(sessions)
      .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, now)))
      .limit(1);
    if (!row) return null;

    const idleMs = now.getTime() - row.lastSeenAt.getTime();
    if (idleMs > this.config.SESSION_IDLE_HOURS * HOUR_MS) {
      await this.dbs.db.delete(sessions).where(eq(sessions.id, row.id));
      return null;
    }
    if (idleMs > TOUCH_INTERVAL_MS) {
      await this.dbs.db.update(sessions).set({ lastSeenAt: now }).where(eq(sessions.id, row.id));
    }
    return { sessionId: row.id, userId: row.userId };
  }

  async revoke(sessionId: string): Promise<void> {
    await this.dbs.db.delete(sessions).where(eq(sessions.id, sessionId));
  }
}
