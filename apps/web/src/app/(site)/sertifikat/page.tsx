import type { Metadata } from 'next';
import { CertificateLookup } from '@/components/certificate-ui';
import { SITE_NAME } from '@/lib/catalog';

export const metadata: Metadata = {
  title: `Sertifikatni tekshirish — ${SITE_NAME}`,
  description: `${SITE_NAME} platformasida berilgan sertifikat haqiqiyligini kod orqali tekshiring.`,
};

export default function CertificateLookupPage() {
  return (
    <div className="container-page max-w-2xl space-y-6 py-12 sm:py-16">
      <h1 className="text-title font-bold">Sertifikatni tekshirish</h1>
      <p>
        Sertifikat pastki qismidagi 12 belgili kodni kiriting. Sahifada sertifikat egasi, kurs nomi,
        berilgan sana va sertifikat bekor qilinmaganligi ko‘rsatiladi.
      </p>
      <div className="card p-6">
        <CertificateLookup />
      </div>
    </div>
  );
}
