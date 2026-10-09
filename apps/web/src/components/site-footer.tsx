import Link from 'next/link';
import { Logo } from './logo';

const COLUMNS = [
  {
    title: "Yo'nalishlar",
    links: [
      { href: '/#yonalishlar', label: 'HTML asoslari' },
      { href: '/#yonalishlar', label: 'CSS va dizayn' },
      { href: '/#yonalishlar', label: 'JavaScript' },
      { href: '/#yonalishlar', label: 'Moslashuvchan sayt' },
    ],
  },
  {
    title: 'Platforma',
    links: [
      { href: '/#qanday', label: "Qanday o'qiladi" },
      { href: '/#afzalliklar', label: 'Afzalliklar' },
      { href: '/register', label: "Ro'yxatdan o'tish" },
      { href: '/login', label: 'Kirish' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-surface dark:bg-slate-900">
      <div
        aria-hidden="true"
        className="dots-pattern absolute -top-10 -right-10 size-56 rounded-full opacity-60"
      />
      <div className="container-page relative grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Web dizayn va web dasturlashni o&apos;zbek tilida, amaliy mashqlar va o&apos;qituvchi
            tekshiruvi bilan o&apos;rganish platformasi.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-lg font-semibold">{col.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <p className="container-page py-5 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} WEBDIZAYN.UZ. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
}
