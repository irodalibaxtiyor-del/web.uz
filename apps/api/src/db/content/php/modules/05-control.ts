import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m05: ModuleDef = {
  title: 'Shartlar va sikllar',
  lessons: [
    {
      slug: 'php-if-else',
      title: 'if, elseif, else',
      quiz: dars('if va else — test', [
        natija(
          'grade',
          `<?php\n$ball = 75;\nif ($ball >= 86) {\n    echo "5";\n} elseif ($ball >= 71) {\n    echo "4";\n} elseif ($ball >= 56) {\n    echo "3";\n} else {\n    echo "2";\n}`,
          ['4', '5', '3', '43'],
          0,
        ),
        natija(
          'zero-string',
          `<?php\nif ("0") {\n    echo "T";\n} else {\n    echo "F";\n}`,
          ['F', 'T', '0', XATO],
          0,
        ),
        natija(
          'falsy-mix',
          `<?php\nforeach (["0.0", [], " ", 0.0] as $q) {\n    echo $q ? "T" : "F";\n}`,
          ['TFTF', 'FFTF', 'TFFF', 'FFFF'],
          0,
        ),
        natija(
          'and-or',
          `<?php\n$yosh = 20;\n$talaba = false;\nif ($yosh >= 18 && $talaba) {\n    echo "A";\n} elseif ($yosh >= 18 || $talaba) {\n    echo "B";\n} else {\n    echo "C";\n}`,
          ['B', 'A', 'C', 'AB'],
          0,
        ),
        q(
          'form-zero',
          "Formada miqdor maydoniga `0` kiritildi: `$_POST['soni']` — `\"0\"`. `if ($_POST['soni'])` qanday ishlaydi?",
          [
            'Shart bajarilmaydi — `"0"` falsy, maydon “bo‘sh” deb hisoblanadi',
            'Shart bajariladi — maydon to‘ldirilgan',
            'PHP xato beradi',
            'Shart faqat `0` son bo‘lsa bajariladi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-switch-match',
      title: 'switch va match',
      quiz: dars('switch va match — test', [
        natija(
          'fallthrough',
          `<?php\nswitch (2) {\n    case 1: echo "a";\n    case 2: echo "b";\n    case 3: echo "c"; break;\n    case 4: echo "d";\n}`,
          ['bc', 'b', 'bcd', 'abc'],
          0,
        ),
        natija(
          'switch-loose',
          `<?php\nswitch ("1") {\n    case 1:\n        echo "son";\n        break;\n    case "1":\n        echo "satr";\n        break;\n}`,
          ['son', 'satr', 'sonsatr', ''],
          0,
        ),
        natija(
          'match-range',
          `<?php\n$ball = 75;\necho match (true) {\n    $ball >= 86 => "5",\n    $ball >= 71 => "4",\n    $ball >= 56 => "3",\n    default => "2",\n};`,
          ['4', '5', '3', '2'],
          0,
        ),
        natija(
          'match-multi',
          `<?php\n$kod = 302;\necho match ($kod) {\n    200 => "OK",\n    301, 302 => "Yo‘naltirish",\n    default => "Boshqa",\n};`,
          ['Yo‘naltirish', 'OK', 'Boshqa', XATO],
          0,
        ),
        q(
          'match-strict',
          '`match ("1") { 1 => "son", "2" => "ikki" }` nima bo‘ladi?',
          [
            '`UnhandledMatchError` — `match` qat’iy (`===`) solishtiradi va `default` yo‘q',
            '`son` qaytaradi',
            '`null` qaytaradi',
            '`ikki` qaytaradi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-while',
      title: 'while va do...while',
      quiz: dars('while — test', [
        natija(
          'while',
          `<?php\n$i = 0;\nwhile ($i < 3) {\n    echo $i;\n    $i++;\n}`,
          ['012', '0123', '123', '01'],
          0,
        ),
        natija(
          'do-while',
          `<?php\n$j = 10;\ndo {\n    echo $j;\n} while ($j < 3);`,
          ['10', '', '1010', XATO],
          0,
        ),
        natija(
          'digits',
          `<?php\n$son = 2026;\n$y = 0;\nwhile ($son > 0) {\n    $y += $son % 10;\n    $son = intdiv($son, 10);\n}\necho $y;`,
          ['10', '2026', '6', '8'],
          0,
        ),
        natija(
          'break-continue',
          `<?php\n$i = 0;\nwhile (true) {\n    $i++;\n    if ($i % 2 === 0) continue;\n    if ($i > 7) break;\n    echo $i;\n}`,
          ['1357', '13579', '2468', '1234567'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-for',
      title: 'for sikli',
      quiz: dars('for — test', [
        natija(
          'step',
          `<?php\nfor ($i = 10; $i > 0; $i -= 3) {\n    echo $i, " ";\n}`,
          ['10 7 4 1 ', '10 7 4 ', '10 7 4 1 -2 ', '7 4 1 '],
          0,
        ),
        natija(
          'sum',
          `<?php\n$s = 0;\nfor ($i = 1; $i <= 10; $i++) {\n    $s += $i;\n}\necho $s;`,
          ['55', '45', '10', '50'],
          0,
        ),
        natija(
          'continue2',
          `<?php\nfor ($i = 0; $i < 3; $i++) {\n    for ($j = 0; $j < 3; $j++) {\n        if ($j == 1) continue 2;\n        echo "$i$j ";\n    }\n}`,
          ['00 10 20 ', '00 02 10 12 20 22 ', '00 ', '00 01 02 '],
          0,
        ),
        natija(
          'even',
          `<?php\nfor ($i = 1; $i <= 10; $i++) {\n    if ($i % 2) continue;\n    if ($i > 8) break;\n    echo $i;\n}`,
          ['2468', '246810', '13579', '2468 10'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-foreach',
      title: 'foreach sikli',
      quiz: dars('foreach va 5-modul yakuni — test', [
        natija(
          'kv',
          `<?php\n$narxlar = ["non" => 4000, "sut" => 12000];\nforeach ($narxlar as $nom => $narx) {\n    echo "$nom=$narx ";\n}`,
          ['non=4000 sut=12000 ', '0=4000 1=12000 ', 'non sut ', '4000 12000 '],
          0,
        ),
        natija(
          'copy',
          `<?php\n$a = [1, 2, 3];\nforeach ($a as $v) {\n    $v *= 2;\n}\necho implode(",", $a);`,
          ['1,2,3', '2,4,6', '1,2,6', XATO],
          0,
        ),
        natija(
          'ref',
          `<?php\n$a = [1, 2, 3];\nforeach ($a as &$v) {\n    $v *= 2;\n}\nunset($v);\necho implode(",", $a);`,
          ['2,4,6', '1,2,3', '2,4,3', '1,2,6'],
          0,
        ),
        natija(
          'ref-trap',
          `<?php\n$a = [1, 2, 3];\nforeach ($a as &$v) {}\nforeach ($a as $v) {}\necho implode(",", $a);`,
          ['1,2,2', '1,2,3', '3,3,3', '1,1,1'],
          0,
        ),
        natija(
          'avg',
          `<?php\n$ballar = ["Ali" => 85, "Madina" => 92, "Jasur" => 67, "Bobur" => 44];\n$otgan = 0;\nforeach ($ballar as $ball) {\n    if ($ball >= 60) $otgan++;\n}\necho $otgan, " / ", count($ballar);`,
          ['3 / 4', '4 / 4', '2 / 4', '3 / 3'],
          0,
        ),
        q(
          'unset',
          'Havolali `foreach ($a as &$v)` dan keyin nima qilish kerak?',
          ['`unset($v);`', 'Hech narsa', '`$v = null;`', '`reset($a);`'],
          [0],
        ),
      ]),
    },
  ],
};
