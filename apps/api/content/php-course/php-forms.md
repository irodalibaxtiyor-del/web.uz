## Formalarni qayta ishlash

## GET yoki POST?

| | `GET` | `POST` |
| --- | --- | --- |
| Ma’lumot qayerda | URL’da (`?q=php`) | So‘rov tanasida |
| Ko‘rinadimi | Ha, tarixda va loglarda qoladi | URL’da ko‘rinmaydi |
| Qachon | Qidiruv, filtr, sahifalash | Ro‘yxatdan o‘tish, buyurtma, parol |
| Qayta yuborish | Xavfsiz | Brauzer ogohlantiradi |

Qoida: ma’lumotni **o‘qiydigan** so‘rov — GET, **o‘zgartiradigan** (yozish, o‘chirish) — POST. Parol hech qachon GET’da bo‘lmaydi.

## Bitta faylda forma va qayta ishlash

`aloqa.php`:

```php
<?php
$ism = '';
$xabar = '';
$natija = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ism = trim($_POST['ism'] ?? '');
    $xabar = trim($_POST['xabar'] ?? '');
    $natija = "Rahmat, $ism! Xabaringiz qabul qilindi.";
}
?>
<!DOCTYPE html>
<html lang="uz">
<body>
  <?php if ($natija !== ''): ?>
    <p><?= htmlspecialchars($natija) ?></p>
  <?php endif; ?>

  <form method="post">
    <label>Ism <input name="ism" value="<?= htmlspecialchars($ism) ?>"></label>
    <label>Xabar <textarea name="xabar"><?= htmlspecialchars($xabar) ?></textarea></label>
    <button type="submit">Yuborish</button>
  </form>
</body>
</html>
```

E’tibor bering:

- `name` atributi — `$_POST` dagi kalit;
- forma `action` siz — o‘sha sahifaga yuboriladi;
- xatodan keyin kiritilgan qiymatlar **qaytariladi** (`value="..."`) — foydalanuvchi qayta yozmaydi;
- har bir chiqarishda `htmlspecialchars`.

## POST → Redirect → GET

Muvaffaqiyatli yuborishdan keyin sahifa yangilansa, brauzer formani **qayta yuboradi** (ikki marta buyurtma!). Yechim — boshqa sahifaga yo‘naltirish:

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $xatolar === []) {
    // ... saqlash
    header('Location: rahmat.php');
    exit;
}
```

`header()` HTML chiqarilishidan **oldin** chaqirilishi shart, `exit` esa skriptni to‘xtatadi.

## Har xil maydonlar

```php
<?php
$obuna = isset($_POST['obuna']);                  // checkbox: yuborilmasa kalit umuman yo‘q
$daraja = $_POST['daraja'] ?? 'boshlangich';      // radio / select
$kurslar = (array) ($_POST['kurslar'] ?? []);     // name="kurslar[]"
```

Belgilanmagan checkbox **umuman yuborilmaydi** — shuning uchun `isset`.

## Ruxsat etilgan qiymatlar

`select` va `radio` dan kelgan qiymatni ro‘yxat bilan tekshiring — foydalanuvchi boshqa qiymat yuborishi mumkin:

```php
<?php
$ruxsat = ['boshlangich', 'orta', 'yuqori'];
$daraja = $_POST['daraja'] ?? '';
if (!in_array($daraja, $ruxsat, true)) {
    $daraja = 'boshlangich';
}
```

## Mustaqil mashq

Yuqoridagi `aloqa.php` ni yarating, `php -S localhost:8000` bilan oching va:

1. Formani to‘ldirib yuboring.
2. Ismga `<script>alert(1)</script>` yozib yuboring.

**Kutilgan natija:** 1 — “Rahmat, … Xabaringiz qabul qilindi.”; 2 — skript **ishlamaydi**, teglar matn bo‘lib ko‘rinadi.
