import { sql } from 'drizzle-orm';
import { weekStartOf } from '@webdizayn/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { weekOf } from '../src/analytics/analytics.service';
import { setup, type TestContext } from './helpers';

let ctx: TestContext;

beforeAll(async () => {
  ctx = await setup();
});
afterAll(async () => {
  await ctx.app.close();
});

describe('analytics weeks', () => {
  it('SQL and the shared helper agree on Tashkent week boundaries', async () => {
    const moments = [
      '2026-10-11T18:59:59Z', // Sunday 23:59:59 in Tashkent
      '2026-10-11T19:00:00Z', // Monday 00:00 in Tashkent
      '2026-10-12T03:00:00Z',
      '2026-10-18T18:59:59Z',
      '2026-12-31T20:00:00Z', // a new year in Tashkent, same week
    ];
    for (const iso of moments) {
      const res = await ctx.handle.db.execute(
        sql`select ${weekOf(sql`${iso}::timestamptz`)} as week`,
      );
      // PGlite returns { rows }, node-postgres a result with rows as well.
      const rows = (res as unknown as { rows: { week: string }[] }).rows;
      expect(rows[0]!.week, iso).toBe(weekStartOf(new Date(iso)));
    }
    expect(weekStartOf(new Date('2026-10-11T19:00:00Z'))).toBe('2026-10-12');
  });
});
