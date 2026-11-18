import { eq } from 'drizzle-orm';
import { ensureDefaultOrg } from '../app';
import { loadConfig } from '../config';
import { createDb } from './client';
import { CONTENT_COURSES, findContentCourse } from './content/registry';
import { syncCourseLessons } from './content/seed';
import { organizations } from './schema';

/**
 * Updates the texts of already seeded lessons from the bundled files (e.g. new interactive
 * blocks). A lesson a teacher has edited is left alone and reported.
 * Usage: `pnpm --filter @webdizayn/api db:sync:lessons <slug|--all>`.
 */
async function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const slug = args.find((a) => !a.startsWith('--'));
  const targets = all ? CONTENT_COURSES : [slug && findContentCourse(slug)].filter(Boolean);
  if (targets.length === 0) {
    throw new Error(
      `Usage: db:sync:lessons <${CONTENT_COURSES.map((c) => c.slug).join('|')}|--all>`,
    );
  }

  const config = loadConfig();
  const handle = createDb(config.DATABASE_URL, { poolMax: config.DATABASE_POOL_MAX });
  try {
    await handle.migrate();
    await ensureDefaultOrg(handle.db, config);
    const [org] = await handle.db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, config.DEFAULT_ORG_SLUG));
    if (!org) throw new Error('Default organization missing');
    for (const course of targets) {
      if (!course) continue;
      try {
        const r = await syncCourseLessons(handle.db, course, { organizationId: org.id });
        const notes = [
          r.edited.length ? `edited by staff (kept): ${r.edited.join(', ')}` : '',
          r.skipped.length ? `skipped: ${r.skipped.join('; ')}` : '',
        ].filter(Boolean);
        console.warn(
          `${course.slug}: ${r.updated} updated, ${r.unchanged} unchanged` +
            (notes.length ? `\n  ${notes.join('\n  ')}` : ''),
        );
      } catch (err) {
        console.error(`${course.slug}: ${err instanceof Error ? err.message : 'failed'}`);
      }
    }
  } finally {
    await handle.close();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : 'Lesson sync failed');
  process.exit(1);
});
