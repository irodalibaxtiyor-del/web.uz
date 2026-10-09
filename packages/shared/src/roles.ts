export const ROLES = ['STUDENT', 'TEACHER', 'ORG_ADMIN'] as const;
export type Role = (typeof ROLES)[number];
