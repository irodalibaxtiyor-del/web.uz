import {
  codeFill,
  fill,
  match,
  miniQuiz,
  order,
  q,
  sortInto,
  tf,
  why,
  type QuizDef,
} from '../helpers';

/** Exercise mini-tests of the JavaScript course: three self-check questions per exercise. */
export const JS_MINI_QUIZZES: Record<string, QuizDef> = {
  intro: miniQuiz([
    why(
      codeFill(
        'q1',
        'Tugma bosilganda ishlasin.',
        "document.getElementById('salom').addEventListener('{{1}}', () => { … });",
        ['click'],
      ),
      'Bosish hodisasi — `click`.',
    ),
    why(
      codeFill(
        'q2',
        'Matnni o‘zgartiring.',
        "document.getElementById('xabar').{{1}} = 'Salom, JavaScript!';",
        ['textContent'],
      ),
      'Element matni yangilanadi.',
    ),
    why(
      q(
        'q3',
        'Fon rangini JS bilan o‘zgartirish?',
        [
          "el.style.backgroundColor = 'gold'",
          "el.background = 'gold'",
          "el.style['background color'] = 'gold'",
          "el.color = 'gold'",
        ],
        [0],
      ),
      'CSS nomi camelCase bo‘ladi.',
    ),
  ]),
  'where-to': miniQuiz([
    why(
      codeFill('q1', 'Tashqi faylni ulang.', '<script {{1}}="script.js"></script>', ['src']),
      'Kod alohida faylga ko‘chiriladi.',
    ),
    why(
      q(
        'q2',
        '`<head>` dagi skript nega xato beradi?',
        [
          'Elementlar hali yaratilmagan — getElementById null qaytaradi',
          'Skript ruxsatsiz',
          'Fayl yo‘q',
          'Sintaksis xatosi',
        ],
        [0],
      ),
      'Brauzer yuqoridan pastga o‘qiydi.',
    ),
    why(
      tf('q3', '`defer` bilan skript HTML to‘liq o‘qilgandan keyin bajariladi.', true),
      '`<head>` da ham xavfsiz.',
    ),
  ]),
  output: miniQuiz([
    why(
      fill('q1', 'Natijani yozing.', '125 + 375 = {{1}}', ['500']),
      'Hisobni JavaScript bajaradi.',
    ),
    why(
      match('q2', 'Usulni natija joyi bilan moslang.', [
        ['innerHTML', 'HTML sifatida (teglar ishlaydi)'],
        ['textContent', 'Oddiy matn'],
        ['console.log', 'Konsol'],
      ]),
      'Begona matn uchun `textContent`.',
    ),
    why(
      tf('q3', '`document.write` ni sahifa yuklangandan keyin chaqirish xavfsiz.', false),
      'U butun sahifani o‘chiradi.',
    ),
  ]),
  statements: miniQuiz([
    why(
      codeFill(
        'q1',
        'Jamini hisoblang.',
        'const narx = 12000;\nconst soni = 3;\nconst jami = narx {{1}} soni;',
        ['*'],
      ),
      'Ko‘paytirish — `*`.',
    ),
    why(fill('q2', 'Natijani yozing.', '12000 * 3 = {{1}}', ['36000']), 'Jami narx: 12000 × 3.'),
    why(
      tf('q3', 'Har bir buyruqni `;` bilan tugatish yaxshi odat.', true),
      'Kutilmagan birlashishlardan saqlaydi.',
    ),
  ]),
  syntax: miniQuiz([
    why(
      sortInto('q1', 'Qaysi qatorlar xato?', {
        Xato: ["let ism = 'Ali;", 'console.log("Salom\')', 'let 2son = 5;'],
        "To'g'ri": ["let ism = 'Ali';"],
      }),
      'Tirnoqlar mos yopilsin; nom raqam bilan boshlanmaydi.',
    ),
    why(
      q(
        'q2',
        'Sintaksis xatosini qayerda ko‘rasiz?',
        ['Konsolda (qator raqami bilan)', 'Sahifa sarlavhasida', 'Network’da', 'Hech qayerda'],
        [0],
      ),
      'Konsol xabarini o‘qish — birinchi qadam.',
    ),
    why(tf('q3', '`Ism` va `ism` — bitta o‘zgaruvchi.', false), 'JavaScript registrga sezgir.'),
  ]),
  comments: miniQuiz([
    why(
      codeFill('q1', 'Qatorni izohga aylantiring.', "{{1}} rang = 'ko‘k';", ['//']),
      'Bir qatorli izoh.',
    ),
    why(
      q('q2', 'Ko‘p qatorli izoh?', ['/* … */', '<!-- … -->', '# …', "'' … ''"], [0]),
      'JS’da `/* */` va `//`.',
    ),
    why(
      tf('q3', 'Xato beradigan qatorni izohga olsa, keyingi kod ishlay boshlaydi.', true),
      'Xato skriptni to‘xtatgan edi.',
    ),
  ]),
  variables: miniQuiz([
    why(
      codeFill(
        'q1',
        'Satrlarni ulang.',
        "const kurs = 'JavaScript';\nconst modullar = 18;\nmatn = kurs + ' kursi: ' {{1}} modullar + ' modul';",
        ['+'],
      ),
      '`+` matnlarni ulaydi.',
    ),
    why(
      fill('q2', 'Natijani yozing.', "'JavaScript kursi: ' + 18 + ' modul' = {{1}}", [
        ['JavaScript kursi: 18 modul', "'JavaScript kursi: 18 modul'"],
      ]),
      'Son matnga aylanib ulanadi.',
    ),
    why(
      q(
        'q3',
        'O‘zgaruvchi qiymati keyin o‘zgarsa qaysi kalit so‘z?',
        ['let', 'const', 'var har doim', 'static'],
        [0],
      ),
      'O‘zgarmasa — `const`.',
    ),
  ]),
  let: miniQuiz([
    why(
      q(
        'q1',
        'Hisoblagich `son` qayerda e’lon qilinadi?',
        ['Funksiyalardan tashqarida', 'Har funksiya ichida', 'HTML’da', 'Konsolda'],
        [0],
      ),
      'Aks holda har bosishda qayta 0 bo‘ladi.',
    ),
    why(
      codeFill('q2', 'Bittaga kamaytiring.', 'son{{1}};', ['--']),
      '`son = son - 1` ning qisqasi.',
    ),
    why(
      tf('q3', 'Funksiya ichida `let son = 0` yozilsa, tashqi `son` o‘zgarmaydi.', true),
      'Yangi mahalliy o‘zgaruvchi yaratiladi.',
    ),
  ]),
  const: miniQuiz([
    why(
      tf('q1', '`const NARX = 30000; NARX = 35000;` xatosiz ishlaydi.', false),
      'TypeError: konstantaga qayta qiymat berib bo‘lmaydi.',
    ),
    why(
      codeFill('q2', 'Yangi konstanta.', 'const yangiNarx = NARX {{1}} 5000;', ['+']),
      'Eski konstanta o‘zgarmaydi.',
    ),
    why(
      q(
        'q3',
        'O‘zgarmas qiymat nomi kelishuvga ko‘ra qanday yoziladi?',
        ['KATTA_HARFLAR (NARX)', 'kichik', 'camelCase har doim', '$narx'],
        [0],
      ),
      'Ma’lum doimiy qiymatlar uchun.',
    ),
  ]),
  operators: miniQuiz([
    why(
      match('q1', 'Ifodani natija bilan moslang (A = "5", B = "3").', [
        ['Number(A) + Number(B)', '8'],
        ['A + B', "'53'"],
        ['A > B', 'true'],
      ]),
      'Input qiymati matn — songa aylantiring.',
    ),
    why(
      q('q2', "`5 === '5'` natijasi?", ['false', 'true', 'undefined', 'Xato'], [0]),
      '`===` tur va qiymatni tekshiradi.',
    ),
    why(
      codeFill('q3', 'Matnni songa.', 'const a = {{1}}(inputA.value);', ['Number']),
      'Sonli yig‘indi uchun.',
    ),
  ]),
  arithmetic: miniQuiz([
    why(
      fill('q1', 'Hisoblang.', '125 daqiqa = Math.floor(125 / 60) soat {{1}} daqiqa (125 % 60)', [
        '5',
      ]),
      '2 soat 5 daqiqa.',
    ),
    why(q('q2', '`125 % 60` natijasi?', ['5', '2', '65', '2.08'], [0]), '`%` — bo‘linmadagi qoldiq.'),
    why(
      fill('q3', 'O‘rtacha.', '(4 + 5 + 3) / 3 = {{1}}', ['4']),
      'Yig‘indi bo‘linadi sonlar soniga.',
    ),
  ]),
  assignment: miniQuiz([
    why(
      codeFill('q1', 'Kirimni qo‘shing.', 'balans {{1}} Number(summa.value);', ['+=']),
      '`balans = balans + …`.',
    ),
    why(
      q(
        'q2',
        '`balans += summa.value` (summa.value = "5000") muammosi?',
        ['Satr ulanadi: "1000005000"', 'Ishlaydi', 'NaN', 'Xato'],
        [0],
      ),
      'Avval `Number(...)`.',
    ),
    why(tf('q3', '`+=` satrlarni ham oxiriga qo‘shadi.', true), 'Tarix matni shunday yig‘iladi.'),
  ]),
  'data-types': miniQuiz([
    why(
      q('q1', '`typeof null`?', ["'object'", "'null'", "'undefined'", "'number'"], [0]),
      'Tilning tarixiy xatosi.',
    ),
    why(
      q(
        'q2',
        'Qiymatsiz `let x;` uchun `typeof x`?',
        ["'undefined'", "'null'", "'object'", 'Xato'],
        [0],
      ),
      'Qiymat berilmagan.',
    ),
    why(
      match('q3', 'Qiymatni turi bilan moslang.', [
        ['42', "'number'"],
        ["'42'", "'string'"],
        ['true', "'boolean'"],
      ]),
      '`typeof` turini satr sifatida qaytaradi.',
    ),
  ]),
  functions: miniQuiz([
    why(
      codeFill('q1', 'Natijani qaytaring.', 'function celsiy(f) {\n  {{1}} (f - 32) * 5 / 9;\n}', [
        'return',
      ]),
      '`return` bo‘lmasa — undefined.',
    ),
    why(fill('q2', 'Hisoblang.', 'celsiy(212) = {{1}}', ['100']), '(212 − 32) × 5 / 9 = 100.'),
    why(q('q3', '`maydon(4, 5)` natijasi?', ['20', '9', '45', 'undefined'], [0]), 'Maydon = en × bo‘y = 4 × 5.'),
  ]),
  objects: miniQuiz([
    why(
      codeFill('q1', 'Xususiyatni o‘qing.', 'el.textContent = kurs{{1}}nom;', ['.']),
      'Nuqta yozuvi.',
    ),
    why(
      q(
        'q2',
        'Obyekt qanday yaratiladi?',
        [
          "{ nom: 'JavaScript asoslari', narx: 450000 }",
          "[nom: 'JS']",
          "(nom = 'JS')",
          "new nom('JS')",
        ],
        [0],
      ),
      'Kalit: qiymat juftliklari.',
    ),
    why(
      tf('q3', 'Obyekt xususiyatini keyin o‘zgartirish mumkin (`kurs.narx = 400000`).', true),
      'Hatto `const` obyektda ham.',
    ),
  ]),
  'object-properties': miniQuiz([
    why(
      codeFill('q1', 'So‘zlar soni.', 'const soni = Object.{{1}}(lugat).length;', ['keys']),
      'Kalitlar massivi.',
    ),
    why(
      q(
        'q2',
        'Kalit o‘zgaruvchida bo‘lsa (`soz`)?',
        ['lugat[soz]', 'lugat.soz', 'lugat(soz)', 'lugat->soz'],
        [0],
      ),
      'Kvadrat qavs.',
    ),
    why(
      q('q3', "`'anor' in lugat` (anor yo‘q)?", ['false', 'true', 'undefined', 'Xato'], [0]),
      '`in` kalit borligini tekshiradi.',
    ),
  ]),
  'object-methods': miniQuiz([
    why(
      codeFill('q1', 'Metod ichida balans.', 'kirim(summa) {\n  {{1}}.balans += summa;\n}', [
        'this',
      ]),
      '`this` — metod chaqirilgan obyekt.',
    ),
    why(
      q(
        'q2',
        'Metod qanday chaqiriladi?',
        ['hisob.kirim(5000)', 'kirim.hisob(5000)', 'hisob[kirim]', 'this.kirim'],
        [0],
      ),
      'Obyekt nuqta metod.',
    ),
    why(
      tf('q3', 'Chiqimda balans manfiy bo‘lib ketmasligini tekshirish kerak.', true),
      'Mantiqiy cheklov.',
    ),
  ]),
  events: miniQuiz([
    why(
      match('q1', 'Hodisani vaqti bilan moslang.', [
        ['input', 'Maydonga har yozilganda'],
        ['keydown', 'Tugma bosilganda'],
        ['click', 'Sichqoncha bilan bosilganda'],
      ]),
      'Mashqda uchalasi ham.',
    ),
    why(
      codeFill(
        'q2',
        'Bosilgan tugma nomi.',
        "maydon.addEventListener('keydown', (event) => {\n  nom.textContent = event.{{1}};\n});",
        ['key'],
      ),
      'Masalan, "Enter".',
    ),
    why(
      q(
        'q3',
        'Matn uzunligi?',
        ['maydon.value.length', 'maydon.length', 'maydon.size', 'maydon.count'],
        [0],
      ),
      '`value` — matn.',
    ),
  ]),
  strings: miniQuiz([
    why(
      q(
        'q1',
        'Ichida qo‘shtirnoq bor matnni qanday yozasiz?',
        [
          `'Ustoz: "Bilim — kuch" dedi.'`,
          `"Ustoz: "Bilim" dedi."`,
          `'Ustoz: 'Bilim' dedi.'`,
          `Ustoz: "Bilim"`,
        ],
        [0],
      ),
      'Tashqi va ichki tirnoq har xil.',
    ),
    why(
      codeFill('q2', 'Uzunlik.', 'uzunlik.textContent = matn.value.{{1}};', ['length']),
      'Belgilar soni.',
    ),
    why(tf('q3', "`'non'[0]` natijasi `'n'`.", true), 'Indeks 0 dan.'),
  ]),
  'string-methods': miniQuiz([
    why(
      codeFill(
        'q1',
        'Chetdagi bo‘sh joylarni olib tashlang.',
        'const ism = kirish.value.{{1}}();',
        ['trim'],
      ),
      '` aLi ` → `aLi`.',
    ),
    why(
      q(
        'q2',
        '"aLi" ni "Ali" qilish?',
        [
          's[0].toUpperCase() + s.slice(1).toLowerCase()',
          's.toUpperCase()',
          's.capitalize()',
          's.trim()',
        ],
        [0],
      ),
      'Birinchi harf katta, qolgani kichik.',
    ),
    why(
      fill('q3', 'Natija.', "'vALIyev'.toLowerCase() = {{1}}", [['valiyev', "'valiyev'"]]),
      'Hammasi kichik harf.',
    ),
  ]),
  'string-search': miniQuiz([
    why(
      codeFill('q1', 'Email nomi (`@` gacha).', "const nom = email.slice(0, email.{{1}}('@'));", [
        'indexOf',
      ]),
      '`@` ning o‘rni.',
    ),
    why(
      codeFill('q2', '.uz bilan tugaydimi?', "const uzmi = email.{{1}}('.uz');", ['endsWith']),
      '`true` yoki `false`.',
    ),
    why(q('q3', "`'ali@mail.uz'.indexOf('@')`?", ['3', '4', '2', '-1'], [0]), 'a0 l1 i2 @3.'),
  ]),
  'string-templates': miniQuiz([
    why(
      codeFill(
        'q1',
        'Shablon satr.',
        'chek.textContent = `${mahsulot} × ${soni} = {{1}}narx * soni} so‘m`;',
        ['${'],
      ),
      'Ifoda `${ }` ichida.',
    ),
    why(
      q(
        'q2',
        'Shablon satr qaysi tirnoqda yoziladi?',
        ['` (backtick)', "' (bittalik)", '" (qo‘shtirnoq)', '« »'],
        [0],
      ),
      'Faqat backtick ichida `${}` ishlaydi.',
    ),
    why(
      fill('q3', 'Natija.', '`Non × ${3} = ${4000 * 3} so‘m` = Non × 3 = {{1}} so‘m', ['12000']),
      'Ifoda hisoblanadi.',
    ),
  ]),
  numbers: miniQuiz([
    why(tf('q1', '`0.1 + 0.2` aniq `0.3` chiqadi.', false), '0.30000000000000004.'),
    why(
      fill('q2', 'Natija.', '(0.1 * 10 + 0.2 * 10) / 10 = {{1}}', ['0.3']),
      'Butun sonlar orqali hisoblash.',
    ),
    why(q('q3', "`Number('abc')`?", ['NaN', '0', 'undefined', "'abc'"], [0]), 'NaN — “son emas” degan qiymat.'),
  ]),
  'number-methods': miniQuiz([
    why(
      codeFill('q1', 'Ikki xona aniqlikda.', 'return (dollar * KURS).{{1}}(2);', ['toFixed']),
      'Natija — matn.',
    ),
    why(
      q('q2', "`parseFloat('12.5 dollar')`?", ['12.5', 'NaN', '12', "'12.5'"], [0]),
      'Boshidagi son o‘qiladi.',
    ),
    why(
      tf('q3', '`toFixed` son emas, satr qaytaradi.', true),
      'Hisobni davom ettirish uchun `Number()`.',
    ),
  ]),
  math: miniQuiz([
    why(codeFill('q1', 'Doira maydoni.', 'const s = Math.{{1}} * r * r;', ['PI']), 'Doira maydoni: π × r².'),
    why(
      q(
        'q2',
        '45 kishi, avtobusga 20 kishi: nechta avtobus?',
        [
          'Math.ceil(45 / 20) = 3',
          'Math.floor(45 / 20) = 2',
          'Math.round(45 / 20) = 2',
          '45 % 20 = 5',
        ],
        [0],
      ),
      'Ortiqcha yo‘lovchi uchun yana bitta.',
    ),
    why(fill('q3', 'Natija.', 'Math.ceil(2.1) = {{1}}', ['3']), 'Yuqoriga yaxlitlash.'),
  ]),
  random: miniQuiz([
    why(
      codeFill(
        'q1',
        'min va max kiradigan butun son.',
        'return Math.floor(Math.random() * (max - min {{1}} 1)) + min;',
        ['+'],
      ),
      'Oraliq uzunligi max − min + 1.',
    ),
    why(
      q(
        'q2',
        '`Math.random()` qanday oraliqda?',
        ['0 (kiradi) dan 1 gacha (kirmaydi)', '1 dan 6 gacha', '0 dan 100 gacha', '−1 dan 1 gacha'],
        [0],
      ),
      'Natija — 0 dan 1 gacha kasr son.',
    ),
    why(
      q(
        'q3',
        'Zar uchun chaqiruv?',
        ['tasodifiy(1, 6)', 'tasodifiy(0, 6)', 'tasodifiy(1, 7)', 'Math.random(6)'],
        [0],
      ),
      'Ikkala chegara kiradi.',
    ),
  ]),
  arrays: miniQuiz([
    why(
      codeFill('q1', 'Elementlarni ulang.', "ruyxat.textContent = xaridlar.{{1}}(', ');", ['join']),
      'Massiv → matn.',
    ),
    why(
      q(
        'q2',
        'Oxirgi element?',
        [
          'xaridlar[xaridlar.length - 1]',
          'xaridlar[xaridlar.length]',
          'xaridlar.last',
          'xaridlar[-1]',
        ],
        [0],
      ),
      'Yoki `xaridlar.at(-1)`.',
    ),
    why(
      fill('q3', 'Uzunlik.', "['non', 'sut', 'tuxum'].length = {{1}}", ['3']),
      'Elementlar soni.',
    ),
  ]),
  'array-methods': miniQuiz([
    why(
      match('q1', 'Amalni metod bilan moslang.', [
        ['Oxiriga qo‘shish', 'push'],
        ['Boshiga qo‘shish', 'unshift'],
        ['Boshidan olish (navbatdagi)', 'shift'],
      ]),
      'Navbat: boshidan olinadi.',
    ),
    why(
      codeFill('q2', 'Navbatni ko‘rsating.', "el.textContent = navbat.join(' {{1}} ');", ['→']),
      'Ajratuvchi ` → `.',
    ),
    why(tf('q3', '`shift` bo‘sh massivda `undefined` qaytaradi.', true), 'Xato bermaydi.'),
  ]),
  'array-search': miniQuiz([
    why(
      codeFill('q1', 'Ism bo‘yicha toping.', 'const t = talabalar.{{1}}((x) => x.ism === ism);', [
        'find',
      ]),
      'Birinchi mos element.',
    ),
    why(
      q('q2', 'Topilmasa `find` nima qaytaradi?', ['undefined', 'null', '-1', 'false'], [0]),
      'Shuning uchun “Topilmadi” tekshiruvi.',
    ),
    why(
      q(
        'q3',
        'Kamida bitta talaba 90 dan yuqorimi?',
        [
          'talabalar.some((x) => x.ball > 90)',
          'talabalar.every(...)',
          'talabalar.find(90)',
          'talabalar.includes(90)',
        ],
        [0],
      ),
      '`every` — hammasi.',
    ),
  ]),
  'array-sort': miniQuiz([
    why(
      q(
        'q1',
        "`['10', '9', '1'].sort()` natijasi?",
        ["['1', '10', '9']", "['1', '9', '10']", "['10', '9', '1']", "['9', '10', '1']"],
        [0],
      ),
      'Matn sifatida solishtiriladi.',
    ),
    why(
      codeFill('q2', 'Sonli saralash.', 'sonlar.sort((a, b) => a {{1}} b);', ['-']),
      'O‘sish tartibi.',
    ),
    why(
      tf(
        'q3',
        "`split(' ')` dan keyin elementlar hali satr — `Number` ga aylantirish kerak.",
        true,
      ),
      'Aks holda solishtirish matn bo‘yicha.',
    ),
  ]),
  'array-iteration': miniQuiz([
    why(
      codeFill('q1', 'O‘tganlar.', 'const otganlar = talabalar.{{1}}((t) => t.ball >= 60);', [
        'filter',
      ]),
      'Shartga mos elementlar.',
    ),
    why(
      match('q2', 'Vazifani metod bilan moslang.', [
        ['Ismlar ro‘yxati', 'map'],
        ['Ballar yig‘indisi', 'reduce'],
        ['Shartli tanlash', 'filter'],
      ]),
      'Massiv ustida aylanish metodlari.',
    ),
    why(
      fill('q3', 'Natija.', '[60, 80, 70].reduce((s, x) => s + x, 0) = {{1}}', ['210']),
      'Boshlang‘ich 0.',
    ),
  ]),
  dates: miniQuiz([
    why(
      codeFill('q1', '2026-yil 1-sentabr.', 'const boshlanish = new Date(2026, {{1}}, 1);', ['8']),
      'Oylar 0 dan: sentabr — 8.',
    ),
    why(
      q('q2', 'Ikki sana farqi qaysi birlikda?', ['Millisoniya', 'Kun', 'Soniya', 'Daqiqa'], [0]),
      'Kunga: ÷ 86 400 000.',
    ),
    why(
      tf('q3', '`toDateString()` sanani o‘qiladigan matnga aylantiradi.', true),
      'Masalan, "Tue Sep 01 2026".',
    ),
  ]),
  'date-formats': miniQuiz([
    why(
      q(
        'q1',
        "`'2026-03-08'.split('-')` natijasi?",
        ["['2026', '03', '08']", '[2026, 3, 8]', "['08', '03', '2026']", "'2026 03 08'"],
        [0],
      ),
      'Satrlar massivi.',
    ),
    why(
      codeFill(
        'q2',
        'KK.OO.YYYY formati.',
        "const [y, o, k] = sana.split('-');\nnatija = `${k}.${o}.${{{1}}}`;",
        ['y'],
      ),
      '08.03.2026.',
    ),
    why(
      tf('q3', 'Oy nomini massivdan olishda `Number(o) - 1` indeks ishlatiladi.', true),
      '03 → mart → indeks 2.',
    ),
  ]),
  'date-get': miniQuiz([
    why(
      codeFill('q1', 'Hafta kuni nomi.', 'kun.textContent = HAFTA[sana.{{1}}()];', ['getDay']),
      '0 — yakshanba.',
    ),
    why(
      q(
        'q2',
        '`HAFTA` massivi qaysi kundan boshlanadi?',
        ['Yakshanba', 'Dushanba', 'Shanba', 'Farqi yo‘q'],
        [0],
      ),
      '`getDay()` 0 = yakshanba.',
    ),
    why(
      tf(
        'q3',
        'Yoshni hisoblashda tug‘ilgan kun shu yil hali kelmagan bo‘lsa, bittaga kamaytiriladi.',
        true,
      ),
      'Faqat yillar ayirmasi yetarli emas.',
    ),
  ]),
  'date-set': miniQuiz([
    why(
      codeFill(
        'q1',
        'Nusxaga kun qo‘shing.',
        'const d = new Date(sana);\nd.setDate(d.{{1}}() + n);',
        ['getDate'],
      ),
      'Asl sana o‘zgarmaydi.',
    ),
    why(
      tf('q2', '`setDate` oy oxiridan oshsa, keyingi oyga o‘tadi.', true),
      'Oshib ketgan qiymat avtomatik.',
    ),
    why(
      q(
        'q3',
        'Nega nusxa olinadi?',
        [
          'setDate asl sanani o‘zgartiradi',
          'Tezroq ishlaydi',
          'Shart emas',
          'Xato chiqmasligi uchun',
        ],
        [0],
      ),
      'Date obyekti o‘zgaruvchan.',
    ),
  ]),
  booleans: miniQuiz([
    why(
      match('q1', 'Natijani moslang.', [
        ["Boolean('0')", 'true'],
        ["Boolean('')", 'false'],
        ["Boolean(Number('0'))", 'false'],
      ]),
      'Matn "0" — truthy, son 0 — falsy.',
    ),
    why(tf('q2', "`Boolean('false')` natijasi `false`.", false), 'Bo‘sh bo‘lmagan satr — truthy.'),
    why(
      q('q3', "`Boolean(Number('abc'))`?", ['false', 'true', 'NaN', 'Xato'], [0]),
      'NaN — falsy.',
    ),
  ]),
  comparisons: miniQuiz([
    why(
      codeFill('q1', 'Ikki shart birga.', "const ruxsat = yosh >= 18 {{1}} parol === 'Web2026';", [
        '&&',
      ]),
      'Ikkalasi ham bajarilishi kerak.',
    ),
    why(
      q(
        'q2',
        'Ternar: yosh < 7 bo‘lsa “bola”, aks holda “katta”.',
        [
          "yosh < 7 ? 'bola' : 'katta'",
          "yosh < 7 : 'bola' ? 'katta'",
          "if yosh < 7 'bola'",
          "yosh ? 'bola'",
        ],
        [0],
      ),
      '`shart ? ha : yo‘q`.',
    ),
    why(
      tf('q3', 'Parolni `==` emas, `===` bilan solishtirish kerak.', true),
      'Turni ham tekshiradi.',
    ),
  ]),
  'if-else': miniQuiz([
    why(
      q(
        'q1',
        'Shartlar qaysi tartibda yoziladi?',
        ['Eng kattasidan (86 dan) pastga', 'Eng kichigidan', 'Tasodifiy', 'Farqi yo‘q'],
        [0],
      ),
      'Birinchi to‘g‘ri shart bajariladi.',
    ),
    why(
      fill('q2', 'baho(86) natijasi qaysi qatordan?', '86 — {{1}}–100 oralig‘i', ['86']),
      'Chegaraviy qiymat.',
    ),
    why(
      tf('q3', 'Ball 0 dan kichik yoki 100 dan katta bo‘lsa, avval xato qaytarish yaxshi.', true),
      'Erta qaytish.',
    ),
  ]),
  switch: miniQuiz([
    why(
      codeFill(
        'q1',
        'Har holatdan keyin chiqing.',
        "switch (amal) {\n  case '+':\n    return a + b;\n  case '-':\n    {{1}} a - b;\n}",
        ['return'],
      ),
      '`return` yoki `break`.',
    ),
    why(
      q('q2', 'Noma’lum amal uchun?', ['default', 'else', 'case *', 'otherwise'], [0]),
      '`default` — boshqa hollar.',
    ),
    why(
      tf('q3', '`/` da `b` nol bo‘lsa, alohida xabar qaytarish kerak.', true),
      'Aks holda Infinity.',
    ),
  ]),
  'loop-for': miniQuiz([
    why(
      codeFill('q1', '1 dan 10 gacha.', 'for (let i = 1; i {{1}} 10; i++) { … }', ['<=']),
      '10 ham kiradi.',
    ),
    why(fill('q2', 'Natija.', '1 dan 100 gacha yig‘indi = {{1}}', ['5050']), 'Formula: n(n+1)/2 = 100 × 101 / 2.'),
    why(
      codeFill('q3', '`<li>` yarating.', "const li = document.{{1}}('li');", ['createElement']),
      'Keyin `append`.',
    ),
  ]),
  'loop-for-in': miniQuiz([
    why(
      codeFill('q1', 'Kalitlar bo‘ylab.', 'for (const nom {{1}} narxlar) { … }', ['in']),
      '`in` — kalitlar.',
    ),
    why(
      q(
        'q2',
        'Sikl ichida narx?',
        ['narxlar[nom]', 'narxlar.nom', 'nom.narx', 'narxlar(nom)'],
        [0],
      ),
      'Kalit o‘zgaruvchida — kvadrat qavs.',
    ),
    why(tf('q3', '`for...in` dagi kalit doim satr.', true), 'Raqamli kalit ham satr bo‘ladi.'),
  ]),
  'loop-for-of': miniQuiz([
    why(
      codeFill('q1', 'Harflar bo‘ylab.', 'for (const h {{1}} matn) { … }', ['of']),
      '`of` — qiymatlar.',
    ),
    why(
      q(
        'q2',
        'Unlini katta-kichik farqsiz tekshirish?',
        [
          "'aeiou'.includes(h.toLowerCase())",
          "h === 'aeiou'",
          "'aeiou'.indexOf(h) > 1",
          'h.isVowel()',
        ],
        [0],
      ),
      'Avval kichik harfga.',
    ),
    why(
      codeFill('q3', 'Teskari matn.', 'teskari = h {{1}} teskari;', ['+']),
      'Har harf boshiga qo‘shiladi.',
    ),
  ]),
  'loop-while': miniQuiz([
    why(
      codeFill(
        'q1',
        'Maqsadga yetguncha.',
        'while (summa {{1}} maqsad) {\n  summa += summa * foiz / 100;\n  yillar++;\n}',
        ['<'],
      ),
      'Shart bajarilguncha aylanadi.',
    ),
    why(
      tf('q2', 'Foiz 0 bo‘lsa, bu sikl cheksiz aylanadi.', true),
      'Summa o‘smaydi — himoya kerak.',
    ),
    why(
      q(
        'q3',
        'Raqamlarni ajratishda oxirgi raqam?',
        ['son % 10', 'son / 10', 'son - 10', 'Math.round(son)'],
        [0],
      ),
      'Keyin `Math.floor(son / 10)`.',
    ),
  ]),
  'break-continue': miniQuiz([
    why(
      codeFill('q1', 'Manfiylarni o‘tkazib yuboring.', 'if (son < 0) {{1}};', ['continue']),
      'Joriy aylanish o‘tkaziladi.',
    ),
    why(
      q(
        'q2',
        '0 uchrasa siklni to‘xtatish?',
        ['break', 'continue', 'return har doim', 'stop'],
        [0],
      ),
      '`break` — butunlay chiqadi.',
    ),
    why(
      fill('q3', 'Natija.', "'3 -2 5 0 7' — musbat sonlar yig‘indisi (0 da to‘xtab) = {{1}}", [
        '8',
      ]),
      '3 + 5, 0 da to‘xtaydi.',
    ),
  ]),
  iterables: miniQuiz([
    why(
      codeFill('q1', 'Indeks va qiymat.', 'for (const [i, soz] of sozlar.{{1}}()) { … }', [
        'entries',
      ]),
      '`[indeks, qiymat]` juftliklari.',
    ),
    why(
      q(
        'q2',
        '`entries()` indeksi 0 dan boshlanadi. “1. olma” uchun?',
        ['i + 1', 'i', 'i - 1', 'i * 1'],
        [0],
      ),
      'Raqamlash 1 dan.',
    ),
    why(
      tf('q3', 'Satr, massiv, Set va Map — iteratsiya qilinadi (`for...of`).', true),
      'Oddiy obyekt esa yo‘q.',
    ),
  ]),
  sets: miniQuiz([
    why(
      codeFill(
        'q1',
        'Noyob teglar.',
        'const noyob = new {{1}}(teglar.map((t) => t.trim().toLowerCase()));',
        ['Set'],
      ),
      'Takrorlanishlar o‘chadi.',
    ),
    why(
      q(
        'q2',
        'Set elementlari soni?',
        ['noyob.size', 'noyob.length', 'noyob.count', 'noyob.size()'],
        [0],
      ),
      'Xususiyat, metod emas.',
    ),
    why(
      codeFill('q3', 'Set’ni matnga.', "el.textContent = [...noyob].{{1}}(', ');", ['join']),
      'Avval massivga yoyiladi.',
    ),
  ]),
  maps: miniQuiz([
    why(
      codeFill('q1', 'Sanab boring.', 'm.set(soz, (m.{{1}}(soz) || 0) + 1);', ['get']),
      'Yo‘q bo‘lsa 0 dan.',
    ),
    why(
      q(
        'q2',
        'Matnni so‘zlarga bo‘lishda bo‘sh qismlarni olib tashlash?',
        ['.filter(Boolean)', '.trim()', '.join()', '.sort()'],
        [0],
      ),
      'Bo‘sh satr — falsy.',
    ),
    why(
      tf('q3', 'Map kalitlari qo‘shilish tartibini saqlaydi.', true),
      'Natijani shu tartibda chiqarish mumkin.',
    ),
  ]),
  typeof: miniQuiz([
    why(
      codeFill('q1', 'Massivni aniqlang.', "if (Array.{{1}}(x)) return 'array';", ['isArray']),
      '`typeof` massivga object deydi.',
    ),
    why(
      codeFill('q2', 'null ni aniqlang.', "if (x {{1}} null) return 'null';", ['===']),
      '`typeof null` — object.',
    ),
    why(
      q('q3', '`turi(() => {})`?', ["'function'", "'object'", "'arrow'", "'undefined'"], [0]),
      'Funksiyalar uchun maxsus javob.',
    ),
  ]),
  'type-conversion': miniQuiz([
    why(
      fill('q1', 'Natija.', "parseInt('12 500'.replace(/ /g, '')) = {{1}}", ['12500']),
      'Bo‘sh joylar olib tashlanadi.',
    ),
    why(fill('q2', 'QQS bilan.', '10000 * 1.12 = {{1}}', ['11200']), '12% qo‘shiladi.'),
    why(
      tf('q3', "`parseInt('12 500')` bo‘sh joyni olib tashlamasdan 12 qaytaradi.", true),
      'Bo‘sh joyda to‘xtaydi.',
    ),
  ]),
  destructuring: miniQuiz([
    why(
      codeFill('q1', 'Ism va familiya.', 'const { ism, {{1}} } = foydalanuvchi;', ['familiya']),
      'Nomlar xususiyatlarga mos.',
    ),
    why(
      q(
        'q2',
        'Ichma-ich `manzil.shahar`?',
        [
          'const { manzil: { shahar } } = foydalanuvchi;',
          'const { shahar } = foydalanuvchi;',
          'const shahar = foydalanuvchi.shahar;',
          'const [shahar] = foydalanuvchi;',
        ],
        [0],
      ),
      'Ichma-ich destrukturlash.',
    ),
    why(
      tf('q3', '`[a, b] = [b, a]` ikki qiymatni almashtiradi.', true),
      'Vaqtinchalik o‘zgaruvchisiz.',
    ),
  ]),

  regexp: miniQuiz([
    why(
      q(
        'q1',
        'Butun satr formatga mos kelishini tekshirish uchun ifoda qanday o‘raladi?',
        ['^ … $', '( … )', '[ … ]', '{ … }'],
        [0],
      ),
      '`^` — boshi, `$` — oxiri.',
    ),
    why(
      codeFill(
        'q2',
        'Moslikni tekshiring.',
        'const togri = /^\\+998 \\d{2} \\d{3} \\d{2} \\d{2}$/.{{1}}(tel);',
        ['test'],
      ),
      '`test` true/false qaytaradi.',
    ),
    why(
      match('q3', 'Belgini ma’nosi bilan moslang.', [
        ['\\d', 'Raqam'],
        ['\\s', 'Bo‘sh joy'],
        ['g bayrog‘i', 'Hamma mosliklar'],
      ]),
      'Masalan, `/\\s+/g` — barcha bo‘sh joylar.',
    ),
  ]),
  errors: miniQuiz([
    why(
      codeFill(
        'q1',
        'Son bo‘lmasa xato tashlang.',
        "if (isNaN(a)) {{1}} new TypeError('Son kiriting');",
        ['throw'],
      ),
      'Chaqiruvchi `try...catch` bilan ushlaydi.',
    ),
    why(
      q('q2', 'Ushlangan xatoning matni?', ['e.message', 'e.text', 'e.error', 'e.toString'], [0]),
      '`e.name` — xato turi.',
    ),
    why(tf('q3', '`finally` bloki xato bo‘lsa ham bajariladi.', true), 'Tozalash ishlari uchun.'),
  ]),
  scope: miniQuiz([
    why(
      q(
        'q1',
        'Funksiya ichida `let jami = …` yozilsa global `jami`ga nima bo‘ladi?',
        ['O‘zgarmaydi — yangi mahalliy o‘zgaruvchi', 'O‘zgaradi', 'Xato', 'O‘chadi'],
        [0],
      ),
      'Soyalash (shadowing).',
    ),
    why(
      tf(
        'q2',
        '`if` bloki ichida `let` bilan e’lon qilingan o‘zgaruvchi blokdan tashqarida ko‘rinmaydi.',
        true,
      ),
      'Blok doirasi.',
    ),
    why(
      q(
        'q3',
        'Global `jami` ni funksiya ichida o‘zgartirish uchun?',
        ['let siz: jami += narx', 'let jami = jami + narx', 'var jami', 'const jami'],
        [0],
      ),
      'Yangi e’lon qilinmaydi.',
    ),
  ]),
  hoisting: miniQuiz([
    why(
      tf(
        'q1',
        'Funksiya e’lonini (`function salomlash() {}`) e’londan oldin chaqirish mumkin.',
        true,
      ),
      'U to‘liq ko‘tariladi.',
    ),
    why(
      q(
        'q2',
        '`const f = () => {}` ni e’londan oldin chaqirsa?',
        ['ReferenceError', 'Ishlaydi', 'undefined qaytaradi', 'TypeError har doim'],
        [0],
      ),
      'Vaqtinchalik o‘lik zona.',
    ),
    why(
      q(
        'q3',
        'Eng xavfsiz amaliy qoida?',
        [
          'Ishlatishdan oldin e’lon qilish',
          'Hamma joyda var',
          'Funksiyalarni oxirida yozish',
          'Hech qachon const',
        ],
        [0],
      ),
      'Hoisting haqida o‘ylash shart bo‘lmaydi.',
    ),
  ]),
  'strict-mode': miniQuiz([
    why(
      codeFill('q1', 'Qat’iy rejim.', '{{1}};', [["'use strict'", '"use strict"']]),
      'Fayl boshida.',
    ),
    why(
      q(
        'q2',
        'Qat’iy rejimda e’lonsiz o‘zgaruvchiga (harf xatosi) qiymat berilsa?',
        ['ReferenceError', 'Yangi global yaratiladi', 'Hech narsa', 'undefined'],
        [0],
      ),
      'Harf xatosi darhol topiladi.',
    ),
    why(
      tf('q3', 'Oddiy rejimda bu xato jimgina yangi global o‘zgaruvchi yaratadi.', true),
      'Shuning uchun xato yashirin qoladi.',
    ),
  ]),
  this: miniQuiz([
    why(
      q(
        'q1',
        'Oddiy funksiyali hodisa ishlovchisida `this`?',
        ['Bosilgan element', 'window', 'undefined', 'document'],
        [0],
      ),
      'Shuning uchun `this.textContent`.',
    ),
    why(
      tf('q2', 'Metod ichidagi callback’da `this` yo‘qolishining yechimi — arrow funksiya.', true),
      'Arrow tashqi `this` ni oladi.',
    ),
    why(
      codeFill('q3', 'Metodni obyektga bog‘lang.', 'tugma.onclick = hamyon.korsat.{{1}}(hamyon);', [
        'bind',
      ]),
      'Yoki arrow funksiya bilan o‘rash.',
    ),
  ]),
  'arrow-functions': miniQuiz([
    why(
      codeFill('q1', 'Arzon narxlar.', 'const arzon = narxlar.filter((n) {{1}} n < 10000);', [
        '=>',
      ]),
      'Qisqa arrow callback.',
    ),
    why(
      fill('q2', 'Natija.', '[5000, 12000, 8000].filter((n) => n < 10000).length = {{1}}', ['2']),
      '5000 va 8000.',
    ),
    why(
      tf('q3', 'Bitta ifodali arrow funksiyada `return` yozilmaydi.', true),
      'Natija avtomatik qaytadi.',
    ),
  ]),
  debugging: miniQuiz([
    why(
      q(
        'q1',
        'Natija noto‘g‘ri, xato yo‘q. Birinchi qadam?',
        [
          'console.log bilan oraliq qiymatlarni ko‘rish',
          'Kodni o‘chirib qayta yozish',
          'Sahifani yangilash',
          'Kutish',
        ],
        [0],
      ),
      'Taxmin emas — dalil.',
    ),
    why(
      sortInto('q2', 'Klassik mantiq xatolari.', {
        Xato: [
          'Yig‘indi 0 o‘rniga 1 dan boshlangan',
          '< o‘rniga <=',
          "Matn qo‘shilib ketgan ('5' + 1)",
        ],
        'Xato emas': ['Izohlar ko‘pligi'],
      }),
      'Xato bermaydigan, lekin noto‘g‘ri natija.',
    ),
    why(
      codeFill('q3', 'Kodni to‘xtating.', '{{1}};', ['debugger']),
      'DevTools ochiq bo‘lsa to‘xtaydi.',
    ),
  ]),
  'style-guide': miniQuiz([
    why(
      match('q1', 'Eski yozuvni yaxshisi bilan moslang.', [
        ['var x', 'const summa'],
        ['==', '==='],
        ['0.9 (sehrli son)', 'CHEGIRMA konstantasi'],
      ]),
      'O‘qiladigan va xavfsiz kod.',
    ),
    why(
      tf('q2', 'Ma’noli nomlar (`summa`, `kod`) bir harfli nomlardan yaxshiroq.', true),
      'Kod o‘zini tushuntiradi.',
    ),
    why(
      q(
        'q3',
        'Kod uslubini avtomatik tekshiradigan vosita?',
        ['Linter (ESLint)', 'Kompilyator', 'Brauzer', 'Server'],
        [0],
      ),
      'Xatolarni ham topadi.',
    ),
  ]),
  mistakes: miniQuiz([
    why(
      q(
        'q1',
        'Noto‘g‘ri parol ham qabul qilinyapti. Ehtimoliy sabab?',
        ['if (parol = "…") — tenglash o‘rniga tayinlash', '=== ishlatilgan', 'trim', 'const'],
        [0],
      ),
      '`=` tayinlaydi, `===` solishtiradi.',
    ),
    why(tf('q2', '`return` yozilmagan funksiya `undefined` qaytaradi.', true), 'Klassik xato.'),
    why(q('q3', "`'5' + 1` natijasi?", ["'51'", '6', 'NaN', 'Xato'], [0]), 'Matn ulanadi.'),
  ]),
  classes: miniQuiz([
    why(
      codeFill(
        'q1',
        'Konstruktor.',
        'class Talaba {\n  {{1}}(ism, ball) {\n    this.ism = ism;\n    this.ball = ball;\n  }\n}',
        ['constructor'],
      ),
      'Nusxa yaratilganda chaqiriladi.',
    ),
    why(
      codeFill('q2', 'Nusxa yarating.', "const t = {{1}} Talaba('Aziza', 82);", ['new']),
      '`new` siz klass chaqirilmaydi.',
    ),
    why(
      q('q3', '`t.baho()` (ball 82)?', ["'o‘tdi'", "'o‘tmadi'", '82', 'undefined'], [0]),
      '60 va undan yuqori — o‘tdi.',
    ),
  ]),
  'class-inheritance': miniQuiz([
    why(
      codeFill('q1', 'Meros oling.', 'class JamgarmaHisob {{1}} Hisob { … }', ['extends']),
      'Ota klass metodlari meros.',
    ),
    why(
      codeFill(
        'q2',
        'Ota konstruktori.',
        'constructor(egasi, balans, foiz) {\n  {{1}}(egasi, balans);\n  this.foiz = foiz;\n}',
        ['super'],
      ),
      '`this` dan oldin.',
    ),
    why(
      tf('q3', 'JamgarmaHisob nusxasi `instanceof Hisob` uchun ham `true`.', true),
      'Bola — ota turi ham.',
    ),
  ]),
  'class-static': miniQuiz([
    why(
      codeFill(
        'q1',
        'Yopiq statik hisoblagich.',
        'class Buyurtma {\n  static {{1}}oxirgi = 0;\n}',
        ['#'],
      ),
      'Tashqaridan o‘zgartirib bo‘lmaydi.',
    ),
    why(
      q(
        'q2',
        '`static formatla()` qanday chaqiriladi?',
        ['Buyurtma.formatla(42)', 'b.formatla(42)', 'formatla(42)', 'this.formatla'],
        [0],
      ),
      'Klass orqali.',
    ),
    why(
      fill('q3', 'Natija.', "'B-' + String(42).padStart(4, '0') = {{1}}", [['B-0042', "'B-0042'"]]),
      'To‘rt xonali raqam.',
    ),
  ]),
  json: miniQuiz([
    why(
      codeFill('q1', 'Matnni obyektga.', 'const obj = JSON.{{1}}(matn);', ['parse']),
      'Teskarisi — `stringify`.',
    ),
    why(
      tf(
        'q2',
        'Noto‘g‘ri JSON `JSON.parse` da xato tashlaydi, shuning uchun `try...catch` kerak.',
        true,
      ),
      'SyntaxError.',
    ),
    why(
      q(
        'q3',
        'Qaysi JSON to‘g‘ri?',
        [
          '{"ism": "Ali", "kurslar": ["HTML", "CSS"]}',
          "{ism: 'Ali'}",
          "{'ism': 'Ali'}",
          '{"ism": "Ali",}',
        ],
        [0],
      ),
      'Kalitlar qo‘shtirnoqda, oxirgi vergul yo‘q.',
    ),
  ]),
  'object-constructors': miniQuiz([
    why(
      codeFill(
        'q1',
        'Konstruktor.',
        'function Mahsulot(nom, narx) {\n  {{1}}.nom = nom;\n  this.narx = narx;\n}',
        ['this'],
      ),
      '`new` bilan chaqiriladi.',
    ),
    why(
      match('q2', 'Yaratish usulini xususiyati bilan moslang.', [
        ['Konstruktor', 'new Mahsulot(…), this ishlatiladi'],
        ['Fabrika', 'Oddiy chaqiriladi va obyekt qaytaradi'],
      ]),
      'Ikkalasi obyekt yaratadi.',
    ),
    why(
      tf('q3', '`new Mahsulot(...) instanceof Mahsulot` — true.', true),
      'Fabrika obyektida esa false.',
    ),
  ]),
  'object-prototypes': miniQuiz([
    why(
      codeFill(
        'q1',
        'Prototipga metod.',
        'Mahsulot.{{1}}.qqsBilan = function () {\n  return Math.round(this.narx * 1.12);\n};',
        ['prototype'],
      ),
      'Barcha nusxalar uchun bitta metod.',
    ),
    why(fill('q2', 'Natija.', 'Math.round(10000 * 1.12) = {{1}}', ['11200']), 'Narxga 12% QQS qo‘shiladi.'),
    why(
      tf('q3', 'Prototip metodi ichida ham `this` — metod chaqirilgan nusxa.', true),
      'Shuning uchun `this.narx`.',
    ),
  ]),
  'object-accessors': miniQuiz([
    why(
      codeFill(
        'q1',
        'Getter.',
        'const harorat = {\n  _c: 0,\n  {{1}} celsiy() {\n    return this._c;\n  },\n};',
        ['get'],
      ),
      'Qavssiz o‘qiladi.',
    ),
    why(
      tf('q2', 'Setter −273.15 dan past qiymatni `throw` bilan rad etishi mumkin.', true),
      'Tekshiruvchi setter.',
    ),
    why(
      fill('q3', 'Farengeyt getter.', '20 °C = 20 * 9 / 5 + 32 = {{1}} °F', ['68']),
      'Hisoblanadigan xususiyat.',
    ),
  ]),
  'object-protection': miniQuiz([
    why(
      codeFill('q1', 'Obyektni muzlating.', "const SOZLAMALAR = Object.{{1}}({ til: 'uz' });", [
        'freeze',
      ]),
      'O‘zgartirib bo‘lmaydi.',
    ),
    why(
      q(
        'q2',
        'Qat’iy rejimda muzlatilgan obyektga yozilsa?',
        ['TypeError', 'Yoziladi', 'Jimgina e’tiborsiz', 'undefined'],
        [0],
      ),
      'Oddiy rejimda — jimgina.',
    ),
    why(
      q(
        'q3',
        'Muzlatilganini tekshirish?',
        ['Object.isFrozen(obj)', 'obj.frozen', 'Object.freeze(obj) === true', 'typeof obj'],
        [0],
      ),
      'true/false.',
    ),
  ]),
  'call-apply-bind': miniQuiz([
    why(
      codeFill('q1', '`ali` bilan chaqiring.', 'tanishtir.{{1}}(ali);', ['call']),
      '`this` = ali.',
    ),
    why(
      q('q2', 'Argumentlar massivda berilsa?', ['apply', 'call', 'bind', 'invoke'], [0]),
      '`foizQosh.apply(obj, [10])`.',
    ),
    why(
      tf('q3', '`bind` funksiyani darhol chaqirmaydi.', true),
      'Bog‘langan yangi funksiya qaytaradi.',
    ),
  ]),
  closures: miniQuiz([
    why(
      q(
        'q1',
        'Ikki `hisoblagichYasa()` chaqiruvi umumiy `qiymat` ga egami?',
        ['Yo‘q — har biri o‘z yopilmasiga ega', 'Ha', 'Faqat birinchisi', 'Xato'],
        [0],
      ),
      'Har chaqiruv yangi doira yaratadi.',
    ),
    why(
      tf(
        'q2',
        'Yopilma tashqi funksiya tugagandan keyin ham uning o‘zgaruvchisini eslab qoladi.',
        true,
      ),
      'Yopiq holat.',
    ),
    why(
      fill(
        'q3',
        'Natija.',
        'const h = hisoblagichYasa(5); h.oshir(); h.oshir(); // qiymat = {{1}}',
        ['10'],
      ),
      'Qadam 5, ikki marta.',
    ),
  ]),
  timing: miniQuiz([
    why(
      codeFill('q1', 'Taymerni bekor qiling.', 'clearTimeout({{1}});', ['taymer']),
      '`setTimeout` qaytargan id.',
    ),
    why(
      q(
        'q2',
        'Ortga sanoq har soniyada?',
        [
          'setInterval(f, 1000)',
          'setTimeout(f, 1000) bir marta',
          'requestAnimationFrame',
          'for sikli',
        ],
        [0],
      ),
      '0 ga yetganda `clearInterval`.',
    ),
    why(
      tf('q3', '`setTimeout(f(), 500)` to‘g‘ri yozuv.', false),
      'Funksiyani bering, chaqirmang: `setTimeout(f, 500)`.',
    ),
  ]),
  callbacks: miniQuiz([
    why(
      codeFill(
        'q1',
        'O‘z `map` imiz.',
        'function qollash(sonlar, fn) {\n  const natija = [];\n  for (const s of sonlar) natija.push({{1}}(s));\n  return natija;\n}',
        ['fn'],
      ),
      'Callback har elementga qo‘llanadi.',
    ),
    why(
      fill('q2', 'Natija.', 'qollash([1, 2, 3], (x) => x * x) = {{1}}', [['[1, 4, 9]', '[1,4,9]']]),
      'Kvadratlar.',
    ),
    why(
      tf('q3', 'Callback — argument sifatida beriladigan funksiya.', true),
      'Keyinroq chaqiriladi.',
    ),
  ]),
  promises: miniQuiz([
    why(
      codeFill('q1', 'Promise yarating.', 'return new Promise((resolve, {{1}}) => { … });', [
        'reject',
      ]),
      'Muvaffaqiyat — resolve, xato — reject.',
    ),
    why(
      match('q2', 'Metodni vaqti bilan moslang.', [
        ['then', 'Muvaffaqiyatli natija'],
        ['catch', 'Xato'],
        ['finally', 'Har holda'],
      ]),
      'then → catch → finally zanjiri.',
    ),
    why(
      tf('q3', '`BAZA[id]` yo‘q bo‘lsa `reject(new Error(...))` chaqiriladi.', true),
      'Xato `catch` ga tushadi.',
    ),
  ]),
  'async-await': miniQuiz([
    why(
      codeFill('q1', 'Natijani kuting.', 'const ism = {{1}} malumotOl(id);', ['await']),
      'Faqat async funksiya ichida.',
    ),
    why(
      q(
        'q2',
        'Ism va kurslarni parallel yuklash?',
        [
          'await Promise.all([malumotOl(id), kurslarOl(id)])',
          'Ketma-ket await',
          'setTimeout',
          'for sikli',
        ],
        [0],
      ),
      'Umumiy vaqt qisqaradi.',
    ),
    why(
      tf('q3', '`async` funksiyadagi xato `try...catch` bilan ushlanadi.', true),
      'Oddiy kod kabi.',
    ),
  ]),
  fetch: miniQuiz([
    why(
      codeFill(
        'q1',
        'Javob muvaffaqiyatlimi?',
        "if (!javob.{{1}}) throw new Error('Xato: ' + javob.status);",
        ['ok'],
      ),
      '`fetch` 404 da ham reject qilmaydi.',
    ),
    why(
      codeFill('q2', 'JSON ni o‘qing.', 'const data = await javob.{{1}}();', ['json']),
      'Bu ham Promise.',
    ),
    why(
      tf('q3', 'Tarmoq xatosida `fetch` reject qiladi, 404/500 da esa yo‘q.', true),
      'Shuning uchun `ok` tekshiriladi.',
    ),
  ]),
  'dom-intro': miniQuiz([
    why(
      codeFill('q1', 'Sahifa sarlavhasi.', 'el.textContent = document.{{1}};', ['title']),
      '`<title>` matni.',
    ),
    why(
      q(
        'q2',
        '`<li>` lar soni?',
        [
          "document.querySelectorAll('li').length",
          'document.li.length',
          "document.count('li')",
          'li.length',
        ],
        [0],
      ),
      'NodeList uzunligi.',
    ),
    why(tf('q3', 'DOM o‘zgarsa sahifa manba fayli ham o‘zgaradi.', false), 'Faqat jonli DOM.'),
  ]),
  'dom-methods': miniQuiz([
    why(
      codeFill('q1', 'Karta ichidagi `.ism`.', "karta.{{1}}('.ism').textContent = ism.value;", [
        'querySelector',
      ]),
      'Faqat shu karta ichidan.',
    ),
    why(
      q(
        'q2',
        'Foydalanuvchi izohini qanday chiqarasiz?',
        ['textContent', 'innerHTML', 'document.write', 'eval'],
        [0],
      ),
      'XSS dan himoya.',
    ),
    why(
      tf(
        'q3',
        '`<script>` yozilgan izoh `innerHTML` bilan chiqarilsa xavfli bo‘lishi mumkin.',
        true,
      ),
      'Begona kod bajarilishi mumkin.',
    ),
  ]),
  'dom-elements': miniQuiz([
    why(
      codeFill('q1', 'Kurslar soni.', "const soni = document.{{1}}('li').length;", [
        'getElementsByTagName',
      ]),
      'Teg nomi bo‘yicha.',
    ),
    why(
      q(
        'q2',
        'Klassi `#daraja` qiymatiga teng elementlar?',
        [
          'el.classList.contains(daraja)',
          'el.class === daraja',
          'el.className = daraja',
          'el.matches(daraja) har doim',
        ],
        [0],
      ),
      'Klass bormi.',
    ),
    why(
      tf('q3', '`getElementsByTagName` jonli to‘plam qaytaradi.', true),
      'DOM o‘zgarsa yangilanadi.',
    ),
  ]),
  'dom-html': miniQuiz([
    why(
      codeFill('q1', 'data-atributni o‘qing.', 'const kurs = tugma.{{1}}.kurs;', ['dataset']),
      '`data-kurs` → `dataset.kurs`.',
    ),
    why(
      codeFill('q2', 'Havola manzili.', "havola.setAttribute('{{1}}', '/kurslar/' + kurs);", [
        'href',
      ]),
      'Atribut yangilanadi.',
    ),
    why(
      tf(
        'q3',
        'Bitta funksiya barcha tugmalarga ishlaydi, `this` yoki `event.currentTarget` orqali.',
        true,
      ),
      'Kod takrorlanmaydi.',
    ),
  ]),
  'dom-css': miniQuiz([
    why(
      codeFill(
        'q1',
        'Faqat shu tab faol.',
        "tablar.forEach((t) => t.classList.remove('faol'));\ntab.classList.{{1}}('faol');",
        ['add'],
      ),
      'Avval hammasidan olib tashlanadi.',
    ),
    why(
      codeFill('q2', 'Progress kengligi.', "chiziq.style.{{1}} = qiymat.value + '%';", ['width']),
      'Inline uslub.',
    ),
    why(
      tf('q3', 'Uslubni CSS’da yozib, JS’dan faqat klass almashtirish yaxshi odat.', true),
      'Ko‘rinish CSS’da qoladi.',
    ),
  ]),
  'dom-forms': miniQuiz([
    why(
      codeFill(
        'q1',
        'Sahifa yangilanmasin.',
        "forma.addEventListener('submit', (e) => {\n  e.{{1}}();\n});",
        ['preventDefault'],
      ),
      'Tekshiruvni o‘zimiz qilamiz.',
    ),
    why(
      q(
        'q2',
        'Birinchi xatoni ko‘rsatish tartibi?',
        [
          'Maydonlarni tartib bilan tekshirib, birinchisida to‘xtash',
          'Hammasini birga',
          'Tasodifiy',
          'Oxirgisini',
        ],
        [0],
      ),
      'Foydalanuvchi bittadan tuzatadi.',
    ),
    why(
      tf('q3', 'Frontend tekshiruvi serverdagi tekshiruv o‘rnini bosadi.', false),
      'U faqat qulaylik.',
    ),
  ]),
  'dom-animations': miniQuiz([
    why(
      codeFill('q1', 'Keyingi kadr.', '{{1}}(qadam);', ['requestAnimationFrame']),
      'Brauzer chizish tezligida.',
    ),
    why(
      fill('q2', 'Hisoblang.', '500 ms dan 250 ms o‘tdi: left = 200 × (250 / 500) = {{1}}px', [
        '100',
      ]),
      'O‘tgan vaqt ulushi.',
    ),
    why(
      tf(
        'q3',
        'Harakatni kamaytirish so‘ralgan bo‘lsa (`prefers-reduced-motion`), animatsiyani o‘tkazib yuborish kerak.',
        true,
      ),
      'Qulaylik talabi.',
    ),
  ]),
  'dom-events': miniQuiz([
    why(
      codeFill('q1', 'Klassni almashtiring.', "li.classList.{{1}}('tanlangan');", ['toggle']),
      'Bor bo‘lsa oladi, yo‘q bo‘lsa qo‘shadi.',
    ),
    why(
      q(
        'q2',
        '`.ochir` bosilganda `<li>` ning click ishlovchisi ham ishlamasligi uchun?',
        [
          'event.stopPropagation()',
          'event.preventDefault()',
          'return false har doim',
          'removeEventListener',
        ],
        [0],
      ),
      'Tarqalish to‘xtatiladi.',
    ),
    why(
      tf('q3', '`event.target` — hodisa aslida sodir bo‘lgan element.', true),
      '`currentTarget` — ishlovchi ulangan element.',
    ),
  ]),
  'dom-event-listener': miniQuiz([
    why(
      codeFill(
        'q1',
        'Delegatsiya: bosilgan tugmaning `<li>` si.',
        "const li = e.target.{{1}}('li');",
        ['closest'],
      ),
      'Bitta ishlovchi — ko‘p element.',
    ),
    why(
      codeFill('q2', 'Faqat bir marta.', "tugma.addEventListener('click', f, { {{1}}: true });", [
        'once',
      ]),
      'Keyin avtomatik olinadi.',
    ),
    why(
      tf('q3', 'Delegatsiyada keyin qo‘shilgan elementlar ham ishlaydi.', true),
      'Ishlovchi otada.',
    ),
  ]),
  'dom-navigation': miniQuiz([
    why(
      codeFill('q1', 'Keyingi element.', 'const javob = savol.{{1}};', ['nextElementSibling']),
      'Matn tugunlari o‘tkaziladi.',
    ),
    why(
      codeFill('q2', 'Holatni yangilang.', "savol.setAttribute('{{1}}', String(!javob.hidden));", [
        'aria-expanded',
      ]),
      'Ekran o‘quvchi holatni biladi.',
    ),
    why(
      q(
        'q3',
        'Bosilgan tugmaning kartasi?',
        [
          "tugma.closest('.karta')",
          'tugma.parentElement har doim',
          'tugma.nextSibling',
          "document.querySelector('.karta')",
        ],
        [0],
      ),
      'Tuzilma o‘zgarsa ham ishlaydi.',
    ),
  ]),
  'dom-nodes': miniQuiz([
    why(
      codeFill('q1', 'Matnni xavfsiz qo‘ying.', 'span.{{1}} = matn;', ['textContent']),
      'innerHTML emas.',
    ),
    why(
      order('q2', 'Tartiblang.', [
        'createElement',
        'textContent bilan to‘ldirish',
        'append bilan qo‘shish',
      ]),
      'Yaratish → to‘ldirish → joylash.',
    ),
    why(codeFill('q3', 'Elementni o‘chiring.', 'li.{{1}}();', ['remove']), 'O‘chirish tugmasida.'),
  ]),
  'dom-collections': miniQuiz([
    why(
      match('q1', 'To‘plamni xususiyati bilan moslang.', [
        ['getElementsByClassName', 'Jonli — avtomatik yangilanadi'],
        ['querySelectorAll', 'Statik — olingan paytdagi holat'],
      ]),
      'Mashqda farqni ko‘rasiz.',
    ),
    why(
      tf(
        'q2',
        'Yangi mahsulot qo‘shilgach `jonli.length` oshadi, `statik.length` esa o‘zgarmaydi.',
        true,
      ),
      'Statik to‘plam qayta olinmaguncha eski.',
    ),
    why(
      q(
        'q3',
        'NodeList ustida `map` uchun?',
        ['Array.from(statik).map(...)', 'statik.map(...)', 'statik.forEach.map', 'Imkoni yo‘q'],
        [0],
      ),
      'NodeList’da faqat forEach.',
    ),
  ]),
  'bom-window': miniQuiz([
    why(
      codeFill(
        'q1',
        'Oyna o‘lchami.',
        "olcham.textContent = window.innerWidth + '×' + window.{{1}};",
        ['innerHeight'],
      ),
      'Masalan, 1280×800.',
    ),
    why(
      codeFill(
        'q2',
        'Telefonmi?',
        "const telefon = window.matchMedia('(max-width: 599px)').{{1}};",
        ['matches'],
      ),
      'true yoki false.',
    ),
    why(
      tf('q3', 'O‘lcham o‘zgarganda `resize` hodisasi sodir bo‘ladi.', true),
      'Qiymatni yangilash uchun.',
    ),
  ]),
  'bom-location': miniQuiz([
    why(
      match('q1', '`new URL(…)` xususiyatini ma’nosi bilan moslang.', [
        ['hostname', 'Domen'],
        ['pathname', 'Yo‘l'],
        ['searchParams', 'So‘rov parametrlari'],
      ]),
      'URL tahlili.',
    ),
    why(
      codeFill('q2', '`kurs` parametri.', "const kurs = url.searchParams.{{1}}('kurs');", ['get']),
      'Yo‘q bo‘lsa null.',
    ),
    why(tf('q3', '`new URL()` noto‘g‘ri manzilda xato tashlaydi.', true), '`try...catch` foydali.'),
  ]),
  cookies: miniQuiz([
    why(
      q(
        'q1',
        '`document.cookie` qanday ko‘rinishda?',
        ["'til=uz; mavzu=dark' kabi bitta satr", 'Obyekt', 'Massiv', 'JSON'],
        [0],
      ),
      '`; ` bo‘yicha bo‘lib qidiriladi.',
    ),
    why(
      codeFill(
        'q2',
        'Til cookie’sini 1 yilga yozing.',
        "document.cookie = 'til=uz; {{1}}=31536000; path=/';",
        ['max-age'],
      ),
      'Soniyalarda.',
    ),
    why(
      tf('q3', 'Topilmagan cookie uchun `cookieOl` `null` qaytarishi kerak.', true),
      'Chaqiruvchi tekshira oladi.',
    ),
  ]),
  'web-storage': miniQuiz([
    why(
      codeFill(
        'q1',
        'Massivni saqlang.',
        "localStorage.setItem('eslatmalar', JSON.{{1}}(royxat));",
        ['stringify'],
      ),
      'Ombor faqat satr saqlaydi.',
    ),
    why(
      tf('q2', 'Ombor ishlamasa (`try...catch`) xotiradagi massiv bilan davom etish yaxshi.', true),
      'Ilova buzilmaydi.',
    ),
    why(
      q('q3', '`getItem` kalit topilmasa?', ['null', 'undefined', "''", 'Xato'], [0]),
      'Boshlang‘ich bo‘sh massiv beriladi.',
    ),
  ]),
  'web-apis': miniQuiz([
    why(
      codeFill('q1', 'Maydon to‘g‘rimi?', 'if (!email.{{1}}.valid) { … }', ['validity']),
      'Constraint Validation API.',
    ),
    why(
      q(
        'q2',
        'Sonni o‘zbekcha formatlash?',
        ["new Intl.NumberFormat('uz-UZ').format(n)", 'n.toFixed(3)', 'String(n)', "n + ' so‘m'"],
        [0],
      ),
      'Xonalar ajratiladi.',
    ),
    why(
      tf('q3', 'Birinchi xatoli maydonga `focus()` qilish foydalanuvchiga yordam beradi.', true),
      'Qayerni tuzatish kerakligi ko‘rinadi.',
    ),
  ]),
  'project-todo': miniQuiz([
    why(
      tf('q1', 'Bo‘sh matnli vazifa qo‘shilmasligi kerak (`trim()` dan keyin tekshiriladi).', true),
      'Faqat bo‘sh joylar ham bo‘sh.',
    ),
    why(
      q(
        'q2',
        'Holat o‘zgargach nima qilinadi?',
        [
          'Holat saqlanadi va ro‘yxat qayta chiziladi',
          'Sahifa yangilanadi',
          'Hech narsa',
          'Alert chiqadi',
        ],
        [0],
      ),
      'Holat → chizish.',
    ),
    why(
      codeFill('q3', 'Vazifa matni xavfsiz.', 'span.{{1}} = vazifa.matn;', ['textContent']),
      'Foydalanuvchi matni.',
    ),
  ]),
  'project-calculator': miniQuiz([
    why(
      tf(
        'q1',
        'Kalkulyatorda `eval` ishlatish taqiqlangan, chunki u istalgan kodni bajaradi.',
        true,
      ),
      'Xavfli va nazoratsiz.',
    ),
    why(
      q(
        'q2',
        'Tugmalar uchun nechta ishlovchi?',
        ['Bitta — #tugmalar ga (delegatsiya)', 'Har tugmaga bittadan', 'Hech qancha', 'Ikkita'],
        [0],
      ),
      "`e.target.closest('button')`.",
    ),
    why(
      fill(
        'q3',
        'Natija.',
        '0.1 + 0.2 ni Number((0.1 + 0.2).toFixed(10)) bilan formatlasak = {{1}}',
        ['0.3'],
      ),
      'Kasr xatosi yashiriladi.',
    ),
  ]),
  'project-quiz': miniQuiz([
    why(fill('q1', 'Birinchi savolda.', '#raqam = 1 / {{1}} (3 ta savol)', ['3']), 'Joriy / jami.'),
    why(
      q(
        'q2',
        'Variantlar qaysi element bo‘lishi yaxshi?',
        ['<button> (klaviatura bilan ishlaydi)', '<div onclick>', '<span>', '<p>'],
        [0],
      ),
      'Tugma klaviatura bilan ham ishlaydi.',
    ),
    why(
      tf('q3', 'Natija `aria-live` bilan e’lon qilinsa, ekran o‘quvchi uni o‘qiydi.', true),
      'Ko‘rmaydigan foydalanuvchi uchun.',
    ),
  ]),
  'project-filter': miniQuiz([
    why(
      codeFill(
        'q1',
        'Qidiruv (katta-kichik farqsiz).',
        'const mos = KURSLAR.filter((k) => k.nom.toLowerCase().{{1}}(soz.toLowerCase()));',
        ['includes'],
      ),
      'Ikkala tomon kichik harfga.',
    ),
    why(
      q(
        'q2',
        'Har kurs qanday element?',
        ['article.karta (<h3> bilan)', 'table qatori', 'span', 'li siz div'],
        [0],
      ),
      'Mustaqil mazmun.',
    ),
    why(
      tf('q3', 'Natija yo‘q bo‘lsa, “hech narsa topilmadi” xabari ko‘rsatilishi kerak.', true),
      'Bo‘sh holat.',
    ),
  ]),
};
