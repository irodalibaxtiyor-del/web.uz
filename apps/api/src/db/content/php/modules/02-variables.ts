import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m02: ModuleDef = {
  title: 'O‘zgaruvchilar va ma’lumot turlari',
  lessons: [
    {
      slug: 'php-variables',
      title: 'O‘zgaruvchilar',
      quiz: dars('O‘zgaruvchilar — test', [
        natija(
          'double',
          `<?php\n$ism = "Madina";\necho "Salom, $ism!";`,
          ['Salom, Madina!', 'Salom, $ism!', 'Salom, !', 'Salom, "Madina"!'],
          0,
        ),
        natija(
          'single',
          `<?php\n$ism = "Madina";\necho 'Salom, $ism!';`,
          ['Salom, $ism!', 'Salom, Madina!', 'Salom, !', XATO],
          0,
        ),
        natija(
          'reassign',
          `<?php\n$ball = 70;\n$ball = $ball + 15;\n$ball += 5;\necho $ball;`,
          ['90', '85', '70', '75'],
          0,
        ),
        natija(
          'braces',
          `<?php\n$soni = 5;\necho "{$soni}ta kurs";`,
          ['5ta kurs', '{5}ta kurs', 'ta kurs', '$sonita kurs'],
          0,
        ),
        q(
          'name',
          'Qaysi o‘zgaruvchi nomi **noto‘g‘ri**?',
          ['`$2kurs`', '`$kurs2`', '`$_ichki`', '`$kursNarxi`'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-echo-print',
      title: 'echo va print',
      quiz: dars('echo va print — test', [
        natija(
          'commas',
          `<?php\necho "Bir", "Ikki", "Uch";`,
          ['BirIkkiUch', 'Bir, Ikki, Uch', 'Bir Ikki Uch', 'Bir'],
          0,
        ),
        natija(
          'precedence',
          `<?php\n$a = 2;\necho "Natija: " . $a + 3;`,
          ['Natija: 5', 'Natija: 23', 'Natija: 2', XATO],
          0,
        ),
        natija('print-return', `<?php\n$r = print "A";\necho $r;`, ['A1', 'A', '1', 'AA'], 0),
        natija('false', `<?php\necho "[", false, "]";`, ['[]', '[false]', '[0]', '[null]'], 0),
        q(
          'xss',
          'Foydalanuvchi yozgan matnni HTML’ga chiqarishdan oldin qaysi funksiyadan o‘tkazish kerak?',
          ['`htmlspecialchars`', '`strtoupper`', '`print_r`', '`trim`'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-data-types',
      title: 'Ma’lumot turlari',
      quiz: dars('Ma’lumot turlari — test', [
        natija(
          'div-int',
          `<?php\nvar_dump(10 / 2);`,
          ['int(5)\n', 'float(5)\n', 'int(5.0)\n', 'string(1) "5"\n'],
          0,
        ),
        natija(
          'div-float',
          `<?php\necho get_debug_type(7 / 2);`,
          ['float', 'int', 'double', 'number'],
          0,
        ),
        natija(
          'plus-dot',
          `<?php\necho "5" + 3, " ", "5" . 3;`,
          ['8 53', '53 8', '8 8', '53 53'],
          0,
        ),
        natija('strlen', `<?php\necho strlen("PHP");`, ['3', '4', 'PHP', '0'], 0),
        natija(
          'null',
          `<?php\n$manzil = null;\necho $manzil ?? "kiritilmagan";`,
          ['kiritilmagan', 'null', '', 'NULL'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-casting',
      title: 'Turlarni aylantirish',
      quiz: dars('Turlarni aylantirish — test', [
        natija('int-trunc', `<?php\necho (int) "3.99";`, ['3', '4', '3.99', '0'], 0),
        natija('int-prefix', `<?php\necho (int) "42abc";`, ['42', '0', '42abc', XATO], 0),
        natija(
          'bool-zero',
          `<?php\nvar_dump((bool) "0");`,
          ['bool(false)\n', 'bool(true)\n', 'int(0)\n', 'string(1) "0"\n'],
          0,
        ),
        natija(
          'sum',
          `<?php\n$a = "12";\n$b = "7.5";\n$c = "3 dona";\necho (int) $a + (float) $b + (int) $c;`,
          ['22.5', '22', '127.53', '19.5'],
          0,
        ),
        q(
          'falsy',
          'Qaysilari `(bool)` da `false` ga aylanadi? (bir nechta javob)',
          ['`"0"`', '`""`', '`[]`', '`"false"`', '`"0.0"`'],
          [0, 1, 2],
        ),
      ]),
    },
    {
      slug: 'php-constants',
      title: 'Konstantalar',
      quiz: dars('Konstantalar va 2-modul yakuni — test', [
        natija(
          'const',
          `<?php\nconst QQS = 0.12;\nconst CHIPTA = 25000;\necho CHIPTA * 4 * (1 + QQS);`,
          ['112000', '100000', '100000.12', '112'],
          0,
        ),
        natija(
          'array-const',
          `<?php\nconst RANGLAR = ['qizil', 'yashil', 'ko‘k'];\necho RANGLAR[1];`,
          ['yashil', 'qizil', 'ko‘k', 'Array'],
          0,
        ),
        natija(
          'defined',
          `<?php\nvar_dump(defined('SAYT'));\ndefine('SAYT', 'webdizayn.uz');\nvar_dump(defined('SAYT'));`,
          [
            'bool(false)\nbool(true)\n',
            'bool(true)\nbool(true)\n',
            'bool(false)\nbool(false)\n',
            XATO,
          ],
          0,
        ),
        q(
          'dollar',
          'Konstanta va o‘zgaruvchining yozilishidagi farq?',
          [
            'Konstantada `$` belgisi yo‘q',
            'Konstanta har doim kichik harfda',
            'Konstanta `#` bilan boshlanadi',
            'Farq yo‘q',
          ],
          [0],
        ),
        q(
          'dir',
          'Fayl joylashgan papkani qaysi “sehrli” konstanta beradi?',
          ['`__DIR__`', '`__FILE__`', '`__LINE__`', '`PHP_EOL`'],
          [0],
        ),
        q(
          'secrets',
          'Ma’lumotlar bazasi parolini qayerda saqlash to‘g‘ri?',
          [
            'Muhit o‘zgaruvchisida yoki repoga kirmaydigan sozlama faylida',
            'Kod ichida konstanta sifatida',
            'HTML izohida',
            'JavaScript faylida',
          ],
          [0],
        ),
      ]),
    },
  ],
};
