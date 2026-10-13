import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m11: ModuleDef = {
  title: 'Cookie, sessiya, JSON va istisnolar',
  lessons: [
    {
      slug: 'php-cookies',
      title: 'Cookie’lar',
      quiz: dars('Cookie’lar — test', [
        natija(
          'read',
          `<?php\n$_COOKIE = ['til' => 'ru'];\necho $_COOKIE['til'] ?? 'uz', ' ', $_COOKIE['mavzu'] ?? 'yorug‘';`,
          ['ru yorug‘', 'uz yorug‘', 'ru ', XATO],
          0,
        ),
        natija(
          'allowed',
          `<?php\n$_COOKIE = ['til' => 'fr'];\n$til = $_COOKIE['til'] ?? 'uz';\nif (!in_array($til, ['uz', 'ru', 'en'], true)) {\n    $til = 'uz';\n}\necho $til;`,
          ['uz', 'fr', '', XATO],
          0,
        ),
        q(
          'headers',
          '`echo "Salom";` dan keyin `setcookie(...)` chaqirilsa nima bo‘ladi?',
          [
            '`Warning: Cannot modify header information - headers already sent`, cookie o‘rnatilmaydi',
            'Cookie oddiy o‘rnatiladi',
            '`echo` bekor qilinadi',
            'Sahifa qayta yuklanadi',
          ],
          [0],
        ),
        q(
          'httponly',
          '`httponly => true` nima beradi?',
          [
            'JavaScript cookie’ni o‘qiy olmaydi — XSS orqali o‘g‘irlash qiyinlashadi',
            'Cookie faqat HTTP orqali (HTTPS emas) yuboriladi',
            'Cookie hech qachon o‘chmaydi',
            'Cookie shifrlanadi',
          ],
          [0],
        ),
        q(
          'user-id',
          'Kirgan foydalanuvchi ID’sini cookie’da (`user_id=7`) saqlash nega xato?',
          [
            'Foydalanuvchi qiymatni o‘zgartirib, boshqa akkauntga kira oladi',
            'Cookie’ga son yozib bo‘lmaydi',
            'Cookie juda kichik',
            'Bu sekin',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-sessions',
      title: 'Sessiyalar',
      quiz: dars('Sessiyalar — test', [
        q(
          'where',
          '`$_SESSION` ma’lumotlari qayerda saqlanadi?',
          [
            'Serverda; brauzerda faqat sessiya ID’si',
            'Brauzer cookie’sida',
            'URL’da',
            '`localStorage` da',
          ],
          [0],
        ),
        q(
          'regenerate',
          'Foydalanuvchi muvaffaqiyatli kirgandan keyin nega `session_regenerate_id(true)` chaqiriladi?',
          [
            'Session fixation hujumining oldini olish uchun',
            'Sessiyani o‘chirish uchun',
            'Parolni yangilash uchun',
            'Cookie hajmini kichraytirish uchun',
          ],
          [0],
        ),
        q(
          'exit',
          "`header('Location: kirish.php');` dan keyin nega `exit;` yoziladi?",
          [
            'Usiz skript davom etadi va himoyalangan mazmun baribir bajariladi/yuboriladi',
            '`header` faqat `exit` bilan ishlaydi',
            'Sessiyani saqlash uchun',
            'Bu shart emas, uslub masalasi',
          ],
          [0],
        ),
        natija(
          'flash',
          `<?php\n$_SESSION = ['flash' => 'Saqlandi'];\n$x = $_SESSION['flash'] ?? null;\nunset($_SESSION['flash']);\necho $x, ' ', $_SESSION['flash'] ?? 'yo‘q';`,
          ['Saqlandi yo‘q', 'Saqlandi Saqlandi', ' yo‘q', XATO],
          0,
        ),
        natija(
          'counter',
          `<?php\n$_SESSION = [];\nforeach ([1, 2, 3] as $_) {\n    $_SESSION['korish'] = ($_SESSION['korish'] ?? 0) + 1;\n}\necho $_SESSION['korish'];`,
          ['3', '1', '0', '6'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-json',
      title: 'JSON',
      quiz: dars('JSON — test', [
        natija(
          'encode',
          `<?php\necho json_encode(['ism' => 'Ali', 'otdi' => true, 'izoh' => null]);`,
          [
            '{"ism":"Ali","otdi":true,"izoh":null}',
            '["Ali",true,null]',
            '{"ism":"Ali","otdi":1,"izoh":""}',
            '{ism:"Ali",otdi:true}',
          ],
          0,
        ),
        natija(
          'holes',
          `<?php\necho json_encode([1 => 'a', 2 => 'b']), json_encode(array_values([1 => 'a', 2 => 'b']));`,
          [
            '{"1":"a","2":"b"}["a","b"]',
            '["a","b"]["a","b"]',
            '{"1":"a","2":"b"}{"0":"a","1":"b"}',
            '[null,"a","b"]["a","b"]',
          ],
          0,
        ),
        natija(
          'decode',
          `<?php\n$o = json_decode('{"ism":"Ali","kurslar":["HTML","CSS"]}');\n$a = json_decode('{"ism":"Vali"}', true);\necho $o->kurslar[1], ' ', $a['ism'];`,
          ['CSS Vali', 'HTML Vali', 'CSS Ali', XATO],
          0,
        ),
        natija(
          'bad',
          `<?php\ntry {\n    json_decode('{yomon}', flags: JSON_THROW_ON_ERROR);\n    echo 'ok';\n} catch (JsonException $e) {\n    echo 'xato';\n}`,
          ['xato', 'ok', 'okxato', ''],
          0,
        ),
        q(
          'input',
          'JavaScript `fetch` bilan JSON tanali POST yuborsa, PHP’da ma’lumot qayerdan o‘qiladi?',
          [
            "`file_get_contents('php://input')` + `json_decode`",
            '`$_POST`',
            '`$_GET`',
            '`$_COOKIE`',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-exceptions',
      title: 'Istisnolar',
      quiz: dars('Istisnolar va 11-modul yakuni — test', [
        natija(
          'flow',
          `<?php\ntry {\n    echo 'A';\n    throw new RuntimeException('x');\n    echo 'B';\n} catch (RuntimeException $e) {\n    echo 'C';\n} finally {\n    echo 'D';\n}`,
          ['ACD', 'ABCD', 'AD', 'ABD'],
          0,
        ),
        natija(
          'finally-return',
          `<?php\nfunction f(): string\n{\n    try {\n        return 'try';\n    } finally {\n        echo 'finally ';\n    }\n}\necho f();`,
          ['finally try', 'try finally ', 'try', 'finally '],
          0,
        ),
        natija(
          'error-vs-exception',
          `<?php\ntry {\n    try {\n        intdiv(1, 0);\n    } catch (Exception $e) {\n        echo 'Exception';\n    }\n} catch (Error $e) {\n    echo get_class($e);\n}`,
          ['DivisionByZeroError', 'Exception', 'Error', XATO],
          0,
        ),
        natija(
          'custom',
          `<?php\nclass TekshiruvXatosi extends Exception\n{\n    public function __construct(public string $maydon, string $xabar)\n    {\n        parent::__construct($xabar);\n    }\n}\ntry {\n    throw new TekshiruvXatosi('email', 'Noto‘g‘ri');\n} catch (TekshiruvXatosi $e) {\n    echo $e->maydon, ': ', $e->getMessage();\n}`,
          ['email: Noto‘g‘ri', ': Noto‘g‘ri', 'email: ', XATO],
          0,
        ),
        q(
          'user-message',
          'Kutilmagan xato yuz berdi. Foydalanuvchiga nima ko‘rsatiladi?',
          [
            'Umumiy xabar; tafsilotlar (matn, iz, fayl yo‘li) faqat server logiga',
            'To‘liq xato matni va stack trace',
            'SQL so‘rovi va parametrlari',
            'Hech narsa — oq sahifa',
          ],
          [0],
        ),
        q(
          'throwable',
          'Barcha xatolarni (jumladan `TypeError`) ushlash uchun qaysi tur?',
          [
            '`Throwable`',
            '`Exception`',
            '`RuntimeException`',
            '`Error` va `Exception` faqat alohida',
          ],
          [0],
        ),
      ]),
    },
  ],
};
