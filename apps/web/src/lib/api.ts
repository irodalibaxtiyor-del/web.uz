export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; message: string; code?: string };

const NETWORK_ERROR = "Server bilan aloqa yo'q. Internetni tekshirib, qayta urinib ko'ring";

/** Same-origin call through the Next.js `/api` rewrite so the session cookie is first-party. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json', ...init.headers },
    });
  } catch {
    return { ok: false, status: 0, message: NETWORK_ERROR };
  }
  const body: unknown = res.status === 204 ? null : await res.json().catch(() => null);
  if (res.ok) return { ok: true, status: res.status, data: body as T };

  const obj = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  return {
    ok: false,
    status: res.status,
    message: typeof obj.message === 'string' ? obj.message : 'Kutilmagan xatolik yuz berdi',
    code: typeof obj.code === 'string' ? obj.code : undefined,
  };
}

export function send<T>(method: 'POST' | 'PATCH' | 'PUT', path: string, body: unknown = {}) {
  return api<T>(path, { method, body: JSON.stringify(body) });
}
