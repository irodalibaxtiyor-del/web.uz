'use client';

import {
  CERTIFICATE_CODE_RE,
  normalizeCertificateCode,
  type CertificateView,
  type MyCertificateStatus,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { Button, ErrorText, inputClass } from '@/components/ui';
import { api, send } from '@/lib/api';

export function PrintButton() {
  return (
    <button type="button" className="btn btn-primary" onClick={() => window.print()}>
      <Icon name="upload" className="size-4 rotate-180" />
      Chop etish yoki PDF saqlash
    </button>
  );
}

/** Course map card: claim the certificate once every lesson is done, or open it. */
export function CertificateBanner({ base }: { base: string }) {
  const router = useRouter();
  const [st, setSt] = useState<MyCertificateStatus | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void api<MyCertificateStatus>(`${base}/certificate`).then((r) => {
      if (alive && r.ok) setSt(r.data);
    });
    return () => {
      alive = false;
    };
  }, [base]);
  if (!st || (!st.certificate && !st.eligible)) return null;

  async function claim() {
    setPending(true);
    setError(null);
    const r = await send<CertificateView>('POST', `${base}/certificate`);
    setPending(false);
    if (!r.ok) return setError(r.message);
    router.push(`/sertifikat/${r.data.code}`);
  }

  const c = st.certificate;
  return (
    <section
      aria-label="Kurs sertifikati"
      className="card flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-accent-400 p-5"
    >
      <div className="flex items-start gap-3">
        <Icon name="award" className="mt-0.5 size-7 text-accent-500" />
        <div>
          <p className="font-semibold">
            {c
              ? c.revoked
                ? 'Sertifikatingiz bekor qilingan'
                : 'Sizning sertifikatingiz'
              : 'Tabriklaymiz! Kursni tugatdingiz'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {c
              ? `Tekshirish kodi: ${c.code}`
              : `${st.total} ta darsning hammasi tugatildi — sertifikat olishingiz mumkin.`}
          </p>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </div>
      {c ? (
        <Link href={`/sertifikat/${c.code}`} className="btn btn-outline">
          Sertifikatni ochish
        </Link>
      ) : (
        <Button onClick={() => void claim()} disabled={pending}>
          <Icon name="award" className="size-4" />
          {pending ? 'Tayyorlanmoqda…' : 'Sertifikat olish'}
        </Button>
      )}
    </section>
  );
}

/** Code entry on the public verification page. */
export function CertificateLookup() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  function submit(e: FormEvent) {
    e.preventDefault();
    const c = normalizeCertificateCode(code);
    if (!CERTIFICATE_CODE_RE.test(c)) {
      return setError('Kod 12 belgidan iborat: masalan, ABCD-EFGH-JKMN');
    }
    router.push(`/sertifikat/${c}`);
  }
  return (
    <form onSubmit={submit} className="flex flex-wrap items-start gap-3" noValidate>
      <div className="min-w-60 flex-1 space-y-1">
        <label htmlFor="cert-code" className="block font-semibold">
          Sertifikat kodi
        </label>
        <input
          id="cert-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ABCD-EFGH-JKMN"
          autoComplete="off"
          spellCheck={false}
          className={`${inputClass} font-mono uppercase`}
          aria-describedby={error ? 'cert-err' : undefined}
          aria-invalid={error ? true : undefined}
        />
        {error && (
          <p id="cert-err" className="text-sm text-rose-700 dark:text-rose-400">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" className="mt-7">
        Tekshirish
      </Button>
    </form>
  );
}
