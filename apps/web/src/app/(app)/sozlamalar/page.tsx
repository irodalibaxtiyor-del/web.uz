'use client';

import {
  NOTIFICATION_KIND_LABEL,
  NOTIFICATION_KINDS,
  type CertificateView,
  type NotificationKind,
  type TelegramLinkStart,
  type TelegramStatus,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useState } from 'react';
import { confirmDialog } from '@/components/dialog';
import { Icon } from '@/components/icons';
import { Button, EmptyState, ErrorText, LoadState, PageHeader } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="Sozlamalar"
        subtitle="Telegram xabarnomalari va olgan sertifikatlaringiz."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <TelegramCard />
        <CertificatesCard />
      </div>
    </>
  );
}

function TelegramCard() {
  const { state, setState, reload } = useApi<TelegramStatus>('/me/telegram');
  const [link, setLink] = useState<TelegramLinkStart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function startLink() {
    setPending(true);
    setError(null);
    const r = await send<TelegramLinkStart>('POST', '/me/telegram/link');
    setPending(false);
    if (!r.ok) return setError(r.message);
    setLink(r.data);
  }

  async function toggle(kind: NotificationKind, on: boolean) {
    setError(null);
    const r = await send<TelegramStatus>('PATCH', '/me/telegram', { [kind]: on });
    if (!r.ok) return setError(r.message);
    setState({ kind: 'ready', data: r.data });
  }

  async function unlink() {
    const ok = await confirmDialog({
      title: 'Telegram’ni uzish',
      message: 'Xabarnomalar endi Telegram’ga yuborilmaydi.',
      confirmLabel: 'Uzish',
      tone: 'danger',
    });
    if (!ok) return;
    const r = await send('DELETE', '/me/telegram');
    if (!r.ok) return setError(r.message);
    setLink(null);
    reload();
  }

  return (
    <section aria-labelledby="tg-h" className="card space-y-4 p-6">
      <h2 id="tg-h" className="flex items-center gap-2 text-lg font-semibold">
        <Icon name="send" className="size-5" /> Telegram xabarnomalari
      </h2>
      <LoadState state={state}>
        {(s) =>
          !s.enabled ? (
            <p className="text-slate-600 dark:text-slate-400">
              Telegram xabarnomalari hozircha yoqilmagan: platforma administratori botni sozlashi
              kerak.
            </p>
          ) : s.linked ? (
            <>
              <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Icon name="checkCircle" className="size-5" /> Telegram ulangan
                {s.botUsername && (
                  <span className="text-slate-600 dark:text-slate-400">(@{s.botUsername})</span>
                )}
              </p>
              <fieldset className="space-y-2">
                <legend className="mb-1 font-semibold">Qaysi xabarlar yuborilsin?</legend>
                {NOTIFICATION_KINDS.map((k) => (
                  <label key={k} className="flex min-h-11 items-center gap-3">
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={s.prefs[k]}
                      onChange={(e) => void toggle(k, e.target.checked)}
                    />
                    {NOTIFICATION_KIND_LABEL[k]}
                  </label>
                ))}
              </fieldset>
              <Button variant="secondary" onClick={() => void unlink()}>
                Telegram’ni uzish
              </Button>
            </>
          ) : (
            <>
              <p>
                Takrorlash vaqti kelganda, topshiriq tekshirilganda va sertifikat berilganda
                Telegram’da xabar oling.
              </p>
              {link ? (
                <div className="space-y-3 rounded-xl bg-subtle p-4">
                  <p>
                    Quyidagi havolani oching va botda <strong>Start</strong> tugmasini bosing.
                    Havola {new Date(link.expiresAt).toLocaleTimeString('uz-UZ')} gacha va bir marta
                    ishlaydi.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <Icon name="external" className="size-4" /> Telegram’da ochish
                    </a>
                    <Button variant="secondary" onClick={reload}>
                      Uladim — tekshirish
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => void startLink()} disabled={pending}>
                  <Icon name="send" className="size-4" /> Telegram’ni ulash
                </Button>
              )}
            </>
          )
        }
      </LoadState>
      {error && <ErrorText>{error}</ErrorText>}
    </section>
  );
}

function CertificatesCard() {
  const { state } = useApi<CertificateView[]>('/me/certificates');
  return (
    <section aria-labelledby="cert-h" className="card space-y-4 p-6">
      <h2 id="cert-h" className="flex items-center gap-2 text-lg font-semibold">
        <Icon name="award" className="size-5" /> Mening sertifikatlarim
      </h2>
      <LoadState state={state}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState title="Hali sertifikat yo‘q">
              Kursning barcha darslarini tugatsangiz, kurs xaritasida sertifikat olasiz.
            </EmptyState>
          ) : (
            <ul className="space-y-2">
              {list.map((c) => (
                <li
                  key={c.code}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line p-3"
                >
                  <div>
                    <p className="font-semibold">{c.courseTitle}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(c.issuedAt).toLocaleDateString('uz-UZ')} · {c.code}
                      {c.revoked && ' · bekor qilingan'}
                    </p>
                  </div>
                  <Link href={`/sertifikat/${c.code}`} className="btn btn-outline">
                    Ochish
                  </Link>
                </li>
              ))}
            </ul>
          )
        }
      </LoadState>
    </section>
  );
}
