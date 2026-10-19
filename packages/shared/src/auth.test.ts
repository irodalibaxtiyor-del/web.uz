import { describe, expect, it } from 'vitest';
import { changePasswordSchema, loginSchema, registerSchema } from './auth';

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
  it('rejects invalid email and invalid login', () => {
    expect(loginSchema.safeParse({ email: 'no@pe', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ login: 'ali vali', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ password: 'x' }).success).toBe(false);
  });

  it('accepts an email or an admin-issued login under either field name', () => {
    expect(loginSchema.parse({ email: ' Ali@Example.UZ ', password: 'x' }).identifier).toBe(
      'ali@example.uz',
    );
    expect(loginSchema.parse({ login: 'Aliyev.Ali2', password: 'x' }).identifier).toBe(
      'aliyev.ali2',
    );
    expect(loginSchema.parse({ email: 'aliyev.ali', password: 'x' }).identifier).toBe('aliyev.ali');
  });
});

describe('changePasswordSchema', () => {
  it('requires a new password that differs and is long enough', () => {
    const ok = { currentPassword: 'old-password-1', newPassword: 'new-password-1' };
    expect(changePasswordSchema.safeParse(ok).success).toBe(true);
    expect(changePasswordSchema.safeParse({ ...ok, newPassword: 'old-password-1' }).success).toBe(
      false,
    );
    expect(changePasswordSchema.safeParse({ ...ok, newPassword: 'short' }).success).toBe(false);
  });
});
