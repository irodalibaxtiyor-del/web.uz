import { describe, expect, it } from 'vitest';
import { registerErrors } from './register-errors';

const ok = { fullName: 'Ali Valiyev', email: 'ali@example.uz', password: 'yaxshi-parol-1' };

describe('registerErrors', () => {
  it('accepts a valid form', () => {
    expect(registerErrors(ok)).toBeNull();
  });

  it('names only the field that is wrong', () => {
    expect(Object.keys(registerErrors({ ...ok, fullName: '' })!)).toEqual(['fullName']);
    expect(Object.keys(registerErrors({ ...ok, fullName: 'A'.repeat(121) })!)).toEqual([
      'fullName',
    ]);
    expect(Object.keys(registerErrors({ ...ok, email: 'abc' })!)).toEqual(['email']);
    expect(Object.keys(registerErrors({ ...ok, password: '12345' })!)).toEqual(['password']);
    expect(registerErrors({ ...ok, email: 'abc' })!.email).toMatch(/email/i);
  });

  it('lists every wrong field in form order', () => {
    expect(Object.keys(registerErrors({ fullName: '', email: '', password: '' })!)).toEqual([
      'fullName',
      'email',
      'password',
    ]);
  });
});
