## Sonlar va matematika

## `int` va `float`

```php
<?php
$yil = 2026;         // int
$narx = 12.5;        // float
$katta = 1_000_000;  // int — pastki chiziq o‘qish uchun (PHP 7.4+)
$ilmiy = 2.5e3;      // float 2500
```

`int` chegarasi `PHP_INT_MAX` (64-bit tizimda `9223372036854775807`). Undan oshsa, natija avtomatik `float` ga aylanadi va aniqlik yo‘qoladi.

## Kasr aniqligi

```php
<?php
echo 0.1 + 0.2;                  // 0.3 — echo 14 xonagacha yaxlitlab ko‘rsatadi
var_dump(0.1 + 0.2 == 0.3);      // bool(false) — aslida 0.30000000000000004
var_dump(round(0.1 + 0.2, 2) == 0.3); // bool(true)
```

`echo` sizni aldashi mumkin: ko‘rinishda `0.3`, lekin taqqoslashda teng emas. Pul uchun summani **butun son** (tiyin) sifatida saqlang yoki `round` qiling.

## Bo‘lish

```php
<?php
var_dump(10 / 4);        // float(2.5)
var_dump(10 / 2);        // int(5)
var_dump(intdiv(17, 5)); // int(3) — butun qism
var_dump(17 % 5);        // int(2) — qoldiq
var_dump(-17 % 5);       // int(-2) — ishora bo‘linuvchidan
var_dump(fmod(7.5, 2));  // float(1.5) — kasr qoldiq
```

Nolga bo‘lish — **xato** (`DivisionByZeroError`), ogohlantirish emas:

```php
<?php
try {
    echo 1 / 0;
} catch (DivisionByZeroError $e) {
    echo $e->getMessage(); // Division by zero
}
```

## Yaxlitlash

| Funksiya | `4.7` | `2.5` | `-2.5` |
| --- | --- | --- | --- |
| `round` | `5` | `3` | `-3` |
| `floor` | `4` | `2` | `-3` |
| `ceil` | `5` | `3` | `-2` |

`round` yarimni noldan **uzoqqa** yaxlitlaydi. Kasr xonalar bilan: `round(1.955, 2)` → `1.96`.

> `round`, `floor`, `ceil` doim **`float`** qaytaradi: `var_dump(floor(4.7))` → `float(4)`. Butun son kerak bo‘lsa — `(int) floor(...)`.

## Matematik funksiyalar

```php
<?php
echo abs(-7);           // 7
echo max(4, 12, 7);     // 12
echo min([4, 12, 7]);   // 4 — massiv ham bo‘ladi
echo sqrt(144);         // 12
echo 2 ** 10;           // 1024
echo pow(2, 3);         // 8
echo pi();              // 3.1415926535898
echo random_int(1, 6);  // tasodifiy zar
```

`random_int` — kriptografik xavfsiz tasodifiy son. Parol, token, kod uchun aynan shu (eski `rand` va `mt_rand` emas).

## Son ekanini tekshirish

```php
<?php
var_dump(is_int(5), is_float(5.0), is_numeric("12.5"));
var_dump(is_nan(NAN), is_infinite(INF));
```

## Formatlash (eslatma)

```php
<?php
echo number_format(2 / 3, 3);          // 0.667
echo number_format(1500000, 0, '.', ' '); // 1 500 000
```

## Mustaqil mashq

100 kishini 45 o‘rinli avtobuslarga joylash va o‘rtacha ballni hisoblash:

```php
<?php
$odam = 100;
$avtobus = (int) ceil($odam / 45);
$ballar = [85, 92, 67];
$ortacha = round(array_sum($ballar) / count($ballar), 1);
echo "Avtobus: $avtobus, o‘rtacha: $ortacha";
```

**Kutilgan natija:** `Avtobus: 3, o‘rtacha: 81.3`
