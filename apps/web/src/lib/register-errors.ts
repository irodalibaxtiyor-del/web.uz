import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, registerSchema } from '@webdizayn/shared';

export type RegisterField = 'fullName' | 'email' | 'password';

const MESSAGES: Record<RegisterField, string> = {
  fullName: 'Ism familiyani kiriting (2–120 belgi)',
  email: "Email manzilini to'g'ri kiriting (masalan: ism@example.uz)",
  password: `Parol ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} belgidan iborat bo'lsin`,
};

/** Form order, so the first message (and the focused field) follows what the user sees. */
export const REGISTER_FIELDS: RegisterField[] = ['fullName', 'email', 'password'];

/**
 * Per-field messages for the registration form, or null when it is valid. Each message names the
 * field that is actually wrong instead of one generic hint for every mistake.
 */
export function registerErrors(form: Record<string, unknown>) {
  const parsed = registerSchema.safeParse(form);
  if (parsed.success) return null;
  const bad = new Set(parsed.error.issues.map((i) => i.path[0]));
  const errors: Partial<Record<RegisterField, string>> = {};
  for (const f of REGISTER_FIELDS) if (bad.has(f)) errors[f] = MESSAGES[f];
  return errors;
}
