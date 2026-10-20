import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
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

const CARD = `<article class="karta">
  <img class="muqova" src="${svgData('0071dc', 800, 300)}" width="800" height="300" alt="Kurs muqovasi">
  <div class="muallif">
    <img class="avatar" src="${svgData('fec400', 120, 80)}" width="120" height="80" alt="Muallif">
    <span>Dilnoza Rahimova</span>
  </div>
</article>`;

const CARD_CSS = `${RESET}

.muallif {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}`;

const SMALL = svgData('0071dc', 400, 250);
const LARGE = svgData('005bb5', 1200, 750);

const SRCSET = (img: string) => `<figure class="rasm">
  ${img}
  <figcaption>Samarqand, Registon maydoni</figcaption>
</figure>`;

const PLAIN_IMG = `<img src="${LARGE}" alt="Registon maydoni">`;
const SRCSET_IMG = `<img
    src="${SMALL}"
    srcset="${SMALL} 400w, ${LARGE} 1200w"
    sizes="(min-width: 800px) 50vw, 100vw"
    width="1200" height="750"
    loading="lazy"
    alt="Registon maydoni">`;

const SRCSET_CSS = `${RESET}

.rasm {
  margin: 0;
}

.rasm img {
  display: block;
  max-width: 100%;
  height: auto;
}`;

const WIDE = svgData('0071dc', 1200, 400);
const SQUARE = svgData('fec400', 600, 600);

const PICTURE_START = `<img class="banner" src="${SQUARE}" alt="Kuzgi chegirma: barcha kurslar 20% arzon">`;
const PICTURE_DONE = `<picture>
  <source media="(min-width: 800px)" srcset="${WIDE}">
  <img class="banner" src="${SQUARE}" alt="Kuzgi chegirma: barcha kurslar 20% arzon">
</picture>`;

const PICTURE_CSS = `${RESET}

.banner {
  display: block;
  max-width: 100%;
  height: auto;
}`;

const VIDEO = `<section class="dars">
  <h1>1-dars: Kirish</h1>
  <div class="video">
    <iframe width="560" height="315" title="Kirish darsi videosi"></iframe>
  </div>
  <video class="klip" width="640" height="360" controls poster="${svgData('0b3f76', 640, 360)}"></video>
</section>`;

const VIDEO_CSS = `${RESET}`;

const TYPE = `<article class="matn">
  <h1>Yaxshi o‘qiladigan matn</h1>
  <p>Qator uzunligi 45–75 belgi atrofida bo‘lsa, ko‘z keyingi qatorni oson topadi. Juda uzun qatorlar charchatadi, juda qisqalari esa o‘qishni bo‘lib-bo‘lib qo‘yadi.</p>
</article>`;

const TYPE_CSS = `${RESET}

body {
  font-size: 15px;
  line-height: 1.2;
}

h1 {
  font-size: 40px;
}`;

export const m04: ModuleDef = {
  title: 'Moslashuvchan kontent',
  lessons: [
    {
      slug: 'rasmlar',
      title: 'Moslashuvchan rasmlar',
      exercise: {
        title: 'Nisbati saqlanadigan rasmlar',
        description: '`aspect-ratio` va `object-fit` bilan muqova va avatar.',
        instructions: md(
          '1. `.muqova`: `display: block`, `width: 100%`, `height: auto`, `aspect-ratio: 16 / 9`, `object-fit: cover`.',
          '2. `.avatar`: `width: 64px`, `height: auto`, `aspect-ratio: 1`, `object-fit: cover`, `border-radius: 50%`.',
        ),
        expectedBehavior:
          'Muqova har qanday kenglikda 16:9 nisbatda va qirqilmasdan to‘ladi, avatar — 64px doira.',
        difficulty: 'EASY',
        starterFiles: site(CARD, CARD_CSS),
        checks: [
          at(640, 700, style('ratio', 'Muqova 16:9 (640 × 360)', '.muqova', 'height', '360px')),
          style('cover', 'Muqova to‘ldiriladi', '.muqova', 'object-fit', 'cover'),
          style('avatar', 'Avatar 64 × 64', '.avatar', 'height', '64px'),
          style('round', 'Avatar doira', '.avatar', 'border-top-left-radius', '50%'),
        ],
      },
    },
    {
      slug: 'srcset',
      title: 'srcset va sizes',
      exercise: {
        title: 'Ekranga mos rasm fayli',
        description: 'Brauzerga bir nechta fayl taklif qilish.',
        instructions: md(
          '1. `img` ga `srcset` qo‘shing: kichik fayl `400w`, katta fayl `1200w` (ikkala manzil `index.html` oxiridagi izohda).',
          '2. `sizes="(min-width: 800px) 50vw, 100vw"` yozing.',
          '3. `width="1200" height="750"` va `loading="lazy"` atributlarini qo‘shing; `src` ga kichik faylni qo‘ying.',
        ),
        expectedBehavior:
          'Telefon kichik faylni, katta ekran katta faylni yuklaydi; rasm uchun joy oldindan ajratiladi.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `${SRCSET(PLAIN_IMG)}
<!-- Kichik fayl (400w): ${SMALL} -->
<!-- Katta fayl (1200w): ${LARGE} -->`,
          SRCSET_CSS,
        ),
        checks: [
          has('srcset', 'Ikki o‘lchamli `srcset`', 'img[srcset*="400w"][srcset*="1200w"]'),
          has('sizes', '`sizes` to‘g‘ri', 'img[sizes="(min-width: 800px) 50vw, 100vw"]'),
          attr('lazy', 'Kechiktirib yuklanadi', 'img', 'loading', 'lazy'),
          has('dims', 'O‘lchamlar berilgan (sakrash yo‘q)', 'img[width="1200"][height="750"]', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'picture',
      title: '<picture> va art direction',
      exercise: {
        title: 'Telefonga kvadrat, kompyuterga keng banner',
        description: '`<picture>` va `<source media>`.',
        instructions: md(
          '1. `img.banner` ni `<picture>` ichiga oling.',
          '2. `img` dan oldin `<source media="(min-width: 800px)" srcset="…">` qo‘shing; `srcset` ga keng (1200 × 400) rasm manzilini yozing — u izohda berilgan.',
          '3. `img` ning `src` va `alt` i o‘zgarmaydi.',
        ),
        expectedBehavior: 'Telefonda kvadrat banner, 800px dan keng ekranda past va keng banner.',
        difficulty: 'MEDIUM',
        starterFiles: site(`${PICTURE_START}\n<!-- Keng rasm manzili: ${WIDE} -->`, PICTURE_CSS),
        checks: [
          has('source', '`<source media>` bor', 'picture > source[media="(min-width: 800px)"]'),
          at(
            600,
            800,
            style('phone', 'Telefonda kvadrat (600 × 600)', '.banner', 'height', '600px'),
          ),
          at(
            1200,
            800,
            style('wide', 'Katta ekranda keng (1200 × 400)', '.banner', 'height', '400px'),
          ),
        ],
      },
    },
    {
      slug: 'video-iframe',
      title: 'Video va iframe',
      exercise: {
        title: '16:9 video',
        description: 'Joylashtirilgan video va `<video>` ekranga sig‘ishi.',
        instructions: md(
          '1. `.video iframe`: `display: block`, `width: 100%`, `height: auto`, `aspect-ratio: 16 / 9`, `border: 0`.',
          '2. `.klip`: `display: block`, `max-width: 100%`, `height: auto`.',
          '3. `<video>` ga `preload="none"` atributini qo‘shing.',
        ),
        expectedBehavior: 'Video har qanday ekranda 16:9 nisbatda va ekrandan chiqmaydi.',
        difficulty: 'EASY',
        starterFiles: site(VIDEO, VIDEO_CSS),
        checks: [
          at(640, 700, style('w', 'Iframe ekran kengligida', '.video iframe', 'width', '640px')),
          at(640, 700, style('h', 'Iframe 16:9', '.video iframe', 'height', '360px')),
          at(375, 700, style('clip', 'Video telefonga sig‘adi', '.klip', 'width', '375px')),
          attr('preload', 'Video oldindan yuklanmaydi', 'video', 'preload', 'none'),
        ],
      },
    },
    {
      slug: 'tipografiya',
      title: 'Moslashuvchan tipografiya',
      exercise: {
        title: 'Suyuq shrift va qulay qatorlar',
        description: '`clamp()`, nisbiy `line-height` va qator uzunligi.',
        instructions: md(
          '1. `body`: `font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`, `line-height: 1.6`.',
          '2. `h1`: `font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem)`, `line-height: 1.15`.',
          '3. `.matn`: `max-width: 65ch`, `margin-inline: auto`, `padding-inline: 16px`.',
        ),
        expectedBehavior:
          'Telefonda matn 16px, katta ekranda 18px; sarlavha 32–56px oralig‘ida; qatorlar uzun emas.',
        difficulty: 'MEDIUM',
        starterFiles: site(TYPE, TYPE_CSS),
        checks: [
          at(320, 700, style('body-sm', 'Telefonda matn 16px', 'body', 'font-size', '16px')),
          at(1440, 800, style('body-lg', 'Katta ekranda matn 18px', 'body', 'font-size', '18px')),
          at(320, 700, style('lh', 'Qator balandligi 1.6', 'p', 'line-height', '25.6px')),
          at(320, 700, style('h1-sm', 'Telefonda sarlavha 32px', 'h1', 'font-size', '32px')),
          at(
            1600,
            900,
            style('h1-lg', 'Katta ekranda sarlavha 56px', 'h1', 'font-size', '56px', {
              hidden: true,
            }),
          ),
        ],
      },
      quiz: quiz('4-modul testi: Moslashuvchan kontent', [
        q(
          'm4-img',
          'Rasm konteynerdan chiqmasligi uchun eng oddiy qoida?',
          [
            '`max-width: 100%; height: auto;`',
            '`width: 1200px;`',
            '`overflow: hidden;` faqat `body` da',
            '`position: absolute;`',
          ],
          [0],
        ),
        q(
          'm4-dims',
          'Nega `<img>` ga `width` va `height` atributlari yoziladi?',
          [
            'Brauzer rasm yuklanmasdan oldin joy ajratadi va sahifa “sakramaydi”',
            'Rasm doim shu o‘lchamda ko‘rinishi uchun',
            'Qidiruv tizimi uchun majburiy',
            'Rasm tezroq yuklanishi uchun',
          ],
          [0],
        ),
        q(
          'm4-srcset',
          '`srcset` va `<picture>` farqi?',
          [
            '`srcset` — bir rasmning turli o‘lchamlari, brauzer tanlaydi; `<picture>` — shart bo‘yicha aynan qaysi rasm, ko‘pincha boshqa kompozitsiya',
            'Hech qanday farq yo‘q',
            '`<picture>` faqat video uchun',
            '`srcset` faqat SVG bilan ishlaydi',
          ],
          [0],
        ),
        q(
          'm4-video',
          '16:9 nisbatdagi iframe uchun zamonaviy usul?',
          [
            '`width: 100%; aspect-ratio: 16 / 9;`',
            '`padding-top: 56.25%` va mutlaq joylashuv — boshqa iloj yo‘q',
            '`height: 100vh;`',
            '`zoom: 0.5;`',
          ],
          [0],
        ),
        q(
          'm4-type',
          'Matn uchun yaxshi amaliyotlar? (bir nechta javob)',
          [
            'Shriftni `rem` asosidagi `clamp()` bilan berish',
            'Qator uzunligini taxminan `65ch` bilan cheklash',
            'Birliksiz `line-height` (masalan, `1.6`)',
            'Shriftni faqat `vw` da berish',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s04: Record<string, ProjectFile[]> = {
  rasmlar: site(
    CARD,
    `${CARD_CSS}

.muqova {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.avatar {
  width: 64px;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 50%;
}`,
  ),
  srcset: site(SRCSET(SRCSET_IMG), SRCSET_CSS),
  picture: site(PICTURE_DONE, PICTURE_CSS),
  'video-iframe': site(
    VIDEO.replace('<video class="klip"', '<video class="klip" preload="none"'),
    `${RESET}

.video iframe {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: 0;
}

.klip {
  display: block;
  max-width: 100%;
  height: auto;
}`,
  ),
  tipografiya: site(
    TYPE,
    `${RESET}

body {
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.6;
}

h1 {
  font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  line-height: 1.15;
}

.matn {
  max-width: 65ch;
  margin-inline: auto;
  padding-inline: 16px;
}`,
  ),
};
