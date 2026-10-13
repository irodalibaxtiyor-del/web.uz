import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m08: ModuleDef = {
  title: 'Formalar va superglobal’lar',
  lessons: [
    {
      slug: 'php-superglobals',
      title: 'Superglobal o‘zgaruvchilar',
      quiz: dars('Superglobal’lar — test', [
        natija(
          'get-default',
          `<?php\n$_GET = ["daraja" => "orta"];\n$daraja = $_GET["daraja"] ?? "hammasi";\n$sahifa = (int) ($_GET["sahifa"] ?? 1);\necho "$daraja $sahifa";`,
          ['orta 1', 'hammasi 1', 'orta 0', XATO],
          0,
        ),
        natija(
          'string-type',
          `<?php\n$_GET = ["sahifa" => "2"];\nvar_dump($_GET["sahifa"]);`,
          ['string(1) "2"\n', 'int(2)\n', 'float(2)\n', 'bool(true)\n'],
          0,
        ),
        natija(
          'build-query',
          `<?php\necho http_build_query(["q" => "flex box", "sahifa" => 2]);`,
          [
            'q=flex+box&sahifa=2',
            'q=flex box&sahifa=2',
            '?q=flex+box&sahifa=2',
            'q=flex%20box,sahifa=2',
          ],
          0,
        ),
        q(
          'trust',
          'Qaysi ma’lumotlarni foydalanuvchi soxtalashtira oladi? (bir nechta javob)',
          [
            '`$_GET` parametrlari',
            '`$_POST` maydonlari',
            "`$_SERVER['HTTP_USER_AGENT']`",
            '`$_COOKIE` qiymatlari',
          ],
          [0, 1, 2, 3],
        ),
        q(
          'request',
          'Nega `$_REQUEST` ishlatilmaydi?',
          [
            'U GET, POST va cookie’larni aralashtiradi — qiymat qayerdan kelgani noaniq',
            'U PHP 8 da olib tashlangan',
            'U faqat fayllarni saqlaydi',
            'U sekin ishlaydi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-forms',
      title: 'Formalarni qayta ishlash',
      quiz: dars('Formalar — test', [
        natija(
          'checkbox',
          `<?php\n$_POST = ["ism" => "Ali"];\n$obuna = isset($_POST["obuna"]);\nvar_dump($obuna);`,
          ['bool(false)\n', 'bool(true)\n', 'NULL\n', XATO],
          0,
        ),
        natija(
          'allowed',
          `<?php\n$_POST = ["daraja" => "admin"];\n$daraja = $_POST["daraja"] ?? "";\nif (!in_array($daraja, ["boshlangich", "orta", "yuqori"], true)) {\n    $daraja = "boshlangich";\n}\necho $daraja;`,
          ['boshlangich', 'admin', '', XATO],
          0,
        ),
        natija(
          'array-field',
          `<?php\n$_POST = ["kurslar" => ["html", "css"]];\n$k = (array) ($_POST["kurslar"] ?? []);\necho count($k), ":", implode(",", $k);`,
          ['2:html,css', '1:Array', '0:', XATO],
          0,
        ),
        q(
          'method',
          'Parolni o‘zgartirish formasi qaysi usulda yuborilishi kerak?',
          ['`POST`', '`GET`', 'Farqi yo‘q', 'Cookie orqali'],
          [0],
        ),
        q(
          'prg',
          "Muvaffaqiyatli POST’dan keyin `header('Location: rahmat.php'); exit;` nima uchun kerak?",
          [
            'Sahifa yangilanganda forma qayta yuborilmasligi uchun (POST → Redirect → GET)',
            'Sahifani tezlashtirish uchun',
            'Xatolarni yashirish uchun',
            'Cookie’ni o‘chirish uchun',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-form-validation',
      title: 'Formani tekshirish',
      quiz: dars('Validatsiya — test', [
        natija(
          'zero-int',
          `<?php\nvar_dump(filter_var("0", FILTER_VALIDATE_INT));`,
          ['int(0)\n', 'bool(false)\n', 'string(1) "0"\n', 'NULL\n'],
          0,
        ),
        natija(
          'range',
          `<?php\n$y = filter_var("150", FILTER_VALIDATE_INT, ["options" => ["min_range" => 7, "max_range" => 100]]);\nvar_dump($y);`,
          ['bool(false)\n', 'int(100)\n', 'int(150)\n', XATO],
          0,
        ),
        natija(
          'email',
          `<?php\nforeach (["ali@webdizayn.uz", "ali@", "ali.uz"] as $e) {\n    echo filter_var($e, FILTER_VALIDATE_EMAIL) === false ? "X" : "OK", " ";\n}`,
          ['OK X X ', 'OK OK X ', 'OK X OK ', 'X X X '],
          0,
        ),
        natija(
          'errors',
          `<?php\n$x = [];\n$ism = trim("   ");\nif ($ism === "") $x["ism"] = "Ismni kiriting";\nif (mb_strlen("parol") < 8) $x["parol"] = "Qisqa";\necho count($x), " ", implode(",", array_keys($x));`,
          ['2 ism,parol', '1 parol', '0 ', '2 0,1'],
          0,
        ),
        q(
          'server',
          'Brauzerda `required` va JavaScript tekshiruvi bor. Serverda ham tekshirish kerakmi?',
          [
            'Ha — brauzer tekshiruvini chetlab o‘tish oson',
            'Yo‘q, brauzer yetarli',
            'Faqat email uchun',
            'Faqat GET so‘rovlarda',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-form-security',
      title: 'Formalar xavfsizligi',
      quiz: dars('Xavfsizlik va 8-modul yakuni — test', [
        natija(
          'escape',
          `<?php\necho htmlspecialchars("<b>\\"Ali\\" & Vali</b>");`,
          [
            '&lt;b&gt;&quot;Ali&quot; &amp; Vali&lt;/b&gt;',
            '<b>"Ali" & Vali</b>',
            '"Ali" & Vali',
            '&lt;b&gt;"Ali" & Vali&lt;/b&gt;',
          ],
          0,
        ),
        natija(
          'token',
          `<?php\necho strlen(bin2hex(random_bytes(32)));`,
          ['64', '32', '16', '128'],
          0,
        ),
        q(
          'xss',
          'XSS’dan himoyaning asosiy qoidasi?',
          [
            'Foydalanuvchi matnini HTML’ga chiqarishda `htmlspecialchars` bilan kodlash',
            'Bazaga saqlashdan oldin `strip_tags`',
            'Formada `required` qo‘yish',
            'Faqat POST ishlatish',
          ],
          [0],
        ),
        q(
          'csrf',
          'CSRF hujumidan nima himoya qiladi? (bir nechta javob)',
          [
            'Sessiyadagi tasodifiy token va uni `hash_equals` bilan tekshirish',
            '`SameSite` cookie atributi',
            '`htmlspecialchars`',
            'Formadagi `placeholder`',
          ],
          [0, 1],
        ),
        q(
          'sqli',
          'SQL injection’ning oldini olishning to‘g‘ri yo‘li?',
          [
            'Tayyorlangan so‘rovlar (prepared statements) — qiymatlar SQL matniga ulanmaydi',
            'Satrga `addslashes` qo‘llab ulash',
            'Qiymatni `htmlspecialchars` qilib ulash',
            'Faqat GET o‘rniga POST ishlatish',
          ],
          [0],
        ),
        q(
          'login-error',
          'Kirish muvaffaqiyatsiz bo‘lganda qaysi xabar to‘g‘ri?',
          [
            '“Email yoki parol noto‘g‘ri”',
            '“Bunday email yo‘q”',
            '“Parol noto‘g‘ri, email to‘g‘ri”',
            'Xatoning to‘liq matni va fayl yo‘li',
          ],
          [0],
        ),
      ]),
    },
  ],
};
