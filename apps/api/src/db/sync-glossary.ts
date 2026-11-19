import { eq } from 'drizzle-orm';
import { ensureDefaultOrg } from '../app';
import { loadConfig } from '../config';
import { createDb } from './client';
import { CONTENT_COURSES, findContentCourse } from './content/registry';
import { syncCourseGlossary } from './content/seed';
import { organizations } from './schema';

/**
 * Adds missing glossary terms from the bundled manifests to already seeded courses. Terms that
 * already exist (possibly edited by staff) are left alone.
 * Usage: `pnpm --filter @webdizayn/api db:sync:glossary <slug|--all>`.
 */
async function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const slug = args.find((a) => !a.startsWith('--'));
  const targets = all ? CONTENT_COURSES : [slug && findContentCourse(slug)].filter(Boolean);
  if (targets.length === 0) {
    throw new Error(
      `Usage: db:sync:glossary <${CONTENT_COURSES.map((c) => c.slug).join('|')}|--all>`,
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
        const r = await syncCourseGlossary(handle.db, course, { organizationId: org.id });
        const notes = r.skipped.length ? [`skipped: ${r.skipped.join('; ')}`] : [];
        console.warn(
          `${course.slug}: +${r.added} terms, ${r.existing} already present` +
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
  console.error(err instanceof Error ? err.message : 'Glossary sync failed');
  process.exit(1);
});
