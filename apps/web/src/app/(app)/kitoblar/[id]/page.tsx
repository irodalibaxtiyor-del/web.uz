'use client';

import type { BookDetail } from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { BookReader } from '@/components/book-reader';
import { LoadState } from '@/components/ui';
import { useApi } from '@/lib/use-api';

export default function BookReaderPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApi<BookDetail>(`/books/${id}`);
  return (
    <LoadState state={state}>
      {(book) => (
        <>
          <title>{`${book.title} — WEBDIZAYN.UZ`}</title>
          <BookReader key={book.id} book={book} />
        </>
      )}
    </LoadState>
  );
}
