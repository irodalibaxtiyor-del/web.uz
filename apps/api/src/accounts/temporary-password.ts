import { randomInt } from 'node:crypto';

/** No 0/o, 1/l/i: the password is read off a printout or a screen. */
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

/**
 * `<prefix>-xxxx-xxxx`, e.g. `8-24att-k7m4-q2x9`. The prefix only helps people tell printouts
 * apart; the 8 random characters (~40 bits from a CSPRNG) are what makes it unguessable. It is
 * valid only until the first sign-in, which forces a change.
 */
export function temporaryPassword(prefix = 'wd'): string {
  const part = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  const safePrefix = prefix.replace(/[^a-z0-9-]/g, '').slice(0, 16) || 'wd';
  return `${safePrefix}-${part()}-${part()}`;
}
