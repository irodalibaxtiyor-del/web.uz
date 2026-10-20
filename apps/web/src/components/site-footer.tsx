import Link from 'next/link';
import { Logo } from './logo';

const COLUMNS = [
  {
    title: "Yo'nalishlar",
    links: [
      { href: '/yonalishlar/html', label: 'HTML' },
      { href: '/yonalishlar/css', label: 'CSS va bezash' },
      { href: '/yonalishlar/javascript', label: 'JavaScript' },
      { href: '/yonalishlar/moslashuvchan-dizayn', label: 'Moslashuvchan dizayn' },
      { href: '/yonalishlar', label: 'Barcha yo‘nalishlar' },
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
    <footer className="border-t border-line bg-canvas">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Web dizayn va web dasturlashni o&apos;zbek tilida, amaliy mashqlar va o&apos;qituvchi
            tekshiruvi bilan o&apos;rganish platformasi.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-base font-semibold">{col.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="inline-block py-1 text-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-center text-sm text-muted">
          © {new Date().getFullYear()} WEBDIZAYN.UZ. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
}
