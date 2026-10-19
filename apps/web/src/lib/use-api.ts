'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

export type Loadable<T> =
  | { kind: 'loading' }
  | { kind: 'error'; status: number; message: string; code?: string }
  | { kind: 'ready'; data: T };

/**
 * GET helper for client pages. A 401 sends the user to the login page; an account that must
 * replace a temporary password is sent to the change-password page.
 */
export function useApi<T>(path: string | null) {
  const router = useRouter();
  const [state, setState] = useState<Loadable<T>>({ kind: 'loading' });
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    api<T>(path).then((res) => {
      if (cancelled) return;
      if (res.ok) setState({ kind: 'ready', data: res.data });
      else if (res.status === 401) router.replace('/login');
      else if (res.code === 'PASSWORD_CHANGE_REQUIRED') router.replace('/change-password');
      else setState({ kind: 'error', status: res.status, message: res.message, code: res.code });
    });
    return () => {
      cancelled = true;
    };
  }, [path, version, router]);

  return { state, setState, reload };
}
