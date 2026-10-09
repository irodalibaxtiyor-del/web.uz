import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './auth';

describe('registerSchema', () => {
  it('normalizes email to lowercase and trims', () => {
    const r = registerSchema.parse({
      email: '  Ali@Example.UZ ',
      password: 'a-strong-password',
      fullName: ' Ali Valiyev ',
    });
    expect(r.email).toBe('ali@example.uz');
    expect(r.fullName).toBe('Ali Valiyev');
  });

  it('rejects short passwords', () => {
    expect(
      registerSchema.safeParse({ email: 'a@b.uz', password: 'short', fullName: 'Ali' }).success,
    ).toBe(false);
  });

  it('rejects unknown role injection by stripping extra keys', () => {
    const r = registerSchema.parse({
      email: 'a@b.uz',
      password: 'a-strong-password',
      fullName: 'Ali',
      role: 'ORG_ADMIN',
    } as unknown);
    expect(r).not.toHaveProperty('role');
  });
});

describe('loginSchema', () => {
  it('rejects invalid email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false);
  });
});
