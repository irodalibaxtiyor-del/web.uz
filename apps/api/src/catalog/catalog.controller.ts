import { Controller, Get, Inject, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../common/decorators';
import { RateLimiter } from '../common/rate-limiter';
import { APP_CONFIG, type AppConfig } from '../config';
import { CatalogService } from './catalog.service';

/** Anonymous catalogue (server-rendered SEO pages): directions and published platform courses. */
@Controller('public')
export class CatalogController {
  constructor(
    private readonly catalog: CatalogService,
    private readonly limiter: RateLimiter,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  @Public()
  @Get('directions')
  async directions(@Req() req: Request) {
    await this.limit(req);
    return this.catalog.directions();
  }

  @Public()
  @Get('directions/:slug')
  async direction(@Param('slug') slug: string, @Req() req: Request) {
    await this.limit(req);
    return this.catalog.direction(slug);
  }

  @Public()
  @Get('courses/:slug')
  async course(@Param('slug') slug: string, @Req() req: Request) {
    await this.limit(req);
    return this.catalog.course(slug);
  }

  /** Same per-IP budget as the other anonymous endpoints (slug enumeration, scraping). */
  private async limit(req: Request) {
    await this.limiter.consume(
      `public:${req.ip ?? 'unknown'}`,
      this.config.PUBLIC_RATE_PER_MINUTE,
      60_000,
      'PUBLIC_RATE_LIMITED',
    );
  }
}
