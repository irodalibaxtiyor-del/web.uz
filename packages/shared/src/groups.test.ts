import { describe, expect, it } from 'vitest';
import {
  groupCode,
  LOGIN_RE,
  loginBase,
  parseRosterText,
  rosterImportSchema,
  rosterKey,
} from './groups';

describe('rosterKey', () => {
  it('unifies apostrophe variants, spaces and case', () => {
    const a = rosterKey('O‘RINOV  JASURBEK O`KTAM O’G’LI');
    expect(a).toBe("O'RINOV JASURBEK O'KTAM O'G'LI");
    expect(rosterKey("o'rinov jasurbek o'ktam o'g'li ")).toBe(a);
  });
});

describe('loginBase', () => {
  it('builds familiya.ism without apostrophes', () => {
    expect(loginBase('ABDULLAYEV SARDOR VALI O‘G‘LI')).toBe('abdullayev.sardor');
    expect(loginBase('G‘OFUROVA NODIRA ALI QIZI')).toBe('gofurova.nodira');
    expect(loginBase("O'RINBOYEVA LOLA SAMI QIZI")).toBe('orinboyeva.lola');
    expect(LOGIN_RE.test(loginBase('VALIYEVA ZARINA BEK-QIZI'))).toBe(true);
  });

  it('falls back when nothing latin is left', () => {
    expect(loginBase('ИВАНОВ ИВАН')).toBe('talaba');
  });
});

describe('groupCode', () => {
  it('lowercases and drops spaces', () => {
    expect(groupCode('8-24 ATT')).toBe('8-24att');
    expect(groupCode('10-24 KI')).toBe('10-24ki');
  });
});

describe('parseRosterText', () => {
  it('reads headers with counts and numbered students', () => {
    const r = parseRosterText(
      '### 8-24 ATT — 2 nafar talaba\n\n1. ALIYEV ALI\n2.  VALIYEVA  NODIRA QIZI\n### 10-24 KI\n1) KARIMOV BOBUR',
    );
    expect(r.orphanLines).toEqual([]);
    expect(r.groups).toEqual([
      { name: '8-24 ATT', expectedCount: 2, students: ['ALIYEV ALI', 'VALIYEVA NODIRA QIZI'] },
      { name: '10-24 KI', students: ['KARIMOV BOBUR'] },
    ]);
  });

  it('reports numbered lines before any header', () => {
    expect(parseRosterText('1. ALIYEV ALI').orphanLines).toEqual([1]);
  });
});

describe('rosterImportSchema', () => {
  it('rejects single-word names and empty groups', () => {
    expect(
      rosterImportSchema.safeParse({ groups: [{ name: 'A1', students: ['ALI'] }] }).success,
    ).toBe(false);
    expect(rosterImportSchema.safeParse({ groups: [{ name: 'A1', students: [] }] }).success).toBe(
      false,
    );
  });
});
