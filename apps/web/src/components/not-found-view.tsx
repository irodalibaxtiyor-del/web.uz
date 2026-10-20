import Link from 'next/link';
import { Icon } from './icons';

/** Shared body of the 404 pages. */
export function NotFoundView() {
  return (
    <div className="container-page flex min-h-[60dvh] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-sm font-semibold text-brand-700 dark:text-brand-300">404</p>
      <h1 className="mt-3 text-title font-bold">Sahifa topilmadi</h1>
      <p className="mt-3 max-w-md text-muted">
        Havola noto‘g‘ri yoki sahifa o‘chirilgan bo‘lishi mumkin. Manzilni tekshiring yoki quyidagi
        bo‘limlardan birini oching.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          <Icon name="home" className="size-4" />
          Bosh sahifa
        </Link>
        <Link href="/yonalishlar" className="btn btn-outline">
          Yo‘nalishlar
        </Link>
      </div>
    </div>
  );
}
