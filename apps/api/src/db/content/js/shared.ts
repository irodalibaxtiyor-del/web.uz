import type { CheckAction } from '@webdizayn/shared';

export {
  after,
  app,
  at,
  attr,
  clean,
  files,
  has,
  page,
  q,
  quiz,
  style,
  text,
  type ModuleDef,
} from '../helpers';

export const md = (...lines: string[]) => lines.join('\n');

/** CHECK actions used to drive a student's page before an assertion. */
export const fill = (selector: string, value: string): CheckAction => ({
  type: 'fill',
  selector,
  value,
});
export const click = (selector: string): CheckAction => ({ type: 'click', selector });
export const press = (selector: string, key: string): CheckAction => ({
  type: 'press',
  selector,
  key,
});
export const wait = (ms: number): CheckAction => ({ type: 'wait', ms });
