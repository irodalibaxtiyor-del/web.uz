import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Achievements, CompletedCourses, PortfolioItemCard, Skills } from './portfolio-ui';

describe('portfolio UI', () => {
  it('labels achievements with text, not only icons', () => {
    const html = renderToStaticMarkup(
      <Achievements list={['FIRST_EXERCISE', 'COURSE_COMPLETED']} />,
    );
    expect(html).toContain('Birinchi qadam');
    expect(html).toContain('Kurs bitiruvchisi');
    expect(renderToStaticMarkup(<Achievements list={[]} />)).toContain('Hali yutuqlar yo‘q');
  });

  it('renders completed courses with Uzbek dates and escapes skills', () => {
    const html = renderToStaticMarkup(
      <CompletedCourses list={[{ title: 'HTML', completedAt: '2026-10-09T12:00:00.000Z' }]} />,
    );
    expect(html).toContain('9-oktabr 2026');
    const skills = renderToStaticMarkup(<Skills list={['<img src=x onerror=alert(1)>']} />);
    expect(skills).not.toContain('<img');
  });

  it('does not load the project preview until it is opened', () => {
    const html = renderToStaticMarkup(
      <PortfolioItemCard
        item={{
          id: 'i1',
          kind: 'ASSIGNMENT',
          title: 'Shaxsiy sayt',
          description: 'Rubrika bo‘yicha',
          courseTitle: 'HTML',
          position: 0,
          addedAt: '2026-10-09T12:00:00.000Z',
        }}
        detailPath="/portfolio/public/aziza/items/i1"
      />,
    );
    expect(html).toContain('Loyiha · HTML');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('<iframe');
  });
});
