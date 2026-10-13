## Sessiyalar

HTTP **xotirasiz**: har bir so‘rov — alohida. “Bu foydalanuvchi kirganmi?” degan savolga **sessiya** javob beradi.

## Qanday ishlaydi

1. `session_start()` — brauzerga tasodifiy **sessiya ID** li cookie (`PHPSESSID`) beriladi.
2. Ma’lumot **serverda** saqlanadi (`$_SESSION`), brauzerda faqat ID.
3. Keyingi so‘rovda brauzer ID’ni yuboradi, PHP mos ma’lumotni yuklaydi.

Cookie’dan asosiy farqi: foydalanuvchi `$_SESSION` dagi qiymatni **o‘zgartira olmaydi** — u serverda.

## Boshlash va ishlatish

```php
<?php
session_start(); // har qanday chiqishdan oldin!

$_SESSION['savat'] ??= [];
$_SESSION['savat'][] = 'PHP kursi';

echo count($_SESSION['savat']), ' ta mahsulot';
```

Har sahifa boshida `session_start()`, keyin `$_SESSION` oddiy massiv kabi ishlaydi.

## Kirish (login)

```php
<?php
session_start();

// parol to‘g‘ri bo‘lsa (loyihalar modulida password_verify bilan):
session_regenerate_id(true);           // MUHIM: yangi ID
$_SESSION['user_id'] = $foydalanuvchi['id'];
```

### Nega `session_regenerate_id`?

**Session fixation** hujumi: hujumchi qurbonga oldindan ma’lum sessiya ID’sini “ekib” qo‘yadi; qurbon kirgandan keyin hujumchi o‘sha ID bilan uning nomidan ishlaydi. Kirishdan keyin ID’ni almashtirish bu hujumni yo‘qqa chiqaradi.

## Himoyalangan sahifa

```php
<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: kirish.php');
    exit;
}
```

`exit` ni unutmang — usiz yo‘naltirishdan keyin ham sahifaning qolgan qismi bajariladi (va brauzerga yuborilishi mumkin!).

## Chiqish (logout)

```php
<?php
session_start();
$_SESSION = [];
session_destroy();
setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => '/']);
```

## Xavfsiz sozlamalar

`php.ini` yoki `session_start()` parametrlari:

```php
<?php
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => true,      // HTTPS’da
    'cookie_samesite' => 'Lax',
    'use_strict_mode' => true,    // noma’lum ID’ni qabul qilmaydi
]);
```

## Flash xabar

Bir marta ko‘rsatiladigan xabar (yo‘naltirishdan keyin):

```php
<?php
// saqlashda
$_SESSION['flash'] = 'Ma’lumotlar saqlandi';
header('Location: profil.php');
exit;

// profil.php da
$xabar = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);
```

## Mustaqil mashq

`sanoq.php`:

```php
<?php
session_start();
$_SESSION['korish'] = ($_SESSION['korish'] ?? 0) + 1;
echo 'Siz bu sahifani ', $_SESSION['korish'], '-marta ochdingiz';
```

Sahifani bir necha marta yangilang, keyin boshqa brauzerda (yoki maxfiy oynada) oching.

**Kutilgan natija:** har yangilashda son 1 ga oshadi; boshqa brauzerda sanoq **1 dan** boshlanadi — sessiya har foydalanuvchiniki alohida.
