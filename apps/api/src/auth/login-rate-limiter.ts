import { Inject, Injectable } from '@nestjs/common';
import { RateLimiter } from '../common/rate-limiter';
import { APP_CONFIG, type AppConfig } from '../config';

/**
 * Failed-login limits, shared by all API instances through the database:
 * per (IP, email) pair, and a higher ceiling per IP (one IP may serve a whole classroom).
 */
@Injectable()
export class LoginRateLimiter {
  constructor(
    private readonly limiter: RateLimiter,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  private keys(ip: string, email: string): { pair: string; ip: string } {
    return { pair: `login-pair:${ip}|${email.toLowerCase()}`, ip: `login-ip:${ip}` };
  }

  private get windowMs() {
    return this.config.LOGIN_WINDOW_MINUTES * 60 * 1000;
  }

  async isBlocked(ip: string, email: string, now = new Date()): Promise<boolean> {
    const k = this.keys(ip, email);
    const max = this.config.LOGIN_MAX_FAILURES;
    const [pair, perIp] = await Promise.all([
      this.limiter.count(k.pair, this.windowMs, now),
      this.limiter.count(k.ip, this.windowMs, now),
    ]);
    return pair >= max || perIp >= max * 10;
  }

  async recordFailure(ip: string, email: string, now = new Date()): Promise<void> {
    const k = this.keys(ip, email);
    await this.limiter.record(k.pair, now);
    await this.limiter.record(k.ip, now);
  }

  async recordSuccess(ip: string, email: string): Promise<void> {
    await this.limiter.clear(this.keys(ip, email).pair);
  }
}
