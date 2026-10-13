import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY04 = {
  strings: `<h1>Matn tahlili</h1>
<p id="iqtibos"></p>
<input id="matn" placeholder="Matn kiriting">
<button type="button" id="tahlil">Tahlil qilish</button>
<p>Uzunligi: <span id="uzunlik"></span></p>
<p>Birinchi va oxirgi belgi: <span id="chetlar"></span></p>`,
  methods: `<h1>Ma’lumotlarni tozalash</h1>
<input id="ism" placeholder="Ism">
<input id="familiya" placeholder="Familiya">
<input id="karta" placeholder="Karta raqami">
<button type="button" id="formatla">Formatlash</button>
<p>To‘liq ism: <span id="toliq"></span></p>
<p>Login: <span id="login"></span></p>
<p>Karta: <span id="yashirin"></span></p>`,
  search: `<h1>Kontakt tekshirgich</h1>
<input id="email" placeholder="Email">
<input id="tel" placeholder="Telefon">
<button type="button" id="tekshir">Tekshirish</button>
<p>Foydalanuvchi: <span id="nom"></span></p>
<p>Domen: <span id="domen"></span></p>
<p>.uz domenimi: <span id="uzmi"></span></p>
<p>O‘zbekiston raqamimi: <span id="uzbek"></span></p>`,
  templates: `<h1>Chek</h1>
<input id="mahsulot" placeholder="Mahsulot">
<input id="narx" type="number" placeholder="Narx">
<input id="soni" type="number" placeholder="Soni">
<button type="button" id="hisobla">Chek chiqarish</button>
<p id="chek"></p>
<div id="karta"></div>`,
};

export const m04: ModuleDef = {
  title: 'Satrlar',
  lessons: [
    {
      slug: 'strings',
      title: 'Satrlar',
      exercise: {
        title: 'Matn tahlili',
        description: 'Uzunlik, belgilarga murojaat va escape belgilari.',
        instructions: md(
          '1. `#iqtibos` ga quyidagi matnni yozing (qo‘shtirnoqlari bilan): **Ustoz: "Bilim — kuch" dedi.**',
          '2. `#tahlil` bosilganda `#matn` qiymatining uzunligini `#uzunlik` ga yozing.',
          '3. `#chetlar` ga birinchi belgi, `...` va oxirgi belgini yozing: `Samarqand` → **S...d**.',
        ),
        expectedBehavior: '“Samarqand” → 9 va “S...d”.',
        difficulty: 'EASY',
        starterFiles: app(BODY04.strings, '// Kodingizni shu yerda yozing.'),
        checks: [
          text('quote', 'Qo‘shtirnoqli iqtibos', '#iqtibos', 'Ustoz: "Bilim — kuch" dedi.', {
            equals: true,
            hint: 'Tashqarida bittalik qo‘shtirnoq, ichida qo‘sh — yoki `\\"`.',
          }),
          after(
            [fill('#matn', 'Samarqand'), click('#tahlil')],
            text('len', '“Samarqand” uzunligi 9', '#uzunlik', '9', { equals: true }),
          ),
          after(
            [fill('#matn', 'Samarqand'), click('#tahlil')],
            text('ends', 'Chetki belgilar', '#chetlar', 'S...d', {
              equals: true,
              caseSensitive: true,
              hint: 'Oxirgi belgi: `matn[matn.length - 1]` yoki `matn.at(-1)`.',
            }),
          ),
          after(
            [fill('#matn', 'Nukus'), click('#tahlil')],
            text('ends2', '“Nukus” uchun ham', '#chetlar', 'N...s', {
              equals: true,
              caseSensitive: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'string-methods',
      title: 'Satr metodlari',
      exercise: {
        title: 'Ma’lumotlarni tozalash',
        description: '`trim`, katta-kichik harf, `slice` va zanjir.',
        instructions: md(
          '`#formatla` bosilganda:',
          '',
          '1. `#toliq` — ism va familiya chetdagi bo‘sh joylarsiz, har biri bosh harf bilan, qolgani kichik: `  aLi ` + `vALIyev` → **Ali Valiyev**.',
          '2. `#login` — `ism.familiya` kichik harflarda: **ali.valiyev**.',
          '3. `#yashirin` — karta raqamining faqat oxirgi 4 raqami: **\\*\\*\\*\\* \\*\\*\\*\\* \\*\\*\\*\\* 5678**.',
          '',
          'Maslahat: bitta so‘zni chiroyli qiladigan `chiroyli(soz)` funksiyasini yozing va ikki marta ishlating.',
        ),
        expectedBehavior:
          'Har qanday registr va bo‘sh joylar bilan kiritilgan ism to‘g‘ri formatlanadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY04.methods, '// #formatla tugmasi'),
        checks: [
          after(
            [fill('#ism', '  aLi '), fill('#familiya', 'vALIyev'), click('#formatla')],
            text('full', 'To‘liq ism formatlangan', '#toliq', 'Ali Valiyev', {
              equals: true,
              caseSensitive: true,
            }),
          ),
          after(
            [fill('#ism', '  aLi '), fill('#familiya', 'vALIyev'), click('#formatla')],
            text('login', 'Login kichik harflarda', '#login', 'ali.valiyev', {
              equals: true,
              caseSensitive: true,
            }),
          ),
          after(
            [fill('#ism', 'DILNOZA'), fill('#familiya', '  karimova  '), click('#formatla')],
            text('full2', 'Boshqa ism ham formatlanadi', '#toliq', 'Dilnoza Karimova', {
              equals: true,
              caseSensitive: true,
              hidden: true,
            }),
          ),
          after(
            [
              fill('#ism', 'Ali'),
              fill('#familiya', 'Valiyev'),
              fill('#karta', '8600123412345678'),
              click('#formatla'),
            ],
            text('card', 'Karta yashirilgan', '#yashirin', '**** **** **** 5678', {
              equals: true,
              hint: '`karta.slice(-4)` — oxirgi 4 belgi.',
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'string-search',
      title: 'Satrda qidirish',
      exercise: {
        title: 'Kontakt tekshirgich',
        description: '`indexOf`, `slice`, `endsWith`, `startsWith`.',
        instructions: md(
          '`#tekshir` bosilganda:',
          '',
          '1. `#nom` — email’ning `@` gacha qismi, `#domen` — `@` dan keyingi qismi.',
          '2. `#uzmi` — email `.uz` bilan tugaydimi (`true`/`false`).',
          '3. `#uzbek` — telefon (chetdagi bo‘sh joylarsiz) `+998` bilan boshlanadimi.',
        ),
        expectedBehavior: 'ali@webdizayn.uz → ali, webdizayn.uz, true.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY04.search, '// #tekshir tugmasi'),
        checks: [
          after(
            [fill('#email', 'ali@webdizayn.uz'), click('#tekshir')],
            text('domain', 'Domen ajratiladi', '#domen', 'webdizayn.uz', {
              equals: true,
              hint: "`email.slice(email.indexOf('@') + 1)`",
            }),
          ),
          after(
            [fill('#email', 'madina.k@mail.com'), click('#tekshir')],
            text('name', 'Foydalanuvchi nomi', '#nom', 'madina.k', { equals: true, hidden: true }),
          ),
          after(
            [fill('#email', 'ali@webdizayn.uz'), click('#tekshir')],
            text('uz', '.uz domeni — true', '#uzmi', 'true', { equals: true }),
          ),
          after(
            [
              fill('#email', 'bob@mail.com'),
              fill('#tel', '  +998 90 123 45 67 '),
              click('#tekshir'),
            ],
            text('phone', 'Telefon +998 bilan boshlanadi', '#uzbek', 'true', {
              equals: true,
              hint: "Avval `trim()`, keyin `startsWith('+998')`.",
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'string-templates',
      title: 'Shablon satrlar',
      exercise: {
        title: 'Chek va kurs kartasi',
        description: '`${}` bilan matn va HTML shablon.',
        instructions: md(
          '1. `#hisobla` bosilganda `#chek` ga shablon satr bilan yozing: **Non × 3 = 12000 so‘m** (mahsulot, soni va `narx * soni`).',
          "2. Sahifa ochilganda `kurs` obyektidan (`nom: 'JavaScript'`, `narx: 450000`) `#karta` ga `innerHTML` orqali `<h3>` (nom) va `<p>` (**450000 so‘m**) yarating.",
        ),
        expectedBehavior: 'Chek bir qatorda; kartada sarlavha va narx.',
        difficulty: 'EASY',
        starterFiles: app(BODY04.templates, '// 1. Chek\n\n// 2. Kurs kartasi'),
        checks: [
          after(
            [
              fill('#mahsulot', 'Non'),
              fill('#narx', '4000'),
              fill('#soni', '3'),
              click('#hisobla'),
            ],
            text('receipt', 'Chek matni', '#chek', 'Non × 3 = 12000 so‘m', { equals: true }),
          ),
          after(
            [
              fill('#mahsulot', 'Choy'),
              fill('#narx', '2500'),
              fill('#soni', '4'),
              click('#hisobla'),
            ],
            text('receipt2', 'Boshqa mahsulot', '#chek', 'Choy × 4 = 10000 so‘m', {
              equals: true,
              hidden: true,
            }),
          ),
          text('title', 'Kartada sarlavha', '#karta h3', 'JavaScript', { equals: true }),
          text('price', 'Kartada narx', '#karta p', '450000 so‘m', { equals: true }),
          clean(),
        ],
      },
      quiz: quiz('4-modul testi: Satrlar', [
        q(
          'slice',
          "`'JavaScript'.slice(-6)` natijasi?",
          ["`'Script'`", "`'JavaSc'`", "`'tpircS'`", "`'ript'`"],
          [0],
        ),
        q(
          'immutable',
          "`let s = 'non'; s.toUpperCase();` dan keyin `s` nimaga teng?",
          [
            "`'non'` — metod yangi satr qaytaradi, asl satr o‘zgarmaydi",
            "`'NON'`",
            '`undefined`',
            'Xato chiqadi',
          ],
          [0],
        ),
        q(
          'indexof',
          "`'abc'.indexOf('z')` nima qaytaradi?",
          ['`-1`', '`0`', '`undefined`', '`false`'],
          [0],
        ),
        q(
          'template',
          'Qaysi biri shablon satr?',
          ['`` `Jami: ${x}` ``', "`'Jami: ${x}'`", '`"Jami: ${x}"`', '`Jami: {x}`'],
          [0],
        ),
        q(
          'bool',
          'Qaysilari `true` qaytaradi? (bir nechta javob)',
          [
            "`'ali@web.uz'.endsWith('.uz')`",
            "`'Toshkent'.includes('tosh')`",
            "`'+998901'.startsWith('+998')`",
            "`'Olma' === 'olma'`",
          ],
          [0, 2],
        ),
      ]),
    },
  ],
};
