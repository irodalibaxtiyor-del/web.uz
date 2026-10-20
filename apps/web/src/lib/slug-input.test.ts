import { describe, expect, it } from 'vitest';
import { slugEdited, slugFromTitle, typedSlug } from './slug-input';

describe('slug input', () => {
  it('follows the title until edited by hand', () => {
    let d = slugFromTitle({ slug: '', manual: false }, 'Oʻzbek tili: Grammatika asoslari');
    expect(d).toEqual({ slug: 'ozbek-tili-grammatika-asoslari', manual: false });
    d = slugEdited('mening-kursim', 'Oʻzbek tili');
    expect(d).toEqual({ slug: 'mening-kursim', manual: true });
    expect(slugFromTitle(d, 'Boshqa nom')).toBe(d);
  });

  it('gives the field back to the title when cleared', () => {
    expect(slugEdited('', 'Veb dizayn')).toEqual({ slug: 'veb-dizayn', manual: false });
  });

  it('normalizes while typing but keeps one trailing hyphen', () => {
    expect(typedSlug('Mening ')).toBe('mening-');
    expect(typedSlug('Mening--')).toBe('mening-');
    expect(typedSlug('Ўзбек тили')).toBe('ozbek-tili');
    expect(typedSlug('--')).toBe('');
  });
});
