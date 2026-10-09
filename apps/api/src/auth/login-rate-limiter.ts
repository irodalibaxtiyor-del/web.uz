import { Inject, Injectable } from '@nestjs/common';
import { APP_CONFIG, type AppConfig } from '../config';

/**
 * In-process sliding-window limiter for failed logins.
 * Limitation: state is per process. Move to Redis before running multiple API instances.
 */
@Injectable()
export class LoginRateLimiter {
  private readonly failures = new Map<string, number[]>();

  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  private keys(ip: string, email: string): { pair: string; ip: string } {
    return { pair: `pair:${ip}|${email}`, ip: `ip:${ip}` };
  }

  private recent(key: string, now: number): number[] {
    const windowMs = this.config.LOGIN_WINDOW_MINUTES * 60 * 1000;
    const list = (this.failures.get(key) ?? []).filter((t) => now - t < windowMs);
    if (list.length) this.failures.set(key, list);
    else this.failures.delete(key);
    return list;
  }

  isBlocked(ip: string, email: string, now = Date.now()): boolean {
    const k = this.keys(ip, email);
    const max = this.config.LOGIN_MAX_FAILURES;
    // One IP may legitimately serve a whole classroom, so the per-IP ceiling is higher.
    return this.recent(k.pair, now).length >= max || this.recent(k.ip, now).length >= max * 10;
  }

  recordFailure(ip: string, email: string, now = Date.now()): void {
    const k = this.keys(ip, email);
    for (const key of [k.pair, k.ip]) {
      this.failures.set(key, [...this.recent(key, now), now]);
    }
  }

  recordSuccess(ip: string, email: string): void {
    this.failures.delete(this.keys(ip, email).pair);
  }
}
