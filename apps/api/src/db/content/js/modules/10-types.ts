import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY10 = {
  sets: `<h1>Teglar</h1>
<input id="teglar" placeholder="html, css, html, js">
<p>Ikki guruh: <input id="a" placeholder="A guruh"> <input id="b" placeholder="B guruh"></p>
<button type="button" id="hisobla">Hisoblash</button>
<p>Noyob teglar: <span id="noyob"></span></p>
<p>Soni: <span id="soni"></span></p>
<p>Ikkala guruhda ham: <span id="umumiy"></span></p>`,
  maps: `<h1>So‘z chastotasi</h1>
<textarea id="matn" rows="3" cols="40"></textarea>
<button type="button" id="sana">Sanash</button>
<p>Eng ko‘p: <span id="eng-kop"></span></p>
<p>Turli so‘zlar: <span id="turli"></span></p>`,
  typeof: `<h1>Turlar</h1>
<p>Namunalar: <span id="natijalar"></span></p>
<input id="kiritma">
<button type="button" id="aniqla">Aniqlash</button>
<p>Kiritma: <span id="kiritma-turi"></span></p>`,
  conversion: `<h1>Narxni tozalash</h1>
<input id="narx" placeholder="Masalan: 12 500 so‘m">
<button type="button" id="tozala">Tozalash</button>
<p>Son: <span id="toza"></span></p>
<p>QQS (12%) bilan: <span id="qqs"></span></p>`,
  destructuring: `<h1>Profil</h1>
<p id="toliq"></p>
<p id="manzil"></p>
<p>Qo‘shimcha tillar: <span id="qolgan"></span></p>
<h2>Almashtirish</h2>
<input id="x" type="number"> <input id="y" type="number">
<button type="button" id="almashtir">Almashtirish</button>
<p id="natija"></p>`,
  regexp: `<h1>Tekshiruvlar</h1>
<input id="tel" placeholder="+998 90 123 45 67">
<input id="matn" placeholder="Raqamli matn">
<input id="bosh" placeholder="Ortiqcha   bo‘sh   joylar">
<button type="button" id="tekshir">Tekshirish</button>
<p>Telefon to‘g‘rimi: <span id="tel-holat"></span></p>
<p>Raqamlar: <span id="raqamlar"></span></p>
<p>Tozalangan: <span id="toza"></span></p>`,
};

export const SAMPLES = `const NAMUNALAR = [42, 'salom', null, [1, 2], { a: 1 }, undefined, true];`;

export const PROFILE = `const foydalanuvchi = {
  ism: 'Madina',
  familiya: 'Karimova',
  manzil: { shahar: 'Samarqand' },
  tillar: ['uz', 'ru', 'en'],
};`;

export const m10: ModuleDef = {
  title: 'To‘plamlar va turlar',
  lessons: [
    {
      slug: 'sets',
      title: 'Set',
      exercise: {
        title: 'Noyob teglar',
        description: '`Set` bilan dublikatlarni olib tashlash va kesishma.',
        instructions: md(
          '`#hisobla` bosilganda:',
          '',
          '1. `#teglar` dagi vergul bilan ajratilgan teglarni `trim` va kichik harfga keltirib `Set` ga yig‘ing. `#noyob` ga `, ` bilan, `#soni` ga sonini yozing.',
          '2. `#a` va `#b` guruhlaridagi teglardan ikkalasida ham borlarini (`has`) `#umumiy` ga yozing (A tartibida).',
        ),
        expectedBehavior: '“html, css, HTML, js, css” → html, css, js (3).',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY10.sets, '// #hisobla tugmasi'),
        checks: [
          after(
            [
              fill('#teglar', 'html, css, HTML, js, css'),
              fill('#a', 'a'),
              fill('#b', 'b'),
              click('#hisobla'),
            ],
            text('unique', 'Noyob teglar', '#noyob', 'html, css, js', { equals: true }),
          ),
          after(
            [
              fill('#teglar', 'html, css, HTML, js, css'),
              fill('#a', 'a'),
              fill('#b', 'b'),
              click('#hisobla'),
            ],
            text('count', 'Soni 3', '#soni', '3', { equals: true }),
          ),
          after(
            [
              fill('#teglar', 'grid,flex,  grid'),
              fill('#a', 'a'),
              fill('#b', 'b'),
              click('#hisobla'),
            ],
            text('unique2', 'Boshqa teglar', '#noyob', 'grid, flex', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [
              fill('#teglar', 'x'),
              fill('#a', 'html, css, js'),
              fill('#b', 'css, react, js'),
              click('#hisobla'),
            ],
            text('common', 'Umumiy teglar', '#umumiy', 'css, js', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'maps',
      title: 'Map',
      exercise: {
        title: 'So‘z chastotasi',
        description: '`Map` bilan sanash va eng ko‘pini topish.',
        instructions: md(
          "`#sana` bosilganda matnni kichik harflarga keltirib, bo‘sh joylar bo‘yicha so‘zlarga ajrating (`split(/\\s+/)` yoki `split(' ')`, bo‘sh qismlarsiz) va `Map` bilan sanang:",
          '',
          '1. `#eng-kop` — eng ko‘p uchragan so‘z va soni: **olma (3)**. Teng bo‘lsa — birinchi uchragani.',
          '2. `#turli` — turli so‘zlar soni (`size`).',
        ),
        expectedBehavior: '“olma non olma suv olma non” → olma (3), 3.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY10.maps, '// #sana tugmasi'),
        checks: [
          after(
            [fill('#matn', 'olma non olma suv olma non'), click('#sana')],
            text('top', 'Eng ko‘p uchragan', '#eng-kop', 'olma (3)', { equals: true }),
          ),
          after(
            [fill('#matn', 'olma non olma suv olma non'), click('#sana')],
            text('distinct', 'Turli so‘zlar', '#turli', '3', { equals: true }),
          ),
          after(
            [fill('#matn', 'Biz  BIZ siz biz'), click('#sana')],
            text('top2', 'Katta-kichik harfsiz', '#eng-kop', 'biz (3)', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'typeof',
      title: 'typeof',
      exercise: {
        title: 'Tur aniqlagich',
        description: '`typeof`, `null`, `Array.isArray` va input mazmuni.',
        instructions: md(
          '1. `turi(x)` funksiyasini yozing: `null` uchun **null**, massiv uchun **array**, qolganlari uchun `typeof x`.',
          '2. `NAMUNALAR` ning har biri uchun `turi` ni hisoblab, `#natijalar` ga `, ` bilan yozing.',
          '3. `kiritmaTuri(value)` — bo‘sh (yoki faqat bo‘sh joy) bo‘lsa **bo‘sh**, son bo‘lsa **son**, aks holda **matn**. `#aniqla` bosilganda natijani `#kiritma-turi` ga yozing.',
        ),
        expectedBehavior: 'number, string, null, array, object, undefined, boolean; “42” → son.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY10.typeof, `${SAMPLES}\n\n// turi(x), kiritmaTuri(value) va tugma`),
        checks: [
          text(
            'samples',
            'Namunalar turlari',
            '#natijalar',
            'number, string, null, array, object, undefined, boolean',
            { equals: true },
          ),
          after(
            [fill('#kiritma', '42'), click('#aniqla')],
            text('num', '“42” — son', '#kiritma-turi', 'son', { equals: true }),
          ),
          after(
            [fill('#kiritma', '4a'), click('#aniqla')],
            text('str', '“4a” — matn', '#kiritma-turi', 'matn', { equals: true }),
          ),
          after(
            [fill('#kiritma', '   '), click('#aniqla')],
            text('empty', 'Bo‘sh joylar — bo‘sh', '#kiritma-turi', 'bo‘sh', {
              equals: true,
              hidden: true,
              hint: "`isNaN('   ')` — false. Bo‘shni alohida tekshiring.",
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'type-conversion',
      title: 'Turlarni aylantirish',
      exercise: {
        title: 'Narxni tozalash',
        description: '`replaceAll`, `parseInt` va `Math.round`.',
        instructions: md(
          '`#tozala` bosilganda:',
          '',
          '1. `#narx` dagi matndan bo‘sh joylarni olib tashlab, `parseInt` bilan son oling va `#toza` ga yozing.',
          '2. `#qqs` ga 12% QQS qo‘shilgan narxni butun songa yaxlitlab yozing.',
        ),
        expectedBehavior: '“12 500 so‘m” → 12500 va 14000.',
        difficulty: 'EASY',
        starterFiles: app(BODY10.conversion, '// #tozala tugmasi'),
        checks: [
          after(
            [fill('#narx', '12 500 so‘m'), click('#tozala')],
            text('parsed', 'Tozalangan son', '#toza', '12500', { equals: true }),
          ),
          after(
            [fill('#narx', '12 500 so‘m'), click('#tozala')],
            text('vat', 'QQS bilan', '#qqs', '14000', {
              equals: true,
              hint: '`12500 * 1.12` kasr xatosi beradi — `Math.round`.',
            }),
          ),
          after(
            [fill('#narx', '4 000 so‘m'), click('#tozala')],
            text('parsed2', 'Boshqa narx', '#toza', '4000', { equals: true, hidden: true }),
          ),
          after(
            [fill('#narx', '4 000 so‘m'), click('#tozala')],
            text('vat2', 'Boshqa QQS', '#qqs', '4480', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'destructuring',
      title: 'Destrukturlash',
      exercise: {
        title: 'Profil va almashtirish',
        description: 'Obyekt va massiv destrukturlash, standart qiymat, rest.',
        instructions: md(
          '`foydalanuvchi` obyekti tayyor. **Destrukturlash** bilan:',
          '',
          '1. `ism` va `familiya` ni oling: `#toliq` → **Madina Karimova**.',
          "2. Ichma-ich `shahar` va standart qiymatli `telefon = 'ko‘rsatilmagan'` ni oling: `#manzil` → **Samarqand, ko‘rsatilmagan**.",
          '3. `tillar` dan `[asosiy, ...qolgan]` ni oling: `#qolgan` → **ru, en**.',
          '4. `#almashtir` bosilganda `x` va `y` qiymatlarini `[a, b] = [b, a]` bilan almashtirib, `#natija` ga **a b** shaklida yozing.',
        ),
        expectedBehavior: 'x = 1, y = 2 → “2 1”.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY10.destructuring, `${PROFILE}\n\n// Destrukturlash`),
        checks: [
          text('name', 'To‘liq ism', '#toliq', 'Madina Karimova', { equals: true }),
          text('address', 'Shahar va standart telefon', '#manzil', 'Samarqand, ko‘rsatilmagan', {
            equals: true,
          }),
          text('rest', 'Qolgan tillar', '#qolgan', 'ru, en', { equals: true }),
          after(
            [fill('#x', '1'), fill('#y', '2'), click('#almashtir')],
            text('swap', 'Almashtirish', '#natija', '2 1', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'regexp',
      title: 'Muntazam ifodalar',
      exercise: {
        title: 'Telefon, raqamlar va bo‘sh joylar',
        description: '`test`, `match` va `replace` bilan RegExp.',
        instructions: md(
          '`#tekshir` bosilganda:',
          '',
          '1. `#tel-holat` — telefon aynan `+998 XX XXX XX XX` formatidami (`^...$` bilan `test`).',
          '2. `#raqamlar` — `#matn` dagi barcha raqam guruhlari `, ` bilan (`match(/\\d+/g)`). Raqam bo‘lmasa — bo‘sh.',
          '3. `#toza` — `#bosh` dagi ketma-ket bo‘sh joylar bittaga almashtirilgan va chetlari kesilgan matn.',
        ),
        expectedBehavior: '+998 90 123 45 67 → true; “Narx 12 500, chegirma 10%” → 12, 500, 10.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY10.regexp, '// #tekshir tugmasi'),
        checks: [
          after(
            [
              fill('#tel', '+998 90 123 45 67'),
              fill('#matn', 'a'),
              fill('#bosh', 'a'),
              click('#tekshir'),
            ],
            text('tel', 'To‘g‘ri telefon', '#tel-holat', 'true', { equals: true }),
          ),
          after(
            [
              fill('#tel', '+998 90 123 45 678'),
              fill('#matn', 'a'),
              fill('#bosh', 'a'),
              click('#tekshir'),
            ],
            text('tel2', 'Ortiqcha raqam — false', '#tel-holat', 'false', {
              equals: true,
              hidden: true,
              hint: 'Butun matn tekshirilishi uchun `^` va `$` kerak.',
            }),
          ),
          after(
            [
              fill('#tel', 'x'),
              fill('#matn', 'Narx 12 500 so‘m, chegirma 10%'),
              fill('#bosh', 'a'),
              click('#tekshir'),
            ],
            text('digits', 'Raqamlar', '#raqamlar', '12, 500, 10', { equals: true }),
          ),
          after(
            [
              fill('#tel', 'x'),
              fill('#matn', '1'),
              fill('#bosh', '  Salom    dunyo  '),
              click('#tekshir'),
            ],
            text('spaces', 'Bo‘sh joylar tozalangan', '#toza', 'Salom dunyo', {
              equals: true,
              caseSensitive: true,
            }),
          ),
          clean(),
        ],
      },
      quiz: quiz('10-modul testi: To‘plamlar va turlar', [
        q('set', '`new Set([1, 2, 2, 3, 1]).size` nimaga teng?', ['`3`', '`5`', '`2`', '`4`'], [0]),
        q(
          'map-key',
          '`Map` ning oddiy obyektdan asosiy afzalligi?',
          [
            'Kalit istalgan turdagi qiymat bo‘lishi mumkin',
            'Faqat satr kalitlarni qabul qiladi',
            'JSON ga avtomatik aylanadi',
            'Tezroq yoziladi',
          ],
          [0],
        ),
        q(
          'typeof-null',
          '`typeof null` nima qaytaradi?',
          ["`'object'`", "`'null'`", "`'undefined'`", 'Xato'],
          [0],
        ),
        q(
          'convert',
          'Qaysilari `0` ga teng? (bir nechta javob)',
          [
            "`Number('')`",
            '`Number(null)`',
            '`Number(undefined)`',
            "`Number('0')`",
            "`Number('abc')`",
          ],
          [0, 1, 3],
        ),
        q(
          'regex-anchor',
          "`/^\\d{4}$/.test('abc12345')` natijasi?",
          ['`false`', '`true`', "`'1234'`", 'Xato'],
          [0],
        ),
      ]),
    },
  ],
};
