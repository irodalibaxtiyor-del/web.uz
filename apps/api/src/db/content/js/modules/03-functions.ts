import {
  after,
  app,
  clean,
  click,
  fill,
  md,
  press,
  q,
  quiz,
  text,
  type ModuleDef,
} from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY03 = {
  functions: `<h1>Funksiyalar</h1>
<section>
  <h2>Farengeytdan Selsiyga</h2>
  <input id="f" type="number"> °F
  <button type="button" id="aylantir">Aylantirish</button>
  <p><span id="c"></span> °C</p>
</section>
<section>
  <h2>Xona maydoni</h2>
  <input id="en" type="number"> × <input id="boy" type="number">
  <button type="button" id="hisobla">Hisoblash</button>
  <p><span id="maydon"></span> m²</p>
</section>`,
  objects: `<h1>Obyektlar</h1>
<section>
  <h2 id="nom"></h2>
  <p>Narx: <span id="narx"></span> so‘m</p>
  <button type="button" id="chegirma">20% chegirma</button>
</section>
<section>
  <h2>Talaba kartasi</h2>
  <input id="ism" placeholder="Ism">
  <input id="yosh" type="number" placeholder="Yosh">
  <input id="shahar" placeholder="Shahar">
  <button type="button" id="yarat">Yaratish</button>
  <p id="karta"></p>
</section>`,
  properties: `<h1>Lug‘at</h1>
<p>So‘zlar soni: <span id="soni"></span></p>
<input id="soz" placeholder="O‘zbekcha so‘z">
<button type="button" id="tarjima">Tarjima</button>
<p id="natija"></p>
<h2>Yangi so‘z</h2>
<input id="yangi-soz" placeholder="So‘z">
<input id="yangi-tarjima" placeholder="Tarjimasi">
<button type="button" id="qosh">Qo‘shish</button>`,
  methods: `<h1>Bank hisobi</h1>
<p id="info"></p>
<input id="summa" type="number" placeholder="Summa">
<button type="button" id="kirim">Kirim</button>
<button type="button" id="chiqim">Chiqim</button>
<p>JSON: <code id="json"></code></p>`,
  events: `<h1>Hodisalar paneli</h1>
<label>Matn: <input id="maydon"></label>
<p>Belgilar soni: <span id="uzunlik">0</span></p>
<p>Oxirgi bosilgan tugma: <span id="tugma-nomi">—</span></p>
<div id="kvadrat">Sichqonchani shu yerga olib keling</div>
<p id="holat">Sichqoncha tashqarida</p>`,
};

export const EVENTS_CSS = `#kvadrat {
  width: 220px;
  padding: 32px 16px;
  text-align: center;
  background-color: #eef6ff;
  border: 2px dashed #0071dc;
}`;

export const m03: ModuleDef = {
  title: 'Funksiyalar, obyektlar va hodisalar',
  lessons: [
    {
      slug: 'functions',
      title: 'Funksiyalar',
      exercise: {
        title: 'Harorat va maydon',
        description: 'Parametrli, qiymat qaytaradigan funksiyalar.',
        instructions: md(
          '1. `celsiy(f)` funksiyasini yozing: u `(f - 32) * 5 / 9` ni **qaytarsin** (`return`).',
          '2. `maydon(en, boy)` funksiyasini yozing: u `en * boy` ni qaytarsin.',
          '3. `#aylantir` bosilganda `#f` qiymatini `celsiy` ga bering va natijani `#c` ga yozing.',
          '4. `#hisobla` bosilganda `#en` va `#boy` dan `maydon` ni hisoblab, `#maydon` ga yozing.',
        ),
        expectedBehavior: '212 °F → 100 °C; 4 × 5 → 20 m².',
        difficulty: 'EASY',
        starterFiles: app(
          BODY03.functions,
          `// 1. function celsiy(f) { ... }

// 2. function maydon(en, boy) { ... }

// 3–4. Tugmalar`,
        ),
        checks: [
          after(
            [fill('#f', '212'), click('#aylantir')],
            text('c', '212 °F → 100', '#c', '100', { equals: true }),
          ),
          after(
            [fill('#f', '50'), click('#aylantir')],
            text('c2', '50 °F → 10', '#c', '10', { equals: true, hidden: true }),
          ),
          after(
            [fill('#en', '4'), fill('#boy', '5'), click('#hisobla')],
            text('area', '4 × 5 → 20', '#maydon', '20', { equals: true }),
          ),
          after(
            [fill('#en', '3'), fill('#boy', '7'), click('#hisobla')],
            text('area2', '3 × 7 → 21', '#maydon', '21', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'objects',
      title: 'Obyektlar',
      exercise: {
        title: 'Kurs va talaba kartasi',
        description: 'Obyekt literali, xususiyatni o‘qish va o‘zgartirish.',
        instructions: md(
          "1. `kurs` obyektini yarating: `nom: 'JavaScript asoslari'`, `narx: 450000`.",
          '2. Sahifa ochilganda `#nom` va `#narx` ga obyekt xususiyatlarini yozing.',
          '3. `#chegirma` bosilganda `kurs.narx` ni 20% ga kamaytiring (`* 0.8`) va `#narx` ni yangilang.',
          '4. `#yarat` bosilganda inputlardan `talaba` obyektini yarating (`yosh` — son) va `#karta` ga **Ali, 20 yosh, Xiva** shaklida yozing.',
        ),
        expectedBehavior: '450000 → chegirmadan keyin 360000; talaba kartasi.',
        difficulty: 'EASY',
        starterFiles: app(BODY03.objects, '// 1–3. kurs obyekti\n\n// 4. talaba kartasi'),
        checks: [
          text('nom', 'Kurs nomi chiqadi', '#nom', 'JavaScript asoslari', { equals: true }),
          after(
            [click('#chegirma')],
            text('sale', 'Chegirmadan keyin 360000', '#narx', '360000', {
              equals: true,
              hint: 'Avval `kurs.narx` ni o‘zgartiring, keyin uni sahifaga yozing.',
            }),
          ),
          after(
            [click('#chegirma'), click('#chegirma')],
            text('sale2', 'Ikki marta — 288000', '#narx', '288000', { equals: true, hidden: true }),
          ),
          after(
            [fill('#ism', 'Ali'), fill('#yosh', '20'), fill('#shahar', 'Xiva'), click('#yarat')],
            text('card', 'Talaba kartasi', '#karta', 'Ali, 20 yosh, Xiva', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'object-properties',
      title: 'Obyekt xususiyatlari',
      exercise: {
        title: 'Lug‘at',
        description: 'Kvadrat qavs, yo‘q kalit va yangi xususiyat.',
        instructions: md(
          '1. `lugat` obyektini yarating: `olma` → `apple`, `non` → `bread`, `suv` → `water`.',
          '2. `#soni` ga so‘zlar sonini yozing (`Object.keys(...).length`).',
          '3. `#tarjima` bosilganda `#soz` dagi so‘zning tarjimasini `#natija` ga yozing. So‘z yo‘q bo‘lsa — **Topilmadi** (`??`).',
          '4. `#qosh` bosilganda yangi so‘zni lug‘atga qo‘shing va `#soni` ni yangilang.',
        ),
        expectedBehavior: '“olma” → apple; “kitob” → Topilmadi; kitob/book qo‘shilgach → book.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY03.properties, '// Lug‘at kodini shu yerda yozing.'),
        checks: [
          after(
            [fill('#soz', 'olma'), click('#tarjima')],
            text('found', '“olma” → apple', '#natija', 'apple', {
              equals: true,
              hint: 'Kalit o‘zgaruvchida: `lugat[soz]`, `lugat.soz` emas.',
            }),
          ),
          after(
            [fill('#soz', 'kitob'), click('#tarjima')],
            text('missing', 'Yo‘q so‘z — Topilmadi', '#natija', 'Topilmadi', { equals: true }),
          ),
          after(
            [
              fill('#yangi-soz', 'kitob'),
              fill('#yangi-tarjima', 'book'),
              click('#qosh'),
              fill('#soz', 'kitob'),
              click('#tarjima'),
            ],
            text('added', 'Qo‘shilgan so‘z tarjima qilinadi', '#natija', 'book', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#yangi-soz', 'kitob'), fill('#yangi-tarjima', 'book'), click('#qosh')],
            text('count', 'Qo‘shilgandan keyin 4 ta so‘z', '#soni', '4', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'object-methods',
      title: 'Obyekt metodlari',
      exercise: {
        title: 'Bank hisobi',
        description: 'Metodlar, `this` va `JSON.stringify`.',
        instructions: md(
          "1. `hisob` obyektini yarating: `egasi: 'Dilnoza'`, `balans: 50000` va uchta metod:",
          '   - `kirim(summa)` — `this.balans` ga qo‘shadi;',
          '   - `chiqim(summa)` — `this.balans` dan ayiradi;',
          '   - `malumot()` — **Dilnoza: 50000 so‘m** shaklidagi matnni qaytaradi.',
          '2. Sahifa ochilganda va har amaldan keyin `#info` ga `hisob.malumot()` ni yozing.',
          '3. Sahifa ochilganda `#json` ga `JSON.stringify(hisob)` ni yozing.',
        ),
        expectedBehavior: '20000 kirim → “Dilnoza: 70000 so‘m”; JSON’da metodlar yo‘q.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY03.methods, '// hisob obyekti va tugmalar'),
        checks: [
          text('info', 'Boshlang‘ich ma’lumot', '#info', 'Dilnoza: 50000 so‘m', { equals: true }),
          after(
            [fill('#summa', '20000'), click('#kirim')],
            text('in', 'Kirimdan keyin', '#info', 'Dilnoza: 70000 so‘m', {
              equals: true,
              hint: 'Metod ichida `this.balans` ni o‘zgartiring.',
            }),
          ),
          after(
            [fill('#summa', '1000'), click('#kirim'), fill('#summa', '6000'), click('#chiqim')],
            text('out', 'Kirim va chiqim', '#info', 'Dilnoza: 45000 so‘m', {
              equals: true,
              hidden: true,
            }),
          ),
          text('json', 'JSON’da faqat ma’lumot', '#json', '{"egasi":"Dilnoza","balans":50000}', {
            equals: true,
          }),
          clean(),
        ],
      },
    },
    {
      slug: 'events',
      title: 'Hodisalar',
      exercise: {
        title: 'Hodisalar paneli',
        description: '`input`, `keydown`, `mouseover` va hodisa obyekti.',
        instructions: md(
          '1. `#maydon` ga yozilganda (`input`) `#uzunlik` ga matn uzunligini yozing.',
          '2. `#maydon` da klaviatura tugmasi bosilganda (`keydown`) `#tugma-nomi` ga `event.key` ni yozing.',
          '3. Sichqoncha `#kvadrat` ustiga kelganda `#holat` → **Sichqoncha ustida**, chiqqanda → **Sichqoncha tashqarida**.',
        ),
        expectedBehavior: '“Salom” → 5; Enter bosilsa “Enter”; kvadrat ustida holat o‘zgaradi.',
        difficulty: 'EASY',
        starterFiles: app(BODY03.events, '// Hodisalarni shu yerda ulang.', { css: EVENTS_CSS }),
        checks: [
          after(
            [fill('#maydon', 'Salom')],
            text('len', '“Salom” — 5 belgi', '#uzunlik', '5', {
              equals: true,
              hint: '`oninput` va `maydon.value.length`.',
            }),
          ),
          after(
            [fill('#maydon', 'JavaScript')],
            text('len2', '“JavaScript” — 10 belgi', '#uzunlik', '10', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [press('#maydon', 'Enter')],
            text('key', 'Enter bosilganini ko‘rsatadi', '#tugma-nomi', 'Enter', { equals: true }),
          ),
          after(
            [{ type: 'hover', selector: '#kvadrat' }],
            text('hover', 'Sichqoncha ustida', '#holat', 'Sichqoncha ustida', { equals: true }),
          ),
          clean(),
        ],
      },
      quiz: quiz('3-modul testi: Funksiyalar, obyektlar va hodisalar', [
        q(
          'return',
          '`return` bo‘lmagan funksiya nima qaytaradi?',
          ['`undefined`', '`null`', '`0`', 'Oxirgi hisoblangan qiymatni'],
          [0],
        ),
        q(
          'onclick',
          'Qaysi qator funksiyani tugma **bosilganda** chaqiradi?',
          [
            '`tugma.onclick = hisobla;`',
            '`tugma.onclick = hisobla();`',
            '`tugma.onclick = "hisobla";`',
            '`tugma.click(hisobla);`',
          ],
          [0],
        ),
        q(
          'bracket',
          "`const soz = 'olma';` Lug‘atdan qiymatni qanday olamiz?",
          ['`lugat[soz]`', '`lugat.soz`', "`lugat['soz']`", '`lugat->soz`'],
          [0],
        ),
        q(
          'this',
          'Metod ichidagi `this` nimani bildiradi?',
          [
            'Metodni chaqirgan obyektni',
            'Har doim `window` ni',
            'Funksiyaning o‘zini',
            'Oxirgi yaratilgan obyektni',
          ],
          [0],
        ),
        q(
          'input-event',
          'Maydonga har bir belgi yozilganda qaysi hodisa sodir bo‘ladi?',
          ['`input`', '`change`', '`submit`', '`load`'],
          [0],
        ),
      ]),
    },
  ],
};
