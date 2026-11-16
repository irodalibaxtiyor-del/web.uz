import { describe, expect, it } from 'vitest';
import { creditedSeconds, formatMinutes } from './activity';

describe('time on task', () => {
  it('credits at most the ping interval and the time since the previous ping', () => {
    const now = 1_000_000;
    expect(creditedSeconds(30, now, null)).toBe(30);
    expect(creditedSeconds(99, now, null)).toBe(30);
    expect(creditedSeconds(30, now, now - 10_000)).toBe(10);
    expect(creditedSeconds(20, now, now - 60_000)).toBe(20);
    expect(creditedSeconds(30, now, now)).toBe(0);
  });

  it('formats minutes', () => {
    expect(formatMinutes(null)).toBe('—');
    expect(formatMinutes(150)).toBe('3 daq.');
    expect(formatMinutes(3 * 3600 + 600)).toBe('3 soat 10 daq.');
  });
});
