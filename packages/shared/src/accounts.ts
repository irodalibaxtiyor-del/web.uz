import { z } from 'zod';
import { emailSchema, loginNameSchema } from './auth';

/**
 * Admin-managed accounts: teachers created by an organization administrator, temporary
 * passwords, disabling. Passwords are never stored in plain text; a temporary password is
 * shown exactly once, in the response that created it.
 */

const fullName = z.string().trim().min(3).max(160);

export const createTeacherSchema = z.object({
  fullName,
  login: loginNameSchema,
  email: emailSchema.optional(),
});
export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;

export const updateTeacherSchema = z
  .object({
    fullName: fullName.optional(),
    login: loginNameSchema.optional(),
    /** null removes the email (the account then signs in with its login only). */
    email: emailSchema.nullable().optional(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), {
    message: 'Hech narsa o‘zgarmadi',
  });
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;

export const teacherGroupsSchema = z.object({
  groupIds: z
    .array(z.uuid())
    .max(50)
    .refine((ids) => new Set(ids).size === ids.length, { message: 'Guruh takrorlangan' }),
});
export type TeacherGroupsInput = z.infer<typeof teacherGroupsSchema>;

export const studentGroupSchema = z.object({ groupId: z.uuid().nullable() });
export type StudentGroupInput = z.infer<typeof studentGroupSchema>;

/** Issue temporary passwords to a whole group or to chosen accounts. */
export const credentialsResetSchema = z
  .object({
    groupId: z.uuid().optional(),
    userIds: z
      .array(z.uuid())
      .min(1)
      .max(500)
      .refine((ids) => new Set(ids).size === ids.length, { message: 'Hisob takrorlangan' })
      .optional(),
    /** Skip accounts that already have a password (first-time hand-out). */
    onlyWithoutPassword: z.boolean().default(false),
  })
  .refine((v) => (v.groupId === undefined) !== (v.userIds === undefined), {
    message: 'Guruh yoki hisoblar ro‘yxatidan bittasini bering',
  });
export type CredentialsResetInput = z.input<typeof credentialsResetSchema>;

export interface AccountState {
  userId: string;
  disabled: boolean;
  mustChangePassword: boolean;
  /** False until an admin issues a password (imported accounts start without one). */
  hasPassword: boolean;
}

export interface TeacherRow extends AccountState {
  fullName: string;
  login: string | null;
  email: string | null;
  groups: { id: string; name: string }[];
  createdAt: string;
}

export interface AdminStudentRow extends AccountState {
  fullName: string;
  login: string | null;
  email: string | null;
  group: { id: string; name: string } | null;
  createdAt: string;
}

/** Returned once when a password is issued. Never persisted in plain text. */
export interface TemporaryCredential {
  userId: string;
  fullName: string;
  login: string;
  group: string | null;
  temporaryPassword: string;
}

export interface CreatedTeacher {
  teacher: TeacherRow;
  credential: TemporaryCredential;
}
