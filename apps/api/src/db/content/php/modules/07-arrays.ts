import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m07: ModuleDef = {
  title: 'Massivlar',
  lessons: [
    {
      slug: 'php-arrays',
      title: 'Massivlar',
      quiz: dars('Massivlar — test', [
        natija(
          'index',
          `<?php\n$a = ["HTML", "CSS", "PHP"];\necho $a[count($a) - 1], " ", count($a);`,
          ['PHP 3', 'CSS 3', 'PHP 2', XATO],
          0,
        ),
        natija(
          'next-key',
          `<?php\n$b = [3 => "a"];\n$b[] = "b";\necho implode(",", array_keys($b));`,
          ['3,4', '0,1', '3,0', '0,3'],
          0,
        ),
        natija(
          'copy',
          `<?php\n$x = [3, 1, 2];\n$y = $x;\nsort($y);\necho implode(",", $x);`,
          ['3,1,2', '1,2,3', '2,1,3', XATO],
          0,
        ),
        natija(
          'implode',
          `<?php\n$a = ["non", "sut"];\n$a[] = "tuxum";\necho implode(", ", $a);`,
          ['non, sut, tuxum', 'Array', 'non,sut,tuxum', 'tuxum, non, sut'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-associative',
      title: 'Assotsiativ massivlar',
      quiz: dars('Assotsiativ massivlar — test', [
        natija(
          'access',
          `<?php\n$kurs = ["nom" => "PHP", "darslar" => 63];\n$kurs["darslar"] += 2;\necho "{$kurs['nom']}: {$kurs['darslar']}";`,
          ['PHP: 65', 'PHP: 63', 'nom: darslar', XATO],
          0,
        ),
        natija(
          'isset-null',
          `<?php\n$a = ["telefon" => null];\nvar_dump(isset($a["telefon"]), array_key_exists("telefon", $a));`,
          [
            'bool(false)\nbool(true)\n',
            'bool(true)\nbool(true)\n',
            'bool(false)\nbool(false)\n',
            'bool(true)\nbool(false)\n',
          ],
          0,
        ),
        natija(
          'numeric-key',
          `<?php\n$a = ["5" => "a"];\n$a[5] = "b";\necho count($a), $a["5"];`,
          ['1b', '2a', '2b', '1a'],
          0,
        ),
        natija(
          'destructure',
          `<?php\n["ism" => $ism, "ball" => $ball] = ["ball" => 85, "ism" => "Ali"];\necho "$ism $ball";`,
          ['Ali 85', '85 Ali', ' ', XATO],
          0,
        ),
      ]),
    },
    {
      slug: 'php-array-changes',
      title: 'Massivni o‘zgartirish',
      quiz: dars('Massivni o‘zgartirish — test', [
        natija(
          'unset',
          `<?php\n$d = [1, 2, 3];\nunset($d[1]);\necho implode(",", array_keys($d));`,
          ['0,2', '0,1', '1,2', '0,1,2'],
          0,
        ),
        natija(
          'queue',
          `<?php\n$n = ["Ali", "Vali"];\n$n[] = "Madina";\narray_unshift($n, "Jasur");\n$c = array_shift($n);\necho $c, ": ", implode(",", $n);`,
          [
            'Jasur: Ali,Vali,Madina',
            'Ali: Vali,Madina,Jasur',
            'Madina: Jasur,Ali,Vali',
            'Jasur: Jasur,Ali,Vali,Madina',
          ],
          0,
        ),
        natija(
          'plus',
          `<?php\necho implode(",", [1, 2] + [3, 4, 5]);`,
          ['1,2,5', '1,2,3,4,5', '4,6,5', '3,4,5'],
          0,
        ),
        natija(
          'merge',
          `<?php\n$r = array_merge(["a" => 1, "b" => 2], ["b" => 3, "c" => 4]);\necho implode(",", $r);`,
          ['1,3,4', '1,2,4', '1,2,3,4', '3,4'],
          0,
        ),
        natija(
          'in-array',
          `<?php\nvar_dump(in_array("5", [1, 5, 9]), in_array("5", [1, 5, 9], true));`,
          [
            'bool(true)\nbool(false)\n',
            'bool(true)\nbool(true)\n',
            'bool(false)\nbool(false)\n',
            'bool(false)\nbool(true)\n',
          ],
          0,
        ),
      ]),
    },
    {
      slug: 'php-array-sort',
      title: 'Massivlarni saralash',
      quiz: dars('Saralash — test', [
        natija(
          'sort',
          `<?php\n$n = [5, 12, 3, 40];\nsort($n);\necho implode(",", $n);`,
          ['3,5,12,40', '12,3,40,5', '40,12,5,3', '5,12,3,40'],
          0,
        ),
        natija(
          'sort-string',
          `<?php\n$s = ["10", "9", "2"];\nsort($s, SORT_STRING);\necho implode(",", $s);`,
          ['10,2,9', '2,9,10', '9,2,10', '10,9,2'],
          0,
        ),
        natija(
          'asort',
          `<?php\n$p = ["non" => 4000, "sut" => 12000, "tuxum" => 1500];\nasort($p);\necho implode(",", array_keys($p));`,
          ['tuxum,non,sut', 'non,sut,tuxum', 'sut,non,tuxum', '0,1,2'],
          0,
        ),
        natija(
          'usort',
          `<?php\n$t = [["ism" => "Ali", "ball" => 85], ["ism" => "Madina", "ball" => 92], ["ism" => "Jasur", "ball" => 67]];\nusort($t, fn($a, $b) => $b["ball"] <=> $a["ball"]);\necho implode(",", array_column($t, "ism"));`,
          ['Madina,Ali,Jasur', 'Jasur,Ali,Madina', 'Ali,Madina,Jasur', 'Ali,Jasur,Madina'],
          0,
        ),
        q(
          'keys',
          'Assotsiativ massivni **qiymat** bo‘yicha saralab, kalitlarni saqlash uchun qaysi funksiya?',
          ['`asort`', '`sort`', '`ksort`', '`usort`'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-multidimensional',
      title: 'Ko‘p o‘lchovli massivlar',
      quiz: dars('Ko‘p o‘lchovli massivlar — test', [
        natija(
          'nested',
          `<?php\n$t = [["ism" => "Ali", "kurslar" => ["HTML", "CSS"]], ["ism" => "Madina", "kurslar" => ["PHP"]]];\necho $t[0]["kurslar"][1], " ", $t[1]["ism"];`,
          ['CSS Madina', 'HTML Madina', 'CSS Ali', XATO],
          0,
        ),
        natija(
          'matrix',
          `<?php\n$m = [[1, 2, 3], [4, 5, 6]];\necho $m[1][2] + $m[0][0];`,
          ['7', '6', '5', '9'],
          0,
        ),
        natija(
          'column',
          `<?php\n$t = [["ism" => "Ali", "ball" => 85], ["ism" => "Madina", "ball" => 92]];\n$b = array_column($t, "ball", "ism");\necho $b["Madina"];`,
          ['92', '85', 'Madina', XATO],
          0,
        ),
        natija(
          'group',
          `<?php\n$g = [];\nforeach ([["HTML", 80], ["PHP", 70], ["HTML", 90]] as [$kurs, $ball]) {\n    $g[$kurs][] = $ball;\n}\necho count($g), " ", count($g["HTML"]);`,
          ['2 2', '3 2', '2 1', '3 3'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-array-functions',
      title: 'Massiv funksiyalari',
      quiz: dars('Massiv funksiyalari va 7-modul yakuni — test', [
        natija(
          'map',
          `<?php\necho implode(",", array_map(fn($n) => $n * 2, [1, 2, 3]));`,
          ['2,4,6', '1,2,3', '3,4,5', '1,4,9'],
          0,
        ),
        natija(
          'filter-falsy',
          `<?php\necho count(array_filter(["a", "", "0", null, "b"]));`,
          ['2', '3', '4', '5'],
          0,
        ),
        natija(
          'reduce',
          `<?php\necho array_reduce([1, 2, 3], fn($j, $x) => $j + $x, 10);`,
          ['16', '6', '10', '60'],
          0,
        ),
        natija(
          'unique',
          `<?php\necho implode(",", array_unique([1, 2, 2, 3, 1]));`,
          ['1,2,3', '1,2,2,3,1', '3', '2,1'],
          0,
        ),
        natija(
          'count-values',
          `<?php\n$s = array_count_values(explode(" ", "olma non olma"));\necho $s["olma"], $s["non"];`,
          ['21', '12', '11', '31'],
          0,
        ),
        q(
          'order',
          'Qaysi chaqiruvda argumentlar tartibi **to‘g‘ri**?',
          [
            '`array_map($callback, $massiv)` va `array_filter($massiv, $callback)`',
            '`array_map($massiv, $callback)` va `array_filter($callback, $massiv)`',
            'Ikkalasida ham callback birinchi',
            'Ikkalasida ham massiv birinchi',
          ],
          [0],
        ),
      ]),
    },
  ],
};
