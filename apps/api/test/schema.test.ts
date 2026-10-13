import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDb, type DbHandle } from '../src/db/client';

/**
 * Phase 15B: database invariants checked against the catalog of a freshly migrated database,
 * so a new table or migration cannot silently drop them.
 */
let handle: DbHandle;
const rows = async <T>(query: string) =>
  ((await handle.db.execute(sql.raw(query))) as unknown as { rows: T[] }).rows;

beforeAll(async () => {
  handle = createDb('pglite://memory');
  await handle.migrate();
});

afterAll(async () => {
  await handle.close();
});

describe('database schema', () => {
  it('migrations are idempotent', async () => {
    await expect(handle.migrate()).resolves.toBeUndefined();
  });

  it('every table has a primary key', async () => {
    const missing = await rows<{ relname: string }>(`
      select c.relname from pg_class c
      where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
        and not exists (select 1 from pg_constraint p where p.conrelid = c.oid and p.contype = 'p')`);
    expect(missing).toEqual([]);
  });

  // Without an index whose leading columns are the FK columns, ON DELETE CASCADE / SET NULL
  // scans the whole child table for every deleted parent row.
  it('every foreign key is covered by an index', async () => {
    const unindexed = await rows<{ fk: string }>(`
      select c.conrelid::regclass::text || '.' || c.conname as fk
      from pg_constraint c
      where c.contype = 'f' and c.connamespace = 'public'::regnamespace
        and not exists (
          select 1 from pg_index i
          where i.indrelid = c.conrelid
            and (i.indkey::int2[])[0:array_length(c.conkey, 1) - 1] @> c.conkey
            and (i.indkey::int2[])[0:array_length(c.conkey, 1) - 1] <@ c.conkey)
      order by 1`);
    expect(unindexed).toEqual([]);
  });

  it('immutable evidence tables keep their no-update triggers', async () => {
    const triggers = await rows<{ tgname: string }>(
      `select tgname from pg_trigger where not tgisinternal order by 1`,
    );
    expect(triggers.map((t) => t.tgname)).toEqual(
      expect.arrayContaining(['submission_reviews_no_update', 'submission_versions_no_update']),
    );
  });
});
