## Satrlar

Satr — matn. PHP’da u to‘rt xil yoziladi.

## Bittalik qo‘shtirnoq `'...'`

Matn **so‘zma-so‘z** olinadi: o‘zgaruvchilar va maxsus belgilar ishlamaydi.

```php
<?php
$ism = "Ali";
echo 'Salom, $ism\n'; // Salom, $ism\n
```

Faqat ikkita escape bor: `\'` (qo‘shtirnoqning o‘zi) va `\\`.

## Qo‘sh qo‘shtirnoq `"..."`

O‘zgaruvchilar **qiymatga almashadi** va maxsus belgilar ishlaydi:

```php
<?php
$ism = "Ali";
echo "Salom, $ism!";  // Salom, Ali!
echo "A\tB";          // A, tabulyatsiya, B
```

| Escape | Ma’nosi |
| --- | --- |
| `\n` | Yangi qator |
| `\t` | Tabulyatsiya |
| `\"` | Qo‘sh qo‘shtirnoq |
| `\$` | Dollar belgisining o‘zi |
| `\\` | Teskari chiziq |

### Massiv va obyekt elementlari

Murakkab ifodalarni jingalak qavsga oling:

```php
<?php
$kurs = ['nom' => 'PHP', 'darslar' => 63];
echo "Kurs: {$kurs['nom']}, {$kurs['darslar']} dars";
// Kurs: PHP, 63 dars
```

## Heredoc `<<<`

Ko‘p qatorli matn, qo‘sh qo‘shtirnoq kabi ishlaydi:

```php
<?php
$ism = "Ali";
echo <<<MATN
Hurmatli $ism!
Darslar dushanba kuni boshlanadi.
MATN;
```

## Nowdoc `<<<'...'`

Ko‘p qatorli, bittalik qo‘shtirnoq kabi — hech narsa almashtirilmaydi:

```php
<?php
echo <<<'KOD'
echo "$ism";
KOD;
// echo "$ism";
```

Kod misollarini chiqarish uchun qulay.

## Satrlarni ulash: `.`

```php
<?php
$ism = "Ali";
$familiya = "Valiyev";
$toliq = $ism . " " . $familiya; // Ali Valiyev
$toliq .= "!";                     // Ali Valiyev!
```

`.=` — oxiriga qo‘shish. **Diqqat:** `+` satrlarni ulamaydi — u qo‘shadi (`"5" + "3"` → `8`).

## Belgiga murojaat

```php
<?php
$s = "PHP";
echo $s[0];   // P
echo $s[-1];  // P — oxiridan
```

> `$s[0]` **baytni** oladi. O‘zbekcha `o‘`, `g‘` yoki kirill harflari bir necha baytdan iborat — ular uchun `mb_substr($s, 0, 1)` ishlating.

## Uzunlik va UTF-8

```php
<?php
echo strlen("O‘zbekiston");    // 13 — baytlar
echo mb_strlen("O‘zbekiston"); // 11 — belgilar
```

`‘` belgisi UTF-8 da 3 bayt. O‘zbekcha matn bilan doim `mb_` funksiyalari: `mb_strlen`, `mb_substr`, `mb_strtoupper`.

## Taqqoslash

```php
<?php
var_dump("olma" === "olma"); // bool(true)
var_dump("Olma" === "olma"); // bool(false)
echo strcmp("a", "b");       // -1 — alifbo bo‘yicha oldin
echo strcasecmp("PHP", "php"); // 0 — registrsiz teng
```

## Mustaqil mashq

```php
<?php
$ism = "Madina";
$kurs = ['nom' => 'PHP', 'modul' => 15];
$xat = "Salom, $ism! ";
$xat .= "Siz {$kurs['nom']} kursiga yozildingiz ({$kurs['modul']} modul).";
echo $xat;
```

**Kutilgan natija:** `Salom, Madina! Siz PHP kursiga yozildingiz (15 modul).`
