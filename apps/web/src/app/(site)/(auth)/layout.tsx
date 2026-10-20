const POINTS = [
  'Har bir darsdan keyin amaliy mashq',
  'Natijani darhol tekshirish',
  "O'qituvchidan shaxsiy fikr",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-canvas py-10 sm:py-16">
      <div className="container-page">
        <div className="card mx-auto grid max-w-5xl overflow-hidden lg:grid-cols-2">
          <aside className="hidden bg-brand-700 p-12 text-white lg:block">
            <h2 className="text-title leading-tight font-bold text-white">
              Web dizayn olamiga xush kelibsiz
            </h2>
            <p className="mt-4 text-white">
              Bir akkaunt bilan barcha darslar, mashqlar va progressingiz bir joyda.
            </p>
            <ul className="mt-10 divide-y divide-white/25 border-y border-white/25">
              {POINTS.map((p) => (
                <li key={p} className="py-3.5">
                  {p}
                </li>
              ))}
            </ul>
          </aside>
          <div className="p-6 sm:p-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
