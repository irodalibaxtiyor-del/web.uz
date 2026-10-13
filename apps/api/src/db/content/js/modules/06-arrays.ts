import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY06 = {
  arrays: `<h1>Xarid ro‘yxati</h1>
<p>Ro‘yxat: <span id="ruyxat"></span></p>
<p>Soni: <span id="soni"></span></p>
<p>Oxirgi qo‘shilgan: <span id="oxirgi"></span></p>
<input id="narsa" placeholder="Mahsulot">
<button type="button" id="qosh">Qo‘shish</button>`,
  methods: `<h1>Elektron navbat</h1>
<p>Navbat: <span id="navbat"></span></p>
<p>Chaqirildi: <span id="chaqirildi">—</span></p>
<input id="ism" placeholder="Ism">
<button type="button" id="oxiriga">Oxiriga</button>
<button type="button" id="boshiga">Boshiga (imtiyozli)</button>
<button type="button" id="chiqar">Keyingisini chaqirish</button>
<button type="button" id="olib">Oxirgisini olib tashlash</button>`,
  search: `<h1>Talaba qidiruvi</h1>
<input id="ism" placeholder="Ism">
<button type="button" id="top">Qidirish</button>
<p>Ball: <span id="ball"></span></p>
<p>Ro‘yxatda bormi: <span id="bormi"></span></p>`,
  sort: `<h1>Saralash</h1>
<input id="sonlar" placeholder="Masalan: 5 12 3 40">
<button type="button" id="sarala">Saralash</button>
<p>Standart sort(): <span id="xato"></span></p>
<p>O‘sish: <span id="osish"></span></p>
<p>Kamayish: <span id="kamayish"></span></p>`,
  iteration: `<h1>Guruh natijalari</h1>
<p>O‘tganlar (60 va undan yuqori): <span id="otganlar"></span></p>
<p>O‘rtacha ball: <span id="ortacha"></span></p>
<p>Eng yuqori ball: <span id="eng"></span></p>
<input id="yangi-ism" placeholder="Ism">
<input id="yangi-ball" type="number" placeholder="Ball">
<button type="button" id="qosh">Qo‘shish</button>`,
};

export const STUDENTS = `const talabalar = [
  { ism: 'Ali', ball: 85 },
  { ism: 'Madina', ball: 92 },
  { ism: 'Jasur', ball: 67 },
  { ism: 'Bobur', ball: 44 },
];`;

export const m06: ModuleDef = {
  title: 'Massivlar',
  lessons: [
    {
      slug: 'arrays',
      title: 'Massivlar',
      exercise: {
        title: 'Xarid ro‘yxati',
        description: 'Massiv yaratish, `push`, `length`, `join`, `at`.',
        instructions: md(
          '1. `xaridlar` massivini yarating: `non`, `sut`, `tuxum`.',
          '2. `korsat()` funksiyasi `#ruyxat` ga elementlarni `, ` bilan ulab, `#soni` ga uzunlikni, `#oxirgi` ga oxirgi elementni yozsin. Sahifa ochilganda uni chaqiring.',
          '3. `#qosh` bosilganda `#narsa` qiymatini massivga qo‘shib, `korsat()` ni chaqiring.',
        ),
        expectedBehavior: '“non, sut, tuxum”; “choy” qo‘shilsa — oxirida choy, soni 4.',
        difficulty: 'EASY',
        starterFiles: app(BODY06.arrays, '// xaridlar massivi, korsat() va #qosh'),
        checks: [
          text('list', 'Boshlang‘ich ro‘yxat', '#ruyxat', 'non, sut, tuxum', { equals: true }),
          after(
            [fill('#narsa', 'choy'), click('#qosh')],
            text('push', 'Qo‘shilgan mahsulot oxirida', '#ruyxat', 'non, sut, tuxum, choy', {
              equals: true,
            }),
          ),
          after(
            [fill('#narsa', 'choy'), click('#qosh')],
            text('last', 'Oxirgi element', '#oxirgi', 'choy', { equals: true }),
          ),
          after(
            [fill('#narsa', 'choy'), click('#qosh'), fill('#narsa', 'shakar'), click('#qosh')],
            text('count', 'Ikki qo‘shilgandan keyin 5 ta', '#soni', '5', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'array-methods',
      title: 'Massiv metodlari',
      exercise: {
        title: 'Elektron navbat',
        description: '`push`, `unshift`, `shift`, `pop`.',
        instructions: md(
          '1. `navbat` massivi: `Ali`, `Vali`. Uni `#navbat` ga ` → ` bilan ulab ko‘rsating.',
          '2. `#oxiriga` — ismni oxiriga, `#boshiga` — boshiga qo‘shadi.',
          '3. `#chiqar` — birinchi odamni navbatdan oladi va `#chaqirildi` ga yozadi.',
          '4. `#olib` — oxirgi odamni olib tashlaydi.',
          '5. Har amaldan keyin `#navbat` yangilansin.',
        ),
        expectedBehavior: '“Madina” boshiga → “Madina → Ali → Vali”; chaqirish → Madina.',
        difficulty: 'EASY',
        starterFiles: app(BODY06.methods, '// navbat massivi va tugmalar'),
        checks: [
          text('start', 'Boshlang‘ich navbat', '#navbat', 'Ali → Vali', { equals: true }),
          after(
            [fill('#ism', 'Madina'), click('#boshiga')],
            text('unshift', 'Boshiga qo‘shish', '#navbat', 'Madina → Ali → Vali', { equals: true }),
          ),
          after(
            [click('#chiqar')],
            text('shift', 'Birinchisi chaqiriladi', '#chaqirildi', 'Ali', { equals: true }),
          ),
          after(
            [fill('#ism', 'Jasur'), click('#oxiriga'), click('#olib'), click('#chiqar')],
            text('pop', 'push, pop va shift birgalikda', '#navbat', 'Vali', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'array-search',
      title: 'Massivda qidirish',
      exercise: {
        title: 'Talaba qidiruvi',
        description: '`find`, `?.`, `??` va `includes`.',
        instructions: md(
          '1. `talabalar` obyektlar massivi tayyor. `#top` bosilganda `find` bilan ismi `#ism` ga teng talabani toping.',
          '2. `#ball` ga uning ballini, topilmasa **Topilmadi** yozing (`?.` va `??`).',
          '3. `#bormi` ga ism `ismlar` massivida bor-yo‘qligini yozing (`includes`).',
        ),
        expectedBehavior: 'Madina → 92, true; Bobur → Topilmadi, false.',
        difficulty: 'MEDIUM',
        starterFiles: app(
          BODY06.search,
          `const talabalar = [
  { ism: 'Ali', ball: 85 },
  { ism: 'Madina', ball: 92 },
  { ism: 'Jasur', ball: 67 },
];
const ismlar = ['Ali', 'Madina', 'Jasur'];

// #top tugmasi`,
        ),
        checks: [
          after(
            [fill('#ism', 'Madina'), click('#top')],
            text('found', 'Madina — 92', '#ball', '92', { equals: true }),
          ),
          after(
            [fill('#ism', 'Jasur'), click('#top')],
            text('found2', 'Jasur — 67', '#ball', '67', { equals: true, hidden: true }),
          ),
          after(
            [fill('#ism', 'Bobur'), click('#top')],
            text('missing', 'Bobur — Topilmadi', '#ball', 'Topilmadi', {
              equals: true,
              hint: "`find` hech narsa topmasa `undefined` qaytaradi: `t?.ball ?? 'Topilmadi'`.",
            }),
          ),
          after(
            [fill('#ism', 'Madina'), click('#top')],
            text('includes', 'Madina ro‘yxatda bor', '#bormi', 'true', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'array-sort',
      title: 'Saralash',
      exercise: {
        title: 'Sonlarni saralash',
        description: 'Standart `sort` tuzog‘i va solishtirish funksiyasi.',
        instructions: md(
          "`#sarala` bosilganda `#sonlar` dagi matnni bo‘sh joy bo‘yicha bo‘ling (`split(' ')`) va:",
          '',
          '1. `#xato` ga **standart** `sort()` natijasini yozing — tuzoqni ko‘ring.',
          '2. `#osish` ga o‘sish tartibida, `#kamayish` ga kamayish tartibida saralangan sonlarni `, ` bilan yozing.',
          '',
          'Har biri uchun asl massivning **nusxasini** saralang (`slice()` yoki `toSorted`).',
        ),
        expectedBehavior: '“5 12 3 40” → 12, 3, 40, 5 | 3, 5, 12, 40 | 40, 12, 5, 3.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY06.sort, '// #sarala tugmasi'),
        checks: [
          after(
            [fill('#sonlar', '5 12 3 40'), click('#sarala')],
            text('default', 'Standart sort matn sifatida', '#xato', '12, 3, 40, 5', {
              equals: true,
            }),
          ),
          after(
            [fill('#sonlar', '5 12 3 40'), click('#sarala')],
            text('asc', 'O‘sish tartibi', '#osish', '3, 5, 12, 40', {
              equals: true,
              hint: '`sort(function (a, b) { return a - b; })`',
            }),
          ),
          after(
            [fill('#sonlar', '5 12 3 40'), click('#sarala')],
            text('desc', 'Kamayish tartibi', '#kamayish', '40, 12, 5, 3', { equals: true }),
          ),
          after(
            [fill('#sonlar', '100 9 25'), click('#sarala')],
            text('asc2', 'Boshqa sonlar bilan', '#osish', '9, 25, 100', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'array-iteration',
      title: 'Massiv ustida aylanish',
      exercise: {
        title: 'Guruh natijalari',
        description: '`filter`, `map`, `reduce` va zanjir.',
        instructions: md(
          '`talabalar` massivi tayyor. `hisobla()` funksiyasini yozing va sahifa ochilganda chaqiring:',
          '',
          '1. `#otganlar` — balli 60 va undan yuqori talabalar ismlari, `, ` bilan (`filter` + `map` + `join`).',
          '2. `#ortacha` — o‘rtacha ball, bir xona aniqlikda (`reduce`, `toFixed(1)`).',
          '3. `#eng` — eng yuqori ball (`map` va `Math.max(...)`).',
          '4. `#qosh` bosilganda yangi talabani massivga qo‘shing va `hisobla()` ni qayta chaqiring.',
        ),
        expectedBehavior: 'Ali, Madina, Jasur; 72.0; 92. Dilnoza (100) qo‘shilsa — 77.6 va 100.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY06.iteration, `${STUDENTS}\n\n// hisobla() va #qosh`),
        checks: [
          text('passed', 'O‘tganlar ro‘yxati', '#otganlar', 'Ali, Madina, Jasur', { equals: true }),
          text('avg', 'O‘rtacha ball', '#ortacha', '72.0', {
            equals: true,
            hint: '`reduce` bilan yig‘indi, keyin `length` ga bo‘ling va `toFixed(1)`.',
          }),
          text('max', 'Eng yuqori ball', '#eng', '92', { equals: true }),
          after(
            [fill('#yangi-ism', 'Dilnoza'), fill('#yangi-ball', '100'), click('#qosh')],
            text('avg2', 'Qo‘shilgandan keyin qayta hisoblanadi', '#ortacha', '77.6', {
              equals: true,
              hidden: true,
              hint: 'Ballni `Number` ga aylantiring.',
            }),
          ),
          clean(),
        ],
      },
      quiz: quiz('6-modul testi: Massivlar', [
        q(
          'index',
          "`const a = ['x', 'y', 'z'];` — `a[a.length - 1]` nima?",
          ["`'z'`", "`'y'`", '`undefined`', '`3`'],
          [0],
        ),
        q(
          'shift',
          'Massiv boshidan elementni olib, uni qaytaradigan metod?',
          ['`shift()`', '`pop()`', '`unshift()`', '`slice(0)`'],
          [0],
        ),
        q(
          'sort',
          '`[5, 12, 3].sort()` natijasi?',
          ['`[12, 3, 5]`', '`[3, 5, 12]`', '`[12, 5, 3]`', '`[5, 12, 3]`'],
          [0],
        ),
        q(
          'find',
          'Shartga mos **birinchi** obyektni qaysi metod qaytaradi?',
          ['`find`', '`filter`', '`map`', '`indexOf`'],
          [0],
        ),
        q(
          'mutate',
          'Qaysi metodlar asl massivni **o‘zgartirmaydi**? (bir nechta javob)',
          ['`map`', '`filter`', '`push`', '`slice`', '`sort`'],
          [0, 1, 3],
        ),
      ]),
    },
  ],
};
