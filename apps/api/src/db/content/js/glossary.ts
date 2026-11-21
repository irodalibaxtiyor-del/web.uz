import type { GlossaryDef } from '../helpers';

/** JavaScript course glossary. Each term points to the lesson that introduces it. */
export const JS_GLOSSARY: GlossaryDef[] = [
  // Basics
  {
    term: 'JavaScript',
    definition:
      'Brauzerda ishlaydigan dasturlash tili: sahifa mazmuni va uslubini o‘zgartiradi, foydalanuvchi harakatlariga javob beradi, server bilan ma’lumot almashadi.',
    lesson: 'intro',
  },
  {
    term: '<script>',
    definition:
      'JavaScript kodini sahifaga ulaydigan teg: ichiga kod yoziladi yoki `src` bilan tashqi fayl ulanadi.',
    example: '<script src="app.js" defer></script>',
    lesson: 'where-to',
  },
  {
    term: 'defer',
    definition:
      '`<script>` atributi: skript HTML to‘liq o‘qilgandan keyin, yozilgan tartibda bajariladi.',
    lesson: 'where-to',
  },
  {
    term: 'console.log',
    definition:
      'Qiymatni brauzer konsoliga chiqaradi (F12 → Console). Xato qidirishning asosiy vositasi.',
    example: "console.log('ball:', ball);",
    lesson: 'output',
  },
  {
    term: 'textContent',
    definition:
      'Elementning matni. Unga yozilgan teglar HTML sifatida bajarilmaydi — foydalanuvchi matni uchun xavfsiz.',
    example: "el.textContent = 'Salom';",
    lesson: 'output',
  },
  {
    term: 'innerHTML',
    definition:
      'Elementning ichki HTML kodi. Foydalanuvchi kiritgan matnni bunga yozish XSS xavfini tug‘diradi.',
    lesson: 'output',
  },
  {
    term: 'Buyruq',
    definition:
      'Kompyuter bajaradigan bitta ko‘rsatma (statement); odatda nuqtali vergul bilan tugaydi.',
    lesson: 'statements',
  },
  {
    term: 'Ifoda',
    definition: 'Qiymatga hisoblanadigan kod bo‘lagi: `2 + 3`, `ism.length`, `a > b`.',
    lesson: 'syntax',
  },
  {
    term: 'camelCase',
    definition: 'Nomlash uslubi: birinchi so‘z kichik harfda, keyingilari bosh harfda boshlanadi.',
    example: 'let talabaYoshi = 19;',
    lesson: 'syntax',
  },
  {
    term: 'Izoh',
    definition: 'Bajarilmaydigan tushuntirish matni: `//` bir qatorli, `/* … */` ko‘p qatorli.',
    lesson: 'comments',
  },

  // Variables and types
  {
    term: 'O‘zgaruvchi',
    definition: 'Qiymatni nom bilan saqlaydigan “quti”. `let` yoki `const` bilan e’lon qilinadi.',
    example: "let ism = 'Ali';",
    lesson: 'variables',
  },
  {
    term: 'let',
    definition:
      'Qiymati keyin o‘zgarishi mumkin bo‘lgan, blok doirasidagi o‘zgaruvchini e’lon qiladi.',
    lesson: 'let',
  },
  {
    term: 'const',
    definition:
      'Qayta tayinlab bo‘lmaydigan o‘zgaruvchi. Obyekt yoki massivning ichini esa o‘zgartirish mumkin.',
    example: 'const PI = 3.14;',
    lesson: 'const',
  },
  {
    term: 'var',
    definition:
      'O‘zgaruvchi e’lon qilishning eski usuli: blok doirasi yo‘q va ko‘tariladi. Zamonaviy kodda ishlatilmaydi.',
    lesson: 'let',
  },
  {
    term: 'Ma’lumot turi',
    definition:
      'Qiymatning turi: `string`, `number`, `boolean`, `undefined`, `null`, `bigint`, `symbol` va `object`.',
    lesson: 'data-types',
  },
  {
    term: 'typeof',
    definition:
      "Qiymat turini satr ko‘rinishida qaytaradigan operator. `typeof null` — `'object'`.",
    example: "typeof 42 // 'number'",
    lesson: 'data-types',
  },
  {
    term: 'undefined',
    definition: 'Qiymat hali berilmaganini bildiradi: e’lon qilingan, lekin qiymatsiz o‘zgaruvchi.',
    lesson: 'data-types',
  },
  {
    term: 'null',
    definition: 'Qiymat ataylab “yo‘q” ekanini bildiradigan maxsus qiymat.',
    lesson: 'data-types',
  },
  {
    term: 'Satr',
    definition:
      'Matnli qiymat (string): bitta, qo‘sh yoki teskari tirnoq ichida yoziladi. Satrlar o‘zgarmas.',
    example: "const s = 'Salom';",
    lesson: 'strings',
  },
  {
    term: 'Shablon satr',
    definition: 'Teskari tirnoqli satr: ichiga `${ifoda}` qo‘yish va ko‘p qatorli yozish mumkin.',
    example: 'const xabar = `Salom, ${ism}!`;',
    lesson: 'string-templates',
  },
  {
    term: 'NaN',
    definition:
      '“Son emas” (Not a Number) — noto‘g‘ri sonli amal natijasi. `NaN` o‘ziga ham teng emas; `Number.isNaN` bilan tekshiriladi.',
    example: "Number('abc') // NaN",
    lesson: 'numbers',
  },
  {
    term: 'Infinity',
    definition: 'Cheksizlikni bildiruvchi son, masalan, `1 / 0` natijasi.',
    lesson: 'numbers',
  },
  {
    term: 'toFixed()',
    definition: 'Sonni berilgan sondagi kasr xonalari bilan **satr** ko‘rinishida qaytaradi.',
    example: '(3.14159).toFixed(2) // "3.14"',
    lesson: 'number-methods',
  },
  {
    term: 'parseInt()',
    definition: 'Satr boshidagi butun sonni o‘qiydi; sondan keyingi belgilarni tashlab yuboradi.',
    example: "parseInt('42px') // 42",
    lesson: 'number-methods',
  },
  {
    term: 'Math',
    definition:
      'Matematik konstantalar va funksiyalar obyekti: `Math.round`, `Math.max`, `Math.PI` …',
    lesson: 'math',
  },
  {
    term: 'Math.random',
    definition: '0 (kiradi) va 1 (kirmaydi) orasidagi tasodifiy kasr son qaytaradi.',
    example: 'Math.floor(Math.random() * 6) + 1',
    lesson: 'random',
  },
  {
    term: 'Boolean',
    definition: 'Mantiqiy tur: faqat `true` yoki `false`.',
    lesson: 'booleans',
  },
  {
    term: 'Falsy',
    definition:
      "Shartda `false` deb qaraladigan qiymatlar: `false`, `0`, `''`, `null`, `undefined`, `NaN`. Qolgan hamma qiymat — truthy.",
    lesson: 'booleans',
  },
  {
    term: 'Turlarni aylantirish',
    definition:
      "Qiymatni boshqa turga o‘tkazish: aniq (`Number(x)`, `String(x)`) yoki jimgina (`'5' * 2`).",
    lesson: 'type-conversion',
  },

  // Operators and control flow
  {
    term: 'Operator',
    definition: 'Qiymatlar ustida amal bajaradigan belgi: `+`, `===`, `&&`, `=`.',
    lesson: 'operators',
  },
  {
    term: 'Qoldiq operatori',
    definition: '`%` — bo‘lishdan qolgan qoldiq. Juft-toqlikni tekshirishda qulay.',
    example: '17 % 5 // 2',
    lesson: 'arithmetic',
  },
  {
    term: 'Inkrement',
    definition: '`++` — o‘zgaruvchini 1 ga oshirish; `--` (dekrement) — 1 ga kamaytirish.',
    lesson: 'arithmetic',
  },
  {
    term: 'Tayinlash operatori',
    definition: '`=`, `+=`, `-=`, `*=` … — o‘zgaruvchiga qiymat berish yoki uni o‘zgartirish.',
    example: 'balans += 5000;',
    lesson: 'assignment',
  },
  {
    term: 'Qat’iy tenglik',
    definition:
      '`===` — tur va qiymatni birga solishtiradi, turlarni aylantirmaydi. Doim shuni ishlating.',
    lesson: 'comparisons',
  },
  {
    term: 'Ternar operator',
    definition: '`shart ? a : b` — shart rost bo‘lsa `a`, aks holda `b`.',
    example: "const holat = ball >= 60 ? 'o‘tdi' : 'o‘tmadi';",
    lesson: 'comparisons',
  },
  {
    term: 'Nullish operatori',
    definition:
      "`??` — chap qiymat `null` yoki `undefined` bo‘lsagina o‘ngdagini oladi (`0` va `''` saqlanadi).",
    example: 'const soni = kiritilgan ?? 1;',
    lesson: 'comparisons',
  },
  {
    term: 'Shart operatori',
    definition: '`if`, `else if`, `else` — shartga qarab turli kodni bajarish.',
    lesson: 'if-else',
  },
  {
    term: 'Erta qaytish',
    definition:
      'Noto‘g‘ri holatlarni funksiya boshida `return` bilan chiqarib tashlash — ichma-ich shartlarni kamaytiradi.',
    lesson: 'if-else',
  },
  {
    term: 'switch',
    definition:
      'Bitta qiymatni bir nechta `case` bilan qat’iy (`===`) solishtiradi; har `case` oxirida `break` kerak.',
    lesson: 'switch',
  },
  {
    term: 'Sikl',
    definition:
      'Kodni shart bajarilguncha takrorlash: `for`, `while`, `do...while`, `for...of`, `for...in`.',
    lesson: 'loop-for',
  },
  {
    term: 'Cheksiz sikl',
    definition: 'Sharti hech qachon yolg‘on bo‘lmaydigan sikl — sahifani qotiradi.',
    lesson: 'loop-while',
  },
  {
    term: 'for...in',
    definition: 'Obyekt **kalitlari** bo‘ylab aylanadigan sikl.',
    lesson: 'loop-for-in',
  },
  {
    term: 'for...of',
    definition:
      'Massiv, satr, `Map`, `Set` kabi iterable obyektlarning **qiymatlari** bo‘ylab aylanadigan sikl.',
    lesson: 'loop-for-of',
  },
  {
    term: 'break',
    definition: 'Siklni (yoki `switch` ni) darhol to‘xtatadi.',
    lesson: 'break-continue',
  },
  {
    term: 'continue',
    definition: 'Siklning joriy aylanishini o‘tkazib yuborib, keyingisiga o‘tadi.',
    lesson: 'break-continue',
  },

  // Functions
  {
    term: 'Funksiya',
    definition:
      'Nom berilgan, qayta ishlatiladigan kod bloki; parametr oladi va `return` bilan natija qaytaradi.',
    example: 'function kvadrat(n) { return n * n; }',
    lesson: 'functions',
  },
  {
    term: 'Parametr',
    definition: 'Funksiya e’lonidagi nom; chaqirilganda unga argument qiymati beriladi.',
    lesson: 'functions',
  },
  {
    term: 'Argument',
    definition: 'Funksiya chaqirilganda unga uzatiladigan haqiqiy qiymat.',
    lesson: 'functions',
  },
  {
    term: 'return',
    definition: 'Funksiyani to‘xtatib, natijani qaytaradi. Yozilmasa natija `undefined`.',
    lesson: 'functions',
  },
  {
    term: 'Arrow funksiya',
    definition: 'Qisqa yozuvli funksiya `(x) => x * 2`; o‘z `this` i yo‘q.',
    example: 'const ikki = (x) => x * 2;',
    lesson: 'arrow-functions',
  },
  {
    term: 'Callback',
    definition: 'Boshqa funksiyaga argument sifatida berilib, keyinroq chaqiriladigan funksiya.',
    example: "btn.addEventListener('click', () => { … });",
    lesson: 'callbacks',
  },
  {
    term: 'Ko‘rinish doirasi',
    definition: 'O‘zgaruvchi ko‘rinadigan kod qismi (scope): global, funksiya va blok doirasi.',
    lesson: 'scope',
  },
  {
    term: 'Hoisting',
    definition:
      'E’lonlarning doira boshiga “ko‘tarilishi”: funksiya e’loni to‘liq, `var` faqat e’lon sifatida; `let`/`const` esa e’londan oldin ishlatilmaydi.',
    lesson: 'hoisting',
  },
  {
    term: 'Qat’iy rejim',
    definition:
      "`'use strict'` — jim xatolarni ochiq xatoga aylantiradigan rejim. Modul va klasslarda avtomatik.",
    lesson: 'strict-mode',
  },
  {
    term: 'this',
    definition: 'Funksiya qaysi obyekt nomidan chaqirilganini bildiradi; `obj.metod()` da — `obj`.',
    lesson: 'this',
  },
  {
    term: 'Yopilma',
    definition:
      'Funksiya o‘zi yaratilgan doiradagi o‘zgaruvchilarni tashqi funksiya tugagandan keyin ham eslab qolishi (closure).',
    example: 'function hisob() { let n = 0; return () => ++n; }',
    lesson: 'closures',
  },
  {
    term: 'bind()',
    definition:
      '`this` va argumentlari bog‘langan yangi funksiya qaytaradi; `call` va `apply` esa darhol chaqiradi.',
    lesson: 'call-apply-bind',
  },

  // Objects and classes
  {
    term: 'Obyekt',
    definition: 'Kalit–qiymat juftliklari to‘plami.',
    example: "const talaba = { ism: 'Ali', yosh: 19 };",
    lesson: 'objects',
  },
  {
    term: 'Xususiyat',
    definition:
      "Obyektdagi kalit va uning qiymati; `obj.kalit` yoki `obj['kalit']` bilan o‘qiladi.",
    lesson: 'object-properties',
  },
  {
    term: 'Optional chaining',
    definition:
      '`?.` — oraliq qiymat `null`/`undefined` bo‘lsa xato bermasdan `undefined` qaytaradi.',
    example: 'user.manzil?.shahar',
    lesson: 'object-properties',
  },
  {
    term: 'Metod',
    definition: 'Obyekt xususiyati bo‘lgan funksiya.',
    example: 'hisob.qosh(5000)',
    lesson: 'object-methods',
  },
  {
    term: 'Getter',
    definition:
      '`get` bilan e’lon qilinadigan, xususiyat kabi o‘qiladigan funksiya; `set` — yozishni tekshiradi.',
    lesson: 'object-accessors',
  },
  {
    term: 'Konstruktor',
    definition:
      '`new` bilan chaqirilib, yangi obyekt yaratadigan funksiya yoki klassning `constructor` metodi.',
    lesson: 'object-constructors',
  },
  {
    term: 'Prototip',
    definition:
      'Obyekt meros oladigan boshqa obyekt; umumiy metodlar shu yerda bir marta saqlanadi.',
    lesson: 'object-prototypes',
  },
  {
    term: 'Object.freeze',
    definition:
      'Obyektni muzlatadi: xususiyat qo‘shish, o‘chirish va o‘zgartirish taqiqlanadi (sayoz).',
    lesson: 'object-protection',
  },
  {
    term: 'Klass',
    definition: 'Bir xil tuzilishdagi obyektlar (nusxalar) yaratish uchun shablon.',
    example: 'class Talaba { constructor(ism) { this.ism = ism; } }',
    lesson: 'classes',
  },
  {
    term: 'Nusxa',
    definition: 'Klass yoki konstruktordan `new` bilan yaratilgan obyekt (instance).',
    lesson: 'classes',
  },
  {
    term: 'Meros',
    definition:
      '`extends` — klass boshqa klassning xususiyat va metodlarini oladi; `super` ota klassni chaqiradi.',
    lesson: 'class-inheritance',
  },
  {
    term: 'instanceof',
    definition: 'Obyekt ma’lum klass (yoki uning vorisi) nusxasi ekanini tekshiradi.',
    lesson: 'class-inheritance',
  },
  {
    term: 'static',
    definition: 'Klassning o‘ziga tegishli a’zo; `Klass.metod()` ko‘rinishida chaqiriladi.',
    lesson: 'class-static',
  },
  {
    term: 'Yopiq maydon',
    definition: '`#` bilan boshlanadigan klass maydoni — faqat klass ichidan ko‘rinadi.',
    example: 'class Hisob { #balans = 0; }',
    lesson: 'class-static',
  },
  {
    term: 'Destrukturlash',
    definition:
      'Obyekt yoki massivdan qiymatlarni bir yo‘la alohida o‘zgaruvchilarga ajratib olish.',
    example: 'const { ism, yosh } = talaba;',
    lesson: 'destructuring',
  },
  {
    term: 'JSON',
    definition:
      'Ma’lumot almashish uchun matn formati. `JSON.stringify` — obyektdan matnga, `JSON.parse` — matndan obyektga.',
    lesson: 'json',
  },

  // Collections
  {
    term: 'Massiv',
    definition: 'Tartiblangan qiymatlar ro‘yxati; indeks 0 dan boshlanadi.',
    example: "const mevalar = ['olma', 'nok'];",
    lesson: 'arrays',
  },
  {
    term: 'Indeks',
    definition: 'Massiv yoki satrdagi elementning o‘rni; birinchisi 0, oxirgisi `length - 1`.',
    lesson: 'arrays',
  },
  {
    term: 'push()',
    definition: 'Massiv oxiriga element qo‘shadi (asl massiv o‘zgaradi).',
    lesson: 'array-methods',
  },
  {
    term: 'splice()',
    definition:
      'Massivning o‘rtasidan elementlarni o‘chiradi yoki qo‘shadi (asl massiv o‘zgaradi).',
    lesson: 'array-methods',
  },
  {
    term: 'slice()',
    definition: 'Massiv yoki satrning bo‘lagini nusxa sifatida qaytaradi; asl qiymat o‘zgarmaydi.',
    example: 'arr.slice(1, 3)',
    lesson: 'array-methods',
  },
  {
    term: 'map()',
    definition: 'Har elementni o‘zgartirib, shu uzunlikdagi yangi massiv qaytaradi.',
    example: 'narxlar.map((n) => n * 2)',
    lesson: 'array-iteration',
  },
  {
    term: 'filter()',
    definition: 'Shartni qanoatlantiradigan elementlardan yangi massiv qaytaradi.',
    lesson: 'array-iteration',
  },
  {
    term: 'reduce()',
    definition: 'Massivni bitta qiymatga (yig‘indi, obyekt …) yig‘adi.',
    example: 'sonlar.reduce((s, x) => s + x, 0)',
    lesson: 'array-iteration',
  },
  {
    term: 'find()',
    definition: 'Shartni qanoatlantiradigan birinchi elementni qaytaradi; topilmasa `undefined`.',
    lesson: 'array-search',
  },
  {
    term: 'sort()',
    definition:
      'Massivni joyida saralaydi; standart holda satr sifatida — sonlar uchun `(a, b) => a - b` kerak.',
    lesson: 'array-sort',
  },
  {
    term: 'Iterable',
    definition:
      '`for...of` bilan aylanib bo‘ladigan obyekt: massiv, satr, `Map`, `Set`, `NodeList`.',
    lesson: 'iterables',
  },
  {
    term: 'Generator',
    definition: '`function*` — `yield` bilan qiymatlarni birma-bir beradigan funksiya.',
    lesson: 'iterables',
  },
  {
    term: 'Set',
    definition: 'Faqat noyob qiymatlar to‘plami; dublikatlarni olib tashlash uchun qulay.',
    example: '[...new Set(arr)]',
    lesson: 'sets',
  },
  {
    term: 'Map',
    definition:
      'Kaliti har qanday turda bo‘la oladigan kalit–qiymat to‘plami; `size` xususiyati bor.',
    lesson: 'maps',
  },
  {
    term: 'Date',
    definition:
      'Sana va vaqt obyekti. Ichida 1970-yildan beri o‘tgan millisoniyalar saqlanadi; oylar 0 dan sanaladi.',
    example: 'new Date(2026, 0, 15) // 15-yanvar',
    lesson: 'dates',
  },
  {
    term: 'ISO sana formati',
    definition: '`YYYY-MM-DD` ko‘rinishidagi sana — saqlash va almashish uchun standart.',
    lesson: 'date-formats',
  },
  {
    term: 'Muntazam ifoda',
    definition:
      'Matndagi naqshni tavsiflovchi ifoda (RegExp): qidirish, tekshirish va almashtirish uchun.',
    example: '/^\\d{9}$/.test(raqam)',
    lesson: 'regexp',
  },

  // Errors and async
  {
    term: 'try...catch',
    definition:
      'Xato chiqishi mumkin bo‘lgan kodni ushlab, dasturni to‘xtatmasdan boshqarish; `finally` har doim bajariladi.',
    lesson: 'errors',
  },
  {
    term: 'throw',
    definition: 'O‘z xatoingizni tashlaydi; u eng yaqin `catch` da ushlanadi.',
    example: "throw new Error('Noto‘g‘ri qiymat');",
    lesson: 'errors',
  },
  {
    term: 'debugger',
    definition:
      'DevTools ochiq bo‘lsa, kod shu qatorda to‘xtaydi va o‘zgaruvchilarni ko‘rish mumkin.',
    lesson: 'debugging',
  },
  {
    term: 'Linter',
    definition:
      'Kodni yozish paytida xato va uslub muammolarini topadigan vosita (masalan, ESLint).',
    lesson: 'style-guide',
  },
  {
    term: 'setTimeout()',
    definition:
      'Funksiyani berilgan millisoniyadan keyin bir marta chaqiradi; `clearTimeout` bekor qiladi.',
    lesson: 'timing',
  },
  {
    term: 'setInterval()',
    definition: 'Funksiyani muntazam oraliqda takror chaqiradi; `clearInterval` to‘xtatadi.',
    lesson: 'timing',
  },
  {
    term: 'Asinxron kod',
    definition:
      'Natijasi keyinroq keladigan amal (taymer, tarmoq so‘rovi); kutish paytida boshqa kod ishlayveradi.',
    lesson: 'callbacks',
  },
  {
    term: 'Promise',
    definition: 'Kelajakdagi natija: bajarildi (`then`) yoki rad etildi (`catch`).',
    lesson: 'promises',
  },
  {
    term: 'async/await',
    definition:
      '`async` funksiya ichida `await` Promise natijasini kutadi — asinxron kod sinxron kabi o‘qiladi.',
    example: 'const res = await fetch(url);',
    lesson: 'async-await',
  },
  {
    term: 'fetch',
    definition:
      'Serverga HTTP so‘rov yuboradi va Promise qaytaradi; `response.ok` ni tekshirish shart.',
    lesson: 'fetch',
  },
  {
    term: 'Modul',
    definition:
      '`export` va `import` bilan bog‘lanadigan alohida JavaScript fayl; `<script type="module">` bilan ulanadi.',
    lesson: 'modules',
  },

  // DOM and browser
  {
    term: 'DOM',
    definition:
      'Document Object Model — brauzer HTML’dan quradigan elementlar daraxti; JavaScript sahifani shu orqali o‘zgartiradi.',
    lesson: 'dom-intro',
  },
  {
    term: 'document',
    definition:
      'DOM daraxtining kirish nuqtasi: elementlarni topish va yaratish shu obyekt orqali.',
    lesson: 'dom-intro',
  },
  {
    term: 'querySelector()',
    definition: 'CSS selektori bo‘yicha birinchi mos elementni qaytaradi (topilmasa `null`).',
    example: "document.querySelector('.karta')",
    lesson: 'dom-methods',
  },
  {
    term: 'querySelectorAll()',
    definition:
      'CSS selektori bo‘yicha barcha mos elementlarni statik `NodeList` sifatida qaytaradi.',
    lesson: 'dom-elements',
  },
  {
    term: 'XSS',
    definition:
      'Saytga begona skript kiritish hujumi. Foydalanuvchi matnini `innerHTML` ga emas, `textContent` ga yozing.',
    lesson: 'dom-methods',
  },
  {
    term: 'closest()',
    definition:
      'Elementning o‘zidan boshlab yuqoriga qarab selektorga mos birinchi ajdodni topadi.',
    lesson: 'dom-elements',
  },
  {
    term: 'dataset',
    definition: '`data-*` atributlarining qiymatlari; `data-narx` → `el.dataset.narx`.',
    lesson: 'dom-html',
  },
  {
    term: 'classList',
    definition: 'Element klasslarini boshqarish: `add`, `remove`, `toggle`, `contains`.',
    example: "el.classList.toggle('faol');",
    lesson: 'dom-css',
  },
  {
    term: 'createElement()',
    definition: 'Yangi element yaratadi; u `append` bilan sahifaga qo‘shilgunga qadar ko‘rinmaydi.',
    lesson: 'dom-nodes',
  },
  {
    term: 'NodeList',
    definition:
      '`querySelectorAll` qaytaradigan elementlar to‘plami; `forEach` bor, `map` uchun `[...list]`.',
    lesson: 'dom-collections',
  },
  {
    term: 'Hodisa',
    definition: 'Sahifada sodir bo‘ladigan voqea: bosish, yozish, yuborish, yuklanish.',
    lesson: 'events',
  },
  {
    term: 'addEventListener()',
    definition:
      'Elementga hodisa ishlovchisini qo‘shadi; bir hodisaga bir nechta ishlovchi berish mumkin.',
    example: "btn.addEventListener('click', saqla);",
    lesson: 'dom-event-listener',
  },
  {
    term: 'Hodisalar delegatsiyasi',
    definition:
      'Bitta ishlovchini ota elementga qo‘yib, bosilgan bolani `event.target` orqali aniqlash.',
    lesson: 'dom-event-listener',
  },
  {
    term: 'Hodisa tarqalishi',
    definition: 'Hodisa bosilgan elementdan ota elementlarga qarab ko‘tarilishi (bubbling).',
    lesson: 'dom-events',
  },
  {
    term: 'preventDefault()',
    definition: 'Brauzerning standart harakatini bekor qiladi: forma yuborilishi, havolaga o‘tish.',
    lesson: 'dom-events',
  },
  {
    term: 'event.target',
    definition:
      'Hodisa aynan sodir bo‘lgan element; `currentTarget` — ishlovchi qo‘yilgan element.',
    lesson: 'dom-events',
  },
  {
    term: 'FormData',
    definition: 'Forma maydonlari qiymatlarini nom bo‘yicha o‘qish uchun obyekt.',
    example: "new FormData(form).get('email')",
    lesson: 'dom-forms',
  },
  {
    term: 'requestAnimationFrame()',
    definition:
      'Funksiyani keyingi ekran yangilanishidan oldin chaqiradi — silliq animatsiya uchun.',
    lesson: 'dom-animations',
  },
  {
    term: 'window',
    definition:
      'Brauzer oynasi obyekti (BOM): o‘lcham, skroll, taymerlar va global o‘zgaruvchilar.',
    lesson: 'bom-window',
  },
  {
    term: 'URLSearchParams',
    definition: 'Manzildagi `?kalit=qiymat` parametrlarini o‘qish va o‘zgartirish uchun obyekt.',
    lesson: 'bom-location',
  },
  {
    term: 'Cookie',
    definition:
      'Brauzer saqlaydigan va har so‘rovda serverga yuboriladigan kichik matn; maxfiy token uchun `HttpOnly`.',
    lesson: 'cookies',
  },
  {
    term: 'localStorage',
    definition: 'Brauzerda doimiy saqlanadigan kalit–qiymat ombori; faqat satr saqlaydi.',
    example: "localStorage.setItem('tema', 'dark');",
    lesson: 'web-storage',
  },
  {
    term: 'Web API',
    definition:
      'Brauzer beradigan tayyor imkoniyatlar: `Intl`, Geolocation, Clipboard va boshqalar.',
    lesson: 'web-apis',
  },
  {
    term: 'Holat',
    definition:
      'Ekranni chizish uchun kerak bo‘lgan o‘zgaruvchan ma’lumot (state); UI holatdan qayta chiziladi.',
    lesson: 'project-todo',
  },
];
