import { describe, expect, it } from 'vitest';
import { dominantPageSize } from './page-size';

describe('dominantPageSize', () => {
  it('ignores an odd first page (landscape wrap-around cover)', () => {
    const a4 = { width: 595.3, height: 841.9 };
    expect(
      dominantPageSize([{ width: 842, height: 595 }, a4, a4, { width: 595, height: 842 }, a4]),
    ).toEqual(a4);
  });

  it('keeps the first size on a tie and handles an empty book', () => {
    expect(
      dominantPageSize([
        { width: 400, height: 600 },
        { width: 500, height: 700 },
      ]),
    ).toEqual({ width: 400, height: 600 });
    expect(dominantPageSize([])).toEqual({ width: 0, height: 0 });
  });
});
