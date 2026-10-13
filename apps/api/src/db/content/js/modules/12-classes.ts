import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY12 = {
  classes: `<h1>Talabalar</h1>
<input id="ism" placeholder="Ism">
<input id="ball" type="number" placeholder="Ball">
<button type="button" id="yarat">Yaratish</button>
<p id="karta"></p>
<p>Yaratilganlar: <span id="soni">0</span></p>
<p>Birinchisi Talaba klassidanmi: <span id="tekshir"></span></p>`,
  inheritance: `<h1>Jamg‘arma hisobi</h1>
<p id="info"></p>
<input id="summa" type="number" placeholder="Summa">
<button type="button" id="kirim">Kirim</button>
<button type="button" id="foiz">Foiz qo‘shish</button>`,
  static: `<h1>Buyurtmalar</h1>
<p>Namuna format: <span id="format"></span></p>
<input id="mahsulot" placeholder="Mahsulot">
<button type="button" id="yarat">Buyurtma berish</button>
<p>Oxirgi buyurtma: <span id="oxirgi"></span></p>
<p>Jami buyurtmalar: <span id="soni">0</span></p>`,
  json: `<h1>JSON o‘quvchi</h1>
<textarea id="json" rows="4" cols="50"></textarea>
<button type="button" id="oqish">O‘qish</button>
<p>Natija: <span id="natija"></span></p>
<p>Ixcham JSON: <code id="ixcham"></code></p>
<p role="alert" id="xato"></p>`,
};

export const HISOB = `class Hisob {
  constructor(egasi, balans) {
    this.egasi = egasi;
    this.balans = balans;
  }

  kirim(summa) {
    this.balans += summa;
  }

  malumot() {
    return \`\${this.egasi}: \${this.balans} so‘m\`;
  }
}`;

export const m12: ModuleDef = {
  title: 'Klasslar, modullar va JSON',
  lessons: [
    {
      slug: 'classes',
      title: 'Klasslar',
      exercise: {
        title: 'Talaba klassi',
        description: '`class`, `constructor`, metodlar va `new`.',
        instructions: md(
          '1. `Talaba` klassini yozing: `constructor(ism, ball)`, `baho()` (60 va undan yuqori — **o‘tdi**, aks holda **o‘tmadi**) va `malumot()` — **Ali: 85 ball (o‘tdi)**.',
          '2. `#yarat` bosilganda yangi `Talaba` yarating, `talabalar` massiviga qo‘shing, `#karta` ga `malumot()` ni, `#soni` ga massiv uzunligini yozing.',
          '3. `#tekshir` ga `talabalar[0] instanceof Talaba` natijasini yozing.',
        ),
        expectedBehavior: 'Ali, 85 → “Ali: 85 ball (o‘tdi)”, soni 1, true.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY12.classes, '// class Talaba { ... }\n\n// #yarat tugmasi'),
        checks: [
          after(
            [fill('#ism', 'Ali'), fill('#ball', '85'), click('#yarat')],
            text('card', 'Talaba ma’lumoti', '#karta', 'Ali: 85 ball (o‘tdi)', { equals: true }),
          ),
          after(
            [fill('#ism', 'Bobur'), fill('#ball', '40'), click('#yarat')],
            text('card2', 'O‘tmagan talaba', '#karta', 'Bobur: 40 ball (o‘tmadi)', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#ism', 'Ali'), fill('#ball', '85'), click('#yarat'), click('#yarat')],
            text('count', 'Ikki talaba yaratildi', '#soni', '2', { equals: true }),
          ),
          after(
            [fill('#ism', 'Ali'), fill('#ball', '85'), click('#yarat')],
            text('instance', '`instanceof` — true', '#tekshir', 'true', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'class-inheritance',
      title: 'Meros olish',
      exercise: {
        title: 'Jamg‘arma hisobi',
        description: '`extends`, `super()` va metodni qayta yozish.',
        instructions: md(
          '`Hisob` klassi tayyor. `JamgarmaHisob extends Hisob` klassini yozing:',
          '',
          '1. `constructor(egasi, balans, foiz)` — `super(...)` ni chaqiring va `foiz` ni saqlang.',
          '2. `foizQosh()` — balansga `Math.round(balans * foiz / 100)` qo‘shadi.',
          '3. `malumot()` ni qayta yozing: `super.malumot()` + ` (10%)`.',
          "4. `new JamgarmaHisob('Dilnoza', 100000, 10)` yarating; tugmalar `kirim` va `foizQosh` ni chaqirsin, har safar `#info` yangilansin (sahifa ochilganda ham).",
        ),
        expectedBehavior: '“Dilnoza: 100000 so‘m (10%)”; foizdan keyin 110000.',
        difficulty: 'MEDIUM',
        starterFiles: app(
          BODY12.inheritance,
          `${HISOB}\n\n// class JamgarmaHisob extends Hisob { ... }`,
        ),
        checks: [
          text('start', 'Boshlang‘ich ma’lumot', '#info', 'Dilnoza: 100000 so‘m (10%)', {
            equals: true,
          }),
          after(
            [fill('#summa', '50000'), click('#kirim')],
            text('in', 'Meros qilingan kirim', '#info', 'Dilnoza: 150000 so‘m (10%)', {
              equals: true,
            }),
          ),
          after(
            [click('#foiz')],
            text('interest', 'Foiz qo‘shildi', '#info', 'Dilnoza: 110000 so‘m (10%)', {
              equals: true,
            }),
          ),
          after(
            [fill('#summa', '20000'), click('#kirim'), click('#foiz')],
            text('both', 'Kirim va foiz', '#info', 'Dilnoza: 132000 so‘m (10%)', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'class-static',
      title: 'Statik va yopiq a’zolar',
      exercise: {
        title: 'Buyurtma raqamlari',
        description: '`static` metod, `static #` hisoblagich.',
        instructions: md(
          '`Buyurtma` klassini yozing:',
          '',
          '1. `static #oxirgi = 0` — yopiq umumiy hisoblagich.',
          '2. `static formatla(raqam)` — **B-0042** formatini qaytaradi (`padStart`).',
          '3. `constructor(mahsulot)` — hisoblagichni oshiradi va `this.raqam = Buyurtma.formatla(...)`.',
          '4. `static soni()` — nechta buyurtma yaratilganini qaytaradi.',
          '',
          'Sahifa ochilganda `#format` ga `Buyurtma.formatla(42)` ni yozing. `#yarat` bosilganda `#oxirgi` ga **B-0001: Non** ko‘rinishida, `#soni` ga `Buyurtma.soni()` ni yozing.',
        ),
        expectedBehavior: 'B-0042; birinchi buyurtma B-0001: Non.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY12.static, '// class Buyurtma { ... }'),
        checks: [
          text('format', 'Statik formatlash', '#format', 'B-0042', { equals: true }),
          after(
            [fill('#mahsulot', 'Non'), click('#yarat')],
            text('first', 'Birinchi buyurtma', '#oxirgi', 'B-0001: Non', { equals: true }),
          ),
          after(
            [fill('#mahsulot', 'Sut'), click('#yarat'), click('#yarat'), click('#yarat')],
            text('third', 'Uchinchi buyurtma', '#oxirgi', 'B-0003: Sut', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#mahsulot', 'Sut'), click('#yarat'), click('#yarat')],
            text('count', 'Statik hisoblagich', '#soni', '2', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'modules',
      title: 'Modullar',
    },
    {
      slug: 'json',
      title: 'JSON',
      exercise: {
        title: 'JSON o‘quvchi',
        description: '`JSON.parse`, `JSON.stringify` va buzilgan JSON.',
        instructions: md(
          '`#oqish` bosilganda `#json` matnini `try...catch` ichida `JSON.parse` qiling:',
          '',
          '1. Muvaffaqiyatda: `#natija` — **Ali, 2 ta kurs** (`ism` va `kurslar.length`), `#ixcham` — `JSON.stringify(obj)`, `#xato` bo‘sh.',
          '2. Xatoda: `#xato` — **Noto‘g‘ri JSON**, `#natija` va `#ixcham` bo‘sh.',
        ),
        expectedBehavior: '{ "ism": "Ali", "kurslar": ["HTML", "CSS"] } → Ali, 2 ta kurs.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY12.json, '// #oqish tugmasi'),
        checks: [
          after(
            [fill('#json', '{ "ism": "Ali", "kurslar": ["HTML", "CSS"] }'), click('#oqish')],
            text('parsed', 'JSON o‘qildi', '#natija', 'Ali, 2 ta kurs', { equals: true }),
          ),
          after(
            [fill('#json', '{ "ism": "Ali", "kurslar": ["HTML", "CSS"] }'), click('#oqish')],
            text('compact', 'Ixcham JSON', '#ixcham', '{"ism":"Ali","kurslar":["HTML","CSS"]}', {
              equals: true,
            }),
          ),
          after(
            [
              fill('#json', '{ "ism": "Madina", "kurslar": ["HTML", "CSS", "JS"], "yosh": 21 }'),
              click('#oqish'),
            ],
            text('parsed2', 'Boshqa JSON', '#natija', 'Madina, 3 ta kurs', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#json', "{ism: 'Ali'}"), click('#oqish')],
            text('invalid', 'Buzilgan JSON', '#xato', 'Noto‘g‘ri JSON', {
              equals: true,
              hint: '`JSON.parse` xato tashlaydi — `try...catch` bilan ushlang.',
            }),
          ),
          after([fill('#json', "{ism: 'Ali'}"), click('#oqish')], clean()),
        ],
      },
      quiz: quiz('12-modul testi: Klasslar, modullar va JSON', [
        q(
          'new',
          'Klassdan nusxa qanday yaratiladi?',
          [
            "`new Talaba('Ali')`",
            "`Talaba('Ali')`",
            "`Talaba.new('Ali')`",
            "`create Talaba('Ali')`",
          ],
          [0],
        ),
        q(
          'super',
          'Bola klass konstruktorida `this` dan oldin nima chaqirilishi shart?',
          ['`super(...)`', '`this.constructor()`', '`extends()`', 'Hech narsa'],
          [0],
        ),
        q(
          'private',
          '`#balans` maydoniga qayerdan murojaat qilish mumkin?',
          ['Faqat klass ichidan', 'Istalgan joydan', 'Faqat bola klassdan', 'Faqat konsoldan'],
          [0],
        ),
        q(
          'module',
          'Modul faylini HTML’ga qanday ulaymiz?',
          [
            '`<script type="module" src="main.js"></script>`',
            '`<script src="main.js" module></script>`',
            '`<link rel="module" href="main.js">`',
            '`<module src="main.js">`',
          ],
          [0],
        ),
        q(
          'json',
          'Qaysilari to‘g‘ri JSON? (bir nechta javob)',
          [
            '`{"ism": "Ali"}`',
            '`{ism: "Ali"}`',
            '`["a", "b"]`',
            "`{'ism': 'Ali'}`",
            '`{"a": [1, 2,]}`',
          ],
          [0, 2],
        ),
      ]),
    },
  ],
};
