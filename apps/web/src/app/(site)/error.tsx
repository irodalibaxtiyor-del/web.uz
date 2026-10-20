'use client';

import { ErrorState } from '@/components/ui';

/** Unexpected failure while rendering a public page (e.g. the API is unreachable). */
export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page py-16">
      <ErrorState
        title="Sahifani yuklab bo‘lmadi"
        message="Server vaqtincha javob bermayapti. Birozdan keyin qayta urinib ko‘ring."
        onRetry={reset}
      />
    </div>
  );
}
