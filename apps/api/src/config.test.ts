import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';

describe('loadConfig', () => {
  it('applies defaults', () => {
    const c = loadConfig({});
    expect(c.PORT).toBe(4000);
    expect(c.cookieSecure).toBe(false);
    expect(c.webOrigins).toEqual(['http://localhost:3000']);
  });

  it('uses secure cookies in production', () => {
    const c = loadConfig({ NODE_ENV: 'production', DATABASE_URL: 'postgres://u@h/db' });
    expect(c.cookieSecure).toBe(true);
  });

  it('refuses PGlite in production', () => {
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow(/PGlite/);
  });

  it('reports invalid variable names without leaking values', () => {
    expect(() => loadConfig({ PORT: 'secret-value' })).toThrow(/PORT/);
    expect(() => loadConfig({ PORT: 'secret-value' })).not.toThrow(/secret-value/);
  });
});
