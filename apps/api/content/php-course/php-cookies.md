## Cookie’lar

**Cookie** — server brauzerga saqlashni buyuradigan kichik matn. Brauzer uni keyingi **har bir** so‘rov bilan qaytarib yuboradi. Til tanlovi, “meni eslab qol” kabi narsalar uchun.

## O‘rnatish: `setcookie`

```php
<?php
setcookie('til', 'uz', [
    'expires' => time() + 60 * 60 * 24 * 365, // 1 yil
    'path' => '/',
    'secure' => true,     // faqat HTTPS orqali
    'httponly' => true,   // JavaScript o‘qiy olmaydi
    'samesite' => 'Lax',  // boshqa saytlardan so‘rovda yuborilmaydi
]);
```

| Parametr | Ma’nosi |
| --- | --- |
| `expires` | Qachon o‘chadi (timestamp). `0` — brauzer yopilguncha |
| `path` | Saytning qaysi qismida yuboriladi |
| `secure` | Faqat HTTPS |
| `httponly` | `document.cookie` da ko‘rinmaydi — XSS’da o‘g‘irlanmaydi |
| `samesite` | `Lax` / `Strict` — CSRF’ga qarshi |

## Diqqat: sarlavhadan oldin!

Cookie HTTP **sarlavhada** yuboriladi. Sahifaga bitta belgi (hatto bo‘sh joy yoki `<?php` dan oldingi bo‘sh qator) chiqarilgandan keyin sarlavhalar yuborilgan bo‘ladi:

```php
<?php
echo "Salom";
setcookie('til', 'uz'); // Warning: Cannot modify header information - headers already sent
```

`setcookie`, `header()` va `session_start()` — har doim **har qanday chiqishdan oldin**. Shu sababli faqat PHP’dan iborat fayllarda yopuvchi `?>` yozilmaydi.

## O‘qish: `$_COOKIE`

```php
<?php
$til = $_COOKIE['til'] ?? 'uz';
```

O‘rnatilgan cookie **keyingi so‘rovda** paydo bo‘ladi — `setcookie` dan keyin darhol `$_COOKIE` da yo‘q.

## Ruxsat etilgan qiymat

Cookie’ni foydalanuvchi istalgancha o‘zgartira oladi — u ham kiritma:

```php
<?php
$til = $_COOKIE['til'] ?? 'uz';
if (!in_array($til, ['uz', 'ru', 'en'], true)) {
    $til = 'uz';
}
```

## O‘chirish

O‘tgan vaqt bilan qayta o‘rnatish:

```php
<?php
setcookie('til', '', ['expires' => time() - 3600, 'path' => '/']);
```

`path` o‘rnatilgandagi bilan bir xil bo‘lishi kerak.

## Nimani saqlamaslik kerak

- Parol, karta raqami, shaxsiy ma’lumot — **hech qachon**.
- “Kirgan foydalanuvchi ID’si” — cookie’da emas (uni soxtalashtirish oson!). Buning uchun **sessiya** — keyingi dars.

Cookie’da faqat qulaylik sozlamalari (til, mavzu) yoki server tomonida tekshiriladigan tasodifiy tokenlar saqlanadi.

## Mustaqil mashq

`til.php`:

```php
<?php
$ruxsat = ['uz', 'ru', 'en'];
if (isset($_GET['til']) && in_array($_GET['til'], $ruxsat, true)) {
    setcookie('til', $_GET['til'], ['expires' => time() + 86400 * 30, 'path' => '/', 'samesite' => 'Lax']);
    header('Location: til.php');
    exit;
}
$til = $_COOKIE['til'] ?? 'uz';
echo "Joriy til: $til";
```

`til.php?til=ru` ni oching, keyin oddiy `til.php` ni yangilang. Brauzer DevTools → **Application → Cookies** da cookie’ni ko‘ring.

**Kutilgan natija:** `Joriy til: ru` va brauzer yopilib ochilgandan keyin ham saqlanadi.
