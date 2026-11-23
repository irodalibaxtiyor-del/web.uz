import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** PHP course glossary. Each term points to the lesson that introduces it. */
export const PHP_GLOSSARY: GlossaryDef[] = [
  t(
    'PHP',
    'Serverda bajariladigan dasturlash tili: so‘rovni qayta ishlab, brauzerga tayyor HTML yuboradi.',
    'php-intro',
  ),
  t(
    'Server',
    'So‘rovlarni qabul qilib javob qaytaradigan kompyuter yoki dastur (Apache, Nginx, `php -S`).',
    'php-intro',
  ),
  t(
    'HTTP so‘rov',
    'Brauzerning serverga murojaati: usul (GET, POST), manzil, sarlavhalar va ma’lumot.',
    'php-intro',
  ),
  t(
    'O‘rnatilgan server',
    'Ishlab chiqish uchun PHP’ning o‘z serveri.',
    'php-install',
    'php -S localhost:8000',
  ),
  t(
    'PHP bloki',
    '`<?php … ?>` orasidagi kod; faqat PHP bo‘lgan faylda yopuvchi `?>` yozilmaydi.',
    'php-syntax',
  ),
  t(
    'DocBlock',
    '`/** … */` ko‘rinishidagi hujjatlash izohi: parametr va qaytish turlarini tasvirlaydi.',
    'php-comments',
  ),
  t(
    'O‘zgaruvchi',
    '`$` bilan boshlanadigan nomli qiymat; nomlar katta-kichik harfni farqlaydi.',
    'php-variables',
    "$ism = 'Ali';",
  ),
  t('isset()', 'O‘zgaruvchi mavjud va `null` emasligini tekshiradi.', 'php-variables'),
  t(
    'echo',
    'Qiymatni chiqaruvchi til konstruksiyasi; bir nechta qiymatni vergul bilan qabul qiladi.',
    'php-echo-print',
  ),
  t(
    'var_dump()',
    'Qiymatni turi va uzunligi bilan chiqaradi — xato qidirish uchun.',
    'php-echo-print',
  ),
  t(
    'htmlspecialchars()',
    'Matndagi `<`, `>`, `"`, `&` belgilarini xavfsiz ko‘rinishga o‘tkazadi — XSS’dan himoya.',
    'php-echo-print',
  ),
  t(
    'Ma’lumot turi',
    'Qiymat turi: `int`, `float`, `string`, `bool`, `array`, `object`, `null`.',
    'php-data-types',
  ),
  t(
    'Heredoc',
    '`<<<` bilan boshlanadigan ko‘p qatorli satr; ichida o‘zgaruvchilar almashtiriladi.',
    'php-strings',
  ),
  t(
    'Interpolatsiya',
    'Qo‘sh qo‘shtirnoqli satr ichidagi o‘zgaruvchining qiymat bilan almashtirilishi.',
    'php-strings',
    '"Salom, $ism"',
  ),
  t(
    'mb_ funksiyalari',
    'Ko‘p baytli (UTF-8) satrlar bilan to‘g‘ri ishlaydigan funksiyalar: `mb_strlen`, `mb_substr`.',
    'php-string-functions',
  ),
  t(
    'sprintf()',
    'Shablon bo‘yicha formatlangan satr qaytaradi: `%s`, `%d`, `%.2f`.',
    'php-string-format',
  ),
  t(
    'number_format()',
    'Sonni minglik ajratgich va kasr xonalari bilan formatlaydi.',
    'php-string-format',
  ),
  t('intdiv()', 'Butun bo‘lish natijasini qaytaradi.', 'php-numbers-math'),
  t(
    'Casting',
    'Qiymatni aniq turga aylantirish: `(int)`, `(float)`, `(string)`, `(bool)`.',
    'php-casting',
  ),
  t(
    'Konstanta',
    'O‘zgarmas qiymat; `const` yoki `define()` bilan e’lon qilinadi, `$` siz yoziladi.',
    'php-constants',
  ),
  t(
    'Null coalescing',
    '`??` — chap qiymat `null` yoki mavjud bo‘lmasa o‘ngdagini oladi.',
    'php-operators',
    "$ism = $_GET['ism'] ?? 'Mehmon';",
  ),
  t(
    'Spaceship operatori',
    '`<=>` — chap kichik bo‘lsa −1, teng bo‘lsa 0, katta bo‘lsa 1; saralashda qulay.',
    'php-operators',
  ),
  t('Qat’iy taqqoslash', '`===` — tur va qiymatni birga solishtiradi.', 'php-comparison'),
  t(
    'hash_equals()',
    'Satrlarni doimiy vaqtda solishtiradi — token va xeshlarni tekshirish uchun.',
    'php-comparison',
  ),
  t('match', 'Qat’iy solishtiradigan va qiymat qaytaradigan ifoda (PHP 8).', 'php-switch-match'),
  t(
    'foreach',
    'Massiv yoki obyekt elementlari bo‘ylab aylanadigan sikl.',
    'php-foreach',
    'foreach ($ballar as $ism => $ball) { … }',
  ),
  t(
    'Funksiya',
    'Nom berilgan, qayta ishlatiladigan kod bloki; parametr va qaytish turlari ko‘rsatilishi mumkin.',
    'php-functions',
  ),
  t('Rekursiya', 'Funksiyaning o‘zini o‘zi chaqirishi.', 'php-functions'),
  t(
    'Nomlangan argumentlar',
    "Argumentni parametr nomi bilan berish: `yarat(ism: 'Ali')` (PHP 8).",
    'php-function-args',
  ),
  t(
    'Variadic',
    '`...$sonlar` — o‘zgaruvchan sondagi argumentlarni massiv sifatida oladi.',
    'php-function-args',
  ),
  t(
    'Ko‘rinish doirasi',
    'O‘zgaruvchi ko‘rinadigan joy; funksiya tashqi o‘zgaruvchilarni ko‘rmaydi.',
    'php-scope',
  ),
  t(
    'Closure',
    'Anonim funksiya; tashqi o‘zgaruvchini `use` bilan oladi.',
    'php-closures',
    '$f = function ($x) use ($k) { return $x * $k; };',
  ),
  t(
    'Arrow funksiya',
    '`fn($x) => $x * 2` — qisqa anonim funksiya, tashqi o‘zgaruvchilarni avtomatik ko‘radi.',
    'php-closures',
  ),
  t('Massiv', 'Tartiblangan qiymatlar to‘plami; PHP’da qiymat bo‘yicha nusxalanadi.', 'php-arrays'),
  t('Assotsiativ massiv', "Kalitlari satr bo‘lgan massiv: `['ism' => 'Ali']`.", 'php-associative'),
  t(
    'array_key_exists()',
    'Massivda kalit borligini, qiymati `null` bo‘lsa ham, tekshiradi.',
    'php-associative',
  ),
  t('array_column()', 'Ko‘p o‘lchovli massivdan bitta ustunni oladi.', 'php-multidimensional'),
  t(
    'array_map()',
    'Har bir elementga funksiyani qo‘llab, yangi massiv qaytaradi.',
    'php-array-functions',
  ),
  t(
    'array_filter()',
    'Shartni qanoatlantirgan elementlarni (kalitlari bilan) qaytaradi.',
    'php-array-functions',
  ),
  t('usort()', 'Massivni o‘z solishtirish funksiyangiz bilan saralaydi.', 'php-array-sort'),
  t(
    'Superglobal',
    'Hamma joyda ko‘rinadigan maxsus massivlar: `$_GET`, `$_POST`, `$_SERVER`, `$_SESSION` …',
    'php-superglobals',
  ),
  t('$_GET', 'Manzildagi so‘rov parametrlari (`?kurs=php`).', 'php-superglobals'),
  t('$_POST', 'POST usulida yuborilgan forma ma’lumotlari.', 'php-superglobals'),
  t(
    'PRG',
    'Post/Redirect/Get — POST’dan keyin redirect qilish; sahifa yangilanganda forma qayta yuborilmaydi.',
    'php-forms',
  ),
  t(
    'Validatsiya',
    'Kiritilgan ma’lumotni qoidalarga muvofiqligini tekshirish (bo‘sh emas, email, uzunlik …).',
    'php-form-validation',
  ),
  t(
    'filter_var()',
    'Qiymatni filtr bilan tekshiradi yoki tozalaydi (`FILTER_VALIDATE_EMAIL`, `FILTER_VALIDATE_INT`).',
    'php-filters',
  ),
  t(
    'XSS',
    'Sahifaga begona skript kiritish hujumi; chiqarishda `htmlspecialchars` ishlatiladi.',
    'php-form-security',
  ),
  t(
    'CSRF',
    'Foydalanuvchi nomidan uning bilmagan holda so‘rov yuborish hujumi; formaga maxfiy token qo‘shiladi.',
    'php-form-security',
  ),
  t(
    'SQL injection',
    'So‘rovga SQL kodini kiritish hujumi; tayyorlangan so‘rovlar bilan oldi olinadi.',
    'php-form-security',
  ),
  t(
    'require',
    'Boshqa PHP faylni ulaydi; fayl topilmasa dastur to‘xtaydi. `include` — ogohlantirib davom etadi.',
    'php-include',
  ),
  t(
    '__DIR__',
    'Joriy fayl joylashgan papka yo‘li — fayllarni ishonchli ulash uchun.',
    'php-include',
  ),
  t('Timestamp', '1970-yil 1-yanvardan beri o‘tgan soniyalar soni.', 'php-date'),
  t('DateTimeImmutable', 'O‘zgarmas sana obyekti: har amal yangi obyekt qaytaradi.', 'php-date'),
  t('file_get_contents()', 'Faylni butunlay bitta satrga o‘qiydi.', 'php-files-read'),
  t(
    'file_put_contents()',
    'Satrni faylga yozadi; `FILE_APPEND` bilan oxiriga qo‘shadi.',
    'php-files-write',
  ),
  t('$_FILES', 'Yuklangan fayllar haqidagi ma’lumot massivi.', 'php-file-upload'),
  t(
    'move_uploaded_file()',
    'Yuklangan vaqtinchalik faylni xavfsiz tarzda doimiy joyga ko‘chiradi.',
    'php-file-upload',
  ),
  t(
    'Cookie',
    'Brauzer saqlab, har so‘rovda serverga yuboradigan kichik matn; `setcookie()` bilan o‘rnatiladi.',
    'php-cookies',
  ),
  t(
    'Sessiya',
    'Foydalanuvchi ma’lumotini serverda saqlash; brauzerda faqat sessiya identifikatori turadi.',
    'php-sessions',
  ),
  t(
    'session_regenerate_id()',
    'Sessiya identifikatorini almashtiradi — kirishdan keyin session fixation’ning oldini oladi.',
    'php-sessions',
  ),
  t(
    'json_encode()',
    'PHP qiymatini JSON matnga aylantiradi; `json_decode()` — aksincha.',
    'php-json',
  ),
  t('preg_match()', 'Satr muntazam ifodaga mos kelishini tekshiradi.', 'php-regex'),
  t(
    'Istisno',
    'Xato holatini bildiruvchi obyekt (exception); `throw` bilan tashlanadi, `try…catch` bilan ushlanadi.',
    'php-exceptions',
  ),
  t(
    'OOP',
    'Obyektga yo‘naltirilgan dasturlash: ma’lumot va uni qayta ishlovchi metodlar klasslarda birlashadi.',
    'php-oop',
  ),
  t('Klass', 'Obyektlar uchun shablon: xususiyatlar va metodlar.', 'php-classes'),
  t('Obyekt', 'Klassdan `new` bilan yaratilgan nusxa.', 'php-classes', "$t = new Talaba('Ali');"),
  t(
    'Konstruktor',
    '`__construct` — obyekt yaratilganda avtomatik chaqiriladigan metod.',
    'php-constructor',
  ),
  t(
    'readonly',
    'Faqat bir marta (konstruktorda) qiymat beriladigan xususiyat (PHP 8.1).',
    'php-constructor',
  ),
  t(
    'Inkapsulyatsiya',
    'Obyekt ichki holatini yashirib, unga faqat metodlar orqali kirish.',
    'php-access',
  ),
  t(
    'private',
    'Faqat klass ichidan ko‘rinadigan a’zo; `protected` — vorislardan ham, `public` — hamma joydan.',
    'php-access',
  ),
  t(
    'Meros',
    '`extends` — klass boshqa klassning xususiyat va metodlarini oladi.',
    'php-inheritance',
  ),
  t(
    'Polimorfizm',
    'Turli klass obyektlari bir xil metod chaqiruviga o‘zicha javob berishi.',
    'php-inheritance',
  ),
  t(
    'Abstrakt klass',
    'Nusxa yaratib bo‘lmaydigan, vorislar uchun asos klass.',
    'php-abstract-interfaces',
  ),
  t(
    'Interfeys',
    'Klass qaysi metodlarga ega bo‘lishi kerakligini belgilaydigan shartnoma; `implements` bilan.',
    'php-abstract-interfaces',
  ),
  t(
    'static',
    'Klassning o‘ziga tegishli a’zo; `Klass::metod()` ko‘rinishida chaqiriladi.',
    'php-static',
  ),
  t('Trait', 'Bir nechta klassga `use` bilan qo‘shiladigan metodlar to‘plami.', 'php-traits'),
  t(
    'Enum',
    "Cheklangan qiymatlar to‘plami (PHP 8.1): `enum Holat: string { case Faol = 'faol'; }`.",
    'php-enums',
  ),
  t(
    'Namespace',
    'Klass va funksiyalar nomlarini guruhlaydigan nomlar fazosi — to‘qnashuvlarning oldini oladi.',
    'php-namespaces',
  ),
  t(
    'Composer',
    'PHP paketlari menejeri va avtomatik yuklagich (`vendor/autoload.php`).',
    'php-namespaces',
  ),
  t(
    'SQL',
    'Relyatsion ma’lumotlar bazasi tili: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.',
    'php-database',
  ),
  t(
    'PDO',
    'PHP’ning ma’lumotlar bazasi bilan ishlash interfeysi; turli bazalar uchun bir xil.',
    'php-pdo-connect',
  ),
  t(
    'DSN',
    'Bazaga ulanish manzili: turi, xost, baza nomi va kodirovka.',
    'php-pdo-connect',
    'mysql:host=localhost;dbname=maktab;charset=utf8mb4',
  ),
  t(
    'Tayyorlangan so‘rov',
    '`prepare()` + `execute()` — ma’lumot SQL kodidan alohida yuboriladi; SQL injection’dan himoya.',
    'php-pdo-insert',
  ),
  t(
    'fetchAll()',
    'So‘rov natijasining hamma qatorlarini massiv sifatida qaytaradi.',
    'php-pdo-select',
  ),
  t(
    'Tranzaksiya',
    '“Hammasi yoki hech narsa”: `beginTransaction()`, `commit()`, `rollBack()`.',
    'php-pdo-update-delete',
  ),
  t(
    'password_hash()',
    'Parolni xavfsiz (tuzli, sekin) xeshlaydi; tekshirish — `password_verify()`.',
    'php-project-auth',
  ),
  t('CRUD', 'Create, Read, Update, Delete — ma’lumot bilan to‘rt asosiy amal.', 'php-project-crud'),
];
