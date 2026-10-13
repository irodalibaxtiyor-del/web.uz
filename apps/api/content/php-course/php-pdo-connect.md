## PDO bilan ulanish

**PDO** (PHP Data Objects) — bazalar bilan ishlash uchun yagona interfeys. Ulanish bitta `new PDO(...)` bilan:

```php
<?php
$pdo = new PDO($dsn, $foydalanuvchi, $parol, $sozlamalar);
```

## DSN — “qayerga ulanish”

```php
<?php
// MySQL (XAMPP: foydalanuvchi root, parol bo‘sh)
$dsn = 'mysql:host=localhost;dbname=maktab;charset=utf8mb4';

// SQLite — fayl (server kerak emas)
$dsn = 'sqlite:' . __DIR__ . '/maktab.sqlite';

// SQLite — xotirada (sinov uchun, skript tugasa yo‘qoladi)
$dsn = 'sqlite::memory:';
```

`charset=utf8mb4` — o‘zbekcha harflar (`o‘`, `g‘`) va emoji to‘g‘ri saqlanishi uchun.

Qolgan kod **barcha bazalar uchun bir xil**. Shuning uchun darslardagi misollar SQLite’da — ularni hech qanday server o‘rnatmasdan ishga tushirish mumkin.

## Tavsiya etilgan sozlamalar

```php
<?php
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
```

- `ERRMODE_EXCEPTION` — SQL xatosi `PDOException` sifatida tashlanadi (PHP 8 da standart, lekin aniq yozib qo‘yish yaxshi odat).
- `FETCH_ASSOC` — qatorlar `['ism' => 'Ali', ...]` ko‘rinishida keladi.

MySQL uchun yana `PDO::ATTR_EMULATE_PREPARES => false` qo‘shiladi — tayyorlangan so‘rovlar haqiqatan serverda tayyorlanadi.

## Xatolarni ushlash

```php
<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=maktab;charset=utf8mb4', 'root', '');
} catch (PDOException $e) {
    error_log($e->getMessage());     // tafsilot — faqat logga
    http_response_code(500);
    exit('Bazaga ulanib bo‘lmadi.'); // foydalanuvchiga — umumiy xabar
}
```

> Xato matnini (`$e->getMessage()`) foydalanuvchiga **ko‘rsatmang**: unda server nomi, foydalanuvchi va jadval tuzilmasi bo‘lishi mumkin.

## `exec()` — natija qaytarmaydigan buyruqlar

```php
<?php
$pdo->exec('CREATE TABLE IF NOT EXISTS talabalar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ism TEXT NOT NULL,
    ball INTEGER DEFAULT 0
)');
```

`exec()` ta’sir qilgan qatorlar sonini qaytaradi. Unga **foydalanuvchi kiritgan ma’lumotni qo‘shmang** — buning uchun keyingi darsdagi tayyorlangan so‘rovlar.

## Parol kodda emas

Haqiqiy loyihada bazaga ulanish ma’lumotlari alohida faylda (`config.php`, Git’ga qo‘shilmaydi) yoki muhit o‘zgaruvchilarida saqlanadi:

```php
<?php
// config.php — .gitignore da
return [
    'dsn' => 'mysql:host=localhost;dbname=maktab;charset=utf8mb4',
    'user' => 'root',
    'pass' => '',
];
```

```php
<?php
$c = require __DIR__ . '/config.php';
$pdo = new PDO($c['dsn'], $c['user'], $c['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
```

## Mustaqil mashq

`db.php` faylini yarating:

```php
<?php
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE kurslar (id INTEGER PRIMARY KEY, nom TEXT NOT NULL)');
$qoshildi = $pdo->exec("INSERT INTO kurslar (nom) VALUES ('HTML'), ('CSS'), ('PHP')");

try {
    $pdo->exec('SELECT * FROM yoq_jadval');
} catch (PDOException $e) {
    echo 'Xato ushlandi; ';
}
echo "Qo‘shildi: $qoshildi";
```

`php db.php` bilan ishga tushiring.

**Kutilgan natija:** `Xato ushlandi; Qo‘shildi: 3`

> Windows’da “could not find driver” chiqsa, `php.ini` da `extension=pdo_sqlite` qatoridagi `;` ni olib tashlang.
