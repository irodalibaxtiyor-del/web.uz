import {
  codeFill,
  fill,
  lessonQuiz,
  match,
  order,
  q,
  sortInto,
  tf,
  why,
  type QuizDef,
} from '../helpers';

/**
 * Per-lesson tests of the JavaScript course (lessons that close a module keep their module quiz).
 * Original Uzbek questions; "what does it print" answers were checked against the language rules.
 */
export const JS_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. JavaScript bilan tanishuv ----------------------------------------------
  intro: lessonQuiz([
    why(
      match('q1', 'Qaysi til nima uchun javob beradi?', [
        ['HTML', 'Tuzilma va mazmun'],
        ['CSS', 'Ko‘rinish'],
        ['JavaScript', 'Xatti-harakat (bosilganda nima bo‘lishi)'],
      ]),
      'JavaScript sahifadagi matn, uslub va atributlarni o‘zgartira oladi.',
    ),
    why(
      tf('q2', 'JavaScript va Java — bitta tilning ikki nomi.', false),
      'Nomlari o‘xshash, lekin ular butunlay boshqa tillar.',
    ),
    why(
      q(
        'q3',
        'JavaScript sahifada nimalarni o‘zgartira oladi? (bir nechta javob)',
        [
          'Element matnini',
          'Element uslubini',
          'Atribut qiymatini',
          'Foydalanuvchi kompyuteridagi fayllarni erkin o‘chirishni',
        ],
        [0, 1, 2],
      ),
      'Brauzerdagi JavaScript xavfsiz muhitda ishlaydi va kompyuter fayllariga erkin kira olmaydi.',
    ),
    why(
      tf('q4', 'JavaScript brauzerning o‘zida, sahifa ochilgan qurilmada ishlaydi.', true),
      'Uni ishlatish uchun alohida dastur o‘rnatish shart emas.',
    ),
  ]),
  'where-to': lessonQuiz([
    why(
      codeFill('q1', 'Tashqi skriptni ulang.', '<script {{1}}="js/app.js"></script>', ['src']),
      'Katta loyihalarda kod alohida `.js` faylda saqlanadi.',
    ),
    why(
      q(
        'q2',
        "`<head>` dagi skript `getElementById('holat')` ni chaqirdi, `#holat` esa `<body>` da. Natija?",
        [
          'null — element hali yaratilmagan',
          'Element topiladi',
          'Sahifa qayta yuklanadi',
          'Skript kutib turadi',
        ],
        [0],
      ),
      'Brauzer HTML’ni yuqoridan pastga o‘qiydi va skriptni darhol bajaradi.',
    ),
    why(
      sortInto('q3', 'Bu muammoning yechimlarini ajrating.', {
        Yechim: ['<script> ni <body> oxiriga qo‘yish', '<head> da defer atributi bilan ulash'],
        'Yechim emas': ['Skriptni ikki marta yozish', 'Elementga class berish'],
      }),
      '`defer` skriptni sahifa to‘liq o‘qilgandan keyin bajaradi.',
    ),
    why(
      tf(
        'q4',
        'Bir sahifada bir nechta `<script>` bo‘lsa, ular sahifadagi tartib bo‘yicha bajariladi.',
        true,
      ),
      'Keyingi skript oldingisida e’lon qilingan narsalardan foydalana oladi.',
    ),
  ]),
  output: lessonQuiz([
    why(
      match('q1', 'Usulni natija chiqadigan joy bilan moslang.', [
        ['element.textContent', 'Elementning matni'],
        ['element.innerHTML', 'Elementning HTML mazmuni'],
        ['console.log()', 'Dasturchi konsoli'],
        ['alert()', 'Ogohlantirish oynasi'],
      ]),
      'Foydalanuvchi uchun natija odatda sahifadagi elementga yoziladi.',
    ),
    why(
      tf(
        'q2',
        'Sahifa yuklangandan keyin `document.write()` chaqirilsa, butun sahifa o‘chib ketadi.',
        true,
      ),
      'Shuning uchun zamonaviy kodda `textContent` yoki `innerHTML` ishlatiladi.',
    ),
    why(
      q(
        'q3',
        'Foydalanuvchi kiritgan matnni sahifaga xavfsiz chiqarish uchun qaysi biri?',
        ['textContent', 'innerHTML', 'document.write', 'eval'],
        [0],
      ),
      '`textContent` matnni HTML sifatida talqin qilmaydi.',
    ),
    why(
      fill('q4', 'Natijani yozing.', 'console.log(2 + 3 * 4) konsolga {{1}} chiqaradi.', ['14']),
      'Avval ko‘paytirish: 3 × 4 = 12, keyin 2 + 12.',
    ),
  ]),
  statements: lessonQuiz([
    why(
      tf('q1', 'JavaScript’da buyruqlar odatda nuqta-vergul (;) bilan tugatiladi.', true),
      'Ko‘p hollarda u avtomatik qo‘yiladi, lekin har doim yozish xatolardan saqlaydi.',
    ),
    why(
      q('q2', 'Kod bloki qaysi belgilar ichida yoziladi?', ['{ }', '( )', '[ ]', '< >'], [0]),
      'Bloklar `if`, `for` va funksiyalarda birga bajariladigan buyruqlarni guruhlaydi.',
    ),
    why(
      tf('q3', 'Kod ichidagi qo‘shimcha bo‘sh joylar natijani o‘zgartiradi.', false),
      'Bo‘sh joy va qatorlar faqat o‘qishni osonlashtiradi.',
    ),
    why(
      sortInto('q4', 'So‘zlarni ajrating.', {
        'Kalit so‘z': ['let', 'const', 'if', 'function', 'return'],
        'Oddiy nom': ['narx', 'ism'],
      }),
      'Kalit so‘zlarni o‘zgaruvchi nomi sifatida ishlatib bo‘lmaydi.',
    ),
  ]),
  syntax: lessonQuiz([
    why(
      tf('q1', '`narx` va `Narx` — bitta o‘zgaruvchi.', false),
      'JavaScript katta-kichik harfni farqlaydi.',
    ),
    why(
      q(
        'q2',
        'Qaysi nom camelCase uslubida yozilgan?',
        ['umumiyNarx', 'umumiy_narx', 'UmumiyNarx', 'umumiy-narx'],
        [0],
      ),
      'Birinchi so‘z kichik, keyingilari bosh harf bilan.',
    ),
    why(
      sortInto('q3', 'Qaysi nomlar to‘g‘ri?', {
        "To'g'ri": ['ism', '_hisob', '$tugma', 'narx2'],
        "Noto'g'ri": ['2narx', 'mening-ismim', 'let'],
      }),
      'Nom raqam bilan boshlanmaydi, chiziqcha va kalit so‘z bo‘lolmaydi; `$` va `_` ruxsat.',
    ),
    why(
      q(
        'q4',
        'Sintaksis xatosini qayerda ko‘rasiz?',
        [
          'Konsolda (xabar va qator raqami bilan)',
          'Sahifa sarlavhasida',
          'Brauzer tarixida',
          'Hech qayerda',
        ],
        [0],
      ),
      'Konsol xato turini va qaysi qatorda ekanini ko‘rsatadi.',
    ),
  ]),

  // ---- 2. O‘zgaruvchilar va operatorlar ----------------------------------------
  variables: lessonQuiz([
    why(
      sortInto('q1', 'E’lon qilish usullarini ajrating.', {
        'Zamonaviy kodda': ['let', 'const'],
        'Eski, tavsiya etilmaydi': ['var'],
      }),
      'O‘zgarmaydigan qiymat uchun `const`, o‘zgaradigan uchun `let`.',
    ),
    why(
      fill(
        'q2',
        'Natijani yozing.',
        "let ism = 'Ali';\nlet salom = 'Salom, ' + ism;  // salom = {{1}}",
        [['Salom, Ali', "'Salom, Ali'"]],
      ),
      '`+` satrlarni ulaydi.',
    ),
    why(
      q('q3', 'Qaysi nom eng yaxshi?', ['narxSomda', 'x', 'a1', 'qiymat'], [0]),
      'Nom nima saqlanishini aytsin.',
    ),
    why(
      tf('q4', '`$` va `_` belgilari o‘zgaruvchi nomida ishlatilishi mumkin.', true),
      'Masalan, `$tugma`, `_ichkiHisob`.',
    ),
  ]),
  let: lessonQuiz([
    why(
      tf('q1', 'Bir doirada `let` bilan bir xil nomni ikki marta e’lon qilish mumkin.', false),
      'Ikkinchi e’lon `SyntaxError` beradi; qiymatni almashtirish uchun shunchaki `x = …`.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nif (true) {\n  let x = 5;\n}\nconsole.log(x);\n```',
        ['ReferenceError — x blokdan tashqarida yo‘q', '5', 'undefined', 'null'],
        [0],
      ),
      '`let` blok doirasiga ega: `{ }` dan tashqarida ko‘rinmaydi.',
    ),
    why(
      q(
        'q3',
        'Natija?\n\n```js\nconsole.log(a);\nlet a = 1;\n```',
        ['ReferenceError', 'undefined', '1', 'null'],
        [0],
      ),
      '`let` o‘zgaruvchini e’londan oldin ishlatib bo‘lmaydi.',
    ),
    why(
      codeFill('q4', 'Hisoblagichni bittaga oshiring.', 'let son = 0;\nson{{1}};', ['++']),
      '`son++` — `son = son + 1` ning qisqasi.',
    ),
  ]),
  const: lessonQuiz([
    why(
      q(
        'q1',
        'Natija?\n\n```js\nconst pi = 3.14;\npi = 3;\n```',
        [
          'TypeError — const ga qayta qiymat berib bo‘lmaydi',
          'pi = 3 bo‘ladi',
          'pi = 3.14 qoladi, xatosiz',
          'SyntaxError',
        ],
        [0],
      ),
      '`const` bog‘lanishni o‘zgartirib bo‘lmaydi.',
    ),
    why(
      tf(
        'q2',
        '`const` bilan e’lon qilingan massivga yangi element qo‘shish (`push`) mumkin.',
        true,
      ),
      'O‘zgarmas — bog‘lanish, qiymatning ichki tarkibi emas.',
    ),
    why(
      tf('q3', '`const` e’lon qilinganda qiymat berish shart.', true),
      '`const x;` — SyntaxError.',
    ),
    why(
      q(
        'q4',
        'O‘zgaruvchini qachon `const` bilan e’lon qilish kerak?',
        [
          'Qiymat qayta tayinlanmasa (ko‘p hollarda)',
          'Faqat sonlar uchun',
          'Hech qachon',
          'Faqat global o‘zgaruvchilar uchun',
        ],
        [0],
      ),
      'Standart tanlov — `const`, qayta tayinlash kerak bo‘lsagina `let`.',
    ),
  ]),
  operators: lessonQuiz([
    why(
      match('q1', 'Ifodani natijasi bilan moslang.', [
        ["'5' + 3", "'53'"],
        ["'5' - 3", '2'],
        ['5 + 3', '8'],
        ["'5' * '2'", '10'],
      ]),
      '`+` satr bo‘lsa ulaydi; `-`, `*`, `/` esa matnni songa aylantiradi.',
    ),
    why(
      q(
        'q2',
        "`5 == '5'` va `5 === '5'` natijalari?",
        ['true va false', 'true va true', 'false va false', 'false va true'],
        [0],
      ),
      '`==` turni aylantirib solishtiradi, `===` tur va qiymatni qat’iy tekshiradi. Doim `===` ishlating.',
    ),
    why(
      tf('q3', '`<input>` dan olingan `value` doim matn (string) bo‘ladi.', true),
      'Hisoblashdan oldin `Number(...)` bilan songa aylantiring.',
    ),
    why(
      fill('q4', 'Natijani yozing.', '10 > 3 natijasi — {{1}}', ['true']),
      'Taqqoslash natijasi doim `true` yoki `false`.',
    ),
  ]),
  arithmetic: lessonQuiz([
    why(
      match('q1', 'Ifodani natijasi bilan moslang.', [
        ['10 % 3', '1'],
        ['2 ** 3', '8'],
        ['7 / 2', '3.5'],
        ['2 + 3 * 4', '14'],
      ]),
      '`%` — qoldiq, `**` — daraja; ko‘paytirish qo‘shishdan oldin bajariladi.',
    ),
    why(
      q(
        'q2',
        'Son juft ekanini qanday tekshirasiz?',
        ['son % 2 === 0', 'son / 2 === 0', 'son ** 2 === 0', 'son - 2 === 0'],
        [0],
      ),
      'Juft sonning 2 ga bo‘lgandagi qoldig‘i 0.',
    ),
    why(
      fill('q3', 'Natijani yozing.', '(2 + 3) * 4 = {{1}}', ['20']),
      'Qavs ichidagi amal birinchi bajariladi.',
    ),
    why(
      q(
        'q4',
        'Natija?\n\n```js\nlet a = 5;\na--;\nconsole.log(a);\n```',
        ['4', '5', '6', 'undefined'],
        [0],
      ),
      '`--` qiymatni bittaga kamaytiradi.',
    ),
  ]),
  assignment: lessonQuiz([
    why(
      match('q1', 'Yozuvni ma’nosi bilan moslang.', [
        ['x += 5', 'x = x + 5'],
        ['x -= 2', 'x = x - 2'],
        ['x *= 3', 'x = x * 3'],
        ['x /= 4', 'x = x / 4'],
      ]),
      'Qisqa tayinlash operatorlari kodni ixchamlashtiradi.',
    ),
    why(
      q(
        'q2',
        "Natija?\n\n```js\nlet matn = 'Salom';\nmatn += ', dunyo';\n```",
        ["'Salom, dunyo'", "', dunyoSalom'", 'NaN', 'Xato'],
        [0],
      ),
      '`+=` satrlar bilan ham ishlaydi — oxiriga ulaydi.',
    ),
    why(
      q(
        'q3',
        "`let jami = 10; jami += input.value;` (input.value = '5'). Natija?",
        ["'105'", '15', 'NaN', '10'],
        [0],
      ),
      'Input qiymati matn — avval `Number(input.value)` qiling.',
    ),
    why(
      tf('q4', '`const` bilan e’lon qilingan o‘zgaruvchiga `+=` ishlatish mumkin.', false),
      '`+=` qayta tayinlash — `const` da TypeError.',
    ),
  ]),

  // ---- 3. Funksiyalar, obyektlar va hodisalar ---------------------------------
  functions: lessonQuiz([
    why(
      match('q1', 'Atamani misol bilan moslang.', [
        ['Parametr', 'function yuza(a, b) dagi a va b'],
        ['Argument', 'yuza(3, 4) dagi 3 va 4'],
        ['return', 'Funksiya natijasini qaytaradi'],
      ]),
      'Parametr — e’londagi nom, argument — chaqiruvdagi qiymat.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nfunction ikkiBaravar(x) {\n  return x * 2;\n}\nconsole.log(ikkiBaravar(6));\n```',
        ['12', '6', 'undefined', 'x * 2'],
        [0],
      ),
      '`return` qiymatni chaqirilgan joyga qaytaradi.',
    ),
    why(
      q(
        'q3',
        '`return` yozilmagan funksiya nima qaytaradi?',
        ['undefined', 'null', '0', 'Bo‘sh satr'],
        [0],
      ),
      'Natija kerak bo‘lsa `return` majburiy.',
    ),
    why(
      tf(
        'q4',
        'Funksiya ichida `let` bilan e’lon qilingan o‘zgaruvchi funksiyadan tashqarida ko‘rinmaydi.',
        true,
      ),
      'Bu mahalliy o‘zgaruvchi.',
    ),
  ]),
  objects: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Obyekt xususiyatini o‘qing.',
        "const talaba = { ism: 'Aziza', ball: 92 };\nconsole.log(talaba{{1}}ism);",
        ['.'],
      ),
      'Nuqta yozuvi: `obyekt.xususiyat`.',
    ),
    why(
      q(
        'q2',
        'Obyekt qanday yoziladi?',
        [
          "{ ism: 'Ali', yosh: 20 }",
          "[ism: 'Ali', yosh: 20]",
          "(ism = 'Ali', yosh = 20)",
          '<ism>Ali</ism>',
        ],
        [0],
      ),
      'Kalit: qiymat juftliklari jingalak qavslar ichida, vergul bilan.',
    ),
    why(
      tf('q3', 'Mavjud obyektga keyinroq yangi xususiyat qo‘shish mumkin.', true),
      "Masalan, `talaba.guruh = 'W-21';`.",
    ),
    why(
      q(
        'q4',
        '`console.log(talaba)` o‘rniga sahifaga obyektni matn sifatida chiqarish uchun nima qulay?',
        [
          'JSON.stringify(talaba)',
          'String(talaba) — har doim yetarli',
          'talaba.toString()',
          "talaba + ''",
        ],
        [0],
      ),
      'Oddiy aylantirish `[object Object]` beradi.',
    ),
  ]),
  'object-properties': lessonQuiz([
    why(
      q(
        'q1',
        "Kalit o‘zgaruvchida saqlangan bo‘lsa (`const k = 'ism'`), xususiyatni qanday o‘qiysiz?",
        ['obyekt[k]', 'obyekt.k', 'obyekt(k)', 'obyekt->k'],
        [0],
      ),
      '`obyekt.k` aynan “k” nomli xususiyatni qidiradi.',
    ),
    why(
      q(
        'q2',
        'Yo‘q xususiyatni o‘qisangiz nima qaytadi?',
        ['undefined', 'null', 'Xato', "''"],
        [0],
      ),
      'Xato chiqmaydi — `undefined` keladi.',
    ),
    why(
      codeFill('q3', 'Xususiyatni o‘chiring.', '{{1}} talaba.guruh;', ['delete']),
      '`delete` xususiyatni butunlay olib tashlaydi.',
    ),
    why(
      q('q4', "`'anor' in { olma: 1 }` natijasi?", ['false', 'true', 'undefined', '1'], [0]),
      '`in` kalit borligini tekshiradi.',
    ),
  ]),
  'object-methods': lessonQuiz([
    why(
      q(
        'q1',
        "Natija?\n\n```js\nconst odam = {\n  ism: 'Dilnoza',\n  salom() {\n    return 'Salom, ' + this.ism;\n  },\n};\nconsole.log(odam.salom());\n```",
        ["'Salom, Dilnoza'", "'Salom, undefined'", "'Salom, this.ism'", 'Xato'],
        [0],
      ),
      'Metod ichida `this` — metod chaqirilgan obyekt.',
    ),
    why(
      tf('q2', '`odam.salom` (qavssiz) metodni chaqiradi.', false),
      'Qavssiz — funksiyaning o‘ziga havola; chaqirish uchun `odam.salom()`.',
    ),
    why(
      fill('q3', 'Atamani yozing.', 'Obyekt ichidagi funksiya {{1}} deyiladi.', [
        ['metod', 'method'],
      ]),
      'Masalan, `toUpperCase` — satrning tayyor metodi.',
    ),
    why(
      q(
        'q4',
        'Obyekt kalitlari ro‘yxatini qaysi metod beradi?',
        ['Object.keys(obyekt)', 'obyekt.length', 'obyekt.keys', 'Array(obyekt)'],
        [0],
      ),
      '`Object.values` — qiymatlar, `Object.entries` — juftliklar.',
    ),
  ]),

  // ---- 4. Satrlar --------------------------------------------------------------
  strings: lessonQuiz([
    why(
      fill('q1', 'Natijani yozing.', "'Toshkent'.length = {{1}}", ['8']),
      '`length` belgilar soni.',
    ),
    why(
      q('q2', "`'non'[0]` natijasi?", ["'n'", "'o'", "'non'", 'undefined'], [0]),
      'Indekslar 0 dan boshlanadi.',
    ),
    why(
      q(
        'q3',
        "Natija?\n\n```js\nlet soz = 'non';\nsoz[0] = 'm';\nconsole.log(soz);\n```",
        ["'non'", "'mon'", 'Xato', 'undefined'],
        [0],
      ),
      'Satrlar o‘zgarmas: bitta belgisini almashtirib bo‘lmaydi; yangi satr yaratiladi.',
    ),
    why(
      q(
        'q4',
        'Qaysi yozuv xatosiz satr hosil qiladi?',
        [`'U "Salom" dedi'`, `'U 'Salom' dedi'`, `"U "Salom" dedi"`, `'U "Salom" dedi"`],
        [0],
      ),
      "Satr ichida boshqa turdagi tirnoq ishlating yoki ekranlang: `'U \\'Salom\\' dedi'`.",
    ),
  ]),
  'string-methods': lessonQuiz([
    why(
      match('q1', 'Metodni natijasi bilan moslang.', [
        ["'salom'.toUpperCase()", "'SALOM'"],
        ["'  ism  '.trim()", "'ism'"],
        ["'Toshkent'.slice(0, 4)", "'Tosh'"],
        ["'a-b-c'.split('-')", "['a', 'b', 'c']"],
      ]),
      '`slice(boshi, oxiri)` — oxiri kirmaydi.',
    ),
    why(
      q(
        'q2',
        "`'olma olma'.replace('olma', 'nok')` natijasi?",
        ["'nok olma'", "'nok nok'", "'olma nok'", "'olma olma'"],
        [0],
      ),
      '`replace` faqat birinchisini almashtiradi; hammasi uchun `replaceAll`.',
    ),
    why(
      fill('q3', 'Natijani yozing.', "'5'.padStart(3, '0') = {{1}}", [['005', "'005'"]]),
      'Satr kerakli uzunlikkacha boshidan to‘ldiriladi.',
    ),
    why(
      tf('q4', 'Satr metodlari asl satrni o‘zgartiradi.', false),
      'Ular har doim yangi satr qaytaradi.',
    ),
  ]),
  'string-search': lessonQuiz([
    why(
      q('q1', "`'banan'.indexOf('n')` natijasi?", ['2', '1', '4', '-1'], [0]),
      'Birinchi “n” 2-indeksda; topilmasa `-1`.',
    ),
    why(
      match('q2', 'Metodni natija turi bilan moslang.', [
        ['includes', 'true yoki false'],
        ['indexOf', 'Indeks yoki -1'],
        ['match', 'Topilganlar massivi yoki null'],
      ]),
      'Faqat “bormi?” degan savolga `includes` eng aniq.',
    ),
    why(
      q(
        'q3',
        'Fayl nomi `.pdf` bilan tugashini qanday tekshirasiz?',
        [
          "nom.endsWith('.pdf')",
          "nom.startsWith('.pdf')",
          "nom.indexOf('.pdf') === 0",
          "nom.slice('.pdf')",
        ],
        [0],
      ),
      '`startsWith` — boshlanishini tekshiradi.',
    ),
    why(
      tf('q4', "`'Salom'.includes('salom')` natijasi `true`.", false),
      'Qidiruv katta-kichik harfni farqlaydi; kerak bo‘lsa avval `toLowerCase()`.',
    ),
  ]),

  // ---- 5. Sonlar va Math ---------------------------------------------------------
  numbers: lessonQuiz([
    why(
      tf('q1', '`0.1 + 0.2 === 0.3` natijasi `true`.', false),
      'Kasr sonlar ikkilik tizimda aniq saqlanmaydi: `0.1 + 0.2` = `0.30000000000000004`.',
    ),
    why(
      match('q2', 'Ifodani natijasi bilan moslang.', [
        ['typeof NaN', "'number'"],
        ['1 / 0', 'Infinity'],
        ["Number('12px')", 'NaN'],
        ['Number.isInteger(5)', 'true'],
      ]),
      'NaN — “son emas”, lekin turi baribir `number`.',
    ),
    why(
      q('q3', '`NaN === NaN` natijasi?', ['false', 'true', 'NaN', 'Xato'], [0]),
      'NaN o‘ziga ham teng emas — tekshirish uchun `Number.isNaN(x)`.',
    ),
    why(
      codeFill('q4', 'Input qiymatini songa aylantiring.', 'const yosh = {{1}}(input.value);', [
        'Number',
      ]),
      'Input qiymati doim matn.',
    ),
  ]),
  'number-methods': lessonQuiz([
    why(
      fill('q1', 'Natijani yozing.', '(3.14159).toFixed(2) = {{1}}', [["'3.14'", '3.14']]),
      '`toFixed` satr qaytaradi va yaxlitlaydi.',
    ),
    why(
      match('q2', 'Ifodani natijasi bilan moslang.', [
        ["parseInt('12px')", '12'],
        ["parseFloat('3.5kg')", '3.5'],
        ["Number('12px')", 'NaN'],
        ['(255).toString(16)', "'ff'"],
      ]),
      '`parseInt`/`parseFloat` boshidagi sonni o‘qiydi, `Number` butun satr son bo‘lishini talab qiladi.',
    ),
    why(
      tf('q3', '`toFixed` natijasi son (number) bo‘ladi.', false),
      'U satr qaytaradi; hisoblashda davom etish uchun yana `Number(...)`.',
    ),
    why(
      q(
        'q4',
        'Narxni “1 250 000” ko‘rinishida chiqarish uchun nima qulay?',
        ["narx.toLocaleString('uz-UZ')", 'narx.toFixed(3)', 'narx.toString(2)', 'String(narx)'],
        [0],
      ),
      'Mahalliy formatlash xonalarni ajratadi.',
    ),
  ]),
  math: lessonQuiz([
    why(
      match('q1', 'Ifodani natijasi bilan moslang.', [
        ['Math.round(2.5)', '3'],
        ['Math.floor(2.7)', '2'],
        ['Math.ceil(2.1)', '3'],
        ['Math.trunc(-2.7)', '-2'],
      ]),
      '`floor` — pastga, `ceil` — yuqoriga, `trunc` — kasr qismini tashlaydi.',
    ),
    why(
      q(
        'q2',
        'Massivdagi eng katta sonni qanday topasiz?',
        ['Math.max(...sonlar)', 'Math.max(sonlar)', 'sonlar.max()', 'Math.top(sonlar)'],
        [0],
      ),
      '`Math.max([1, 2])` — NaN; spread (`...`) massivni argumentlarga yoyadi.',
    ),
    why(
      fill('q3', 'Natijani yozing.', 'Math.sqrt(16) + Math.abs(-5) = {{1}}', ['9']),
      'Ildiz: √16 = 4, modul: |−5| = 5; jami 4 + 5 = 9.',
    ),
    why(
      codeFill(
        'q4',
        'Qiymatni 0 va 100 orasida ushlang.',
        'const foiz = Math.min(100, Math.{{1}}(0, x));',
        ['max'],
      ),
      'Avval pastki, keyin yuqori chegara.',
    ),
  ]),

  // ---- 6. Massivlar --------------------------------------------------------------
  arrays: lessonQuiz([
    why(
      codeFill('q1', 'Oxirgi elementni oling.', 'const oxirgi = mevalar[mevalar.{{1}} - 1];', [
        'length',
      ]),
      'Indekslar 0 dan boshlanadi; `mevalar.at(-1)` ham ishlaydi.',
    ),
    why(
      q('q2', '`typeof [1, 2, 3]` natijasi?', ["'object'", "'array'", "'list'", "'number'"], [0]),
      'Massivni aniqlash uchun `Array.isArray(x)`.',
    ),
    why(
      fill('q3', 'Natijani yozing.', "[1, 2, 3].join('-') = {{1}}", [["'1-2-3'", '1-2-3']]),
      '`join` elementlarni berilgan ajratuvchi bilan ulaydi.',
    ),
    why(
      tf('q4', 'Bitta massivda son, satr va obyekt birga saqlanishi mumkin.', true),
      'Lekin odatda bir xil turdagi qiymatlar saqlanadi — masalan, obyektlar massivi.',
    ),
  ]),
  'array-methods': lessonQuiz([
    why(
      match('q1', 'Metodni vazifasi bilan moslang.', [
        ['push', 'Oxiriga qo‘shadi'],
        ['pop', 'Oxiridan oladi'],
        ['unshift', 'Boshiga qo‘shadi'],
        ['shift', 'Boshidan oladi'],
      ]),
      'Barchasi asl massivni o‘zgartiradi.',
    ),
    why(
      sortInto('q2', 'Metod asl massivni o‘zgartiradimi?', {
        "O'zgartiradi": ['splice', 'push', 'sort'],
        "O'zgartirmaydi (yangisini qaytaradi)": ['slice', 'concat', 'flat'],
      }),
      'Asl ma’lumotni saqlash kerak bo‘lsa, o‘zgartirmaydigan metodlarni tanlang.',
    ),
    why(
      q('q3', '`[].pop()` natijasi?', ['undefined', 'null', 'Xato', '0'], [0]),
      'Bo‘sh massivdan olish xato bermaydi.',
    ),
    why(
      fill('q4', 'Natijani yozing.', '[[1, 2], [3]].flat() = {{1}}', [['[1, 2, 3]', '[1,2,3]']]),
      '`flat` bir daraja ichma-ich massivni tekislaydi.',
    ),
  ]),
  'array-search': lessonQuiz([
    why(
      match('q1', 'Metodni natijasi bilan moslang.', [
        ['find', 'Shartga mos birinchi element (yoki undefined)'],
        ['findIndex', 'Uning indeksi (yoki -1)'],
        ['some', 'Kamida bittasi mosmi — true/false'],
        ['every', 'Hammasi mosmi — true/false'],
      ]),
      '`includes` va `indexOf` aniq qiymat bo‘yicha qidiradi.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nconst sonlar = [3, 8, 12, 5];\nconsole.log(sonlar.find((x) => x > 10));\n```',
        ['12', '[12]', 'true', '2'],
        [0],
      ),
      '`find` elementning o‘zini qaytaradi.',
    ),
    why(
      q('q3', '`[3, 8].find((x) => x > 100)` natijasi?', ['undefined', '-1', 'null', 'false'], [0]),
      'Topilmasa `undefined` — undan xususiyat o‘qishdan oldin tekshiring.',
    ),
    why(
      tf('q4', "`['Olma'].includes('olma')` natijasi `true`.", false),
      'Katta-kichik harf farqlanadi; harfsiz qidirish uchun ikkalasini `toLowerCase()` qiling.',
    ),
  ]),
  'array-sort': lessonQuiz([
    why(
      q(
        'q1',
        '`[10, 9, 1].sort()` natijasi?',
        ['[1, 10, 9]', '[1, 9, 10]', '[10, 9, 1]', '[9, 10, 1]'],
        [0],
      ),
      'Standart `sort` elementlarni satr sifatida solishtiradi.',
    ),
    why(
      codeFill('q2', 'Sonlarni o‘sish tartibida saralang.', 'sonlar.sort((a, b) => a {{1}} b);', [
        '-',
      ]),
      'Manfiy natija — `a` oldinda.',
    ),
    why(
      q(
        'q3',
        'Asl massivni o‘zgartirmasdan saralangan nusxa qaysi metod bilan olinadi?',
        ['toSorted', 'sort', 'reverse', 'splice'],
        [0],
      ),
      '`sort` va `reverse` asl massivni o‘zgartiradi.',
    ),
    why(
      codeFill(
        'q4',
        'Talabalarni ball bo‘yicha kamayish tartibida saralang.',
        'talabalar.sort((a, b) => b.ball - a.{{1}});',
        ['ball'],
      ),
      '`b - a` kamayish tartibini beradi.',
    ),
  ]),

  // ---- 7. Sana va vaqt -------------------------------------------------------------
  dates: lessonQuiz([
    why(
      q(
        'q1',
        '`new Date(2026, 0, 15)` qaysi sanani bildiradi?',
        ['15-yanvar, 2026', '15-fevral, 2026', '0-yanvar', 'Xato'],
        [0],
      ),
      'Oylar 0 dan sanaladi: 0 — yanvar, 11 — dekabr.',
    ),
    why(
      tf('q2', 'Sana ichida 1970-yildan beri o‘tgan millisoniyalar saqlanadi.', true),
      'Ikki sana ayirmasi millisoniyalarda bo‘ladi.',
    ),
    why(
      fill(
        'q3',
        'Sonni yozing.',
        'Millisoniyalardagi farqni kunlarga aylantirish uchun {{1}} ga bo‘linadi (1000 × 60 × 60 × 24).',
        [['86400000', '86 400 000']],
      ),
      'Bir kundagi millisoniyalar soni.',
    ),
    why(
      q(
        'q4',
        '`new Date(2026, 0, 32)` nima bo‘ladi?',
        [
          '1-fevral, 2026 (oshib ketgan kun keyingi oyga o‘tadi)',
          'Xato',
          'Invalid Date',
          '31-yanvar',
        ],
        [0],
      ),
      'Oshib ketgan qiymatlar avtomatik keyingi oy/yilga o‘tkaziladi.',
    ),
  ]),
  'date-formats': lessonQuiz([
    why(
      q(
        'q1',
        'Matndan sana yaratish uchun eng ishonchli format qaysi?',
        ["ISO: '2026-03-21'", "'21/03/2026'", "'21 mart 2026'", "'03.21.26'"],
        [0],
      ),
      'ISO formatini barcha brauzerlar bir xil tushunadi.',
    ),
    why(
      tf('q2', '`<input type="date">` ning `value` si `YYYY-MM-DD` ko‘rinishidagi matn.', true),
      'Uni `new Date(value)` bilan sanaga aylantirish mumkin.',
    ),
    why(
      codeFill(
        'q3',
        'Kunni ikki xonali qiling (5 → 05).',
        "const kun = String(sana.getDate()).{{1}}(2, '0');",
        ['padStart'],
      ),
      'Formatni o‘zingiz yig‘ishda qulay.',
    ),
    why(
      q(
        'q4',
        'Sanani foydalanuvchi tilida chiqaradigan metod?',
        ['toLocaleDateString', 'toISOString', 'getTime', 'valueOf'],
        [0],
      ),
      "Masalan, `sana.toLocaleDateString('uz-UZ')`.",
    ),
  ]),
  'date-get': lessonQuiz([
    why(
      match('q1', 'Metodni qaytaradigan qiymati bilan moslang.', [
        ['getFullYear()', 'Yil (2026)'],
        ['getMonth()', 'Oy (0–11)'],
        ['getDate()', 'Oy kuni (1–31)'],
        ['getDay()', 'Hafta kuni (0–6)'],
      ]),
      '`getMonth` va `getDay` 0 dan boshlanadi.',
    ),
    why(
      q(
        'q2',
        '`getDay()` 0 qaytarsa, bu qaysi kun?',
        ['Yakshanba', 'Dushanba', 'Shanba', 'Juma'],
        [0],
      ),
      'Hafta yakshanbadan boshlanadi: 0 — yakshanba, 1 — dushanba.',
    ),
    why(
      codeFill(
        'q3',
        'Hafta kuni nomini massivdan oling.',
        "const kunlar = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];\nconst nom = kunlar[sana.{{1}}()];",
        ['getDay'],
      ),
      'Raqam massiv indeksi sifatida ishlatiladi.',
    ),
    why(
      tf(
        'q4',
        'UTC metodlari (`getUTCHours`) foydalanuvchining mahalliy vaqt zonasini hisobga oladi.',
        false,
      ),
      'UTC metodlari Grinvich vaqtini beradi; mahalliy vaqt — oddiy `getHours`.',
    ),
  ]),

  // ---- 8. Mantiq va shartlar -------------------------------------------------------
  booleans: lessonQuiz([
    why(
      sortInto('q1', 'Qiymatlarni ajrating.', {
        Falsy: ['0', "''", 'null', 'undefined', 'NaN'],
        Truthy: ["'0'", '[]', "'false'"],
      }),
      "Faqat oltita qiymat falsy (va `-0`, `0n`); qolgani truthy — hatto `'0'` va bo‘sh massiv.",
    ),
    why(
      fill('q2', 'Natijani yozing.', "!!'' = {{1}}", ['false']),
      "`!!` qiymatni boolean’ga aylantiradi; `Boolean('')` bilan bir xil.",
    ),
    why(
      q('q3', "`Boolean('salom')` natijasi?", ['true', 'false', "'salom'", 'undefined'], [0]),
      'Bo‘sh bo‘lmagan satr — truthy.',
    ),
    why(
      tf('q4', 'Taqqoslash natijasi doim `true` yoki `false`.', true),
      'Masalan, `5 > 3` — `true`.',
    ),
  ]),
  comparisons: lessonQuiz([
    why(
      match('q1', 'Ifodani natijasi bilan moslang.', [
        ['0 ?? 5', '0'],
        ['0 || 5', '5'],
        ['null ?? 5', '5'],
        ["'' || 'mehmon'", "'mehmon'"],
      ]),
      '`??` faqat `null`/`undefined` da o‘ng tomonni oladi, `||` esa har qanday falsy da.',
    ),
    why(
      codeFill(
        'q2',
        'Ternar operator bilan yozing.',
        "const holat = ball >= 60 {{1}} 'o‘tdi' {{2}} 'o‘tmadi';",
        ['?', ':'],
      ),
      '`shart ? ha : yo‘q`.',
    ),
    why(
      q('q3', "`'10' < '9'` natijasi?", ['true', 'false', 'NaN', 'Xato'], [0]),
      'Ikkalasi satr — belgima-belgi solishtiriladi: “1” “9” dan kichik.',
    ),
    why(
      match('q4', 'Operatorni ma’nosi bilan moslang.', [
        ['&&', 'Va — ikkalasi ham true'],
        ['||', 'Yoki — kamida bittasi true'],
        ['!', 'Inkor'],
      ]),
      'Taqqoslashda doim `===` va `!==` ishlating.',
    ),
  ]),
  'if-else': lessonQuiz([
    why(
      q(
        'q1',
        "Natija?\n\n```js\nconst ball = 75;\nif (ball >= 90) console.log('A');\nelse if (ball >= 70) console.log('B');\nelse console.log('C');\n```",
        ['B', 'A', 'C', 'B va C'],
        [0],
      ),
      'Birinchi to‘g‘ri shart bajariladi, qolganlari tekshirilmaydi.',
    ),
    why(
      tf('q2', '`if (ism)` sharti `ism` bo‘sh satr bo‘lsa bajarilmaydi.', true),
      'Bo‘sh satr — falsy.',
    ),
    why(
      q(
        'q3',
        '“Erta qaytish” (early return) nima?',
        [
          'Noto‘g‘ri holatlarni boshida return bilan chiqarib tashlash',
          'Funksiyani avval chaqirish',
          'Sikl boshida break',
          'else yozmaslik har doim',
        ],
        [0],
      ),
      'Kod ichma-ich `if` lardan tozalanadi.',
    ),
    why(
      q(
        'q4',
        '60 ball “o‘tdi” bo‘lishi kerak. Qaysi shart to‘g‘ri?',
        ['ball >= 60', 'ball > 60', 'ball == 59', 'ball < 60'],
        [0],
      ),
      'Chegaraviy qiymatlarni alohida tekshiring.',
    ),
  ]),

  // ---- 9. Sikllar ------------------------------------------------------------------
  'loop-for': lessonQuiz([
    why(
      order('q1', '`for` sikli qismlarini tartiblang.', [
        'Boshlang‘ich qiymat (let i = 0)',
        'Shart (i < 5)',
        'Qadam (i++)',
      ]),
      '`for (let i = 0; i < 5; i++) { … }`.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nlet s = 0;\nfor (let i = 1; i <= 4; i++) s += i;\nconsole.log(s);\n```',
        ['10', '4', '6', '15'],
        [0],
      ),
      '1 + 2 + 3 + 4 = 10.',
    ),
    why(
      q(
        'q3',
        '`for (let i = 0; i < 10; i += 2)` necha marta aylanadi?',
        ['5', '10', '4', '6'],
        [0],
      ),
      'i = 0, 2, 4, 6, 8.',
    ),
    why(
      tf('q4', 'Shart hech qachon `false` bo‘lmasa, sikl cheksiz aylanib sahifani qotiradi.', true),
      'Qadam shartga yaqinlashtirishini tekshiring.',
    ),
  ]),
  'loop-for-in': lessonQuiz([
    why(
      q(
        'q1',
        '`for (const k in obyekt)` da `k` nima?',
        ['Kalit (xususiyat nomi)', 'Qiymat', 'Indeks soni', 'Obyektning o‘zi'],
        [0],
      ),
      'Qiymat `obyekt[k]` bilan olinadi.',
    ),
    why(
      tf('q2', '`for...in` massivlar bo‘ylab aylanish uchun tavsiya etiladi.', false),
      'Massivlar uchun `for...of` yoki `forEach`.',
    ),
    why(
      codeFill(
        'q3',
        'Kalit va qiymatni birga oling.',
        'for (const [kalit, qiymat] of Object.{{1}}(narxlar)) {\n  console.log(kalit, qiymat);\n}',
        ['entries'],
      ),
      'Zamonaviy muqobil — `Object.entries`.',
    ),
    why(
      fill(
        'q4',
        'Natijani yozing.',
        'let s = 0;\nfor (const k in { a: 2, b: 3 }) s += 1;\n// s = {{1}}',
        ['2'],
      ),
      'Ikkita kalit — ikki marta aylanadi.',
    ),
  ]),
  'loop-for-of': lessonQuiz([
    why(
      match('q1', 'Sikl turini nimani berishi bilan moslang.', [
        ['for...in', 'Kalitlar (indekslar)'],
        ['for...of', 'Qiymatlar'],
      ]),
      '`in` — kalitlar, `of` — qiymatlar.',
    ),
    why(
      q(
        'q2',
        "Natija?\n\n```js\nlet n = 0;\nfor (const harf of 'salom') n++;\nconsole.log(n);\n```",
        ['5', '1', '0', 'Xato'],
        [0],
      ),
      'Satr ham iteratsiya qilinadi — har belgi bo‘ylab.',
    ),
    why(
      q(
        'q3',
        '`for (const x of { a: 1 })` natijasi?',
        ['TypeError — oddiy obyekt iteratsiya qilinmaydi', '1', 'a', 'undefined'],
        [0],
      ),
      'Obyekt uchun `Object.values(...)` yoki `Object.entries(...)` ustida aylaning.',
    ),
    why(
      codeFill(
        'q4',
        'Indeks ham kerak bo‘lsa.',
        'for (const [i, meva] of mevalar.{{1}}()) {\n  console.log(i, meva);\n}',
        ['entries'],
      ),
      'Massivning `entries()` metodi `[indeks, qiymat]` juftliklarini beradi.',
    ),
  ]),
  'loop-while': lessonQuiz([
    why(
      tf('q1', '`do...while` sikli shart `false` bo‘lsa ham kamida bir marta bajariladi.', true),
      'Shart oxirida tekshiriladi.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nlet n = 1;\nwhile (n < 20) n *= 2;\nconsole.log(n);\n```',
        ['32', '16', '20', '40'],
        [0],
      ),
      '1 → 2 → 4 → 8 → 16 → 32; 32 < 20 emas — to‘xtaydi.',
    ),
    why(
      q(
        'q3',
        'Qachon `while` `for` dan qulayroq?',
        [
          'Aylanishlar soni oldindan noma’lum bo‘lsa',
          'Massiv bo‘ylab yurganda',
          'Har doim',
          'Hech qachon',
        ],
        [0],
      ),
      'Masalan, jamg‘arma maqsadga yetguncha.',
    ),
    why(
      fill(
        'q4',
        'Natijani yozing.',
        'let son = 1234, s = 0;\nwhile (son > 0) { s += son % 10; son = Math.floor(son / 10); }\n// s = {{1}}',
        ['10'],
      ),
      'Raqamlar yig‘indisi: 4 + 3 + 2 + 1.',
    ),
  ]),
  'break-continue': lessonQuiz([
    why(
      match('q1', 'Buyruqni vazifasi bilan moslang.', [
        ['break', 'Siklni butunlay to‘xtatadi'],
        ['continue', 'Joriy aylanishni o‘tkazib, keyingisiga o‘tadi'],
      ]),
      'Funksiya ichida `return` siklni ham, funksiyani ham tugatadi.',
    ),
    why(
      q(
        'q2',
        "Natija?\n\n```js\nlet s = '';\nfor (let i = 1; i <= 5; i++) {\n  if (i === 3) continue;\n  s += i;\n}\nconsole.log(s);\n```",
        ["'1245'", "'12345'", "'12'", "'345'"],
        [0],
      ),
      '3 da `continue` — u qo‘shilmaydi.',
    ),
    why(
      q(
        'q3',
        "Natija?\n\n```js\nlet s = '';\nfor (let i = 1; i <= 5; i++) {\n  if (i === 3) break;\n  s += i;\n}\nconsole.log(s);\n```",
        ["'12'", "'123'", "'1245'", "'12345'"],
        [0],
      ),
      '3 ga yetganda sikl to‘xtaydi.',
    ),
    why(
      tf('q4', '`forEach` ichida `break` ishlatib siklni to‘xtatish mumkin.', false),
      '`forEach` da `break` ishlamaydi — kerak bo‘lsa `for...of` ishlating.',
    ),
  ]),

  // ---- 10. To‘plamlar va turlar -------------------------------------------------
  sets: lessonQuiz([
    why(
      fill('q1', 'Natijani yozing.', '[...new Set([1, 1, 2, 3, 3])] = {{1}}', [
        ['[1, 2, 3]', '[1,2,3]'],
      ]),
      '`Set` faqat noyob qiymatlarni saqlaydi.',
    ),
    why(
      match('q2', 'Metodni vazifasi bilan moslang.', [
        ['add', 'Qiymat qo‘shadi'],
        ['has', 'Bormi — true/false'],
        ['delete', 'O‘chiradi'],
        ['size', 'Elementlar soni'],
      ]),
      'Massivdagi `length` o‘rniga `size`.',
    ),
    why(
      tf(
        'q3',
        '`Set` ichidagi ikkita bir xil ko‘rinishdagi obyekt (`{a: 1}`) bitta qiymat deb hisoblanadi.',
        false,
      ),
      'Obyektlar havola bo‘yicha solishtiriladi — ular har xil.',
    ),
    why(
      q(
        'q4',
        'Qachon `Set` qulay?',
        [
          'Takrorlanmas qiymatlar ro‘yxati va tez “bormi?” tekshiruvi',
          'Kalit-qiymat juftliklari',
          'Tartiblangan indeksli ro‘yxat',
          'Matnni formatlash',
        ],
        [0],
      ),
      'Kalit-qiymat uchun `Map` yoki obyekt.',
    ),
  ]),
  maps: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Map’ga qiymat yozing va o‘qing.',
        "const narxlar = new Map();\nnarxlar.{{1}}('olma', 12000);\nnarxlar.{{2}}('olma'); // 12000",
        ['set', 'get'],
      ),
      '`has`, `delete`, `size` ham bor.',
    ),
    why(
      tf('q2', '`Map` kaliti sifatida obyekt ham ishlatilishi mumkin.', true),
      'Oddiy obyekt kalitlari esa satrga aylanadi.',
    ),
    why(
      q(
        'q3',
        'Matndagi so‘zlar necha marta uchrashini hisoblash uchun nima qulay?',
        ['Map (so‘z → son)', 'Set', 'Bitta son o‘zgaruvchi', 'Date'],
        [0],
      ),
      'Chastota hisoblash — `Map` ning odatiy ishlatilishi.',
    ),
    why(
      codeFill(
        'q4',
        'Oddiy obyektni Map’ga aylantiring.',
        'const m = new Map(Object.{{1}}(obyekt));',
        ['entries'],
      ),
      'Teskarisi: `Object.fromEntries(m)`.',
    ),
  ]),
  typeof: lessonQuiz([
    why(
      match('q1', 'Ifodani natijasi bilan moslang.', [
        ['typeof null', "'object'"],
        ['typeof []', "'object'"],
        ['typeof function () {}', "'function'"],
        ["typeof 'a'", "'string'"],
      ]),
      "`typeof null === 'object'` — tilning tarixiy xatosi.",
    ),
    why(
      q(
        'q2',
        'Qiymat massiv ekanini qanday aniqlash to‘g‘ri?',
        ['Array.isArray(x)', "typeof x === 'array'", 'x instanceof Object', 'x.length > 0'],
        [0],
      ),
      '`typeof` massiv uchun `object` qaytaradi.',
    ),
    why(
      q(
        'q3',
        'E’lon qilinmagan o‘zgaruvchi uchun `typeof x` nima qaytaradi?',
        ["'undefined' (xatosiz)", 'ReferenceError', "'null'", "''"],
        [0],
      ),
      '`typeof` — e’lon qilinmagan nomda xato bermaydigan yagona amal.',
    ),
    why(
      codeFill('q4', 'Qiymat aynan null ekanini tekshiring.', 'if (x {{1}} null) { … }', ['===']),
      '`typeof` null ni ajrata olmaydi.',
    ),
  ]),
  'type-conversion': lessonQuiz([
    why(
      match('q1', 'Ifodani natijasi bilan moslang.', [
        ["Number('')", '0'],
        ['Number(null)', '0'],
        ['Number(undefined)', 'NaN'],
        ['Number(true)', '1'],
      ]),
      'Bo‘sh satr ham 0 ga aylanadi — input bo‘shligini alohida tekshiring.',
    ),
    why(
      match('q2', 'Avtomatik aylantirish natijasi.', [
        ["'3' + 4", "'34'"],
        ["'3' * '4'", '12'],
        ["'10' - 1", '9'],
      ]),
      '`+` satr bilan ulaydi, boshqa arifmetik amallar songa aylantiradi.',
    ),
    why(
      q('q3', "`Boolean('0')` natijasi?", ['true', 'false', '0', 'NaN'], [0]),
      'Bo‘sh bo‘lmagan har qanday satr — truthy.',
    ),
    why(
      codeFill(
        'q4',
        "'12 500 so‘m' matnidan sonni oling.",
        "const son = Number(matn.replace(/\\D/g, ''));\n// natija: {{1}}",
        ['12500'],
      ),
      '`\\D` — raqam bo‘lmagan har bir belgi; ular olib tashlanadi.',
    ),
  ]),
  destructuring: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Obyektdan ikki xususiyatni oling.',
        "const { ism, {{1}} } = { ism: 'Ali', yosh: 20 };",
        ['yosh'],
      ),
      'Nomlar xususiyat nomlariga mos bo‘lishi kerak.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nlet a = 1, b = 2;\n[a, b] = [b, a];\nconsole.log(a, b);\n```',
        ['2 1', '1 2', '2 2', 'Xato'],
        [0],
      ),
      'Destrukturlash bilan qiymatlarni vaqtinchalik o‘zgaruvchisiz almashtirish mumkin.',
    ),
    why(
      q(
        'q3',
        '`const [x, , z] = [10, 20, 30];` dan keyin `z` = ?',
        ['30', '20', '10', 'undefined'],
        [0],
      ),
      'Vergul bilan element o‘tkazib yuboriladi.',
    ),
    why(
      tf('q4', '`const { a } = undefined;` xatosiz ishlaydi va `a` = undefined bo‘ladi.', false),
      '`undefined` yoki `null` ni destrukturlash TypeError beradi.',
    ),
  ]),

  // ---- 11. Xatolar va sifatli kod --------------------------------------------------
  errors: lessonQuiz([
    why(
      order('q1', 'Bloklarni yozilish tartibida joylang.', ['try', 'catch', 'finally']),
      '`finally` xato bo‘lsa ham, bo‘lmasa ham bajariladi.',
    ),
    why(
      match('q2', 'Xato turini sababi bilan moslang.', [
        ['ReferenceError', 'E’lon qilinmagan o‘zgaruvchiga murojaat'],
        ['TypeError', 'undefined dan xususiyat o‘qish yoki funksiya bo‘lmagan narsani chaqirish'],
        ['SyntaxError', 'Kod yozilishi noto‘g‘ri'],
        ['RangeError', 'Qiymat ruxsat etilgan oraliqdan tashqarida'],
      ]),
      'Xato obyektida `name` va `message` bor.',
    ),
    why(
      codeFill(
        'q3',
        'O‘z xatoingizni tashlang.',
        "if (yosh < 0) {\n  {{1}} new Error('Yosh manfiy bo‘lolmaydi');\n}",
        ['throw'],
      ),
      'Tashlangan xatoni yuqoridagi `try...catch` ushlaydi.',
    ),
    why(
      q(
        'q4',
        'Natija?\n\n```js\ntry {\n  null.ism;\n} catch (e) {\n  console.log(e.name);\n}\n```',
        ['TypeError', 'ReferenceError', 'SyntaxError', 'null'],
        [0],
      ),
      '`null` dan xususiyat o‘qib bo‘lmaydi.',
    ),
  ]),
  scope: lessonQuiz([
    why(
      match('q1', 'Doirani misoli bilan moslang.', [
        ['Global', 'Har qanday funksiyadan tashqarida e’lon qilingan'],
        ['Funksiya', 'Funksiya ichida e’lon qilingan'],
        ['Blok', '{ } ichida let/const bilan e’lon qilingan'],
      ]),
      'Ichki doira tashqi o‘zgaruvchilarni ko‘radi, teskarisi emas.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nlet x = 1;\nfunction f() {\n  let x = 2;\n  return x;\n}\nconsole.log(f(), x);\n```',
        ['2 1', '2 2', '1 1', '1 2'],
        [0],
      ),
      'Ichki `x` tashqisini “soyalaydi” (shadowing), tashqisi o‘zgarmaydi.',
    ),
    why(
      tf(
        'q3',
        'Ichki funksiya o‘zini o‘rab turgan funksiyaning o‘zgaruvchilarini ko‘ra oladi.',
        true,
      ),
      'Bu leksik doira — yopilmalar (closures) shunga asoslanadi.',
    ),
    why(
      tf('q4', 'Global o‘zgaruvchilar qancha ko‘p bo‘lsa, kod shuncha xavfsiz.', false),
      'Ular nomlar to‘qnashuvi va kutilmagan o‘zgarishlarga olib keladi.',
    ),
  ]),
  hoisting: lessonQuiz([
    why(
      q(
        'q1',
        "Natija?\n\n```js\nsalom();\nfunction salom() {\n  console.log('Salom');\n}\n```",
        ["'Salom' chiqadi", 'ReferenceError', 'TypeError', 'undefined'],
        [0],
      ),
      'Funksiya e’loni to‘liq ko‘tariladi.',
    ),
    why(
      q(
        'q2',
        'Natija?\n\n```js\nconsole.log(a);\nvar a = 5;\n```',
        ['undefined', '5', 'ReferenceError', 'null'],
        [0],
      ),
      '`var` ning e’loni ko‘tariladi, qiymati emas.',
    ),
    why(
      sortInto('q3', 'E’londan oldin chaqirsa bo‘ladimi?', {
        "Bo'ladi": ['function f() {} — funksiya e’loni'],
        "Bo'lmaydi": ['const f = () => {}', 'let f = function () {}', 'class A {}'],
      }),
      '`let`, `const` va `class` — vaqtinchalik o‘lik zonada (TDZ).',
    ),
    why(
      tf('q4', 'Amaliy qoida: o‘zgaruvchi va funksiyalarni ishlatishdan oldin e’lon qiling.', true),
      'Shunda hoisting haqida o‘ylashga hojat qolmaydi.',
    ),
  ]),
  'strict-mode': lessonQuiz([
    why(
      codeFill('q1', 'Faylni qat’iy rejimga o‘tkazing.', '{{1}};\nlet x = 1;', [
        ["'use strict'", '"use strict"'],
      ]),
      'Fayl yoki funksiya boshida yoziladi.',
    ),
    why(
      q(
        'q2',
        'Qat’iy rejimda `yosh = 20;` (e’lonsiz) natijasi?',
        ['ReferenceError', 'Global yosh yaratiladi', 'undefined', 'Hech narsa'],
        [0],
      ),
      'Oddiy rejimda xato o‘rniga jimgina global o‘zgaruvchi yaratilardi.',
    ),
    why(
      sortInto('q3', 'Qaysi kod avtomatik qat’iy rejimda ishlaydi?', {
        'Avtomatik qat’iy': ['ES modullari (type="module")', 'class tanasi'],
        'Oddiy rejim': ['Oddiy <script> ichidagi kod'],
      }),
      "Modul va klasslarda `'use strict'` yozish shart emas.",
    ),
    why(
      tf('q4', 'Qat’iy rejim jimgina o‘tib ketadigan xatolarni ochiq xatoga aylantiradi.', true),
      'Xatolar erta topiladi — shuning uchun u tavsiya etiladi.',
    ),
  ]),
  this: lessonQuiz([
    why(
      match('q1', '`this` qiymatini holat bilan moslang.', [
        ['obj.metod() ichida', 'obj'],
        ['Oddiy funksiyali hodisa ishlovchisida', 'Hodisa sodir bo‘lgan element'],
        ['Arrow funksiyada', 'Tashqi doiradagi this'],
      ]),
      '`this` funksiya qanday chaqirilganiga bog‘liq.',
    ),
    why(
      q(
        'q2',
        'Qat’iy rejimda natija?\n\n```js\nconst f = odam.salom;\nf();\n```\n(`salom` ichida `this.ism` o‘qiladi)',
        ['TypeError — this undefined', "'Salom, Ali'", 'undefined', 'null'],
        [0],
      ),
      'Metod obyektdan ajratilganda kontekst yo‘qoladi; `bind` yoki arrow funksiya yordam beradi.',
    ),
    why(
      tf('q3', 'Arrow funksiyaning o‘z `this` i bo‘lmaydi.', true),
      'Shuning uchun u obyekt metodi sifatida yaxshi emas, lekin ichki callback’da qulay.',
    ),
    why(
      codeFill('q4', 'Metodni obyektga bog‘lab saqlang.', 'const f = odam.salom.{{1}}(odam);', [
        'bind',
      ]),
      '`bind` `this` qiymati qotirilgan yangi funksiya qaytaradi.',
    ),
  ]),
  'arrow-functions': lessonQuiz([
    why(
      codeFill('q1', 'Arrow funksiya yozing.', 'const kvadrat = (x) {{1}} x * x;', ['=>']),
      'Bitta ifoda bo‘lsa `return` va `{ }` yozilmaydi.',
    ),
    why(
      q(
        'q2',
        'Obyekt qaytaradigan arrow funksiya qaysi yozuvda to‘g‘ri?',
        [
          "() => ({ ism: 'Ali' })",
          "() => { ism: 'Ali' }",
          "() => return { ism: 'Ali' }",
          "=> { ism: 'Ali' }",
        ],
        [0],
      ),
      'Qavssiz `{ }` funksiya tanasi deb o‘qiladi.',
    ),
    why(
      fill('q3', 'Natijani yozing.', '[1, 2, 3].map((x) => x * 10) = {{1}}', [
        ['[10, 20, 30]', '[10,20,30]'],
      ]),
      'Arrow funksiyalar massiv metodlari bilan juda qulay.',
    ),
    why(
      tf(
        'q4',
        'Obyekt metodini arrow funksiya bilan yozsangiz, ichidagi `this` o‘sha obyekt bo‘ladi.',
        false,
      ),
      'Arrow funksiyada `this` tashqi doiradan olinadi.',
    ),
  ]),
  debugging: lessonQuiz([
    why(
      order('q1', 'Xato qidirish qadamlarini tartiblang.', [
        'Muammoni aniq takrorlash',
        'console.log bilan oraliq qiymatlarni ko‘rish',
        'Brauzer debugger’ida to‘xtash nuqtasi qo‘yish',
        'Gipotezani tekshirib, tuzatish',
      ]),
      'Taxmin bilan emas, dalil bilan ishlang.',
    ),
    why(
      codeFill(
        'q2',
        'Kodni shu joyda to‘xtating (DevTools ochiq bo‘lsa).',
        'function hisobla(x) {\n  {{1}};\n  return x * 2;\n}',
        ['debugger'],
      ),
      '`debugger` buyrug‘i to‘xtash nuqtasi kabi ishlaydi.',
    ),
    why(
      q(
        'q3',
        "`'5' + 1` natijasi '51' chiqyapti. Ehtimoliy sabab?",
        [
          'Qiymat matn — Number() bilan aylantirilmagan',
          'Brauzer xatosi',
          'Qo‘shish operatori buzilgan',
          'Kesh',
        ],
        [0],
      ),
      'Ko‘p uchraydigan mantiq xatolaridan biri.',
    ),
    why(
      tf('q4', 'Xatoni tuzatgandan keyin uni qaytadan takrorlab tekshirish kerak.', true),
      'Va iloji bo‘lsa, shu holat uchun test yozing.',
    ),
  ]),
  'style-guide': lessonQuiz([
    why(
      sortInto('q1', 'Yaxshi va yomon odatlarni ajrating.', {
        Yaxshi: [
          'const ni standart tanlash',
          '=== bilan solishtirish',
          'Sehrli sonni nomli konstantaga chiqarish',
        ],
        Yomon: ['var ishlatish', '== bilan solishtirish', 'Bir harfli noaniq nomlar'],
      }),
      'Kod uslubi kodni o‘qishni osonlashtiradi.',
    ),
    why(
      q(
        'q2',
        '`if (ball > 59)` dagi `59` ni qanday yaxshilash mumkin?',
        [
          'const OTISH_BALI = 60; if (ball >= OTISH_BALI)',
          'if (ball > 0x3b)',
          "if (ball > '59')",
          'O‘zgartirish kerak emas',
        ],
        [0],
      ),
      'Nomli konstanta ma’noni aytadi va bir joyda o‘zgartiriladi.',
    ),
    why(
      fill(
        'q3',
        'Vosita nomini yozing.',
        'Kod uslubi va ko‘p xatolarni avtomatik tekshiradigan dastur {{1}} deyiladi (masalan, ESLint).',
        [['linter', 'linter dastur']],
      ),
      'Formatlash uchun esa Prettier kabi vositalar bor.',
    ),
    why(
      tf('q4', 'Bitta loyihada nomlash uslubi (masalan, camelCase) bir xil bo‘lishi kerak.', true),
      'Izchillik — o‘qiluvchanlikning asosi.',
    ),
  ]),

  // ---- 12. Klasslar, modullar va JSON -------------------------------------------
  classes: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Klassning nusxasini yarating.',
        "class Talaba {\n  constructor(ism) {\n    this.ism = ism;\n  }\n}\nconst t = {{1}} Talaba('Aziza');",
        ['new'],
      ),
      '`new` siz klassni chaqirib bo‘lmaydi (TypeError).',
    ),
    why(
      q(
        'q2',
        '`typeof Talaba` (klass) natijasi?',
        ["'function'", "'class'", "'object'", "'undefined'"],
        [0],
      ),
      'Klass — maxsus sintaksisli funksiya.',
    ),
    why(
      tf('q3', 'Klassni e’lon qilinishidan oldin ishlatish mumkin (funksiya e’loni kabi).', false),
      'Klass ko‘tarilmaydi — `let` kabi vaqtinchalik o‘lik zonada.',
    ),
    why(
      fill(
        'q4',
        'Metod nomini yozing.',
        'Yangi nusxa yaratilganda avtomatik chaqiriladigan metod — {{1}}.',
        ['constructor'],
      ),
      'Unda nusxaning boshlang‘ich xususiyatlari beriladi.',
    ),
  ]),
  'class-inheritance': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Meros oling va ota konstruktorini chaqiring.',
        'class Oqituvchi {{1}} Odam {\n  constructor(ism, fan) {\n    {{2}}(ism);\n    this.fan = fan;\n  }\n}',
        ['extends', 'super'],
      ),
      '`super()` `this` dan oldin chaqirilishi shart.',
    ),
    why(
      q(
        'q2',
        '`new Oqituvchi(...) instanceof Odam` natijasi?',
        ['true', 'false', 'Xato', 'undefined'],
        [0],
      ),
      'Bola klass nusxasi ota klass nusxasi ham hisoblanadi.',
    ),
    why(
      q(
        'q3',
        'Qayta yozilgan metod ichidan ota metodini qanday chaqirasiz?',
        ['super.metod()', 'this.metod()', 'Odam()', 'parent.metod()'],
        [0],
      ),
      'Avval ota xatti-harakati, keyin qo‘shimcha.',
    ),
    why(
      tf('q4', 'Konstruktorda `super()` dan oldin `this` ga murojaat qilish mumkin.', false),
      'Bu ReferenceError beradi.',
    ),
  ]),
  'class-static': lessonQuiz([
    why(
      q(
        'q1',
        '`static` metod qanday chaqiriladi?',
        [
          'Klass orqali: Talaba.yarat()',
          'Nusxa orqali: t.yarat()',
          'this.yarat() har doim',
          'new yarat()',
        ],
        [0],
      ),
      'Statik a’zo klassning o‘ziga tegishli, nusxalarga emas.',
    ),
    why(
      codeFill('q2', 'Yopiq maydon e’lon qiling.', 'class Hisob {\n  {{1}}balans = 0;\n}', ['#']),
      'Yopiq maydonga klass tashqarisidan murojaat qilib bo‘lmaydi.',
    ),
    why(
      q(
        'q3',
        'Tashqaridan `hisob.#balans` ga murojaat qilsangiz?',
        ['SyntaxError', '0', 'undefined', 'Ishlaydi'],
        [0],
      ),
      '`#` — tilning haqiqiy yopiqligi; eski `_` faqat kelishuv edi.',
    ),
    why(
      tf(
        'q4',
        'Barcha nusxalar uchun umumiy hisoblagichni `static` maydonda saqlash mumkin.',
        true,
      ),
      'Masalan, nechta nusxa yaratilganini sanash.',
    ),
  ]),
  modules: lessonQuiz([
    why(
      codeFill('q1', 'Funksiyani import qiling.', "{{1}} { qoshish } from './matematika.js';", [
        'import',
      ]),
      'Boshqa faylda `export function qoshish…` bo‘lishi kerak.',
    ),
    why(
      codeFill('q2', 'Modulni HTML’da ulang.', '<script {{1}}="module" src="app.js"></script>', [
        'type',
      ]),
      'Modullar avtomatik `defer` va qat’iy rejimda ishlaydi.',
    ),
    why(
      match('q3', 'Eksport turini import yozuvi bilan moslang.', [
        ['export function f() {}', "import { f } from './a.js'"],
        ['export default function () {}', "import istalganNom from './a.js'"],
      ]),
      'Default eksport bitta bo‘ladi va import’da istalgan nom beriladi.',
    ),
    why(
      tf('q4', 'Modul ichidagi `let` o‘zgaruvchilari avtomatik global bo‘lib qoladi.', false),
      'Har modulning o‘z doirasi bor — faqat eksport qilingani tashqariga chiqadi.',
    ),
  ]),

  // ---- 13. Obyekt va funksiyalar chuqurroq --------------------------------------
  'object-constructors': lessonQuiz([
    why(
      order('q1', "`new Odam('Ali')` bajarilganda nima bo‘lishini tartiblang.", [
        'Yangi bo‘sh obyekt yaratiladi',
        'Uning prototipi Odam.prototype ga bog‘lanadi',
        'Funksiya this = yangi obyekt bilan bajariladi',
        'Yangi obyekt qaytariladi',
      ]),
      '`new` shu to‘rt ishni avtomatik bajaradi.',
    ),
    why(
      tf('q2', 'Konstruktor funksiya nomini bosh harf bilan yozish kelishuv.', true),
      'Shunda uni `new` bilan chaqirish kerakligi ko‘rinib turadi.',
    ),
    why(
      q(
        'q3',
        'Obyektni kim yaratganini qanday tekshirasiz?',
        ['obj instanceof Odam', "typeof obj === 'Odam'", "obj.name === 'Odam'", 'Odam in obj'],
        [0],
      ),
      '`instanceof` prototip zanjirini tekshiradi.',
    ),
    why(
      fill(
        'q4',
        'Atamani yozing.',
        '`new` siz oddiy obyekt qaytaradigan funksiya {{1}} funksiya deyiladi.',
        [['fabrika', 'factory']],
      ),
      'Masalan, `function odamYarat(ism) { return { ism }; }`.',
    ),
  ]),
  'object-prototypes': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Barcha nusxalar uchun umumiy metod qo‘shing.',
        "Odam.{{1}}.salom = function () {\n  return 'Salom, ' + this.ism;\n};",
        ['prototype'],
      ),
      'Metod har nusxada emas, bitta prototipda saqlanadi — xotira tejaladi.',
    ),
    why(
      q(
        'q2',
        'Xususiyat obyektning o‘zinikimi yoki prototipdanmi — qanday tekshiriladi?',
        ["Object.hasOwn(obj, 'ism')", "'ism' in obj", 'obj.ism !== undefined', 'typeof obj.ism'],
        [0],
      ),
      '`in` prototipdagi xususiyatlarni ham `true` deb topadi.',
    ),
    why(
      tf(
        'q3',
        '`Array.prototype` kabi tayyor prototiplarga o‘z metodlaringizni qo‘shish tavsiya etiladi.',
        false,
      ),
      'Bu boshqa kod va kelajakdagi standart metodlar bilan to‘qnashadi.',
    ),
    why(
      q(
        'q4',
        'Berilgan prototipli yangi obyektni qaysi metod yaratadi?',
        [
          'Object.create(proto)',
          'Object.assign(proto)',
          'new Object(proto)',
          'Object.freeze(proto)',
        ],
        [0],
      ),
      'Klasslar ham ichkarida prototiplar ustiga qurilgan.',
    ),
  ]),
  'object-accessors': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Hisoblanadigan xususiyat yozing.',
        "const odam = {\n  ism: 'Ali',\n  familiya: 'Valiyev',\n  {{1}} toliq() {\n    return this.ism + ' ' + this.familiya;\n  },\n};",
        ['get'],
      ),
      'Getter qavssiz o‘qiladi: `odam.toliq`.',
    ),
    why(
      q(
        'q2',
        'Yuqoridagi getter qanday o‘qiladi?',
        ['odam.toliq', 'odam.toliq()', 'odam.get(toliq)', 'odam[toliq()]'],
        [0],
      ),
      'Getter tashqaridan oddiy xususiyatdek ko‘rinadi.',
    ),
    why(
      tf('q3', 'Setter ichida noto‘g‘ri qiymatni rad etish (masalan, manfiy yosh) mumkin.', true),
      'Tekshiruvchi setter ma’lumotni toza saqlaydi.',
    ),
    why(
      q(
        'q4',
        'Faqat getter bo‘lgan xususiyatga qat’iy rejimda qiymat bersangiz?',
        ['TypeError', 'Qiymat yoziladi', 'Getter o‘chadi', 'undefined qaytadi, xatosiz'],
        [0],
      ),
      'Oddiy rejimda esa jimgina e’tiborsiz qoldiriladi.',
    ),
  ]),
  'object-protection': lessonQuiz([
    why(
      match('q1', 'Metodni ruxsatlari bilan moslang.', [
        ['Object.freeze', 'Qo‘shish, o‘zgartirish, o‘chirish — hammasi taqiq'],
        ['Object.seal', 'O‘zgartirish mumkin, qo‘shish va o‘chirish taqiq'],
        ['Object.preventExtensions', 'Faqat qo‘shish taqiq'],
      ]),
      'Uch daraja himoya.',
    ),
    why(
      q(
        'q2',
        "Natija?\n\n```js\nconst s = Object.freeze({ manzil: { shahar: 'Toshkent' } });\ns.manzil.shahar = 'Buxoro';\nconsole.log(s.manzil.shahar);\n```",
        ["'Buxoro'", "'Toshkent'", 'TypeError', 'undefined'],
        [0],
      ),
      'Muzlatish sayoz: ichki obyekt muzlatilmagan.',
    ),
    why(
      tf('q3', 'Muzlatilgan obyektni `Object.isFrozen(obj)` bilan tekshirish mumkin.', true),
      '`isSealed` va `isExtensible` ham bor.',
    ),
    why(
      q(
        'q4',
        'Bitta xususiyatni faqat o‘qiladigan qilish uchun nima ishlatiladi?',
        [
          "Object.defineProperty(obj, 'id', { writable: false })",
          'Object.freeze(obj.id)',
          'const obj.id',
          'obj.id.lock()',
        ],
        [0],
      ),
      'Xususiyat deskriptori bilan aniq boshqarish mumkin.',
    ),
  ]),
  'call-apply-bind': lessonQuiz([
    why(
      match('q1', 'Metodni xatti-harakati bilan moslang.', [
        ['call', 'Darhol chaqiradi, argumentlar alohida'],
        ['apply', 'Darhol chaqiradi, argumentlar massivda'],
        ['bind', 'Chaqirmaydi — bog‘langan yangi funksiya qaytaradi'],
      ]),
      'Uchalasining birinchi argumenti — `this` qiymati.',
    ),
    why(
      codeFill(
        'q2',
        'Funksiyani boshqa obyekt bilan chaqiring.',
        "function salom(qoshimcha) {\n  return this.ism + qoshimcha;\n}\nsalom.{{1}}({ ism: 'Ali' }, '!');",
        ['call'],
      ),
      "`apply` bo‘lsa: `salom.apply(obj, ['!'])`.",
    ),
    why(
      q(
        'q3',
        'Natija?\n\n```js\nfunction qosh(a, b) { return a + b; }\nconst besh = qosh.bind(null, 5);\nconsole.log(besh(3));\n```',
        ['8', '5', '3', 'NaN'],
        [0],
      ),
      'Qisman qo‘llash: birinchi argument oldindan berilgan.',
    ),
    why(
      tf('q4', '`bind` arrow funksiyaning `this` ini o‘zgartira oladi.', false),
      'Arrow funksiya `this` ni tashqi doiradan oladi va uni o‘zgartirib bo‘lmaydi.',
    ),
  ]),

  // ---- 14. Asinxron JavaScript -------------------------------------------------
  timing: lessonQuiz([
    why(
      order(
        'q1',
        "Konsolga chiqish tartibini joylang:\n\n```js\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nconsole.log('C');\n```",
        ['A', 'C', 'B'],
      ),
      'Taymer callback’i joriy kod tugagandan keyingina bajariladi — hatto 0 ms bo‘lsa ham.',
    ),
    why(
      match('q2', 'Funksiyani vazifasi bilan moslang.', [
        ['setTimeout', 'Bir marta, kechiktirib bajaradi'],
        ['setInterval', 'Muntazam takrorlaydi'],
        ['clearTimeout / clearInterval', 'Taymerni bekor qiladi'],
        ['requestAnimationFrame', 'Animatsiya kadrini chizish'],
      ]),
      'Taymer funksiyasi id qaytaradi — bekor qilish uchun shu kerak.',
    ),
    why(
      q(
        'q3',
        'Qaysi yozuv xato?',
        [
          'setTimeout(salom(), 1000)',
          'setTimeout(salom, 1000)',
          'setTimeout(() => salom(), 1000)',
          "setTimeout(salom, 1000, 'Ali')",
        ],
        [0],
      ),
      '`salom()` darhol chaqiriladi va taymerga uning natijasi beriladi — funksiyani bering, chaqirmang.',
    ),
    why(
      tf('q4', '`setTimeout(f, 1000)` funksiyani aniq 1000 ms da bajarishni kafolatlaydi.', false),
      'Bu eng kam kechikish — brauzer band bo‘lsa, kechroq bajariladi.',
    ),
  ]),
  callbacks: lessonQuiz([
    why(
      fill(
        'q1',
        'Atamani yozing.',
        'Boshqa funksiyaga argument sifatida beriladigan va keyinroq chaqiriladigan funksiya {{1}} deyiladi.',
        [['callback', 'kolbek']],
      ),
      'Masalan, `addEventListener` va massiv metodlariga beriladigan funksiyalar.',
    ),
    why(
      sortInto('q2', 'Callback qachon chaqiriladi?', {
        'Sinxron (darhol)': ['[1, 2].map(x => x * 2)', 'sonlar.forEach(...)'],
        'Asinxron (keyinroq)': ['setTimeout(f, 500)', "tugma.addEventListener('click', f)"],
      }),
      'Asinxron callback joriy kod tugagandan keyin ishlaydi.',
    ),
    why(
      tf(
        'q3',
        'Asinxron callback natijasini tashqi funksiyadan `return` bilan qaytarish mumkin.',
        false,
      ),
      'Tashqi funksiya allaqachon tugagan bo‘ladi — natija callback ichida ishlatiladi yoki Promise qaytariladi.',
    ),
    why(
      q(
        'q4',
        '“Callback do‘zaxi” nima?',
        [
          'Ichma-ich callback’lar tufayli o‘qib bo‘lmaydigan kod',
          'Callback’ni chaqirmaslik',
          'Juda tez ishlaydigan kod',
          'Xatosiz kod',
        ],
        [0],
      ),
      'Yechim — Promise va `async/await`.',
    ),
  ]),
  promises: lessonQuiz([
    why(
      match('q1', 'Promise holatini ma’nosi bilan moslang.', [
        ['pending', 'Kutilmoqda'],
        ['fulfilled', 'Muvaffaqiyatli (resolve)'],
        ['rejected', 'Xato bilan (reject)'],
      ]),
      'Holat bir marta o‘zgaradi va qaytmaydi.',
    ),
    why(
      codeFill(
        'q2',
        'Natija va xatoni ushlang.',
        'yukla()\n  .{{1}}((data) => korsat(data))\n  .{{2}}((xato) => console.error(xato))\n  .finally(() => yashir());',
        ['then', 'catch'],
      ),
      '`finally` natijadan qat’i nazar bajariladi.',
    ),
    why(
      q(
        'q3',
        '`Promise.all([a, b, c])` dagi bitta Promise xato bilan tugasa?',
        [
          'Butun natija xato bilan tugaydi (reject)',
          'Qolganlari natijasi qaytadi',
          'Xato e’tiborsiz qoldiriladi',
          'Promise.all qayta urinadi',
        ],
        [0],
      ),
      'Hammasining natijasi kerak bo‘lsa — `Promise.allSettled`.',
    ),
    why(
      codeFill(
        'q4',
        'Kutish yordamchisini yozing.',
        'const kut = (ms) => new Promise(({{1}}) => setTimeout(resolve, ms));',
        ['resolve'],
      ),
      '`await kut(500)` — 0.5 soniya kutadi.',
    ),
  ]),
  'async-await': lessonQuiz([
    why(
      tf('q1', '`await` ni oddiy (async bo‘lmagan) funksiya ichida ishlatish mumkin.', false),
      '`await` faqat `async` funksiya (yoki modulning yuqori darajasi) ichida.',
    ),
    why(
      q(
        'q2',
        '`async` funksiya nima qaytaradi?',
        ['Doim Promise', 'Doim undefined', 'Faqat son', 'Hech narsa'],
        [0],
      ),
      '`return 5` bo‘lsa ham natija — `5` bilan bajarilgan Promise.',
    ),
    why(
      codeFill(
        'q3',
        'Xatoni ushlang.',
        'async function yukla() {\n  {{1}} {\n    const javob = await fetch(url);\n  } catch (xato) {\n    console.error(xato);\n  }\n}',
        ['try'],
      ),
      '`async/await` da xatolar oddiy `try...catch` bilan ushlanadi.',
    ),
    why(
      q(
        'q4',
        'Bir-biriga bog‘liq bo‘lmagan uchta so‘rovni tezroq bajarish uchun?',
        [
          'await Promise.all([a(), b(), c()])',
          'Ketma-ket await a(); await b(); await c();',
          'setTimeout ichida',
          'for sikli ichida await',
        ],
        [0],
      ),
      'Parallel bajarilganda umumiy vaqt eng uzun so‘rovga teng bo‘ladi.',
    ),
  ]),

  // ---- 15. HTML DOM ----------------------------------------------------------------
  'dom-intro': lessonQuiz([
    why(
      fill('q1', 'Kengaytmani yozing.', 'DOM — Document Object {{1}}.', ['Model']),
      'Brauzer HTML’dan quradigan obyektlar daraxti.',
    ),
    why(
      tf(
        'q2',
        'JavaScript DOM’ni o‘zgartirsa, sahifaning manba kodi (Ctrl+U) ham o‘zgaradi.',
        false,
      ),
      'O‘zgarish faqat jonli DOM’da — manba fayl o‘sha-o‘sha qoladi; DevTools’ning Elements paneli DOM’ni ko‘rsatadi.',
    ),
    why(
      q(
        'q3',
        'DOM bilan ishlashning kirish nuqtasi qaysi obyekt?',
        ['document', 'window.dom', 'html', 'body'],
        [0],
      ),
      'Masalan, `document.getElementById(...)`, `document.body`, `document.title`.',
    ),
    why(
      q(
        'q4',
        'Skript elementlarni topa olishi uchun qayerda turishi kerak?',
        [
          '</body> dan oldin yoki defer bilan',
          '<head> boshida, deferSIZ',
          'HTML’dan oldin',
          'Farqi yo‘q',
        ],
        [0],
      ),
      'Aks holda elementlar hali yaratilmagan bo‘ladi.',
    ),
  ]),
  'dom-methods': lessonQuiz([
    why(
      match('q1', 'Metodni natijasi bilan moslang.', [
        ["getElementById('menyu')", 'id bo‘yicha bitta element (yoki null)'],
        ["querySelector('.karta')", 'CSS selektoriga mos birinchi element'],
        ["querySelectorAll('.karta')", 'Mos elementlarning hammasi (NodeList)'],
      ]),
      '`querySelector` istalgan CSS selektorini qabul qiladi.',
    ),
    why(
      q(
        'q2',
        'Foydalanuvchi yozgan izohni sahifaga chiqarishda nega `innerHTML` xavfli?',
        [
          'Matndagi HTML/skript bajarilishi mumkin (XSS)',
          'U sekin ishlaydi',
          'U matnni o‘chiradi',
          'U faqat sonlarni chiqaradi',
        ],
        [0],
      ),
      'Begona matn uchun doim `textContent`.',
    ),
    why(
      match('q3', 'Forma elementi xususiyatini turi bilan moslang.', [
        ['input.value', 'Matn (string)'],
        ['checkbox.checked', 'true yoki false'],
      ]),
      'Sonli maydon qiymati ham matn — `Number(...)` kerak.',
    ),
    why(
      tf('q4', "`karta.querySelector('h3')` faqat `karta` elementi ichidan qidiradi.", true),
      'Elementning ichidan qidirish qidiruv doirasini toraytiradi.',
    ),
  ]),
  'dom-elements': lessonQuiz([
    why(
      q(
        'q1',
        '`querySelectorAll` natijasiga `map` ishlatish uchun nima qilish kerak?',
        [
          'Array.from(...) yoki [...] bilan massivga aylantirish',
          'Hech narsa — map bor',
          'JSON.parse qilish',
          'toString chaqirish',
        ],
        [0],
      ),
      'NodeList’da `forEach` bor, lekin `map`/`filter` yo‘q.',
    ),
    why(
      match('q2', 'To‘plam turini xususiyati bilan moslang.', [
        ['querySelectorAll natijasi', 'Statik — keyin qo‘shilgan elementlar kirmaydi'],
        ['getElementsByClassName natijasi', 'Jonli — DOM o‘zgarsa avtomatik yangilanadi'],
      ]),
      'Jonli to‘plam ustida aylanib, elementlarni o‘chirish kutilmagan natija beradi.',
    ),
    why(
      codeFill(
        'q3',
        'Bosilgan tugmaning kartochkasini toping.',
        "const karta = tugma.{{1}}('.karta');",
        ['closest'],
      ),
      '`closest` elementning o‘zidan boshlab yuqoriga qarab birinchi mos ajdodni topadi.',
    ),
    why(
      q(
        'q4',
        "`el.matches('.faol')` nima qaytaradi?",
        [
          'Element selektorga mos kelsa true, aks holda false',
          'Mos elementlar ro‘yxati',
          'Birinchi faol element',
          'Klasslar soni',
        ],
        [0],
      ),
      'Hodisalar delegatsiyasida qulay.',
    ),
  ]),
  'dom-html': lessonQuiz([
    why(
      codeFill(
        'q1',
        '`data-kurs-id` atributini o‘qing.',
        '<button data-kurs-id="42">Yozilish</button>\n// JS:\nconst id = tugma.dataset.{{1}};',
        ['kursId'],
      ),
      '`data-*` nomidagi chiziqchalar camelCase’ga aylanadi.',
    ),
    why(
      match('q2', 'Kodni vazifasi bilan moslang.', [
        ["el.getAttribute('href')", 'Atribut qiymatini o‘qiydi'],
        ["el.setAttribute('alt', 'Logo')", 'Atributga qiymat yozadi'],
        ["el.removeAttribute('hidden')", 'Atributni olib tashlaydi'],
      ]),
      'Ko‘p atributlar xususiyat sifatida ham mavjud: `el.href`, `el.alt`.',
    ),
    why(
      q(
        'q3',
        'Tugmani faolsiz qilishning eng to‘g‘ri usuli?',
        [
          'tugma.disabled = true',
          "tugma.disabled = 'false'",
          "tugma.setAttribute('disabled', false)",
          "tugma.style.disabled = 'yes'",
        ],
        [0],
      ),
      "Boolean atributda atributning borligi muhim: `setAttribute('disabled', false)` ham uni faolsiz qiladi.",
    ),
    why(
      tf('q4', "`el.textContent = ''` element ichidagi barcha mazmunni o‘chiradi.", true),
      'Butun elementni almashtirish uchun `replaceWith`.',
    ),
  ]),
  'dom-css': lessonQuiz([
    why(
      match('q1', '`classList` metodini vazifasi bilan moslang.', [
        ['add', 'Klass qo‘shadi'],
        ['remove', 'Klassni olib tashlaydi'],
        ['toggle', 'Bor bo‘lsa olib tashlaydi, yo‘q bo‘lsa qo‘shadi'],
        ['contains', 'Klass bormi — true/false'],
      ]),
      'Uslubni CSS’da yozib, JS’dan faqat klassni almashtirish — asosiy usul.',
    ),
    why(
      codeFill('q2', 'Inline fon rangini bering.', "el.style.{{1}} = '#fff7d6';", [
        'backgroundColor',
      ]),
      'CSS’dagi chiziqchali nomlar JS’da camelCase bo‘ladi.',
    ),
    why(
      q(
        'q3',
        'CSS faylidan kelgan haqiqiy (hisoblangan) uslubni qanday o‘qiysiz?',
        ['getComputedStyle(el).color', 'el.style.color', 'el.css.color', 'el.getStyle()'],
        [0],
      ),
      '`el.style` faqat inline uslubni ko‘rsatadi.',
    ),
    why(
      tf('q4', 'Elementni yashirish uchun `el.hidden = true` ishlatish mumkin.', true),
      '`hidden` atributi standart holda `display: none` beradi.',
    ),
  ]),
  'dom-forms': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Forma sahifani qayta yuklamasin.',
        "forma.addEventListener('submit', (e) => {\n  e.{{1}}();\n  // tekshirish va yuborish\n});",
        ['preventDefault'],
      ),
      'Aks holda brauzer formani odatdagidek yuborib, sahifani yangilaydi.',
    ),
    why(
      match('q2', 'Constraint Validation metodini vazifasi bilan moslang.', [
        ['checkValidity()', 'Maydon/forma to‘g‘rimi — true/false'],
        ['setCustomValidity(xabar)', 'O‘z xato xabaringizni o‘rnatadi'],
        ['reportValidity()', 'Tekshirib, xatoni foydalanuvchiga ko‘rsatadi'],
      ]),
      'Brauzerning o‘z tekshiruvi `required`, `minlength`, `pattern` kabi atributlarga tayanadi.',
    ),
    why(
      tf('q3', 'Frontendda tekshirilgan ma’lumotni serverda qayta tekshirish shart emas.', false),
      'Frontend tekshiruvi — qulaylik; uni chetlab o‘tish oson. Xavfsizlik — serverda.',
    ),
    why(
      q(
        'q4',
        'Xato xabari ekran o‘qiydigan dasturga ham e’lon qilinishi uchun nima qulay?',
        [
          'aria-live="polite" li element (yoki role="alert")',
          'console.log',
          'alert har doim',
          'title atributi',
        ],
        [0],
      ),
      'Maydon bilan `aria-describedby` orqali ham bog‘lang.',
    ),
  ]),

  // ---- 16. DOM hodisalari va tugunlar ------------------------------------------------
  'dom-events': lessonQuiz([
    why(
      match('q1', 'Xususiyatni ma’nosi bilan moslang.', [
        ['event.target', 'Hodisa aslida sodir bo‘lgan element'],
        ['event.currentTarget', 'Ishlovchi ulangan element'],
      ]),
      'Bubbling tufayli ular har xil bo‘lishi mumkin.',
    ),
    why(
      tf(
        'q2',
        'Tugma bosilganda `click` hodisasi uning ota elementlariga ham tarqaladi (bubbling).',
        true,
      ),
      'Ichkaridan tashqariga: tugma → karta → body → document.',
    ),
    why(
      match('q3', 'Metodni vazifasi bilan moslang.', [
        ['preventDefault()', 'Brauzerning standart xatti-harakatini bekor qiladi (havola, forma)'],
        ['stopPropagation()', 'Hodisaning yuqoriga tarqalishini to‘xtatadi'],
      ]),
      '`stopPropagation` ni kamdan-kam ishlating — delegatsiyani buzadi.',
    ),
    why(
      order('q4', 'Hodisa tarqalish bosqichlarini tartiblang.', [
        'Ushlash (capture)',
        'Nishon (target)',
        'Ko‘tarilish (bubble)',
      ]),
      'Odatda ishlovchilar ko‘tarilish bosqichida ishlaydi.',
    ),
  ]),
  'dom-event-listener': lessonQuiz([
    why(
      tf(
        'q1',
        '`removeEventListener` ishlashi uchun aynan o‘sha funksiyaga havola berilishi kerak.',
        true,
      ),
      'Anonim arrow funksiyani keyin olib tashlab bo‘lmaydi.',
    ),
    why(
      codeFill(
        'q2',
        'Ishlovchi faqat bir marta ishlasin.',
        "tugma.addEventListener('click', yubor, { {{1}}: true });",
        ['once'],
      ),
      'Birinchi ishlagandan keyin avtomatik olib tashlanadi.',
    ),
    why(
      q(
        'q3',
        'Hodisalar delegatsiyasi nima?',
        [
          'Bitta ishlovchini ota elementga qo‘yib, event.target orqali bolani aniqlash',
          'Har bir elementga alohida ishlovchi qo‘yish',
          'Hodisani serverga yuborish',
          'Hodisani to‘xtatish',
        ],
        [0],
      ),
      'Keyin qo‘shilgan elementlar ham avtomatik ishlaydi.',
    ),
    why(
      codeFill(
        'q4',
        'Enter bosilganini tekshiring.',
        "input.addEventListener('keydown', (e) => {\n  if (e.{{1}} === 'Enter') yubor();\n});",
        ['key'],
      ),
      '`e.key` — bosilgan tugma nomi.',
    ),
  ]),
  'dom-navigation': lessonQuiz([
    why(
      match('q1', 'Xususiyatni nimani berishi bilan moslang.', [
        ['parentElement', 'Ota element'],
        ['children', 'Bola elementlar'],
        ['nextElementSibling', 'Keyingi qo‘shni element'],
        ['firstElementChild', 'Birinchi bola element'],
      ]),
      '“Element” so‘zi bor xususiyatlar matn tugunlarini o‘tkazib yuboradi.',
    ),
    why(
      tf(
        'q2',
        '`childNodes` faqat elementlarni, `children` esa matn tugunlarini ham o‘z ichiga oladi.',
        false,
      ),
      'Aksincha: `childNodes` matn tugunlarini (bo‘sh joylar ham) o‘z ichiga oladi, `children` — faqat elementlar.',
    ),
    why(
      q(
        'q3',
        'Akkordeonda bosilgan sarlavhadan keyingi blokni qanday olasiz?',
        [
          'sarlavha.nextElementSibling',
          'sarlavha.parentElement',
          'sarlavha.firstChild',
          'document.next()',
        ],
        [0],
      ),
      'Sarlavha va mazmun yonma-yon joylashgan.',
    ),
    why(
      q(
        'q4',
        'DOM bo‘ylab harakatlanishda eng foydali metod qaysi deb ta’kidlangan?',
        ['closest', 'children', 'childNodes', 'lastChild'],
        [0],
      ),
      'Tuzilma o‘zgarsa ham `closest` mo‘rt bo‘lmaydi.',
    ),
  ]),
  'dom-nodes': lessonQuiz([
    why(
      order('q1', 'Yangi elementni sahifaga qo‘shish qadamlarini tartiblang.', [
        "document.createElement('li')",
        'li.textContent = matn',
        'royxat.append(li)',
      ]),
      'Avval yaratiladi, to‘ldiriladi, keyin joylanadi.',
    ),
    why(
      match('q2', 'Metodni vazifasi bilan moslang.', [
        ['append', 'Oxiriga qo‘shadi'],
        ['prepend', 'Boshiga qo‘shadi'],
        ['remove', 'Elementni o‘chiradi'],
        ['replaceWith', 'Element o‘rniga boshqasini qo‘yadi'],
      ]),
      '`before` va `after` — elementning oldi/orqasiga.',
    ),
    why(
      q(
        'q3',
        'Elementni ichidagi bolalari bilan nusxalash?',
        ['el.cloneNode(true)', 'el.cloneNode()', 'el.copy()', 'Object.assign({}, el)'],
        [0],
      ),
      '`true` — chuqur nusxa.',
    ),
    why(
      tf(
        'q4',
        'Ko‘p elementni avval `DocumentFragment` ga yig‘ib, bir marta qo‘shish sahifani kamroq qayta chizdiradi.',
        true,
      ),
      '`<template>` ham tayyor HTML bo‘lagini nusxalashda qulay.',
    ),
  ]),

  // ---- 17. Brauzer va Web API --------------------------------------------------------
  'bom-window': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Ekran 768px dan kengligini tekshiring.',
        "if (window.{{1}}('(min-width: 768px)').matches) { … }",
        ['matchMedia'],
      ),
      'CSS media so‘rovlari JavaScript’da ham ishlaydi.',
    ),
    why(
      match('q2', 'Kodni vazifasi bilan moslang.', [
        ['window.innerWidth', 'Oyna kengligi'],
        ["window.addEventListener('resize', f)", 'O‘lcham o‘zgarganda'],
        ["window.scrollTo({ top: 0, behavior: 'smooth' })", 'Sahifa boshiga silliq'],
        ["confirm('O‘chirilsinmi?')", 'Ha/Yo‘q dialog oynasi'],
      ]),
      '`window` — brauzer oynasining o‘zi; global obyekt.',
    ),
    why(
      tf(
        'q3',
        '`let` bilan e’lon qilingan global o‘zgaruvchi `window` ning xususiyatiga aylanadi.',
        false,
      ),
      'Faqat `var` va funksiya e’lonlari `window` ga qo‘shiladi.',
    ),
    why(
      q(
        'q4',
        '`confirm()` nima qaytaradi?',
        ['true yoki false', 'Kiritilgan matn', 'undefined', 'Promise'],
        [0],
      ),
      '`prompt()` esa kiritilgan matnni (yoki null) qaytaradi.',
    ),
  ]),
  'bom-location': lessonQuiz([
    why(
      match('q1', '`https://site.uz/kurs?dars=3#mashq` uchun xususiyatni qiymati bilan moslang.', [
        ['location.pathname', '/kurs'],
        ['location.search', '?dars=3'],
        ['location.hash', '#mashq'],
      ]),
      '`location.href` — to‘liq manzil.',
    ),
    why(
      codeFill(
        'q2',
        '`dars` parametrini o‘qing.',
        "const p = new URLSearchParams(location.search);\nconst dars = p.{{1}}('dars');",
        ['get'],
      ),
      'Natija satr yoki `null`.',
    ),
    why(
      q(
        'q3',
        'Brauzerdagi “Orqaga” tugmasi bilan bir xil ishni qaysi kod qiladi?',
        ['history.back()', 'location.reload()', 'history.pushState()', 'window.close()'],
        [0],
      ),
      '`pushState` sahifani yangilamasdan manzilni o‘zgartiradi.',
    ),
    why(
      q(
        'q4',
        'Foydalanuvchi brauzerining tilini qayerdan bilish mumkin?',
        ['navigator.language', 'location.language', 'document.lang', 'window.locale'],
        [0],
      ),
      '`navigator.onLine` esa internet borligini bildiradi.',
    ),
  ]),
  cookies: lessonQuiz([
    why(
      tf('q1', '`HttpOnly` cookie’ni `document.cookie` orqali JavaScript o‘qiy olmaydi.', true),
      'Sessiya cookie’lari shu sababli HttpOnly bo‘ladi — XSS ularni o‘g‘irlay olmaydi.',
    ),
    why(
      sortInto('q2', 'Qayerda saqlash qulay?', {
        Cookie: ['Har so‘rovda serverga borishi kerak bo‘lgan sessiya belgisi'],
        localStorage: ['Tanlangan til', 'Tungi rejim', 'Forma qoralamasi'],
      }),
      'Cookie har so‘rov bilan yuboriladi va hajmi ~4 KB.',
    ),
    why(
      codeFill('q3', 'Cookie’ni o‘chiring.', "document.cookie = 'til=; {{1}}=0; path=/';", [
        'max-age',
      ]),
      'Muddat 0 (yoki o‘tgan sana) bo‘lsa, brauzer cookie’ni o‘chiradi.',
    ),
    why(
      q(
        'q4',
        '`document.cookie` o‘qilganda qanday ko‘rinishda bo‘ladi?',
        ["Bitta satr: 'til=uz; rejim=dark'", 'Obyekt', 'Massiv', 'JSON'],
        [0],
      ),
      'Kerakli qiymatni `; ` bo‘yicha bo‘lib topasiz.',
    ),
  ]),
  'web-storage': lessonQuiz([
    why(
      match('q1', 'Metodni vazifasi bilan moslang.', [
        ['setItem(k, v)', 'Yozish'],
        ['getItem(k)', 'O‘qish (yo‘q bo‘lsa null)'],
        ['removeItem(k)', 'Bittasini o‘chirish'],
        ['clear()', 'Hammasini o‘chirish'],
      ]),
      '`sessionStorage` ham xuddi shu metodlarga ega.',
    ),
    why(
      q(
        'q2',
        "Natija?\n\n```js\nlocalStorage.setItem('son', 5);\nconsole.log(typeof localStorage.getItem('son'));\n```",
        ["'string'", "'number'", "'object'", "'undefined'"],
        [0],
      ),
      'Ombor faqat satr saqlaydi; obyektlar uchun `JSON.stringify` / `JSON.parse`.',
    ),
    why(
      tf(
        'q3',
        '`localStorage` ba’zi muhitlarda (masalan, maxfiy rejim yoki sandbox) ishlamasligi mumkin, shuning uchun `try...catch` foydali.',
        true,
      ),
      'Ombor xato bersa ham sahifa ishlashi kerak.',
    ),
    why(
      q(
        'q4',
        'Boshqa tabda `localStorage` o‘zgarganini qaysi hodisa bildiradi?',
        ['storage', 'change', 'update', 'message'],
        [0],
      ),
      "`window.addEventListener('storage', …)` — sozlamalarni tablar orasida sinxronlash.",
    ),
  ]),

  // ---- 18. Amaliy loyihalar ----------------------------------------------------------
  'project-todo': lessonQuiz([
    why(
      order('q1', 'Vazifa qo‘shilganda nima bo‘lishini tartiblang.', [
        'Holat massiviga yangi obyekt qo‘shiladi',
        'Holat localStorage’ga saqlanadi',
        'Ro‘yxat holatdan qayta chiziladi',
      ]),
      'Arxitektura: holat → chizish. DOM — holatning aksi.',
    ),
    why(
      q(
        'q2',
        'Har bir vazifadagi “O‘chirish” tugmasi uchun eng qulay yondashuv?',
        [
          'Ro‘yxatga bitta ishlovchi (delegatsiya) va closest',
          'Har tugmaga alohida ishlovchi',
          'Har 1 soniyada tekshirish',
          'onclick atributi bilan',
        ],
        [0],
      ),
      'Keyin qo‘shilgan vazifalar ham avtomatik ishlaydi.',
    ),
    why(
      codeFill(
        'q3',
        'Faqat bajarilmaganlarni filtrlang.',
        'const qolgan = vazifalar.{{1}}((v) => !v.bajarildi);',
        ['filter'],
      ),
      '`filter` yangi massiv qaytaradi, holat o‘zgarmaydi.',
    ),
    why(
      tf('q4', 'Vazifa matnini sahifaga `innerHTML` bilan chiqarish xavfsiz.', false),
      'Foydalanuvchi matni — `textContent` bilan.',
    ),
  ]),
  'project-calculator': lessonQuiz([
    why(
      q(
        'q1',
        'Nega kalkulyatorda `eval` ishlatilmaydi?',
        [
          'U istalgan JavaScript kodini bajaradi — xavfli va nazoratsiz',
          'U juda sekin',
          'U faqat butun sonlar bilan ishlaydi',
          'U brauzerda yo‘q',
        ],
        [0],
      ),
      'Amallar aniq mantiq (holat va operator) bilan hisoblanadi.',
    ),
    why(
      q(
        'q2',
        '0.1 + 0.2 natijasini kalkulyatorda chiroyli ko‘rsatish uchun nima qulay?',
        [
          'Natijani yaxlitlab formatlash (masalan, toFixed / Number)',
          'eval ishlatish',
          'Natijani satrga ulash',
          'Hech narsa',
        ],
        [0],
      ),
      'Aks holda 0.30000000000000004 chiqadi.',
    ),
    why(
      sortInto('q3', 'Kalkulyator holatida saqlanadigan qiymatlar?', {
        Holatda: ['Joriy kiritilayotgan son', 'Oldingi son', 'Tanlangan operator'],
        'Holatda emas': ['Tugmalarning rangi'],
      }),
      'Ko‘rinish CSS’da, holat — JS obyektida.',
    ),
    why(
      tf('q4', 'Nolga bo‘lish holati sinash ro‘yxatida bo‘lishi kerak.', true),
      'Chegaraviy holatlarni oldindan sinang.',
    ),
  ]),
  'project-quiz': lessonQuiz([
    why(
      sortInto('q1', 'Test ilovasida nima qayerda saqlanadi?', {
        'Ma’lumot': ['Savollar va variantlar massivi'],
        Holat: ['Joriy savol indeksi', 'To‘g‘ri javoblar soni'],
      }),
      'Ma’lumot o‘zgarmaydi, holat esa javob berilgan sari o‘zgaradi.',
    ),
    why(
      order('q2', 'Bitta savol sikli tartibini joylang.', [
        'Savolni chizish',
        'Javobni qabul qilish va tekshirish',
        'Hisobni yangilash',
        'Keyingi savolga o‘tish yoki natijani ko‘rsatish',
      ]),
      'Har bosqich alohida funksiya bo‘lsa, kod tushunarli bo‘ladi.',
    ),
    why(
      q(
        'q3',
        'Natija o‘zgarganda ekran o‘qiydigan dastur xabardor bo‘lishi uchun nima qo‘shiladi?',
        ['aria-live="polite"', 'tabindex="-1" hamma joyga', 'title', 'alt'],
        [0],
      ),
      'Variantlar tugma yoki radio bo‘lsa, klaviatura bilan ham ishlaydi.',
    ),
    why(
      tf('q4', 'To‘g‘ri javoblarni brauzer kodida saqlash haqiqiy imtihon uchun xavfsiz.', false),
      'Kodni istalgan foydalanuvchi ko‘ra oladi — rasmiy baholash serverda bo‘lishi kerak (bu platformadagi testlar kabi).',
    ),
  ]),
};
