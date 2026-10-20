import type { ProjectFile } from '@webdizayn/shared';
import { md, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const STACKS = `<article class="maqola">
  <h1>Kod yozish madaniyati</h1>
  <p>Funksiya nomi nima qilishini aytsin: <code>hisoblaSumma()</code>.</p>
  <blockquote class="iqtibos">Kod kompyuter uchun emas, odam uchun yoziladi.</blockquote>
</article>`;

const STACKS_CSS = `${RESET}

body {
  font-family: "Comic Sans MS";
}

.maqola {
  padding: 24px;
}`;

const SCALE = `<article class="maqola">
  <h1>Sarlavha</h1>
  <h2>Kichik sarlavha</h2>
  <h3>Bo‘lim</h3>
  <p>Oddiy matn. <small>Izoh matni</small></p>
</article>`;

const SCALE_CSS = `${RESET}

h1 {
  font-size: 37px;
}

h2 {
  font-size: 29px;
}

h3 {
  font-size: 21px;
}

small {
  font-size: 13px;
}`;

const RHYTHM = `<article class="maqola">
  <p class="yorliq">Yangilik</p>
  <h1>Toshkentda yangi IT-park ochildi</h1>
  <p>Park yosh dasturchilar uchun bepul ish joylari va o‘quv xonalarini taklif qiladi. Birinchi guruh qabuli kelasi oyda boshlanadi.</p>
</article>`;

const RHYTHM_CSS = `${RESET}

body {
  line-height: 1.1;
}

h1 {
  font-size: 40px;
  line-height: 1.6;
}

.yorliq {
  font-size: 12px;
  font-weight: 700;
}`;

const CARD = `<article class="mahsulot">
  <p class="toifa">Kitob</p>
  <h2 class="nomi">O‘tkan kunlar</h2>
  <p class="meta">Abdulla Qodiriy · 1926</p>
  <p class="narx">45 000 so‘m</p>
</article>`;

const CARD_CSS = `${RESET}

.mahsulot {
  max-width: 320px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.mahsulot > * {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 400;
  color: #0f172a;
}`;

const FONT = `<header class="banner">
  <h1>Kitoblar do‘koni</h1>
  <p class="matn">Har kuni yangi kitoblar.</p>
</header>`;

const FONT_CSS = `${RESET}

.banner {
  padding: 32px 16px;
}`;

export const m02: ModuleDef = {
  title: 'Tipografiya',
  lessons: [
    {
      slug: 'shrift-oilalari',
      title: 'Shrift oilalari va zaxira ro‘yxati',
      exercise: {
        title: 'To‘g‘ri shrift stack’lari',
        description: 'Tizim shrifti, monospace va serif zaxiralar bilan.',
        instructions: md(
          '1. `body`: `font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.',
          '2. `code`: `font-family: ui-monospace, "Cascadia Code", Consolas, monospace`.',
          '3. `.iqtibos`: `font-family: Georgia, "Times New Roman", serif`, `font-style: italic`.',
        ),
        expectedBehavior:
          'Matn tizim shriftida, kod teng kenglikdagi shriftda, iqtibos serifli kursivda.',
        difficulty: 'EASY',
        starterFiles: site(STACKS, STACKS_CSS),
        checks: [
          style(
            'body',
            'Asosiy matn — tizim shrifti',
            'body',
            'font-family',
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          ),
          style(
            'code',
            'Kod — monospace',
            'code',
            'font-family',
            'ui-monospace, "Cascadia Code", Consolas, monospace',
          ),
          style(
            'quote',
            'Iqtibos — serif',
            '.iqtibos',
            'font-family',
            'Georgia, "Times New Roman", serif',
          ),
          style('italic', 'Iqtibos kursivda', '.iqtibos', 'font-style', 'italic'),
        ],
      },
    },
    {
      slug: 'shkala',
      title: 'Tipografik shkala',
      exercise: {
        title: 'Tasodifiy o‘lchamlardan shkalaga',
        description: 'O‘lchamlar tokenlar orqali.',
        instructions: md(
          '1. `:root` da shkala: `--t-sm: 0.875rem`, `--t-base: 1rem`, `--t-xl: 1.5rem`, `--t-2xl: 2rem`, `--t-3xl: 2.5rem`.',
          '2. `h1` — `var(--t-3xl)`, `h2` — `var(--t-2xl)`, `h3` — `var(--t-xl)`, `small` — `var(--t-sm)`.',
        ),
        expectedBehavior: 'Sarlavhalar 40, 32, 24 piksel, izoh 14 piksel — bir tizimga bo‘ysunadi.',
        difficulty: 'EASY',
        starterFiles: site(SCALE, SCALE_CSS),
        checks: [
          style('token', 'Shkala tokeni bor', ':root', '--t-3xl', '2.5rem'),
          style('h1', 'h1 — 40px', 'h1', 'font-size', '40px'),
          style('h2', 'h2 — 32px', 'h2', 'font-size', '32px'),
          style('h3', 'h3 — 24px', 'h3', 'font-size', '24px'),
          style('small', 'Izoh — 14px', 'small', 'font-size', '14px'),
        ],
      },
    },
    {
      slug: 'qator-oraligi',
      title: 'Qator balandligi va harf oralig‘i',
      exercise: {
        title: 'O‘qishga qulay ritm',
        description: '`line-height`, `letter-spacing` va bosh harfli yorliq.',
        instructions: md(
          '1. `body`: `line-height: 1.6`.',
          '2. `h1`: `line-height: 1.15`, `letter-spacing: -0.01em`.',
          '3. `.yorliq`: `text-transform: uppercase`, `letter-spacing: 0.06em`.',
        ),
        expectedBehavior:
          'Matn qatorlari havodor, sarlavha ixcham, yorliq bosh harflarda va siyrak.',
        difficulty: 'EASY',
        starterFiles: site(RHYTHM, RHYTHM_CSS),
        checks: [
          style('body', 'Matn qator balandligi 1.6', 'p:not(.yorliq)', 'line-height', '25.6px'),
          style('h1', 'Sarlavha qator balandligi 1.15', 'h1', 'line-height', '46px'),
          style('upper', 'Yorliq bosh harflarda', '.yorliq', 'text-transform', 'uppercase'),
          style('spacing', 'Yorliq harflari siyrak', '.yorliq', 'letter-spacing', '0.72px'),
        ],
      },
    },
    {
      slug: 'matn-ierarxiyasi',
      title: 'Matn ierarxiyasi',
      exercise: {
        title: 'Muhimini ajratish',
        description: 'O‘lcham, qalinlik va rang bilan darajalar.',
        instructions: md(
          '1. `.nomi`: `font-size: 1.25rem`, `font-weight: 600`.',
          '2. `.toifa`: `font-size: 0.75rem`, `font-weight: 600`, `text-transform: uppercase`, `color: #005bb5`.',
          '3. `.meta`: `font-size: 0.875rem`, `color: #64748b`.',
          '4. `.narx`: `font-size: 1.25rem`, `font-weight: 700`.',
        ),
        expectedBehavior:
          'Nom va narx birinchi ko‘zga tashlanadi, muallif va yil ikkinchi darajada.',
        difficulty: 'EASY',
        starterFiles: site(CARD, CARD_CSS),
        checks: [
          style('title', 'Nom qalin (600)', '.nomi', 'font-weight', '600'),
          style('title-size', 'Nom 20px', '.nomi', 'font-size', '20px'),
          style('meta', 'Meta xira rangda', '.meta', 'color', '#64748b'),
          style('price', 'Narx eng qalin', '.narx', 'font-weight', '700'),
          style('kicker', 'Toifa kichik va rangli', '.toifa', 'color', '#005bb5', { hidden: true }),
        ],
      },
    },
    {
      slug: 'font-face',
      title: 'Veb-shriftlar va @font-face',
      exercise: {
        title: 'O‘z shrift nomingiz',
        description: '`@font-face`, `font-display` va zaxira.',
        instructions: md(
          '1. `@font-face` yozing: `font-family: "Sarlavha"`, `src: local("Georgia"), local("Times New Roman")`, `font-weight: 700`, `font-display: swap`.',
          '2. `h1`: `font-family: "Sarlavha", Georgia, serif`, `font-weight: 700`.',
          '3. `.matn`: `font-family: system-ui, sans-serif`.',
        ),
        expectedBehavior:
          'Sarlavha “Sarlavha” nomli shrift bilan (yuklanmasa — zaxira serif), matn tizim shriftida.',
        difficulty: 'MEDIUM',
        starterFiles: site(FONT, FONT_CSS),
        checks: [
          style(
            'h1',
            'Sarlavha o‘z shriftida, zaxira bilan',
            'h1',
            'font-family',
            '"Sarlavha", Georgia, serif',
          ),
          style('weight', 'Sarlavha qalin', 'h1', 'font-weight', '700'),
          style('body', 'Matn tizim shriftida', '.matn', 'font-family', 'system-ui, sans-serif'),
        ],
      },
      quiz: quiz('2-modul testi: Tipografiya', [
        q(
          'u2-stack',
          'Nega `font-family` da bir nechta shrift va oxirida umumiy oila yoziladi?',
          [
            'Birinchi shrift bo‘lmasa, keyingisi ishlatiladi; oxirida har doim mavjud umumiy oila',
            'Brauzer hammasini aralashtiradi',
            'Faqat bitta shrift yozish taqiqlangan',
            'Sahifa tezroq yuklanadi',
          ],
          [0],
        ),
        q(
          'u2-scale',
          'Tipografik shkalaning afzalligi?',
          [
            'O‘lchamlar tasodifiy emas, bir-biriga mutanosib va izchil',
            'Sahifada faqat bitta o‘lcham bo‘ladi',
            'Shrift avtomatik yuklanadi',
            'Media so‘rovlar kerak bo‘lmaydi',
          ],
          [0],
        ),
        q(
          'u2-lh',
          'Oddiy matn uchun qanday `line-height` odatda qulay?',
          ['1.5–1.7', '0.8', '3', '`line-height` kerak emas'],
          [0],
        ),
        q(
          'u2-caps',
          'Bosh harfli kichik yorliqlarda nima qilinadi?',
          [
            '`letter-spacing` biroz oshiriladi',
            '`letter-spacing` manfiy qilinadi',
            'Shrift ingichkalashtiriladi',
            '`line-height: 0`',
          ],
          [0],
        ),
        q(
          'u2-swap',
          '`font-display: swap` nima qiladi? (bir nechta javob)',
          [
            'Shrift yuklanguncha matn zaxira shriftda ko‘rinadi',
            'Yuklangach, matn yangi shriftga almashadi',
            'Matn shrift yuklanmaguncha butunlay yashirinadi',
            'Shrift faylini siqadi',
          ],
          [0, 1],
        ),
      ]),
    },
  ],
};

export const s02: Record<string, ProjectFile[]> = {
  'shrift-oilalari': site(
    STACKS,
    `${STACKS_CSS.replace('font-family: "Comic Sans MS";', 'font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;')}

code {
  font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
}

.iqtibos {
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
}`,
  ),
  shkala: site(
    SCALE,
    `${RESET}

:root {
  --t-sm: 0.875rem;
  --t-base: 1rem;
  --t-xl: 1.5rem;
  --t-2xl: 2rem;
  --t-3xl: 2.5rem;
}

h1 {
  font-size: var(--t-3xl);
}

h2 {
  font-size: var(--t-2xl);
}

h3 {
  font-size: var(--t-xl);
}

small {
  font-size: var(--t-sm);
}`,
  ),
  'qator-oraligi': site(
    RHYTHM,
    `${RESET}

body {
  line-height: 1.6;
}

h1 {
  font-size: 40px;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.yorliq {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}`,
  ),
  'matn-ierarxiyasi': site(
    CARD,
    `${CARD_CSS}

.nomi {
  font-size: 1.25rem;
  font-weight: 600;
}

.toifa {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #005bb5;
}

.meta {
  font-size: 0.875rem;
  color: #64748b;
}

.narx {
  font-size: 1.25rem;
  font-weight: 700;
}`,
  ),
  'font-face': site(
    FONT,
    `@font-face {
  font-family: "Sarlavha";
  src: local("Georgia"), local("Times New Roman");
  font-weight: 700;
  font-display: swap;
}

${FONT_CSS}

h1 {
  font-family: "Sarlavha", Georgia, serif;
  font-weight: 700;
}

.matn {
  font-family: system-ui, sans-serif;
}`,
  ),
};
