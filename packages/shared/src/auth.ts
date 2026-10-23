import { z } from 'zod';
import { LOGIN_RE } from './groups';

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

export const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());

export const passwordSchema = z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH);

export const loginNameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(LOGIN_RE, 'Login 3–40 belgi: lotin harflari, raqamlar, nuqta yoki chiziqcha');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().trim().min(2).max(120),
});
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Sign-in with an email (self-registered accounts) or an admin-issued login. The field may be
 * sent as `login` or, for older clients, `email`; either way it is classified by the `@`.
 */
export const loginSchema = z
  .object({
    login: z.string().max(254).optional(),
    email: z.string().max(254).optional(),
    password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
  })
  .transform((v, ctx) => {
    const raw = (v.login ?? v.email ?? '').trim().toLowerCase();
    const parsed = raw.includes('@') ? emailSchema.safeParse(raw) : loginNameSchema.safeParse(raw);
    if (!parsed.success) {
      ctx.addIssue({ code: 'custom', path: ['login'], message: 'Login yoki email noto‘g‘ri' });
      return z.NEVER;
    }
    return { identifier: parsed.data, password: v.password };
  });
export type LoginInput = z.output<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(PASSWORD_MAX_LENGTH),
    newPassword: passwordSchema,
  })
  .refine((v) => v.currentPassword !== v.newPassword, {
    path: ['newPassword'],
    message: 'Yangi parol eskisidan farq qilishi kerak',
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/** Shape returned by GET /auth/me. Never contains password hashes or session tokens. */
export interface MeResponse {
  id: string;
  email: string | null;
  login: string | null;
  fullName: string;
  /** True after an admin issued a temporary password: everything else is blocked until changed. */
  mustChangePassword: boolean;
  memberships: {
    organizationId: string;
    organizationName: string;
    role: import('./roles').Role;
    /** The platform organization: the one that receives public chatbot contact requests. */
    platform: boolean;
  }[];
}
