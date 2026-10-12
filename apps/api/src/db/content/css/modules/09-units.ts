import { after, at, md, q, quiz, site, style, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY09 = {
  units: `<div class="karta">Kartochka (shrift 20px)</div>
<a class="tugma" href="#">Oddiy tugma</a>
<a class="tugma katta" href="#">Katta tugma</a>
<p class="matn">Uzun matn ustuni taxminan 65 belgidan oshmasligi kerak, aks holda ko‘z qatorni yo‘qotadi.</p>
<section class="ekran">To‘liq ekranli blok</section>`,
  math: `<div class="maket">
  <main class="asosiy">Asosiy qism</main>
  <aside class="yon">Yon panel (280px)</aside>
</div>
<div class="konteyner"><h1>Suyuq sarlavha</h1></div>`,
  variables: `<button class="tugma">Saqlash</button>
<section class="xavfli">
  <button class="tugma">O‘chirish</button>
</section>`,
  atProperty: `<div class="karta">Ustiga olib keling</div>`,
};

export const UNITS_CSS = `.karta {
  font-size: 20px;
  background-color: #f5faff;
}

.tugma {
  display: inline-block;
  background-color: #0071dc;
  color: white;
}

.tugma.katta {
  font-size: 1.25rem;
}`;

export const VARIABLES_CSS = `.tugma {
  padding: 8px 16px;
  border: 0;
  color: white;
  background-color: #0071dc;
  border-radius: 8px;
}`;

export const AT_PROPERTY_CSS = `.karta {
  --qadam: qizil;
  padding: var(--qadam);
  background: linear-gradient(var(--burchak), #0071dc, #fec400);
  color: white;
}`;

export const m09: ModuleDef = {
  title: 'Birliklar va funksiyalar',
  lessons: [
    {
      slug: 'units',
      title: 'O‘lchov birliklari',
      exercise: {
        title: 'To‘g‘ri birlikni tanlash',
        description: '`em`, `rem`, `ch` va `dvh`.',
        instructions: md(
          '1. `.karta`: `padding: 1em` (o‘z shriftidan — 20px), `margin-bottom: 1rem` (16px).',
          '2. `.tugma`: `padding: 0.5em 1em` — katta tugmaning paddingi o‘zi kattalashsin.',
          '3. `.matn`: `max-width: 65ch`.',
          '4. `.ekran`: `min-height: 100dvh`.',
        ),
        expectedBehavior:
          'Katta tugma proporsional kattaroq, matn ustuni tor, oxirgi blok ekran balandligida.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY09.units, UNITS_CSS),
        checks: [
          style('em', 'Kartochka paddingi 1em', '.karta', 'padding-top', '20px'),
          style('rem', 'Kartochka ostida 1rem', '.karta', 'margin-bottom', '16px'),
          style('btn', 'Katta tugma paddingi ham katta', '.tugma.katta', 'padding-left', '20px', {
            hint: '`em` elementning o‘z shriftidan hisoblanadi.',
          }),
          style('ch', 'Matn 65ch', '.matn', 'max-width', '65ch'),
          at(800, 600, style('dvh', 'Blok ekran balandligida', '.ekran', 'min-height', '600px')),
        ],
      },
    },
    {
      slug: 'math-functions',
      title: 'Matematik funksiyalar',
      exercise: {
        title: '`calc`, `min` va `clamp`',
        description: 'Birliklarni aralashtirish va chegaralangan o‘lchamlar.',
        instructions: md(
          '1. `.asosiy`: `width: calc(100% - 280px)`.',
          '2. `.konteyner`: `width: min(100% - 32px, 1100px)`, `margin: 0 auto`.',
          '3. `h1`: `font-size: clamp(1.75rem, 4vw + 1rem, 3rem)`.',
        ),
        expectedBehavior: 'Yon panel 280px, konteyner va sarlavha ekran o‘lchamiga moslashadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY09.math,
          `body {
  margin: 0;
}

.maket {
  display: flex;
}

.yon {
  width: 280px;
}`,
        ),
        checks: [
          at(1000, 700, style('calc', 'Asosiy qism 100% − 280px', '.asosiy', 'width', '720px')),
          at(
            400,
            700,
            style(
              'min-small',
              'Kichik ekranda konteyner chetlardan 16px',
              '.konteyner',
              'width',
              '368px',
            ),
          ),
          at(
            1400,
            700,
            style('min-big', 'Katta ekranda konteyner 1100px', '.konteyner', 'width', '1100px'),
          ),
          at(
            1400,
            700,
            style('clamp-max', 'Sarlavha 3rem dan oshmaydi', 'h1', 'font-size', '48px'),
          ),
          at(
            300,
            700,
            style('clamp-min', 'Sarlavha 1.75rem dan kichraymaydi', 'h1', 'font-size', '28px'),
          ),
        ],
      },
    },
    {
      slug: 'variables',
      title: 'CSS o‘zgaruvchilari',
      exercise: {
        title: 'Ranglarni o‘zgaruvchiga olish',
        description: '`:root` dagi o‘zgaruvchilar va ularni qayta e’lon qilish.',
        instructions: md(
          '1. `:root` da `--rang-asosiy: #0071dc` va `--radius: 8px` e’lon qiling.',
          '2. `.tugma` da: `background-color: var(--tugma-fon, var(--rang-asosiy))`, `border-radius: var(--radius)`.',
          '3. `.xavfli` ichida `--tugma-fon: crimson` — undagi tugma qizil bo‘lsin (tugma qoidasiga tegmasdan).',
        ),
        expectedBehavior: 'Oddiy tugma ko‘k, xavfli bo‘limdagi tugma qizil.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY09.variables, VARIABLES_CSS),
        checks: [
          style('root', '`--rang-asosiy` e’lon qilingan', 'html', '--rang-asosiy', '#0071dc'),
          style('radius-var', '`--radius` e’lon qilingan', 'html', '--radius', '8px'),
          style('btn', 'Oddiy tugma ko‘k', '.tugma', 'background-color', '#0071dc'),
          style('danger', 'Xavfli tugma qizil', '.xavfli .tugma', 'background-color', 'crimson', {
            hint: '`.xavfli { --tugma-fon: crimson; }`',
          }),
          style('danger-var', '`.xavfli` da `--tugma-fon`', '.xavfli', '--tugma-fon', 'crimson'),
        ],
      },
    },
    {
      slug: 'at-property',
      title: '`@property`',
      exercise: {
        title: 'Aylanadigan gradient',
        description: 'Turi aniq o‘zgaruvchilar: himoya va animatsiya.',
        instructions: md(
          '1. `@property --burchak`: `syntax: "<angle>"`, `inherits: false`, `initial-value: 0deg`.',
          '2. `@property --qadam`: `syntax: "<length>"`, `inherits: true`, `initial-value: 8px`. Shunda `.karta` dagi noto‘g‘ri `--qadam: qizil` maketni buzmaydi.',
          '3. `.karta`: `transition: --burchak 0.6s`, hover’da `--burchak: 180deg`.',
        ),
        expectedBehavior: 'Kartochkada 8px padding, hover’da gradient silliq aylanadi.',
        difficulty: 'HARD',
        starterFiles: site(BODY09.atProperty, AT_PROPERTY_CSS),
        checks: [
          style('initial', '`--burchak` boshlang‘ich qiymati 0deg', '.karta', '--burchak', '0deg'),
          style('guard', 'Noto‘g‘ri `--qadam` o‘rniga 8px', '.karta', 'padding-top', '8px', {
            hint: 'Ro‘yxatdan o‘tgan o‘zgaruvchi noto‘g‘ri qiymatni `initial-value` bilan almashtiradi.',
          }),
          style(
            'transition',
            '`--burchak` animatsiya qilinadi',
            '.karta',
            'transition-property',
            '--burchak',
          ),
          after(
            [
              { type: 'hover', selector: '.karta' },
              { type: 'wait', ms: 900 },
            ],
            style('hover', 'Hover’da 180deg', '.karta', '--burchak', '180deg'),
          ),
        ],
      },
      quiz: quiz('9-modul testi: Birliklar va funksiyalar', [
        q(
          'q1',
          '`font-size: 20px` bo‘lgan elementda `padding: 1em` necha piksel?',
          ['20px', '16px', '10px', '1px'],
          [0],
        ),
        q(
          'q2',
          '`calc()` ichida qaysi yozuv to‘g‘ri?',
          ['`calc(100% - 20px)`', '`calc(100%-20px)`', '`calc(100% -20px)`', '`calc[100% - 20px]`'],
          [0],
        ),
        q(
          'q3',
          '`clamp(1rem, 4vw, 2rem)` qanday ishlaydi?',
          ['Qiymat 1rem va 2rem orasida qoladi', 'Doim 4vw', 'Doim 2rem', 'Eng kichigini tanlaydi'],
          [0],
        ),
        q(
          'q4',
          'CSS o‘zgaruvchisi haqida qaysilari to‘g‘ri?',
          [
            'Nomi `--` bilan boshlanadi',
            'Meros bo‘ladi',
            'Faqat `:root` da e’lon qilinadi',
            'Qiymati `$nom` bilan olinadi',
          ],
          [0, 1],
        ),
        q(
          'q5',
          'Gradient burchagini silliq animatsiya qilish uchun nima kerak?',
          [
            'O‘zgaruvchini `@property` bilan turini ko‘rsatib ro‘yxatdan o‘tkazish',
            '`!important`',
            '`opacity`',
            'Hech narsa — gradient o‘zi animatsiya bo‘ladi',
          ],
          [0],
        ),
      ]),
    },
  ],
};
