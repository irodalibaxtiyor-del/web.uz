import { Global, Inject, Injectable, Module, OnApplicationShutdown } from '@nestjs/common';
import { DB_HANDLE, type Db, type DbHandle } from './client';

@Injectable()
export class DbService implements OnApplicationShutdown {
  constructor(@Inject(DB_HANDLE) private readonly handle: DbHandle) {}

  get db(): Db {
    return this.handle.db;
  }

  ping(): Promise<void> {
    return this.handle.ping();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.handle.close();
  }
}

@Global()
@Module({})
export class DbModule {
  static forHandle(handle: DbHandle) {
    return {
      module: DbModule,
      providers: [{ provide: DB_HANDLE, useValue: handle }, DbService],
      exports: [DbService],
    };
  }
}
