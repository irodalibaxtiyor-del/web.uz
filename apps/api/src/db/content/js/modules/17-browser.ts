import {
  after,
  app,
  at,
  clean,
  click,
  fill,
  has,
  md,
  q,
  quiz,
  text,
  type ModuleDef,
} from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY17 = {
  window: `<h1>Ekran</h1>
<p>O‘lcham: <span id="olcham"></span></p>
<p>Qurilma: <span id="turi"></span></p>`,
  location: `<h1>URL tahlilchisi</h1>
<input id="url" size="60" placeholder="https://...">
<button type="button" id="tahlil">Tahlil qilish</button>
<p>Domen: <span id="domen"></span></p>
<p>Yo‘l: <span id="yol"></span></p>
<p>kurs parametri: <span id="param"></span></p>
<p role="alert" id="xato"></p>
<h2>Qidiruv havolasi</h2>
<input id="q" placeholder="So‘rov">
<input id="daraja" placeholder="Daraja">
<button type="button" id="yasa">Havola yasash</button>
<p id="havola"></p>`,
  cookies: `<h1>Interfeys tili</h1>
<button type="button" class="til" data-til="uz">O‘zbekcha</button>
<button type="button" class="til" data-til="ru">Русский</button>
<button type="button" class="til" data-til="en">English</button>
<button type="button" id="ochir">Tanlovni o‘chirish</button>
<p>Joriy til: <span id="joriy"></span></p>
<p>document.cookie: <code id="xom"></code></p>`,
  storage: `<h1>Eslatmalar</h1>
<input id="matn" placeholder="Eslatma">
<button type="button" id="qosh">Qo‘shish</button>
<button type="button" id="tozala">Hammasini o‘chirish</button>
<ul id="royxat"></ul>
<p>Omborda: <code id="saqlangan"></code></p>`,
  apis: `<h1>Web API’lar</h1>
<form id="forma" novalidate>
  <label>Email <input id="email" type="email" required></label>
  <label>Yosh <input id="yosh" type="number" min="16" max="100" required></label>
  <button type="submit" id="tekshir">Tekshirish</button>
</form>
<p role="alert" id="xabar"></p>
<h2>Narxni formatlash</h2>
<input id="summa" type="number" step="0.01">
<button type="button" id="formatla">Dollar formatida</button>
<p id="valyuta"></p>`,
};

export const m17: ModuleDef = {
  title: 'Brauzer va Web API',
  lessons: [
    {
      slug: 'bom-window',
      title: 'window obyekti',
      exercise: {
        title: 'Ekran ma’lumoti',
        description: '`innerWidth`, `innerHeight`, `matchMedia`.',
        instructions: md(
          '1. `#olcham` ga oyna o‘lchamini **1280×800** shaklida yozing (`×` belgisi bilan).',
          "2. `#turi` ga `matchMedia('(max-width: 599px)')` bo‘yicha **mobil** yoki **kompyuter** yozing.",
          '3. (Ixtiyoriy) `resize` hodisasida ikkalasini yangilang.',
        ),
        expectedBehavior: 'Kompyuterda 1280×800, kompyuter; telefonda mobil.',
        difficulty: 'EASY',
        starterFiles: app(BODY17.window, '// window xususiyatlari'),
        checks: [
          at(
            1280,
            800,
            text('size', 'Kompyuter o‘lchami', '#olcham', '1280×800', { equals: true }),
          ),
          at(1280, 800, text('desktop', 'Kompyuter turi', '#turi', 'kompyuter', { equals: true })),
          at(390, 844, text('mobile', 'Telefon turi', '#turi', 'mobil', { equals: true })),
          at(
            390,
            844,
            text('size2', 'Telefon o‘lchami', '#olcham', '390×844', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'bom-location',
      title: 'location va history',
      exercise: {
        title: 'URL tahlilchisi',
        description: '`new URL`, `searchParams`, `URLSearchParams`.',
        instructions: md(
          '1. `#tahlil` bosilganda `#url` ni `new URL(...)` bilan tahlil qiling: `#domen` — `hostname`, `#yol` — `pathname`, `#param` — `kurs` parametri (yo‘q bo‘lsa — **yo‘q**). Noto‘g‘ri URL bo‘lsa `#xato` → **Noto‘g‘ri URL** (`try...catch`), aks holda `#xato` bo‘sh.',
          '2. `#yasa` bosilganda `URLSearchParams` bilan `https://webdizayn.uz/qidiruv` ga `q` va `daraja` parametrlarini qo‘shing va to‘liq manzilni `#havola` ga yozing.',
        ),
        expectedBehavior: 'webdizayn.uz, /kurslar/js, dom; havola ...?q=flex+box&daraja=orta.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY17.location, '// #tahlil va #yasa'),
        checks: [
          after(
            [
              fill('#url', 'https://webdizayn.uz/kurslar/js?kurs=dom&dars=3#mashq'),
              click('#tahlil'),
            ],
            text('host', 'Domen', '#domen', 'webdizayn.uz', { equals: true }),
          ),
          after(
            [
              fill('#url', 'https://webdizayn.uz/kurslar/js?kurs=dom&dars=3#mashq'),
              click('#tahlil'),
            ],
            text('param', '`kurs` parametri', '#param', 'dom', { equals: true }),
          ),
          after(
            [fill('#q', 'flex box'), fill('#daraja', 'orta'), click('#yasa')],
            text(
              'build',
              'Qidiruv havolasi',
              '#havola',
              'https://webdizayn.uz/qidiruv?q=flex+box&daraja=orta',
              {
                equals: true,
                hint: 'Qo‘lda ulamang — `URLSearchParams` bo‘sh joyni o‘zi kodlaydi.',
              },
            ),
          ),
          after(
            [fill('#url', 'bu manzil emas'), click('#tahlil')],
            text('invalid', 'Noto‘g‘ri URL', '#xato', 'Noto‘g‘ri URL', {
              equals: true,
              hidden: true,
            }),
          ),
          after([fill('#url', 'bu manzil emas'), click('#tahlil')], clean()),
        ],
      },
    },
    {
      slug: 'cookies',
      title: 'Cookie’lar',
      exercise: {
        title: 'Til tanlovi cookie’da',
        description: 'Cookie yozish, o‘qish, o‘chirish va himoyalangan kirish.',
        instructions: md(
          '1. `cookieOl(nom)` — `document.cookie` dan berilgan cookie qiymatini qaytarsin (yo‘q bo‘lsa `null`).',
          '2. `.til` tugmasi bosilganda `til=<data-til>; max-age=31536000; path=/; SameSite=Lax` cookie’sini yozing.',
          '3. `#ochir` — `til` cookie’sini `max-age=0` bilan o‘chiradi.',
          "4. `korsat()` — `#joriy` ga `cookieOl('til')` yoki **tanlanmagan**, `#xom` ga `document.cookie` ni yozsin. Sahifa ochilganda va har amaldan keyin chaqiring.",
          '',
          'Cookie bilan ishlashni `try...catch` ga o‘rang: preview’da cookie ishlamaydi, lekin sahifa xato bermasin.',
        ),
        expectedBehavior: 'Русский → ru; o‘chirish → tanlanmagan.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY17.cookies, '// cookieOl, tugmalar va korsat'),
        checks: [
          after(
            [click('[data-til="ru"]')],
            text('set', 'Til cookie’dan o‘qildi', '#joriy', 'ru', { equals: true }),
          ),
          after(
            [click('[data-til="ru"]')],
            text('raw', 'Cookie haqiqatan yozildi', '#xom', 'til=ru'),
          ),
          after(
            [click('[data-til="ru"]'), click('#ochir')],
            text('delete', 'O‘chirilgandan keyin', '#joriy', 'tanlanmagan', { equals: true }),
          ),
          after(
            [click('[data-til="ru"]'), click('[data-til="en"]')],
            text('replace', 'Yangi tanlov eskisini almashtiradi', '#joriy', 'en', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'web-storage',
      title: 'localStorage',
      exercise: {
        title: 'Eslatmalar ombori',
        description: '`localStorage`, JSON va zaxira bilan ishlash.',
        instructions: md(
          '1. `oqi()` / `yoz(royxat)` funksiyalarini yozing: `eslatmalar` kaliti ostida JSON massiv; ombor ishlamasa (`try...catch`) — xotiradagi zaxira.',
          "2. `chiz()` — `#royxat` ni `createElement` bilan qayta chizsin va `#saqlangan` ga `localStorage.getItem('eslatmalar')` (yoki ombor yo‘q/bo‘sh bo‘lsa **bo‘sh**) ni yozsin.",
          '3. `#qosh` — bo‘sh bo‘lmagan eslatmani qo‘shadi; `#tozala` — omborni (`removeItem`) va ro‘yxatni tozalaydi. Sahifa ochilganda `chiz()`.',
        ),
        expectedBehavior: 'Ikki eslatma → ["Birinchi","Ikkinchi"]; tozalash → bo‘sh.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY17.storage, '// oqi, yoz, chiz va tugmalar'),
        checks: [
          after(
            [fill('#matn', 'Birinchi'), click('#qosh'), fill('#matn', 'Ikkinchi'), click('#qosh')],
            has('list', 'Ikki eslatma ko‘rinadi', '#royxat li', { min: 2, max: 2 }),
          ),
          after(
            [fill('#matn', 'Birinchi'), click('#qosh'), fill('#matn', 'Ikkinchi'), click('#qosh')],
            text('stored', 'Omborda JSON massiv', '#saqlangan', '["Birinchi","Ikkinchi"]', {
              equals: true,
              hint: "`localStorage.setItem('eslatmalar', JSON.stringify(royxat))`",
            }),
          ),
          after(
            [fill('#matn', 'Birinchi'), click('#qosh'), click('#tozala')],
            text('cleared', 'Tozalangandan keyin', '#saqlangan', 'bo‘sh', { equals: true }),
          ),
          after(
            [fill('#matn', '   '), click('#qosh')],
            has('empty', 'Bo‘sh eslatma qo‘shilmaydi', '#royxat li', {
              min: 0,
              max: 0,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'web-apis',
      title: 'Web API’lar',
      exercise: {
        title: 'Validatsiya va formatlash',
        description: 'Constraint Validation API va `Intl.NumberFormat`.',
        instructions: md(
          '1. Formaning `submit` ida (`preventDefault`) avval `#email`, keyin `#yosh` ni `validity` bo‘yicha tekshiring va **birinchi** xatoni `#xabar` ga yozing:',
          '   - `valueMissing` → **Maydon to‘ldirilmagan**; `typeMismatch` → **Email formati noto‘g‘ri**;',
          '   - `rangeUnderflow` → **Juda kichik**; `rangeOverflow` → **Juda katta**.',
          '   Xato bo‘lmasa — **Hammasi to‘g‘ri**.',
          "2. `#formatla` bosilganda `#summa` ni `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` bilan `#valyuta` ga yozing.",
        ),
        expectedBehavior: 'Bo‘sh email → to‘ldirilmagan; 1234.5 → $1,234.50.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY17.apis, '// Validatsiya va formatlash'),
        checks: [
          after(
            [fill('#yosh', '20'), click('#tekshir')],
            text('missing', 'Bo‘sh email', '#xabar', 'Maydon to‘ldirilmagan', { equals: true }),
          ),
          after(
            [fill('#email', 'abc'), fill('#yosh', '20'), click('#tekshir')],
            text('type', 'Noto‘g‘ri email', '#xabar', 'Email formati noto‘g‘ri', { equals: true }),
          ),
          after(
            [fill('#email', 'ali@webdizayn.uz'), fill('#yosh', '5'), click('#tekshir')],
            text('under', 'Yosh juda kichik', '#xabar', 'Juda kichik', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#email', 'ali@webdizayn.uz'), fill('#yosh', '20'), click('#tekshir')],
            text('ok', 'Hammasi to‘g‘ri', '#xabar', 'Hammasi to‘g‘ri', { equals: true }),
          ),
          after(
            [fill('#summa', '1234.5'), click('#formatla')],
            text('currency', 'Dollar formati', '#valyuta', '$1,234.50', { equals: true }),
          ),
        ],
      },
      quiz: quiz('17-modul testi: Brauzer va Web API', [
        q(
          'let-window',
          '`let x = 1;` dan keyin `window.x` nima?',
          ['`undefined`', '`1`', 'Xato', '`null`'],
          [0],
        ),
        q(
          'urlsearch',
          'URL parametrlarini xavfsiz yasashning to‘g‘ri usuli?',
          [
            '`URLSearchParams`',
            "`'?q=' + matn`",
            '`location.search = matn`',
            '`JSON.stringify(params)`',
          ],
          [0],
        ),
        q(
          'httponly',
          '`HttpOnly` cookie haqida qaysi gap to‘g‘ri?',
          [
            'JavaScript uni `document.cookie` orqali o‘qiy olmaydi',
            'U faqat HTTP (HTTPS emas) orqali yuboriladi',
            'U brauzerda umuman saqlanmaydi',
            'U `localStorage` ga ko‘chiriladi',
          ],
          [0],
        ),
        q(
          'storage-types',
          "`localStorage.setItem('a', [1, 2])` dan keyin `getItem('a')` nima qaytaradi?",
          ["`'1,2'` — satr", '`[1, 2]`', '`null`', 'Xato'],
          [0],
        ),
        q(
          'secrets',
          'Qaysilarini `localStorage` da saqlash **mumkin emas**? (bir nechta javob)',
          ['Parol', 'Mavzu (yorug‘/qorong‘i)', 'Avtorizatsiya tokeni', 'Forma qoralamasi'],
          [0, 2],
        ),
      ]),
    },
  ],
};
