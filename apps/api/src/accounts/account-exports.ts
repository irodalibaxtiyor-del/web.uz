import type { AdminStudentRow, TeacherRow, TemporaryCredential } from '@webdizayn/shared';
import { buildXlsx, type Cell } from '../common/xlsx';

const STATUS = (a: { disabled: boolean; hasPassword: boolean; mustChangePassword: boolean }) =>
  a.disabled
    ? 'Faolsiz'
    : !a.hasPassword
      ? 'Parol berilmagan'
      : a.mustChangePassword
        ? 'Vaqtinchalik parol'
        : 'Faol';

/** One-time hand-out sheet. Built from the reset response; the passwords are not stored. */
export function credentialsWorkbook(
  orgName: string,
  title: string,
  credentials: TemporaryCredential[],
  now = new Date(),
): Buffer {
  const rows: Cell[][] = [
    [`${orgName} — ${title}`],
    ['Eksport sanasi', now],
    ['Diqqat: parollar faqat shu faylda. Birinchi kirishda almashtirish talab qilinadi.'],
    [],
    ['№', 'F.I.Sh.', 'Guruh', 'Login', 'Vaqtinchalik parol'],
    ...credentials.map((c, i) => [i + 1, c.fullName, c.group ?? '', c.login, c.temporaryPassword]),
  ];
  return buildXlsx([
    {
      name: 'Kirish ma’lumotlari',
      rows,
      boldRows: [0, 4],
      widths: [5, 44, 14, 26, 22],
    },
  ]);
}

/** Every login of the organization, with account state. No password data of any kind. */
export function loginsWorkbook(
  orgName: string,
  students: AdminStudentRow[],
  teachers: TeacherRow[],
  now = new Date(),
): Buffer {
  const head = (title: string): Cell[][] => [
    [`${orgName} — ${title}`],
    ['Eksport sanasi', now],
    [],
  ];
  return buildXlsx([
    {
      name: 'Talabalar',
      boldRows: [0, 3],
      widths: [5, 44, 14, 26, 20],
      rows: [
        ...head('talabalar loginlari'),
        ['№', 'F.I.Sh.', 'Guruh', 'Login', 'Holat'],
        ...students.map((s, i) => [
          i + 1,
          s.fullName,
          s.group?.name ?? 'Guruhsiz',
          s.login ?? s.email ?? '',
          STATUS(s),
        ]),
      ],
    },
    {
      name: 'O‘qituvchilar',
      boldRows: [0, 3],
      widths: [5, 40, 26, 30, 30, 20],
      rows: [
        ...head('o‘qituvchilar loginlari'),
        ['№', 'F.I.Sh.', 'Login', 'Email', 'Guruhlar', 'Holat'],
        ...teachers.map((t, i) => [
          i + 1,
          t.fullName,
          t.login ?? '',
          t.email ?? '',
          t.groups.map((g) => g.name).join(', '),
          STATUS(t),
        ]),
      ],
    },
  ]);
}
