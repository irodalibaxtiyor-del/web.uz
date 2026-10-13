## Loyiha 2: Ro‘yxatdan o‘tish va kirish

Deyarli har bir sayt foydalanuvchilarni taniydi. Bu loyihada xavfsiz ro‘yxatdan o‘tish, kirish va chiqishni yozamiz.

## Tuzilma

```text
auth/
  bootstrap.php   — sessiya, baza, yordamchi funksiyalar
  register.php    — ro‘yxatdan o‘tish
  login.php       — kirish
  profil.php      — faqat kirganlar uchun
  logout.php      — chiqish (POST)
```

## Uchta oltin qoida

1. Parol **hech qachon** ochiq saqlanmaydi — faqat `password_hash()`.
2. Kirgandan keyin sessiya ID si yangilanadi — `session_regenerate_id(true)`.
3. Holatni o‘zgartiradigan har bir forma **CSRF token** bilan.

## `bootstrap.php`

```php
<?php
declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,     // JavaScript cookie’ni o‘qiy olmaydi
    'samesite' => 'Lax',    // boshqa saytdan POST bilan cookie yuborilmaydi
    'secure' => isset($_SERVER['HTTPS']),
]);
session_start();

$pdo = new PDO('sqlite:' . __DIR__ . '/data.sqlite', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE IF NOT EXISTS foydalanuvchilar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    ism TEXT NOT NULL,
    parol_hash TEXT NOT NULL
)');

function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_tekshir(): void
{
    $yuborilgan = $_POST['csrf'] ?? '';
    if (!is_string($yuborilgan) || !hash_equals(csrf_token(), $yuborilgan)) {
        http_response_code(403);
        exit('So‘rov rad etildi');
    }
}

function kirgan(): ?array
{
    return $_SESSION['user'] ?? null;
}
```

- `random_bytes(32)` — kriptografik tasodifiy token (`rand()` emas).
- `hash_equals()` — taqqoslash vaqti orqali tokenni taxmin qilib bo‘lmaydi.

## `register.php`

```php
<?php
require __DIR__ . '/bootstrap.php';

$xato = '';
$email = '';
$ism = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_tekshir();
    $email = mb_strtolower(trim($_POST['email'] ?? ''));
    $ism = trim($_POST['ism'] ?? '');
    $parol = $_POST['parol'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $xato = 'Email noto‘g‘ri';
    } elseif ($ism === '') {
        $xato = 'Ismingizni kiriting';
    } elseif (mb_strlen($parol) < 8) {
        $xato = 'Parol kamida 8 belgi bo‘lsin';
    } else {
        try {
            $st = $pdo->prepare(
                'INSERT INTO foydalanuvchilar (email, ism, parol_hash) VALUES (?, ?, ?)'
            );
            $st->execute([$email, $ism, password_hash($parol, PASSWORD_DEFAULT)]);
            header('Location: login.php?yangi=1');
            exit;
        } catch (PDOException $e) {
            if ($e->getCode() !== '23000') {
                throw $e;
            }
            $xato = 'Bu email bilan akkaunt bor';
        }
    }
}
?>
<!doctype html>
<html lang="uz">
<head><meta charset="utf-8"><title>Ro‘yxatdan o‘tish</title></head>
<body>
  <h1>Ro‘yxatdan o‘tish</h1>
  <?php if ($xato): ?><p role="alert"><?= e($xato) ?></p><?php endif; ?>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
    <label>Email <input type="email" name="email" value="<?= e($email) ?>" required></label>
    <label>Ism <input name="ism" value="<?= e($ism) ?>" required></label>
    <label>Parol <input type="password" name="parol" minlength="8" required autocomplete="new-password"></label>
    <button>Ro‘yxatdan o‘tish</button>
  </form>
</body>
</html>
```

Parol maydonining qiymati formaga **qaytarilmaydi** (`value` yo‘q).

## `login.php`

```php
<?php
require __DIR__ . '/bootstrap.php';

$xato = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_tekshir();
    $email = mb_strtolower(trim($_POST['email'] ?? ''));
    $parol = $_POST['parol'] ?? '';

    $st = $pdo->prepare('SELECT id, ism, parol_hash FROM foydalanuvchilar WHERE email = ?');
    $st->execute([$email]);
    $u = $st->fetch();

    if ($u && password_verify($parol, $u['parol_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user'] = ['id' => (int) $u['id'], 'ism' => $u['ism']];
        header('Location: profil.php');
        exit;
    }
    $xato = 'Email yoki parol noto‘g‘ri';
}
?>
<!doctype html>
<html lang="uz">
<head><meta charset="utf-8"><title>Kirish</title></head>
<body>
  <h1>Kirish</h1>
  <?php if (isset($_GET['yangi'])): ?><p role="status">Akkaunt yaratildi. Endi kiring.</p><?php endif; ?>
  <?php if ($xato): ?><p role="alert"><?= e($xato) ?></p><?php endif; ?>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
    <label>Email <input type="email" name="email" required autocomplete="email"></label>
    <label>Parol <input type="password" name="parol" required autocomplete="current-password"></label>
    <button>Kirish</button>
  </form>
</body>
</html>
```

- Xato xabari **bir xil**: “email yoki parol noto‘g‘ri” — qaysi biri xato ekanini aytmaymiz, aks holda hujumchi qaysi emaillar ro‘yxatdan o‘tganini bilib oladi.
- `session_regenerate_id(true)` — kirishdan oldingi sessiya ID si (hujumchi oldindan “ekib” qo‘ygan bo‘lishi mumkin) yaroqsiz bo‘ladi.
- Sessiyada parol hash’i yoki butun qator emas — faqat kerakli minimal ma’lumot.

## `profil.php` va `logout.php`

```php
<?php
require __DIR__ . '/bootstrap.php';

$u = kirgan();
if ($u === null) {
    header('Location: login.php');
    exit;
}
?>
<h1>Salom, <?= e($u['ism']) ?>!</h1>
<form method="post" action="logout.php">
  <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
  <button>Chiqish</button>
</form>
```

```php
<?php
require __DIR__ . '/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
csrf_tekshir();

$_SESSION = [];
session_destroy();
header('Location: login.php');
exit;
```

Chiqish ham POST — aks holda boshqa sayt `<img src="logout.php">` bilan foydalanuvchini chiqarib yuboradi.

## Yana nimalar qo‘shiladi (haqiqiy loyihada)

- **Urinishlar cheklovi**: bir email/IP uchun 15 daqiqada 5 ta xato urinish.
- **Email tasdiqlash** va parolni tiklash (bir martalik, muddatli token).
- `password_needs_rehash()` — algoritm yangilanganda hash’ni kirish paytida yangilash.

## Mustaqil mashq

1. Loyihani yarating, `php -S localhost:8000` bilan ishga tushiring.
2. Ro‘yxatdan o‘ting, chiqing va qayta kiring.
3. Bazani oching (masalan, “DB Browser for SQLite” bilan) — `parol_hash` ustunida `$2y$...` ko‘rinishidagi satr bo‘lishi kerak, parolning o‘zi emas.
4. Brauzer DevTools → Application → Cookies: `PHPSESSID` da **HttpOnly** belgisi bor.
5. Formadagi `csrf` yashirin maydon qiymatini DevTools’da o‘zgartirib yuboring.

**Kutilgan natija:** 5-qadamda “So‘rov rad etildi” (403); noto‘g‘ri parol va mavjud bo‘lmagan email uchun xabar bir xil.
