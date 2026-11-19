import { z } from 'zod';

/**
 * Course completion certificates. A student who has completed every lesson of a published
 * course claims a certificate; anyone can verify it by its code on a public page. Names and
 * titles are frozen at issue time so later renames do not change an issued certificate.
 */

/** No 0/O, 1/I/L: codes are typed in by hand. */
export const CERTIFICATE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CERTIFICATE_CODE_RE = /^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/;

/** Normalizes a typed code: upper case, spaces removed, dashes restored. */
export function normalizeCertificateCode(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (raw.length !== 12) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}`;
}

/** Builds a code from 12 random bytes (one character per byte, modulo bias is negligible). */
export function certificateCodeFromBytes(bytes: Uint8Array): string {
  if (bytes.length < 12) throw new Error('12 random bytes required');
  let s = '';
  for (let i = 0; i < 12; i++) s += CERTIFICATE_ALPHABET[bytes[i]! % CERTIFICATE_ALPHABET.length];
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
}

export const revokeCertificateSchema = z.object({
  reason: z.string().trim().min(3, 'Sababni yozing').max(300),
});
export type RevokeCertificateInput = z.infer<typeof revokeCertificateSchema>;

/** What the public verification page shows. */
export interface CertificateView {
  code: string;
  fullName: string;
  courseTitle: string;
  organizationName: string;
  lessons: number;
  issuedAt: string;
  revoked: boolean;
  revokedReason: string | null;
}

export interface MyCertificateStatus {
  certificate: CertificateView | null;
  eligible: boolean;
  completed: number;
  total: number;
}

export interface CertificateAdminRow {
  id: string;
  code: string;
  fullName: string;
  issuedAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
}
