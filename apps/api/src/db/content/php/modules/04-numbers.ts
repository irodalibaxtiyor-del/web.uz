import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m04: ModuleDef = {
  title: 'Sonlar va operatorlar',
  lessons: [
    {
      slug: 'php-numbers-math',
      title: 'Sonlar va matematika',
      quiz: dars('Sonlar va matematika — test', [
        natija(
          'float-eq',
          `<?php\nvar_dump(0.1 + 0.2 == 0.3);`,
          ['bool(false)\n', 'bool(true)\n', 'float(0.3)\n', XATO],
          0,
        ),
        natija(
          'div',
          `<?php\nvar_dump(intdiv(17, 5), 17 % 5);`,
          ['int(3)\nint(2)\n', 'float(3.4)\nint(2)\n', 'int(3)\nint(3)\n', 'int(2)\nint(3)\n'],
          0,
        ),
        natija(
          'round',
          `<?php\necho round(2.5), " ", floor(2.5), " ", ceil(2.2);`,
          ['3 2 3', '2 2 3', '3 3 3', '2 2 2'],
          0,
        ),
        natija(
          'floor-type',
          `<?php\nvar_dump(floor(4.7));`,
          ['float(4)\n', 'int(4)\n', 'float(4.7)\n', 'int(5)\n'],
          0,
        ),
        q(
          'random',
          'Tasdiqlash kodi (masalan, 6 xonali SMS kod) yaratish uchun qaysi funksiya to‘g‘ri?',
          [
            '`random_int(100000, 999999)`',
            '`rand(100000, 999999)`',
            '`mt_rand(100000, 999999)`',
            '`round(microtime())`',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-operators',
      title: 'Operatorlar',
      quiz: dars('Operatorlar — test', [
        natija(
          'assign',
          `<?php\n$a = 10;\n$a += 5;\n$a -= 3;\n$a *= 2;\n$a /= 4;\n$a %= 4;\necho $a;`,
          ['2', '6', '0', '1.5'],
          0,
        ),
        natija(
          'incr',
          `<?php\n$x = 5;\necho $x++, " ", $x, " ", ++$x;`,
          ['5 6 7', '6 6 7', '5 5 6', '6 7 8'],
          0,
        ),
        natija(
          'or-trap',
          `<?php\n$r = false or true;\nvar_dump($r);`,
          ['bool(false)\n', 'bool(true)\n', 'NULL\n', XATO],
          0,
        ),
        natija(
          'nullish',
          `<?php\n$n = null;\necho $n ?? "standart", " ", 0 ?: "nol", " ", 0 ?? "nol";`,
          ['standart nol 0', 'standart 0 0', 'standart nol nol', ' nol 0'],
          0,
        ),
        natija(
          'spaceship',
          `<?php\necho 7 <=> 3, " ", 3 <=> 7, " ", 5 <=> 5;`,
          ['1 -1 0', '-1 1 0', '4 -4 0', 'true false true'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-comparison',
      title: 'Taqqoslash',
      quiz: dars('Taqqoslash va 4-modul yakuni — test', [
        natija(
          'strict',
          `<?php\nvar_dump(5 == "5", 5 === "5");`,
          [
            'bool(true)\nbool(false)\n',
            'bool(true)\nbool(true)\n',
            'bool(false)\nbool(false)\n',
            'bool(false)\nbool(true)\n',
          ],
          0,
        ),
        natija(
          'php8',
          `<?php\nvar_dump(0 == "abc");`,
          ['bool(false)\n', 'bool(true)\n', 'int(0)\n', XATO],
          0,
        ),
        natija(
          'numeric-strings',
          `<?php\nvar_dump("10" == "1e1");`,
          ['bool(true)\n', 'bool(false)\n', 'string(2) "10"\n', XATO],
          0,
        ),
        natija(
          'string-lt',
          `<?php\nvar_dump("10" < "9");`,
          ['bool(false)\n', 'bool(true)\n', 'int(-1)\n', XATO],
          0,
        ),
        natija(
          'tfs',
          `<?php\n$natijalar = [5 == "5", 5 === "5", 0 == "abc", "1" == "01", null == false, "10" < "9"];\nforeach ($natijalar as $n) {\n    echo $n ? "T" : "F";\n}`,
          ['TFFTTF', 'TFTTTT', 'TTFTTF', 'TFFTFF'],
          0,
        ),
        q(
          'secret',
          'Ikki maxfiy tokenni xavfsiz solishtirish uchun qaysi funksiya?',
          ['`hash_equals`', '`==`', '`strcmp`', '`similar_text`'],
          [0],
        ),
      ]),
    },
  ],
};
