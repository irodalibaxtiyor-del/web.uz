import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Markdown } from './markdown';

describe('Markdown', () => {
  it('renders formatting', () => {
    const html = renderToStaticMarkup(<Markdown>{'# Sarlavha\n\n**qalin** `code`'}</Markdown>);
    expect(html).toContain('<h1>Sarlavha</h1>');
    expect(html).toContain('<strong>qalin</strong>');
    expect(html).toContain('<code>code</code>');
  });

  it('never emits raw HTML from lesson content', () => {
    const html = renderToStaticMarkup(
      <Markdown>{'<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">'}</Markdown>,
    );
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<img');
  });

  it('drops javascript: links', () => {
    const html = renderToStaticMarkup(<Markdown>{'[bos](javascript:alert(1))'}</Markdown>);
    expect(html).not.toContain('javascript:');
  });
});
