import type { ProjectFile } from '@webdizayn/shared';
import { at, md, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const SPACING = `<section class="bolim">
  <article class="karta">
    <h2>Haftalik hisobot</h2>
    <p>7 ta dars tugatildi, 5 ta mashq o‘tildi.</p>
    <a href="#">Batafsil</a>
  </article>
</section>
<section class="bolim">
  <article class="karta">
    <h2>Keyingi dars</h2>
    <p>Flexbox: o‘q va tekislash.</p>
    <a href="#">Davom etish</a>
  </article>
</section>`;

const SPACING_CSS = `${RESET}

.karta {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 13px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.karta > * {
  margin: 0;
}

.bolim {
  margin-bottom: 29px;
}`;

const FORM = `<form class="forma">
  <h2>Shaxsiy ma’lumotlar</h2>
  <label class="maydon">Ism <input name="ism"></label>
  <label class="maydon">Telefon <input name="tel" type="tel"></label>
  <h2>Manzil</h2>
  <label class="maydon">Shahar <input name="shahar"></label>
</form>`;

const FORM_CSS = `${RESET}

.forma {
  display: grid;
  gap: 8px;
  max-width: 420px;
  padding: 24px;
}

.maydon {
  display: grid;
  gap: 24px;
}

h2 {
  margin: 16px 0;
  font-size: 1.125rem;
}

input {
  min-height: 44px;
  padding: 8px 12px;
}`;

const ALIGN = `<nav class="nav">
  <a class="logo" href="#">Do‘kon</a>
  <a class="savat" href="#">Savat (2)</a>
</nav>
<article class="karta">
  <h2>Buyurtma #1042</h2>
  <p>Yetkazib berish: ertaga, 10:00–14:00.</p>
</article>
<table class="jadval">
  <tr><th>Mahsulot</th><th class="son">Narx</th></tr>
  <tr><td>Daftar</td><td class="son">12 000</td></tr>
  <tr><td>Ruchka</td><td class="son">3 500</td></tr>
</table>`;

const ALIGN_CSS = `${RESET}

.nav {
  display: flex;
  padding: 12px 16px;
}

.logo {
  font-size: 1.5rem;
}

.karta {
  padding: 16px;
  text-align: center;
}

.jadval td,
.jadval th {
  padding: 8px 12px;
}`;

const SPACE = `<section class="bolim">
  <div class="konteyner">
    <h1>Kod yozishni o‘rganing</h1>
    <p class="kirish">Har darsda amaliy mashq va o‘qituvchi izohi. Telefon va kompyuterda bir xil qulay.</p>
  </div>
</section>`;

const SPACE_CSS = `${RESET}

.bolim {
  padding: 12px 0;
  background-color: #f8fafc;
}

.konteyner {
  padding-inline: 16px;
}`;

const BUTTONS = `<div class="harakatlar">
  <button type="button" class="tugma tugma-asosiy">Buyurtma berish</button>
  <button type="button" class="tugma tugma-ikkinchi">Savatga qo‘shish</button>
  <button type="button" class="tugma tugma-uchinchi">Keyinroq</button>
</div>`;

const BUTTONS_CSS = `${RESET}

.harakatlar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px;
}

.tugma {
  min-height: 44px;
  padding-inline: 18px;
  border: 1px solid #0071dc;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  background-color: #0071dc;
  color: white;
}`;

export const m03: ModuleDef = {
  title: 'Oraliq va kompozitsiya',
  lessons: [
    {
      slug: 'oraliq-tizimi',
      title: 'Oraliqlar tizimi (8px qoidasi)',
      exercise: {
        title: 'Tasodifiy oraliqlardan tokenlarga',
        description: '4 va 8 ga karrali oraliqlar.',
        instructions: md(
          '1. `:root` da: `--s-1: 4px`, `--s-2: 8px`, `--s-4: 16px`, `--s-6: 24px`, `--s-8: 32px`.',
          '2. `.karta`: `gap: var(--s-4)`, `padding: var(--s-6)`.',
          '3. `.bolim`: `margin-bottom: var(--s-8)`.',
        ),
        expectedBehavior:
          'Barcha oraliqlar bir shkaladan: karta ichida 16px, chetlardan 24px, bo‘limlar orasida 32px.',
        difficulty: 'EASY',
        starterFiles: site(SPACING, SPACING_CSS),
        checks: [
          style('token', 'Oraliq tokeni', ':root', '--s-4', '16px'),
          style('gap', 'Karta ichida 16px', '.karta', 'row-gap', '16px'),
          style('pad', 'Karta chetidan 24px', '.karta', 'padding-top', '24px'),
          style('section', 'Bo‘limlar orasida 32px', '.bolim', 'margin-bottom', '32px'),
        ],
      },
    },
    {
      slug: 'yaqinlik',
      title: 'Yaqinlik va guruhlash',
      exercise: {
        title: 'Yorliq o‘z maydoniga yaqin bo‘lsin',
        description: 'Ichki oraliq tashqi oraliqdan kichik.',
        instructions: md(
          '1. `.maydon` (yorliq + maydon): `gap: 6px`.',
          '2. `.forma` (maydonlar orasi): `gap: 24px`.',
          '3. `h2`: `margin-top: 24px`, `margin-bottom: 0` — sarlavha keyingi guruhga yopishsin (forma `gap` i ham qo‘shiladi).',
        ),
        expectedBehavior:
          'Har bir yorliq o‘z maydoni bilan bitta guruh, guruhlar bir-biridan aniq ajralgan.',
        difficulty: 'EASY',
        starterFiles: site(FORM, FORM_CSS),
        checks: [
          style('inner', 'Yorliq maydonga yaqin', '.maydon', 'row-gap', '6px'),
          style('outer', 'Maydonlar orasida 24px', '.forma', 'row-gap', '24px'),
          style('h2-top', 'Sarlavhadan oldin katta oraliq', 'h2', 'margin-top', '24px'),
          style('h2-bottom', 'Sarlavhadan keyin oraliq yo‘q', 'h2', 'margin-bottom', '0px'),
        ],
      },
    },
    {
      slug: 'tekislash',
      title: 'Tekislash',
      exercise: {
        title: 'Hamma narsa o‘z chizig‘ida',
        description: 'Navigatsiya, matn va raqamlarni to‘g‘ri tekislash.',
        instructions: md(
          '1. `.nav`: `align-items: center`, `justify-content: space-between`.',
          '2. `.karta`: matnni chapga — `text-align: left` (ko‘p qatorli matn markazda o‘qilmaydi).',
          '3. `.son`: `text-align: right`, `font-variant-numeric: tabular-nums`.',
        ),
        expectedBehavior:
          'Logo va savat bir chiziqda va chetlarda, matn chap chetdan, narxlar o‘ng chetdan tekis.',
        difficulty: 'EASY',
        starterFiles: site(ALIGN, ALIGN_CSS),
        checks: [
          style('center', 'Navigatsiya vertikal markazda', '.nav', 'align-items', 'center'),
          style('between', 'Logo va savat chetlarda', '.nav', 'justify-content', 'space-between'),
          style('left', 'Karta matni chapda', '.karta', 'text-align', 'left'),
          style('right', 'Narxlar o‘ngda', 'td.son', 'text-align', 'right'),
          style(
            'tabular',
            'Raqamlar bir xil kenglikda',
            'td.son',
            'font-variant-numeric',
            'tabular-nums',
          ),
        ],
      },
    },
    {
      slug: 'oq-joy',
      title: 'Oq joy',
      exercise: {
        title: 'Nafas oladigan bo‘lim',
        description: 'Bo‘lim oralig‘i, konteyner va matn kengligi.',
        instructions: md(
          '1. `.bolim`: `padding-block: clamp(3rem, 8vw, 6rem)`.',
          '2. `.konteyner`: `max-width: 72rem`, `margin-inline: auto`.',
          '3. `.kirish`: `max-width: 36rem`, `font-size: 1.125rem`.',
        ),
        expectedBehavior:
          'Katta ekranda bo‘lim tepasi va pastida 96px, telefonda 48px bo‘sh joy; kirish matni qisqa qatorlarda.',
        difficulty: 'EASY',
        starterFiles: site(SPACE, SPACE_CSS),
        checks: [
          at(1280, 800, style('lg', 'Katta ekranda 96px', '.bolim', 'padding-top', '96px')),
          at(375, 700, style('sm', 'Telefonda 48px', '.bolim', 'padding-top', '48px')),
          style('container', 'Konteyner 72rem', '.konteyner', 'max-width', '1152px'),
          style('lead', 'Kirish matni 36rem', '.kirish', 'max-width', '576px'),
        ],
      },
    },
    {
      slug: 'vizual-ierarxiya',
      title: 'Vizual ierarxiya va harakatlar',
      exercise: {
        title: 'Uch darajali tugmalar',
        description: 'Asosiy, ikkinchi darajali va uchinchi darajali harakat.',
        instructions: md(
          '1. `.tugma-asosiy` — o‘zgarishsiz (to‘ldirilgan ko‘k).',
          '2. `.tugma-ikkinchi`: `background-color: transparent`, `color: #005bb5` (chegara qoladi).',
          '3. `.tugma-uchinchi`: `background-color: transparent`, `border-color: transparent`, `color: #005bb5`, `text-decoration: underline`.',
        ),
        expectedBehavior:
          'Uch tugmadan faqat bittasi to‘ldirilgan — ko‘z darhol asosiy harakatni topadi.',
        difficulty: 'EASY',
        starterFiles: site(BUTTONS, BUTTONS_CSS),
        checks: [
          style(
            'primary',
            'Asosiy tugma to‘ldirilgan',
            '.tugma-asosiy',
            'background-color',
            '#0071dc',
          ),
          style(
            'secondary',
            'Ikkinchi tugma faqat chegarali',
            '.tugma-ikkinchi',
            'background-color',
            'rgba(0, 0, 0, 0)',
          ),
          style(
            'secondary-text',
            'Ikkinchi tugma matni ko‘k',
            '.tugma-ikkinchi',
            'color',
            '#005bb5',
          ),
          style(
            'tertiary',
            'Uchinchi tugma chegarasiz',
            '.tugma-uchinchi',
            'border-top-color',
            'rgba(0, 0, 0, 0)',
          ),
          style(
            'link',
            'Uchinchi tugma havola ko‘rinishida',
            '.tugma-uchinchi',
            'text-decoration-line',
            'underline',
          ),
        ],
      },
      quiz: quiz('3-modul testi: Oraliq va kompozitsiya', [
        q(
          'u3-8px',
          'Nega oraliqlar 4 yoki 8 ga karrali olinadi?',
          [
            'Tanlov kamayadi, interfeys izchil ko‘rinadi va ko‘p ekranlarda piksellar tekis tushadi',
            'Brauzer boshqa qiymatlarni qabul qilmaydi',
            'Sahifa tezroq yuklanadi',
            'Faqat Figma shuni talab qiladi',
          ],
          [0],
        ),
        q(
          'u3-prox',
          'Yaqinlik qoidasi nima deydi?',
          [
            'Bir-biriga tegishli elementlar yaqinroq, alohida guruhlar uzoqroq turadi',
            'Hamma oraliqlar teng bo‘lishi kerak',
            'Elementlar iloji boricha zich joylashadi',
            'Sarlavhadan keyin katta bo‘shliq qo‘yiladi',
          ],
          [0],
        ),
        q(
          'u3-align',
          'Ko‘p qatorli matn uchun qaysi tekislash eng yaxshi o‘qiladi?',
          [
            'Chapga (o‘ngdan chapga yoziladigan tillarda — o‘ngga)',
            'Markazga',
            'Ikki tomonga (justify) har doim',
            'O‘ngga',
          ],
          [0],
        ),
        q(
          'u3-white',
          'Oq joy (whitespace) haqida to‘g‘ri fikrlar? (bir nechta javob)',
          [
            'Bo‘sh joy elementlarni guruhlaydi va ajratadi',
            'Ko‘proq bo‘sh joy “qimmatroq”, tinchroq taassurot beradi',
            'Bo‘sh joy — isrof qilingan joy',
            'Matn kengligini cheklash ham oq joy hosil qiladi',
          ],
          [0, 1, 3],
        ),
        q(
          'u3-cta',
          'Bitta ekranda nechta asosiy (to‘ldirilgan) tugma bo‘lishi tavsiya etiladi?',
          [
            'Odatda bitta',
            'Har bir harakat uchun bittadan',
            'Kamida uchta',
            'Tugmalar soni muhim emas',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s03: Record<string, ProjectFile[]> = {
  'oraliq-tizimi': site(
    SPACING,
    `:root {
  --s-1: 4px;
  --s-2: 8px;
  --s-4: 16px;
  --s-6: 24px;
  --s-8: 32px;
}

${SPACING_CSS.replace('gap: 7px;', 'gap: var(--s-4);')
  .replace('padding: 13px;', 'padding: var(--s-6);')
  .replace('margin-bottom: 29px;', 'margin-bottom: var(--s-8);')}`,
  ),
  yaqinlik: site(
    FORM,
    FORM_CSS.replace('gap: 8px;', 'gap: 24px;')
      .replace(
        '.maydon {\n  display: grid;\n  gap: 24px;',
        '.maydon {\n  display: grid;\n  gap: 6px;',
      )
      .replace('margin: 16px 0;', 'margin: 24px 0 0;'),
  ),
  tekislash: site(
    ALIGN,
    `${ALIGN_CSS.replace('.nav {\n  display: flex;', '.nav {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;').replace('text-align: center;', 'text-align: left;')}

.son {
  text-align: right;
  font-variant-numeric: tabular-nums;
}`,
  ),
  'oq-joy': site(
    SPACE,
    `${SPACE_CSS.replace('padding: 12px 0;', 'padding-block: clamp(3rem, 8vw, 6rem);').replace(
      '.konteyner {\n  padding-inline: 16px;',
      '.konteyner {\n  max-width: 72rem;\n  margin-inline: auto;\n  padding-inline: 16px;',
    )}

.kirish {
  max-width: 36rem;
  font-size: 1.125rem;
}`,
  ),
  'vizual-ierarxiya': site(
    BUTTONS,
    `${BUTTONS_CSS}

.tugma-ikkinchi {
  background-color: transparent;
  color: #005bb5;
}

.tugma-uchinchi {
  background-color: transparent;
  border-color: transparent;
  color: #005bb5;
  text-decoration: underline;
}`,
  ),
};
