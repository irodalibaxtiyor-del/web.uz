import { describe, expect, it } from 'vitest';
import { courseSlugSchema, slugCandidate, slugify, SLUG_MAX, toLatin } from './slug';

describe('toLatin', () => {
  it('reads Cyrillic and Latin the same way and keeps spaces and punctuation', () => {
    expect(toLatin('Курсга қандай ёзиламан?')).toBe('kursga qanday yozilaman?');
    expect(toLatin('Kursga QANDAY yozilaman?')).toBe('kursga qanday yozilaman?');
    expect(toLatin('Oʻqish, g‘oya')).toBe('oqish, goya');
  });
});

describe('slugify', () => {
  it('handles every Uzbek apostrophe form', () => {
    expect(slugify('Oʻzbek tili: Grammatika asoslari')).toBe('ozbek-tili-grammatika-asoslari');
    expect(slugify("O'zbek")).toBe('ozbek');
    expect(slugify('O‘zbek')).toBe('ozbek');
    expect(slugify('O`zbek')).toBe('ozbek');
    expect(slugify('Gʻalaba va g‘oya')).toBe('galaba-va-goya');
    expect(slugify('Ma’lumotlar bazasi')).toBe('malumotlar-bazasi');
  });

  it('keeps sh and ch digraphs', () => {
    expect(slugify('Shahar chiroqlari')).toBe('shahar-chiroqlari');
  });

  it('transliterates Uzbek Cyrillic', () => {
    expect(slugify('Ўзбек тили')).toBe('ozbek-tili');
    expect(slugify('Шаҳар чироқлари')).toBe('shahar-chiroqlari');
    expect(slugify('Ғалаба')).toBe('galaba');
    expect(slugify('Қалам')).toBe('qalam');
    expect(slugify('Ер ва Ой')).toBe('yer-va-oy');
    expect(slugify('Веб дизайн')).toBe('veb-dizayn');
    expect(slugify('Хуш келибсиз')).toBe('xush-kelibsiz');
  });

  it('removes repeated, leading and trailing hyphens and symbols', () => {
    expect(slugify('  --HTML & CSS!!  (2026)--  ')).toBe('html-css-2026');
    expect(slugify('a___b...c')).toBe('a-b-c');
    expect(slugify('Café résumé')).toBe('cafe-resume');
    expect(slugify('!!!')).toBe('');
  });

  it('is at most 80 characters and never ends with a hyphen', () => {
    const s = slugify('juda uzun nom '.repeat(20));
    expect(s.length).toBeLessThanOrEqual(SLUG_MAX);
    expect(s).not.toMatch(/-$/);
  });
});

describe('slugCandidate', () => {
  it('adds -n and keeps the 80 limit', () => {
    expect(slugCandidate('html', 1)).toBe('html');
    expect(slugCandidate('html', 3)).toBe('html-3');
    const long = 'a'.repeat(79) + '-b';
    const c = slugCandidate(long, 12);
    expect(c.length).toBeLessThanOrEqual(SLUG_MAX);
    expect(c.endsWith('-12')).toBe(true);
    expect(c).not.toContain('--');
  });
});

describe('courseSlugSchema', () => {
  it('accepts valid slugs and rejects the rest', () => {
    expect(courseSlugSchema.parse(' HTML-asoslari ')).toBe('html-asoslari');
    for (const bad of ['', 'bad slug', 'a--b', '-a', 'a-', 'oʻzbek', 'a'.repeat(81)]) {
      expect(courseSlugSchema.safeParse(bad).success, bad).toBe(false);
    }
  });
});
