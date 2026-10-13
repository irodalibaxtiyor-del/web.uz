## Konstantalar

**Konstanta** — bir marta qiymat beriladigan va o‘zgarmaydigan nom. O‘zgaruvchidan farqli, `$` belgisi **yo‘q** va hamma joyda (funksiyalar ichida ham) ko‘rinadi.

## `const` va `define`

```php
<?php
const SAYT_NOMI = "WEBDIZAYN.UZ";
define('MAKS_URINISH', 3);

echo SAYT_NOMI;      // WEBDIZAYN.UZ
echo MAKS_URINISH;   // 3
```

| | `const` | `define()` |
| --- | --- | --- |
| Qayerda | Faylning yuqori darajasida, klass ichida | Istalgan joyda (shart ichida ham) |
| Qachon aniqlanadi | Kompilyatsiya paytida | Bajarilish paytida |
| Nom | Qat’iy | O‘zgaruvchidan ham olinishi mumkin |

Odatda `const` ishlating; shartga qarab aniqlash kerak bo‘lsa — `define`.

## Qayta aniqlab bo‘lmaydi

```php
<?php
const NARX = 1000;
NARX = 2000; // Parse error — konstantaga qiymat berib bo‘lmaydi
```

```php
<?php
define('KURS', 'PHP');
define('KURS', 'JS'); // Warning: Constant KURS already defined
echo KURS;            // PHP
```

## Nomlash

Konstantalar odatda **KATTA_HARF** va pastki chiziq bilan: `SAYT_NOMI`, `MAKS_HAJM`.

## Konstanta massiv bo‘lishi mumkin

```php
<?php
const RANGLAR = ['qizil', 'yashil', 'ko‘k'];
echo RANGLAR[1]; // yashil
```

## Mavjudligini tekshirish

```php
<?php
var_dump(defined('SAYT_NOMI')); // bool(false) — hali aniqlanmagan
```

## Tayyor konstantalar

```php
<?php
echo PHP_VERSION;   // masalan: 8.3.12
echo PHP_INT_MAX;   // 9223372036854775807
echo PHP_EOL;       // qator oxiri
echo M_PI;          // 3.1415926535898
```

## “Sehrli” konstantalar

Ishlatilgan joyiga qarab qiymati o‘zgaradi:

| Konstanta | Qiymati |
| --- | --- |
| `__LINE__` | Joriy qator raqami |
| `__FILE__` | Faylning to‘liq yo‘li |
| `__DIR__` | Fayl joylashgan papka |
| `__FUNCTION__` | Joriy funksiya nomi |
| `__CLASS__` | Joriy klass nomi |

`__DIR__` fayllarni ulashda juda foydali:

```php
<?php
require __DIR__ . '/sozlamalar.php';
```

Bu skript qaysi papkadan ishga tushirilishidan qat’i nazar, to‘g‘ri faylni topadi.

## Qachon konstanta?

- Butun dastur davomida o‘zgarmaydigan sozlamalar: sayt nomi, limitlar, stavkalar.
- “Sehrli son” o‘rniga ma’noli nom: `$narx * (1 + QQS)` — `$narx * 1.12` dan tushunarliroq.

> Parol va maxfiy kalitlarni kodga konstanta qilib yozmang — ular muhit o‘zgaruvchilarida (`getenv('DB_PAROL')`) yoki repoga kirmaydigan sozlama faylida saqlanadi.

## Mustaqil mashq

```php
<?php
const QQS = 0.12;
const CHIPTA = 25000;
$soni = 4;
$jami = CHIPTA * $soni;
echo "Jami: ", $jami, " so‘m, QQS bilan: ", $jami * (1 + QQS), " so‘m";
```

**Kutilgan natija:** `Jami: 100000 so‘m, QQS bilan: 112000 so‘m`
