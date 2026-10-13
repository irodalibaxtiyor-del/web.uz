'use client';

import {
  PORTFOLIO_MAX_ITEMS,
  PORTFOLIO_SLUG_RE,
  type MyPortfolio,
  type PortfolioCandidate,
  type PortfolioItemSummary,
  type PortfolioProfile,
} from '@webdizayn/shared';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import {
  Achievements,
  CompletedCourses,
  ITEM_KIND_LABEL,
  PortfolioItemCard,
} from '@/components/portfolio-ui';
import { Button, ErrorText, LoadState, PageHeader } from '@/components/ui';
import { send } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import { useApi } from '@/lib/use-api';

export default function MyPortfolioPage() {
  const { state, reload } = useApi<MyPortfolio>('/portfolio/me');
  return <LoadState state={state}>{(p) => <Editor data={p} reload={reload} />}</LoadState>;
}

function Editor({ data, reload }: { data: MyPortfolio; reload: () => void }) {
  const { profile } = data;
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/dashboard', label: 'Kabinet' }]}
        title="Mening portfoliom"
        subtitle="Eng yaxshi ishlaringizni tanlang va xohlasangiz, ochiq havola orqali ulashing."
        actions={
          profile.isPublished && profile.slug ? (
            <Link
              href={`/p/${profile.slug}`}
              className="btn btn-accent"
              target="_blank"
              rel="noopener"
            >
              Ochiq sahifani ko‘rish
            </Link>
          ) : undefined
        }
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <PublishPanel profile={profile} reload={reload} />
          <ProfileForm profile={profile} reload={reload} />
          <Items items={data.items} reload={reload} />
          <Candidates
            list={data.candidates}
            full={data.items.length >= PORTFOLIO_MAX_ITEMS}
            reload={reload}
          />
        </div>
        <aside className="space-y-6">
          <section className="card space-y-3 p-5" aria-labelledby="ach-h">
            <h2 id="ach-h" className="text-lg font-bold">
              Yutuqlar
            </h2>
            <Achievements list={data.achievements} />
          </section>
          <section className="card space-y-3 p-5" aria-labelledby="courses-h">
            <h2 id="courses-h" className="text-lg font-bold">
              Tugatilgan kurslar
            </h2>
            <CompletedCourses list={data.completedCourses} />
          </section>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Yutuqlar va kurslar o‘qish natijalaridan avtomatik hisoblanadi.
          </p>
        </aside>
      </div>
    </>
  );
}

function PublishPanel({ profile, reload }: { profile: PortfolioProfile; reload: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (
      !profile.isPublished &&
      !window.confirm(
        'Portfolio ochiq bo‘ladi: havolani bilgan har kim ismingiz, tavsifingiz, ko‘nikmalaringiz, ' +
          'yutuqlaringiz, tugatilgan kurslaringiz va tanlangan ishlaringiz kodini ko‘ra oladi. ' +
          'Email, baholar va o‘qituvchi izohlari ko‘rsatilmaydi. Davom etasizmi?',
      )
    ) {
      return;
    }
    setError(null);
    setPending(true);
    const res = await send(
      'POST',
      profile.isPublished ? '/portfolio/me/unpublish' : '/portfolio/me/publish',
    );
    setPending(false);
    if (!res.ok) return setError(res.message);
    reload();
  }

  return (
    <section className="card space-y-3 p-6" aria-labelledby="pub-h">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="pub-h" className="text-xl font-bold">
          Holati
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            profile.isPublished
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <span aria-hidden="true">{profile.isPublished ? '● ' : '○ '}</span>
          {profile.isPublished ? 'E’lon qilingan' : 'Yashirin'}
        </span>
      </div>
      {profile.isPublished && profile.slug ? (
        <p className="text-slate-700 dark:text-slate-300">
          Ochiq manzil:{' '}
          <Link
            href={`/p/${profile.slug}`}
            className="font-semibold text-brand-700 underline dark:text-brand-300"
          >
            /p/{profile.slug}
          </Link>
          {profile.publishedAt && <> · {formatDate(profile.publishedAt)} dan beri</>}
        </p>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          Portfolioni faqat siz ko‘rasiz. E’lon qilish uchun avval ochiq manzil tanlang.
        </p>
      )}
      {error && <ErrorText>{error}</ErrorText>}
      <Button
        variant={profile.isPublished ? 'secondary' : 'primary'}
        onClick={toggle}
        disabled={pending || (!profile.isPublished && !profile.slug)}
      >
        {profile.isPublished ? 'Yashirish' : 'E’lon qilish'}
      </Button>
    </section>
  );
}

function ProfileForm({ profile, reload }: { profile: PortfolioProfile; reload: () => void }) {
  const [slug, setSlug] = useState(profile.slug ?? '');
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [skills, setSkills] = useState(profile.skills.join(', '));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const slugValue = slug.trim().toLowerCase();
  const slugInvalid =
    slugValue !== '' && (!PORTFOLIO_SLUG_RE.test(slugValue) || slugValue.includes('--'));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (slugInvalid)
      return setError('Manzil 3–40 ta kichik lotin harfi, raqam va chiziqchadan iborat bo‘lsin');
    setPending(true);
    const res = await send('PUT', '/portfolio/me', {
      slug: slugValue || null,
      displayName,
      headline,
      bio,
      skills: skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setPending(false);
    if (!res.ok) {
      return setError(
        res.status === 400
          ? 'Maydonlarni tekshiring (ko‘nikmalar takrorlanmasin, 20 tagacha)'
          : res.message,
      );
    }
    setSlug(slugValue);
    setSaved(true);
    reload();
  }

  return (
    <form className="card space-y-4 p-6" onSubmit={onSubmit} aria-labelledby="profile-h">
      <h2 id="profile-h" className="text-xl font-bold">
        Profil
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Ko‘rsatiladigan ism</span>
          <input
            className="field"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
            maxLength={80}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Ochiq manzil</span>
          <span className="flex items-center gap-1">
            <span className="text-sm text-slate-500 dark:text-slate-400" aria-hidden="true">
              /p/
            </span>
            <input
              className="field"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ism-familiya"
              maxLength={40}
              aria-invalid={slugInvalid}
              aria-describedby="slug-help"
            />
          </span>
          <span
            id="slug-help"
            className={`block text-xs ${slugInvalid ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Kichik lotin harflari, raqamlar va chiziqcha; 3–40 belgi.
          </span>
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Qisqa tavsif</span>
        <input
          className="field"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          maxLength={120}
          placeholder="Masalan, boshlovchi veb-dizayner"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Men haqimda</span>
        <textarea
          className="field min-h-28"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={2000}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Ko‘nikmalar (vergul bilan)</span>
        <input
          className="field"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="HTML, CSS, Figma"
        />
      </label>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          Saqlash
        </Button>
        {saved && (
          <span role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
            Saqlandi
          </span>
        )}
      </div>
    </form>
  );
}

function Items({ items, reload }: { items: PortfolioItemSummary[]; reload: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  async function act(p: Promise<{ ok: boolean; message?: string }>) {
    setError(null);
    const res = await p;
    if (!res.ok) return setError(res.message ?? 'Xatolik');
    reload();
  }

  async function move(index: number, dir: -1 | 1) {
    const order = [...items];
    [order[index], order[index + dir]] = [order[index + dir]!, order[index]!];
    setError(null);
    // Positions become list indexes, which also normalizes any gaps or ties.
    const results = await Promise.all(
      order.map((it, pos) =>
        it.position === pos
          ? null
          : send('PATCH', `/portfolio/me/items/${it.id}`, { position: pos }),
      ),
    );
    if (results.some((r) => r && !r.ok)) setError('Tartibni o‘zgartirib bo‘lmadi');
    reload();
  }

  return (
    <section className="space-y-4" aria-labelledby="items-h">
      <h2 id="items-h" className="text-2xl font-bold">
        Ishlarim{' '}
        <span className="text-base font-normal text-slate-500 dark:text-slate-400">
          ({items.length}/{PORTFOLIO_MAX_ITEMS})
        </span>
      </h2>
      {error && <ErrorText>{error}</ErrorText>}
      {items.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          Hali ishlar qo‘shilmagan. Pastdagi ro‘yxatdan tanlang.
        </p>
      )}
      {items.map((item, i) =>
        editing === item.id ? (
          <ItemEditor
            key={item.id}
            item={item}
            onDone={() => {
              setEditing(null);
              reload();
            }}
          />
        ) : (
          <PortfolioItemCard
            key={item.id}
            item={item}
            detailPath={`/portfolio/me/items/${item.id}`}
            actions={
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="px-3"
                  aria-label={`${item.title}: yuqoriga`}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  ↑
                </Button>
                <Button
                  variant="secondary"
                  className="px-3"
                  aria-label={`${item.title}: pastga`}
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ↓
                </Button>
                <Button variant="secondary" onClick={() => setEditing(item.id)}>
                  Tahrirlash
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    window.confirm(`“${item.title}” portfoliodan olib tashlansinmi?`) &&
                    act(send('DELETE', `/portfolio/me/items/${item.id}`))
                  }
                >
                  O‘chirish
                </Button>
              </div>
            }
          />
        ),
      )}
    </section>
  );
}

function ItemEditor({ item, onDone }: { item: PortfolioItemSummary; onDone: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await send('PATCH', `/portfolio/me/items/${item.id}`, { title, description });
    if (!res.ok) return setError(res.message);
    onDone();
  }

  return (
    <form
      className="card space-y-3 p-5"
      onSubmit={onSubmit}
      aria-label={`${item.title}: tahrirlash`}
    >
      <p className="section-eyebrow">
        {ITEM_KIND_LABEL[item.kind]} · {item.courseTitle}
      </p>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Nomi</span>
        <input
          className="field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={2}
          maxLength={120}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Tavsif</span>
        <textarea
          className="field min-h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          placeholder="Nima qildingiz, nimani o‘rgandingiz?"
        />
      </label>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex gap-3">
        <Button type="submit">Saqlash</Button>
        <Button variant="secondary" onClick={onDone}>
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}

function Candidates({
  list,
  full,
  reload,
}: {
  list: PortfolioCandidate[];
  full: boolean;
  reload: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  async function add(c: PortfolioCandidate) {
    setError(null);
    setPending(c.sourceId);
    const res = await send('POST', '/portfolio/me/items', { kind: c.kind, sourceId: c.sourceId });
    setPending(null);
    if (!res.ok) return setError(res.message);
    reload();
  }

  return (
    <section className="card space-y-4 p-6" aria-labelledby="cand-h">
      <div className="space-y-1">
        <h2 id="cand-h" className="text-xl font-bold">
          Qo‘shish mumkin bo‘lgan ishlar
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          O‘tilgan mashqlar va o‘qituvchi baholagan topshiriqlar. Qo‘shilgan paytdagi kod saqlanadi.
        </p>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {list.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">Hozircha yangi tugatilgan ish yo‘q.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {list.map((c) => (
            <li
              key={`${c.kind}:${c.sourceId}`}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <span>
                <span className="block font-semibold">{c.title}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  {ITEM_KIND_LABEL[c.kind]} · {c.courseTitle}
                  {c.finishedAt && <> · {formatDate(c.finishedAt)}</>}
                </span>
              </span>
              <Button
                variant="secondary"
                onClick={() => add(c)}
                disabled={full || pending === c.sourceId}
                aria-label={`${c.title}: portfolioga qo‘shish`}
              >
                + Qo‘shish
              </Button>
            </li>
          ))}
        </ul>
      )}
      {full && (
        <p className="text-sm text-amber-700">Portfolio to‘lgan ({PORTFOLIO_MAX_ITEMS} ta ish).</p>
      )}
    </section>
  );
}
