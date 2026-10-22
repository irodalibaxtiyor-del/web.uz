import { describe, expect, it } from 'vitest';
import { CHAT_HISTORY_MAX, paragraphs, parseHistory, safeLinks } from './chat';

describe('chat history', () => {
  it('keeps well-formed entries and drops tampered ones', () => {
    const raw = JSON.stringify([
      { id: '1', role: 'user', text: 'salom' },
      {
        id: '2',
        role: 'bot',
        text: 'Assalomu alaykum',
        links: [{ label: 'Kirish', href: '/login' }],
        matched: true,
      },
      { id: '3', role: 'admin', text: 'x' },
      { id: 4, role: 'user', text: 'x' },
      null,
      'text',
      { id: '5', role: 'bot', text: 'Topilmadi', matched: false, suggestions: ['A', 7, 'B'] },
    ]);
    const h = parseHistory(raw);
    expect(h.map((e) => e.id)).toEqual(['1', '2', '5']);
    expect(h[1]!.links).toEqual([{ label: 'Kirish', href: '/login' }]);
    expect(h[2]).toMatchObject({ matched: false, suggestions: ['A', 'B'] });
  });

  it('never renders external or script links, even from storage', () => {
    expect(
      safeLinks([
        { label: 'ok', href: '/kurslar/html' },
        { label: 'x', href: 'javascript:alert(1)' },
        { label: 'x', href: '//evil.example' },
        { label: 'x', href: 'https://evil.example' },
        { label: 'x', href: '/\\evil.example' },
        { label: 1, href: '/a' },
      ]),
    ).toEqual([{ label: 'ok', href: '/kurslar/html' }]);
    expect(safeLinks('nope')).toEqual([]);
  });

  it('survives broken storage and keeps only the latest messages', () => {
    expect(parseHistory('{not json')).toEqual([]);
    expect(parseHistory(null)).toEqual([]);
    const many = Array.from({ length: CHAT_HISTORY_MAX + 5 }, (_, i) => ({
      id: String(i),
      role: 'user',
      text: 'q',
    }));
    const h = parseHistory(JSON.stringify(many));
    expect(h).toHaveLength(CHAT_HISTORY_MAX);
    expect(h[0]!.id).toBe('5');
  });

  it('splits answers into paragraphs and lines', () => {
    expect(paragraphs('Bir\nikki\n\n\nUch')).toEqual([['Bir', 'ikki'], ['Uch']]);
  });
});
