## `switch` va `match`

## `switch`

Bitta qiymatni bir nechta variant bilan solishtiradi:

```php
<?php
$kun = "shanba";
switch ($kun) {
    case "shanba":
    case "yakshanba":
        echo "Dam olish";
        break;
    case "juma":
        echo "Qisqa kun";
        break;
    default:
        echo "Ish kuni";
}
```

`break` bo‘lmasa, keyingi `case` lar ham bajariladi (fall-through):

```php
<?php
switch (2) {
    case 1: echo "a";
    case 2: echo "b";
    case 3: echo "c"; break;
    case 4: echo "d";
}
// bc
```

### `switch` yumshoq solishtiradi

`switch` `==` ishlatadi:

```php
<?php
switch ("1") {
    case 1:   echo "son"; break;  // shu ishlaydi: "1" == 1
    case "1": echo "satr"; break;
}
// son
```

## `match` (PHP 8)

`match` — `switch` ning zamonaviy, xavfsiz varianti. U **ifoda**: qiymat qaytaradi.

```php
<?php
$kod = 404;
$xabar = match ($kod) {
    200 => "OK",
    301, 302 => "Yo‘naltirish",
    404 => "Topilmadi",
    500 => "Server xatosi",
    default => "Noma’lum",
};
echo $xabar; // Topilmadi
```

### `switch` dan farqlari

| | `switch` | `match` |
| --- | --- | --- |
| Solishtirish | `==` (yumshoq) | `===` (qat’iy) |
| `break` | Kerak | Yo‘q — fall-through bo‘lmaydi |
| Natija | Yo‘q (buyruq) | Qiymat qaytaradi |
| Mos holat yo‘q | Jimgina o‘tadi | `UnhandledMatchError` |

```php
<?php
echo match ("1") {
    1 => "son",
    "2" => "ikki",
};
// UnhandledMatchError: Unhandled match case '1'
```

Bu xato — **yaxshi**: kutilmagan qiymat jimgina o‘tib ketmaydi. Agar barcha holatlar sanab o‘tilmagan bo‘lsa, `default` qo‘shing.

### Oraliqlar uchun `match(true)`

```php
<?php
$ball = 75;
echo match (true) {
    $ball >= 86 => "5",
    $ball >= 71 => "4",
    $ball >= 56 => "3",
    default => "2",
};
// 4
```

Birinchi `true` ga teng shart tanlanadi.

## Qachon qaysi?

- Yangi kodda — **`match`**: qisqa, qat’iy, natija qaytaradi.
- Har bir holatda bir nechta buyruq bajarilishi kerak bo‘lsa — `switch` yoki `if`.

## Mustaqil mashq

HTTP holat kodini matnga aylantiruvchi funksiya:

```php
<?php
function holat(int $kod): string
{
    return match (true) {
        $kod >= 500 => "Server xatosi",
        $kod >= 400 => "Mijoz xatosi",
        $kod >= 300 => "Yo‘naltirish",
        $kod >= 200 => "Muvaffaqiyat",
        default => "Noma’lum",
    };
}
echo holat(201), " | ", holat(404), " | ", holat(503);
```

**Kutilgan natija:** `Muvaffaqiyat | Mijoz xatosi | Server xatosi`
