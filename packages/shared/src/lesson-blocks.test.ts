import { describe, expect, it } from 'vitest';
import {
  findLessonBlocks,
  parseCheckBlock,
  stripLessonBlocks,
  validateLessonBlocks,
} from './lesson-blocks';
import { createLessonSchema } from './courses';

const LESSON = [
  '## Sarlavhalar',
  '',
  'Matn.',
  '',
  '```html',
  '<h1>Oddiy kod</h1>',
  '```',
  '',
  '```tekshir',
  'Qaysi teg eng muhim sarlavha?',
  '- `<h6>`',
  '+ `<h1>`',
  '- `<p>`',
  '> `<h1>` — sahifaning asosiy sarlavhasi.',
  '```',
  '',
  '```jonli',
  '<h1>Salom</h1>',
  '```',
  '',
  '````yechim Javobni ko‘rish',
  'Javob:',
  '```html',
  '<h1>…</h1>',
  '```',
  '````',
  '',
  'Oxirgi matn.',
].join('\n');

describe('lesson blocks', () => {
  it('finds interactive blocks in order and skips ordinary code', () => {
    const blocks = findLessonBlocks(LESSON);
    expect(blocks.map((b) => b.kind)).toEqual(['tekshir', 'jonli', 'yechim']);
    expect(blocks[0]!.line).toBe(9);
    expect(blocks[2]!.meta).toBe('Javobni ko‘rish');
    // The longer fence keeps the inner ``` as content.
    expect(blocks[2]!.body).toContain('```html');
  });

  it('parses a self-check: prompt, options, explanation, single/multiple', () => {
    const r = parseCheckBlock(findLessonBlocks(LESSON)[0]!.body);
    expect('block' in r && r.block).toMatchObject({
      prompt: 'Qaysi teg eng muhim sarlavha?',
      multiple: false,
      explanation: '`<h1>` — sahifaning asosiy sarlavhasi.',
    });
    expect('block' in r && r.block.options.map((o) => o.correct)).toEqual([false, true, false]);
    const multi = parseCheckBlock('Qaysilari blok?\n+ div\n+ p\n- span\n> div va p — blok.');
    expect('block' in multi && multi.block.multiple).toBe(true);
  });

  it('reports authoring mistakes with line numbers', () => {
    const bad = [
      'Matn',
      '',
      '```tekshir',
      'Savol?',
      '- a',
      '- b',
      '```',
      '',
      '```jonli',
      '```',
    ].join('\n');
    const problems = validateLessonBlocks(bad);
    expect(problems).toContain('3-qator (tekshir): kamida bitta to‘g‘ri variant (“+ ”) kerak');
    expect(problems).toContain('3-qator (tekshir): izoh (“> ”) kerak');
    expect(problems).toContain('9-qator (jonli): kod bo‘sh');
    expect(validateLessonBlocks(LESSON)).toEqual([]);
  });

  it('the lesson schema rejects broken blocks', () => {
    expect(createLessonSchema.safeParse({ title: 'Dars', content: LESSON }).success).toBe(true);
    const r = createLessonSchema.safeParse({ title: 'Dars', content: '```tekshir\nSavol?\n```' });
    expect(r.success).toBe(false);
  });

  it('strips only interactive blocks', () => {
    const plain = stripLessonBlocks(LESSON);
    expect(plain).toContain('<h1>Oddiy kod</h1>');
    expect(plain).not.toMatch(/tekshir|jonli|yechim/);
    expect(plain).toBe(stripLessonBlocks(plain));
    const before = '## Sarlavhalar\n\nMatn.\n\n```html\n<h1>Oddiy kod</h1>\n```\n\nOxirgi matn.';
    expect(plain).toBe(stripLessonBlocks(before));
  });
});
