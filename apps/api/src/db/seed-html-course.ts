import { eq, sql } from 'drizzle-orm';
import { ensureDefaultOrg } from '../app';
import { loadConfig } from '../config';
import { createDb } from './client';
import { HtmlCourseExistsError, seedHtmlCourse } from './html-course/seed';
import { organizations, users } from './schema';

/**
 * Loads the bundled HTML course into the default organization.
 * Usage: `pnpm --filter @webdizayn/api db:seed:html [--replace]`.
 * The course owner is SEED_TEACHER_EMAIL (default teacher@webdizayn.local).
 */
async function main() {
  const config = loadConfig();
  const replace = process.argv.includes('--replace');
  const email = (process.env.SEED_TEACHER_EMAIL ?? 'teacher@webdizayn.local').toLowerCase();

  const handle = createDb(config.DATABASE_URL);
  try {
    await handle.migrate();
    await ensureDefaultOrg(handle.db, config);
    const db = handle.db;
    const [org] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, config.DEFAULT_ORG_SLUG));
    if (!org) throw new Error('Default organization missing');
    const [teacher] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(sql`lower(${users.email})`, email));
    if (!teacher) throw new Error(`User ${email} not found; run db:seed first`);

    if (replace) {
      console.warn(
        '--replace: the existing HTML course and all student progress in it will be deleted',
      );
    }
    const r = await seedHtmlCourse(db, { organizationId: org.id, teacherId: teacher.id, replace });
    console.warn(
      `HTML course ${r.replaced ? 'recreated' : 'created'}: ${r.modules} modules, ` +
        `${r.lessons} lessons, ${r.exercises} exercises, ${r.quizzes} quizzes`,
    );
  } finally {
    await handle.close();
  }
}

main().catch((err: unknown) => {
  if (err instanceof HtmlCourseExistsError) console.error(err.message);
  else console.error(err instanceof Error ? err.message : 'HTML course seed failed');
  process.exit(1);
});
