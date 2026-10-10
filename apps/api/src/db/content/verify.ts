import { runChecks } from '@webdizayn/check-engine';
import { checkRulesSchema } from '@webdizayn/shared';
import { CONTENT_COURSES } from './registry';

/**
 * Runs every exercise's CHECK rules in real Chrome: the reference solution must PASS and the
 * starter files must not. Usage:
 *   pnpm --filter @webdizayn/api content:verify            # every course
 *   pnpm --filter @webdizayn/api content:verify css        # one course
 *   pnpm --filter @webdizayn/api content:verify css units  # some lessons of one course
 */
async function main() {
  const [courseSlug, ...lessonSlugs] = process.argv.slice(2);
  const only = new Set(lessonSlugs);
  const chromePath = process.env.CHECK_CHROME_PATH || undefined;
  const selected = CONTENT_COURSES.filter((c) => !courseSlug || c.slug === courseSlug);
  if (selected.length === 0) throw new Error(`Unknown course: ${courseSlug}`);

  let failures = 0;
  let total = 0;
  for (const course of selected) {
    console.warn(`\n# ${course.slug}`);
    for (const m of course.modules) {
      for (const l of m.lessons) {
        if (!l.exercise || (only.size > 0 && !only.has(l.slug))) continue;
        total++;
        const rules = checkRulesSchema.parse(l.exercise.checks);
        const solution = course.solutions[l.slug];
        const problems: string[] = [];

        if (!solution) {
          problems.push('no reference solution');
        } else {
          const r = await runChecks(solution, rules, { chromePath });
          if (r.status !== 'PASSED') {
            const failed = r.results.filter((x) => !x.passed).map((x) => x.id);
            const code = r.errorCode ? `/${r.errorCode}` : '';
            problems.push(`solution ${r.status}${code} [${failed.join(', ')}]`);
          }
        }
        const starter = await runChecks(l.exercise.starterFiles, rules, { chromePath });
        if (starter.status === 'PASSED') problems.push('starter files already PASS');
        if (starter.status === 'ERROR' || starter.status === 'TIMEOUT') {
          problems.push(`starter ${starter.status}/${starter.errorCode}`);
        }

        if (problems.length > 0) failures++;
        const mark = problems.length ? 'FAIL' : 'ok  ';
        console.warn(`${mark} ${l.slug}${problems.length ? ': ' + problems.join('; ') : ''}`);
      }
    }
    const withExercise = new Set(
      course.modules.flatMap((m) => m.lessons.filter((l) => l.exercise).map((l) => l.slug)),
    );
    const extra = Object.keys(course.solutions).filter((s) => !withExercise.has(s));
    if (extra.length > 0 && only.size === 0) {
      failures++;
      console.warn(`FAIL solutions without exercise: ${extra.join(', ')}`);
    }
  }
  console.warn(`\n${total - failures}/${total} exercises verified`);
  if (failures > 0) process.exit(1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
