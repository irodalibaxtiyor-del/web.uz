/**
 * Child-process entry: reads one job as JSON from stdin, writes one result as JSON to stdout.
 * Runs with a minimal environment (no app secrets) and is killed by the parent on overrun.
 */
import { checkRulesSchema, projectFilesSchema, type CheckEngineResult } from '@webdizayn/shared';
import { runChecks, type EngineOptions } from './engine';

const MAX_INPUT = 2 * 1024 * 1024;

function finish(result: CheckEngineResult): never {
  process.stdout.write(JSON.stringify(result));
  // Exiting also makes Playwright kill any Chrome process it launched.
  process.exit(0);
}

const fail = (code: 'ENGINE' | 'BUDGET'): CheckEngineResult => ({
  status: code === 'BUDGET' ? 'TIMEOUT' : 'ERROR',
  errorCode: code,
  results: [],
  durationMs: 0,
});

async function main() {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of process.stdin as AsyncIterable<Buffer>) {
    size += chunk.length;
    if (size > MAX_INPUT) finish(fail('ENGINE'));
    chunks.push(chunk);
  }
  const job = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
    files: unknown;
    rules: unknown;
    options?: EngineOptions;
  };
  // The API validated already; re-validate so the worker never trusts its input.
  const files = projectFilesSchema.parse(job.files);
  const rules = checkRulesSchema.parse(job.rules);
  const options = job.options ?? {};
  const budget = options.budgetMs ?? 20_000;
  // Own watchdog, a little before the parent's hard kill.
  setTimeout(() => finish(fail('BUDGET')), budget + 4_000);
  finish(await runChecks(files, rules, options));
}

main().catch(() => finish(fail('ENGINE')));
