import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  app,
  at,
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

const NAV = `<header class="sarlavha">
  <a class="logo" href="#">WEBDIZAYN.UZ</a>
  <button type="button" class="burger" aria-expanded="false" aria-controls="menyu">
    <span class="sr-only">Menyu</span>
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2"/></svg>
  </button>
  <nav>
    <ul id="menyu" class="menyu">
      <li><a href="#">Kurslar</a></li>
      <li><a href="#">Narxlar</a></li>
      <li><a href="#">Aloqa</a></li>
    </ul>
  </nav>
</header>`;

const NAV_CSS = `${RESET}

.sarlavha {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
}

.burger {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
}

nav {
  flex-basis: 100%;
}

.menyu {
  display: none;
  margin: 0;
  padding: 0;
  list-style: none;
}

.menyu a {
  display: block;
  padding: 12px 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .burger {
    display: none;
  }

  nav {
    flex-basis: auto;
  }

  .menyu {
    display: flex;
    gap: 24px;
  }
}`;

const NAV_JS = `const burger = document.querySelector('.burger');
const menyu = document.querySelector('#menyu');

// Tugma bosilganda menyuni oching yoki yoping va aria-expanded ni yangilang.`;

const NAV_JS_DONE = `const burger = document.querySelector('.burger');
const menyu = document.querySelector('#menyu');

burger.addEventListener('click', () => {
  const ochiq = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!ochiq));
  menyu.classList.toggle('ochiq', !ochiq);
});`;

const TABLE = `<table class="jadval">
  <thead>
    <tr><th>Kurs</th><th>Darslar</th><th>Mashqlar</th><th>Narx</th></tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Kurs">HTML</td><td data-label="Darslar">60</td>
      <td data-label="Mashqlar">49</td><td data-label="Narx">Bepul</td>
    </tr>
    <tr>
      <td data-label="Kurs">CSS</td><td data-label="Darslar">101</td>
      <td data-label="Mashqlar">101</td><td data-label="Narx">Bepul</td>
    </tr>
  </tbody>
</table>`;

const TABLE_CSS = `${RESET}

.jadval {
  width: 100%;
  border-collapse: collapse;
}

.jadval th,
.jadval td {
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}`;

const FORM = `<form class="forma">
  <label class="maydon">Ism <input name="ism" autocomplete="given-name"></label>
  <label class="maydon">Familiya <input name="familiya" autocomplete="family-name"></label>
  <label class="maydon toliq">Email <input type="email" name="email" autocomplete="email"></label>
  <label class="maydon toliq">Xabar <textarea name="xabar" rows="4"></textarea></label>
  <button type="submit" class="toliq">Yuborish</button>
</form>`;

const FORM_CSS = `${RESET}

.maydon {
  display: grid;
  gap: 4px;
}

input,
textarea {
  font-size: 13px;
  padding: 4px;
}`;

const CARDS = `<div class="kartalar">
  <article class="karta">
    <div class="karta-tana">
      <h2>HTML</h2>
      <p>Sahifa tuzilishidan formalargacha.</p>
    </div>
    <a class="tugma" href="#">Boshlash</a>
  </article>
  <article class="karta">
    <div class="karta-tana">
      <h2>CSS</h2>
      <p>Ranglar, shriftlar, maketlar, animatsiyalar va moslashuvchan dizayn — eng katta kurs.</p>
    </div>
    <a class="tugma" href="#">Boshlash</a>
  </article>
  <article class="karta">
    <div class="karta-tana">
      <h2>JavaScript</h2>
      <p>Sahifani jonlantirish.</p>
    </div>
    <a class="tugma" href="#">Boshlash</a>
  </article>
</div>`;

const CARDS_CSS = `${RESET}

.karta {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.tugma {
  display: inline-block;
  padding: 10px 16px;
  background-color: #0071dc;
  color: white;
}`;

const DIALOG = `<button type="button" class="och">Fikr qoldirish</button>
<dialog class="oyna">
  <form method="dialog">
    <h2>Fikringiz</h2>
    <textarea rows="4"></textarea>
    <button>Yopish</button>
  </form>
</dialog>`;

const DIALOG_JS = `const oyna = document.querySelector('.oyna');
document.querySelector('.och').addEventListener('click', () => oyna.showModal());`;

export const m05: ModuleDef = {
  title: 'Moslashuvchan komponentlar',
  lessons: [
    {
      slug: 'navigatsiya',
      title: 'Mobil navigatsiya',
      exercise: {
        title: 'Burger menyu',
        description: 'Tugma bilan ochiladigan menyu va `aria-expanded`.',
        instructions: md(
          '1. `script.js` da `.burger` bosilganda `aria-expanded` ni `true`/`false` ga almashtiring va `#menyu` ga `ochiq` klassini qo‘shing yoki olib tashlang.',
          '2. `style.css` ga `.menyu.ochiq { display: block; }` qoidasini qo‘shing (media so‘rovdan oldin).',
        ),
        expectedBehavior:
          'Telefonda menyu yopiq; burger bosilganda ochiladi va ekran o‘quvchi “ochiq” holatni biladi. Kompyuterda menyu doim ko‘rinadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(NAV, NAV_JS, { css: NAV_CSS }),
        checks: [
          at(375, 700, style('closed', 'Telefonda menyu yopiq', '.menyu', 'display', 'none')),
          at(
            375,
            700,
            after(
              click('.burger'),
              style('open', 'Burger menyuni ochadi', '.menyu', 'display', 'block'),
            ),
          ),
          at(
            375,
            700,
            after(
              click('.burger'),
              attr('aria', '`aria-expanded` yangilanadi', '.burger', 'aria-expanded', 'true'),
            ),
          ),
          at(1000, 700, style('desktop', 'Kompyuterda menyu qatorda', '.menyu', 'display', 'flex')),
        ],
      },
    },
    {
      slug: 'jadvallar',
      title: 'Moslashuvchan jadvallar',
      exercise: {
        title: 'Telefonda kartochkaga aylanadigan jadval',
        description: '`display: block` va `data-label` bilan qatorlarni kartochka qilish.',
        instructions: md(
          '`@media (max-width: 599px)` ichida:',
          '1. `.jadval thead` — `display: none`.',
          '2. `.jadval tr` va `.jadval td` — `display: block`; `tr` ga `margin-bottom: 12px`.',
          '3. `.jadval td::before` — `content: attr(data-label) ": "`, `font-weight: 700`.',
        ),
        expectedBehavior: 'Telefonda har bir qator alohida kartochka, katta ekranda oddiy jadval.',
        difficulty: 'MEDIUM',
        starterFiles: site(TABLE, TABLE_CSS),
        checks: [
          at(
            375,
            700,
            style('head', 'Telefonda sarlavha qatori yashirin', '.jadval thead', 'display', 'none'),
          ),
          at(375, 700, style('row', 'Telefonda qator kartochka', '.jadval tr', 'display', 'block')),
          at(
            375,
            700,
            style('label', 'Har katakda nom qalin', '.jadval td', 'font-weight', '700', {
              pseudo: '::before',
            }),
          ),
          at(
            1000,
            700,
            style('table', 'Katta ekranda oddiy jadval', '.jadval tr', 'display', 'table-row'),
          ),
        ],
      },
    },
    {
      slug: 'formalar',
      title: 'Moslashuvchan formalar',
      exercise: {
        title: 'Ikki ustunli forma',
        description: 'Grid, to‘liq kenglikdagi maydonlar va barmoqqa qulay o‘lcham.',
        instructions: md(
          '1. `.forma`: `display: grid`, `gap: 16px`.',
          '2. `@media (min-width: 640px)`: `.forma` — `grid-template-columns: 1fr 1fr`; `.toliq` — `grid-column: 1 / -1`.',
          '3. `input, textarea`: `width: 100%`, `font-size: 1rem` (iPhone kattalashtirmaydi), `min-height: 44px`, `padding: 10px 12px`.',
        ),
        expectedBehavior: 'Telefonda bitta ustun, kengroq ekranda ism va familiya yonma-yon.',
        difficulty: 'MEDIUM',
        starterFiles: site(FORM, FORM_CSS),
        checks: [
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.forma', 'grid-template-columns', '375px'),
          ),
          at(
            800,
            700,
            style(
              'two',
              'Kengroq ekranda ikki ustun',
              '.forma',
              'grid-template-columns',
              '392px 392px',
            ),
          ),
          at(
            800,
            700,
            style('full', 'Email va xabar to‘liq kenglikda', '.toliq', 'grid-column-end', '-1'),
          ),
          style('font', 'Maydon matni 16px', 'input', 'font-size', '16px', {
            hint: '16px dan kichik shrift bo‘lsa, iPhone maydonni bosganda sahifani kattalashtiradi.',
          }),
          style('tap', 'Maydon kamida 44px', 'input', 'min-height', '44px'),
        ],
      },
    },
    {
      slug: 'kartalar',
      title: 'Kartalar to‘ri',
      exercise: {
        title: 'Bir xil balandlikdagi kartalar',
        description: 'Grid to‘r va kartaning ichki Flexbox tuzilishi.',
        instructions: md(
          '1. `.kartalar`: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr))`, `gap: 20px`.',
          '2. `.karta`: `display: flex`, `flex-direction: column`.',
          '3. `.karta-tana`: `flex-grow: 1` — tugmalar har doim kartaning pastida bir qatorda turadi.',
        ),
        expectedBehavior:
          'Kartalar bir xil balandlikda, tugmalar pastki chetda tekis; ustunlar soni ekranga moslashadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(CARDS, CARDS_CSS),
        checks: [
          at(
            1000,
            700,
            style(
              'cols',
              'Keng ekranda 3 ustun',
              '.kartalar',
              'grid-template-columns',
              '320px 320px 320px',
            ),
          ),
          at(
            375,
            700,
            style('one', 'Telefonda 1 ustun', '.kartalar', 'grid-template-columns', '375px'),
          ),
          style('flex', 'Karta flex ustun', '.karta', 'flex-direction', 'column'),
          style('grow', 'Matn qismi bo‘sh joyni egallaydi', '.karta-tana', 'flex-grow', '1'),
        ],
      },
    },
    {
      slug: 'dialog',
      title: 'Mobilda to‘liq ekran dialog',
      exercise: {
        title: 'Moslashuvchan modal oyna',
        description: '`<dialog>`: kompyuterda markazda, telefonda to‘liq ekran.',
        instructions: md(
          '1. `.oyna`: `width: min(100% - 2rem, 32rem)`, `padding: 24px`, `border: 0`, `border-radius: 12px`.',
          '2. `@media (max-width: 599px)`: `.oyna` — `width: 100%`, `height: 100%`, `max-width: none`, `max-height: none`, `margin: 0`, `border-radius: 0`.',
          '3. `.oyna::backdrop`: `background-color: rgb(15 23 42 / 0.6)`.',
        ),
        expectedBehavior:
          'Telefonda oyna butun ekranni egallaydi, kompyuterda markazda 32rem kenglikda.',
        difficulty: 'MEDIUM',
        starterFiles: app(DIALOG, DIALOG_JS, { css: RESET }),
        checks: [
          at(
            375,
            700,
            after(
              click('.och'),
              style('w-sm', 'Telefonda to‘liq kenglik', '.oyna', 'width', '375px'),
            ),
          ),
          at(
            375,
            700,
            after(
              click('.och'),
              style('h-sm', 'Telefonda to‘liq balandlik', '.oyna', 'height', '700px'),
            ),
          ),
          at(
            1000,
            700,
            after(click('.och'), style('w-lg', 'Kompyuterda 32rem', '.oyna', 'width', '512px')),
          ),
          at(
            1000,
            700,
            after(
              click('.och'),
              style(
                'r-lg',
                'Kompyuterda burchaklar yumaloq',
                '.oyna',
                'border-top-left-radius',
                '12px',
              ),
            ),
          ),
        ],
      },
      quiz: quiz('5-modul testi: Moslashuvchan komponentlar', [
        q(
          'm5-aria',
          'Burger tugmasida `aria-expanded` nima uchun kerak?',
          [
            'Ekran o‘quvchi menyu ochiq yoki yopiqligini aytadi',
            'Menyu animatsiyasi uchun',
            'Tugma rangini o‘zgartirish uchun',
            'Qidiruv tizimi uchun',
          ],
          [0],
        ),
        q(
          'm5-table',
          'Keng jadvalni telefonda ko‘rsatishning to‘g‘ri usullari? (bir nechta javob)',
          [
            'Jadvalni `overflow-x: auto` o‘ramga solish',
            'Qatorlarni `data-label` bilan kartochkaga aylantirish',
            'Shriftni 8px qilish',
            'Jadvalni telefonda butunlay yashirish',
          ],
          [0, 1],
        ),
        q(
          'm5-input',
          'Nega forma maydonida shrift kamida 16px bo‘lishi tavsiya etiladi?',
          [
            'Kichikroq bo‘lsa, iPhone maydonni bosganda sahifani kattalashtiradi',
            'Server 16px dan kichik matnni qabul qilmaydi',
            'Brauzer 16px dan kichik shriftni ko‘rsatmaydi',
            'Faqat dizayn didi uchun',
          ],
          [0],
        ),
        q(
          'm5-card',
          'Kartalardagi tugmalarni pastki chetda tekislashning oson yo‘li?',
          [
            'Kartani `flex-direction: column` qilib, matn qismiga `flex-grow: 1` berish',
            'Har bir kartaga qo‘lda `height` yozish',
            'Tugmalarga `position: fixed` berish',
            'Matnni qisqartirish',
          ],
          [0],
        ),
        q(
          'm5-dialog',
          '`<dialog>` ni `showModal()` bilan ochishning afzalliklari? (bir nechta javob)',
          [
            'Esc tugmasi bilan yopiladi',
            'Fokus oyna ichida qoladi, orqa sahifa bosilmaydi',
            '`::backdrop` bilan fonni xiralashtirish mumkin',
            'Oyna avtomatik ravishda tarjima qilinadi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s05: Record<string, ProjectFile[]> = {
  navigatsiya: app(NAV, NAV_JS_DONE, {
    css: NAV_CSS.replace(
      '@media (min-width: 768px) {',
      '.menyu.ochiq {\n  display: block;\n}\n\n@media (min-width: 768px) {',
    ),
  }),
  jadvallar: site(
    TABLE,
    `${TABLE_CSS}

@media (max-width: 599px) {
  .jadval thead {
    display: none;
  }

  .jadval tr,
  .jadval td {
    display: block;
  }

  .jadval tr {
    margin-bottom: 12px;
  }

  .jadval td::before {
    content: attr(data-label) ": ";
    font-weight: 700;
  }
}`,
  ),
  formalar: site(
    FORM,
    `${RESET}

.forma {
  display: grid;
  gap: 16px;
}

.maydon {
  display: grid;
  gap: 4px;
}

input,
textarea {
  width: 100%;
  font-size: 1rem;
  min-height: 44px;
  padding: 10px 12px;
}

@media (min-width: 640px) {
  .forma {
    grid-template-columns: 1fr 1fr;
  }

  .toliq {
    grid-column: 1 / -1;
  }
}`,
  ),
  kartalar: site(
    CARDS,
    `${CARDS_CSS}

.kartalar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 20px;
}

.karta {
  display: flex;
  flex-direction: column;
}

.karta-tana {
  flex-grow: 1;
}`,
  ),
  dialog: app(DIALOG, DIALOG_JS, {
    css: `${RESET}

.oyna {
  width: min(100% - 2rem, 32rem);
  padding: 24px;
  border: 0;
  border-radius: 12px;
}

.oyna::backdrop {
  background-color: rgb(15 23 42 / 0.6);
}

@media (max-width: 599px) {
  .oyna {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    border-radius: 0;
  }
}`,
  }),
};
