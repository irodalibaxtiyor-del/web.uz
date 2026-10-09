import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Public } from '../common/decorators';
import { DbService } from '../db/db.module';

@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly dbs: DbService) {}

  @Get()
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready() {
    try {
      await this.dbs.ping();
    } catch {
      throw new ServiceUnavailableException({ status: 'unavailable' });
    }
    return { status: 'ready' };
  }
}
