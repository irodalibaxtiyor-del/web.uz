import { describe, expect, it } from 'vitest';
import {
  CERTIFICATE_CODE_RE,
  certificateCodeFromBytes,
  normalizeCertificateCode,
} from './certificates';

describe('certificate codes', () => {
  it('builds well-formed codes without look-alike characters', () => {
    for (let n = 0; n < 50; n++) {
      const bytes = Uint8Array.from({ length: 12 }, (_, i) => (i * 37 + n * 101) % 256);
      const code = certificateCodeFromBytes(bytes);
      expect(code).toMatch(CERTIFICATE_CODE_RE);
      expect(code).not.toMatch(/[01OIL]/);
    }
    expect(() => certificateCodeFromBytes(new Uint8Array(5))).toThrow();
  });

  it('normalizes typed codes', () => {
    expect(normalizeCertificateCode(' abcd efgh-jkmn ')).toBe('ABCD-EFGH-JKMN');
    expect(normalizeCertificateCode('abc')).toBe('ABC');
  });
});
