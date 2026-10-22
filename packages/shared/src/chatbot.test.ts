import { describe, expect, it } from 'vitest';
import { CHAT_HREF_RE, chatAskSchema, chatContactSchema } from './chatbot';

describe('chatbot schemas', () => {
  it('trims and bounds the question', () => {
    expect(chatAskSchema.parse({ message: '  salom  ' }).message).toBe('salom');
    expect(chatAskSchema.safeParse({ message: '   ' }).success).toBe(false);
    expect(chatAskSchema.safeParse({ message: 'a'.repeat(501) }).success).toBe(false);
  });

  it('accepts only internal links', () => {
    for (const ok of ['/', '/kurslar/html', '/login?next=%2Fdashboard']) {
      expect(CHAT_HREF_RE.test(ok)).toBe(true);
    }
    for (const bad of [
      '//evil.test',
      '/\\evil.test',
      'https://evil.test',
      'javascript:x',
      '/a b',
    ]) {
      expect(CHAT_HREF_RE.test(bad)).toBe(false);
    }
  });

  it('validates the contact form, including the page it came from', () => {
    const ok = { name: 'Ali', contact: '@ali', message: 'Kursga yozila olmayapman' };
    expect(chatContactSchema.safeParse(ok).success).toBe(true);
    expect(chatContactSchema.safeParse({ ...ok, page: '/kurslar/html' }).success).toBe(true);
    expect(chatContactSchema.safeParse({ ...ok, page: 'https://evil.test' }).success).toBe(false);
    expect(chatContactSchema.safeParse({ ...ok, name: 'A' }).success).toBe(false);
    expect(chatContactSchema.safeParse({ ...ok, message: 'x'.repeat(1001) }).success).toBe(false);
  });
});
