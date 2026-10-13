import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m06: ModuleDef = {
  title: 'Funksiyalar',
  lessons: [
    {
      slug: 'php-functions',
      title: 'Funksiyalar',
      quiz: dars('Funksiyalar — test', [
        natija(
          'basic',
          `<?php\nfunction ikki(int $x): int\n{\n    return $x * 2;\n}\necho ikki(3) + ikki(4);`,
          ['14', '7', '34', '68'],
          0,
        ),
        natija(
          'coerce',
          `<?php\nfunction kvadrat(int $x): int\n{\n    return $x * $x;\n}\necho kvadrat("5");`,
          ['25', '55', XATO, '5'],
          0,
        ),
        natija(
          'void',
          `<?php\nfunction chiqar(string $m): void\n{\n    echo $m;\n}\n$r = chiqar("A");\nvar_dump($r);`,
          ['ANULL\n', 'A\n', 'Abool(true)\n', 'NULL\n'],
          0,
        ),
        natija(
          'recursion',
          `<?php\nfunction fakt(int $n): int\n{\n    return $n <= 1 ? 1 : $n * fakt($n - 1);\n}\necho fakt(5);`,
          ['120', '24', '5', '15'],
          0,
        ),
        q(
          'strict',
          'Fayl boshida `declare(strict_types=1);` bor. `kvadrat("5")` (parametr `int`) nima bo‘ladi?',
          ['`TypeError` — satr avtomatik songa aylantirilmaydi', '`25`', '`"55"`', '`0`'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-function-args',
      title: 'Funksiya argumentlari',
      quiz: dars('Argumentlar — test', [
        natija(
          'default',
          `<?php\nfunction salom(string $ism = "Mehmon"): string\n{\n    return "Salom, $ism!";\n}\necho salom(), " ", salom("Ali");`,
          [
            'Salom, Mehmon! Salom, Ali!',
            'Salom, ! Salom, Ali!',
            'Salom, Mehmon! Salom, Mehmon!',
            XATO,
          ],
          0,
        ),
        natija(
          'named',
          `<?php\nfunction narx(int $summa, float $chegirma = 0.0, bool $qqs = false): float\n{\n    $n = $summa * (1 - $chegirma);\n    return $qqs ? $n * 1.12 : $n;\n}\necho narx(chegirma: 0.5, summa: 1000);`,
          ['500', '1000', '560', XATO],
          0,
        ),
        natija(
          'variadic',
          `<?php\nfunction yigindi(int ...$sonlar): int\n{\n    return array_sum($sonlar);\n}\necho yigindi(1, 2, 3), " ", yigindi(...[4, 5]);`,
          ['6 9', '6 45', '1 4', '123 45'],
          0,
        ),
        natija(
          'by-value',
          `<?php\nfunction qosh(array $a): void\n{\n    $a[] = 4;\n}\n$m = [1, 2, 3];\nqosh($m);\necho count($m);`,
          ['3', '4', '0', XATO],
          0,
        ),
        natija(
          'by-ref',
          `<?php\nfunction qosh(array &$a): void\n{\n    $a[] = 4;\n}\n$m = [1, 2, 3];\nqosh($m);\necho count($m);`,
          ['4', '3', '1', XATO],
          0,
        ),
      ]),
    },
    {
      slug: 'php-scope',
      title: 'Ko‘rinish doirasi',
      quiz: dars('Ko‘rinish doirasi — test', [
        natija(
          'outer',
          `<?php\n$kurs = "PHP";\nfunction korsat(): string\n{\n    return $kurs ?? "yo‘q";\n}\necho korsat();`,
          ['yo‘q', 'PHP', '', XATO],
          0,
        ),
        natija(
          'static',
          `<?php\nfunction sanoq(): int\n{\n    static $n = 0;\n    return ++$n;\n}\nsanoq();\nsanoq();\necho sanoq();`,
          ['3', '1', '0', '2'],
          0,
        ),
        natija(
          'global',
          `<?php\n$x = 10;\nfunction olish(): int\n{\n    global $x;\n    return $x + 1;\n}\necho olish();`,
          ['11', '1', '10', XATO],
          0,
        ),
        natija(
          'block',
          `<?php\nfor ($i = 0; $i < 3; $i++) {\n    $oxirgi = $i;\n}\necho $i, " ", $oxirgi;`,
          ['3 2', '2 2', '3 3', XATO],
          0,
        ),
      ]),
    },
    {
      slug: 'php-closures',
      title: 'Anonim funksiyalar va callback’lar',
      quiz: dars('Closure’lar va 6-modul yakuni — test', [
        natija(
          'use',
          `<?php\n$k = 2;\n$kop = function (int $a) use ($k): int {\n    return $a * $k;\n};\n$k = 3;\necho $kop(5);`,
          ['10', '15', '5', XATO],
          0,
        ),
        natija(
          'fn',
          `<?php\n$k = 2;\n$kop = fn(int $a): int => $a * $k;\n$k = 3;\necho $kop(5);`,
          ['10', '15', '5', XATO],
          0,
        ),
        natija(
          'use-ref',
          `<?php\n$t = 0;\n$oshir = function () use (&$t): void {\n    $t++;\n};\n$oshir();\n$oshir();\necho $t;`,
          ['2', '0', '1', XATO],
          0,
        ),
        natija(
          'filter-keys',
          `<?php\n$juft = array_filter([1, 2, 3, 4], fn($x) => $x % 2 === 0);\necho implode(",", array_keys($juft));`,
          ['1,3', '0,1', '2,4', '0,2'],
          0,
        ),
        natija(
          'map',
          `<?php\necho implode(" ", array_map(fn($x) => $x ** 2, [1, 2, 3]));`,
          ['1 4 9', '2 4 6', '1 2 3', '1 8 27'],
          0,
        ),
        q(
          'callable',
          'Parametr “chaqirsa bo‘ladigan narsa” (funksiya, closure) qabul qilishi uchun qaysi tur yoziladi?',
          ['`callable`', '`function`', '`fn`', '`mixed[]`'],
          [0],
        ),
      ]),
    },
  ],
};
