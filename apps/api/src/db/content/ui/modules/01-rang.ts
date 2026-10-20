import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  app,
  attr,
  md,
  q,
  quiz,
  RESET,
  site,
  style,
  type ModuleDef,
} from '../../design/shared';

const click = (selector: string) => [{ type: 'click' as const, selector }];

const SWATCHES = `<div class="namunalar">
  <div class="namuna hex">HEX</div>
  <div class="namuna rgb">RGB</div>
  <div class="namuna hsl">HSL</div>
  <div class="namuna shaffof">Shaffof</div>
</div>`;

const SWATCH_CSS = `${RESET}

.namunalar {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.namuna {
  padding: 24px;
  border-radius: 8px;
  color: white;
  background-color: gray;
}`;

const SHADES = `<div class="soyalar">
  <div class="soya ochroq">Och</div>
  <div class="soya asosiy">Asosiy</div>
  <div class="soya toq">To‘q</div>
</div>`;

const SHADES_CSS = `${RESET}

.soyalar {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.soya {
  padding: 24px;
  border-radius: 8px;
}`;

const HARMONY = `<div class="uygunlik">
  <div class="rang asos">Asos (210°)</div>
  <div class="rang komplement">Komplement</div>
  <div class="rang analog-1">Analog 1</div>
  <div class="rang analog-2">Analog 2</div>
  <div class="rang triada">Triada</div>
</div>`;

const HARMONY_CSS = `${RESET}

:root {
  --h: 210;
}

.uygunlik {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
}

.rang {
  padding: 24px;
  border-radius: 8px;
  color: white;
}

.asos {
  background-color: hsl(var(--h) 80% 45%);
}`;

const PALETTE = `<main class="sahifa">
  <section class="karta">
    <h1>Ingliz tili kursi</h1>
    <p>12 hafta, haftasiga 3 dars.</p>
    <a class="tugma" href="#">Yozilish</a>
  </section>
</main>`;

const PALETTE_CSS = `${RESET}

body {
  background-color: #ff00ff;
}

.sahifa {
  padding: 32px 16px;
}

.karta {
  max-width: 480px;
  padding: 24px;
  border-radius: 12px;
  background-color: #00ffff;
}

.tugma {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 8px;
  color: white;
  background-color: #ffff00;
}`;

const CONTRAST = `<article class="xabar">
  <h2>To‘lov qabul qilindi</h2>
  <p class="izoh">Chek emailingizga yuborildi.</p>
  <label>Izoh <input placeholder="Ixtiyoriy"></label>
  <button type="button" class="tugma">Davom etish</button>
</article>`;

const CONTRAST_CSS = `${RESET}

.xabar {
  padding: 24px;
}

.izoh {
  color: #a0aec0;
}

input::placeholder {
  color: #cbd5e1;
}

.tugma {
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  color: white;
  background-color: #59a2ff;
}`;

const THEME = `<header class="sarlavha">
  <strong>Kundalik</strong>
  <button type="button" class="mavzu" aria-pressed="false">Qorong‘i mavzu</button>
</header>
<main class="sahifa">
  <p>Bugungi vazifalar ro‘yxati.</p>
</main>`;

const THEME_CSS = `${RESET}

body {
  background-color: #ffffff;
  color: #0f172a;
}

.sarlavha {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

.sahifa {
  padding: 16px;
}`;

const THEME_JS = `const tugma = document.querySelector('.mavzu');

// Tugma bosilganda <html> ga data-theme="dark" qo‘ying (yoki olib tashlang)
// va aria-pressed ni yangilang.`;

const THEME_JS_DONE = `const tugma = document.querySelector('.mavzu');

tugma.addEventListener('click', () => {
  const qorongi = document.documentElement.dataset.theme !== 'dark';
  if (qorongi) document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;
  tugma.setAttribute('aria-pressed', String(qorongi));
});`;

const THEME_CSS_DONE = `${RESET}

:root {
  --fon: #ffffff;
  --matn: #0f172a;
}

[data-theme="dark"] {
  --fon: #0b1120;
  --matn: #e2e8f0;
}

body {
  background-color: var(--fon);
  color: var(--matn);
}

.sarlavha {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

.sahifa {
  padding: 16px;
}`;

export const m01: ModuleDef = {
  title: 'Rang',
  lessons: [
    {
      slug: 'rang-modellari',
      title: 'Rang modellari: HEX, RGB, HSL',
      exercise: {
        title: 'Bir rang — turli yozuvlar',
        description: 'HEX, RGB, HSL va shaffoflik.',
        instructions: md(
          '1. `.hex`: `background-color: #0071dc`.',
          '2. `.rgb`: `background-color: rgb(254 196 0)` va `color: #0e1133` (sariq fonda qora matn).',
          '3. `.hsl`: `background-color: hsl(150 60% 35%)`.',
          '4. `.shaffof`: `background-color: rgb(0 113 220 / 0.5)`.',
        ),
        expectedBehavior: 'To‘rt namuna ko‘k, sariq, yashil va yarim shaffof ko‘k rangda.',
        difficulty: 'EASY',
        starterFiles: site(SWATCHES, SWATCH_CSS),
        checks: [
          style('hex', 'HEX rang', '.hex', 'background-color', '#0071dc'),
          style('rgb', 'RGB rang', '.rgb', 'background-color', 'rgb(254 196 0)'),
          style('hsl', 'HSL rang', '.hsl', 'background-color', 'hsl(150 60% 35%)'),
          style(
            'alpha',
            'Yarim shaffof rang',
            '.shaffof',
            'background-color',
            'rgb(0 113 220 / 0.5)',
          ),
          style('ink', 'Sariq fonda to‘q matn', '.rgb', 'color', '#0e1133', { hidden: true }),
        ],
      },
    },
    {
      slug: 'hsl-soyalar',
      title: 'HSL bilan soyalar yasash',
      exercise: {
        title: 'Bitta rang tonidan uch soya',
        description: 'Ton o‘zgarmaydi, faqat yorug‘lik o‘zgaradi.',
        instructions: md(
          '1. `:root` da `--ton: 210` o‘zgaruvchisini yozing.',
          '2. `.ochroq`: `background-color: hsl(var(--ton) 100% 95%)`.',
          '3. `.asosiy`: `background-color: hsl(var(--ton) 100% 43%)`, `color: white`.',
          '4. `.toq`: `background-color: hsl(var(--ton) 100% 25%)`, `color: white`.',
        ),
        expectedBehavior: 'Bir xil ko‘k tonning och, o‘rta va to‘q soyalari.',
        difficulty: 'EASY',
        starterFiles: site(SHADES, SHADES_CSS),
        checks: [
          style('var', '`--ton` o‘zgaruvchisi', ':root', '--ton', '210'),
          style('light', 'Och soya', '.ochroq', 'background-color', 'hsl(210 100% 95%)'),
          style('base', 'Asosiy soya', '.asosiy', 'background-color', 'hsl(210 100% 43%)'),
          style('dark', 'To‘q soya', '.toq', 'background-color', 'hsl(210 100% 25%)'),
        ],
      },
    },
    {
      slug: 'uygunlik',
      title: 'Rang g‘ildiragi va uyg‘unlik',
      exercise: {
        title: 'Rang sxemalari `calc()` bilan',
        description: 'Komplementar, analog va triada ranglar asos tondan hisoblanadi.',
        instructions: md(
          'Har bir blok uchun `background-color: hsl(calc(var(--h) + X) 80% 45%)` yozing:',
          '1. `.komplement` — `+ 180`.',
          '2. `.analog-1` — `- 30`, `.analog-2` — `+ 30`.',
          '3. `.triada` — `+ 120`.',
        ),
        expectedBehavior: 'Asos ko‘k (210°) rangdan hisoblangan to‘rt rang.',
        difficulty: 'MEDIUM',
        starterFiles: site(HARMONY, HARMONY_CSS),
        checks: [
          style(
            'comp',
            'Komplementar rang (30°)',
            '.komplement',
            'background-color',
            'hsl(30 80% 45%)',
          ),
          style('an1', 'Analog rang (180°)', '.analog-1', 'background-color', 'hsl(180 80% 45%)'),
          style('an2', 'Analog rang (240°)', '.analog-2', 'background-color', 'hsl(240 80% 45%)'),
          style('tri', 'Triada rang (330°)', '.triada', 'background-color', 'hsl(330 80% 45%)'),
        ],
      },
    },
    {
      slug: 'palitra',
      title: 'Palitra va 60-30-10 qoidasi',
      exercise: {
        title: 'Uch rolli palitra',
        description: 'Fon, sirt va urg‘u ranglari tokenlar orqali.',
        instructions: md(
          '1. `:root` da: `--fon: #f8fafc`, `--sirt: #ffffff`, `--urg: #0071dc`.',
          '2. `body` foni — `var(--fon)`; `.karta` foni — `var(--sirt)`; `.tugma` foni — `var(--urg)`.',
          '3. Qo‘pol ranglarni (`#ff00ff`, `#00ffff`, `#ffff00`) butunlay olib tashlang.',
        ),
        expectedBehavior: 'Ko‘zni charchatmaydigan sahifa: och fon, oq karta, bitta ko‘k urg‘u.',
        difficulty: 'EASY',
        starterFiles: site(PALETTE, PALETTE_CSS),
        checks: [
          style('token', '`--urg` tokeni', ':root', '--urg', '#0071dc'),
          style('bg', 'Fon och kulrang', 'body', 'background-color', '#f8fafc'),
          style('surface', 'Karta oq', '.karta', 'background-color', '#ffffff'),
          style('accent', 'Urg‘u faqat tugmada', '.tugma', 'background-color', '#0071dc'),
        ],
      },
    },
    {
      slug: 'kontrast',
      title: 'Kontrast va o‘qilishi',
      exercise: {
        title: 'WCAG talabiga moslash',
        description: 'Xira matn va och tugmani 4.5:1 kontrastga yetkazish.',
        instructions: md(
          '1. `.izoh` rangi — `#475569` (oq fonda 7.6:1).',
          '2. `input::placeholder` rangi — `#64748b` (4.8:1).',
          '3. `.tugma` foni — `#005bb5` (oq matn bilan 6.6:1).',
        ),
        expectedBehavior: 'Barcha matnlar oq fonda oson o‘qiladi.',
        difficulty: 'EASY',
        starterFiles: site(CONTRAST, CONTRAST_CSS),
        checks: [
          style('muted', 'Izoh yetarli kontrastli', '.izoh', 'color', '#475569'),
          style('placeholder', 'Placeholder o‘qiladi', 'input', 'color', '#64748b', {
            pseudo: '::placeholder',
          }),
          style('button', 'Tugma foni to‘q', '.tugma', 'background-color', '#005bb5'),
        ],
      },
    },
    {
      slug: 'rang-tokenlari',
      title: 'Rang tokenlari va qorong‘i mavzu',
      exercise: {
        title: 'Mavzu almashtirgich',
        description: 'Semantik tokenlar va `data-theme` atributi.',
        instructions: md(
          '1. `:root` da `--fon: #ffffff`, `--matn: #0f172a`; `[data-theme="dark"]` da `--fon: #0b1120`, `--matn: #e2e8f0`.',
          '2. `body`: `background-color: var(--fon)`, `color: var(--matn)`.',
          '3. `script.js`: tugma bosilganda `<html>` ga `data-theme="dark"` qo‘yilsin (yana bosilsa olib tashlansin), `aria-pressed` yangilansin.',
        ),
        expectedBehavior: 'Tugma bosilganda sahifa qorong‘i mavzuga o‘tadi va qaytadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(THEME, THEME_JS, { css: THEME_CSS }),
        checks: [
          style('light', 'Boshida yorug‘ mavzu', 'body', 'background-color', '#ffffff'),
          after(
            click('.mavzu'),
            style('dark-bg', 'Bosilganda qorong‘i fon', 'body', 'background-color', '#0b1120'),
          ),
          after(
            click('.mavzu'),
            style('dark-text', 'Bosilganda och matn', 'body', 'color', '#e2e8f0'),
          ),
          after(
            click('.mavzu'),
            attr('pressed', '`aria-pressed` yangilanadi', '.mavzu', 'aria-pressed', 'true'),
          ),
        ],
      },
      quiz: quiz('1-modul testi: Rang', [
        q(
          'u1-hsl',
          'HSL’da “L” nimani bildiradi?',
          ['Yorug‘lik (lightness)', 'Ton (hue)', 'To‘yinganlik', 'Shaffoflik'],
          [0],
        ),
        q(
          'u1-comp',
          'Ko‘k (210°) uchun komplementar rang tonini toping.',
          ['30°', '120°', '210°', '270°'],
          [0],
        ),
        q(
          'u1-6030',
          '60-30-10 qoidasida 10% qaysi rangga to‘g‘ri keladi?',
          ['Urg‘u rangi — tugmalar va muhim belgilar', 'Asosiy fon', 'Matn rangi', 'Chegaralar'],
          [0],
        ),
        q(
          'u1-wcag',
          'WCAG AA bo‘yicha oddiy matn uchun minimal kontrast?',
          ['4.5:1', '2:1', '3:1 dan kam bo‘lishi mumkin', '10:1'],
          [0],
        ),
        q(
          'u1-token',
          'Semantik rang tokenining afzalliklari? (bir nechta javob)',
          [
            'Mavzuni bitta joyda almashtirish mumkin',
            'Kodda rangning vazifasi ko‘rinadi (`--fon`, `--urg`)',
            'Brauzer ranglarni avtomatik moslaydi',
            'Rang o‘zgarsa, barcha komponentlar birdan yangilanadi',
          ],
          [0, 1, 3],
        ),
      ]),
    },
  ],
};

export const s01: Record<string, ProjectFile[]> = {
  'rang-modellari': site(
    SWATCHES,
    `${SWATCH_CSS}

.hex {
  background-color: #0071dc;
}

.rgb {
  background-color: rgb(254 196 0);
  color: #0e1133;
}

.hsl {
  background-color: hsl(150 60% 35%);
}

.shaffof {
  background-color: rgb(0 113 220 / 0.5);
}`,
  ),
  'hsl-soyalar': site(
    SHADES,
    `:root {
  --ton: 210;
}

${SHADES_CSS}

.ochroq {
  background-color: hsl(var(--ton) 100% 95%);
}

.asosiy {
  background-color: hsl(var(--ton) 100% 43%);
  color: white;
}

.toq {
  background-color: hsl(var(--ton) 100% 25%);
  color: white;
}`,
  ),
  uygunlik: site(
    HARMONY,
    `${HARMONY_CSS}

.komplement {
  background-color: hsl(calc(var(--h) + 180) 80% 45%);
}

.analog-1 {
  background-color: hsl(calc(var(--h) - 30) 80% 45%);
}

.analog-2 {
  background-color: hsl(calc(var(--h) + 30) 80% 45%);
}

.triada {
  background-color: hsl(calc(var(--h) + 120) 80% 45%);
}`,
  ),
  palitra: site(
    PALETTE,
    `:root {
  --fon: #f8fafc;
  --sirt: #ffffff;
  --urg: #0071dc;
}

${PALETTE_CSS.replace('background-color: #ff00ff;', 'background-color: var(--fon);')
  .replace('background-color: #00ffff;', 'background-color: var(--sirt);')
  .replace('background-color: #ffff00;', 'background-color: var(--urg);')}`,
  ),
  kontrast: site(
    CONTRAST,
    CONTRAST_CSS.replace('color: #a0aec0;', 'color: #475569;')
      .replace('color: #cbd5e1;', 'color: #64748b;')
      .replace('background-color: #59a2ff;', 'background-color: #005bb5;'),
  ),
  'rang-tokenlari': app(THEME, THEME_JS_DONE, { css: THEME_CSS_DONE }),
};
