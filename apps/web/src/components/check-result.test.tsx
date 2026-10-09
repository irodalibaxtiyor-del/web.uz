import type { CheckRunView } from '@webdizayn/shared';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CheckResultPanel } from './check-result';

const run = (over: Partial<CheckRunView>): CheckRunView => ({
  id: 'r1',
  status: 'FAILED',
  errorCode: null,
  createdAt: '2026-10-09T10:00:00.000Z',
  finishedAt: '2026-10-09T10:00:02.000Z',
  passedCount: 1,
  total: 3,
  checks: [
    { title: 'Sarlavha bor', passed: true, hint: null },
    { title: 'Rasmda alt bor', passed: false, hint: 'alt atributini qo‘shing' },
  ],
  hidden: { passed: 0, total: 1 },
  ...over,
});

describe('CheckResultPanel', () => {
  it('shows visible checks, hints and only a count of hidden checks', () => {
    const html = renderToStaticMarkup(<CheckResultPanel run={run({})} />);
    expect(html).toContain('1 / 3 shart bajarildi');
    expect(html).toContain('Maslahat: alt atributini qo‘shing');
    expect(html).toContain('Yashirin tekshiruvlar: 0 / 1');
  });

  it('explains ERROR without a verdict or score', () => {
    const html = renderToStaticMarkup(
      <CheckResultPanel run={run({ status: 'ERROR', errorCode: 'ENGINE', passedCount: 0 })} />,
    );
    expect(html).toContain('Tekshiruv xizmati hozir ishlamayapti');
    expect(html).not.toContain('shart bajarildi');
    expect(html).not.toContain('Yashirin');
  });

  it('shows progress while running', () => {
    const html = renderToStaticMarkup(
      <CheckResultPanel run={run({ status: 'RUNNING', finishedAt: null })} />,
    );
    expect(html).toContain('Tekshirilmoqda');
    expect(html).not.toContain('Sarlavha bor');
  });
});
