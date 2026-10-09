import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';

const DIRECTIONS: { icon: IconName; title: string; text: string; tone: string }[] = [
  {
    icon: 'html',
    title: 'HTML asoslari',
    text: 'Sahifa tuzilishi va teglar',
    tone: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  },
  {
    icon: 'css',
    title: 'CSS va bezash',
    text: 'Rang, shrift, joylashuv',
    tone: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300',
  },
  {
    icon: 'js',
    title: 'JavaScript',
    text: 'Interaktiv sahifalar',
    tone: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400',
  },
  {
    icon: 'grid',
    title: 'Flexbox va Grid',
    text: 'Zamonaviy maketlar',
    tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
  },
  {
    icon: 'phone',
    title: 'Moslashuvchan dizayn',
    text: 'Telefon va planshet uchun',
    tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  },
  {
    icon: 'palette',
    title: 'UI asoslari',
    text: 'Rang va kompozitsiya',
    tone: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
  },
  {
    icon: 'figma',
    title: "Figma'dan kodga",
    text: 'Maketni sahifaga aylantirish',
    tone: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
  },
  {
    icon: 'briefcase',
    title: 'Portfolio',
    text: "Ishlaringizni ko'rsating",
    tone: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  },
];

const STEPS = [
  { n: '01', title: "O'rganing", text: 'Qisqa va tushunarli dars matni, misollar bilan.' },
  { n: '02', title: 'Kod yozing', text: "Har bir darsdan keyin brauzerning o'zida mashq." },
  { n: '03', title: 'Tekshiring', text: "Natijangizni darhol ko'ring va xatolarni tuzating." },
  { n: '04', title: 'Fikr oling', text: "O'qituvchi ishingizni ko'rib, maslahat beradi." },
];

const QUALITIES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'code',
    title: 'Loyiha asosida',
    text: "Nazariya emas, real sahifalar yasab o'rganasiz.",
  },
  {
    icon: 'book',
    title: 'Ketma-ket darslar',
    text: 'Har bir mavzu oldingisini mustahkamlagandan keyin ochiladi.',
  },
  {
    icon: 'users',
    title: "O'qituvchi bilan",
    text: 'Topshiriqlaringiz tekshiriladi va izoh bilan qaytariladi.',
  },
  {
    icon: 'shield',
    title: 'Xavfsiz muhit',
    text: "Kodingiz faqat sizga ko'rinadi, natijalar shaffof.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="qanday" className="container-page scroll-mt-24 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Qanday o&apos;qiladi</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            To&apos;rt qadamda yangi ko&apos;nikma
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="card card-hover relative p-7">
              <span className="font-display text-5xl font-bold text-brand-100 dark:text-brand-900">
                {s.n}
              </span>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="yonalishlar" className="scroll-mt-24 bg-surface py-20 dark:bg-slate-900/50">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="section-eyebrow">Yo&apos;nalishlar</span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Nimani o&apos;rganishni{' '}
                <span className="text-brand-600 dark:text-brand-400">tanlang</span>
              </h2>
            </div>
            <Link href="/register" className="btn btn-outline">
              Barcha kurslar <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTIONS.map((d) => (
              <li key={d.title} className="card card-hover flex items-center gap-4 p-5">
                <span className={`grid size-14 shrink-0 place-items-center rounded-xl ${d.tone}`}>
                  <Icon name={d.icon} className="size-7" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-ink dark:text-white">
                    {d.title}
                  </span>
                  <span className="text-sm text-slate-500">{d.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="afzalliklar" className="container-page scroll-mt-24 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Afzalliklar</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Nega aynan WEBDIZAYN.UZ?</h2>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {QUALITIES.map((q) => (
            <li key={q.title} className="group text-center">
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-300">
                <Icon name={q.icon} className="size-9" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{q.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{q.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-14 text-white sm:px-14">
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-16 size-72 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-1/2 size-12 rounded-full border-[6px] border-accent-400"
          />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Birinchi darsingizni bugun boshlang
              </h2>
              <p className="mt-3 text-white/85">
                Ro&apos;yxatdan o&apos;ting va HTML asoslaridan boshlab bosqichma-bosqich
                o&apos;rganing.
              </p>
            </div>
            <Link href="/register" className="btn btn-accent px-7 py-3 text-base">
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
    <section className="relative overflow-hidden bg-surface dark:bg-slate-900/50">
      <div
        aria-hidden="true"
        className="dots-pattern absolute top-16 left-[-60px] size-48 opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-[-120px] size-[480px] rounded-full bg-brand-100/70 dark:bg-brand-950/60"
      />
      <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="section-eyebrow">O&apos;zbek tilidagi amaliy ta&apos;lim</span>
          <h1 className="mt-5 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            Web dizaynni{' '}
            <span className="relative whitespace-nowrap text-brand-600 dark:text-brand-400">
              amalda
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 w-full text-accent-400"
              >
                <path
                  d="M2 9c50-6 146-8 196-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            o&apos;rganing
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
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
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink dark:text-slate-200">
            {['Ketma-ket darslar', 'Har darsda mashq', "O'qituvchi tekshiruvi"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white">
                  <Icon name="check" className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
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
          <span className="ml-3 rounded-md bg-white px-3 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-900">
            index.html
          </span>
        </div>
        <pre className="bg-ink p-5 font-mono text-[13px] leading-6 text-slate-300">
          <span className="text-slate-500">{'<!-- Birinchi sahifam -->'}</span>
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
      <div className="card absolute -bottom-6 -left-6 flex items-center gap-3 px-4 py-3 sm:-left-10">
        <span className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white">
          <Icon name="check" className="size-6" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink dark:text-white">
            Tekshiruv o&apos;tdi
          </span>
          <span className="text-xs text-slate-500">3 / 3 talab bajarildi</span>
        </span>
      </div>
      <div className="card absolute -top-6 -right-4 w-44 px-4 py-3 sm:-right-8">
        <span className="text-xs text-slate-500">Kurs progressi</span>
        <span className="mt-1 block font-display text-xl font-bold text-ink dark:text-white">
          75%
        </span>
        <span className="mt-2 block h-2 rounded-full bg-slate-100 dark:bg-slate-800">
          <span className="block h-full w-3/4 rounded-full bg-accent-400" />
        </span>
      </div>
    </div>
  );
}
