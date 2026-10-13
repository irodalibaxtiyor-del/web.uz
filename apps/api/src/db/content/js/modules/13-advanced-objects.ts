import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY13 = {
  constructors: `<h1>Mahsulotlar</h1>
<input id="nom" placeholder="Nom">
<input id="narx" type="number" placeholder="Narx">
<button type="button" id="yarat">Yaratish</button>
<p id="natija"></p>
<p>Konstruktor nomi: <span id="konstruktor"></span></p>
<p>Fabrika obyekti Mahsulot’mi: <span id="zavod"></span></p>`,
  prototypes: `<h1>Prototip metodlari</h1>
<input id="nom" placeholder="Nom">
<input id="narx" type="number" placeholder="Narx">
<button type="button" id="yarat">Ko‘rsatish</button>
<p id="malumot"></p>
<p>Metod umumiymi (non.malumot === sut.malumot): <span id="umumiy"></span></p>
<p>Metod obyektning o‘zidami: <span id="oziniki"></span></p>`,
  accessors: `<h1>Harorat</h1>
<p><input id="c" type="number"> °C <button type="button" id="c-btn">O‘rnatish</button></p>
<p><input id="f" type="number"> °F <button type="button" id="f-btn">O‘rnatish</button></p>
<p>Selsiy: <span id="selsiy"></span></p>
<p>Farengeyt: <span id="farengeyt"></span></p>
<p role="alert" id="xato"></p>`,
  protection: `<h1>Himoyalangan obyektlar</h1>
<p>Til: <span id="til"></span></p>
<p>Sozlamalar muzlatilganmi: <span id="muzlatilgan"></span></p>
<button type="button" id="ozgartir">Tilni “en” ga o‘zgartirishga urinish</button>
<h2>Profil</h2>
<p>Ism: <span id="ism"></span> · Maydonlar soni: <span id="maydonlar"></span></p>
<input id="yangi-ism" placeholder="Yangi ism">
<button type="button" id="ism-ozgartir">Ismni o‘zgartirish</button>
<button type="button" id="qosh-maydon">Telefon maydonini qo‘shish</button>
<p role="alert" id="xabar"></p>`,
  callApplyBind: `<h1>call, apply, bind</h1>
<p>call: <span id="call"></span></p>
<p>apply: <span id="apply"></span></p>
<input id="narx" type="number" placeholder="Narx">
<button type="button" id="hisobla">QQS qo‘shish</button>
<p>QQS bilan: <span id="natija"></span></p>`,
  closures: `<h1>Yopilmalar</h1>
<p>Birlik hisoblagich: <span id="a">0</span> <button type="button" id="a-btn">+1</button></p>
<p>Beshlik hisoblagich: <span id="b">0</span> <button type="button" id="b-btn">+5</button></p>
<input id="son" type="number">
<button type="button" id="ikki-btn">Ikki baravar</button>
<p id="ikki"></p>`,
};

export const MAHSULOT = `function Mahsulot(nom, narx) {
  this.nom = nom;
  this.narx = narx;
}`;

export const TANISHTIR = `function tanishtir(salom, belgi) {
  return \`\${salom}, men \${this.ism}\${belgi}\`;
}

function foizQosh(foiz, narx) {
  return Math.round(narx * (1 + foiz));
}

const ali = { ism: 'Ali' };
const madina = { ism: 'Madina' };`;

export const m13: ModuleDef = {
  title: 'Obyekt va funksiyalar chuqurroq',
  lessons: [
    {
      slug: 'object-constructors',
      title: 'Konstruktor funksiyalar',
      exercise: {
        title: 'Mahsulot konstruktori',
        description: 'Konstruktor funksiya, `new` va fabrika funksiya.',
        instructions: md(
          '1. `Mahsulot(nom, narx)` konstruktor funksiyasini yozing (`this.nom`, `this.narx`).',
          '2. `mahsulotYarat(nom, narx)` fabrika funksiyasini yozing — oddiy obyekt `{ nom, narx }` qaytarsin.',
          '3. `#yarat` bosilganda `new Mahsulot(...)` yarating: `#natija` → **Non — 4000 so‘m**, `#konstruktor` → `constructor.name`.',
          '4. `#zavod` ga `mahsulotYarat(...)` natijasi `instanceof Mahsulot` ekanligini yozing.',
        ),
        expectedBehavior: 'Non — 4000 so‘m; Mahsulot; false.',
        difficulty: 'EASY',
        starterFiles: app(BODY13.constructors, '// Mahsulot, mahsulotYarat va #yarat'),
        checks: [
          after(
            [fill('#nom', 'Non'), fill('#narx', '4000'), click('#yarat')],
            text('result', 'Mahsulot ma’lumoti', '#natija', 'Non — 4000 so‘m', { equals: true }),
          ),
          after(
            [fill('#nom', 'Sut'), fill('#narx', '12000'), click('#yarat')],
            text('result2', 'Boshqa mahsulot', '#natija', 'Sut — 12000 so‘m', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#nom', 'Non'), fill('#narx', '4000'), click('#yarat')],
            text('ctor', 'Konstruktor nomi', '#konstruktor', 'Mahsulot', {
              equals: true,
              caseSensitive: true,
            }),
          ),
          after(
            [fill('#nom', 'Non'), fill('#narx', '4000'), click('#yarat')],
            text('factory', 'Fabrika obyekti Mahsulot emas', '#zavod', 'false', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'object-prototypes',
      title: 'Prototiplar',
      exercise: {
        title: 'Prototip metodlari',
        description: '`Mahsulot.prototype` ga umumiy metodlar qo‘shish.',
        instructions: md(
          '`Mahsulot` konstruktori tayyor. Prototipiga ikki metod qo‘shing:',
          '',
          '- `qqsBilan()` — `Math.round(this.narx * 1.12)`;',
          '- `malumot()` — **Non: 4480 so‘m (QQS bilan)**.',
          '',
          "Sahifa ochilganda `non` (4000) va `sut` (12000) yarating: `#umumiy` ga `non.malumot === sut.malumot`, `#oziniki` ga `non.hasOwnProperty('malumot')` natijasini yozing.",
          '`#yarat` bosilganda inputlardan mahsulot yaratib, `#malumot` ga `malumot()` ni yozing.',
        ),
        expectedBehavior: 'true, false; Non 4000 → Non: 4480 so‘m (QQS bilan).',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY13.prototypes, `${MAHSULOT}\n\n// Mahsulot.prototype metodlari`),
        checks: [
          text('shared', 'Metod umumiy', '#umumiy', 'true', {
            equals: true,
            hint: 'Metodni konstruktor ichida emas, `Mahsulot.prototype` ga yozing.',
          }),
          text('own', 'Metod prototipda', '#oziniki', 'false', { equals: true }),
          after(
            [fill('#nom', 'Non'), fill('#narx', '4000'), click('#yarat')],
            text('info', 'Malumot', '#malumot', 'Non: 4480 so‘m (QQS bilan)', { equals: true }),
          ),
          after(
            [fill('#nom', 'Choy'), fill('#narx', '2500'), click('#yarat')],
            text('info2', 'Boshqa mahsulot', '#malumot', 'Choy: 2800 so‘m (QQS bilan)', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'object-accessors',
      title: 'Getter va setter',
      exercise: {
        title: 'Harorat obyekti',
        description: 'Hisoblanadigan getter va tekshiruvchi setter.',
        instructions: md(
          '`harorat` obyektini yozing: qiymat faqat Selsiyda saqlanadi.',
          '',
          "- `get celsiy` / `set celsiy` — setter `-273.15` dan past qiymatda `throw new RangeError('Absolyut noldan past bo‘lmaydi')`;",
          '- `get farengeyt` — `c * 9 / 5 + 32`; `set farengeyt(f)` — `celsiy = (f - 32) * 5 / 9`.',
          '',
          '`#c-btn` va `#f-btn` tegishli setterni chaqirsin (`try...catch`: xatoda `#xato` ga `message`), keyin `#selsiy` va `#farengeyt` yangilansin.',
        ),
        expectedBehavior: '100 °C → 212 °F; 32 °F → 0 °C; −300 °C → xato.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY13.accessors, '// harorat obyekti va tugmalar'),
        checks: [
          after(
            [fill('#c', '100'), click('#c-btn')],
            text('c2f', '100 °C → 212 °F', '#farengeyt', '212', { equals: true }),
          ),
          after(
            [fill('#f', '32'), click('#f-btn')],
            text('f2c', '32 °F → 0 °C', '#selsiy', '0', { equals: true }),
          ),
          after(
            [fill('#f', '212'), click('#f-btn')],
            text('f2c2', '212 °F → 100 °C', '#selsiy', '100', { equals: true, hidden: true }),
          ),
          after(
            [fill('#c', '-300'), click('#c-btn')],
            text('guard', 'Absolyut noldan past', '#xato', 'Absolyut noldan past bo‘lmaydi', {
              equals: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'object-protection',
      title: 'Obyektlarni himoyalash',
      exercise: {
        title: 'Muzlatilgan sozlamalar',
        description: '`Object.freeze`, `Object.seal` va qat’iy rejim.',
        instructions: md(
          "Fayl boshiga `'use strict';` yozing.",
          '',
          "1. `SOZLAMALAR = Object.freeze({ til: 'uz', mavzu: 'yorug‘' })`. `#til` va `#muzlatilgan` (`Object.isFrozen`) ni ko‘rsating.",
          "2. `#ozgartir` — `try` ichida `SOZLAMALAR.til = 'en'`; xatoda `#xabar` → **O‘zgartirib bo‘lmaydi**. Keyin `#til` ni yangilang.",
          "3. `profil = Object.seal({ ism: 'Ali', yosh: 20 })`. `#ism-ozgartir` ismni o‘zgartiradi; `#qosh-maydon` `try` ichida `profil.telefon = '+998'` qiladi, xatoda `#xabar` → **Yangi maydon qo‘shib bo‘lmaydi**. Har safar `#ism` va `#maydonlar` (`Object.keys(...).length`) yangilansin.",
        ),
        expectedBehavior: 'Til “uz” ligicha; ism o‘zgaradi; maydonlar soni 2 ligicha.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY13.protection, '// SOZLAMALAR, profil va tugmalar'),
        checks: [
          text('frozen', 'Sozlamalar muzlatilgan', '#muzlatilgan', 'true', { equals: true }),
          after(
            [click('#ozgartir')],
            text('blocked', 'O‘zgartirish rad etildi', '#xabar', 'O‘zgartirib bo‘lmaydi', {
              equals: true,
              hint: 'Qat’iy rejimsiz muzlatilgan obyektga yozish xato bermaydi — jimgina e’tiborsiz qoladi.',
            }),
          ),
          after(
            [fill('#yangi-ism', 'Madina'), click('#ism-ozgartir')],
            text('rename', 'Seal qilingan obyektda o‘zgartirish mumkin', '#ism', 'Madina', {
              equals: true,
            }),
          ),
          after(
            [click('#qosh-maydon')],
            text('sealed', 'Yangi maydon qo‘shilmaydi', '#maydonlar', '2', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'call-apply-bind',
      title: 'call, apply, bind',
      exercise: {
        title: 'this ni boshqarish',
        description: '`call`, `apply` va `bind` bilan qisman qo‘llash.',
        instructions: md(
          '`tanishtir`, `foizQosh`, `ali` va `madina` tayyor.',
          '',
          '1. `#call` ga `tanishtir` ni `ali` bilan `call` orqali chaqiring: **Salom, men Ali!**',
          '2. `#apply` ga `madina` bilan `apply` orqali: **Assalomu alaykum, men Madina.**',
          '3. `qqsQosh = foizQosh.bind(null, 0.12)` yarating. `#hisobla` bosilganda narxga QQS qo‘shib `#natija` ga yozing.',
        ),
        expectedBehavior: 'Ikki tanishtiruv; 1000 → 1120.',
        difficulty: 'EASY',
        starterFiles: app(BODY13.callApplyBind, `${TANISHTIR}\n\n// call, apply, bind`),
        checks: [
          text('call', '`call` natijasi', '#call', 'Salom, men Ali!', { equals: true }),
          text('apply', '`apply` natijasi', '#apply', 'Assalomu alaykum, men Madina.', {
            equals: true,
          }),
          after(
            [fill('#narx', '1000'), click('#hisobla')],
            text('bind', 'Qisman qo‘llangan funksiya', '#natija', '1120', { equals: true }),
          ),
          after(
            [fill('#narx', '2500'), click('#hisobla')],
            text('bind2', 'Boshqa narx', '#natija', '2800', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'closures',
      title: 'Yopilmalar',
      exercise: {
        title: 'Mustaqil hisoblagichlar',
        description: 'Yopiq holat va funksiya fabrikasi.',
        instructions: md(
          '1. `hisoblagichYasa(qadam)` — yopiq `qiymat` o‘zgaruvchili va `oshir()` metodli obyekt qaytarsin (global o‘zgaruvchilarsiz!).',
          '2. Ikki hisoblagich yarating: qadami 1 (`#a-btn`, `#a`) va qadami 5 (`#b-btn`, `#b`). Ular bir-biriga bog‘liq bo‘lmasin.',
          '3. `kopaytiruvchi(n)` — `x * n` qaytaradigan funksiya qaytarsin. `ikkiBaravar = kopaytiruvchi(2)` bilan `#ikki-btn` bosilganda `#son` ni ikki baravar qilib `#ikki` ga yozing.',
        ),
        expectedBehavior: '+1 uch marta → 3; +5 ikki marta → 10; 21 → 42.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY13.closures, '// hisoblagichYasa, kopaytiruvchi va tugmalar'),
        checks: [
          after(
            [click('#a-btn'), click('#a-btn'), click('#a-btn')],
            text('a', 'Birlik hisoblagich', '#a', '3', { equals: true }),
          ),
          after(
            [click('#b-btn'), click('#b-btn')],
            text('b', 'Beshlik hisoblagich', '#b', '10', { equals: true }),
          ),
          after(
            [click('#a-btn'), click('#b-btn'), click('#a-btn')],
            text('independent', 'Hisoblagichlar mustaqil', '#a', '2', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#son', '21'), click('#ikki-btn')],
            text('double', 'Ikki baravar', '#ikki', '42', { equals: true }),
          ),
          clean(),
        ],
      },
      quiz: quiz('13-modul testi: Obyekt va funksiyalar chuqurroq', [
        q(
          'proto',
          'Nega metodlar konstruktor ichida emas, `prototype` ga yoziladi?',
          [
            'Barcha obyektlar bitta funksiyani ulashadi — xotira tejaladi',
            'Aks holda metod ishlamaydi',
            'Prototipdagi metod tezroq yoziladi',
            'Konstruktorda funksiya yozish taqiqlangan',
          ],
          [0],
        ),
        q(
          'getter',
          'Getter qanday chaqiriladi?',
          ['`obj.farengeyt`', '`obj.farengeyt()`', "`obj.get('farengeyt')`", '`get obj.farengeyt`'],
          [0],
        ),
        q(
          'freeze',
          '`Object.seal` qilingan obyektda nima mumkin?',
          [
            'Mavjud xususiyatni o‘zgartirish',
            'Yangi xususiyat qo‘shish',
            'Xususiyatni o‘chirish',
            'Hech narsa',
          ],
          [0],
        ),
        q(
          'bind',
          '`bind` nima qaytaradi?',
          ['`this` bog‘langan yangi funksiyani', 'Funksiya natijasini', '`undefined`', 'Obyektni'],
          [0],
        ),
        q(
          'closure',
          '`for (var i = 1; i <= 3; i++) setTimeout(() => console.log(i))` nima chiqaradi?',
          ['4, 4, 4', '1, 2, 3', '3, 3, 3', 'Xato'],
          [0],
        ),
      ]),
    },
  ],
};
