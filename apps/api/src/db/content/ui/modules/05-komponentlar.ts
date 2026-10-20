import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  app,
  attr,
  has,
  md,
  q,
  quiz,
  RESET,
  site,
  style,
  type ModuleDef,
} from '../../design/shared';

const tab = [{ type: 'press' as const, selector: 'body', key: 'Tab' }];
const hover = (selector: string) => [{ type: 'hover' as const, selector }];
const click = (selector: string) => [{ type: 'click' as const, selector }];

const VARIANTS = `<div class="qator">
  <button type="button" class="tugma tugma--asosiy">Saqlash</button>
  <button type="button" class="tugma tugma--chegarali">Bekor qilish</button>
  <button type="button" class="tugma tugma--xavfli">O‘chirish</button>
</div>`;

const VARIANTS_CSS = `${RESET}

.qator {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px;
}`;

const STATES = `<div class="qator">
  <button type="button" class="tugma">Yuborish</button>
  <button type="button" class="tugma" disabled>Kutilmoqda</button>
</div>`;

const STATES_CSS = `${RESET}

.qator {
  display: flex;
  gap: 12px;
  padding: 24px;
}

.tugma {
  min-height: 44px;
  padding-inline: 18px;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  color: white;
  background-color: #0071dc;
  outline: none;
}`;

const FIELDS = `<form class="forma">
  <div class="maydon">
    <label for="ism">Ism</label>
    <input id="ism" name="ism" autocomplete="given-name">
  </div>
  <div class="maydon">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" value="aziz@" aria-invalid="true" aria-describedby="email-xato">
    <p id="email-xato" class="xato">Email to‘liq emas: @ dan keyin domen yozing.</p>
  </div>
</form>`;

const FIELDS_CSS = `${RESET}

.forma {
  display: grid;
  gap: 20px;
  max-width: 420px;
  padding: 24px;
}

.maydon {
  display: grid;
  gap: 6px;
}

input {
  min-height: 44px;
  padding: 8px 12px;
  font: inherit;
  border: 1px solid #e2e8f0;
  outline: none;
}

.xato {
  margin: 0;
}`;

const CARD = `<article class="karta">
  <header class="karta-bosh">
    <h2>Mart oyi hisoboti</h2>
  </header>
  <div class="karta-tana">
    <p>Daromad o‘tgan oyga nisbatan 12% oshdi.</p>
  </div>
  <footer class="karta-oyoq">
    <a href="#">To‘liq hisobot</a>
  </footer>
</article>`;

const CARD_CSS = `${RESET}

body {
  padding: 24px;
  background-color: #f1f5f9;
}

.karta {
  max-width: 420px;
}

.karta h2,
.karta p {
  margin: 0;
}

.karta-bosh,
.karta-tana,
.karta-oyoq {
  padding: 16px 20px;
}`;

const ALERTS = `<div class="xabarlar">
  <div class="xabar xabar--muvaffaqiyat" role="status">To‘lov qabul qilindi.</div>
  <div class="xabar xabar--xato">Karta raqami noto‘g‘ri.</div>
  <p>Yangi xabarlar <span class="belgi">3</span></p>
</div>`;

const ALERTS_CSS = `${RESET}

.xabarlar {
  display: grid;
  gap: 12px;
  padding: 24px;
}

.xabar {
  padding: 12px 16px;
}`;

const TABS = `<div class="tablar">
  <div role="tablist" aria-label="Kurs ma’lumotlari">
    <button type="button" role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">Dastur</button>
    <button type="button" role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2">Narx</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">12 modul, 60 dars.</div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>Bepul.</div>
</div>`;

const TABS_CSS = `${RESET}

.tablar {
  padding: 24px;
}

[role="tablist"] {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e2e8f0;
}

[role="tab"] {
  min-height: 44px;
  padding-inline: 16px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  font: inherit;
  color: #475569;
}

[role="tabpanel"] {
  padding-block: 16px;
}`;

const TABS_JS = `const tablar = document.querySelectorAll('[role="tab"]');

// Tab bosilganda: hamma tablarda aria-selected="false", bosilganida "true";
// hamma panellarni hidden qiling, bosilgan tabning paneli (aria-controls) ko‘rinsin.`;

const TABS_JS_DONE = `const tablar = document.querySelectorAll('[role="tab"]');

tablar.forEach((tab) => {
  tab.addEventListener('click', () => {
    tablar.forEach((t) => {
      const tanlangan = t === tab;
      t.setAttribute('aria-selected', String(tanlangan));
      document.getElementById(t.getAttribute('aria-controls')).hidden = !tanlangan;
    });
  });
});`;

export const m05: ModuleDef = {
  title: 'Komponentlar',
  lessons: [
    {
      slug: 'tugmalar',
      title: 'Tugmalar',
      exercise: {
        title: 'Bitta asos, uch variant',
        description: 'Umumiy `.tugma` klassi va modifikatorlar.',
        instructions: md(
          '1. `.tugma`: `display: inline-flex`, `align-items: center`, `min-height: 44px`, `padding-inline: 18px`, `border: 1px solid transparent`, `border-radius: 8px`, `font: inherit`, `font-weight: 600`.',
          '2. `.tugma--asosiy`: fon `#0071dc`, matn `white`.',
          '3. `.tugma--chegarali`: fon `white`, matn `#0f172a`, `border-color: #cbd5e1`.',
          '4. `.tugma--xavfli`: fon `#b91c1c`, matn `white`.',
        ),
        expectedBehavior: 'Uch tugma bir xil o‘lcham va shaklda, faqat rangi vazifasiga mos.',
        difficulty: 'EASY',
        starterFiles: site(VARIANTS, VARIANTS_CSS),
        checks: [
          style('height', 'Tugma kamida 44px', '.tugma--chegarali', 'min-height', '44px'),
          style('radius', 'Bir xil yumaloqlik', '.tugma--xavfli', 'border-top-left-radius', '8px'),
          style('primary', 'Asosiy — ko‘k', '.tugma--asosiy', 'background-color', '#0071dc'),
          style(
            'outline',
            'Chegarali — kulrang chegara',
            '.tugma--chegarali',
            'border-top-color',
            '#cbd5e1',
          ),
          style('danger', 'Xavfli — qizil', '.tugma--xavfli', 'background-color', '#b91c1c'),
        ],
      },
    },
    {
      slug: 'tugma-holatlari',
      title: 'Tugma holatlari',
      exercise: {
        title: 'Hover, fokus va o‘chirilgan holat',
        description: '`:hover`, `:focus-visible` va `:disabled`.',
        instructions: md(
          '1. `.tugma:hover`: fon `#005bb5`.',
          '2. `.tugma:focus-visible`: `outline: 3px solid #59a2ff`, `outline-offset: 2px`.',
          '3. `.tugma:disabled`: `opacity: 0.5`, `cursor: not-allowed`.',
          'Eslatma: `outline: none` ni olib tashlamang — fokus faqat `:focus-visible` da ko‘rinadi.',
        ),
        expectedBehavior:
          'Sichqoncha olib borilganda tugma to‘qlashadi, klaviaturada aniq fokus halqasi, o‘chirilgan tugma xira.',
        difficulty: 'MEDIUM',
        starterFiles: site(STATES, STATES_CSS),
        checks: [
          after(
            hover('.tugma:not(:disabled)'),
            style(
              'hover',
              'Hover’da to‘qroq',
              '.tugma:not(:disabled)',
              'background-color',
              '#005bb5',
            ),
          ),
          after(
            tab,
            style(
              'focus',
              'Klaviatura fokusi ko‘rinadi',
              '.tugma:not(:disabled)',
              'outline-style',
              'solid',
            ),
          ),
          after(
            tab,
            style('focus-w', 'Fokus halqasi 3px', '.tugma:not(:disabled)', 'outline-width', '3px', {
              hidden: true,
            }),
          ),
          style('disabled', 'O‘chirilgan tugma xira', '.tugma:disabled', 'opacity', '0.5'),
          style(
            'cursor',
            'O‘chirilgan tugmada taqiq kursori',
            '.tugma:disabled',
            'cursor',
            'not-allowed',
          ),
        ],
      },
    },
    {
      slug: 'forma-maydonlari',
      title: 'Forma maydonlari',
      exercise: {
        title: 'Aniq chegaralar, fokus va xato holati',
        description: 'Maydon holatlari: oddiy, fokusda, xato.',
        instructions: md(
          '1. `input`: `border: 1px solid #94a3b8` (fonga nisbatan 3:1), `border-radius: 8px`.',
          '2. `input:focus-visible`: `border-color: #0071dc`, `box-shadow: 0 0 0 3px rgb(0 113 220 / 0.25)`.',
          '3. `input[aria-invalid="true"]`: `border-color: #b91c1c`.',
          '4. `.xato`: `color: #b91c1c`, `font-size: 0.875rem`; `label`: `font-weight: 600`.',
        ),
        expectedBehavior:
          'Maydon chegarasi aniq ko‘rinadi, fokusda ko‘k halqa, xatoli maydon va izoh qizil.',
        difficulty: 'MEDIUM',
        starterFiles: site(FIELDS, FIELDS_CSS),
        checks: [
          style(
            'border',
            'Maydon chegarasi yetarli kontrastli',
            '#ism',
            'border-top-color',
            '#94a3b8',
          ),
          after(tab, style('focus', 'Fokusda ko‘k chegara', '#ism', 'border-top-color', '#0071dc')),
          style('invalid', 'Xatoli maydon qizil', '#email', 'border-top-color', '#b91c1c'),
          style('message', 'Xato matni qizil', '.xato', 'color', '#b91c1c'),
          style('label', 'Yorliq qalin', 'label', 'font-weight', '600'),
        ],
      },
    },
    {
      slug: 'ui-kartalar',
      title: 'Kartalar',
      exercise: {
        title: 'Uch qismli karta',
        description: 'Sirt, chegara, ichki bo‘limlar va hover.',
        instructions: md(
          '1. `.karta`: fon `white`, `border: 1px solid #e2e8f0`, `border-radius: 12px`, `overflow: hidden`.',
          '2. `.karta-oyoq`: fon `#f8fafc`, `border-top: 1px solid #e2e8f0`.',
          '3. `.karta:hover`: `box-shadow: 0 8px 24px -8px rgb(15 23 42 / 0.2)`.',
        ),
        expectedBehavior:
          'Kulrang fonda oq karta, pastki qismi ajralgan; ustiga olib borilganda yengil soya.',
        difficulty: 'EASY',
        starterFiles: site(CARD, CARD_CSS),
        checks: [
          style('surface', 'Karta oq', '.karta', 'background-color', '#ffffff'),
          style('radius', 'Burchaklar 12px', '.karta', 'border-top-left-radius', '12px'),
          style('clip', 'Ichki bo‘limlar burchakdan chiqmaydi', '.karta', 'overflow-x', 'hidden'),
          style('footer', 'Pastki qism ajralgan', '.karta-oyoq', 'border-top-color', '#e2e8f0'),
          after(
            hover('.karta'),
            style(
              'shadow',
              'Hover’da soya',
              '.karta',
              'box-shadow',
              '0 8px 24px -8px rgb(15 23 42 / 0.2)',
            ),
          ),
        ],
      },
    },
    {
      slug: 'bildirishnoma',
      title: 'Bildirishnoma va belgilar',
      exercise: {
        title: 'Holat xabarlari va hisoblagich',
        description: 'Rang, chegara, rol va “tabletka” belgi.',
        instructions: md(
          '1. `.xabar`: `border-left: 4px solid`, `border-radius: 8px`.',
          '2. `.xabar--muvaffaqiyat`: fon `#f0fdf4`, chegara rangi `#15803d`, matn `#14532d`.',
          '3. `.xabar--xato`: fon `#fef2f2`, chegara rangi `#b91c1c`, matn `#7f1d1d`; HTML’da unga `role="alert"` qo‘shing.',
          '4. `.belgi`: `display: inline-block`, `min-width: 1.5em`, `padding: 0 6px`, `border-radius: 999px`, fon `#0071dc`, matn `white`, `text-align: center`.',
        ),
        expectedBehavior:
          'Yashil va qizil xabarlar chap tomonda qalin chiziq bilan; xato darhol e’lon qilinadi; hisoblagich — ko‘k tabletka.',
        difficulty: 'MEDIUM',
        starterFiles: site(ALERTS, ALERTS_CSS),
        checks: [
          style(
            'ok',
            'Muvaffaqiyat — yashil chiziq',
            '.xabar--muvaffaqiyat',
            'border-left-color',
            '#15803d',
          ),
          style('err-bg', 'Xato — och qizil fon', '.xabar--xato', 'background-color', '#fef2f2'),
          style('err-line', 'Xato — chiziq 4px', '.xabar--xato', 'border-left-width', '4px'),
          has('role', 'Xato xabari darhol e’lon qilinadi', '.xabar--xato[role="alert"]'),
          style('pill', 'Belgi — tabletka', '.belgi', 'border-top-left-radius', '999px'),
        ],
      },
    },
    {
      slug: 'tablar',
      title: 'Tablar',
      exercise: {
        title: 'Accessible tablar',
        description: '`role="tab"`, `aria-selected` va `hidden` panellar.',
        instructions: md(
          '1. `script.js`: tab bosilganda barcha tablarga `aria-selected="false"`, bosilganiga `"true"`; barcha panellarni `hidden` qiling, bosilgan tabning paneli (`aria-controls`) ko‘rinsin.',
          '2. `style.css`: `[role="tab"][aria-selected="true"]` — `color: #005bb5`, `border-bottom-color: #0071dc`, `font-weight: 600`.',
        ),
        expectedBehavior:
          '“Narx” bosilganda u faol bo‘ladi va uning paneli ko‘rinadi, “Dastur” paneli yashirinadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(TABS, TABS_JS, { css: TABS_CSS }),
        checks: [
          style('active', 'Faol tab ajralib turadi', '#tab-1', 'border-bottom-color', '#0071dc'),
          after(
            click('#tab-2'),
            attr('selected', 'Bosilgan tab tanlangan', '#tab-2', 'aria-selected', 'true'),
          ),
          after(click('#tab-2'), has('hide', 'Eski panel yashirinadi', '#panel-1[hidden]')),
          after(
            click('#tab-2'),
            style('show', 'Yangi panel ko‘rinadi', '#panel-2', 'display', 'block'),
          ),
        ],
      },
      quiz: quiz('5-modul testi: Komponentlar', [
        q(
          'u5-mod',
          'Tugma variantlarini qanday tashkil qilish qulay?',
          [
            'Umumiy asos klass + modifikator (`.tugma.tugma--xavfli`)',
            'Har bir variant uchun to‘liq alohida klass, umumiy qism takrorlanadi',
            'Inline `style` atributi',
            'Faqat `id` bilan',
          ],
          [0],
        ),
        q(
          'u5-focus',
          'Nega `outline: none` ni o‘ylamasdan yozish xavfli?',
          [
            'Klaviatura foydalanuvchisi qayerda turganini ko‘rmay qoladi',
            'Tugma ishlamay qoladi',
            'Sahifa sekinlashadi',
            'Brauzer xato beradi',
          ],
          [0],
        ),
        q(
          'u5-invalid',
          'Xatoli maydonni ekran o‘quvchi uchun qanday belgilash kerak? (bir nechta javob)',
          [
            '`aria-invalid="true"`',
            'Xato matnini `aria-describedby` bilan bog‘lash',
            'Faqat qizil chegara',
            'Faqat placeholder’ga xato yozish',
          ],
          [0, 1],
        ),
        q(
          'u5-alert',
          '`role="alert"` qachon ishlatiladi?',
          [
            'Darhol e’lon qilinishi kerak bo‘lgan muhim xabar (xato) uchun',
            'Har bir paragraf uchun',
            'Faqat modal oynalar uchun',
            'Bezak elementlari uchun',
          ],
          [0],
        ),
        q(
          'u5-tabs',
          'Tab komponentida `aria-selected` nimani bildiradi?',
          [
            'Hozir qaysi tab tanlangan',
            'Tab o‘chirilganmi',
            'Tab necha marta bosilgan',
            'Panel balandligi',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s05: Record<string, ProjectFile[]> = {
  tugmalar: site(
    VARIANTS,
    `${VARIANTS_CSS}

.tugma {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: 18px;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
}

.tugma--asosiy {
  background-color: #0071dc;
  color: white;
}

.tugma--chegarali {
  background-color: white;
  color: #0f172a;
  border-color: #cbd5e1;
}

.tugma--xavfli {
  background-color: #b91c1c;
  color: white;
}`,
  ),
  'tugma-holatlari': site(
    STATES,
    `${STATES_CSS}

.tugma:hover {
  background-color: #005bb5;
}

.tugma:focus-visible {
  outline: 3px solid #59a2ff;
  outline-offset: 2px;
}

.tugma:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
  ),
  'forma-maydonlari': site(
    FIELDS,
    `${FIELDS_CSS.replace('border: 1px solid #e2e8f0;', 'border: 1px solid #94a3b8;\n  border-radius: 8px;')}

input:focus-visible {
  border-color: #0071dc;
  box-shadow: 0 0 0 3px rgb(0 113 220 / 0.25);
}

input[aria-invalid="true"] {
  border-color: #b91c1c;
}

.xato {
  color: #b91c1c;
  font-size: 0.875rem;
}

label {
  font-weight: 600;
}`,
  ),
  'ui-kartalar': site(
    CARD,
    `${CARD_CSS.replace('.karta {\n  max-width: 420px;\n}', '.karta {\n  max-width: 420px;\n  background-color: white;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  overflow: hidden;\n}')}

.karta-oyoq {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.karta:hover {
  box-shadow: 0 8px 24px -8px rgb(15 23 42 / 0.2);
}`,
  ),
  bildirishnoma: site(
    ALERTS.replace(
      '<div class="xabar xabar--xato">',
      '<div class="xabar xabar--xato" role="alert">',
    ),
    `${ALERTS_CSS.replace('.xabar {\n  padding: 12px 16px;\n}', '.xabar {\n  padding: 12px 16px;\n  border-left: 4px solid;\n  border-radius: 8px;\n}')}

.xabar--muvaffaqiyat {
  background-color: #f0fdf4;
  border-color: #15803d;
  color: #14532d;
}

.xabar--xato {
  background-color: #fef2f2;
  border-color: #b91c1c;
  color: #7f1d1d;
}

.belgi {
  display: inline-block;
  min-width: 1.5em;
  padding: 0 6px;
  border-radius: 999px;
  background-color: #0071dc;
  color: white;
  text-align: center;
}`,
  ),
  tablar: app(TABS, TABS_JS_DONE, {
    css: `${TABS_CSS}

[role="tab"][aria-selected="true"] {
  color: #005bb5;
  border-bottom-color: #0071dc;
  font-weight: 600;
}`,
  }),
};
