import type { ProjectFile } from '@webdizayn/shared';
import { s01 } from './solutions/01-intro';
import { s02 } from './solutions/02-colors';
import { s03 } from './solutions/03-box';

/**
 * Reference solutions, keyed by lesson slug. Used only to verify the CHECK rules in a real
 * browser (`pnpm --filter @webdizayn/api content:verify css`); never seeded or sent to students.
 */
export const CSS_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
};
