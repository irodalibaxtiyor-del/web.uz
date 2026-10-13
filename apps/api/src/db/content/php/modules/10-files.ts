import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m10: ModuleDef = {
  title: 'Fayllar',
  lessons: [
    {
      slug: 'php-files-read',
      title: 'Fayllarni o‘qish',
      quiz: dars('Fayllarni o‘qish — test', [
        natija(
          'file-lines',
          `<?php\n$f = sys_get_temp_dir() . '/royxat.txt';\nfile_put_contents($f, "HTML\\n\\nCSS\\nPHP\\n");\n$q = file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);\necho count($q), ':', implode(',', $q);`,
          ['3:HTML,CSS,PHP', '4:HTML,,CSS,PHP', '5:HTML,,CSS,PHP,', '1:HTML'],
          0,
        ),
        natija(
          'missing',
          `<?php\n$f = sys_get_temp_dir() . '/yoq.txt';\nvar_dump(is_file($f));`,
          ['bool(false)\n', 'bool(true)\n', 'NULL\n', XATO],
          0,
        ),
        natija(
          'pathinfo',
          `<?php\n$p = pathinfo('/uploads/rasm.Final.PNG');\necho $p['filename'], ' ', strtolower($p['extension']);`,
          ['rasm.Final png', 'rasm Final.png', 'rasm.Final PNG', 'rasm png'],
          0,
        ),
        natija(
          'csv',
          `<?php\n$f = sys_get_temp_dir() . '/t.csv';\nfile_put_contents($f, "ism,ball\\n\\"Ali, Vali\\",85\\n");\n$h = fopen($f, 'r');\nfgetcsv($h);\n$r = fgetcsv($h);\nfclose($h);\necho $r[0], '=', $r[1];`,
          ['Ali, Vali=85', '"Ali=Vali"', 'ism=ball', 'Ali= Vali'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-files-write',
      title: 'Fayllarga yozish',
      quiz: dars('Fayllarga yozish — test', [
        natija(
          'append',
          `<?php\n$f = sys_get_temp_dir() . '/e.txt';\nfile_put_contents($f, "A");\nfile_put_contents($f, "B", FILE_APPEND);\nfile_put_contents($f, "C");\necho file_get_contents($f);`,
          ['C', 'ABC', 'AC', 'BC'],
          0,
        ),
        natija(
          'bytes',
          `<?php\necho file_put_contents(sys_get_temp_dir() . '/b.txt', "Salom\\n");`,
          ['6', '5', '1', 'true'],
          0,
        ),
        natija(
          'w-mode',
          `<?php\n$f = sys_get_temp_dir() . '/w.txt';\nfile_put_contents($f, "eski mazmun");\n$h = fopen($f, 'w');\nfclose($h);\necho strlen(file_get_contents($f));`,
          ['0', '11', '1', XATO],
          0,
        ),
        natija(
          'json',
          `<?php\necho json_encode(['matn' => 'o‘qish'], JSON_UNESCAPED_UNICODE);`,
          ['{"matn":"o‘qish"}', '{"matn":"o\\u2018qish"}', '[matn => o‘qish]', '{matn:"o‘qish"}'],
          0,
        ),
        q(
          'lock',
          'Bir nechta so‘rov bir vaqtda faylga yozganda mazmun aralashmasligi uchun nima qo‘shiladi?',
          ['`LOCK_EX`', '`FILE_APPEND`', '`JSON_PRETTY_PRINT`', '`chmod 777`'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-file-upload',
      title: 'Fayl yuklash',
      quiz: dars('Fayl yuklash va 10-modul yakuni — test', [
        natija(
          'ext',
          `<?php\n$ext = strtolower(pathinfo('Avatar.JPG', PATHINFO_EXTENSION));\nvar_dump(in_array($ext, ['png', 'jpg', 'jpeg'], true));`,
          ['bool(true)\n', 'bool(false)\n', 'string(3) "jpg"\n', XATO],
          0,
        ),
        natija(
          'size',
          `<?php\nconst MAKS = 2 * 1024 * 1024;\n$hajm = 3000000;\necho $hajm > MAKS ? 'katta' : 'ok';`,
          ['katta', 'ok', '2097152', XATO],
          0,
        ),
        q(
          'enctype',
          'Fayl yuborish formasida nima **shart**?',
          [
            '`enctype="multipart/form-data"` va `method="post"`',
            'Faqat `method="get"`',
            '`accept="*"`',
            '`novalidate`',
          ],
          [0],
        ),
        q(
          'trust',
          "`$_FILES['rasm']` dagi qaysi maydonlarga **ishonib bo‘lmaydi**? (bir nechta javob)",
          ['`name`', '`type`', '`tmp_name`', '`error`'],
          [0, 1],
        ),
        q(
          'type',
          'Yuklangan faylning haqiqiy turini qanday aniqlash kerak?',
          [
            'Serverda, mazmuni bo‘yicha (`finfo`)',
            'Fayl kengaytmasidan',
            "`$_FILES[...]['type']` dan",
            'Fayl nomidan',
          ],
          [0],
        ),
        q(
          'name',
          'Yuklangan faylni qanday nom bilan saqlash xavfsiz?',
          [
            'Server yaratgan tasodifiy nom + aniqlangan turdan kengaytma, veb-papkadan tashqarida',
            'Foydalanuvchi bergan nom bilan, sayt ildizida',
            'Foydalanuvchi nomi + `.php`',
            'Har doim `rasm.png`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
