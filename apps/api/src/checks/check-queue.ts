import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { APP_CONFIG, type AppConfig } from '../config';

/**
 * In-process FIFO with bounded concurrency, so CHECK cannot exhaust the host with browsers.
 * Single-instance only; a multi-instance deployment needs a shared queue (e.g. Redis/BullMQ).
 */
@Injectable()
export class CheckQueue implements OnModuleDestroy {
  private readonly logger = new Logger(CheckQueue.name);
  private readonly pending: (() => Promise<void>)[] = [];
  private active = 0;
  private idleWaiters: (() => void)[] = [];

  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  enqueue(job: () => Promise<void>): void {
    this.pending.push(job);
    this.pump();
  }

  /** Runs `job` through the queue and resolves with its result. */
  submit<T>(job: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.enqueue(() => job().then(resolve, reject));
    });
  }

  /** Resolves once nothing is queued or running. */
  idle(): Promise<void> {
    if (this.active === 0 && this.pending.length === 0) return Promise.resolve();
    return new Promise((resolve) => this.idleWaiters.push(resolve));
  }

  async onModuleDestroy(): Promise<void> {
    // Let running jobs finish writing results before the DB closes (jobs are time-bounded).
    await this.idle();
  }

  private pump(): void {
    while (this.active < this.config.CHECK_CONCURRENCY && this.pending.length > 0) {
      const job = this.pending.shift()!;
      this.active++;
      job()
        .catch((err: unknown) => {
          this.logger.error(`CHECK job failed: ${err instanceof Error ? err.name : 'unknown'}`);
        })
        .finally(() => {
          this.active--;
          this.pump();
          if (this.active === 0 && this.pending.length === 0) {
            const waiters = this.idleWaiters;
            this.idleWaiters = [];
            waiters.forEach((w) => w());
          }
        });
    }
  }
}
