import { at, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

/** A wide placeholder picture as a data URL (external images are blocked in the sandbox). */
export const WIDE_IMG = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='300'%3E%3Crect width='1200' height='300' fill='%230071dc'/%3E%3C/svg%3E" width="1200" height="300" alt="Ko‘k banner">`;
export const SMALL_IMG = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='100'%3E%3Crect width='120' height='100' fill='%23fec400'/%3E%3C/svg%3E" width="120" height="100" alt="Sariq rasm">`;

/** Markup shared by the starter files and the reference solutions. */
export const BODY06 = {
  display: `<nav>
  <a href="#">Bosh sahifa</a>
  <a href="#">Kurslar</a>
</nav>
<ul>
  <li class="qator">HTML</li>
  <li class="qator">CSS</li>
</ul>
<p class="yopiq">Bu xabar yashirin bo‘lishi kerak.</p>
<p class="joy">Bu joy bo‘sh qolishi kerak.</p>
<p>Oxirgi paragraf.</p>`,
  maxWidth: `<div class="konteyner">
  ${WIDE_IMG}
  <p>Konteyner katta ekranda 600px dan oshmaydi.</p>
</div>`,
  position: `<div class="karta">
  <span class="yorliq">Yangi</span>
  <h3>CSS kursi</h3>
  <p>101 dars, har birida mashq.</p>
</div>
<a class="yuqoriga" href="#">↑ Yuqoriga</a>`,
  zIndex: `<header class="sarlavha">WEBDIZAYN.UZ</header>
<p>Belgi: <span class="belgi">5</span></p>
<div class="modal-fon">
  <div class="modal">Modal oyna</div>
</div>`,
  overflow: `<div class="chat">
  <p>Salom!</p><p>Darsni ko‘rdingizmi?</p><p>Ha, mashqni ham bajardim.</p>
  <p>CHECK o‘tdimi?</p><p>Ha, hammasi yashil.</p><p>Zo‘r!</p>
</div>
<p class="nom">Juda uzun kurs nomi: CSS bilan zamonaviy va moslashuvchan veb-sahifalar yaratish</p>
<pre class="kod">.konteyner { max-width: 1100px; margin: 0 auto; padding: 0 16px; box-sizing: border-box; }</pre>`,
  float: `<div class="maqola">
  ${SMALL_IMG}
  <p>Rasm chapga suzadi va bu matn uni o‘rab oladi. Matn qancha uzun bo‘lsa, rasm atrofidan shuncha chiroyli oqadi.</p>
  <blockquote class="iqtibos">“Yaxshi maket ko‘zga sezilmaydi.”</blockquote>
  <p>Iqtibos o‘ng tomonda turadi, matn esa uning chap tomonidan davom etadi.</p>
</div>`,
  clear: `<div class="quti">
  ${SMALL_IMG}
</div>
<div class="maqola">
  ${SMALL_IMG}
  <p>Rasm yonidagi qisqa matn.</p>
  <h2>Yangi bo‘lim</h2>
  <p>Bu bo‘lim rasm ostidan boshlanishi kerak.</p>
</div>`,
  inlineBlock: `<nav><a href="#">Kurslar</a><a href="#">Narxlar</a></nav>
<p><span class="teg">HTML</span> <span class="teg">CSS</span> <span class="teg">Grid</span></p>
<a class="tugma" href="#">Boshlash</a>
<div class="karta">Qisqa</div>
<div class="karta">Uzunroq<br>kartochka</div>`,
  align: `<h1>Markazlash</h1>
<div class="konteyner">Kengligi 600px bo‘lgan konteyner</div>
<section class="qahramon"><p>Har ikki yo‘nalishda markazda</p></section>
<div class="ota"><div class="bola">Markaz</div></div>`,
};

export const m06: ModuleDef = {
  title: 'Joylashuv',
  lessons: [
    {
      slug: 'display',
      title: '`display` xususiyati',
      exercise: {
        title: 'Blok, qator va yashirish',
        description: '`block`, `inline`, `none` va `visibility: hidden`.',
        instructions: md(
          '1. Menyu havolalari (`nav a`) ustma-ust tursin: `display: block`.',
          '2. `li.qator` lar bir qatorda tursin: `display: inline`.',
          '3. `.yopiq` butunlay yashirilsin (joyi ham qolmasin).',
          '4. `.joy` ko‘rinmasin, lekin joyi bo‘sh qolsin.',
        ),
        expectedBehavior:
          'Havolalar ustma-ust, ro‘yxat bir qatorda, bitta xabar yo‘q, ikkinchisining joyi bo‘sh.',
        difficulty: 'EASY',
        starterFiles: site(BODY06.display, TODO),
        checks: [
          style('nav', 'Havolalar blok', 'nav a', 'display', 'block'),
          style('inline', 'Ro‘yxat bir qatorda', 'li.qator', 'display', 'inline'),
          style('none', '`.yopiq` yashirin', '.yopiq', 'display', 'none'),
          style('hidden', '`.joy` ko‘rinmas, joyi bor', '.joy', 'visibility', 'hidden', {
            hint: '`display: none` joyni ham olib tashlaydi. Boshqa xususiyat kerak.',
          }),
        ],
      },
    },
    {
      slug: 'max-width',
      title: '`max-width` va markazlash',
      exercise: {
        title: 'Moslashuvchan konteyner',
        description: '`max-width`, `margin: 0 auto`, yon padding va rasm.',
        instructions: md(
          '1. `.konteyner`: `max-width: 600px`, `margin: 0 auto`, `padding: 0 16px`.',
          '2. Rasm konteynerdan chiqmasin: `img { max-width: 100%; height: auto; }`.',
        ),
        expectedBehavior:
          'Katta ekranda konteyner markazda, telefonda ekran kengligida, rasm sig‘adi.',
        difficulty: 'EASY',
        starterFiles: site(BODY06.maxWidth, 'body {\n  margin: 0;\n}'),
        checks: [
          style('max', 'Konteyner 600px dan oshmaydi', '.konteyner', 'max-width', '600px'),
          at(
            1000,
            700,
            // content-box: 600px + 2 × 16px padding = 632px, so (1000 - 632) / 2.
            style('center', 'Katta ekranda markazda', '.konteyner', 'margin-left', '184px', {
              hint: '`margin: 0 auto` qolgan joyni ikki tomonga teng bo‘ladi.',
            }),
          ),
          at(400, 700, style('pad', 'Yon padding 16px', '.konteyner', 'padding-left', '16px')),
          at(
            400,
            700,
            style('img', 'Rasm konteynerga sig‘adi', 'img', 'width', '368px', {
              hint: '`img { max-width: 100%; }`',
            }),
          ),
        ],
      },
    },
    {
      slug: 'position',
      title: 'Joylashtirish: `position`',
      exercise: {
        title: 'Yorliq va “yuqoriga” tugmasi',
        description: '`relative` ota, `absolute` bola va `fixed` tugma.',
        instructions: md(
          '1. `.karta` ga `position: relative` bering.',
          '2. `.yorliq` kartochkaning yuqori o‘ng burchagida: `absolute`, `top: 8px`, `right: 8px`.',
          '3. `.yuqoriga` ekranning pastki o‘ng burchagida qotib tursin: `fixed`, `right: 16px`, `bottom: 16px`.',
        ),
        expectedBehavior: 'Yorliq kartochka burchagida, “Yuqoriga” tugmasi ekran burchagida.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY06.position,
          `.karta {
  max-width: 300px;
  padding: 16px;
  border: 1px solid #dddddd;
}

.yorliq {
  background-color: #fec400;
}`,
        ),
        checks: [
          style('rel', 'Kartochka `relative`', '.karta', 'position', 'relative', {
            hint: '`absolute` bola eng yaqin joylashtirilgan otani qidiradi.',
          }),
          style('abs', 'Yorliq `absolute`', '.yorliq', 'position', 'absolute'),
          style('top', 'Yorliq tepadan 8px', '.yorliq', 'top', '8px'),
          style('fixed', 'Tugma `fixed`', '.yuqoriga', 'position', 'fixed'),
          style('right', 'Tugma o‘ngdan 16px', '.yuqoriga', 'right', '16px'),
        ],
      },
    },
    {
      slug: 'z-index',
      title: 'Qatlamlar: `z-index`',
      exercise: {
        title: 'Qatlamlarni tartibga solish',
        description: '`z-index` va u ishlashi uchun kerakli `position`.',
        instructions: md(
          '1. `.sarlavha` ga `z-index: 10`.',
          '2. `.modal-fon` butun ekranni qoplasin: `position: fixed`, `inset: 0`, `z-index: 100`.',
          '3. `.belgi` dagi `z-index: 5` ishlamayapti. Unga `position: relative` qo‘shing.',
        ),
        expectedBehavior: 'Modal fon hamma narsaning ustida, sarlavha kontent ustida.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY06.zIndex,
          `.sarlavha {
  position: sticky;
  top: 0;
  background-color: white;
}

.belgi {
  z-index: 5;
}

.modal-fon {
  background-color: rgba(0, 0, 0, 0.5);
}`,
        ),
        checks: [
          style('header', 'Sarlavha `z-index: 10`', '.sarlavha', 'z-index', '10'),
          style('fixed', 'Modal fon `fixed`', '.modal-fon', 'position', 'fixed'),
          style('inset', 'Modal fon ekranni qoplaydi', '.modal-fon', 'top', '0px'),
          style('z', 'Modal fon `z-index: 100`', '.modal-fon', 'z-index', '100'),
          style('belgi', 'Belgi joylashtirilgan', '.belgi', 'position', 'relative'),
        ],
      },
    },
    {
      slug: 'overflow',
      title: 'Toshib chiqish: `overflow`',
      exercise: {
        title: 'Chat, uzun nom va kod',
        description: 'Aylantirish va “…” bilan kesish.',
        instructions: md(
          '1. `.chat` balandligi `120px` va vertikal aylantirilsin (`overflow-y: auto`).',
          '2. `.nom` bitta qatorda, sig‘magan qismi “…” bilan tugasin.',
          '3. `.kod` gorizontal aylantirilsin (`overflow-x: auto`).',
        ),
        expectedBehavior:
          'Chat qutisida aylantirish paneli, nom “…” bilan tugaydi, kod qutidan chiqmaydi.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY06.overflow, '.nom,\n.kod {\n  max-width: 300px;\n}'),
        checks: [
          style('chat', 'Chat aylantiriladi', '.chat', 'overflow-y', 'auto'),
          style('chat-h', 'Chat balandligi 120px', '.chat', 'height', '120px'),
          style('nowrap', 'Nom bir qatorda', '.nom', 'white-space', 'nowrap'),
          style('ellipsis', 'Nom “…” bilan tugaydi', '.nom', 'text-overflow', 'ellipsis', {
            hint: 'Uchta xususiyat birga kerak: `white-space`, `overflow`, `text-overflow`.',
          }),
          style('code', 'Kod gorizontal aylantiriladi', '.kod', 'overflow-x', 'auto'),
        ],
      },
    },
    {
      slug: 'float',
      title: 'Suzish: `float`',
      exercise: {
        title: 'Matn rasm atrofida',
        description: 'Rasm chapga, iqtibos o‘ngga suzadi.',
        instructions: md(
          '1. `.maqola img`: `float: left`, `margin-right: 16px`.',
          '2. `.iqtibos`: `float: right`, kengligi `40%`.',
        ),
        expectedBehavior: 'Matn rasm va iqtibos atrofidan oqadi.',
        difficulty: 'EASY',
        starterFiles: site(BODY06.float, 'body {\n  margin: 0;\n}'),
        checks: [
          style('img', 'Rasm chapga suzadi', '.maqola img', 'float', 'left'),
          style('gap', 'Rasm o‘ngida 16px', '.maqola img', 'margin-right', '16px'),
          style('quote', 'Iqtibos o‘ngga suzadi', '.iqtibos', 'float', 'right'),
          at(1000, 700, style('width', 'Iqtibos kengligi 40%', '.iqtibos', 'width', '400px')),
        ],
      },
    },
    {
      slug: 'clear',
      title: 'Suzishni to‘xtatish: `clear`',
      exercise: {
        title: 'Ota balandligi va yangi bo‘lim',
        description: '`display: flow-root` va `clear: both`.',
        instructions: md(
          'Ikkala rasm ham `style.css` da chapga suzyapti.',
          '',
          '1. `.quti` suzayotgan rasmni o‘z ichiga olsin: `display: flow-root`.',
          '2. `.maqola h2` rasm ostidan boshlansin: `clear: both`.',
        ),
        expectedBehavior: 'Quti chegarasi rasmni o‘raydi, yangi bo‘lim rasm ostida.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY06.clear,
          `img {
  float: left;
  margin-right: 16px;
}

.quti {
  border: 2px solid #0071dc;
}`,
        ),
        checks: [
          style('root', 'Quti `flow-root`', '.quti', 'display', 'flow-root'),
          style('height', 'Quti rasmni o‘z ichiga oladi', '.quti', 'height', '100px', {
            hint: 'Suzayotgan bola ota balandligiga qo‘shilmaydi.',
          }),
          style('clear', 'Yangi bo‘lim rasm ostida', '.maqola h2', 'clear', 'both'),
        ],
      },
    },
    {
      slug: 'inline-block',
      title: '`inline-block`',
      exercise: {
        title: 'Menyu, teglar va kartochkalar',
        description: 'Qatorda turadigan, lekin o‘lchami bor elementlar.',
        instructions: md(
          '1. `nav a`: `display: inline-block`, `padding: 12px 16px`.',
          '2. `.teg`: `inline-block`, `padding: 2px 10px`, `border-radius: 999px`, fon `#e6f1fc`.',
          '3. `.karta`: `inline-block`, `width: 120px`, `vertical-align: top`.',
        ),
        expectedBehavior: 'Bosish qulay menyu, yumaloq teglar, yuqoridan tekislangan kartochkalar.',
        difficulty: 'EASY',
        starterFiles: site(
          BODY06.inlineBlock,
          '.karta {\n  padding: 8px;\n  border: 1px solid #dddddd;\n}',
        ),
        checks: [
          style('nav', 'Menyu havolalari `inline-block`', 'nav a', 'display', 'inline-block'),
          style('nav-pad', 'Menyu padding 12px', 'nav a', 'padding-top', '12px'),
          style('tag', 'Teglar `inline-block`', '.teg', 'display', 'inline-block'),
          style('card', 'Kartochka kengligi 120px', '.karta', 'width', '120px'),
          style('valign', 'Kartochkalar yuqoridan tekislangan', '.karta', 'vertical-align', 'top'),
        ],
      },
    },
    {
      slug: 'align',
      title: 'Tekislash va markazlash',
      exercise: {
        title: 'To‘rt xil markazlash',
        description: 'Matn, blok, grid va absolute element.',
        instructions: md(
          '1. `h1` matni markazda.',
          '2. `.konteyner`: `max-width: 600px`, markazda (`margin: 0 auto`).',
          '3. `.qahramon`: `display: grid`, `place-items: center`, `min-height: 200px`.',
          '4. `.bola` (`100×50px`, `.ota` ichida) markazda: `position: absolute`, `top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`. `.ota` ga `position: relative` bering.',
        ),
        expectedBehavior: 'Har bir element o‘z usulida markazda.',
        difficulty: 'HARD',
        starterFiles: site(
          BODY06.align,
          `body {
  margin: 0;
}

.ota {
  height: 200px;
  background-color: #f5faff;
}

.bola {
  width: 100px;
  height: 50px;
  background-color: #0071dc;
  color: white;
}`,
        ),
        checks: [
          style('text', 'Sarlavha markazda', 'h1', 'text-align', 'center'),
          at(1000, 700, style('block', 'Konteyner markazda', '.konteyner', 'margin-left', '200px')),
          style('grid', 'Qahramon grid', '.qahramon', 'display', 'grid'),
          style('place', 'Grid kontenti markazda', '.qahramon', 'align-items', 'center'),
          style(
            'abs',
            'Bola o‘z o‘lchamining yarmiga surilgan',
            '.bola',
            'transform',
            'matrix(1, 0, 0, 1, -50, -25)',
            { hint: '`transform: translate(-50%, -50%)`' },
          ),
        ],
      },
      quiz: quiz('6-modul testi: Joylashuv', [
        q(
          'q1',
          'Element ko‘rinmasin, lekin joyi bo‘sh qolsin. Qaysi yozuv?',
          ['`visibility: hidden`', '`display: none`', '`opacity: 1`', '`position: absolute`'],
          [0],
        ),
        q(
          'q2',
          '`position: absolute` element nimaga nisbatan joylashadi?',
          [
            'Eng yaqin joylashtirilgan (static bo‘lmagan) ota elementga',
            'Har doim brauzer oynasiga',
            'O‘zining asl joyiga',
            'Birinchi `div` ga',
          ],
          [0],
        ),
        q(
          'q3',
          '`z-index` qaysi elementlarda ishlaydi?',
          [
            '`position: relative` bo‘lganda',
            'Flex konteynerning bolasida',
            'Har qanday `static` elementda',
            'Faqat `img` da',
          ],
          [0, 1],
        ),
        q(
          'q4',
          'Suzayotgan bolani o‘z ichiga olishi uchun otaga nima beriladi?',
          ['`display: flow-root`', '`float: none`', '`clear: none`', '`position: static`'],
          [0],
        ),
        q(
          'q5',
          'Matnni bir qatorda “…” bilan kesish uchun qaysilari kerak?',
          [
            '`white-space: nowrap`',
            '`overflow: hidden`',
            '`text-overflow: ellipsis`',
            '`display: none`',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};
