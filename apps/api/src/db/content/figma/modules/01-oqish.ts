import type { ProjectFile } from '@webdizayn/shared';
import { md, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const FRAME = `<main class="freym">
  <h1>Xush kelibsiz, Aziz</h1>
  <p class="izoh">Bugun 3 ta dars rejalashtirilgan.</p>
</main>`;

const FRAME_CSS = `${RESET}

.freym {
  /* Maketdagi Mobile/Home freymi shu yerga */
}`;

const CARD = `<article class="karta">
  <h2>Ingliz tili</h2>
  <p>Keyingi dars: ertaga, 18:00</p>
</article>`;

const CARD_CSS = `${RESET}

body {
  padding: 24px;
  background-color: #f8fafc;
}

.karta h2,
.karta p {
  margin: 0;
}`;

const REM = `<section class="blok">
  <h2>Kurs haqida</h2>
  <p>Kurs 8 haftadan iborat.</p>
  <p class="izoh">Narx QQS bilan.</p>
</section>`;

const REM_CSS = `${RESET}

/* Maketdagi qiymatlar pikselda: h2 28px, matn 16px, izoh 14px, blok chetlari 24px */`;

const COLORS = `<article class="kurs">
  <span class="belgi">Yangi</span>
  <h2 class="nomi">Figma’dan kodga</h2>
  <p class="meta">24 dars · 6 modul</p>
</article>`;

const COLORS_CSS = `${RESET}

.kurs {
  padding: 24px;
}

.belgi {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
}

.nomi,
.meta {
  margin: 8px 0 0;
}`;

export const m01: ModuleDef = {
  title: 'Maketni o‘qish',
  lessons: [
    {
      slug: 'figma-interfeysi',
      title: 'Figma interfeysi: freym, qatlam, uslub',
      exercise: {
        title: 'Freymni sahifaga ko‘chirish',
        description: 'Maketdagi freym, matn qatlamlari va ularning xususiyatlari.',
        instructions: md(
          '**Maket spetsifikatsiyasi**',
          '- Freym `Mobile/Home`: 375 × 812, Fill `#F8FAFC`, Padding: tepa 48, chap/o‘ng 24.',
          '- Matn “Xush kelibsiz, Aziz”: Bold 28/36, rang `#0F172A`; ostida 8px oraliq.',
          '- Matn “Bugun 3 ta dars…”: Regular 16/24, rang `#475569`.',
          '',
          'Yozing: `.freym` — `max-width: 375px`, `min-height: 812px`, `padding: 48px 24px 0`, `background-color: #f8fafc`; `h1` — `margin: 0 0 8px`, `font-size: 28px`, `line-height: 36px`, `font-weight: 700`, `color: #0f172a`; `.izoh` — `margin: 0`, `line-height: 24px`, `color: #475569`.',
        ),
        expectedBehavior:
          'Sahifa maketdagi freym bilan bir xil: fon, chetlar, sarlavha va izoh o‘lchamlari mos.',
        difficulty: 'EASY',
        starterFiles: site(FRAME, FRAME_CSS),
        checks: [
          style('bg', 'Freym foni', '.freym', 'background-color', '#f8fafc'),
          style('pad-top', 'Tepadan 48px', '.freym', 'padding-top', '48px'),
          style('pad-left', 'Chetlardan 24px', '.freym', 'padding-left', '24px'),
          style('lh', 'Sarlavha 28/36', 'h1', 'line-height', '36px'),
          style('gap', 'Sarlavhadan keyin 8px', 'h1', 'margin-bottom', '8px'),
        ],
      },
    },
    {
      slug: 'inspect',
      title: 'Inspect va Dev Mode: qiymatlarni o‘qish',
      exercise: {
        title: 'Kartani Inspect bo‘yicha yasash',
        description: 'O‘lcham, padding, radius, stroke va soya.',
        instructions: md(
          '**Inspect paneli (`Card/Lesson`)**',
          '- W 327 (Fixed) · H Hug · Padding 16 · Gap 4',
          '- Fill `#FFFFFF` · Stroke 1 Inside `#E2E8F0` · Radius 12',
          '- Drop shadow: X 0, Y 4, Blur 12, Spread 0, `#0F172A` 8%',
          '',
          'Yozing: `.karta` — `display: grid`, `gap: 4px`, `width: 327px`, `padding: 16px`, fon `white`, `border: 1px solid #e2e8f0`, `border-radius: 12px`, `box-shadow: 0 4px 12px 0 rgb(15 23 42 / 0.08)`.',
        ),
        expectedBehavior: 'Karta maketdagi kabi: 327px kenglik, ingichka chegara, yumshoq soya.',
        difficulty: 'EASY',
        starterFiles: site(CARD, CARD_CSS),
        checks: [
          style('w', 'Kenglik 327px', '.karta', 'width', '327px'),
          style('pad', 'Padding 16', '.karta', 'padding-top', '16px'),
          style('radius', 'Radius 12', '.karta', 'border-top-left-radius', '12px'),
          style('stroke', 'Stroke 1 #E2E8F0', '.karta', 'border-top-color', '#e2e8f0'),
          style(
            'shadow',
            'Soya maketdagidek',
            '.karta',
            'box-shadow',
            '0 4px 12px 0 rgb(15 23 42 / 0.08)',
          ),
        ],
      },
    },
    {
      slug: 'px-rem',
      title: 'Piksellardan rem’ga',
      exercise: {
        title: 'Maket o‘lchamlarini rem’da yozish',
        description: 'px ÷ 16 = rem; tokenlarda saqlash.',
        instructions: md(
          '1. `:root` da: `--t-h2: 1.75rem` (28px), `--t-matn: 1rem`, `--t-izoh: 0.875rem` (14px), `--s-6: 1.5rem` (24px).',
          '2. `h2` — `font-size: var(--t-h2)`; `p` — `var(--t-matn)`; `.izoh` — `var(--t-izoh)`.',
          '3. `.blok` — `padding: var(--s-6)`.',
        ),
        expectedBehavior:
          'Brauzerda o‘lchamlar maketdagidek (28/16/14/24 px), lekin foydalanuvchi shriftni kattalashtirsa birga kattalashadi.',
        difficulty: 'EASY',
        starterFiles: site(REM, REM_CSS),
        checks: [
          style('token', 'h2 tokeni rem’da', ':root', '--t-h2', '1.75rem'),
          style('h2', 'h2 — 28px', 'h2', 'font-size', '28px'),
          style('caption', 'Izoh — 14px', '.izoh', 'font-size', '14px'),
          style('pad', 'Blok chetlari 24px', '.blok', 'padding-left', '24px'),
        ],
      },
    },
    {
      slug: 'rang-stillari',
      title: 'Rang stillari va o‘zgaruvchilar',
      exercise: {
        title: 'Figma Variables → CSS o‘zgaruvchilar',
        description: 'Maketdagi rang nomlarini kodga ko‘chirish.',
        instructions: md(
          '**Maketdagi o‘zgaruvchilar**: `Primary/600` `#0071DC`, `Primary/50` `#EEF6FF`, `Neutral/900` `#0F172A`, `Neutral/500` `#64748B`.',
          '',
          '1. `:root` da: `--primary-600`, `--primary-50`, `--neutral-900`, `--neutral-500` (qiymatlar kichik harflarda).',
          '2. `.belgi`: fon `var(--primary-50)`, matn `var(--primary-600)`.',
          '3. `.nomi`: `color: var(--neutral-900)`; `.meta`: `color: var(--neutral-500)`.',
        ),
        expectedBehavior:
          'Ranglar maketdagidek va har biri nom bilan — dizayner rangni o‘zgartirsa, kodda bitta qator o‘zgaradi.',
        difficulty: 'EASY',
        starterFiles: site(COLORS, COLORS_CSS),
        checks: [
          style('var', '`--primary-600` bor', ':root', '--primary-600', '#0071dc'),
          style('badge-bg', 'Belgi foni Primary/50', '.belgi', 'background-color', '#eef6ff'),
          style('badge-fg', 'Belgi matni Primary/600', '.belgi', 'color', '#0071dc'),
          style('title', 'Nom Neutral/900', '.nomi', 'color', '#0f172a'),
          style('meta', 'Meta Neutral/500', '.meta', 'color', '#64748b'),
        ],
      },
      quiz: quiz('1-modul testi: Maketni o‘qish', [
        q(
          'f1-frame',
          'Figma’dagi freym (Frame) CSS’da odatda nimaga to‘g‘ri keladi?',
          [
            'Blok element (konteyner) — `div`, `section`, `main`',
            'Faqat `<img>`',
            'CSS o‘zgaruvchisi',
            'Media so‘rov',
          ],
          [0],
        ),
        q(
          'f1-inspect',
          'Inspect paneldagi CSS’ni to‘g‘ridan-to‘g‘ri nusxalashning xavfi?',
          [
            'Mutlaq joylashuv va qotgan o‘lchamlar keladi — moslashuvchanlik yo‘qoladi',
            'CSS ishlamaydi',
            'Ranglar noto‘g‘ri chiqadi',
            'Hech qanday xavf yo‘q',
          ],
          [0],
        ),
        q('f1-rem', '24px necha rem (asos 16px)?', ['1.5rem', '2.4rem', '0.75rem', '24rem'], [0]),
        q(
          'f1-stroke',
          'Figma’dagi “Stroke 1 Inside” ga eng yaqin CSS?',
          [
            '`border: 1px solid` va `box-sizing: border-box`',
            '`outline: 1px solid` faqat',
            '`text-decoration`',
            '`filter: drop-shadow`',
          ],
          [0],
        ),
        q(
          'f1-vars',
          'Rang o‘zgaruvchilaridan foydalanishning afzalliklari? (bir nechta javob)',
          [
            'Dizayner va dasturchi bir xil nomlar bilan gaplashadi',
            'Rang o‘zgarsa, faqat bitta qiymat almashtiriladi',
            'Qorong‘i mavzuni qo‘shish oson',
            'Sahifa avtomatik tarjima qilinadi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s01: Record<string, ProjectFile[]> = {
  'figma-interfeysi': site(
    FRAME,
    `${RESET}

.freym {
  max-width: 375px;
  min-height: 812px;
  padding: 48px 24px 0;
  background-color: #f8fafc;
}

h1 {
  margin: 0 0 8px;
  font-size: 28px;
  line-height: 36px;
  font-weight: 700;
  color: #0f172a;
}

.izoh {
  margin: 0;
  line-height: 24px;
  color: #475569;
}`,
  ),
  inspect: site(
    CARD,
    `${CARD_CSS}

.karta {
  display: grid;
  gap: 4px;
  width: 327px;
  padding: 16px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px 0 rgb(15 23 42 / 0.08);
}`,
  ),
  'px-rem': site(
    REM,
    `${RESET}

:root {
  --t-h2: 1.75rem;
  --t-matn: 1rem;
  --t-izoh: 0.875rem;
  --s-6: 1.5rem;
}

h2 {
  font-size: var(--t-h2);
}

p {
  font-size: var(--t-matn);
}

.izoh {
  font-size: var(--t-izoh);
}

.blok {
  padding: var(--s-6);
}`,
  ),
  'rang-stillari': site(
    COLORS,
    `:root {
  --primary-600: #0071dc;
  --primary-50: #eef6ff;
  --neutral-900: #0f172a;
  --neutral-500: #64748b;
}

${COLORS_CSS}

.belgi {
  background-color: var(--primary-50);
  color: var(--primary-600);
}

.nomi {
  color: var(--neutral-900);
}

.meta {
  color: var(--neutral-500);
}`,
  ),
};
