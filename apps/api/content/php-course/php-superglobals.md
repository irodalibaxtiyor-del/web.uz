## Superglobal o‘zgaruvchilar

PHP so‘rov haqidagi ma’lumotni maxsus massivlarda beradi. Ular **hamma joyda** — har qanday funksiya ichida ham — ko‘rinadi.

| O‘zgaruvchi | Nima saqlaydi |
| --- | --- |
| `$_GET` | URL parametrlari: `?sahifa=2&q=php` |
| `$_POST` | POST bilan yuborilgan forma maydonlari |
| `$_REQUEST` | `$_GET` + `$_POST` + `$_COOKIE` (ishlatmang) |
| `$_SERVER` | So‘rov va server ma’lumotlari |
| `$_COOKIE` | Brauzer yuborgan cookie’lar |
| `$_SESSION` | Sessiya ma’lumotlari |
| `$_FILES` | Yuklangan fayllar |
| `$GLOBALS` | Barcha global o‘zgaruvchilar |

## `$_GET`

`https://sayt.uz/kurslar.php?daraja=orta&sahifa=2`:

```php
<?php
$daraja = $_GET['daraja'] ?? 'hammasi';     // "orta"
$sahifa = (int) ($_GET['sahifa'] ?? 1);     // 2
```

- Qiymatlar **doim satr** (yoki massiv) — songa aylantiring.
- Parametr bo‘lmasligi mumkin — doim `??` bilan standart qiymat.

## `$_POST`

Forma `method="post"` bilan yuborilganda:

```php
<?php
$ism = trim($_POST['ism'] ?? '');
```

## `$_SERVER`

```php
<?php
echo $_SERVER['REQUEST_METHOD']; // GET yoki POST
echo $_SERVER['REQUEST_URI'];    // /kurslar.php?daraja=orta
echo $_SERVER['HTTP_HOST'];      // sayt.uz
```

Formani qayta ishlashda so‘rov turini tekshirish:

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // forma yuborildi
}
```

## Hech biriga ishonmang

Superglobal’lardagi **hamma narsa foydalanuvchidan** keladi va soxtalashtirilishi mumkin: URL’ni qo‘lda yozish, formani o‘zgartirish, sarlavhalarni almashtirish oson. Hatto `$_SERVER['HTTP_REFERER']` va `HTTP_USER_AGENT` ham.

Qoidalar:

1. **Tekshiring** — tur, uzunlik, ruxsat etilgan qiymatlar (validatsiya darsi).
2. HTML’ga chiqarishdan oldin **`htmlspecialchars`**.
3. SQL’ga qo‘yishdan oldin — faqat **tayyorlangan so‘rovlar** (PDO modulida).

## `$_REQUEST` dan qoching

U GET, POST va cookie’larni aralashtiradi — qiymat qayerdan kelgani noaniq. Doim aniq manbani ishlating.

## Massiv parametrlar

```html
<input type="checkbox" name="kurslar[]" value="html">
<input type="checkbox" name="kurslar[]" value="css">
```

```php
<?php
$kurslar = $_POST['kurslar'] ?? [];
if (!is_array($kurslar)) {
    $kurslar = [];
}
```

Foydalanuvchi massiv o‘rniga satr (yoki aksincha) yuborishi mumkin — turni tekshiring.

## URL yasash

```php
<?php
$url = 'kurslar.php?' . http_build_query(['q' => 'flex box', 'sahifa' => 2]);
// kurslar.php?q=flex+box&sahifa=2
```

## Mustaqil mashq

`salom.php`:

```php
<?php
$ism = trim($_GET['ism'] ?? '');
if ($ism === '') {
    $ism = 'Mehmon';
}
echo 'Salom, ' . htmlspecialchars($ism) . '!';
```

Brauzerda oching: `salom.php`, `salom.php?ism=Ali`, `salom.php?ism=<b>Ali</b>`.

**Kutilgan natija:** `Salom, Mehmon!`, `Salom, Ali!` va oxirgisida teglar **matn bo‘lib** ko‘rinadi (`Salom, <b>Ali</b>!` qalin emas).
