import type { ProjectFile } from '@webdizayn/shared';
import { md, pic, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const STATES = `<section class="holatlar">
  <div class="panel">
    <h2>Yuklanmoqda</h2>
    <div class="skeleton sarlavha-sk"></div>
    <div class="skeleton qator-sk"></div>
  </div>
  <div class="panel bosh-holat">
    <h2>Hali vazifa yo‘q</h2>
    <p>Birinchi vazifani qo‘shing — u shu yerda ko‘rinadi.</p>
    <button type="button">Vazifa qo‘shish</button>
  </div>
  <div class="panel xato-holat" role="alert">
    <h2>Ma’lumotni yuklab bo‘lmadi</h2>
    <p>Internet aloqasini tekshirib, qayta urinib ko‘ring.</p>
    <button type="button">Qayta urinish</button>
  </div>
</section>`;

const STATES_CSS = `${RESET}

.holatlar {
  display: grid;
  gap: 16px;
  max-width: 480px;
  padding: 24px;
}

.panel {
  padding: 20px;
  border-radius: 12px;
}

.sarlavha-sk {
  width: 60%;
  height: 20px;
}

.qator-sk {
  height: 14px;
  margin-top: 12px;
}`;

const SYSTEM = `<article class="karta">
  <h2>Premium obuna</h2>
  <p>Barcha kurslar va o‘qituvchi bilan suhbat.</p>
  <button type="button" class="tugma">Obuna bo‘lish</button>
</article>`;

const SYSTEM_CSS = `${RESET}

body {
  padding: 24px;
}

.karta {
  display: grid;
  gap: 16px;
  max-width: 380px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.karta h2,
.karta p {
  margin: 0;
}

.tugma {
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  color: white;
  background-color: #0071dc;
}`;

const PROFILE = `<main class="profil">
  <header class="profil-bosh">
    ${pic('0b3f76', 'Malika Tursunova', 120, 120, ' class="avatar"')}
    <div>
      <h1 class="ism">Malika Tursunova</h1>
      <p class="kasb">Frontend dasturchi · Toshkent</p>
    </div>
  </header>
  <ul class="statistika">
    <li><span class="son">24</span> loyiha</li>
    <li><span class="son">1 280</span> soat</li>
    <li><span class="son">4.9</span> reyting</li>
  </ul>
  <a class="tugma" href="#">Bog‘lanish</a>
</main>`;

const PROFILE_CSS = `${RESET}

body {
  background-color: #f1f5f9;
}

.profil {
  max-width: 420px;
  margin: 24px auto;
  padding: 24px;
}

.profil-bosh {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 72px;
  height: 72px;
}

.ism,
.kasb {
  margin: 0;
}

.statistika {
  display: flex;
  justify-content: space-between;
  padding: 0;
  list-style: none;
}

.tugma {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 44px;
}`;

export const m06: ModuleDef = {
  title: 'Holatlar va dizayn tizimi',
  lessons: [
    {
      slug: 'holatlar',
      title: 'Bo‘sh, yuklanish va xato holatlari',
      exercise: {
        title: 'Uch holat — uch ko‘rinish',
        description: 'Skelet, bo‘sh holat va xato paneli.',
        instructions: md(
          '1. `.skeleton`: `background-color: #e2e8f0`, `border-radius: 6px`, `animation: pulse 1.4s ease-in-out infinite`; `@keyframes pulse` — `50%` da `opacity: 0.45`.',
          '2. `.bosh-holat`: `text-align: center`, `border: 1px dashed #cbd5e1`.',
          '3. `.xato-holat`: `background-color: #fef2f2`, `border-left: 4px solid #b91c1c`.',
          '4. `@media (prefers-reduced-motion: reduce)` ichida `.skeleton` animatsiyasini o‘chiring (`animation: none`).',
        ),
        expectedBehavior:
          'Yuklanishda “miltillovchi” bo‘sh qutilar, bo‘sh holatda yo‘l ko‘rsatuvchi matn va tugma, xatoda qizil panel.',
        difficulty: 'MEDIUM',
        starterFiles: site(STATES, STATES_CSS),
        checks: [
          style('sk-bg', 'Skelet kulrang', '.skeleton', 'background-color', '#e2e8f0'),
          style('sk-anim', 'Skelet animatsiyasi', '.skeleton', 'animation-name', 'pulse'),
          style(
            'empty',
            'Bo‘sh holat chizilgan chegarada',
            '.bosh-holat',
            'border-top-style',
            'dashed',
          ),
          style('empty-center', 'Bo‘sh holat markazda', '.bosh-holat', 'text-align', 'center'),
          style(
            'error',
            'Xato paneli qizil chiziqli',
            '.xato-holat',
            'border-left-color',
            '#b91c1c',
          ),
        ],
      },
    },
    {
      slug: 'dizayn-tizimi',
      title: 'Mini dizayn tizimi',
      exercise: {
        title: 'Qiymatlardan tokenlarga',
        description: 'Rang, oraliq va radius tokenlari bilan komponent.',
        instructions: md(
          '1. `:root` da: `--rang-urg: #0071dc`, `--rang-chegara: #e2e8f0`, `--s-4: 16px`, `--s-6: 24px`, `--r-sm: 8px`, `--r-md: 12px`.',
          '2. `.karta` va `.tugma` dagi barcha shu qiymatlarni tokenlar bilan almashtiring (`gap`, `padding`, `border`, `border-radius`, fon).',
          '3. Keyin `--rang-urg` ni `#047857` (yashil) ga o‘zgartiring — tugma rangi faqat shu qatordan o‘zgarishiga ishonch hosil qiling.',
        ),
        expectedBehavior:
          'Komponent tashqi ko‘rinishi o‘zgarmaydi, lekin barcha qiymatlar tokenlardan; urg‘u rangi yashil.',
        difficulty: 'MEDIUM',
        starterFiles: site(SYSTEM, SYSTEM_CSS),
        checks: [
          style('token', 'Urg‘u tokeni yashil', ':root', '--rang-urg', '#047857'),
          style('radius-token', 'Radius tokeni', ':root', '--r-md', '12px'),
          style('button', 'Tugma tokendagi rangda', '.tugma', 'background-color', '#047857'),
          style('pad', 'Karta oralig‘i tokendan', '.karta', 'padding-top', '24px'),
          style('radius', 'Tugma radiusi tokendan', '.tugma', 'border-top-left-radius', '8px'),
        ],
      },
    },
    {
      slug: 'yakuniy',
      title: 'Yakuniy ish: profil kartasi',
      exercise: {
        title: 'Profil kartasini bezash',
        description: 'Kursda o‘rganilganlarni bitta komponentda qo‘llash.',
        instructions: md(
          '1. `.profil`: fon `white`, `border: 1px solid #e2e8f0`, `border-radius: 16px`.',
          '2. `.avatar`: `border-radius: 50%`, `object-fit: cover`, `box-shadow: 0 0 0 3px white, 0 0 0 5px #0071dc`.',
          '3. `.ism`: `font-size: 1.5rem`, `font-weight: 700`; `.kasb`: `color: #475569`.',
          '4. `.son`: `display: block`, `font-size: 1.25rem`, `font-weight: 700`, `font-variant-numeric: tabular-nums`.',
          '5. `.tugma`: fon `#0071dc`, matn `white`, `border-radius: 8px`, `font-weight: 600`, `text-decoration: none`.',
        ),
        expectedBehavior:
          'Toza profil kartasi: halqali avatar, aniq ierarxiya, tekis raqamlar va bitta asosiy tugma.',
        difficulty: 'MEDIUM',
        starterFiles: site(PROFILE, PROFILE_CSS),
        checks: [
          style('card', 'Karta oq va yumaloq', '.profil', 'border-top-left-radius', '16px'),
          style(
            'avatar',
            'Avatar halqali',
            '.avatar',
            'box-shadow',
            '0 0 0 3px white, 0 0 0 5px #0071dc',
          ),
          style('name', 'Ism qalin', '.ism', 'font-weight', '700'),
          style('stats', 'Raqamlar tekis', '.son', 'font-variant-numeric', 'tabular-nums'),
          style('cta', 'Bitta asosiy tugma', '.tugma', 'background-color', '#0071dc'),
        ],
      },
      quiz: quiz('6-modul testi: Holatlar va dizayn tizimi', [
        q(
          'u6-empty',
          'Yaxshi bo‘sh holat (empty state) nimani o‘z ichiga oladi?',
          [
            'Nima uchun bo‘sh ekanini va keyingi qadamni (tugma)',
            'Faqat “Ma’lumot yo‘q” yozuvi',
            'Bo‘sh oq maydon',
            'Xato kodi',
          ],
          [0],
        ),
        q(
          'u6-skeleton',
          'Skelet (skeleton) spinnerdan nimasi bilan yaxshi?',
          [
            'Kontent qanday joylashishini oldindan ko‘rsatadi va yuklanish tezroq tuyuladi',
            'U sahifani tezroq yuklaydi',
            'Unga JavaScript kerak emas — boshqa farqi yo‘q',
            'U faqat rasmlar uchun',
          ],
          [0],
        ),
        q(
          'u6-motion',
          '`prefers-reduced-motion: reduce` bo‘lsa nima qilish kerak?',
          [
            'Miltillash va harakatlanuvchi animatsiyalarni o‘chirish yoki kamaytirish',
            'Animatsiyani tezlashtirish',
            'Sahifani yashirish',
            'Hech narsa',
          ],
          [0],
        ),
        q(
          'u6-system',
          'Dizayn tizimining tarkibi? (bir nechta javob)',
          [
            'Tokenlar (rang, oraliq, shrift, radius)',
            'Qayta ishlatiladigan komponentlar',
            'Foydalanish qoidalari va misollar',
            'Har sahifa uchun alohida CSS fayli',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s06: Record<string, ProjectFile[]> = {
  holatlar: site(
    STATES,
    `${STATES_CSS}

.skeleton {
  background-color: #e2e8f0;
  border-radius: 6px;
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.45;
  }
}

.bosh-holat {
  text-align: center;
  border: 1px dashed #cbd5e1;
}

.xato-holat {
  background-color: #fef2f2;
  border-left: 4px solid #b91c1c;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}`,
  ),
  'dizayn-tizimi': site(
    SYSTEM,
    `${RESET}

:root {
  --rang-urg: #047857;
  --rang-chegara: #e2e8f0;
  --s-4: 16px;
  --s-6: 24px;
  --r-sm: 8px;
  --r-md: 12px;
}

body {
  padding: var(--s-6);
}

.karta {
  display: grid;
  gap: var(--s-4);
  max-width: 380px;
  padding: var(--s-6);
  border: 1px solid var(--rang-chegara);
  border-radius: var(--r-md);
}

.karta h2,
.karta p {
  margin: 0;
}

.tugma {
  min-height: 44px;
  border: 0;
  border-radius: var(--r-sm);
  font: inherit;
  font-weight: 600;
  color: white;
  background-color: var(--rang-urg);
}`,
  ),
  yakuniy: site(
    PROFILE,
    `${PROFILE_CSS}

.profil {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 3px white, 0 0 0 5px #0071dc;
}

.ism {
  font-size: 1.5rem;
  font-weight: 700;
}

.kasb {
  color: #475569;
}

.son {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.tugma {
  background-color: #0071dc;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
}`,
  ),
};
