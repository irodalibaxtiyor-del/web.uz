## Filtrlar

`filter_var` — kiritilgan ma’lumotni **tekshirish** (validate) va **tozalash** (sanitize) uchun tayyor vosita.

## Tekshirish filtrlari

```php
<?php
var_dump(filter_var('25', FILTER_VALIDATE_INT));      // int(25)
var_dump(filter_var(' 42 ', FILTER_VALIDATE_INT));    // int(42) — chetdagi bo‘sh joyga ruxsat
var_dump(filter_var('25.5', FILTER_VALIDATE_INT));    // bool(false)
var_dump(filter_var('12.5', FILTER_VALIDATE_FLOAT));  // float(12.5)
var_dump(filter_var('12,5', FILTER_VALIDATE_FLOAT));  // bool(false) — vergul kasr ajratgich emas
var_dump(filter_var('192.168.1.1', FILTER_VALIDATE_IP)); // string(11) "192.168.1.1"
var_dump(filter_var('999.1.1.1', FILTER_VALIDATE_IP));   // bool(false)
```

Muvaffaqiyatda — **to‘g‘ri turdagi** qiymat (`int`, `float`), xatoda — `false`. Shuning uchun natijani darhol ishlatish mumkin, lekin tekshiruv **`=== false`** bilan.

### Parametrlar bilan

```php
<?php
$yosh = filter_var('150', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 7, 'max_range' => 100],
]);
var_dump($yosh); // bool(false)
```

### Email va URL

```php
<?php
var_dump(filter_var('ali@webdizayn.uz', FILTER_VALIDATE_EMAIL)); // string(16) "ali@webdizayn.uz"
var_dump(filter_var('ali@@web..uz', FILTER_VALIDATE_EMAIL));     // bool(false)
var_dump(filter_var('www.x.uz', FILTER_VALIDATE_URL));           // bool(false) — sxema yo‘q
```

> `FILTER_VALIDATE_URL` faqat **shaklni** tekshiradi: `ftp://...` yoki boshqa sxemalar ham o‘tishi mumkin. Havola sifatida ishlatishdan oldin `https://` bilan boshlanishini alohida tekshiring.

### Mantiqiy qiymat

```php
<?php
var_dump(filter_var('yes', FILTER_VALIDATE_BOOLEAN)); // bool(true) — "1", "true", "on", "yes"
var_dump(filter_var('off', FILTER_VALIDATE_BOOLEAN)); // bool(false)
var_dump(filter_var('abc', FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE)); // NULL — noma’lum
```

## Tozalash filtrlari

```php
<?php
echo filter_var('abc123', FILTER_SANITIZE_NUMBER_INT);       // 123
echo filter_var('<b>Ali</b>', FILTER_SANITIZE_SPECIAL_CHARS); // &#60;b&#62;Ali&#60;/b&#62;
```

Tozalash ma’lumotni **o‘zgartiradi** va xatoni yashiradi. Amalda yaxshiroq yondashuv: **tekshiring** (noto‘g‘ri bo‘lsa rad eting), chiqarishda esa `htmlspecialchars`.

## Bir nechta maydon birdan

```php
<?php
$natija = filter_var_array(
    ['yosh' => '25', 'email' => 'x'],
    ['yosh' => FILTER_VALIDATE_INT, 'email' => FILTER_VALIDATE_EMAIL]
);
var_dump($natija['yosh'], $natija['email']); // int(25), bool(false)
```

To‘g‘ridan-to‘g‘ri so‘rovdan: `filter_input(INPUT_GET, 'sahifa', FILTER_VALIDATE_INT)` — `$_GET` ga murojaatsiz.

## Mustaqil mashq

Ro‘yxatdan o‘tish ma’lumotlarini tekshiring:

```php
<?php
$kiritma = ['yosh' => '17', 'email' => 'madina@mail.uz', 'sayt' => 'webdizayn.uz'];
$t = filter_var_array($kiritma, [
    'yosh' => ['filter' => FILTER_VALIDATE_INT, 'options' => ['min_range' => 18]],
    'email' => FILTER_VALIDATE_EMAIL,
    'sayt' => FILTER_VALIDATE_URL,
]);
foreach ($t as $maydon => $qiymat) {
    echo $maydon, ': ', $qiymat === false ? 'xato' : 'ok', '; ';
}
```

**Kutilgan natija:** `yosh: xato; email: ok; sayt: xato; `
