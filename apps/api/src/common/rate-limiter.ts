import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

const MAX_KEYS = 50_000;

/**
 * In-process sliding-window limiter for unauthenticated endpoints (keyed by client IP).
 * Limitation: per process, like the login limiter. Move to Redis for several API instances.
 */
@Injectable()
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  /** Records a hit, or throws 429 with `code` when the key is over `limit` in `windowMs`. */
  consume(key: string, limit: number, windowMs: number, code: string, now = Date.now()): void {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      this.hits.set(key, recent);
      throw new HttpException(
        { message: 'Juda ko‘p so‘rov. Birozdan keyin urinib ko‘ring', code },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > MAX_KEYS) this.prune(now, windowMs);
  }

  /** Bounds memory under a flood of distinct keys: drop keys with no hit inside the window. */
  private prune(now: number, windowMs: number) {
    for (const [k, list] of this.hits) {
      if (!list.some((t) => now - t < windowMs)) this.hits.delete(k);
    }
  }
}
