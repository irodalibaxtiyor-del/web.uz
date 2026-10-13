import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Markdown, OptionText, QuestionText } from './markdown';

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

describe('QuestionText', () => {
  it('shows a fenced code block and inline code', () => {
    const prompt = 'Natija nima?\n\n```php\n<?php echo 5 + 3; ?>\n```\n\n`echo` ishlatiladi';
    const html = renderToStaticMarkup(<QuestionText>{prompt}</QuestionText>);
    expect(html).toContain('<pre><code>&lt;?php echo 5 + 3; ?&gt;</code></pre>');
    expect(html).toContain('<code>echo</code>');
  });

  it('keeps HTML, comments and markdown-like text literal', () => {
    const prompt = '# izoh /* izoh */ <img src=x onerror="alert(1)"> [a](javascript:x)';
    const html = renderToStaticMarkup(<QuestionText>{prompt}</QuestionText>);
    expect(html).not.toMatch(/<img|<a |<h1/);
    expect(html).toContain('# izoh /* izoh */ &lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });
});

describe('bold in quiz text', () => {
  it('renders **bold** and keeps single stars literal', () => {
    const html = renderToStaticMarkup(
      <QuestionText>{'Qaysi biri **noto‘g‘ri**? /* izoh */'}</QuestionText>,
    );
    expect(html).toContain('<strong>noto‘g‘ri</strong>');
    expect(html).toContain('/* izoh */');
  });
});

describe('OptionText', () => {
  it('renders inline code and leaves the rest literal', () => {
    expect(renderToStaticMarkup(<OptionText>{'`$x` va <br>'}</OptionText>)).toBe(
      '<code>$x</code> va &lt;br&gt;',
    );
  });
});
