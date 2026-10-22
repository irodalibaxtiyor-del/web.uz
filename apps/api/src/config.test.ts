import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';

describe('loadConfig', () => {
  it('applies defaults', () => {
    const c = loadConfig({});
    expect(c.PORT).toBe(4000);
    expect(c.cookieSecure).toBe(false);
    expect(c.webOrigins).toEqual(['http://localhost:3000']);
  });

  it('uses secure cookies, JSON logs and https origins in production', () => {
    const prod = {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgres://u@h/db',
      WEB_ORIGINS: 'https://webdizayn.uz',
      BOOK_URL_SECRET: 'x'.repeat(32),
    };
    const c = loadConfig(prod);
    expect(c).toMatchObject({ cookieSecure: true, LOG_FORMAT: 'json', LOG_LEVEL: 'info' });
    expect(() => loadConfig({ ...prod, WEB_ORIGINS: 'http://webdizayn.uz' })).toThrow(
      /WEB_ORIGINS/,
    );
    expect(() => loadConfig({ ...prod, BOOK_URL_SECRET: undefined })).toThrow(/BOOK_URL_SECRET/);
    expect(loadConfig({ NODE_ENV: 'test' }).LOG_LEVEL).toBe('silent');
  });

  it('refuses PGlite in production', () => {
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow(/PGlite/);
  });

  it('reports invalid variable names without leaking values', () => {
    expect(() => loadConfig({ PORT: 'secret-value' })).toThrow(/PORT/);
    expect(() => loadConfig({ PORT: 'secret-value' })).not.toThrow(/secret-value/);
  });
});
