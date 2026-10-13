## Ma’lumot qo‘shish va SQL injection

## Xavfli usul: satrni yopishtirish

Foydalanuvchi kiritgan qiymatni to‘g‘ridan-to‘g‘ri SQL’ga qo‘shish — **hech qachon** bunday qilmang:

```php
<?php
$ism = $_POST['ism'];
$pdo->query("SELECT * FROM talabalar WHERE ism = '$ism'"); // XAVFLI!
```

Agar foydalanuvchi ism o‘rniga `x' OR '1'='1` yozsa, so‘rov shunday bo‘ladi:

```sql
SELECT * FROM talabalar WHERE ism = 'x' OR '1'='1'
```

`'1'='1'` doim rost — **barcha** qatorlar qaytadi. Bu **SQL injection**: hujumchi so‘rov ma’nosini o‘zgartiradi, parolsiz kiradi, ma’lumotlarni o‘g‘irlaydi yoki o‘chiradi. Bu veb-ilovalardagi eng ko‘p uchraydigan zaifliklardan biri.

## To‘g‘ri usul: tayyorlangan so‘rov (prepared statement)

SQL va ma’lumot **alohida** yuboriladi. Qiymat o‘rnida belgi (placeholder) turadi:

```php
<?php
$st = $pdo->prepare('SELECT * FROM talabalar WHERE ism = ?');
$st->execute([$ism]);
```

Endi `x' OR '1'='1` — shunchaki g‘alati ism; bunday ismli talaba yo‘q, 0 ta qator qaytadi. Baza qiymatni hech qachon SQL kodi sifatida o‘qimaydi.

## Ikki xil belgi

```php
<?php
// Pozitsion: ? — tartib bo‘yicha
$st = $pdo->prepare('INSERT INTO talabalar (ism, guruh, ball) VALUES (?, ?, ?)');
$st->execute(['Ali', 'W-12', 80]);

// Nomli: :nom — tartib muhim emas, ko‘p maydonda o‘qish oson
$st = $pdo->prepare(
    'INSERT INTO talabalar (ism, guruh, ball) VALUES (:ism, :guruh, :ball)'
);
$st->execute(['ism' => 'Vali', 'guruh' => 'W-12', 'ball' => 55]);
```

Bitta so‘rovda ikki turni aralashtirmang.

## Bir marta tayyorlab, ko‘p marta bajarish

```php
<?php
$st = $pdo->prepare('INSERT INTO talabalar (ism, guruh, ball) VALUES (?, ?, ?)');
$royxat = [['Lola', 'W-14', 92], ['Anvar', 'W-14', 70]];
foreach ($royxat as $qator) {
    $st->execute($qator);
}
```

## Yangi qatorning `id` si

```php
<?php
$id = $pdo->lastInsertId(); // DIQQAT: satr qaytaradi, masalan "4"
header('Location: talaba.php?id=' . $id);
```

## Takrorlanmas qiymatlar

Jadvalda `UNIQUE` cheklovi bo‘lsa (masalan, email), dublikat qo‘shilganda `PDOException` (kodi `23000`) tashlanadi:

```php
<?php
try {
    $st->execute([$email]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        $xato = 'Bu email allaqachon ro‘yxatdan o‘tgan';
    } else {
        throw $e;
    }
}
```

Avval `SELECT` bilan tekshirib, keyin `INSERT` qilish yetarli emas — ikki so‘rov orasida boshqa foydalanuvchi ulgurishi mumkin. Cheklovni baza ushlab turadi.

## Formadan saqlash — to‘liq misol

```php
<?php
$xatolar = [];
$ism = trim($_POST['ism'] ?? '');
$ball = filter_var($_POST['ball'] ?? '', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 0, 'max_range' => 100],
]);

if ($ism === '') {
    $xatolar[] = 'Ism kiritilmagan';
}
if ($ball === false) {
    $xatolar[] = 'Ball 0–100 oralig‘ida bo‘lsin';
}

if (!$xatolar) {
    $st = $pdo->prepare('INSERT INTO talabalar (ism, ball) VALUES (?, ?)');
    $st->execute([$ism, $ball]);
    header('Location: royxat.php');
    exit;
}
```

Tartib: **tekshirish** (validatsiya) → **tayyorlangan so‘rov** → **yo‘naltirish** (sahifa yangilanganda ma’lumot qayta yuborilmasligi uchun).

## Mustaqil mashq

```php
<?php
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE talabalar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ism TEXT NOT NULL UNIQUE,
    ball INTEGER NOT NULL
)');

$st = $pdo->prepare('INSERT INTO talabalar (ism, ball) VALUES (:ism, :ball)');
foreach ([['Ali', 80], ['Vali', 55], ['Ali', 90]] as [$ism, $ball]) {
    try {
        $st->execute(['ism' => $ism, 'ball' => $ball]);
        echo "+$ism ";
    } catch (PDOException $e) {
        echo "dublikat:$ism ";
    }
}
echo 'oxirgi id=' . $pdo->lastInsertId();

$hujum = "x' OR '1'='1";
$q = $pdo->prepare('SELECT COUNT(*) FROM talabalar WHERE ism = ?');
$q->execute([$hujum]);
echo ' topildi=' . $q->fetchColumn();
```

**Kutilgan natija:** `+Ali +Vali dublikat:Ali oxirgi id=2 topildi=0`
