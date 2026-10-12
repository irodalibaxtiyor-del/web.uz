import type { ProjectFile } from '@webdizayn/shared';
import { s01 } from './solutions/01-intro';
import { s02 } from './solutions/02-colors';
import { s03 } from './solutions/03-box';
import { s04 } from './solutions/04-text';
import { s05 } from './solutions/05-lists-tables';
import { s06 } from './solutions/06-layout';
import { s07 } from './solutions/07-selectors';
import { s08 } from './solutions/08-components';
import { s09 } from './solutions/09-units';
import { s10 } from './solutions/10-effects';
import { s11 } from './solutions/11-motion';
import { s12 } from './solutions/12-ui';
import { s13 } from './solutions/13-flexbox';
import { s14 } from './solutions/14-grid';
import { s15 } from './solutions/15-responsive';

/**
 * Reference solutions, keyed by lesson slug. Used only to verify the CHECK rules in a real
 * browser (`pnpm --filter @webdizayn/api content:verify css`); never seeded or sent to students.
 */
export const CSS_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
  ...s07,
  ...s08,
  ...s09,
  ...s10,
  ...s11,
  ...s12,
  ...s13,
  ...s14,
  ...s15,
};
