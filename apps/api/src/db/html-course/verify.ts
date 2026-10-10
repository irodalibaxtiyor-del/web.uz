import { runChecks } from '@webdizayn/check-engine';
import { checkRulesSchema } from '@webdizayn/shared';
import { HTML_MODULES } from './manifest';
import { HTML_SOLUTIONS } from './solutions';

/**
 * Runs every exercise's CHECK rules in real Chrome: the reference solution must PASS and the
 * starter files must not. Usage: `pnpm --filter @webdizayn/api content:verify [slug...]`.
 */
async function main() {
  const only = new Set(process.argv.slice(2));
  const chromePath = process.env.CHECK_CHROME_PATH || undefined;
  let failures = 0;
  let total = 0;

  for (const m of HTML_MODULES) {
    for (const l of m.lessons) {
      if (!l.exercise || (only.size > 0 && !only.has(l.slug))) continue;
      total++;
      const rules = checkRulesSchema.parse(l.exercise.checks);
      const solution = HTML_SOLUTIONS[l.slug];
      const problems: string[] = [];

      if (!solution) {
        problems.push('no reference solution');
      } else {
        const r = await runChecks(solution, rules, { chromePath });
        if (r.status !== 'PASSED') {
          const failed = r.results.filter((x) => !x.passed).map((x) => x.id);
          problems.push(
            `solution ${r.status}${r.errorCode ? `/${r.errorCode}` : ''} [${failed.join(', ')}]`,
          );
        }
      }
      const starter = await runChecks(l.exercise.starterFiles, rules, { chromePath });
      if (starter.status === 'PASSED') problems.push('starter files already PASS');
      if (starter.status === 'ERROR' || starter.status === 'TIMEOUT') {
        problems.push(`starter ${starter.status}/${starter.errorCode}`);
      }

      if (problems.length > 0) failures++;
      console.warn(
        `${problems.length ? 'FAIL' : 'ok  '} ${l.slug}${problems.length ? ': ' + problems.join('; ') : ''}`,
      );
    }
  }
  const extra = Object.keys(HTML_SOLUTIONS).filter(
    (s) => !HTML_MODULES.some((m) => m.lessons.some((l) => l.slug === s && l.exercise)),
  );
  if (extra.length > 0) {
    failures++;
    console.warn(`FAIL solutions without exercise: ${extra.join(', ')}`);
  }
  console.warn(`\n${total - failures}/${total} exercises verified`);
  if (failures > 0) process.exit(1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
