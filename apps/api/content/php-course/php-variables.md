## O‘zgaruvchilar

PHP’da o‘zgaruvchi `$` belgisi bilan boshlanadi va birinchi qiymat berilganda **yaratiladi** — alohida e’lon (`let`, `const`) yo‘q:

```php
<?php
$kurs = "PHP";
$darslar = 63;
$narx = 450000.0;
$ochiq = true;
```

## Nomlash qoidalari

- `$` dan keyin harf yoki `_` bilan boshlanadi: `$ism`, `$_ichki`;
- raqam bilan boshlanmaydi: `$2kurs` — xato;
- faqat harflar, raqamlar va `_`: `$kurs_narxi`, `$kursNarxi`;
- katta-kichik harf **farq qiladi**: `$ism` va `$Ism` — ikki xil o‘zgaruvchi.

PHP’da ikki uslub uchraydi: `$kurs_narxi` (snake_case) va `$kursNarxi` (camelCase). Loyihada bittasini tanlang. Bu kursda camelCase.

## Qiymatni chiqarish

```php
<?php
$ism = "Madina";
echo "Salom, " . $ism . "!";   // Salom, Madina!
echo "Salom, $ism!";            // Salom, Madina!
```

**Qo‘sh qo‘shtirnoq** ichida o‘zgaruvchi o‘z qiymatiga almashadi (interpolatsiya). **Bittalik** qo‘shtirnoqda — yo‘q:

```php
<?php
$ism = "Madina";
echo 'Salom, $ism!';   // Salom, $ism!
```

Nom atrofida harf bo‘lsa, jingalak qavs bilan chegaralang:

```php
<?php
$soni = 5;
echo "{$soni}ta kurs"; // 5ta kurs
```

## Qiymatni almashtirish

```php
<?php
$ball = 70;
$ball = $ball + 15; // 85
$ball += 5;         // 90
echo $ball;
```

## Dinamik turlar

O‘zgaruvchining turi qiymatiga qarab belgilanadi va o‘zgarishi mumkin:

```php
<?php
$x = 5;       // int
$x = "besh";  // endi string
```

Turlar haqida — alohida darsda.

## E’lon qilinmagan o‘zgaruvchi

```php
<?php
echo $yoq; // Warning: Undefined variable $yoq
```

PHP 8 da bu ogohlantirish beradi va `null` bilan davom etadi. Har bir o‘zgaruvchiga ishlatishdan oldin qiymat bering.

## `isset` va `unset`

```php
<?php
$ism = "Ali";
var_dump(isset($ism));   // bool(true)
unset($ism);             // o‘zgaruvchini o‘chirish
var_dump(isset($ism));   // bool(false)
```

`isset` — o‘zgaruvchi mavjud va `null` emasligini tekshiradi.

## O‘zgaruvchilar doirasi

Funksiya ichidagi o‘zgaruvchi tashqaridagini ko‘rmaydi va aksincha — buni “Funksiyalar” modulida batafsil ko‘ramiz.

## Mustaqil mashq

`profil.php` yarating:

```php
<?php
$ism = "Ali";
$yil = 2006;
$joriyYil = 2026;
$yosh = $joriyYil - $yil;
echo "Ism: $ism, yosh: $yosh";
```

Keyin `$ism` va `$yil` ni o‘zingiznikiga almashtiring.

**Kutilgan natija:** `Ism: Ali, yosh: 20`
