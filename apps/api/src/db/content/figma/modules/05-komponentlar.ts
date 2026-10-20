import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  attr,
  has,
  md,
  q,
  quiz,
  RESET,
  site,
  style,
  svgData,
  type ModuleDef,
} from '../../design/shared';

const tab = [{ type: 'press' as const, selector: 'body', key: 'Tab' }];
const hover = (selector: string) => [{ type: 'hover' as const, selector }];

const DOT =
  '<svg class="ikonka" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="4" fill="currentColor"/></svg>';

const CHIPS = `<div class="qator">
  <span class="chip">${DOT} Onlayn</span>
  <span class="chip">${DOT} Yangi</span>
  <span class="chip chip--ikonkasiz">${DOT} Bepul</span>
</div>`;

const CHIPS_CSS = `${RESET}

.qator {
  display: flex;
  gap: 8px;
  padding: 24px;
}`;

const SIZES = `<div class="qator">
  <button type="button" class="tugma tugma--kichik">Kichik</button>
  <button type="button" class="tugma">O‘rta</button>
  <button type="button" class="tugma tugma--katta">Katta</button>
  <button type="button" class="tugma tugma--ikkinchi">Ikkinchi</button>
</div>`;

const SIZES_CSS = `${RESET}

.qator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 24px;
}

.tugma {
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  color: white;
  background-color: #0071dc;
}`;

const STATES = `<div class="qator">
  <button type="button" class="tugma">Saqlash</button>
  <button type="button" class="tugma" disabled>Saqlash</button>
</div>`;

const STATES_CSS = `${RESET}

.qator {
  display: flex;
  gap: 12px;
  padding: 24px;
}

.tugma {
  min-height: 44px;
  padding-inline: 16px;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  color: white;
  background-color: #0071dc;
  outline: none;
}`;

const LOGO_1X = svgData('0071dc', 120, 40);
const LOGO_2X = svgData('0071dc', 240, 80);

const EXPORT = `<header class="sarlavha">
  <img class="logo" src="${LOGO_1X}" alt="WEBDIZAYN.UZ">
  <a class="tugma" href="#">
    <svg class="ikonka" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#000000" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    Kirish
  </a>
</header>
<!-- logo@2x (240 × 80): ${LOGO_2X} -->`;

const EXPORT_CSS = `${RESET}

.sarlavha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

.tugma {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #005bb5;
  text-decoration: none;
}`;

export const m05: ModuleDef = {
  title: 'Komponentlar va variantlar',
  lessons: [
    {
      slug: 'komponent-klass',
      title: 'Komponent → CSS klass',
      exercise: {
        title: 'Chip komponenti',
        description: 'Asosiy komponent, instance va boolean xususiyat.',
        instructions: md(
          '**Komponent `Chip`** — Auto layout Horizontal, Gap 6, Padding 4/12, Radius 999 (Full), Fill `#F1F5F9`, Text 14 Medium `#0F172A`. Boolean property **Show icon** (standart: true).',
          '',
          '1. `.chip`: `display: inline-flex`, `align-items: center`, `gap: 6px`, `padding: 4px 12px`, `border-radius: 999px`, `background-color: #f1f5f9`, `color: #0f172a`, `font-size: 14px`, `font-weight: 500`.',
          '2. Show icon = false varianti: `.chip--ikonkasiz .ikonka { display: none; }`.',
        ),
        expectedBehavior: 'Uch chip bir xil uslubda, “Bepul” chipida ikonka yo‘q.',
        difficulty: 'EASY',
        starterFiles: site(CHIPS, CHIPS_CSS),
        checks: [
          style('flex', 'Auto layout → inline-flex', '.chip', 'display', 'inline-flex'),
          style('pill', 'Radius Full', '.chip', 'border-top-left-radius', '999px'),
          style('pad', 'Padding 12 (chap/o‘ng)', '.chip', 'padding-left', '12px'),
          style('font', 'Matn 14 Medium', '.chip', 'font-size', '14px'),
          style('bool', 'Show icon = false', '.chip--ikonkasiz .ikonka', 'display', 'none'),
        ],
      },
    },
    {
      slug: 'variantlar',
      title: 'Variantlar → modifikatorlar',
      exercise: {
        title: 'Size va Type variantlari',
        description: 'Figma variant xususiyatlarini modifikator klasslarga aylantirish.',
        instructions: md(
          '**Komponent `Button`**, xususiyatlar: **Size** = Small / Medium / Large, **Type** = Primary / Secondary.',
          '- Small: H 36, Padding 12, Text 14 · Medium: H 44, Padding 16, Text 16 · Large: H 52, Padding 20, Text 18.',
          '- Secondary: Fill `#FFFFFF`, Stroke 1 `#CBD5E1`, Text `#0F172A`.',
          '',
          '1. `.tugma` (Medium — standart): `min-height: 44px`, `padding-inline: 16px`, `font-size: 16px`.',
          '2. `.tugma--kichik`: `min-height: 36px`, `padding-inline: 12px`, `font-size: 14px`.',
          '3. `.tugma--katta`: `min-height: 52px`, `padding-inline: 20px`, `font-size: 18px`.',
          '4. `.tugma--ikkinchi`: `background-color: white`, `border-color: #cbd5e1`, `color: #0f172a`.',
        ),
        expectedBehavior:
          'To‘rt tugma: uch o‘lchamda va bitta ikkinchi darajali, hammasi bitta asosdan.',
        difficulty: 'EASY',
        starterFiles: site(SIZES, SIZES_CSS),
        checks: [
          style('md', 'Medium — 44', '.tugma:not([class*="--"])', 'min-height', '44px'),
          style('sm', 'Small — 36', '.tugma--kichik', 'min-height', '36px'),
          style('lg', 'Large — 52', '.tugma--katta', 'min-height', '52px'),
          style('lg-text', 'Large matni 18', '.tugma--katta', 'font-size', '18px'),
          style(
            'secondary',
            'Secondary — oq fon',
            '.tugma--ikkinchi',
            'background-color',
            '#ffffff',
          ),
        ],
      },
    },
    {
      slug: 'interaktiv',
      title: 'Interaktiv holatlar',
      exercise: {
        title: 'State variantlari → psevdoklasslar',
        description: 'Hover, Focused va Disabled variantlarini CSS’ga o‘girish.',
        instructions: md(
          '**Komponent `Button`**, xususiyat **State**:',
          '- Hover — Fill `#005BB5`.',
          '- Focused — Fill o‘zgarmaydi, Drop shadow `0 0 0 3` `#0071DC` 40% (fokus halqasi).',
          '- Disabled — Fill `#CBD5E1`, Text `#64748B`.',
          '',
          '1. `.tugma:hover` — fon `#005bb5`.',
          '2. `.tugma:focus-visible` — `box-shadow: 0 0 0 3px rgb(0 113 220 / 0.4)`.',
          '3. `.tugma:disabled` — fon `#cbd5e1`, matn `#64748b`, `cursor: not-allowed`.',
        ),
        expectedBehavior:
          'Hover’da to‘qroq, klaviatura fokusida ko‘k halqa, o‘chirilgan holatda kulrang.',
        difficulty: 'MEDIUM',
        starterFiles: site(STATES, STATES_CSS),
        checks: [
          after(
            hover('.tugma:not(:disabled)'),
            style('hover', 'Hover holati', '.tugma:not(:disabled)', 'background-color', '#005bb5'),
          ),
          after(
            tab,
            style(
              'focus',
              'Focused holati — halqa',
              '.tugma:not(:disabled)',
              'box-shadow',
              '0 0 0 3px rgb(0 113 220 / 0.4)',
            ),
          ),
          style(
            'disabled',
            'Disabled — kulrang fon',
            '.tugma:disabled',
            'background-color',
            '#cbd5e1',
          ),
          style('disabled-text', 'Disabled — xira matn', '.tugma:disabled', 'color', '#64748b'),
          style('cursor', 'Disabled — taqiq kursori', '.tugma:disabled', 'cursor', 'not-allowed', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'eksport',
      title: 'Eksport: SVG va 2x rasmlar',
      exercise: {
        title: 'Logo va ikonkani to‘g‘ri joylash',
        description: '`srcset` bilan 1x/2x rasm, `currentColor` li SVG.',
        instructions: md(
          '**Eksport:** Logo — PNG **1x** (120 × 40) va **2x** (240 × 80). Ikonka — SVG.',
          '',
          '1. `.logo` ga `srcset="<1x manzil> 1x, <2x manzil> 2x"` qo‘shing (2x manzil izohda), shuningdek `width="120" height="40"`.',
          '2. Ikonkadagi `stroke="#000000"` ni `stroke="currentColor"` ga almashtiring.',
          '3. Ikonkaga `aria-hidden="true"` qo‘shing (yonida “Kirish” matni bor).',
        ),
        expectedBehavior: 'Retina ekranda logo tiniq, ikonka tugma matni rangida.',
        difficulty: 'EASY',
        starterFiles: site(EXPORT, EXPORT_CSS),
        checks: [
          has('srcset', 'Logo uchun 1x/2x', 'img.logo[srcset*=" 1x"][srcset*=" 2x"]'),
          attr('w', 'Logo kengligi 120', 'img.logo', 'width', '120'),
          style('w-css', 'Logo 120px ko‘rinadi', 'img.logo', 'width', '120px', { hidden: true }),
          style('color', 'Ikonka matn rangida', '.ikonka path', 'stroke', '#005bb5'),
          has('hidden', 'Ikonka bezak sifatida yashirin', 'svg.ikonka[aria-hidden="true"]'),
        ],
      },
      quiz: quiz('5-modul testi: Komponentlar va variantlar', [
        q(
          'f5-comp',
          'Figma’dagi asosiy komponent (Main component) kodda nimaga to‘g‘ri keladi?',
          [
            'Qayta ishlatiladigan CSS klass (yoki UI komponent)',
            'Bitta sahifa',
            'CSS o‘zgaruvchi',
            'Rasm fayli',
          ],
          [0],
        ),
        q(
          'f5-variant',
          'Variant xususiyati “Size=Large” odatda qanday yoziladi?',
          [
            'Modifikator klass: `.tugma--katta`',
            'Alohida `id`',
            'Inline `style`',
            'Yangi HTML element',
          ],
          [0],
        ),
        q(
          'f5-state',
          'Figma’dagi “State=Focused” varianti CSS’da qaysi psevdoklass?',
          ['`:focus-visible`', '`:hover`', '`:checked`', '`::before`'],
          [0],
        ),
        q(
          'f5-2x',
          'Nega logo 2x o‘lchamda ham eksport qilinadi?',
          [
            'Retina (DPR 2) ekranlarda tiniq ko‘rinishi uchun',
            'Sahifa tezroq yuklanishi uchun',
            'Faqat chop etish uchun',
            'Brauzer 1x rasmni qabul qilmaydi',
          ],
          [0],
        ),
        q(
          'f5-svg',
          'Ikonkalar uchun SVG eksportining afzalliklari? (bir nechta javob)',
          [
            'Har qanday o‘lchamda tiniq',
            '`currentColor` bilan rangni CSS boshqaradi',
            'Fayl odatda juda yengil',
            'Foto uchun eng yaxshi format',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s05: Record<string, ProjectFile[]> = {
  'komponent-klass': site(
    CHIPS,
    `${CHIPS_CSS}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: #f1f5f9;
  color: #0f172a;
  font-size: 14px;
  font-weight: 500;
}

.chip--ikonkasiz .ikonka {
  display: none;
}`,
  ),
  variantlar: site(
    SIZES,
    `${SIZES_CSS}

.tugma {
  min-height: 44px;
  padding-inline: 16px;
  font-size: 16px;
}

.tugma--kichik {
  min-height: 36px;
  padding-inline: 12px;
  font-size: 14px;
}

.tugma--katta {
  min-height: 52px;
  padding-inline: 20px;
  font-size: 18px;
}

.tugma--ikkinchi {
  background-color: white;
  border-color: #cbd5e1;
  color: #0f172a;
}`,
  ),
  interaktiv: site(
    STATES,
    `${STATES_CSS}

.tugma:hover {
  background-color: #005bb5;
}

.tugma:focus-visible {
  box-shadow: 0 0 0 3px rgb(0 113 220 / 0.4);
}

.tugma:disabled {
  background-color: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
}`,
  ),
  eksport: site(
    EXPORT.replace(
      `<img class="logo" src="${LOGO_1X}" alt="WEBDIZAYN.UZ">`,
      `<img class="logo" src="${LOGO_1X}" srcset="${LOGO_1X} 1x, ${LOGO_2X} 2x" width="120" height="40" alt="WEBDIZAYN.UZ">`,
    ).replace('stroke="#000000"', 'stroke="currentColor" aria-hidden="true"'),
    EXPORT_CSS,
  ),
};
