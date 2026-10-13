import { Icon } from '@/components/icons';

const POINTS = [
  'Har bir darsdan keyin amaliy mashq',
  'Natijani darhol tekshirish',
  "O'qituvchidan shaxsiy fikr",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-surface py-12 sm:py-20 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="dots-pattern absolute top-10 right-10 size-40 opacity-70"
      />
      <div className="container-page relative">
        <div className="card mx-auto grid max-w-5xl overflow-hidden lg:grid-cols-2">
          <aside className="relative hidden overflow-hidden bg-brand-600 p-12 text-white lg:block">
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-20 size-72 rounded-full bg-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-10 left-10 size-14 rounded-full border-[6px] border-accent-400"
            />
            <div className="relative">
              <h2 className="text-3xl leading-tight font-bold text-white">
                Web dizayn olamiga xush kelibsiz
              </h2>
              <p className="mt-4 text-white">
                Bir akkaunt bilan barcha darslar, mashqlar va progressingiz bir joyda.
              </p>
              <ul className="mt-10 space-y-4">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-white/15">
                      <Icon name="check" className="size-4" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="p-8 sm:p-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
