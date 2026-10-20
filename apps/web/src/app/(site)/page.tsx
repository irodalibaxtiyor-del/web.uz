import Link from 'next/link';
import { Icon } from '@/components/icons';

const DIRECTIONS: { title: string; text: string }[] = [
  { title: 'HTML asoslari', text: 'Sahifa tuzilishi va teglar' },
  { title: 'CSS va bezash', text: 'Rang, shrift, joylashuv' },
  { title: 'JavaScript', text: 'Interaktiv sahifalar' },
  { title: 'Flexbox va Grid', text: 'Zamonaviy maketlar' },
  { title: 'Moslashuvchan dizayn', text: 'Telefon va planshet uchun' },
  { title: 'UI asoslari', text: 'Rang va kompozitsiya' },
  { title: "Figma'dan kodga", text: 'Maketni sahifaga aylantirish' },
  { title: 'Portfolio', text: "Ishlaringizni ko'rsating" },
];

const STEPS = [
  { n: '01', title: "O'rganing", text: 'Qisqa va tushunarli dars matni, misollar bilan.' },
  { n: '02', title: 'Kod yozing', text: "Har bir darsdan keyin brauzerning o'zida mashq." },
  { n: '03', title: 'Tekshiring', text: "Natijangizni darhol ko'ring va xatolarni tuzating." },
  { n: '04', title: 'Fikr oling', text: "O'qituvchi ishingizni ko'rib, maslahat beradi." },
];

const QUALITIES: { title: string; text: string }[] = [
  { title: 'Loyiha asosida', text: "Nazariya emas, real sahifalar yasab o'rganasiz." },
  {
    title: 'Ketma-ket darslar',
    text: 'Har bir mavzu oldingisini mustahkamlagandan keyin ochiladi.',
  },
  { title: "O'qituvchi bilan", text: 'Topshiriqlaringiz tekshiriladi va izoh bilan qaytariladi.' },
  { title: 'Xavfsiz muhit', text: "Kodingiz faqat sizga ko'rinadi, natijalar shaffof." },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="qanday" className="container-page scroll-mt-24 py-20">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Qanday o&apos;qiladi</span>
          <h2 className="mt-3 text-title font-bold">To&apos;rt qadamda yangi ko&apos;nikma</h2>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="border-t-2 border-brand-600 pt-5 dark:border-brand-400">
              <span
                aria-hidden="true"
                className="font-mono text-sm font-semibold text-brand-700 dark:text-brand-300"
              >
                {s.n}
              </span>
              <h3 className="mt-2 text-heading font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="yonalishlar" className="scroll-mt-24 border-y border-line bg-canvas py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="section-eyebrow">Yo&apos;nalishlar</span>
              <h2 className="mt-3 text-title font-bold">Nimani o&apos;rganishni tanlang</h2>
            </div>
            <Link href="/register" className="btn btn-outline">
              Barcha kurslar <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTIONS.map((d) => (
              <li key={d.title} className="card p-5">
                <span className="block font-display text-lg font-semibold text-ink dark:text-white">
                  {d.title}
                </span>
                <span className="mt-1 block text-sm text-muted">{d.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="afzalliklar" className="container-page scroll-mt-24 py-20">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Afzalliklar</span>
          <h2 className="mt-3 text-title font-bold">Nega aynan WEBDIZAYN.UZ?</h2>
        </div>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {QUALITIES.map((q) => (
            <li key={q.title}>
              <h3 className="text-heading font-semibold">{q.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{q.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-panel bg-brand-700 px-6 py-12 text-white sm:px-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-title font-bold text-white">
                Birinchi darsingizni bugun boshlang
              </h2>
              <p className="mt-3 text-white">
                Ro&apos;yxatdan o&apos;ting va HTML asoslaridan boshlab bosqichma-bosqich
                o&apos;rganing.
              </p>
            </div>
            <Link
              href="/register"
              className="btn bg-white px-7 py-3 text-base text-brand-800 hover:bg-brand-50"
            >
              Bepul boshlash <Icon name="arrowRight" className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-line bg-canvas">
      <div className="container-page grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="section-eyebrow">O&apos;zbek tilidagi amaliy ta&apos;lim</span>
          <h1 className="mt-4 text-display font-bold">
            Web dizaynni <span className="text-brand-600 dark:text-brand-400">amalda</span>{' '}
            o&apos;rganing
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Darsni o&apos;qing, kod yozing, natijani tekshiring va o&apos;qituvchidan fikr oling.
            HTML&apos;dan to&apos;liq portfoliogacha bo&apos;lgan yo&apos;l bir joyda.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-primary px-7 py-3 text-base">
              Bepul boshlash <Icon name="arrowRight" className="size-5" />
            </Link>
            <Link href="/login" className="btn btn-outline px-7 py-3 text-base">
              Kirish
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted">
            Ketma-ket darslar · Har darsda mashq · O&apos;qituvchi tekshiruvi
          </p>
        </div>
        <HeroIllustration />
      </div>
    </section>
  );
}

/** Code editor + live preview mockup, drawn with HTML/CSS (no external images). */
function HeroIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-lg">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-accent-400" />
          <span className="size-3 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-white px-3 py-0.5 font-mono text-xs text-slate-500 dark:text-slate-400 dark:bg-slate-900">
            index.html
          </span>
        </div>
        <pre className="bg-ink p-5 font-mono text-[13px] leading-6 text-slate-300">
          <span className="text-slate-400">{'<!-- Birinchi sahifam -->'}</span>
          {'\n'}
          <span className="text-pink-400">{'<h1'}</span>
          <span className="text-accent-300">{' class'}</span>=
          <span className="text-emerald-300">{'"title"'}</span>
          <span className="text-pink-400">{'>'}</span>Salom, dunyo!
          <span className="text-pink-400">{'</h1>'}</span>
          {'\n'}
          <span className="text-pink-400">{'<p>'}</span>Men web dizayn{'\n'} o&apos;rganyapman
          <span className="text-pink-400">{'</p>'}</span>
          {'\n'}
          <span className="text-pink-400">{'<a'}</span>
          <span className="text-accent-300">{' href'}</span>=
          <span className="text-emerald-300">{'"#"'}</span>
          <span className="text-pink-400">{'>'}</span>Ishlarim
          <span className="text-pink-400">{'</a>'}</span>
        </pre>
        <div className="space-y-2 p-5">
          <div className="font-display text-2xl font-bold text-ink dark:text-white">
            Salom, dunyo!
          </div>
          <div className="h-2.5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-2.5 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 inline-block rounded-md bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            Ishlarim
          </div>
        </div>
      </div>
      <div className="card absolute -bottom-6 left-4 flex items-center gap-2.5 px-4 py-3 sm:-left-8">
        <Icon name="checkCircle" className="size-5 text-emerald-700 dark:text-emerald-400" />
        <span>
          <span className="block text-sm font-semibold text-ink dark:text-white">
            Tekshiruv o&apos;tdi
          </span>
          <span className="text-xs text-muted">3 / 3 talab bajarildi</span>
        </span>
      </div>
    </div>
  );
}
