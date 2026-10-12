import { after, at, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';
import { pic } from './08-components';

/** Markup shared by the starter files and the reference solutions. */
export const BODY12 = {
  tooltips: `<p>
  <button class="maslahat" aria-describedby="m1">
    Saqlash
    <span class="maslahat-matn" role="tooltip" id="m1">Ctrl + S</span>
  </button>
</p>`,
  imageStyling: `${pic('0071dc', 'Aziza Karimova', 120, 80).replace('<img', '<img class="avatar"')}
<div class="hamkorlar">
  ${pic('fec400', 'Hamkor tashkilot logotipi', 160, 60)}
</div>`,
  objectFit: `<div class="karta">${pic('0071dc', 'Ko‘k manzara', 600, 200)}</div>
${pic('fec400', 'Kompaniya logotipi', 300, 80).replace('<img', '<img class="logo"')}
${pic('16a34a', 'Talaba portreti', 200, 400).replace('<img', '<img class="portret"')}`,
  masking: `<div class="doira">Doira</div>
<section class="qahramon"><h1>Qiya banner</h1></section>
<p class="sonuvchi">Uzun matnning pastki qismi silliq so‘nib boradi va “davomi bor” degan taassurot qoldiradi.</p>`,
  buttons: `<button class="tugma">Saqlash</button>
<button class="tugma tugma-ikkinchi">Bekor qilish</button>
<button class="tugma" disabled>Yuborilmoqda…</button>`,
  pagination: `<nav class="sahifalash" aria-label="Sahifalar">
  <ul>
    <li><a href="?p=1" aria-label="Oldingi sahifa">‹</a></li>
    <li><a href="?p=1">1</a></li>
    <li><a href="?p=2" aria-current="page">2</a></li>
    <li><a href="?p=3">3</a></li>
    <li><a href="?p=3" aria-label="Keyingi sahifa">›</a></li>
  </ul>
</nav>`,
  columns: `<article class="maqola">
  <h2>Yangiliklar</h2>
  <p>Yangi CSS kursi ochildi. Unda yuzdan ortiq dars va har birida amaliy mashq bor.</p>
  <figure>${pic('0071dc', 'Kurs muqovasi', 200, 120)}<figcaption>Kurs muqovasi</figcaption></figure>
  <p>Mashqlar serverda haqiqiy brauzer yordamida tekshiriladi.</p>
  <p>Kurs oxirida portfolio uchun loyiha tayyorlaysiz.</p>
</article>`,
  ui: `<nav><a href="#bolim">Bo‘limga o‘tish</a></nav>
<h2 id="bolim">Bo‘lim</h2>
<textarea>Izoh</textarea>
<button class="tugma">Tugma</button>
<button class="yopiq" disabled>O‘chirilgan</button>
<div class="qoplama"></div>`,
  boxSizing: `<div class="qator">
  <div class="ustun">Chap ustun</div>
  <div class="ustun">O‘ng ustun</div>
</div>
<form class="forma"><input placeholder="Ism"></form>
<p class="belgi">Psevdoelement</p>`,
};

export const TOOLTIP_CSS = `.maslahat-matn {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #0e1133;
  color: white;
  font-size: 0.75rem;
  white-space: nowrap;
}`;

export const MASK_CSS = `.doira {
  width: 160px;
  height: 160px;
  background-color: #0071dc;
}

.qahramon {
  padding: 48px 16px;
  background-color: #0e1133;
  color: white;
}`;

export const BUTTONS_CSS = `body {
  font: 16px/1.5 Arial, sans-serif;
}`;

export const UI_CSS = `.qoplama {
  position: fixed;
  inset: 0;
  background: linear-gradient(transparent 80%, rgba(0, 0, 0, 0.05));
}`;

export const BOX_SIZING_CSS = `body {
  margin: 0;
}

.qator {
  display: flex;
}

.ustun {
  width: 50%;
  padding: 16px;
  border: 2px solid #0071dc;
}

input {
  width: 100%;
  padding: 10px;
}

.belgi::before {
  content: "★";
  padding: 4px;
}`;

export const m12: ModuleDef = {
  title: 'Rasmlar va interfeys',
  lessons: [
    {
      slug: 'tooltips',
      title: 'Maslahat oynasi',
      exercise: {
        title: 'Klaviatura bilan ham ishlaydigan tooltip',
        description: '`absolute` joylashuv, `opacity`, `pointer-events`, hover va fokus.',
        instructions: md(
          '1. `.maslahat`: `position: relative`.',
          '2. `.maslahat-matn`: `position: absolute`, `bottom: calc(100% + 8px)`, `left: 50%`, `transform: translateX(-50%)`, `opacity: 0`, `pointer-events: none`.',
          '3. `.maslahat:hover` va `.maslahat:focus-visible` da `.maslahat-matn` — `opacity: 1`.',
        ),
        expectedBehavior:
          'Tugma ustida “Ctrl + S” izohi — sichqoncha bilan ham, Tab bilan ham chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY12.tooltips, `p {\n  margin-top: 60px;\n}\n\n${TOOLTIP_CSS}`),
        checks: [
          style('rel', 'Tugma `relative`', '.maslahat', 'position', 'relative'),
          style('hidden', 'Izoh boshida ko‘rinmaydi', '.maslahat-matn', 'opacity', '0'),
          style(
            'events',
            'Izoh sichqonchaga xalaqit bermaydi',
            '.maslahat-matn',
            'pointer-events',
            'none',
          ),
          after(
            [
              { type: 'hover', selector: '.maslahat' },
              { type: 'wait', ms: 400 },
            ],
            style('hover', 'Hover’da ko‘rinadi', '.maslahat-matn', 'opacity', '1'),
          ),
          after(
            [
              { type: 'press', selector: 'body', key: 'Tab' },
              { type: 'wait', ms: 400 },
            ],
            style('focus', 'Fokusda ko‘rinadi', '.maslahat-matn', 'opacity', '1', {
              hint: '`.maslahat:focus-visible .maslahat-matn`',
            }),
          ),
        ],
      },
    },
    {
      slug: 'image-styling',
      title: 'Rasmlarni bezash',
      exercise: {
        title: 'Avatar va kulrang logotiplar',
        description: '`display: block`, doira avatar va `filter`.',
        instructions: md(
          '1. Barcha `img`: `display: block`, `max-width: 100%`, `height: auto`.',
          '2. `.avatar`: `width: 64px`, `height: 64px`, `border-radius: 50%`, `object-fit: cover`.',
          '3. `.hamkorlar img`: `filter: grayscale(1)`; hover’da `filter: none`.',
        ),
        expectedBehavior: 'Doira avatar (cho‘zilmagan), kulrang logotip hover’da rangli bo‘ladi.',
        difficulty: 'EASY',
        starterFiles: site(BODY12.imageStyling, TODO),
        checks: [
          style('block', 'Rasmlar blok', '.hamkorlar img', 'display', 'block'),
          style('avatar', 'Avatar doira', '.avatar', 'border-top-left-radius', '50%'),
          style('cover', 'Avatar cho‘zilmaydi', '.avatar', 'object-fit', 'cover'),
          style('gray', 'Logotip kulrang', '.hamkorlar img', 'filter', 'grayscale(1)'),
          after(
            [
              { type: 'hover', selector: '.hamkorlar img' },
              { type: 'wait', ms: 400 },
            ],
            style('hover', 'Hover’da rangli', '.hamkorlar img', 'filter', 'none'),
          ),
        ],
      },
    },
    {
      slug: 'object-fit',
      title: '`object-fit`',
      exercise: {
        title: 'Rasmni qutiga sig‘dirish',
        description: '`cover`, `contain` va `object-position`.',
        instructions: md(
          '1. `.karta img`: `width: 100%`, `height: 200px`, `object-fit: cover`.',
          '2. `.logo`: `width: 160px`, `height: 80px`, `object-fit: contain`.',
          '3. `.portret`: `width: 200px`, `height: 200px`, `object-fit: cover`, `object-position: top`.',
        ),
        expectedBehavior:
          'Kartochka rasmi cho‘zilmagan, logotip to‘liq, portretning yuqori qismi ko‘rinadi.',
        difficulty: 'EASY',
        starterFiles: site(BODY12.objectFit, '.karta {\n  max-width: 400px;\n}'),
        checks: [
          style('cover', 'Kartochka rasmi `cover`', '.karta img', 'object-fit', 'cover'),
          style('height', 'Kartochka rasmi 200px', '.karta img', 'height', '200px'),
          style('contain', 'Logotip `contain`', '.logo', 'object-fit', 'contain'),
          style('position', 'Portretning yuqori qismi', '.portret', 'object-position', 'top'),
        ],
      },
    },
    {
      slug: 'masking',
      title: 'Niqoblash va kesish',
      exercise: {
        title: 'Doira, qiya banner va so‘nish',
        description: '`clip-path` va `mask-image`.',
        instructions: md(
          '1. `.doira`: `clip-path: circle(50%)`.',
          '2. `.qahramon`: `clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)`.',
          '3. `.sonuvchi`: `mask-image: linear-gradient(to bottom, black 40%, transparent)`.',
        ),
        expectedBehavior: 'Doira shakli, pastki cheti qiya banner, pastga qarab so‘nadigan matn.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY12.masking, MASK_CSS),
        checks: [
          style('circle', 'Doira shakli', '.doira', 'clip-path', 'circle(50%)'),
          style(
            'polygon',
            'Qiya banner',
            '.qahramon',
            'clip-path',
            'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          ),
          style(
            'mask',
            'Matn silliq so‘nadi',
            '.sonuvchi',
            'mask-image',
            'linear-gradient(to bottom, black 40%, transparent)',
          ),
        ],
      },
    },
    {
      slug: 'buttons',
      title: 'Tugmalar',
      exercise: {
        title: 'Tugmalar to‘plami',
        description: 'Asosiy va ikkinchi darajali tugma, holatlar, bosish maydoni.',
        instructions: md(
          '1. `.tugma`: `display: inline-flex`, `align-items: center`, `min-height: 44px`, `padding: 0 20px`, `border: 2px solid transparent`, `border-radius: 8px`, fon `#0071dc`, oq matn, `font: inherit`.',
          '2. `.tugma:hover`: fon `#005bb0`.',
          '3. `.tugma:disabled`: `opacity: 0.5`, `cursor: not-allowed`.',
          '4. `.tugma-ikkinchi`: fon `transparent`, chegara va matn `#0071dc`. (Bu qoidani hover’dan keyin yozing.)',
        ),
        expectedBehavior: 'Ko‘k asosiy tugma, chegarali ikkinchi tugma va xira o‘chirilgan tugma.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY12.buttons, BUTTONS_CSS),
        checks: [
          style('flex', 'Tugma `inline-flex`', '.tugma', 'display', 'inline-flex'),
          style('height', 'Bosish maydoni kamida 44px', '.tugma', 'min-height', '44px'),
          after(
            [{ type: 'hover', selector: '.tugma' }],
            style('hover', 'Hover’da to‘q ko‘k', '.tugma', 'background-color', '#005bb0'),
          ),
          style('disabled', 'O‘chirilgan tugma xira', '.tugma:disabled', 'opacity', '0.5'),
          style(
            'secondary',
            'Ikkinchi tugma fonsiz',
            '.tugma-ikkinchi',
            'background-color',
            'transparent',
          ),
        ],
      },
    },
    {
      slug: 'pagination',
      title: 'Sahifalash',
      exercise: {
        title: 'Sahifa raqamlari',
        description: 'Flex qator, bir xil kataklar va joriy sahifa.',
        instructions: md(
          '1. `.sahifalash ul`: `display: flex`, `gap: 4px`, belgisiz, `margin: 0`, `padding: 0`.',
          '2. `.sahifalash a`: `display: grid`, `place-items: center`, `min-width: 40px`, `height: 40px`, chegara `1px solid #e5e7eb`, tagchiziqsiz.',
          '3. `a[aria-current="page"]`: fon `#0071dc`, oq matn.',
        ),
        expectedBehavior: 'Bir qatordagi bir xil kataklar, joriy sahifa ko‘k.',
        difficulty: 'EASY',
        starterFiles: site(BODY12.pagination, TODO),
        checks: [
          style('flex', 'Raqamlar bir qatorda', '.sahifalash ul', 'display', 'flex'),
          style('gap', 'Oraliq 4px', '.sahifalash ul', 'column-gap', '4px'),
          style('min', 'Katak kamida 40px', '.sahifalash a', 'min-width', '40px'),
          style('height', 'Katak balandligi 40px', '.sahifalash a', 'height', '40px'),
          style(
            'current',
            'Joriy sahifa ko‘k',
            '[aria-current="page"]',
            'background-color',
            '#0071dc',
          ),
        ],
      },
    },
    {
      slug: 'multi-columns',
      title: 'Ko‘p ustunli matn',
      exercise: {
        title: 'Gazeta ustunlari',
        description: '`column-width`, `column-gap`, `column-rule`, `column-span`.',
        instructions: md(
          '1. `.maqola`: `column-width: 220px`, `column-gap: 32px`, `column-rule: 1px solid #e5e7eb`.',
          '2. `.maqola h2`: `column-span: all`.',
          '3. `.maqola figure`: `break-inside: avoid`.',
        ),
        expectedBehavior:
          'Ekran kengligiga qarab ustunlar soni o‘zgaradi, sarlavha hammasining ustida.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY12.columns, TODO),
        checks: [
          style('width', 'Ustun kengligi 220px', '.maqola', 'column-width', '220px'),
          style('gap', 'Ustunlar orasida 32px', '.maqola', 'column-gap', '32px'),
          style('rule', 'Ustunlar orasida chiziq', '.maqola', 'column-rule-style', 'solid'),
          style('span', 'Sarlavha barcha ustunlarda', '.maqola h2', 'column-span', 'all'),
          style('avoid', 'Rasm bo‘linmaydi', '.maqola figure', 'break-inside', 'avoid'),
        ],
      },
    },
    {
      slug: 'user-interface',
      title: 'Interfeys xususiyatlari',
      exercise: {
        title: 'O‘zaro ta’sirni sozlash',
        description: '`scroll-behavior`, `resize`, `cursor`, `user-select`, `pointer-events`.',
        instructions: md(
          '1. `html`: `scroll-behavior: smooth`; `h2`: `scroll-margin-top: 80px`.',
          '2. `textarea`: `resize: vertical`.',
          '3. `.yopiq`: `cursor: not-allowed`; `.tugma`: `user-select: none`.',
          '4. `.qoplama` butun sahifani yopib, tugmalarni bosib bo‘lmayapti — `pointer-events: none` bering.',
        ),
        expectedBehavior:
          'Silliq aylanish, faqat balandligi o‘zgaradigan izoh maydoni, bosiladigan tugmalar.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY12.ui, UI_CSS),
        checks: [
          style('smooth', 'Silliq aylanish', 'html', 'scroll-behavior', 'smooth'),
          style('margin', 'Bo‘lim 80px pastda to‘xtaydi', 'h2', 'scroll-margin-top', '80px'),
          style('resize', 'Izoh faqat vertikal', 'textarea', 'resize', 'vertical'),
          style('cursor', 'O‘chirilgan tugmada taqiq kursori', '.yopiq', 'cursor', 'not-allowed'),
          style(
            'events',
            'Qoplama bosishga xalaqit bermaydi',
            '.qoplama',
            'pointer-events',
            'none',
          ),
        ],
      },
    },
    {
      slug: 'box-sizing',
      title: '`box-sizing` — batafsil',
      exercise: {
        title: 'Hammasi `border-box`',
        description: 'Butun sahifa uchun `box-sizing`.',
        instructions: md(
          'Ustunlar ham, maydon ham sig‘mayapti. `style.css` boshiga yozing:',
          '',
          '```css',
          '*,',
          '*::before,',
          '*::after {',
          '  box-sizing: border-box;',
          '}',
          '```',
        ),
        expectedBehavior: 'Ikki ustun aynan yarim kenglikda, maydon ekrandan chiqmaydi.',
        difficulty: 'EASY',
        starterFiles: site(BODY12.boxSizing, BOX_SIZING_CSS),
        checks: [
          style('col', 'Ustun `border-box`', '.ustun', 'box-sizing', 'border-box'),
          at(800, 600, style('col-w', 'Ustun aynan 400px', '.ustun', 'width', '400px')),
          at(800, 600, style('input', 'Maydon 800px dan oshmaydi', 'input', 'width', '800px')),
          style('pseudo', 'Psevdoelement ham `border-box`', '.belgi', 'box-sizing', 'border-box', {
            pseudo: '::before',
            hint: '`*` psevdoelementlarni tanlamaydi.',
          }),
        ],
      },
      quiz: quiz('12-modul testi: Rasmlar va interfeys', [
        q(
          'q1',
          'Tooltip klaviatura foydalanuvchilariga ham ko‘rinishi uchun qaysi psevdoklass kerak?',
          ['`:focus-visible`', '`:hover`', '`:visited`', '`:checked`'],
          [0],
        ),
        q(
          'q2',
          'Rasmni cho‘zmasdan qutini to‘ldirish uchun?',
          ['`object-fit: cover`', '`object-fit: fill`', '`object-fit: none`', '`filter: none`'],
          [0],
        ),
        q(
          'q3',
          'Elementni geometrik shakl bo‘yicha kesadigan xususiyat?',
          ['`clip-path`', '`overflow`', '`opacity`', '`outline`'],
          [0],
        ),
        q(
          'q4',
          'Yaxshi tugma haqida qaysilari to‘g‘ri?',
          [
            'Fokus holati ko‘rinib turadi',
            'Bosish maydoni kamida 44px',
            'Har bir tugma bir xil darajada ajralib turadi',
            'Boshqa sahifaga olib borsa ham `<button>` bo‘ladi',
          ],
          [0, 1],
        ),
        q(
          'q5',
          '`box-sizing: border-box` da `width: 300px; padding: 20px; border: 5px` element kengligi?',
          ['300px', '350px', '340px', '310px'],
          [0],
        ),
      ]),
    },
  ],
};
