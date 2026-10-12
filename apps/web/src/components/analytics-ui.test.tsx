import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ColumnChart, percent, RateMeter, weekColumns } from './analytics-ui';

describe('analytics UI', () => {
  it('shows a dash instead of a fake 0% when there is no data', () => {
    expect(percent(null)).toBe('—');
    expect(percent(0)).toBe('0%');
    expect(percent(0.666)).toBe('67%');
    const html = renderToStaticMarkup(<RateMeter label="CHECK" value={null} />);
    expect(html).toContain('Ma’lumot yo‘q');
  });

  it('gives every column a value outside the tooltip and escapes labels', () => {
    const html = renderToStaticMarkup(
      <ColumnChart
        title="Tekshiruvlar"
        unit="ta"
        data={[
          { label: '<img src=x onerror=alert(1)>', value: 3 },
          { label: 'b', value: 5 },
        ]}
      />,
    );
    expect(html).not.toContain('<img');
    expect(html).toContain('Jadval ko‘rinishi');
    expect(html).toContain('tabindex="0"');
    expect(html).toMatch(/aria-label="b: 5 ta"/);
  });

  it('turns weekly points into dated columns', () => {
    const cols = weekColumns(
      [{ weekStart: '2026-10-12', checkRuns: 4, checksPassed: 1, lessonsCompleted: 2 }],
      'checkRuns',
    );
    expect(cols).toEqual([{ label: '12.10', title: '12.10 dan boshlangan hafta', value: 4 }]);
  });
});
