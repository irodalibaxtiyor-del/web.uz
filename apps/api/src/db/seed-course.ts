import { eq, sql } from 'drizzle-orm';
import { ensureDefaultOrg } from '../app';
import { loadConfig } from '../config';
import { createDb } from './client';
import { CONTENT_COURSES, findContentCourse } from './content/registry';
import { CourseExistsError, seedCourse } from './content/seed';
import { organizations, users } from './schema';

/**
 * Loads a bundled course into the default organization.
 * Usage: `pnpm --filter @webdizayn/api db:seed:course <html|css> [--replace]`.
 * The course owner is SEED_TEACHER_EMAIL (default teacher@webdizayn.local).
 */
async function main() {
  const args = process.argv.slice(2);
  const replace = args.includes('--replace');
  const slug = args.find((a) => !a.startsWith('--'));
  const course = slug ? findContentCourse(slug) : undefined;
  if (!course) {
    throw new Error(`Usage: db:seed:course <${CONTENT_COURSES.map((c) => c.slug).join('|')}>`);
  }

  const config = loadConfig();
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
        `--replace: the existing "${course.slug}" course and all student progress in it will be deleted`,
      );
    }
    const r = await seedCourse(db, course, {
      organizationId: org.id,
      teacherId: teacher.id,
      replace,
    });
    console.warn(
      `Course "${course.slug}" ${r.replaced ? 'recreated' : 'created'}: ${r.modules} modules, ` +
        `${r.lessons} lessons, ${r.exercises} exercises, ${r.quizzes} quizzes`,
    );
  } finally {
    await handle.close();
  }
}

main().catch((err: unknown) => {
  if (err instanceof CourseExistsError) console.error(err.message);
  else console.error(err instanceof Error ? err.message : 'Course seed failed');
  process.exit(1);
});
