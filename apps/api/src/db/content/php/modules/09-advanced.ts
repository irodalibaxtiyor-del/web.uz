import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m09: ModuleDef = {
  title: 'Qo‘shimcha imkoniyatlar',
  lessons: [
    {
      slug: 'php-date',
      title: 'Sana va vaqt',
      quiz: dars('Sana va vaqt — test', [
        natija(
          'format',
          `<?php\ndate_default_timezone_set('Asia/Tashkent');\n$t = mktime(14, 5, 0, 3, 8, 2026);\necho date('d.m.Y H:i', $t);`,
          ['08.03.2026 14:05', '03.08.2026 14:05', '8.3.2026 2:05', '2026-03-08 14:05'],
          0,
        ),
        natija(
          'weekday',
          `<?php\ndate_default_timezone_set('Asia/Tashkent');\necho date('N', mktime(0, 0, 0, 3, 8, 2026));`,
          ['7', '0', '1', '6'],
          0,
        ),
        natija(
          'diff',
          `<?php\n$f = (new DateTime('2026-09-01'))->diff(new DateTime('2026-12-31'));\necho $f->days, ' ', $f->m;`,
          ['121 3', '120 4', '121 4', '122 3'],
          0,
        ),
        natija(
          'month-end',
          `<?php\necho date('d.m.Y', strtotime('2026-01-31 +1 month'));`,
          ['03.03.2026', '28.02.2026', '31.02.2026', '01.03.2026'],
          0,
        ),
        natija(
          'immutable',
          `<?php\n$a = new DateTimeImmutable('2026-09-01');\n$b = $a->add(new DateInterval('P10D'));\necho $a->format('d'), ' ', $b->format('d');`,
          ['01 11', '11 11', '01 01', '10 11'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-include',
      title: 'include va require',
      quiz: dars('include va require — test', [
        q(
          'missing',
          '`require` bilan ulangan fayl topilmasa nima bo‘ladi?',
          [
            '`Fatal error` — skript to‘xtaydi',
            '`Warning`, skript davom etadi',
            'Hech narsa',
            'Fayl avtomatik yaratiladi',
          ],
          [0],
        ),
        q(
          'once',
          'Funksiyalar e’lon qilingan `funksiyalar.php` ni ulash uchun eng to‘g‘ri tanlov?',
          ['`require_once`', '`include`', '`require`', '`echo file_get_contents(...)`'],
          [0],
        ),
        q(
          'dir',
          "Nega `require 'inc/config.php'` o‘rniga `require __DIR__ . '/inc/config.php'` yoziladi?",
          [
            'Nisbiy yo‘l skript qayerdan ishga tushirilganiga bog‘liq; `__DIR__` — doim joriy fayl papkasi',
            '`__DIR__` faylni tezroq yuklaydi',
            'Aks holda fayl ikki marta ulanadi',
            'Bu faqat Windows uchun kerak',
          ],
          [0],
        ),
        q(
          'lfi',
          "`include $_GET['sahifa'] . '.php';` kodi haqida qaysi gap to‘g‘ri?",
          [
            'Xavfli — hujumchi serverdagi boshqa fayllarni ulay oladi; faqat ruxsat etilgan ro‘yxatdan tanlash kerak',
            'Xavfsiz, chunki oxiriga `.php` qo‘shilgan',
            'Xavfsiz, agar `include_once` ishlatilsa',
            'Bu kod PHP 8 da ishlamaydi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-regex',
      title: 'Muntazam ifodalar',
      quiz: dars('RegEx — test', [
        natija(
          'match',
          `<?php\nforeach (['+998 90 123 45 67', '+99890 1234567'] as $t) {\n    echo preg_match('/^\\+998 \\d{2} \\d{3} \\d{2} \\d{2}$/', $t);\n}`,
          ['10', '11', '01', '00'],
          0,
        ),
        natija(
          'match-all',
          `<?php\npreg_match_all('/\\d+/', 'Narx 12 500, chegirma 10%', $m);\necho implode(',', $m[0]);`,
          ['12,500,10', '1250010', '12500,10', '12,500,10%'],
          0,
        ),
        natija(
          'groups',
          `<?php\npreg_match('/^(\\d{4})-(\\d{2})-(\\d{2})$/', '2026-03-08', $m);\necho $m[2], '/', $m[1];`,
          ['03/2026', '2026/03', '08/03', '03/08'],
          0,
        ),
        natija(
          'replace',
          `<?php\necho preg_replace('/\\D/', '', '+998 (90) 123-45-67');`,
          ['998901234567', '+998901234567', '+998 (90) 123-45-67', '9989012345'],
          0,
        ),
        q(
          'u-flag',
          'O‘zbekcha (UTF-8) matn bilan ishlashda naqshga qaysi bayroq qo‘shiladi?',
          ['`u`', '`i`', '`g`', '`m`'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-filters',
      title: 'Filtrlar',
      quiz: dars('Filtrlar va 9-modul yakuni — test', [
        natija(
          'int-space',
          `<?php\nvar_dump(filter_var(' 42 ', FILTER_VALIDATE_INT));`,
          ['int(42)\n', 'bool(false)\n', 'string(4) " 42 "\n', 'int(0)\n'],
          0,
        ),
        natija(
          'float-comma',
          `<?php\nvar_dump(filter_var('12,5', FILTER_VALIDATE_FLOAT));`,
          ['bool(false)\n', 'float(12.5)\n', 'float(125)\n', 'int(12)\n'],
          0,
        ),
        natija(
          'bool',
          `<?php\nvar_dump(filter_var('abc', FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE));`,
          ['NULL\n', 'bool(false)\n', 'bool(true)\n', XATO],
          0,
        ),
        natija(
          'array',
          `<?php\n$t = filter_var_array(['yosh' => '17', 'email' => 'madina@mail.uz'], [\n    'yosh' => ['filter' => FILTER_VALIDATE_INT, 'options' => ['min_range' => 18]],\n    'email' => FILTER_VALIDATE_EMAIL,\n]);\nforeach ($t as $m => $q) {\n    echo $m, ':', $q === false ? 'xato' : 'ok', ' ';\n}`,
          [
            'yosh:xato email:ok ',
            'yosh:ok email:ok ',
            'yosh:xato email:xato ',
            'yosh:ok email:xato ',
          ],
          0,
        ),
        natija(
          'url',
          `<?php\nvar_dump(filter_var('www.webdizayn.uz', FILTER_VALIDATE_URL));`,
          ['bool(false)\n', 'string(16) "www.webdizayn.uz"\n', 'bool(true)\n', XATO],
          0,
        ),
        q(
          'approach',
          'Kiritilgan ma’lumotga eng to‘g‘ri yondashuv?',
          [
            'Kiritishda tekshirish (noto‘g‘ri bo‘lsa rad etish), chiqarishda kodlash',
            'Hammasini `FILTER_SANITIZE_*` bilan tozalab, qabul qilish',
            'Faqat brauzerda tekshirish',
            'Faqat bazaga yozishdan oldin `strip_tags`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
