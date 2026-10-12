import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { and, eq, gte, lt, sql } from 'drizzle-orm';
import type { TutorQuota } from '@webdizayn/shared';
import { APP_CONFIG, type AppConfig } from '../config';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { aiInteractions, aiUsage } from '../db/schema';

const QUOTA_EXCEEDED = {
  message: 'Bugungi AI yordamchi limiti tugadi. Ertaga yana urinib ko‘ring.',
  code: 'AI_QUOTA_EXCEEDED',
};
const RATE_LIMITED = {
  message: 'Juda tez-tez so‘rov yuborilmoqda. Bir daqiqadan keyin urinib ko‘ring.',
  code: 'AI_RATE_LIMITED',
};

export interface UsageResult {
  interactionId: string | null;
  model: string;
  status: 'OK' | 'ERROR' | 'BLOCKED';
  completionChars: number;
  attempts: number;
}

function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Per-student daily quota (requests and prompt characters), burst limit and cost ledger.
 * A provider call first reserves its slot in a transaction holding a per-user advisory lock,
 * so parallel requests cannot all pass the check before any of them is recorded.
 */
@Injectable()
export class AiUsageService implements OnModuleInit {
  constructor(
    private readonly dbs: DbService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /**
   * A crash between reserve() and finish() leaves a PENDING row. Close those that are older
   * than any request could take (they still count: the provider may have been called).
   * Younger ones may belong to another running instance and are left alone.
   */
  async onModuleInit(): Promise<void> {
    await this.closeStale();
  }

  async closeStale(now = new Date()): Promise<number> {
    const maxMs = this.config.AI_REQUEST_TIMEOUT_MS * this.config.AI_MAX_ATTEMPTS + 60_000;
    const rows = await this.dbs.db
      .update(aiUsage)
      .set({ status: 'ERROR' })
      .where(
        and(eq(aiUsage.status, 'PENDING'), lt(aiUsage.createdAt, new Date(now.getTime() - maxMs))),
      )
      .returning({ id: aiUsage.id });
    return rows.length;
  }

  async quota(userId: string, now = new Date(), db: Db = this.dbs.db): Promise<TutorQuota> {
    const [row] = await db
      .select({
        requests: sql<number>`count(*)::int`,
        chars: sql<number>`coalesce(sum(${aiUsage.promptChars}), 0)::int`,
      })
      .from(aiUsage)
      .where(and(eq(aiUsage.userId, userId), gte(aiUsage.createdAt, startOfUtcDay(now))));
    return {
      requestsUsed: row?.requests ?? 0,
      requestsLimit: this.config.AI_DAILY_REQUESTS,
      charsUsed: row?.chars ?? 0,
      charsLimit: this.config.AI_DAILY_PROMPT_CHARS,
    };
  }

  /** Provider calls (reserved or done) plus answers given without a provider, last minute. */
  private async burst(db: Db, userId: string, now: Date): Promise<number> {
    const since = new Date(now.getTime() - 60_000);
    const [calls, local] = await Promise.all([
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(aiUsage)
        .where(and(eq(aiUsage.userId, userId), gte(aiUsage.createdAt, since))),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(aiInteractions)
        .where(
          and(
            eq(aiInteractions.userId, userId),
            eq(aiInteractions.provider, 'none'),
            gte(aiInteractions.createdAt, since),
          ),
        ),
    ]);
    return (calls[0]?.n ?? 0) + (local[0]?.n ?? 0);
  }

  private async check(db: Db, userId: string, promptChars: number, now: Date) {
    if ((await this.burst(db, userId, now)) >= this.config.AI_RATE_PER_MINUTE) {
      throw new HttpException(RATE_LIMITED, HttpStatus.TOO_MANY_REQUESTS);
    }
    const q = await this.quota(userId, now, db);
    if (q.requestsUsed >= q.requestsLimit || q.charsUsed + promptChars > q.charsLimit) {
      throw new HttpException(QUOTA_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  /** Early, non-reserving check (also used for answers that never reach a provider). */
  async assertAllowed(userId: string, now = new Date()): Promise<void> {
    await this.check(this.dbs.db, userId, 0, now);
  }

  /** Atomically checks the limits and reserves a usage row for one provider call. */
  async reserve(
    userId: string,
    organizationId: string,
    promptChars: number,
    provider: string,
    model: string,
    now = new Date(),
  ): Promise<string> {
    return this.dbs.db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`ai-usage:${userId}`}))`);
      await this.check(tx, userId, promptChars, now);
      const [row] = await tx
        .insert(aiUsage)
        .values({
          userId,
          organizationId,
          provider,
          model,
          status: 'PENDING',
          promptChars,
          estimatedCostMicroUsd: this.estimateCost(promptChars),
        })
        .returning({ id: aiUsage.id });
      return row!.id;
    });
  }

  async finish(usageId: string, r: UsageResult): Promise<void> {
    const [row] = await this.dbs.db
      .select({ promptChars: aiUsage.promptChars })
      .from(aiUsage)
      .where(eq(aiUsage.id, usageId));
    await this.dbs.db
      .update(aiUsage)
      .set({
        ...r,
        estimatedCostMicroUsd: this.estimateCost((row?.promptChars ?? 0) + r.completionChars),
      })
      .where(eq(aiUsage.id, usageId));
  }

  estimateCost(chars: number): number {
    return Math.round((chars / 1000) * this.config.AI_COST_PER_1K_CHARS_MICROUSD);
  }
}
