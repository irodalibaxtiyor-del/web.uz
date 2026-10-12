import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { and, count, eq, gte, lt, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { rateLimitEvents } from '../db/schema';

/** Events older than this are deleted; longer than any window we use. */
const RETENTION_MS = 24 * 60 * 60_000;
/** Prune roughly once per this many writes per process. */
const PRUNE_EVERY = 500;

export function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/**
 * Sliding-window limiter stored in Postgres, so every API instance shares the same counts.
 * Check-and-record runs in a transaction holding an advisory lock on the key, which makes it
 * atomic under concurrency.
 */
@Injectable()
export class RateLimiter {
  private writes = 0;

  constructor(private readonly dbs: DbService) {}

  async count(key: string, windowMs: number, now = new Date(), db: Db = this.dbs.db) {
    const [row] = await db
      .select({ n: count() })
      .from(rateLimitEvents)
      .where(
        and(
          eq(rateLimitEvents.keyHash, hashKey(key)),
          gte(rateLimitEvents.createdAt, new Date(now.getTime() - windowMs)),
        ),
      );
    return row?.n ?? 0;
  }

  async record(key: string, now = new Date(), db: Db = this.dbs.db): Promise<void> {
    await db.insert(rateLimitEvents).values({ keyHash: hashKey(key), createdAt: now });
    if (++this.writes % PRUNE_EVERY === 0) {
      await db
        .delete(rateLimitEvents)
        .where(lt(rateLimitEvents.createdAt, new Date(now.getTime() - RETENTION_MS)));
    }
  }

  async clear(key: string): Promise<void> {
    await this.dbs.db.delete(rateLimitEvents).where(eq(rateLimitEvents.keyHash, hashKey(key)));
  }

  /** Records a hit, or throws 429 with `code` when the key is over `limit` in `windowMs`. */
  async consume(
    key: string,
    limit: number,
    windowMs: number,
    code: string,
    now = new Date(),
  ): Promise<void> {
    const allowed = await this.dbs.db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${hashKey(key)}))`);
      if ((await this.count(key, windowMs, now, tx)) >= limit) return false;
      await this.record(key, now, tx);
      return true;
    });
    if (!allowed) {
      throw new HttpException(
        { message: 'Juda ko‘p so‘rov. Birozdan keyin urinib ko‘ring', code },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
