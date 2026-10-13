## Fayllarni ulash: `include` va `require`

Sayt sahifalarining umumiy qismlari (sarlavha, menyu, footer, sozlamalar) **bir marta** yoziladi va har sahifaga ulanadi.

```text
sayt/
  inc/
    header.php
    footer.php
    config.php
  index.php
  kurslar.php
```

`inc/header.php`:

```php
<!DOCTYPE html>
<html lang="uz">
<head><title><?= htmlspecialchars($sarlavha ?? 'WEBDIZAYN.UZ') ?></title></head>
<body>
<nav><a href="/">Bosh sahifa</a> <a href="/kurslar.php">Kurslar</a></nav>
```

`kurslar.php`:

```php
<?php
$sarlavha = 'Kurslar';
require __DIR__ . '/inc/header.php';
?>
<h1>Kurslar</h1>
<?php require __DIR__ . '/inc/footer.php'; ?>
```

Ulangan fayl xuddi shu joyga yozilgandek ishlaydi va **o‘sha doiradagi** o‘zgaruvchilarni (`$sarlavha`) ko‘radi.

## To‘rt variant

| | Fayl topilmasa | Takroriy ulash |
| --- | --- | --- |
| `include` | `Warning`, davom etadi | Yana ulanadi |
| `require` | `Fatal error`, to‘xtaydi | Yana ulanadi |
| `include_once` | `Warning` | Bir marta |
| `require_once` | `Fatal error` | Bir marta |

Qoidalar:

- sahifa ishlashi uchun **shart** bo‘lgan fayllar (sozlama, funksiyalar) — `require_once`;
- funksiya yoki klass e’lon qiladigan fayllar — `_once` (aks holda “Cannot redeclare”);
- shablon bo‘laklari (header, footer) — `require`.

## `__DIR__` bilan yo‘l

```php
<?php
require __DIR__ . '/inc/config.php';
```

Nisbiy yo‘l (`'inc/config.php'`) skript **qaysi papkadan ishga tushirilganiga** bog‘liq. `__DIR__` — joriy fayl papkasi, doim to‘g‘ri.

## Faylning qiymat qaytarishi

Ulangan fayl `return` qilsa, `require` shu qiymatni qaytaradi — sozlamalar uchun qulay:

`config.php`:

```php
<?php
return [
    'sayt' => 'WEBDIZAYN.UZ',
    'db_host' => getenv('DB_HOST') ?: 'localhost',
];
```

```php
<?php
$config = require __DIR__ . '/config.php';
echo $config['sayt'];
```

## Xavfsizlik: foydalanuvchi tanlagan fayl

```php
<?php
include $_GET['sahifa'] . '.php'; // JUDA XAVFLI
```

Hujumchi `?sahifa=../../maxfiy` kabi yo‘l bilan serverdagi istalgan faylni o‘qishi yoki bajarishi mumkin. Faqat **ruxsat etilgan ro‘yxat**dan:

```php
<?php
$sahifalar = ['bosh' => 'bosh.php', 'aloqa' => 'aloqa.php'];
$fayl = $sahifalar[$_GET['sahifa'] ?? 'bosh'] ?? 'bosh.php';
require __DIR__ . '/sahifalar/' . $fayl;
```

## Composer autoload (kelajak uchun)

Katta loyihalarda klasslar `require` bilan qo‘lda ulanmaydi — Composer ularni avtomatik yuklaydi (`require 'vendor/autoload.php';`). Nomlar fazosi darsida ko‘ramiz.

## Mustaqil mashq

Uchta fayl yarating:

`inc/header.php`:

```php
<h1><?= $sarlavha ?></h1>
```

`inc/footer.php`:

```php
<p>© <?= date('Y') ?> WEBDIZAYN.UZ</p>
```

`index.php`:

```php
<?php
$sarlavha = 'Bosh sahifa';
require __DIR__ . '/inc/header.php';
echo '<p>Xush kelibsiz!</p>';
require __DIR__ . '/inc/footer.php';
```

**Kutilgan natija:** sahifada “Bosh sahifa” sarlavhasi, “Xush kelibsiz!” va joriy yil bilan footer. Keyin `require` dagi fayl nomini xato yozib, `include` bilan farqini ko‘ring.
