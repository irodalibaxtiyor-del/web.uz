import { PGlite } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';
import * as schema from './schema';

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export interface DbHandle {
  db: Db;
  migrate(): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
}

const MIGRATIONS_FOLDER = join(__dirname, '..', '..', 'drizzle');

/** Arbitrary constant key for the migration advisory lock. */
const MIGRATION_LOCK = 7_272_021;

export function createDb(url: string, opts: { poolMax?: number } = {}): DbHandle {
  if (url.startsWith('pglite://')) {
    const location = url.slice('pglite://'.length);
    let client: PGlite;
    if (location === 'memory') {
      client = new PGlite();
    } else {
      mkdirSync(location, { recursive: true });
      client = new PGlite(location);
    }
    const db = drizzlePglite(client, { schema });
    return {
      db: db as unknown as Db,
      migrate: () => migratePglite(db, { migrationsFolder: MIGRATIONS_FOLDER }),
      ping: async () => {
        await db.execute(sql`select 1`);
      },
      close: () => client.close(),
    };
  }

  const pool = new Pool({ connectionString: url, max: opts.poolMax ?? 10 });
  const db = drizzlePg(pool, { schema });
  return {
    db: db as unknown as Db,
    // Several instances or deploy jobs may start at once: serialize migrations with a
    // session-level advisory lock held on one dedicated connection.
    migrate: async () => {
      const conn = await pool.connect();
      try {
        await conn.query('select pg_advisory_lock($1)', [MIGRATION_LOCK]);
        await migratePg(drizzlePg(conn, { schema }), { migrationsFolder: MIGRATIONS_FOLDER });
      } finally {
        await conn.query('select pg_advisory_unlock($1)', [MIGRATION_LOCK]).catch(() => {});
        conn.release();
      }
    },
    ping: async () => {
      await db.execute(sql`select 1`);
    },
    close: () => pool.end(),
  };
}

export const DB_HANDLE = Symbol('DB_HANDLE');
