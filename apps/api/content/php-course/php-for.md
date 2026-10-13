## `for` sikli

Necha marta takrorlanishi ma’lum bo‘lganda:

```php
<?php
for ($i = 1; $i <= 5; $i++) {
    echo $i, " ";
}
// 1 2 3 4 5
```

Uch qism: **boshlash** (bir marta), **shart** (har aylanishdan oldin), **qadam** (har aylanishdan keyin).

## Turli qadamlar

```php
<?php
for ($i = 10; $i > 0; $i -= 3) {
    echo $i, " ";
}
// 10 7 4 1
```

## Yig‘indi va jadval

```php
<?php
$yigindi = 0;
for ($i = 1; $i <= 100; $i++) {
    $yigindi += $i;
}
echo $yigindi; // 5050
```

HTML jadval:

```php
<table>
<?php for ($i = 1; $i <= 10; $i++): ?>
  <tr><td>7 × <?= $i ?></td><td><?= 7 * $i ?></td></tr>
<?php endfor; ?>
</table>
```

## `break` va `continue`

```php
<?php
for ($i = 1; $i <= 10; $i++) {
    if ($i % 2) continue; // toqlarni o‘tkazib yuborish
    if ($i > 8) break;
    echo $i;
}
// 2468
```

### Ichma-ich sikldan chiqish

PHP’da `break` va `continue` ga **daraja** berish mumkin:

```php
<?php
for ($i = 0; $i < 3; $i++) {
    for ($j = 0; $j < 3; $j++) {
        if ($j == 1) continue 2; // tashqi siklning keyingi aylanishiga
        echo "$i$j ";
    }
}
// 00 10 20
```

`break 2` — ikkala sikldan ham chiqish.

## Massiv bo‘ylab

```php
<?php
$kurslar = ["HTML", "CSS", "PHP"];
for ($i = 0; $i < count($kurslar); $i++) {
    echo ($i + 1) . ". " . $kurslar[$i] . " ";
}
// 1. HTML 2. CSS 3. PHP
```

Massivlar uchun odatda `foreach` qulayroq — keyingi dars. `for` indeks bilan murakkab ish kerak bo‘lganda (har ikkinchi element, orqaga yurish).

> `count()` ni shartda yozsangiz, u har aylanishda chaqiriladi. Katta massivda oldindan hisoblang: `for ($i = 0, $n = count($a); $i < $n; $i++)`.

## Mustaqil mashq

FizzBuzz: 1 dan 15 gacha — 3 ga bo‘linsa `Fizz`, 5 ga — `Buzz`, ikkalasiga — `FizzBuzz`, aks holda sonning o‘zi:

```php
<?php
for ($i = 1; $i <= 15; $i++) {
    echo match (0) {
        $i % 15 => "FizzBuzz",
        $i % 3 => "Fizz",
        $i % 5 => "Buzz",
        default => $i,
    }, " ";
}
```

**Kutilgan natija:** `1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz `
