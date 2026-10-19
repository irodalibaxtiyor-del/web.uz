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

export function send<T>(
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body: unknown = {},
) {
  return api<T>(path, { method, body: method === 'DELETE' ? undefined : JSON.stringify(body) });
}

/** File name from `Content-Disposition` (prefers the RFC 5987 UTF-8 form). */
export function fileNameFrom(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star) {
    try {
      return decodeURIComponent(star[1]!);
    } catch {
      // fall through to the plain form
    }
  }
  const plain = /filename="([^"]+)"/i.exec(header);
  return plain?.[1] ?? fallback;
}

/**
 * Fetches a generated file (e.g. .xlsx) and hands it to the browser as a download. The file
 * stays in memory only; the object URL is revoked right after the click.
 */
export async function download(
  path: string,
  init: { method?: 'GET' | 'POST'; body?: unknown; fallbackName?: string } = {},
): Promise<ApiResult<{ fileName: string; headers: Headers }>> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: init.method ?? 'GET',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    return { ok: false, status: 0, message: NETWORK_ERROR };
  }
  if (!res.ok) {
    const obj = ((await res.json().catch(() => null)) ?? {}) as Record<string, unknown>;
    return {
      ok: false,
      status: res.status,
      message: typeof obj.message === 'string' ? obj.message : 'Faylni yuklab bo‘lmadi',
      code: typeof obj.code === 'string' ? obj.code : undefined,
    };
  }
  const blob = await res.blob();
  const fileName = fileNameFrom(
    res.headers.get('content-disposition'),
    init.fallbackName ?? 'fayl.xlsx',
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { ok: true, status: res.status, data: { fileName, headers: res.headers } };
}
