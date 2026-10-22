'use client';

import type { BookAdmin, BookAdminList, BookStatus } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { Notice } from '@/components/admin-ui';
import { Empty, Section } from '@/components/analytics-ui';
import { confirmDialog, Dialog } from '@/components/dialog';
import { Icon } from '@/components/icons';
import { Button, ErrorText, inputClass, LoadState, PageHeader, StatusLabel } from '@/components/ui';
import { send } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

const STATUS: Record<
  BookStatus,
  { icon: 'loader' | 'checkCircle' | 'circleX'; text: string; tone: 'info' | 'success' | 'danger' }
> = {
  PROCESSING: { icon: 'loader', text: 'Betlar tayyorlanmoqda', tone: 'info' },
  READY: { icon: 'checkCircle', text: 'Tayyor', tone: 'success' },
  FAILED: { icon: 'circleX', text: 'Xato', tone: 'danger' },
};

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function AdminBooksPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const base = `/orgs/${orgId}/admin/books`;
  const { state, reload } = useApi<BookAdminList>(base);
  const processing =
    state.kind === 'ready' && state.data.books.some((b) => b.status === 'PROCESSING');

  // While pages are being rendered, refresh the list every few seconds.
  useEffect(() => {
    if (!processing) return;
    const t = setInterval(reload, 3000);
    return () => clearInterval(t);
  }, [processing, reload]);

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="Elektron darsliklar"
        subtitle="PDF darslik yuklang: server uni betma-bet rasmga aylantiradi. Foydalanuvchilar faylni yuklab ololmaydi — faqat saytda, suv belgisi bilan o‘qiydi."
      />
      <AdminNav orgId={orgId} />
      <LoadState state={state}>
        {(data) => (
          <div className="space-y-8">
            <UploadForm orgId={orgId} data={data} onUploaded={reload} />
            <Section
              title="Darsliklar"
              description="Faqat “Tayyor” holatidagi darslikni e’lon qilish mumkin."
            >
              {data.books.length === 0 ? (
                <Empty>Hali darslik yuklanmagan.</Empty>
              ) : (
                <ul className="divide-y divide-line">
                  {data.books.map((b) => (
                    <BookRow key={b.id} book={b} base={base} data={data} onChange={reload} />
                  ))}
                </ul>
              )}
            </Section>
            <Section
              title="Ogohlantirishlar"
              description="Bir daqiqada juda ko‘p bet so‘ragan foydalanuvchilar (ommaviy yuklab olishga urinish bo‘lishi mumkin). Oxirgi 30 kun."
            >
              {data.alerts.length === 0 ? (
                <Empty>Ogohlantirish yo‘q.</Empty>
              ) : (
                <ul className="space-y-2">
                  {data.alerts.map((a, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <StatusLabel icon="alert" tone="warning">
                        {formatDate(a.at)}
                      </StatusLabel>
                      <span className="font-medium">
                        {a.userName ?? 'O‘chirilgan foydalanuvchi'}
                      </span>
                      {a.userLogin && <span className="text-muted">({a.userLogin})</span>}
                      <span className="text-muted">— {a.bookTitle ?? 'o‘chirilgan darslik'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>
        )}
      </LoadState>
    </>
  );
}

function MetaFields({
  id,
  data,
  initial,
}: {
  id: string;
  data: BookAdminList;
  initial?: Partial<BookAdmin>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id={`${id}-title`} label="Nomi" className="sm:col-span-2">
        <input
          id={`${id}-title`}
          name="title"
          required
          minLength={2}
          maxLength={200}
          defaultValue={initial?.title}
          className={inputClass}
        />
      </Field>
      <Field id={`${id}-author`} label="Muallif">
        <input
          id={`${id}-author`}
          name="author"
          maxLength={200}
          defaultValue={initial?.author}
          className={inputClass}
        />
      </Field>
      <Field id={`${id}-year`} label="Yili">
        <input
          id={`${id}-year`}
          name="year"
          type="number"
          min={1900}
          max={2100}
          defaultValue={initial?.year ?? ''}
          className={inputClass}
        />
      </Field>
      <Field id={`${id}-dir`} label="Yo‘nalish">
        <select
          id={`${id}-dir`}
          name="directionId"
          defaultValue={initial?.directionId ?? ''}
          className={inputClass}
        >
          <option value="">Tanlanmagan</option>
          {data.directions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-course`} label="Kurs">
        <select
          id={`${id}-course`}
          name="courseId"
          defaultValue={initial?.courseId ?? ''}
          className={inputClass}
        >
          <option value="">Tanlanmagan</option>
          {data.courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-desc`} label="Tavsif" className="sm:col-span-2">
        <textarea
          id={`${id}-desc`}
          name="description"
          rows={3}
          maxLength={4000}
          defaultValue={initial?.description}
          className={inputClass}
        />
      </Field>
    </div>
  );
}

function Field({
  id,
  label,
  className = '',
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function UploadForm({
  orgId,
  data,
  onUploaded,
}: {
  orgId: string;
  data: BookAdminList;
  onUploaded: () => void;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const maxMb = Math.round(data.limits.maxBytes / 1024 / 1024);

  function pick(f: File | undefined | null) {
    setError(null);
    setDone(null);
    if (!f) return;
    if (!/\.pdf$/i.test(f.name) || (f.type && f.type !== 'application/pdf')) {
      setFile(null);
      return setError('Faqat PDF fayl yuklash mumkin.');
    }
    if (f.size > data.limits.maxBytes) {
      setFile(null);
      return setError(`Fayl ${maxMb} MB dan katta (${mb(f.size)}).`);
    }
    setFile(f);
    const title = formRef.current?.elements.namedItem('title') as HTMLInputElement | null;
    if (title && !title.value) title.value = f.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ');
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    pick(e.dataTransfer.files[0]);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return setError('PDF faylni tanlang yoki shu yerga tashlang.');
    const form = new FormData(e.currentTarget);
    form.delete('file');
    form.delete('cover');
    form.append('file', file);
    if (cover) form.append('cover', cover);
    // XHR (not fetch) for upload progress.
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/orgs/${orgId}/admin/books`);
    xhr.upload.onprogress = (ev) =>
      ev.lengthComputable && setProgress(Math.round((ev.loaded / ev.total) * 100));
    xhr.onload = () => {
      setProgress(null);
      if (xhr.status === 201) {
        setDone(
          `“${file.name}” yuklandi. Betlar tayyorlanmoqda — tayyor bo‘lgach e’lon qilishingiz mumkin.`,
        );
        setFile(null);
        setCover(null);
        formRef.current?.reset();
        onUploaded();
      } else {
        let msg = 'Yuklab bo‘lmadi.';
        try {
          msg = (JSON.parse(xhr.responseText) as { message?: string }).message ?? msg;
        } catch {
          if (xhr.status === 413) msg = `Fayl ${maxMb} MB dan katta.`;
        }
        setError(msg);
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError('Tarmoq xatosi. Qayta urinib ko‘ring.');
    };
    setError(null);
    setDone(null);
    setProgress(0);
    xhr.send(form);
  }

  return (
    <Section
      title="Yangi darslik"
      description={`PDF, ${maxMb} MB gacha, ${data.limits.maxPages} betgacha.`}
    >
      <form ref={formRef} onSubmit={submit} noValidate className="space-y-5">
        <label
          htmlFor={`${id}-file`}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600 ${
            over
              ? 'border-brand-600 bg-brand-50 dark:bg-brand-950'
              : 'border-line-strong hover:border-brand-500'
          }`}
        >
          <Icon name="upload" className="size-7 text-brand-700 dark:text-brand-300" />
          {file ? (
            <span>
              <span className="font-medium">{file.name}</span>{' '}
              <span className="text-muted">({mb(file.size)})</span>
            </span>
          ) : (
            <span>
              <span className="font-medium">PDF faylni shu yerga tashlang</span>{' '}
              <span className="text-muted">yoki bosib tanlang</span>
            </span>
          )}
          <input
            id={`${id}-file`}
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>
        <MetaFields id={id} data={data} />
        <Field
          id={`${id}-cover`}
          label="Muqova (ixtiyoriy: PNG, JPEG yoki WebP, 5 MB gacha; bo‘lmasa 1-bet olinadi)"
        >
          <input
            id={`${id}-cover`}
            name="cover"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className={inputClass}
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
          />
        </Field>
        {progress !== null && (
          <div className="space-y-1" role="status">
            <div className="h-2 overflow-hidden rounded-full bg-subtle">
              <div className="h-full bg-brand-600" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-muted">Yuklanmoqda… {progress}%</p>
          </div>
        )}
        {error && <ErrorText>{error}</ErrorText>}
        {done && <Notice>{done}</Notice>}
        <Button type="submit" disabled={progress !== null}>
          <Icon name="upload" className="size-4" />
          Yuklash
        </Button>
      </form>
    </Section>
  );
}

function BookRow({
  book: b,
  base,
  data,
  onChange,
}: {
  book: BookAdmin;
  base: string;
  data: BookAdminList;
  onChange: () => void;
}) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const s = STATUS[b.status];

  async function patch(body: object) {
    setError(null);
    setPending(true);
    const res = await send('PATCH', `${base}/${b.id}`, body);
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return false;
    }
    onChange();
    return true;
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? '').trim();
    const year = text('year');
    const ok = await patch({
      title: text('title'),
      author: text('author'),
      description: text('description'),
      year: year ? Number(year) : null,
      directionId: text('directionId') || null,
      courseId: text('courseId') || null,
    });
    if (ok) setEditing(false);
  }

  async function remove() {
    const yes = await confirmDialog({
      title: 'Darslikni o‘chirish',
      message: `“${b.title}” va uning barcha betlari butunlay o‘chiriladi. O‘quvchilarning qayerda to‘xtagani ham o‘chadi.`,
      confirmLabel: 'O‘chirish',
      tone: 'danger',
    });
    if (!yes) return;
    const res = await send('DELETE', `${base}/${b.id}`);
    if (!res.ok) return setError(res.message);
    onChange();
  }

  return (
    <li className="flex flex-col gap-4 py-5 sm:flex-row">
      <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-control border border-line bg-subtle">
        {b.status === 'READY' && (
          // eslint-disable-next-line @next/next/no-img-element -- session-protected API image
          <img
            src={`/api${base}/${b.id}/cover`}
            alt=""
            loading="lazy"
            draggable={false}
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-semibold">{b.title}</h3>
          <StatusLabel icon={s.icon} tone={s.tone}>
            {s.text}
          </StatusLabel>
          {b.status === 'READY' && (
            <StatusLabel
              icon={b.published ? 'eye' : 'eyeOff'}
              tone={b.published ? 'success' : 'neutral'}
            >
              {b.published ? 'E’lon qilingan' : 'Yashirin'}
            </StatusLabel>
          )}
        </div>
        <p className="text-sm text-muted">
          {[
            b.author,
            b.year,
            b.pageCount ? `${b.pageCount} bet` : null,
            mb(b.fileSize),
            b.direction?.title,
            b.course?.title,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {b.error && <ErrorText>{b.error}</ErrorText>}
        {error && <ErrorText>{error}</ErrorText>}
        <div className="flex flex-wrap gap-2">
          {b.status === 'READY' &&
            (b.published ? (
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() => patch({ published: false })}
              >
                <Icon name="eyeOff" className="size-4" />
                Yashirish
              </Button>
            ) : (
              <Button disabled={pending} onClick={() => patch({ published: true })}>
                <Icon name="eye" className="size-4" />
                E’lon qilish
              </Button>
            ))}
          {b.status === 'READY' && (
            <Link href={`/kitoblar/${b.id}`} className="btn btn-outline">
              <Icon name="book" className="size-4" />
              Ko‘rish
            </Link>
          )}
          <Button variant="ghost" onClick={() => setEditing(true)}>
            <Icon name="pencil" className="size-4" />
            Tahrirlash
          </Button>
          <Button variant="ghost" onClick={remove}>
            <Icon name="trash" className="size-4" />
            O‘chirish
          </Button>
        </div>
      </div>
      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        title="Darslikni tahrirlash"
        size="lg"
      >
        <form onSubmit={save} className="space-y-4">
          <MetaFields id={id} data={data} initial={b} />
          {error && <ErrorText>{error}</ErrorText>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Saqlanmoqda…' : 'Saqlash'}
            </Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Dialog>
    </li>
  );
}
