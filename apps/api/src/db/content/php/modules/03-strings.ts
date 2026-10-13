import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m03: ModuleDef = {
  title: 'Satrlar',
  lessons: [
    {
      slug: 'php-strings',
      title: 'Satrlar',
      quiz: dars('Satrlar — test', [
        natija(
          'concat',
          `<?php\n$ism = "Ali";\n$toliq = $ism . " " . "Valiyev";\n$toliq .= "!";\necho $toliq;`,
          ['Ali Valiyev!', 'AliValiyev!', 'Ali Valiyev', '$ism Valiyev!'],
          0,
        ),
        natija(
          'array-interp',
          `<?php\n$kurs = ['nom' => 'PHP', 'darslar' => 63];\necho "Kurs: {$kurs['nom']}, {$kurs['darslar']} dars";`,
          [
            'Kurs: PHP, 63 dars',
            "Kurs: {$kurs['nom']}, {$kurs['darslar']} dars",
            'Kurs: Array, Array dars',
            XATO,
          ],
          0,
        ),
        natija(
          'mb',
          `<?php\necho strlen("O‘zbekiston"), " ", mb_strlen("O‘zbekiston");`,
          ['13 11', '11 11', '11 13', '13 13'],
          0,
        ),
        natija(
          'nowdoc',
          `<?php\n$ism = "Ali";\necho <<<'MATN'\nSalom, $ism\nMATN;`,
          ['Salom, $ism', 'Salom, Ali', 'Salom, ', XATO],
          0,
        ),
        q(
          'plus',
          '`"Web" + "dizayn"` haqida qaysi gap to‘g‘ri?',
          [
            '`+` satrlarni ulamaydi; son bo‘lmagan satrlar bilan PHP 8 xato beradi — ulash uchun `.`',
            'Natija `Webdizayn`',
            'Natija `Web dizayn`',
            'Natija `0`',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-string-functions',
      title: 'Satr funksiyalari',
      quiz: dars('Satr funksiyalari — test', [
        natija(
          'substr',
          `<?php\necho substr("JavaScript", 4, 3);`,
          ['Scr', 'Scri', 'aSc', 'Script'],
          0,
        ),
        natija(
          'substr-neg',
          `<?php\necho substr("JavaScript", -6);`,
          ['Script', 'JavaSc', 'tpircS', 'ript'],
          0,
        ),
        natija(
          'strpos-zero',
          `<?php\nif (strpos("PHP kursi", "PHP")) {\n    echo "topildi";\n} else {\n    echo "topilmadi";\n}`,
          ['topilmadi', 'topildi', '0', XATO],
          0,
        ),
        natija(
          'replace',
          `<?php\necho str_replace([" ", "-"], "", "+998 90-123");`,
          ['+99890123', '+998 90-123', '+998 90123', '+99890-123'],
          0,
        ),
        natija(
          'nested',
          `<?php\necho ucfirst(strtolower(trim("  aLI ")));`,
          ['Ali', 'ALI', 'ali', '  Ali '],
          0,
        ),
      ]),
    },
    {
      slug: 'php-string-format',
      title: 'Satrlarni formatlash',
      quiz: dars('Formatlash va 3-modul yakuni — test', [
        natija(
          'printf',
          `<?php\nprintf("%s: %d ta, %.2f so‘m", "Non", 3, 4000);`,
          [
            'Non: 3 ta, 4000.00 so‘m',
            'Non: 3 ta, 4000 so‘m',
            '%s: %d ta, %.2f so‘m',
            'Non: 3.00 ta, 4000 so‘m',
          ],
          0,
        ),
        natija('pad', `<?php\necho sprintf("%05d", 42);`, ['00042', '42000', '42', '   42'], 0),
        natija(
          'percent',
          `<?php\necho sprintf("%d%% chegirma", 20);`,
          ['20% chegirma', '20%% chegirma', '%d% chegirma', '20 chegirma'],
          0,
        ),
        natija(
          'number',
          `<?php\necho number_format(1234567.891, 2, '.', ' ');`,
          ['1 234 567.89', '1,234,567.89', '1234567.89', '1 234 567.891'],
          0,
        ),
        natija(
          'escape',
          `<?php\necho htmlspecialchars('<b>salom</b>');`,
          ['&lt;b&gt;salom&lt;/b&gt;', '<b>salom</b>', 'salom', '&lt;salom&gt;'],
          0,
        ),
        q(
          'mb',
          'O‘zbekcha matnning birinchi harfini olish uchun qaysi biri to‘g‘ri?',
          ['`mb_substr($s, 0, 1)`', '`$s[0]`', '`substr($s, 0, 1)`', '`strrev($s)`'],
          [0],
        ),
      ]),
    },
  ],
};
