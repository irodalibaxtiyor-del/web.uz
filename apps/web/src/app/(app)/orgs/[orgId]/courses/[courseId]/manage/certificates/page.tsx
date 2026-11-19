'use client';

import type { CertificateAdminRow } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { promptDialog } from '@/components/dialog';
import { EmptyState, ErrorText, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const date = (iso: string) =>
  new Date(iso).toLocaleDateString('uz-UZ', { timeZone: 'Asia/Tashkent' });

export default function ManageCertificatesPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state, reload } = useApi<CertificateAdminRow[]>(`${base}/certificates`);
  const [error, setError] = useState<string | null>(null);

  async function revoke(c: CertificateAdminRow) {
    const reason = await promptDialog({
      title: 'Sertifikatni bekor qilish',
      label: 'Sabab (tekshirish sahifasida ko‘rinadi)',
      message: `${c.fullName} — ${c.code}. Bu amalni qaytarib bo‘lmaydi.`,
      confirmLabel: 'Bekor qilish',
      multiline: true,
      required: true,
    });
    if (!reason) return;
    setError(null);
    const r = await send('POST', `${base}/certificates/${c.id}/revoke`, { reason });
    if (!r.ok) return setError(r.message);
    reload();
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `${base}/manage`, label: 'Kursni boshqarish' },
        ]}
        title="Sertifikatlar"
        subtitle="Kursning barcha darslarini tugatgan talaba sertifikatni o‘zi oladi. Har sertifikat ochiq sahifada kod orqali tekshiriladi."
      />
      {error && <ErrorText>{error}</ErrorText>}
      <LoadState state={state}>
        {(rows) =>
          rows.length === 0 ? (
            <EmptyState title="Hali sertifikat berilmagan">
              Talaba kursni to‘liq tugatgach, kurs xaritasida “Sertifikat olish” tugmasi chiqadi.
            </EmptyState>
          ) : (
            <div className="card p-4 sm:p-6">
              <TableScroll label="Berilgan sertifikatlar">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="py-2 pr-4">
                        Talaba
                      </th>
                      <th scope="col" className="py-2 pr-4">
                        Kod
                      </th>
                      <th scope="col" className="py-2 pr-4">
                        Sana
                      </th>
                      <th scope="col" className="py-2 pr-4">
                        Holat
                      </th>
                      <th scope="col" className="py-2">
                        <span className="sr-only">Amallar</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((c) => (
                      <tr key={c.id} className="border-b border-line last:border-0">
                        <th scope="row" className="py-2 pr-4 font-medium">
                          {c.fullName}
                        </th>
                        <td className="py-2 pr-4 font-mono">
                          <Link href={`/sertifikat/${c.code}`} className="underline">
                            {c.code}
                          </Link>
                        </td>
                        <td className="py-2 pr-4">{date(c.issuedAt)}</td>
                        <td className="py-2 pr-4">
                          {c.revokedAt ? (
                            <span className="text-rose-700 dark:text-rose-400">
                              Bekor qilingan ({date(c.revokedAt)}): {c.revokedReason}
                            </span>
                          ) : (
                            <span className="text-emerald-700 dark:text-emerald-400">Amalda</span>
                          )}
                        </td>
                        <td className="py-2 text-right">
                          {!c.revokedAt && (
                            <button
                              type="button"
                              className="btn btn-outline px-3 py-1.5 text-sm text-rose-700 dark:text-rose-400"
                              onClick={() => void revoke(c)}
                            >
                              Bekor qilish
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableScroll>
            </div>
          )
        }
      </LoadState>
    </>
  );
}
