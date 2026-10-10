import { after, at, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

export const m03: ModuleDef = {
  title: 'Chegara va bo‘shliqlar',
  lessons: [
    {
      slug: 'borders',
      title: 'Chegaralar',
      exercise: {
        title: 'Uch xil chegara',
        description: 'Chegara turi, qalinligi va rangi.',
        instructions: md(
          '- `.karta`: `2px solid #0071dc`;',
          '- `.eslatma`: uzuq-uzuq chegara (`dashed`), rang va qalinlik ixtiyoriy;',
          '- `.xato`: matni `crimson`, chegarasi `solid` — rangini **yozmang**, u matn rangini olsin.',
        ),
        expectedBehavior: 'Ko‘k yaxlit, uzuq-uzuq va matn rangidagi qizil chegaralar.',
        difficulty: 'EASY',
        starterFiles: site(
          `<div class="karta">Kurs kartochkasi</div>
<p class="eslatma">Ertaga dars soat 10:00 da.</p>
<p class="xato">Parol noto‘g‘ri.</p>`,
          TODO,
        ),
        checks: [
          style('w', '`.karta` chegarasi 2px', '.karta', 'border-top-width', '2px'),
          style('s', '`.karta` chegarasi solid', '.karta', 'border-top-style', 'solid'),
          style('c', '`.karta` chegarasi ko‘k', '.karta', 'border-top-color', '#0071dc'),
          style('dashed', '`.eslatma` uzuq-uzuq', '.eslatma', 'border-top-style', 'dashed'),
          style(
            'current',
            '`.xato` chegarasi matn rangida',
            '.xato',
            'border-top-color',
            'crimson',
            {
              hint: 'Avval `color: crimson` bering, keyin `border: 2px solid`.',
            },
          ),
        ],
      },
    },
    {
      slug: 'border-sides',
      title: 'Chegara tomonlari',
      exercise: {
        title: 'Tomonlarga alohida chegara',
        description: 'Bitta tomon, to‘rt qiymatli yozuv va tomonni o‘chirish.',
        instructions: md(
          '1. `blockquote` ga faqat chap tomondan `4px solid #0071dc` chegara bering.',
          '2. `.tab` ning hamma tomonida `1px solid #cccccc`, lekin pastki tomonda chegara bo‘lmasin.',
          '3. `.quti` da `border-style: solid` va `border-width: 1px 4px` (yuqori-past 1px, yonlar 4px).',
        ),
        expectedBehavior: 'Iqtibosda chap chiziq, tab pastdan ochiq, qutining yonlari qalinroq.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<blockquote>Bilim — eng katta boylik.</blockquote>
<div class="tab">Faol tab</div>
<div class="quti">Quti</div>`,
          TODO,
        ),
        checks: [
          style('left', 'Iqtibosda chap chegara 4px', 'blockquote', 'border-left-width', '4px'),
          style('left-style', 'Chap chegara solid', 'blockquote', 'border-left-style', 'solid'),
          style(
            'top-none',
            'Iqtibosning yuqorisida chegara yo‘q',
            'blockquote',
            'border-top-style',
            'none',
          ),
          style('tab-top', 'Tab yuqorisida chegara bor', '.tab', 'border-top-style', 'solid'),
          style('tab-bottom', 'Tab pastida chegara yo‘q', '.tab', 'border-bottom-style', 'none'),
          style('sides', 'Qutining yonlari 4px', '.quti', 'border-right-width', '4px'),
        ],
      },
    },
    {
      slug: 'rounded-borders',
      title: 'Yumaloq burchaklar',
      exercise: {
        title: 'Kartochka, avatar va yorliq',
        description: '`border-radius` ning uch xil ishlatilishi.',
        instructions: md(
          '- `.karta` burchaklari: `12px`;',
          '- `.avatar` doira bo‘lsin: `50%`;',
          '- `.yorliq` ning faqat yuqori burchaklari yumaloq: `12px 12px 0 0`.',
        ),
        expectedBehavior: 'Yumaloq kartochka, doira avatar va yuqorisi yumaloq yorliq.',
        difficulty: 'EASY',
        starterFiles: site(
          `<div class="karta">
  <div class="avatar"></div>
  <p>Aziza Karimova</p>
</div>
<div class="yorliq">Yangi</div>`,
          `.karta {
  padding: 16px;
  border: 1px solid #dddddd;
}

.avatar {
  width: 64px;
  height: 64px;
  background-color: #0071dc;
}

.yorliq {
  display: inline-block;
  padding: 4px 12px;
  background-color: #fec400;
}`,
        ),
        checks: [
          style('card', 'Kartochka burchaklari 12px', '.karta', 'border-top-left-radius', '12px'),
          style('avatar', 'Avatar doira', '.avatar', 'border-top-left-radius', '50%'),
          style(
            'tab-top',
            'Yorliqning yuqori burchagi yumaloq',
            '.yorliq',
            'border-top-right-radius',
            '12px',
          ),
          style(
            'tab-bottom',
            'Yorliqning pastki burchagi to‘g‘ri',
            '.yorliq',
            'border-bottom-left-radius',
            '0px',
          ),
        ],
      },
    },
    {
      slug: 'margins',
      title: 'Tashqi bo‘shliq (margin)',
      exercise: {
        title: 'Markazlashgan konteyner',
        description: 'Marginlar va `margin: 0 auto`.',
        instructions: md(
          '1. `body` ning standart marginini olib tashlang (`0`).',
          '2. `.konteyner` ning maksimal kengligi `600px` bo‘lsin va u markazda tursin (`margin: 0 auto`).',
          '3. `h2` ning yuqori margini `32px`, pastki margini `8px`.',
        ),
        expectedBehavior:
          'Sahifa chetlarida bo‘shliq yo‘q, kontent markazda, sarlavhalar tepasida katta bo‘shliq.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<div class="konteyner">
  <h2>Bo‘lim</h2>
  <p>Konteyner sahifa markazida bo‘lishi kerak.</p>
</div>`,
          '.konteyner {\n  background-color: #f5faff;\n}',
        ),
        checks: [
          style('body', '`body` marginsiz', 'body', 'margin-top', '0px'),
          style('max', 'Konteyner 600px dan kengmas', '.konteyner', 'max-width', '600px'),
          at(
            1000,
            700,
            style('center', 'Konteyner markazda', '.konteyner', 'margin-left', '200px', {
              hint: '`margin: 0 auto` qolgan joyni ikki tomonga teng bo‘ladi.',
            }),
          ),
          style('h2-top', 'Sarlavha tepasida 32px', 'h2', 'margin-top', '32px'),
          style('h2-bottom', 'Sarlavha ostida 8px', 'h2', 'margin-bottom', '8px'),
        ],
      },
    },
    {
      slug: 'margin-collapse',
      title: 'Margin’larning qo‘shilishi',
      exercise: {
        title: 'Qochib ketgan margin',
        description: 'Ota va bola marginlarining qo‘shilishini to‘xtatish.',
        instructions: md(
          '1. `.karta` ichidagi sarlavhaning margini kartochkadan tashqariga chiqib ketyapti. `.karta` ga `display: flow-root` bering.',
          '2. Barcha `p` larda faqat pastki margin qolsin: `margin-top: 0`, `margin-bottom: 16px`.',
        ),
        expectedBehavior:
          'Sarlavha kartochka ichida pastroqda turadi, paragraflar orasidagi masofa bir xil.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<div class="karta">
  <h2>Margin collapse</h2>
  <p>Birinchi paragraf.</p>
  <p>Ikkinchi paragraf.</p>
</div>`,
          '.karta {\n  background-color: #f5faff;\n}\n\n.karta h2 {\n  margin-top: 40px;\n}',
        ),
        checks: [
          style('flow-root', 'Kartochka `flow-root`', '.karta', 'display', 'flow-root'),
          style('p-top', 'Paragraflar tepasida margin yo‘q', 'p', 'margin-top', '0px'),
          style('p-bottom', 'Paragraflar ostida 16px', 'p', 'margin-bottom', '16px'),
        ],
      },
    },
    {
      slug: 'padding',
      title: 'Ichki bo‘shliq (padding)',
      exercise: {
        title: 'Tugma va quti',
        description: 'Padding va `box-sizing`.',
        instructions: md(
          '1. `.tugma` ga `padding: 12px 24px` bering.',
          '2. `.quti` kengligi `300px` va padding `20px`. Ekranda ham aynan 300px bo‘lishi uchun `box-sizing: border-box` qo‘shing.',
        ),
        expectedBehavior: 'Tugma bosish uchun qulay, quti padding bilan ham 300px.',
        difficulty: 'EASY',
        starterFiles: site(
          `<a class="tugma" href="#">Yuborish</a>
<div class="quti">Bu quti ekranda 300px bo‘lishi kerak.</div>`,
          `.tugma {
  display: inline-block;
  background-color: #0071dc;
  color: white;
}

.quti {
  margin-top: 16px;
  background-color: #f5faff;
}`,
        ),
        checks: [
          style('btn-y', 'Tugma tepa-pastida 12px', '.tugma', 'padding-top', '12px'),
          style('btn-x', 'Tugma yonlarida 24px', '.tugma', 'padding-left', '24px'),
          style('box-sizing', 'Quti `border-box`', '.quti', 'box-sizing', 'border-box'),
          style('width', 'Quti kengligi 300px', '.quti', 'width', '300px'),
          style('pad', 'Qutida 20px padding', '.quti', 'padding-left', '20px'),
        ],
      },
    },
    {
      slug: 'height-width',
      title: 'Balandlik va kenglik',
      exercise: {
        title: 'Moslashuvchan o‘lchamlar',
        description: '`max-width` va `min-height` bilan ishlash.',
        instructions: md(
          '1. `.maqola` ning kengligi `720px` dan oshmasin (`width` emas, `max-width`!).',
          '2. `.hero` da qat’iy `height` o‘rniga `min-height: 300px` ishlating — matn ko‘paysa blok kattalashsin.',
        ),
        expectedBehavior: 'Kichik ekranda maqola qisqaradi, hero kontentga qarab o‘sadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<section class="hero"><h1>O‘lchamlar</h1></section>
<article class="maqola"><p>Uzun maqola matni shu yerda bo‘ladi.</p></article>`,
          `.hero {
  height: 300px;
  background-color: #0e1133;
  color: white;
}

.maqola {
  width: 720px;
  margin: 0 auto;
}`,
        ),
        checks: [
          style('max', 'Maqola `max-width: 720px`', '.maqola', 'max-width', '720px'),
          at(
            400,
            700,
            style('narrow', 'Tor ekranda maqola qisqaradi', '.maqola', 'width', '400px', {
              hint: '`width: 720px` ni olib tashlang.',
            }),
          ),
          style('min', 'Hero `min-height: 300px`', '.hero', 'min-height', '300px'),
        ],
      },
    },
    {
      slug: 'box-model',
      title: 'Quti modeli',
      exercise: {
        title: 'Qutini yig‘ish',
        description: 'Content, padding, border va margin birgalikda.',
        instructions: md(
          'Barcha elementlarga `box-sizing: border-box` bering (`*` selektori bilan). `.quti` uchun:',
          '',
          '- kenglik `300px`;',
          '- padding `20px`;',
          '- chegara `5px solid #0071dc`;',
          '- margin `10px`.',
        ),
        expectedBehavior: 'Ko‘rinadigan kengligi aynan 300px bo‘lgan quti.',
        difficulty: 'MEDIUM',
        starterFiles: site('<div class="quti">Quti modeli</div>', TODO),
        checks: [
          style('sizing', 'Hamma elementlar `border-box`', 'body', 'box-sizing', 'border-box'),
          style('width', 'Kenglik 300px', '.quti', 'width', '300px'),
          style('padding', 'Padding 20px', '.quti', 'padding-top', '20px'),
          style('border', 'Chegara 5px', '.quti', 'border-top-width', '5px'),
          style('border-color', 'Chegara ko‘k', '.quti', 'border-top-color', '#0071dc'),
          style('margin', 'Margin 10px', '.quti', 'margin-top', '10px'),
        ],
      },
    },
    {
      slug: 'outline',
      title: 'Kontur (outline)',
      exercise: {
        title: 'Ko‘rinadigan fokus',
        description: 'Fokus konturini o‘chirish o‘rniga qayta bezash.',
        instructions: md(
          '1. `style.css` dagi `outline: none` klaviatura foydalanuvchilarini qiynayapti. Uni o‘chiring.',
          '2. `a:focus-visible` uchun `outline: 3px solid #0071dc` va `outline-offset: 2px` yozing.',
          '3. `.tanlangan` ga `3px dashed #fec400` kontur bering.',
        ),
        expectedBehavior:
          'Tab bilan havolaga o‘tilganda ko‘k kontur chiqadi; tanlangan kartochka sariq konturda.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<nav><a href="#kurslar">Kurslar</a> <a href="#aloqa">Aloqa</a></nav>
<div class="tanlangan">Tanlangan kartochka</div>`,
          'a:focus {\n  outline: none;\n}',
        ),
        checks: [
          after(
            [{ type: 'press', selector: 'body', key: 'Tab' }],
            style('focus-color', 'Fokusda ko‘k kontur', 'a', 'outline-color', '#0071dc', {
              hint: '`outline: none` ni olib tashlang va `:focus-visible` uslubini yozing.',
            }),
          ),
          after(
            [{ type: 'press', selector: 'body', key: 'Tab' }],
            style('offset', 'Kontur 2px uzoqlikda', 'a', 'outline-offset', '2px'),
          ),
          style(
            'selected',
            'Tanlangan kartochkada sariq kontur',
            '.tanlangan',
            'outline-color',
            '#fec400',
          ),
          style('dashed', 'Kontur uzuq-uzuq', '.tanlangan', 'outline-style', 'dashed'),
        ],
      },
      quiz: quiz('3-modul testi: Chegara va bo‘shliqlar', [
        q(
          'q1',
          '`border-style` berilmasa chegara qanday bo‘ladi?',
          ['Ko‘rinmaydi', 'Yaxlit chiziq', 'Uzuq-uzuq', 'Qora rangli'],
          [0],
        ),
        q(
          'q2',
          '`margin: 8px 16px 24px 32px` da chap margin qancha?',
          ['32px', '8px', '16px', '24px'],
          [0],
        ),
        q(
          'q3',
          'Fonni oladigan bo‘shliq qaysi?',
          ['padding', 'margin', 'outline', 'Hech qaysi'],
          [0],
        ),
        q(
          'q4',
          '`box-sizing: content-box` da `width: 200px; padding: 10px; border: 5px` bo‘lgan element ko‘rinadigan kengligi?',
          ['230px', '200px', '215px', '220px'],
          [0],
        ),
        q(
          'q5',
          '`outline` haqida qaysilar to‘g‘ri?',
          [
            'Joy egallamaydi',
            'Fokusni ko‘rsatish uchun muhim',
            'Har bir tomonga alohida berish mumkin',
            'Quti modelining qismi',
          ],
          [0, 1],
        ),
      ]),
    },
  ],
};
