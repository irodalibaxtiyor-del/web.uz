## Turlarni aylantirish (casting)

Formadan, URL’dan yoki fayldan kelgan ma’lumot **doim satr**. Hisoblashdan oldin uni kerakli turga aylantirish kerak.

## Aniq aylantirish

Qiymat oldiga qavs ichida tur yoziladi:

```php
<?php
$matn = "42";
$son = (int) $matn;      // 42
$kasr = (float) "3.5";   // 3.5
$satr = (string) 2026;   // "2026"
$mantiq = (bool) "0";    // false
$massiv = (array) "PHP"; // ["PHP"]
```

Funksiya shaklida ham bor: `intval("42")`, `floatval("3.5")`, `strval(2026)`, `boolval("0")`.

## `(int)` qanday ishlaydi

| Qiymat | `(int)` natijasi |
| --- | --- |
| `"42"` | `42` |
| `"42abc"` | `42` — boshidagi raqamlar olinadi |
| `"abc"` | `0` |
| `"3.99"` | `3` — kasr qismi **tashlanadi** (yaxlitlanmaydi) |
| `true` / `false` | `1` / `0` |
| `null` | `0` |

```php
<?php
var_dump((int) "3.99");   // int(3)
var_dump((int) round(3.99)); // int(4)
```

## `(bool)` — falsy qiymatlar

`false` ga aylanadigan qiymatlar:

- `false`, `0`, `0.0`;
- `""` (bo‘sh satr) va `"0"`;
- `[]` (bo‘sh massiv);
- `null`.

Qolgan **hamma narsa** — `true`, jumladan `"false"`, `" "`, `"0.0"`.

```php
<?php
var_dump((bool) "0");     // bool(false) — JavaScript’dan farqli!
var_dump((bool) "0.0");   // bool(true)
var_dump((bool) []);      // bool(false)
```

## Son ko‘rinishidagi satrmi?

Aylantirishdan oldin tekshirish:

```php
<?php
var_dump(is_numeric("42"));    // bool(true)
var_dump(is_numeric("4.2e3")); // bool(true)
var_dump(is_numeric("42abc")); // bool(false)
var_dump(is_numeric(" 42"));   // bool(true) — boshidagi bo‘sh joyga ruxsat
```

Formadan kelgan sonni xavfsiz o‘qishning eng yaxshi usuli — `filter_var` (filtrlar darsida):

```php
<?php
$yosh = filter_var("25", FILTER_VALIDATE_INT); // int(25), noto‘g‘ri bo‘lsa false
```

## Avtomatik aylantirish

```php
<?php
echo "10" + 5;     // 15
echo "10" . 5;     // 105
echo 10 . "";      // "10"
var_dump("10" == "1e1"); // bool(true) — ikkalasi ham son ko‘rinishida
```

Oxirgi misol — nega taqqoslashda `===` kerakligining sababi (taqqoslash darsida).

## `settype`

O‘zgaruvchining o‘zini aylantiradi:

```php
<?php
$x = "123";
settype($x, "integer");
var_dump($x); // int(123)
```

## Mustaqil mashq

Formadan kelgandek satrlarni songa aylantirib, yig‘indini hisoblang:

```php
<?php
$a = "12";
$b = "7.5";
$c = "3 dona";
$jami = (int) $a + (float) $b + (int) $c;
echo $jami;
```

**Kutilgan natija:** `22.5`
