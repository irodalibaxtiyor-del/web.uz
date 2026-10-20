import type { ProjectFile } from '@webdizayn/shared';
import { has, md, pic, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const BI_CSS_URL =
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css';

const ARROW =
  '<svg class="ikonka" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const SVG_BUTTONS = `<div class="harakatlar">
  <a class="tugma" href="#">Davom etish ${ARROW}</a>
  <a class="tugma katta" href="#">Kursni boshlash ${ARROW}</a>
</div>`;

const SVG_CSS = `${RESET}

.harakatlar {
  display: flex;
  gap: 16px;
  padding: 24px;
}

.tugma {
  padding: 10px 16px;
  border-radius: 8px;
  color: #005bb5;
  border: 1px solid currentColor;
  text-decoration: none;
}

.katta {
  font-size: 1.25rem;
}`;

const BI_BODY = `<nav class="menyu">
  <a class="tugma" href="#"><i class="bi bi-house"></i> Bosh sahifa</a>
  <a class="tugma" href="#"><i class="bi bi-journal-code"></i> Kurslar</a>
  <a class="tugma" href="#"><i class="bi bi-person"></i> Profil</a>
</nav>`;

const BI_CSS = `${RESET}

.menyu {
  display: flex;
  gap: 8px;
  padding: 16px;
}

.tugma {
  padding: 8px 12px;
  border-radius: 8px;
  color: #0f172a;
  text-decoration: none;
}`;

const X =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const SEARCH =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const CHECK =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5 9-10"/></svg>';

const A11Y = `<header class="panel">
  <button type="button" class="qidiruv">${SEARCH}</button>
  <p class="holat">${CHECK} Saqlandi</p>
  <button type="button" class="yopish">${X}</button>
</header>`;

const A11Y_CSS = `${RESET}

.panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
}

.holat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #15803d;
}`;

const GALLERY = `<div class="galereya">
  <figure>
    ${pic('0071dc', 'Samarqand, Registon', 800, 400)}
    <figcaption>Registon maydoni</figcaption>
  </figure>
  <figure>
    ${pic('fec400', 'Buxoro, Ark qal’asi', 400, 600)}
    <figcaption>Ark qal’asi</figcaption>
  </figure>
</div>
<p class="muallif">${pic('0b3f76', 'Muallif', 96, 96, ' class="avatar"')} Rasmlar: Nodira Yusupova</p>`;

const GALLERY_CSS = `${RESET}

.galereya {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
}

figure {
  margin: 0;
}

.galereya img {
  display: block;
  width: 100%;
  height: auto;
}

.muallif {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}`;

export const m04: ModuleDef = {
  title: 'Ikonka va rasm',
  lessons: [
    {
      slug: 'svg-ikonkalar',
      title: 'SVG ikonkalar',
      exercise: {
        title: 'Matnga moslashadigan ikonka',
        description: '`em` o‘lcham, `currentColor` va tekislash.',
        instructions: md(
          '1. `.tugma`: `display: inline-flex`, `align-items: center`, `gap: 8px`.',
          '2. `.ikonka`: `width: 1.25em`, `height: 1.25em`, `flex-shrink: 0`.',
        ),
        expectedBehavior:
          'Ikonka matn bilan bir chiziqda, matn kattalashsa ikonka ham kattalashadi, rangi matn rangida.',
        difficulty: 'EASY',
        starterFiles: site(SVG_BUTTONS, SVG_CSS),
        checks: [
          style('flex', 'Tugma inline-flex', '.tugma', 'display', 'inline-flex'),
          style('center', 'Ikonka matn markazida', '.tugma', 'align-items', 'center'),
          style('gap', 'Ikonka va matn orasida 8px', '.tugma', 'column-gap', '8px'),
          style(
            'size',
            'Oddiy tugmada ikonka 20px (1.25em)',
            '.tugma:not(.katta) .ikonka',
            'width',
            '20px',
          ),
          style('scale', 'Katta tugmada ikonka 25px', '.katta .ikonka', 'width', '25px'),
        ],
      },
    },
    {
      slug: 'bootstrap-icons',
      title: 'Ikonka to‘plami: Bootstrap Icons',
      exercise: {
        title: 'Tayyor ikonkalarni ulash',
        description: 'Ikonka shriftini CDN havolasi bilan ulash va bezak ikonkalarini yashirish.',
        instructions: md(
          `1. \`<head>\` ga qo‘shing: \`<link rel="stylesheet" href="${BI_CSS_URL}">\` (platforma faylni o‘zidan beradi).`,
          '2. Har bir `<i class="bi …">` ga `aria-hidden="true"` qo‘shing — yonida matn bor.',
          '3. `.tugma`: `display: inline-flex`, `align-items: center`, `gap: 6px`.',
        ),
        expectedBehavior: 'Menyu havolalari oldida uy, kitob va odam ikonkalari ko‘rinadi.',
        difficulty: 'EASY',
        starterFiles: site(BI_BODY, BI_CSS),
        checks: [
          style('font', 'Ikonka shrifti ulangan', '.bi-house', 'font-family', 'bootstrap-icons', {
            pseudo: '::before',
          }),
          has('hidden', 'Bezak ikonkalari yashirin', 'i.bi[aria-hidden="true"]', { min: 3 }),
          style('flex', 'Ikonka va matn bir chiziqda', '.tugma', 'display', 'inline-flex'),
          style('gap', 'Orada 6px', '.tugma', 'column-gap', '6px'),
        ],
      },
    },
    {
      slug: 'ikonka-a11y',
      title: 'Ikonkalar va accessibility',
      exercise: {
        title: 'Ekran o‘quvchi uchun tushunarli ikonkalar',
        description: 'Ikonkali tugmalarga nom, bezak SVG’larni yashirish.',
        instructions: md(
          '1. `.qidiruv` tugmasiga `aria-label="Qidirish"`, `.yopish` tugmasiga `aria-label="Yopish"` qo‘shing.',
          '2. Barcha uchta `<svg>` ga `aria-hidden="true"` va `focusable="false"` qo‘shing.',
          '3. “Saqlandi” matnini o‘chirmang — holat faqat ikonka bilan ko‘rsatilmasin.',
        ),
        expectedBehavior:
          'Ekran o‘quvchi “Qidirish, tugma”, “Saqlandi”, “Yopish, tugma” deb o‘qiydi.',
        difficulty: 'EASY',
        starterFiles: site(A11Y, A11Y_CSS),
        checks: [
          has('search', 'Qidiruv tugmasining nomi bor', 'button.qidiruv[aria-label="Qidirish"]'),
          has('close', 'Yopish tugmasining nomi bor', 'button.yopish[aria-label="Yopish"]'),
          has('hidden', 'Barcha SVG bezak sifatida yashirin', 'svg:not([aria-hidden="true"])', {
            min: 0,
            max: 0,
          }),
          has('focus', 'SVG fokuslanmaydi', 'svg[focusable="false"]', { min: 3 }),
          has('text', 'Holat matni saqlangan', '.holat', { hidden: true }),
        ],
      },
    },
    {
      slug: 'rasm-bezagi',
      title: 'Rasmlarni bezash',
      exercise: {
        title: 'Bir xil ramkadagi galereya',
        description: 'Nisbat, qirqish, burchak va avatar halqasi.',
        instructions: md(
          '1. `.galereya img`: `aspect-ratio: 4 / 3`, `object-fit: cover`, `border-radius: 12px`.',
          '2. `figcaption`: `margin-top: 8px`, `font-size: 0.875rem`, `color: #475569`.',
          '3. `.avatar`: `object-fit: cover`, `box-shadow: 0 0 0 2px white, 0 0 0 4px #0071dc` (ikki qavatli halqa).',
        ),
        expectedBehavior:
          'Har xil o‘lchamdagi rasmlar bir xil ramkada, yumaloq burchakli; avatar atrofida ko‘k halqa.',
        difficulty: 'EASY',
        starterFiles: site(GALLERY, GALLERY_CSS),
        checks: [
          style('ratio', 'Rasmlar 4:3', '.galereya img', 'aspect-ratio', '4 / 3'),
          style('cover', 'Rasmlar qirqib to‘ldiriladi', '.galereya img', 'object-fit', 'cover'),
          style('radius', 'Burchaklar yumaloq', '.galereya img', 'border-top-left-radius', '12px'),
          style('caption', 'Izoh matni xira va kichik', 'figcaption', 'color', '#475569'),
          style(
            'ring',
            'Avatar halqasi',
            '.avatar',
            'box-shadow',
            '0 0 0 2px white, 0 0 0 4px #0071dc',
          ),
        ],
      },
      quiz: quiz('4-modul testi: Ikonka va rasm', [
        q(
          'u4-current',
          'Nega SVG ikonkada `stroke="currentColor"` yoziladi?',
          [
            'Ikonka atrofdagi matn rangini oladi, hover’da birga o‘zgaradi',
            'Ikonka doim qora bo‘lishi uchun',
            'Brauzer SVG’ni tezroq chizadi',
            'Bu SVG uchun majburiy atribut',
          ],
          [0],
        ),
        q(
          'u4-em',
          'Ikonka o‘lchamini `1.25em` da berishning foydasi?',
          [
            'Ikonka matn o‘lchamiga mutanosib kattalashadi',
            'Ikonka doim 20px bo‘ladi',
            'Ikonka ekran kengligiga qarab o‘zgaradi',
            'Hech qanday foydasi yo‘q',
          ],
          [0],
        ),
        q(
          'u4-label',
          'Faqat ikonkadan iborat tugmaga nima qo‘shish shart?',
          [
            '`aria-label` yoki yashirin matn',
            '`title` atributi yetarli',
            'Hech narsa — ikonka o‘zi tushunarli',
            '`role="img"`',
          ],
          [0],
        ),
        q(
          'u4-decor',
          'Yonida matn bor ikonka uchun to‘g‘ri yozuv?',
          [
            '`aria-hidden="true"` — ekran o‘quvchi uni o‘tkazib yuboradi',
            '`aria-label` bilan ikonkani ham nomlash',
            '`alt` atributi',
            '`tabindex="0"`',
          ],
          [0],
        ),
        q(
          'u4-svg',
          'SVG ikonkaning ikonka shriftidan afzalliklari? (bir nechta javob)',
          [
            'Faqat kerakli ikonkalar yuklanadi',
            'Shrift yuklanmasa “kvadratcha” chiqmaydi',
            'Bir nechta rang va chiziq qalinligini boshqarish mumkin',
            'Ikonka shrifti har doim tezroq',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s04: Record<string, ProjectFile[]> = {
  'svg-ikonkalar': site(
    SVG_BUTTONS,
    `${SVG_CSS.replace('.tugma {\n  padding: 10px 16px;', '.tugma {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;')}

.ikonka {
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
}`,
  ),
  'bootstrap-icons': site(
    BI_BODY.replaceAll('"></i>', '" aria-hidden="true"></i>'),
    BI_CSS.replace(
      '.tugma {\n  padding: 8px 12px;',
      '.tugma {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 12px;',
    ),
    { head: `<link rel="stylesheet" href="${BI_CSS_URL}">` },
  ),
  'ikonka-a11y': site(
    A11Y.replace(
      '<button type="button" class="qidiruv">',
      '<button type="button" class="qidiruv" aria-label="Qidirish">',
    )
      .replace(
        '<button type="button" class="yopish">',
        '<button type="button" class="yopish" aria-label="Yopish">',
      )
      .replaceAll('<svg viewBox', '<svg aria-hidden="true" focusable="false" viewBox'),
    A11Y_CSS,
  ),
  'rasm-bezagi': site(
    GALLERY,
    `${GALLERY_CSS.replace(
      '  height: auto;\n}',
      '  height: auto;\n  aspect-ratio: 4 / 3;\n  object-fit: cover;\n  border-radius: 12px;\n}',
    ).replace(
      '  border-radius: 50%;\n}',
      '  border-radius: 50%;\n  object-fit: cover;\n  box-shadow: 0 0 0 2px white, 0 0 0 4px #0071dc;\n}',
    )}

figcaption {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #475569;
}`,
  ),
};
