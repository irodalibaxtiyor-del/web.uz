## Ma’lumot turlari

| Tur | Misol | `var_dump` |
| --- | --- | --- |
| `int` (butun son) | `42`, `-7`, `0x1A` | `int(42)` |
| `float` (kasr son) | `3.14`, `2.5e3` | `float(3.14)` |
| `string` (satr) | `"Salom"`, `'PHP'` | `string(5) "Salom"` |
| `bool` (mantiqiy) | `true`, `false` | `bool(true)` |
| `array` (massiv) | `[1, 2, 3]` | `array(3) {...}` |
| `object` (obyekt) | `new Talaba()` | `object(Talaba)#1 ...` |
| `null` | `null` | `NULL` |

## Turni aniqlash

```php
<?php
$x = 42;
echo gettype($x);       // integer
echo get_debug_type($x); // int — PHP 8, qisqa nomlar
var_dump($x);           // int(42)
```

Tekshiruvchi funksiyalar:

```php
<?php
var_dump(is_int(5));        // bool(true)
var_dump(is_string("5"));   // bool(true)
var_dump(is_numeric("12")); // bool(true) — son ko‘rinishidagi satr
var_dump(is_array([1]));    // bool(true)
var_dump(is_null(null));    // bool(true)
```

## `int` va `float`

```php
<?php
var_dump(10 / 2);  // int(5)   — natija butun bo‘lsa, int
var_dump(7 / 2);   // float(3.5) — aks holda float
var_dump(intdiv(7, 2)); // int(3) — butun bo‘lish
var_dump(7 % 2);   // int(1)  — qoldiq
```

`/` ning turi natijaga bog‘liq: `10 / 2` → `int(5)`, `7 / 2` → `float(3.5)`. Doim butun natija kerak bo‘lsa — `intdiv`.

## Satrlar

```php
<?php
var_dump("PHP");      // string(3) "PHP"
var_dump("Olma");     // string(4) "Olma"
var_dump(strlen("O‘zbek")); // int(8) — o‘ harfi UTF-8 da ko‘p bayt!
```

`strlen` **baytlarni** sanaydi. O‘zbekcha harflar (`o‘`, `g‘`) va kirill uchun `mb_strlen` ishlating — satrlar darsida.

## `bool`

```php
<?php
$kirgan = true;
var_dump($kirgan); // bool(true)
echo true;   // 1
echo false;  // (hech narsa chiqmaydi)
```

`echo false` bo‘sh satr chiqaradi — bu ko‘p chalkashlik beradi. Mantiqiy qiymatni ko‘rish uchun `var_dump`.

## `null`

Qiymat yo‘qligini bildiradi:

```php
<?php
$manzil = null;
var_dump($manzil);          // NULL
echo $manzil ?? "kiritilmagan"; // kiritilmagan
```

`??` — chapdagi `null` (yoki mavjud emas) bo‘lsa, o‘ngdagini oladi.

## Avtomatik aylantirish

PHP kerak bo‘lganda turlarni o‘zi aylantiradi:

```php
<?php
echo "5" + 3;     // 8 — satr songa aylandi
echo "5" . 3;     // 53 — son satrga aylandi
var_dump("10" == 10); // bool(true)
```

`+` — doim **qo‘shish**, `.` — doim **ulash**. JavaScript’dagi `'5' + 3 = '53'` chalkashligi PHP’da yo‘q.

PHP 8 da son bo‘lmagan satr bilan arifmetika xato beradi:

```php
<?php
echo "olma" + 1; // TypeError: Unsupported operand types: string + int
```

## Mustaqil mashq

Har bir qiymatning turini `get_debug_type` bilan chiqaring:

```php
<?php
$qiymatlar = [42, 3.5, "PHP", true, null, [1, 2]];
foreach ($qiymatlar as $q) {
    echo get_debug_type($q), " ";
}
```

**Kutilgan natija:** `int float string bool null array `
