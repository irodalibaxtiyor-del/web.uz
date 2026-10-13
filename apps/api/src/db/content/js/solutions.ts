import type { ProjectFile } from '@webdizayn/shared';
import { s01 } from './solutions/01-intro';
import { s02 } from './solutions/02-variables';
import { s03 } from './solutions/03-functions';

/**
 * Reference solutions, keyed by lesson slug. Used only to verify the CHECK rules in a real
 * browser (`pnpm --filter @webdizayn/api content:verify js`); never seeded or sent to students.
 */
export const JS_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
};
