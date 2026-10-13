## Loyiha 1: Mehmonlar kitobi

Kurs davomida o‘rganganlarni birlashtiramiz: forma → tekshirish → bazaga saqlash → xavfsiz chiqarish. Natija — har kim ism va xabar qoldiradigan sahifa.

## Tuzilma

```text
mehmonlar/
  db.php        — ulanish va jadval
  index.php     — forma + xabarlar ro‘yxati
  data/         — SQLite fayli shu yerda (avtomatik yaratiladi)
```

Ishga tushirish: `mehmonlar` papkasida `php -S localhost:8000`, brauzerda `http://localhost:8000`.

## 1-qadam: `db.php`

```php
<?php
declare(strict_types=1);

$papka = __DIR__ . '/data';
if (!is_dir($papka)) {
    mkdir($papka, 0775, true);
}

$pdo = new PDO('sqlite:' . $papka . '/mehmonlar.sqlite', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$pdo->exec('CREATE TABLE IF NOT EXISTS xabarlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ism TEXT NOT NULL,
    matn TEXT NOT NULL,
    vaqt TEXT NOT NULL
)');
```

`CREATE TABLE IF NOT EXISTS` — birinchi ishga tushishda jadval yaratiladi, keyin tegilmaydi.

> Haqiqiy serverda `data/` papka veb-ildizdan (`public/`) **tashqarida** bo‘lishi kerak — aks holda bazani brauzerdan yuklab olish mumkin.

## 2-qadam: tekshirish funksiyasi

Tekshiruvni alohida funksiyaga ajratish uni sinashni osonlashtiradi:

```php
<?php
function tekshir(string $ism, string $matn): array
{
    $xatolar = [];
    if ($ism === '' || mb_strlen($ism) > 50) {
        $xatolar['ism'] = 'Ism 1–50 belgi bo‘lsin';
    }
    if (mb_strlen($matn) < 3 || mb_strlen($matn) > 500) {
        $xatolar['matn'] = 'Xabar 3–500 belgi bo‘lsin';
    }
    return $xatolar;
}
```

`mb_strlen` — o‘zbekcha `o‘` kabi ko‘p baytli belgilarni to‘g‘ri sanaydi.

## 3-qadam: `index.php`

```php
<?php
declare(strict_types=1);
require __DIR__ . '/db.php';

function tekshir(string $ism, string $matn): array
{
    $xatolar = [];
    if ($ism === '' || mb_strlen($ism) > 50) {
        $xatolar['ism'] = 'Ism 1–50 belgi bo‘lsin';
    }
    if (mb_strlen($matn) < 3 || mb_strlen($matn) > 500) {
        $xatolar['matn'] = 'Xabar 3–500 belgi bo‘lsin';
    }
    return $xatolar;
}

function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

$ism = '';
$matn = '';
$xatolar = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ism = trim($_POST['ism'] ?? '');
    $matn = trim($_POST['matn'] ?? '');
    $xatolar = tekshir($ism, $matn);

    if (!$xatolar) {
        $st = $pdo->prepare('INSERT INTO xabarlar (ism, matn, vaqt) VALUES (?, ?, ?)');
        $st->execute([$ism, $matn, date('Y-m-d H:i')]);
        header('Location: index.php');   // PRG: Post → Redirect → Get
        exit;
    }
}

$xabarlar = $pdo->query('SELECT ism, matn, vaqt FROM xabarlar ORDER BY id DESC LIMIT 50')
    ->fetchAll();
?>
<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mehmonlar kitobi</title>
</head>
<body>
  <h1>Mehmonlar kitobi</h1>

  <form method="post" novalidate>
    <label>Ismingiz
      <input name="ism" value="<?= e($ism) ?>" maxlength="50">
    </label>
    <?php if (isset($xatolar['ism'])): ?><p role="alert"><?= e($xatolar['ism']) ?></p><?php endif; ?>

    <label>Xabar
      <textarea name="matn" maxlength="500"><?= e($matn) ?></textarea>
    </label>
    <?php if (isset($xatolar['matn'])): ?><p role="alert"><?= e($xatolar['matn']) ?></p><?php endif; ?>

    <button>Yuborish</button>
  </form>

  <?php foreach ($xabarlar as $x): ?>
    <article>
      <h2><?= e($x['ism']) ?></h2>
      <p><?= nl2br(e($x['matn'])) ?></p>
      <time><?= e($x['vaqt']) ?></time>
    </article>
  <?php endforeach; ?>
</body>
</html>
```

## Nimalarga e’tibor berdik

| Muammo                               | Yechim                                                    |
| ------------------------------------ | --------------------------------------------------------- |
| SQL injection                        | `prepare()` + `execute()`                                 |
| XSS (`<script>` xabar ichida)        | chiqarishda `e()` (`htmlspecialchars`)                    |
| Sahifa yangilansa xabar qayta ketadi | PRG: saqlagandan keyin `header('Location: ...')`          |
| Xato bo‘lsa kiritilgan matn yo‘qoladi| maydonlarga `value="<?= e($ism) ?>"`                      |
| Brauzer tekshiruvini chetlab o‘tish  | serverdagi `tekshir()` — `maxlength` faqat qulaylik uchun |
| Qatorlar ko‘payib ketadi             | `LIMIT 50`                                                |

`nl2br(e(...))` tartibi muhim: avval escape, keyin `<br>` qo‘shiladi. Teskarisi `<br>` ni ham escape qilib yuboradi.

## Mustaqil mashq

1. Loyihani yuqoridagidek yarating va ishga tushiring.
2. Xabar sifatida `<script>alert(1)</script>` yuboring — sahifada **matn** sifatida ko‘rinishi kerak, oyna ochilmasligi kerak.
3. Ismni bo‘sh qoldiring — xato chiqadi, yozgan xabaringiz o‘chib ketmaydi.
4. **Qo‘shimcha:** sahifalashni qo‘shing (`?sahifa=2`, har sahifada 10 ta, `LIMIT ? OFFSET ?` va `PDO::PARAM_INT`).

**Kutilgan natija:** xabarlar yangisi tepada chiqadi; HTML teglar matn bo‘lib ko‘rinadi; F5 bosilganda xabar qayta qo‘shilmaydi.
