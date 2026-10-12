import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { Public } from '../common/decorators';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';

type Dependency = 'ok' | 'unavailable' | 'not_used';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private readonly dbs: DbService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /** Liveness: the process answers. */
  @Get()
  live() {
    return { status: 'ok' };
  }

  /**
   * Readiness: the database is required. The CHECK worker is reported but not required:
   * without it CHECK answers ERROR, while the rest of the platform keeps working.
   */
  @Get('ready')
  async ready() {
    const database: Dependency = await this.dbs.ping().then(
      () => 'ok',
      () => 'unavailable',
    );
    const checkWorker = await this.checkWorker();
    if (database !== 'ok') {
      throw new ServiceUnavailableException({ status: 'unavailable', checks: { database } });
    }
    return { status: 'ready', checks: { database, checkWorker } };
  }

  private async checkWorker(): Promise<Dependency> {
    if (this.config.CHECK_ENGINE !== 'remote' || !this.config.CHECK_WORKER_URL) return 'not_used';
    try {
      const res = await fetch(new URL('/health', this.config.CHECK_WORKER_URL), {
        signal: AbortSignal.timeout(2_000),
        redirect: 'error',
      });
      return res.ok ? 'ok' : 'unavailable';
    } catch {
      return 'unavailable';
    }
  }
}
