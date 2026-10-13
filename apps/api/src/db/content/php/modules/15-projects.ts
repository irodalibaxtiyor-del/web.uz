import { dars, natija, q, XATO, type ModuleDef } from '../shared';

const TEKSHIR = `function tekshir(string $ism, string $matn): array
{
    $xatolar = [];
    if ($ism === '' || mb_strlen($ism) > 50) {
        $xatolar['ism'] = 'Ism 1–50 belgi bo‘lsin';
    }
    if (mb_strlen($matn) < 3 || mb_strlen($matn) > 500) {
        $xatolar['matn'] = 'Xabar 3–500 belgi bo‘lsin';
    }
    return $xatolar;
}`;

const REPO = `$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE vazifalar (id INTEGER PRIMARY KEY AUTOINCREMENT, egasi_id INTEGER NOT NULL, nom TEXT NOT NULL, bajarildi INTEGER NOT NULL DEFAULT 0)');
function qoshish(PDO $pdo, int $egasi, string $nom): int
{
    $st = $pdo->prepare('INSERT INTO vazifalar (egasi_id, nom) VALUES (?, ?)');
    $st->execute([$egasi, $nom]);
    return (int) $pdo->lastInsertId();
}
function ochirish(PDO $pdo, int $egasi, int $id): bool
{
    $st = $pdo->prepare('DELETE FROM vazifalar WHERE id = ? AND egasi_id = ?');
    $st->execute([$id, $egasi]);
    return $st->rowCount() === 1;
}`;

export const m15: ModuleDef = {
  title: 'Amaliy loyihalar',
  lessons: [
    {
      slug: 'php-project-guestbook',
      title: 'Loyiha 1: Mehmonlar kitobi',
      quiz: dars('Mehmonlar kitobi — test', [
        natija(
          'validate',
          `<?php\n${TEKSHIR}\necho implode(',', array_keys(tekshir('Ali', 'Hi')));`,
          ['matn', 'ism', 'ism,matn', ''],
          0,
        ),
        natija(
          'mb-strlen',
          `<?php\necho strlen('o‘g‘il'), ' ', mb_strlen('o‘g‘il');`,
          ['10 6', '6 6', '6 10', '8 6'],
          0,
        ),
        natija(
          'nl2br-order',
          `<?php
$m = "<i>x</i>\ny";
$togri = nl2br(htmlspecialchars($m));
$notogri = htmlspecialchars(nl2br($m));
echo substr_count($togri, '<br'), ' ', substr_count($notogri, '<br');`,
          ['1 0', '1 1', '0 1', '0 0'],
          0,
        ),
        q(
          'prg',
          "Saqlagandan keyin `header('Location: index.php')` nima uchun kerak (PRG)?",
          [
            'Sahifa yangilanganda (F5) forma qayta yuborilmasligi va xabar ikki marta qo‘shilmasligi uchun',
            'Sahifa tezroq yuklanishi uchun',
            'SQL injection’dan himoya uchun',
            'Xabarni shifrlash uchun',
          ],
          [0],
        ),
        q(
          'maxlength',
          'Formada `maxlength="500"` bor. Serverda uzunlikni yana tekshirish kerakmi?',
          [
            'Ha — brauzer cheklovini DevTools yoki to‘g‘ridan-to‘g‘ri so‘rov bilan chetlab o‘tish oson',
            'Yo‘q — brauzer ruxsat bermaydi',
            'Faqat JavaScript o‘chiq bo‘lsa',
            'Yo‘q — baza o‘zi kesib tashlaydi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-project-auth',
      title: 'Loyiha 2: Ro‘yxatdan o‘tish va kirish',
      quiz: dars('Ro‘yxatdan o‘tish va kirish — test', [
        natija(
          'hash',
          `<?php\n$h = password_hash('maxfiy123', PASSWORD_DEFAULT);\necho password_verify('maxfiy123', $h) ? 'ha' : 'yo‘q', ' ', password_verify('Maxfiy123', $h) ? 'ha' : 'yo‘q', ' ', $h === password_hash('maxfiy123', PASSWORD_DEFAULT) ? 'teng' : 'farqli';`,
          ['ha yo‘q farqli', 'ha ha teng', 'ha yo‘q teng', 'ha ha farqli'],
          0,
        ),
        natija(
          'token',
          `<?php\n$t = bin2hex(random_bytes(32));\necho strlen($t), ' ', ctype_xdigit($t) ? 'hex' : 'boshqa';`,
          ['64 hex', '32 hex', '64 boshqa', '32 boshqa'],
          0,
        ),
        natija(
          'hash-equals',
          `<?php\n$sessiya = 'a1b2c3';\nforeach (['a1b2c3', 'a1b2c4', ''] as $y) {\n    echo hash_equals($sessiya, $y) ? '+' : '-';\n}`,
          ['+--', '+++', '---', '++-'],
          0,
        ),
        q(
          'same-error',
          'Kirishda nima uchun “Email yoki parol noto‘g‘ri” deb **bitta** xabar chiqariladi?',
          [
            'Aks holda hujumchi qaysi emaillar ro‘yxatdan o‘tganini bilib oladi',
            'Kod qisqaroq bo‘lishi uchun',
            'Foydalanuvchi qaysi biri xato ekanini bilmasligi qulayroq',
            'Brauzer boshqa xabarni ko‘rsata olmaydi',
          ],
          [0],
        ),
        q(
          'regenerate',
          'Muvaffaqiyatli kirgandan keyin `session_regenerate_id(true)` nima qiladi?',
          [
            'Sessiyaga yangi ID beradi — oldindan “ekilgan” eski ID yaroqsiz bo‘ladi (session fixation)',
            'Sessiyani butunlay o‘chiradi',
            'Parolni qayta hash qiladi',
            'Cookie muddatini cheksiz qiladi',
          ],
          [0],
        ),
        q(
          'logout',
          'Chiqish (`logout.php`) nima uchun faqat POST + CSRF bilan?',
          [
            'Boshqa sayt `<img src="logout.php">` bilan foydalanuvchini bilmasdan chiqarib yubora olmasligi uchun',
            'GET so‘rovlarda sessiya ishlamaydi',
            'POST tezroq',
            'Brauzer GET bilan cookie yubormaydi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-project-crud',
      title: 'Loyiha 3: Vazifalar ro‘yxati (CRUD)',
      quiz: dars('Vazifalar ro‘yxati — kurs yakuniy testi', [
        natija(
          'idor',
          `<?php\n${REPO}\n$a = qoshish($pdo, 1, 'Ali vazifasi');\n$b = qoshish($pdo, 2, 'Vali vazifasi');\necho ochirish($pdo, 2, $a) ? 'o‘chdi' : 'topilmadi', ' ';\necho $pdo->query('SELECT COUNT(*) FROM vazifalar')->fetchColumn();`,
          ['topilmadi 2', 'o‘chdi 1', 'topilmadi 1', 'o‘chdi 2'],
          0,
        ),
        natija(
          'toggle',
          `<?php\n${REPO}\n$id = qoshish($pdo, 1, 'Dars');\n$st = $pdo->prepare('UPDATE vazifalar SET bajarildi = 1 - bajarildi WHERE id = ? AND egasi_id = ?');\n$st->execute([$id, 1]);\n$st->execute([$id, 1]);\n$st->execute([$id, 1]);\necho $pdo->query('SELECT bajarildi FROM vazifalar')->fetchColumn();`,
          ['1', '0', '3', '-1'],
          0,
        ),
        natija(
          'filter-id',
          `<?php\nforeach (['7', '7abc', '-3', ''] as $v) {\n    echo (filter_var($v, FILTER_VALIDATE_INT) ?: 0), ' ';\n}`,
          ['7 0 -3 0 ', '7 7 -3 0 ', '7 0 0 0 ', '7 7 3 0 '],
          0,
        ),
        q(
          'owner-source',
          '`egasi_id` qiymati qayerdan olinishi kerak?',
          [
            "Faqat sessiyadan (`kirgan()['id']`)",
            'Formadagi yashirin maydondan',
            'URL parametridan (`?egasi=5`)',
            'Cookie’dagi oddiy qiymatdan',
          ],
          [0],
        ),
        q(
          'not-found',
          'Foydalanuvchi begona vazifaning `id` sini yuborsa, eng yaxshi javob?',
          [
            '404 — xuddi bunday vazifa yo‘qdek (mavjudligi oshkor qilinmaydi)',
            '403 “Bu vazifa boshqa foydalanuvchiniki”',
            '200 va vazifani ko‘rsatish',
            '500 xato',
          ],
          [0],
        ),
        q(
          'checklist',
          'Qaysilari CRUD ilovaning majburiy himoyalari? (bir nechta javob)',
          [
            'Har SQL’da egasini tekshirish (`AND egasi_id = ?`)',
            'Har POST’da CSRF token',
            'Chiqishda `htmlspecialchars`',
            'Vazifa nomlarini `md5` bilan saqlash',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};
