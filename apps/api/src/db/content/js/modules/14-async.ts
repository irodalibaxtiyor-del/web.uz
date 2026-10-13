import { after, app, clean, click, fill, md, q, quiz, text, wait, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY14 = {
  timing: `<h1>Taymerlar</h1>
<section>
  <h2>Xabar yuborish</h2>
  <button type="button" id="yubor">Yuborish</button>
  <button type="button" id="bekor">Bekor qilish</button>
  <p id="xabar"></p>
</section>
<section>
  <h2>Ortga sanoq</h2>
  <button type="button" id="ortga">Boshlash</button>
  <p id="sanoq"></p>
</section>`,
  callbacks: `<h1>Callback’lar</h1>
<p>Kvadratlar: <span id="kvadrat"></span></p>
<input id="id" type="number" placeholder="Foydalanuvchi ID">
<button type="button" id="yukla">Yuklash</button>
<p id="holat"></p>
<p>Natija: <span id="natija"></span></p>
<p role="alert" id="xato"></p>`,
  promises: `<h1>Promise</h1>
<p>Hammasi (Promise.all): <span id="hammasi"></span></p>
<input id="id" type="number" placeholder="Foydalanuvchi ID">
<button type="button" id="yukla">Yuklash</button>
<p id="holat"></p>
<p>Natija: <span id="natija"></span></p>
<p role="alert" id="xato"></p>`,
  asyncAwait: `<h1>async / await</h1>
<input id="id" type="number" placeholder="Foydalanuvchi ID">
<button type="button" id="yukla">Profilni yuklash</button>
<p id="holat"></p>
<p>Profil: <span id="profil"></span></p>
<p role="alert" id="xato"></p>`,
  fetch: `<h1>Kurslar API</h1>
<input id="manzil" value="/api/kurslar" size="40">
<button type="button" id="yukla">Yuklash</button>
<p id="holat"></p>
<p>Kurslar: <span id="royxat"></span></p>
<p role="alert" id="xato"></p>`,
};

export const BAZA_CB = `// Server o‘rnida: 300 ms dan keyin callback(xato, natija) ni chaqiradi.
const BAZA = { 1: 'Ali', 2: 'Madina' };

function malumotOl(id, callback) {
  setTimeout(() => {
    const ism = BAZA[id];
    if (ism) callback(null, { id, ism });
    else callback(new Error('Topilmadi'));
  }, 300);
}`;

export const BAZA_PROMISE = `const BAZA = { 1: 'Ali', 2: 'Madina' };`;

export const BAZA_ASYNC = `// Server o‘rnida: har biri 300 ms dan keyin tugaydigan Promise qaytaradi.
const FOYDALANUVCHILAR = { 1: 'Ali', 2: 'Madina' };
const KURSLAR = { 1: ['HTML', 'CSS'], 2: ['JavaScript'] };

function malumotOl(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (FOYDALANUVCHILAR[id]) resolve(FOYDALANUVCHILAR[id]);
      else reject(new Error('Topilmadi'));
    }, 300);
  });
}

function kurslarOl(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(KURSLAR[id] ?? []), 300);
  });
}`;

export const SOXTA_FETCH = `// Mashq sahifasida tarmoq yopiq. soxtaFetch haqiqiy fetch kabi ishlaydi:
// Promise qaytaradi, javobda ok, status va json() bor.
const SERVER = {
  '/api/kurslar': [
    { nom: 'HTML', daraja: 'boshlangich' },
    { nom: 'CSS', daraja: 'boshlangich' },
    { nom: 'JavaScript', daraja: 'orta' },
  ],
};

function soxtaFetch(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const [yol, sorov] = url.split('?');
      let data = SERVER[yol];
      if (data && sorov) {
        const daraja = new URLSearchParams(sorov).get('daraja');
        data = data.filter((k) => k.daraja === daraja);
      }
      resolve({
        ok: Boolean(data),
        status: data ? 200 : 404,
        json: async () => data ?? { xato: 'Topilmadi' },
      });
    }, 300);
  });
}`;

export const m14: ModuleDef = {
  title: 'Asinxron JavaScript',
  lessons: [
    {
      slug: 'timing',
      title: 'Taymerlar',
      exercise: {
        title: 'Bekor qilinadigan xabar va ortga sanoq',
        description: '`setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`.',
        instructions: md(
          '1. `#yubor` — `#xabar` ga darhol **Yuborilmoqda...**, 500 ms dan keyin **Yuborildi**.',
          '2. `#bekor` — taymerni to‘xtatadi va `#xabar` ga **Bekor qilindi** yozadi.',
          '3. `#ortga` — har 200 ms da `#sanoq` ga 3, 2, 1 yozadi, keyin **Boshlandi!** va intervalni to‘xtatadi.',
        ),
        expectedBehavior: 'Yuborish 0.5 soniyadan keyin tugaydi; bekor qilish uni to‘xtatadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY14.timing, '// Taymerlar'),
        checks: [
          after(
            [click('#yubor')],
            text('sending', 'Darhol “Yuborilmoqda...”', '#xabar', 'Yuborilmoqda...', {
              equals: true,
            }),
          ),
          after(
            [click('#yubor'), wait(900)],
            text('sent', '500 ms dan keyin “Yuborildi”', '#xabar', 'Yuborildi', { equals: true }),
          ),
          after(
            [click('#yubor'), click('#bekor'), wait(900)],
            text('cancel', 'Bekor qilingan xabar yuborilmaydi', '#xabar', 'Bekor qilindi', {
              equals: true,
              hint: '`setTimeout` qaytargan ID ni saqlang va `clearTimeout(id)` qiling.',
            }),
          ),
          after(
            [click('#ortga'), wait(1500)],
            text('countdown', 'Ortga sanoq tugaydi', '#sanoq', 'Boshlandi!', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'callbacks',
      title: 'Callback funksiyalar',
      exercise: {
        title: 'Callback’lar bilan ishlash',
        description: 'Yuqori tartibli funksiya va asinxron error-first callback.',
        instructions: md(
          '1. `qollash(sonlar, fn)` — har bir songa `fn` ni qo‘llab, yangi massiv qaytarsin (`map` ishlatmang — o‘zingiz yozing). `#kvadrat` ga `qollash([1, 2, 3, 4], ...)` bilan kvadratlarni `, ` bilan yozing.',
          '2. `#yukla` bosilganda `#holat` ga **Yuklanmoqda...** yozing va tayyor `malumotOl(id, callback)` ni chaqiring. Callback’da: xato bo‘lsa `#xato` ga `message`, aks holda `#natija` ga `ism`; ikkala holatda `#holat` ni tozalang.',
        ),
        expectedBehavior: '1, 4, 9, 16; ID 2 → Madina; ID 9 → Topilmadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY14.callbacks, `${BAZA_CB}\n\n// qollash va #yukla`),
        checks: [
          text('squares', 'Kvadratlar', '#kvadrat', '1, 4, 9, 16', { equals: true }),
          after(
            [fill('#id', '2'), click('#yukla')],
            text('loading', 'Kutish holati', '#holat', 'Yuklanmoqda...', { equals: true }),
          ),
          after(
            [fill('#id', '2'), click('#yukla'), wait(700)],
            text('loaded', 'ID 2 — Madina', '#natija', 'Madina', { equals: true }),
          ),
          after(
            [fill('#id', '9'), click('#yukla'), wait(700)],
            text('missing', 'ID 9 — Topilmadi', '#xato', 'Topilmadi', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'promises',
      title: 'Promise',
      exercise: {
        title: 'Promise qaytaradigan yuklovchi',
        description: '`new Promise`, `then/catch/finally`, `Promise.all`.',
        instructions: md(
          "1. `malumotOl(id)` funksiyasini yozing: 300 ms dan keyin `BAZA[id]` bo‘lsa `resolve(ism)`, aks holda `reject(new Error('Topilmadi'))`.",
          '2. `#yukla`: `then` — `#natija` ga ism; `catch` — `#xato` ga `message`; `finally` — `#holat` ga **Tayyor**.',
          '3. Sahifa ochilganda `Promise.all([malumotOl(1), malumotOl(2)])` natijasini `#hammasi` ga `, ` bilan yozing.',
        ),
        expectedBehavior: 'Ali, Madina; ID 1 → Ali; ID 7 → Topilmadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(
          BODY14.promises,
          `${BAZA_PROMISE}\n\n// malumotOl(id), #yukla va Promise.all`,
        ),
        checks: [
          after(
            [wait(800)],
            text('all', '`Promise.all` natijasi', '#hammasi', 'Ali, Madina', { equals: true }),
          ),
          after(
            [fill('#id', '1'), click('#yukla'), wait(700)],
            text('then', 'ID 1 — Ali', '#natija', 'Ali', { equals: true }),
          ),
          after(
            [fill('#id', '7'), click('#yukla'), wait(700)],
            text('catch', 'ID 7 — Topilmadi', '#xato', 'Topilmadi', { equals: true }),
          ),
          after(
            [fill('#id', '7'), click('#yukla'), wait(700)],
            text('finally', '`finally` bajariladi', '#holat', 'Tayyor', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#id', '7'), click('#yukla'), wait(700)],
            clean({ hint: 'Rad etilgan Promise `catch` bilan ushlanmasa, konsolda xato chiqadi.' }),
          ),
        ],
      },
    },
    {
      slug: 'async-await',
      title: 'async va await',
      exercise: {
        title: 'Profilni yuklash',
        description: '`async` funksiya, ketma-ket `await` va `try...catch`.',
        instructions: md(
          '`malumotOl(id)` va `kurslarOl(id)` tayyor (ikkalasi Promise qaytaradi).',
          '',
          '1. `async function profilYukla(id)` — avval ismni, keyin kurslarni `await` bilan oling va **Ali: HTML, CSS** matnini qaytaring.',
          '2. `#yukla` bosilganda `#holat` → **Yuklanmoqda...**; `try` da `#profil` ga natija, `catch` da `#xato` ga `message`; `finally` da `#holat` ni tozalang.',
        ),
        expectedBehavior: 'ID 1 → Ali: HTML, CSS; ID 9 → Topilmadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY14.asyncAwait, `${BAZA_ASYNC}\n\n// profilYukla va #yukla`),
        checks: [
          after(
            [fill('#id', '1'), click('#yukla')],
            text('loading', 'Kutish holati', '#holat', 'Yuklanmoqda...', { equals: true }),
          ),
          after(
            [fill('#id', '1'), click('#yukla'), wait(1200)],
            text('profile', 'ID 1 profili', '#profil', 'Ali: HTML, CSS', { equals: true }),
          ),
          after(
            [fill('#id', '2'), click('#yukla'), wait(1200)],
            text('profile2', 'ID 2 profili', '#profil', 'Madina: JavaScript', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#id', '9'), click('#yukla'), wait(1000)],
            text('error', 'ID 9 — Topilmadi', '#xato', 'Topilmadi', { equals: true }),
          ),
          after([fill('#id', '9'), click('#yukla'), wait(1000)], clean()),
        ],
      },
    },
    {
      slug: 'fetch',
      title: 'fetch',
      exercise: {
        title: 'Kurslar API',
        description: '`ok`/`status` ni tekshirish, `json()` va uch holat.',
        instructions: md(
          'Tayyor `soxtaFetch(url)` haqiqiy `fetch` kabi ishlaydi.',
          '',
          "1. `async function kurslarniYukla(url)` — `soxtaFetch` bilan so‘rov; `ok` bo‘lmasa `throw new Error('HTTP ' + status)`; aks holda `json()` ni qaytaring.",
          '2. `#yukla` bosilganda `#manzil` dagi URL bilan yuklang: `#holat` → **Yuklanmoqda...**; natijada `#royxat` ga kurs nomlari `, ` bilan; xatoda `#xato` ga `message`; oxirida `#holat` ni tozalang.',
        ),
        expectedBehavior: '/api/kurslar → HTML, CSS, JavaScript; /api/yoq → HTTP 404.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY14.fetch, `${SOXTA_FETCH}\n\n// kurslarniYukla va #yukla`),
        checks: [
          after(
            [fill('#manzil', '/api/kurslar'), click('#yukla'), wait(800)],
            text('list', 'Kurslar ro‘yxati', '#royxat', 'HTML, CSS, JavaScript', { equals: true }),
          ),
          after(
            [fill('#manzil', '/api/kurslar?daraja=boshlangich'), click('#yukla'), wait(800)],
            text('filter', 'Filtrlangan so‘rov', '#royxat', 'HTML, CSS', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#manzil', '/api/yoq'), click('#yukla'), wait(800)],
            text('404', '404 xatosi ko‘rsatiladi', '#xato', 'HTTP 404', {
              equals: true,
              hint: '`fetch` 404 da ham muvaffaqiyatli tugaydi — `ok` ni o‘zingiz tekshiring.',
            }),
          ),
          after(
            [fill('#manzil', '/api/kurslar'), click('#yukla')],
            text('loading', 'Kutish holati', '#holat', 'Yuklanmoqda...', { equals: true }),
          ),
          after([fill('#manzil', '/api/yoq'), click('#yukla'), wait(800)], clean()),
        ],
      },
      quiz: quiz('14-modul testi: Asinxron JavaScript', [
        q(
          'order',
          '`console.log(1); setTimeout(() => console.log(2), 0); console.log(3);` nima chiqaradi?',
          ['1, 3, 2', '1, 2, 3', '2, 1, 3', '3, 2, 1'],
          [0],
        ),
        q(
          'async-return',
          '`async function f() { return 5; }` — `f()` nima qaytaradi?',
          ['Natijasi 5 bo‘lgan Promise', '`5`', '`undefined`', 'Xato'],
          [0],
        ),
        q(
          'fetch-404',
          'Server 404 qaytarsa, `await fetch(url)` nima bo‘ladi?',
          [
            'Muvaffaqiyatli tugaydi, `ok` — `false`',
            'Xato tashlaydi',
            '`null` qaytaradi',
            'Sahifa qayta yuklanadi',
          ],
          [0],
        ),
        q(
          'all',
          '`Promise.all` dagi bitta Promise rad etilsa nima bo‘ladi?',
          [
            'Butun `Promise.all` rad etiladi',
            'Qolganlari natijasi qaytadi',
            'Xato e’tiborsiz qoldiriladi',
            'U Promise qayta urinib ko‘riladi',
          ],
          [0],
        ),
        q(
          'parallel',
          'Ikki mustaqil so‘rovni tezroq bajarish uchun nima qilinadi?',
          [
            '`await Promise.all([a(), b()])`',
            '`await a(); await b();`',
            '`a().then(b)`',
            '`setTimeout(a); setTimeout(b);`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
