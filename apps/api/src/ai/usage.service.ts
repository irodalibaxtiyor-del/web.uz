import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { and, eq, gte, sql } from 'drizzle-orm';
import type { TutorQuota } from '@webdizayn/shared';
import { APP_CONFIG, type AppConfig } from '../config';
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

export interface UsageRecord {
  userId: string;
  organizationId: string;
  interactionId: string | null;
  provider: string;
  model: string;
  status: 'OK' | 'ERROR' | 'BLOCKED';
  promptChars: number;
  completionChars: number;
  attempts: number;
}

function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Per-student daily quota (requests and prompt characters), burst limit and cost ledger. */
@Injectable()
export class AiUsageService {
  constructor(
    private readonly dbs: DbService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  async quota(userId: string, now = new Date()): Promise<TutorQuota> {
    const [row] = await this.dbs.db
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

  /** Throws 429 before any provider call when the student is over a limit. */
  async assertAllowed(userId: string, promptChars = 0, now = new Date()): Promise<void> {
    const [burst] = await this.dbs.db
      .select({ n: sql<number>`count(*)::int` })
      .from(aiInteractions)
      .where(
        and(
          eq(aiInteractions.userId, userId),
          gte(aiInteractions.createdAt, new Date(now.getTime() - 60_000)),
        ),
      );
    if ((burst?.n ?? 0) >= this.config.AI_RATE_PER_MINUTE) {
      throw new HttpException(RATE_LIMITED, HttpStatus.TOO_MANY_REQUESTS);
    }
    const q = await this.quota(userId, now);
    if (q.requestsUsed >= q.requestsLimit || q.charsUsed + promptChars > q.charsLimit) {
      throw new HttpException(QUOTA_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  estimateCost(chars: number): number {
    return Math.round((chars / 1000) * this.config.AI_COST_PER_1K_CHARS_MICROUSD);
  }

  async record(r: UsageRecord): Promise<void> {
    await this.dbs.db.insert(aiUsage).values({
      ...r,
      estimatedCostMicroUsd: this.estimateCost(r.promptChars + r.completionChars),
    });
  }
}
