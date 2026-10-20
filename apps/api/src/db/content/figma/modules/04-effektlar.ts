import type { ProjectFile } from '@webdizayn/shared';
import { md, q, quiz, RESET, site, style, svgData, type ModuleDef } from '../../design/shared';

const TEXT = `<article class="maqola">
  <h1>Dizayndan kodga</h1>
  <p>Maketdagi har bir matn uslubi CSS’da aniq qiymatlarga aylanadi.</p>
  <p class="izoh">O‘qish vaqti: 4 daqiqa</p>
</article>`;

const TEXT_CSS = `${RESET}

.maqola {
  padding: 24px;
}

h1,
p {
  margin: 0 0 12px;
}`;

const SHADOWS = `<article class="karta">Karta (Shadow/Md)</article>
<label class="maydon">Izoh <input></label>
<div class="fon">
  <div class="oyna">Oyna (Background blur 12)</div>
</div>`;

const SHADOWS_CSS = `${RESET}

body {
  display: grid;
  gap: 24px;
  padding: 24px;
  background-color: #f8fafc;
}

.karta {
  padding: 24px;
  border-radius: 12px;
  background-color: white;
}

input {
  display: block;
  margin-top: 6px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}

.fon {
  padding: 32px;
  background-image: url("${svgData('0071dc', 400, 200)}");
  background-size: cover;
}

.oyna {
  padding: 16px;
  border-radius: 12px;
  background-color: rgb(255 255 255 / 0.6);
}`;

const STROKES = `<div class="qator">
  <article class="kurs">
    <div class="muqova"></div>
    <p>HTML kursi</p>
  </article>
  <button type="button" class="variant tanlangan">Oylik</button>
  <div class="yuklash">Faylni shu yerga tashlang</div>
</div>`;

const STROKES_CSS = `${RESET}

.qator {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  padding: 24px;
}

.kurs {
  width: 200px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.muqova {
  height: 100px;
  background-color: #0071dc;
}

.kurs p {
  margin: 12px;
}

.variant {
  min-height: 44px;
  padding-inline: 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  font: inherit;
}

.yuklash {
  padding: 24px;
  border: 1px solid #94a3b8;
  border-radius: 12px;
  color: #475569;
}`;

const FILLS = `<section class="banner">
  <h2>Yangi kurs</h2>
</section>
<div class="ikki">
  <div class="qatlam">Layer opacity 60%</div>
  <div class="fon">Fill opacity 60%</div>
</div>`;

const FILLS_CSS = `${RESET}

body {
  padding: 24px;
}

.banner {
  padding: 32px;
  border-radius: 12px;
  color: white;
  background-color: #0071dc;
}

.banner h2 {
  margin: 0;
}

.ikki {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.qatlam,
.fon {
  padding: 24px;
  color: white;
  background-color: #0071dc;
}`;

export const m04: ModuleDef = {
  title: 'Matn va effektlar',
  lessons: [
    {
      slug: 'text-styles',
      title: 'Matn stillari',
      exercise: {
        title: 'Text Styles → CSS',
        description: 'Foizli qator balandligi va harf oralig‘ini o‘girish.',
        instructions: md(
          '**Maketdagi Text Styles:**',
          '- `Heading/H1` — Bold 40, Line height **120%**, Letter spacing **−2%**.',
          '- `Body/Regular` — Regular 16, Line height **150%**, Letter spacing 0%.',
          '- `Caption` — Medium 12, Line height **16** (px), Letter spacing **4%**.',
          '',
          'Yozing: `h1` — `font-size: 40px`, `font-weight: 700`, `line-height: 1.2`, `letter-spacing: -0.02em`; `p` — `line-height: 1.5`; `.izoh` — `font-size: 12px`, `font-weight: 500`, `line-height: 16px`, `letter-spacing: 0.04em`.',
        ),
        expectedBehavior:
          'Matnlar maketdagi uslublar bilan aynan bir xil: qator balandligi va harf oralig‘i to‘g‘ri.',
        difficulty: 'MEDIUM',
        starterFiles: site(TEXT, TEXT_CSS),
        checks: [
          style('h1-lh', 'H1 qator balandligi 120% (48px)', 'h1', 'line-height', '48px'),
          style('h1-ls', 'H1 harf oralig‘i −2% (−0.8px)', 'h1', 'letter-spacing', '-0.8px'),
          style(
            'body-lh',
            'Matn qator balandligi 150% (24px)',
            'p:not(.izoh)',
            'line-height',
            '24px',
          ),
          style('cap-ls', 'Caption harf oralig‘i 4% (0.48px)', '.izoh', 'letter-spacing', '0.48px'),
          style('cap-w', 'Caption Medium (500)', '.izoh', 'font-weight', '500'),
        ],
      },
    },
    {
      slug: 'soyalar',
      title: 'Soyalar va xiralashtirish',
      exercise: {
        title: 'Effektlar paneli → CSS',
        description: 'Ikki qatlamli soya, ichki soya va fon xiralashtirish.',
        instructions: md(
          '**Effects:**',
          '- `Card` — Drop shadow: `0 1 2 0 #0F172A 6%` va `0 4 8 −2 #0F172A 10%`.',
          '- `Input` — Inner shadow: `0 1 2 0 #0F172A 5%`.',
          '- `Glass` — Background blur 12.',
          '',
          '1. `.karta`: `box-shadow: 0 1px 2px 0 rgb(15 23 42 / 0.06), 0 4px 8px -2px rgb(15 23 42 / 0.1)`.',
          '2. `input`: `box-shadow: inset 0 1px 2px 0 rgb(15 23 42 / 0.05)`.',
          '3. `.oyna`: `backdrop-filter: blur(12px)`.',
        ),
        expectedBehavior:
          'Karta yumshoq soyada, maydon ichkariga botgandek, oyna ortidagi fon xiralashgan.',
        difficulty: 'MEDIUM',
        starterFiles: site(SHADOWS, SHADOWS_CSS),
        checks: [
          style(
            'drop',
            'Karta: ikki qatlamli soya',
            '.karta',
            'box-shadow',
            '0 1px 2px 0 rgb(15 23 42 / 0.06), 0 4px 8px -2px rgb(15 23 42 / 0.1)',
          ),
          style(
            'inner',
            'Maydon: ichki soya',
            'input',
            'box-shadow',
            'inset 0 1px 2px 0 rgb(15 23 42 / 0.05)',
          ),
          style('blur', 'Oyna: fon xiralashtirish', '.oyna', 'backdrop-filter', 'blur(12px)'),
        ],
      },
    },
    {
      slug: 'radius-stroke',
      title: 'Radius va stroke',
      exercise: {
        title: 'Burchaklar va chiziqlar',
        description: 'Alohida burchak radiusi, Inside stroke va punktir chiziq.',
        instructions: md(
          '**Maket:**',
          '- `Course/Cover` — Radius **16 16 0 0** (faqat tepa burchaklar).',
          '- `Option/Selected` — Stroke **2 Inside** `#0071DC`.',
          '- `Dropzone` — Stroke 1, **Dash 6/4**, `#94A3B8`.',
          '',
          '1. `.muqova`: `border-radius: 16px 16px 0 0`.',
          '2. `.tanlangan`: `border: 2px solid #0071dc` (`box-sizing: border-box` bilan tugma o‘lchami o‘zgarmaydi).',
          '3. `.yuklash`: `border-style: dashed`.',
        ),
        expectedBehavior:
          'Muqovaning faqat tepa burchaklari yumaloq, tanlangan variant qalin ko‘k chegarali, yuklash maydoni punktirli.',
        difficulty: 'EASY',
        starterFiles: site(STROKES, STROKES_CSS),
        checks: [
          style('top', 'Muqova tepa burchagi 16', '.muqova', 'border-top-left-radius', '16px'),
          style(
            'bottom',
            'Muqova pastki burchagi 0',
            '.muqova',
            'border-bottom-left-radius',
            '0px',
          ),
          style('stroke-w', 'Tanlangan: stroke 2', '.tanlangan', 'border-top-width', '2px'),
          style('stroke-c', 'Tanlangan: ko‘k', '.tanlangan', 'border-top-color', '#0071dc'),
          style('dash', 'Yuklash maydoni punktir', '.yuklash', 'border-top-style', 'dashed'),
        ],
      },
    },
    {
      slug: 'fill-gradient',
      title: 'Fill: gradient va shaffoflik',
      exercise: {
        title: 'Gradient va ikki xil shaffoflik',
        description: 'Linear gradient, Layer opacity va Fill opacity farqi.',
        instructions: md(
          '**Maket:**',
          '- `Banner` — Fill: Linear gradient **90°**, `#0071DC` → `#005BB5`.',
          '- `Layer opacity 60%` — butun qatlam (matn bilan) 60%.',
          '- `Fill opacity 60%` — faqat fon 60%, matn to‘liq.',
          '',
          '1. `.banner`: `background-image: linear-gradient(90deg, #0071dc, #005bb5)`.',
          '2. `.qatlam`: `opacity: 0.6`.',
          '3. `.fon`: `background-color: rgb(0 113 220 / 0.6)` (opacity emas!).',
        ),
        expectedBehavior:
          'Banner chapdan o‘ngga to‘qlashadi; birinchi blokda matn ham xira, ikkinchisida faqat fon.',
        difficulty: 'EASY',
        starterFiles: site(FILLS, FILLS_CSS),
        checks: [
          style(
            'gradient',
            'Banner gradienti',
            '.banner',
            'background-image',
            'linear-gradient(90deg, #0071dc, #005bb5)',
          ),
          style('layer', 'Layer opacity', '.qatlam', 'opacity', '0.6'),
          style(
            'fill',
            'Fill opacity faqat fonda',
            '.fon',
            'background-color',
            'rgb(0 113 220 / 0.6)',
          ),
          style('fill-text', 'Matn shaffof emas', '.fon', 'opacity', '1', { hidden: true }),
        ],
      },
      quiz: quiz('4-modul testi: Matn va effektlar', [
        q(
          'f4-lh',
          'Figma’da Line height 150%, shrift 16 — CSS’da?',
          [
            '`line-height: 1.5` (24px)',
            '`line-height: 150px`',
            '`line-height: 16px`',
            '`line-height: 15`',
          ],
          [0],
        ),
        q(
          'f4-ls',
          'Letter spacing −2% CSS’da qanday yoziladi?',
          [
            '`letter-spacing: -0.02em`',
            '`letter-spacing: -2px`',
            '`letter-spacing: -2%`',
            '`word-spacing: -2%`',
          ],
          [0],
        ),
        q(
          'f4-shadow',
          'Figma Drop shadow “0 4 8 −2” CSS’da qaysi tartibda?',
          [
            '`box-shadow: 0 4px 8px -2px rang` — X, Y, Blur, Spread',
            '`box-shadow: 4px 0 -2px 8px`',
            '`text-shadow` bilan',
            '`filter: shadow()`',
          ],
          [0],
        ),
        q(
          'f4-opacity',
          'Layer opacity va Fill opacity farqi?',
          [
            'Layer opacity butun elementni (matnni ham) xiralashtiradi, Fill opacity faqat fon rangini',
            'Hech qanday farq yo‘q',
            'Fill opacity faqat rasmlar uchun',
            'Layer opacity CSS’da mavjud emas',
          ],
          [0],
        ),
        q(
          'f4-outside',
          '“Stroke Outside” ni elementni kattalashtirmasdan qanday yasash mumkin? (bir nechta javob)',
          [
            '`box-shadow: 0 0 0 2px rang`',
            '`outline: 2px solid rang`',
            '`border` ga kenglikni qo‘shib, `width` ni kamaytirish',
            '`text-decoration`',
          ],
          [0, 1],
        ),
      ]),
    },
  ],
};

export const s04: Record<string, ProjectFile[]> = {
  'text-styles': site(
    TEXT,
    `${TEXT_CSS}

h1 {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

p {
  line-height: 1.5;
}

.izoh {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.04em;
}`,
  ),
  soyalar: site(
    SHADOWS,
    `${SHADOWS_CSS}

.karta {
  box-shadow: 0 1px 2px 0 rgb(15 23 42 / 0.06), 0 4px 8px -2px rgb(15 23 42 / 0.1);
}

input {
  box-shadow: inset 0 1px 2px 0 rgb(15 23 42 / 0.05);
}

.oyna {
  backdrop-filter: blur(12px);
}`,
  ),
  'radius-stroke': site(
    STROKES,
    `${STROKES_CSS}

.muqova {
  border-radius: 16px 16px 0 0;
}

.tanlangan {
  border: 2px solid #0071dc;
}

.yuklash {
  border-style: dashed;
}`,
  ),
  'fill-gradient': site(
    FILLS,
    `${FILLS_CSS}

.banner {
  background-image: linear-gradient(90deg, #0071dc, #005bb5);
}

.qatlam {
  opacity: 0.6;
}

.fon {
  background-color: rgb(0 113 220 / 0.6);
}`,
  ),
};
