import { after, app, clean, click, fill, has, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY09 = {
  for: `<h1>for sikli</h1>
<section>
  <h2>Ko‘paytirish jadvali</h2>
  <input id="n" type="number">
  <button type="button" id="jadval-btn">Jadval</button>
  <ul id="jadval"></ul>
</section>
<section>
  <h2>1 dan N gacha yig‘indi</h2>
  <input id="oxiri" type="number">
  <button type="button" id="yigindi-btn">Hisoblash</button>
  <p id="yigindi"></p>
</section>`,
  forIn: `<h1>Narxlar</h1>
<p id="royxat"></p>
<p>Jami: <span id="jami"></span> so‘m</p>
<input id="nom" placeholder="Mahsulot">
<input id="narx" type="number" placeholder="Narx">
<button type="button" id="qosh">Qo‘shish</button>`,
  forOf: `<h1>Matn tahlili</h1>
<input id="matn" placeholder="Matn">
<button type="button" id="tahlil">Tahlil</button>
<p>Unli harflar (a, e, i, o, u): <span id="unlilar"></span></p>
<p>Teskari: <span id="teskari"></span></p>
<p>Eng uzun so‘z: <span id="eng-uzun"></span></p>`,
  while: `<h1>while sikli</h1>
<section>
  <h2>Jamg‘arma</h2>
  <input id="summa" type="number" placeholder="Boshlang‘ich summa">
  <input id="maqsad" type="number" placeholder="Maqsad">
  <input id="foiz" type="number" placeholder="Yillik foiz">
  <button type="button" id="hisobla">Necha yil?</button>
  <p id="yillar"></p>
</section>
<section>
  <h2>Raqamlar yig‘indisi</h2>
  <input id="son" type="number">
  <button type="button" id="raqamlar">Hisoblash</button>
  <p id="yigindi"></p>
</section>`,
  breakContinue: `<h1>Sonlar oqimi</h1>
<input id="sonlar" placeholder="Masalan: 4 9 -1 7 0 12">
<button type="button" id="hisobla">Hisoblash</button>
<p>Musbatlar yig‘indisi (0 gacha): <span id="yigindi"></span></p>
<p>7 ga bo‘linadigan birinchi musbat son: <span id="yettilik"></span></p>`,
  iterables: `<h1>Ro‘yxat</h1>
<input id="sozlar" placeholder="Vergul bilan: olma, non, suv">
<button type="button" id="tuz">Tuzish</button>
<p>Raqamlangan: <span id="raqamli"></span></p>
<p>Bosh harflar: <span id="bosh"></span></p>`,
};

export const PRICES = `const narxlar = { non: 4000, sut: 12000, tuxum: 1500 };`;

export const m09: ModuleDef = {
  title: 'Sikllar',
  lessons: [
    {
      slug: 'loop-for',
      title: 'for sikli',
      exercise: {
        title: 'Jadval va yig‘indi',
        description: '`for` bilan takrorlash va yig‘ish.',
        instructions: md(
          '1. `#jadval-btn` bosilganda `#jadval` ga 10 ta `<li>` yarating: **7 × 1 = 7**, …, **7 × 10 = 70** (`n` — `#n` dan).',
          '2. `#yigindi-btn` bosilganda 1 dan `#oxiri` gacha bo‘lgan sonlar yig‘indisini `#yigindi` ga yozing.',
        ),
        expectedBehavior: 'n = 7 — 10 qatorli jadval; N = 100 — 5050.',
        difficulty: 'EASY',
        starterFiles: app(BODY09.for, '// 1. Ko‘paytirish jadvali\n\n// 2. Yig‘indi'),
        checks: [
          after(
            [fill('#n', '7'), click('#jadval-btn')],
            has('rows', 'Jadvalda 10 qator', '#jadval li', { min: 10, max: 10 }),
          ),
          after(
            [fill('#n', '7'), click('#jadval-btn')],
            text('last', 'Oxirgi qator', '#jadval li:last-child', '7 × 10 = 70', { equals: true }),
          ),
          after(
            [fill('#n', '3'), click('#jadval-btn')],
            text('row4', '3 uchun 4-qator', '#jadval li:nth-child(4)', '3 × 4 = 12', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#oxiri', '100'), click('#yigindi-btn')],
            text('sum', '1 + … + 100 = 5050', '#yigindi', '5050', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'loop-for-in',
      title: 'for...in sikli',
      exercise: {
        title: 'Narxlar ro‘yxati',
        description: 'Obyekt kalitlari bo‘ylab aylanish.',
        instructions: md(
          '`narxlar` obyekti tayyor. `korsat()` funksiyasini yozing va sahifa ochilganda chaqiring:',
          '',
          '1. `for...in` bilan `#royxat` ga **non: 4000; sut: 12000; tuxum: 1500** ko‘rinishidagi matnni yozing.',
          '2. `#jami` ga barcha narxlar yig‘indisini yozing.',
          '3. `#qosh` bosilganda yangi mahsulotni obyektga qo‘shing (narx — son) va `korsat()` ni chaqiring.',
        ),
        expectedBehavior: 'Jami 17500; “choy” 9000 qo‘shilsa — 26500.',
        difficulty: 'EASY',
        starterFiles: app(BODY09.forIn, `${PRICES}\n\n// korsat() va #qosh`),
        checks: [
          text('list', 'Ro‘yxat matni', '#royxat', 'non: 4000; sut: 12000; tuxum: 1500', {
            equals: true,
            hint: "Qiymat: `narxlar[nom]`. Qismlarni massivga yig‘ib, `join('; ')` qiling.",
          }),
          text('sum', 'Jami 17500', '#jami', '17500', { equals: true }),
          after(
            [fill('#nom', 'choy'), fill('#narx', '9000'), click('#qosh')],
            text('added', 'Yangi mahsulot ro‘yxatda', '#royxat', 'choy: 9000'),
          ),
          after(
            [fill('#nom', 'choy'), fill('#narx', '9000'), click('#qosh')],
            text('sum2', 'Jami yangilanadi', '#jami', '26500', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'loop-for-of',
      title: 'for...of sikli',
      exercise: {
        title: 'Matn tahlili',
        description: 'Satr va massiv bo‘ylab `for...of`.',
        instructions: md(
          '`#tahlil` bosilganda `for...of` bilan:',
          '',
          '1. `#unlilar` — matndagi `a, e, i, o, u` harflari soni (katta-kichik farqsiz).',
          '2. `#teskari` — matnni teskari tartibda.',
          '3. `#eng-uzun` — bo‘sh joy bilan ajratilgan so‘zlarning eng uzuni (teng bo‘lsa — birinchisi).',
        ),
        expectedBehavior: '“Toshkent” → 2 unli; “Samarqand” → dnaqramaS.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY09.forOf, '// #tahlil tugmasi'),
        checks: [
          after(
            [fill('#matn', 'Toshkent'), click('#tahlil')],
            text('vowels', '“Toshkent” — 2 unli', '#unlilar', '2', { equals: true }),
          ),
          after(
            [fill('#matn', 'AEIOU bor'), click('#tahlil')],
            text('vowels2', 'Katta harflar ham sanaladi', '#unlilar', '6', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#matn', 'Samarqand'), click('#tahlil')],
            text('reverse', 'Teskari matn', '#teskari', 'dnaqramaS', {
              equals: true,
              caseSensitive: true,
            }),
          ),
          after(
            [fill('#matn', 'HTML CSS JavaScript Grid'), click('#tahlil')],
            text('longest', 'Eng uzun so‘z', '#eng-uzun', 'JavaScript', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'loop-while',
      title: 'while sikli',
      exercise: {
        title: 'Jamg‘arma va raqamlar',
        description: '`while`, `do...while` va cheksiz sikldan himoya.',
        instructions: md(
          '1. `#hisobla`: har yili summaga `summa * foiz / 100` qo‘shiladi. Summa maqsadga yetguncha necha yil o‘tishini `while` bilan hisoblab, `#yillar` ga yozing. Foiz 0 yoki manfiy bo‘lsa — **Hech qachon** (siklni boshlamang!).',
          '2. `#raqamlar`: sonning raqamlari yig‘indisini `% 10` va `Math.floor(son / 10)` bilan (`while` yoki `do...while`) hisoblab, `#yigindi` ga yozing.',
        ),
        expectedBehavior: '1 000 000 → 2 000 000, 12% — 7 yil; 2026 → 10.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY09.while, '// 1. Jamg‘arma\n\n// 2. Raqamlar yig‘indisi'),
        checks: [
          after(
            [
              fill('#summa', '1000000'),
              fill('#maqsad', '2000000'),
              fill('#foiz', '12'),
              click('#hisobla'),
            ],
            text('years', '12% bilan 7 yil', '#yillar', '7', { equals: true }),
          ),
          after(
            [
              fill('#summa', '1000000'),
              fill('#maqsad', '1500000'),
              fill('#foiz', '10'),
              click('#hisobla'),
            ],
            text('years2', '10% bilan 5 yil', '#yillar', '5', { equals: true, hidden: true }),
          ),
          after(
            [
              fill('#summa', '1000000'),
              fill('#maqsad', '2000000'),
              fill('#foiz', '0'),
              click('#hisobla'),
            ],
            text('never', '0% — Hech qachon', '#yillar', 'Hech qachon', {
              equals: true,
              hint: '0% da summa o‘smaydi va sikl cheksiz aylanadi. Avval foizni tekshiring.',
            }),
          ),
          after(
            [fill('#son', '2026'), click('#raqamlar')],
            text('digits', '2026 → 10', '#yigindi', '10', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'break-continue',
      title: 'break va continue',
      exercise: {
        title: 'Sonlar oqimi',
        description: '`continue` bilan o‘tkazib yuborish, `break` bilan to‘xtash.',
        instructions: md(
          '`#hisobla` bosilganda `#sonlar` dagi matnni bo‘sh joy bo‘yicha ajratib, songa aylantiring va:',
          '',
          '1. `#yigindi` — musbat sonlar yig‘indisi: manfiylar o‘tkazib yuboriladi (`continue`), `0` ga yetganda to‘xtaydi (`break`).',
          '2. `#yettilik` — 7 ga bo‘linadigan birinchi **musbat** son (`break`). Bunday son bo‘lmasa — **Topilmadi**.',
        ),
        expectedBehavior: '“4 9 -1 7 0 12” → 20 va 7.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY09.breakContinue, '// #hisobla tugmasi'),
        checks: [
          after(
            [fill('#sonlar', '4 9 -1 7 0 12'), click('#hisobla')],
            text('sum', 'Yig‘indi 20', '#yigindi', '20', { equals: true }),
          ),
          after(
            [fill('#sonlar', '5 -3 8 0 100'), click('#hisobla')],
            text('sum2', '0 da to‘xtaydi', '#yigindi', '13', { equals: true, hidden: true }),
          ),
          after(
            [fill('#sonlar', '4 9 -1 7 0 12'), click('#hisobla')],
            text('seven', 'Birinchi yettilik', '#yettilik', '7', { equals: true }),
          ),
          after(
            [fill('#sonlar', '1 -14 2 3'), click('#hisobla')],
            text('none', 'Topilmadi', '#yettilik', 'Topilmadi', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'iterables',
      title: 'Iteratsiya qilinadiganlar',
      exercise: {
        title: 'Raqamlangan ro‘yxat',
        description: '`entries()`, satr belgilari va `for...of`.',
        instructions: md(
          '`#tuz` bosilganda `#sozlar` dagi matnni vergul bo‘yicha ajrating, har bir so‘zni `trim` qiling va:',
          '',
          '1. `#raqamli` — **1. olma 2. non 3. suv** (`entries()` bilan; qismlar bo‘sh joy bilan ulanadi).',
          '2. `#bosh` — har so‘zning bosh harfi, katta harfda: **ONS**.',
        ),
        expectedBehavior: '“olma, non, suv” → 1. olma 2. non 3. suv | ONS.',
        difficulty: 'EASY',
        starterFiles: app(BODY09.iterables, '// #tuz tugmasi'),
        checks: [
          after(
            [fill('#sozlar', 'olma, non, suv'), click('#tuz')],
            text('numbered', 'Raqamlangan ro‘yxat', '#raqamli', '1. olma 2. non 3. suv', {
              equals: true,
            }),
          ),
          after(
            [fill('#sozlar', 'html,  css'), click('#tuz')],
            text('numbered2', 'Boshqa ro‘yxat', '#raqamli', '1. html 2. css', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#sozlar', 'olma, non, suv'), click('#tuz')],
            text('initials', 'Bosh harflar', '#bosh', 'ONS', { equals: true, caseSensitive: true }),
          ),
          clean(),
        ],
      },
      quiz: quiz('9-modul testi: Sikllar', [
        q(
          'for-len',
          'Massivni `for` bilan aylanishda qaysi shart to‘g‘ri?',
          ['`i < arr.length`', '`i <= arr.length`', '`i < arr.length + 1`', '`i != arr`'],
          [0],
        ),
        q(
          'in-of',
          "`for (const x of ['a', 'b'])` da `x` nima bo‘ladi?",
          ["`'a'`, keyin `'b'`", "`'0'`, keyin `'1'`", '`0`, keyin `1`', 'Xato'],
          [0],
        ),
        q(
          'do',
          '`do...while` ning `while` dan farqi?',
          [
            'Tana kamida bir marta bajariladi',
            'Tana hech qachon bajarilmaydi',
            'Faqat sonlar bilan ishlaydi',
            'Hech qanday farq yo‘q',
          ],
          [0],
        ),
        q(
          'continue',
          '`continue` nima qiladi?',
          [
            'Joriy aylanishning qolganini tashlab, keyingisiga o‘tadi',
            'Siklni butunlay to‘xtatadi',
            'Funksiyadan chiqadi',
            'Siklni boshidan boshlaydi',
          ],
          [0],
        ),
        q(
          'iterable',
          'Qaysilari `for...of` bilan aylanadi? (bir nechta javob)',
          ['Massiv', 'Satr', 'Oddiy obyekt `{}`', '`Set`', 'Son'],
          [0, 1, 3],
        ),
      ]),
    },
  ],
};
