import { describe, expect, it } from 'vitest';
import { formatDateTime, fromLocalInput, toLocalInput } from './dates';

describe('datetime-local conversion', () => {
  it('round-trips through the local time zone', () => {
    const iso = '2026-12-01T13:30:00.000Z';
    expect(fromLocalInput(toLocalInput(iso))).toBe(iso);
  });

  it('treats empty and invalid values as no deadline', () => {
    expect(toLocalInput(null)).toBe('');
    expect(fromLocalInput('')).toBeNull();
    expect(fromLocalInput('not-a-date')).toBeNull();
  });
});

describe('formatDateTime', () => {
  it('uses Uzbek month names in local time', () => {
    const local = new Date(2026, 9, 9, 16, 5).toISOString();
    expect(formatDateTime(local)).toBe('9-oktabr 2026, 16:05');
  });
});
