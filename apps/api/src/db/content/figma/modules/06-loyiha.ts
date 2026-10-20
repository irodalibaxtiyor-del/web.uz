import type { ProjectFile } from '@webdizayn/shared';
import { at, md, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const CONTAINER = `.konteyner {
  width: min(100% - 32px, 1296px);
  margin-inline: auto;
}`;

const HEADER = `<header class="header">
  <a class="logo" href="#">Studiya</a>
  <nav class="nav">
    <a href="#">Ishlar</a>
    <a href="#">Xizmatlar</a>
    <a href="#">Jamoa</a>
  </nav>
  <a class="tugma" href="#">Bog‘lanish</a>
</header>`;

const HEADER_CSS = `${RESET}

.logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: #0f172a;
  text-decoration: none;
}

.nav a {
  color: #334155;
  text-decoration: none;
}

.tugma {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding-inline: 16px;
  border-radius: 8px;
  color: white;
  background-color: #0071dc;
  text-decoration: none;
}`;

const HERO = `<section class="hero konteyner">
  <p class="kicker">Raqamli studiya</p>
  <h1>Biz g‘oyalarni ishlaydigan saytlarga aylantiramiz</h1>
  <p class="kirish">Dizayn, frontend va qo‘llab-quvvatlash — bir jamoada.</p>
</section>
<section class="kartalar konteyner">
  <article class="karta"><h2>Dizayn</h2><p>Figma’da maket va dizayn tizimi.</p></article>
  <article class="karta"><h2>Frontend</h2><p>Tez va moslashuvchan sahifalar.</p></article>
  <article class="karta"><h2>Qo‘llab-quvvatlash</h2><p>Yangilanish va monitoring.</p></article>
</section>`;

const HERO_CSS = `${RESET}

${CONTAINER}

.hero {
  padding-block: 48px;
}

.hero h1,
.hero p {
  margin: 0 0 16px;
}

.karta {
  background-color: white;
  border: 1px solid #e2e8f0;
}

.karta h2,
.karta p {
  margin: 0 0 8px;
}`;

const FOOTER = `<footer class="footer">
  <div class="tor konteyner">
    <div class="footer-brend">
      <strong>Studiya</strong>
      <p>Toshkent, Amir Temur ko‘chasi 1</p>
    </div>
    <nav aria-label="Kompaniya"><h2>Kompaniya</h2><a href="#">Jamoa</a></nav>
    <nav aria-label="Xizmatlar"><h2>Xizmatlar</h2><a href="#">Dizayn</a></nav>
    <nav aria-label="Aloqa"><h2>Aloqa</h2><a href="#">Telegram</a></nav>
  </div>
  <p class="pastki konteyner">© 2026 Studiya</p>
</footer>`;

const FOOTER_CSS = `${RESET}

${CONTAINER}

.footer {
  padding-block: 48px 24px;
}

.footer h2 {
  margin: 0 0 8px;
  font-size: 0.875rem;
}

.footer a {
  display: block;
  color: inherit;
}`;

export const m06: ModuleDef = {
  title: 'Amaliy loyiha: maketdan sahifa',
  lessons: [
    {
      slug: 'loyiha-header',
      title: 'Loyiha: header',
      exercise: {
        title: 'Header’ni ikki freymdan yig‘ish',
        description: 'Mobile 360 va Desktop 1440 freymlaridagi header.',
        instructions: md(
          '**Mobile 360:** `Header` — Auto layout Horizontal, Space between, Align center, H **64**, Padding 0 **16**, Stroke bottom 1 `#E2E8F0`. Nav yashirin.',
          '**Desktop 1440:** H **72**, Padding 0 **72**, Nav — Horizontal, Gap **32**.',
          '',
          '1. `.header`: `display: flex`, `align-items: center`, `justify-content: space-between`, `min-height: 64px`, `padding-inline: 16px`, `border-bottom: 1px solid #e2e8f0`; `.nav` — `display: none`.',
          '2. `@media (min-width: 1024px)`: `.header` — `min-height: 72px`, `padding-inline: 72px`; `.nav` — `display: flex`, `gap: 32px`.',
        ),
        expectedBehavior: 'Header ikkala freymdagi o‘lchamlarga mos.',
        difficulty: 'MEDIUM',
        starterFiles: site(HEADER, HEADER_CSS),
        checks: [
          at(360, 700, style('h-sm', 'Mobile: H 64', '.header', 'min-height', '64px')),
          at(360, 700, style('nav-sm', 'Mobile: nav yashirin', '.nav', 'display', 'none')),
          at(1440, 900, style('h-lg', 'Desktop: H 72', '.header', 'min-height', '72px')),
          at(1440, 900, style('pad-lg', 'Desktop: Padding 72', '.header', 'padding-left', '72px')),
          at(1440, 900, style('gap', 'Desktop: nav Gap 32', '.nav', 'column-gap', '32px')),
        ],
      },
    },
    {
      slug: 'loyiha-hero',
      title: 'Loyiha: hero va kartalar',
      exercise: {
        title: 'Hero va xizmat kartalari',
        description: 'Suyuq sarlavha va Layout Grid bo‘yicha kartalar.',
        instructions: md(
          '**Desktop 1440:** H1 Bold **48/56**. Kartalar — 3 ta, Gap **24**, Padding **24**, Radius **16**. **Mobile 360:** H1 Bold **32/40**, kartalar bitta ustunda.',
          '',
          '1. `h1`: `font-size: clamp(2rem, 1rem + 2.5vw, 3rem)`, `line-height: 1.17`, `font-weight: 700`.',
          '2. `.kartalar`: `display: grid`, `gap: 24px`; `@media (min-width: 1024px)` — `grid-template-columns: repeat(3, 1fr)`.',
          '3. `.karta`: `padding: 24px`, `border-radius: 16px`.',
        ),
        expectedBehavior:
          'Desktopda sarlavha 48px va uchta karta yonma-yon; telefonda 32px va kartalar ustma-ust.',
        difficulty: 'MEDIUM',
        starterFiles: site(HERO, HERO_CSS),
        checks: [
          at(1440, 900, style('h1-lg', 'Desktop H1 48', 'h1', 'font-size', '48px')),
          at(360, 700, style('h1-sm', 'Mobile H1 32', 'h1', 'font-size', '32px')),
          at(
            1440,
            900,
            style(
              'cols',
              'Desktop: 3 karta, Gap 24',
              '.kartalar',
              'grid-template-columns',
              '416px 416px 416px',
            ),
          ),
          at(
            360,
            700,
            style('one', 'Mobile: bitta ustun', '.kartalar', 'grid-template-columns', '328px'),
          ),
          style('card', 'Karta Radius 16', '.karta', 'border-top-left-radius', '16px'),
        ],
      },
    },
    {
      slug: 'loyiha-footer',
      title: 'Loyiha: footer',
      exercise: {
        title: 'To‘rt ustunli footer',
        description: 'Desktop va mobil to‘r, qorong‘i sirt, pastki chiziq.',
        instructions: md(
          '**Desktop 1440:** Footer Fill `#0F172A`, matn `#CBD5E1`. To‘r: 4 ustun **2fr 1fr 1fr 1fr**, Gap **32**. Pastki qator — Stroke top 1 `#334155`.',
          '**Mobile 360:** 2 ustun, Gap 32; brend bloki ikkala ustunni egallaydi.',
          '',
          '1. `.footer`: `background-color: #0f172a`, `color: #cbd5e1`.',
          '2. `.tor`: `display: grid`, `grid-template-columns: repeat(2, 1fr)`, `gap: 32px`; `.footer-brend` — `grid-column: 1 / -1`.',
          '3. `@media (min-width: 1024px)`: `.tor` — `grid-template-columns: 2fr 1fr 1fr 1fr`; `.footer-brend` — `grid-column: auto`.',
          '4. `.pastki`: `margin-top: 32px`, `padding-top: 16px`, `border-top: 1px solid #334155`.',
        ),
        expectedBehavior:
          'Qorong‘i footer; desktopda to‘rt ustun, telefonda brend yuqorida va ikki ustun.',
        difficulty: 'MEDIUM',
        starterFiles: site(FOOTER, FOOTER_CSS),
        checks: [
          style('bg', 'Qorong‘i sirt', '.footer', 'background-color', '#0f172a'),
          at(
            1440,
            900,
            style(
              'cols',
              'Desktop: 2fr 1fr 1fr 1fr',
              '.tor',
              'grid-template-columns',
              '480px 240px 240px 240px',
            ),
          ),
          at(
            360,
            700,
            style('cols-sm', 'Mobile: 2 ustun', '.tor', 'grid-template-columns', '148px 148px'),
          ),
          at(
            360,
            700,
            style(
              'brand',
              'Mobile: brend to‘liq kenglikda',
              '.footer-brend',
              'grid-column-end',
              '-1',
            ),
          ),
          style('line', 'Pastki chiziq', '.pastki', 'border-top-color', '#334155'),
        ],
      },
      quiz: quiz('6-modul testi: Maketdan sahifa', [
        q(
          'f6-order',
          'Maketdan sahifa yasashni nimadan boshlash to‘g‘ri?',
          [
            'Tuzilmani (bloklar, Auto Layout, to‘r) va tokenlarni aniqlashdan',
            'Har bir piksellik joylashuvni `position: absolute` bilan ko‘chirishdan',
            'Animatsiyalardan',
            'Eng kichik ikonkadan',
          ],
          [0],
        ),
        q(
          'f6-container',
          '`width: min(100% - 32px, 1296px)` nimani beradi?',
          [
            'Telefonda chetlardan 16px, katta ekranda 1296px dan oshmaydigan konteyner',
            'Doim 1296px',
            'Doim ekran kengligi',
            'Faqat 32px',
          ],
          [0],
        ),
        q(
          'f6-fr',
          '`2fr 1fr 1fr 1fr` qanday taqsimlanadi?',
          [
            'Bo‘sh joy 5 ulushga bo‘linadi: birinchi ustun 2 ulush, qolganlari 1 tadan',
            'Birinchi ustun 2px',
            'To‘rtta teng ustun',
            'Faqat birinchi ustun ko‘rinadi',
          ],
          [0],
        ),
        q(
          'f6-check',
          'Sahifani maket bilan solishtirishning foydali usullari? (bir nechta javob)',
          [
            'Freym o‘lchamida (360, 1440) skrinshotni maket bilan yonma-yon qo‘yish',
            'Maket rasmini sahifa ustiga yarim shaffof qo‘yish',
            'DevTools’da o‘lcham va oraliqlarni Inspect qiymatlari bilan solishtirish',
            'Faqat ko‘z bilan bir marta qarash',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s06: Record<string, ProjectFile[]> = {
  'loyiha-header': site(
    HEADER,
    `${HEADER_CSS}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding-inline: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.nav {
  display: none;
}

@media (min-width: 1024px) {
  .header {
    min-height: 72px;
    padding-inline: 72px;
  }

  .nav {
    display: flex;
    gap: 32px;
  }
}`,
  ),
  'loyiha-hero': site(
    HERO,
    `${HERO_CSS}

h1 {
  font-size: clamp(2rem, 1rem + 2.5vw, 3rem);
  line-height: 1.17;
  font-weight: 700;
}

.kartalar {
  display: grid;
  gap: 24px;
}

.karta {
  padding: 24px;
  border-radius: 16px;
}

@media (min-width: 1024px) {
  .kartalar {
    grid-template-columns: repeat(3, 1fr);
  }
}`,
  ),
  'loyiha-footer': site(
    FOOTER,
    `${FOOTER_CSS}

.footer {
  background-color: #0f172a;
  color: #cbd5e1;
}

.tor {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.footer-brend {
  grid-column: 1 / -1;
}

.pastki {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #334155;
}

@media (min-width: 1024px) {
  .tor {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }

  .footer-brend {
    grid-column: auto;
  }
}`,
  ),
};
