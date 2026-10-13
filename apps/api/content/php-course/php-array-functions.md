## Massiv funksiyalari

PHP’da massivlar uchun 80 dan ortiq funksiya bor. Siklni qo‘lda yozishdan oldin tayyor funksiya bormi — tekshiring.

## `array_map` — har birini o‘zgartirish

```php
<?php
$narxlar = [4000, 12000];
$qqs = array_map(fn($n) => (int) round($n * 1.12), $narxlar); // [4480, 13440]
```

Bir nechta massiv bilan:

```php
<?php
print_r(array_map(fn($a, $b) => $a + $b, [1, 2], [10, 20])); // [11, 22]
```

> Diqqat: `array_map(callback, massiv)` — callback **birinchi**. `array_filter(massiv, callback)` da esa massiv birinchi. PHP’ning eski nomuvofiqligi — eslab qoling.

## `array_filter` — tanlash

```php
<?php
$juft = array_filter([1, 2, 3, 4], fn($x) => $x % 2 === 0); // [1 => 2, 3 => 4]
$toza = array_filter(["a", "", "0", null, "b"]);            // [0 => "a", 4 => "b"]
```

Callback’siz — barcha **falsy** qiymatlarni olib tashlaydi (`"0"` ham!). Kalitlar saqlanadi; ro‘yxat kerak bo‘lsa `array_values`.

## `array_reduce` — bitta qiymatga yig‘ish

```php
<?php
echo array_reduce([1, 2, 3], fn($jami, $x) => $jami + $x, 10); // 16
```

Oddiy yig‘indi uchun tayyorlari bor: `array_sum`, `array_product`.

## Tez-tez kerak bo‘ladiganlar

```php
<?php
echo array_sum([1, 2, 3]);                    // 6
echo array_product([2, 3, 4]);                // 24
print_r(array_unique([1, 2, 2, 3, 1]));       // [1, 2, 3] (kalitlar saqlanadi)
print_r(array_reverse([1, 2, 3]));            // [3, 2, 1]
print_r(range(1, 5));                         // [1, 2, 3, 4, 5]
print_r(range(0, 10, 5));                     // [0, 5, 10]
print_r(array_count_values(["olma", "non", "olma"])); // [olma => 2, non => 1]
print_r(array_combine(["a", "b"], [1, 2]));   // [a => 1, b => 2]
print_r(array_flip(["a" => 1, "b" => 2]));    // [1 => a, 2 => b]
print_r(array_fill(0, 3, "-"));               // ["-", "-", "-"]
```

## Kalit va qiymat bilan

```php
<?php
$narxlar = ["non" => 4000, "sut" => 12000];
$qatorlar = array_map(
    fn($nom, $narx) => "$nom: $narx",
    array_keys($narxlar),
    $narxlar
);
echo implode("; ", $qatorlar); // non: 4000; sut: 12000
```

## Zanjir o‘rniga ichma-ich

```php
<?php
$talabalar = [["ism" => "Ali", "ball" => 85], ["ism" => "Jasur", "ball" => 44]];
$otganlar = array_column(
    array_filter($talabalar, fn($t) => $t["ball"] >= 60),
    "ism"
);
echo implode(", ", $otganlar); // Ali
```

Ichma-ich chaqiruvlar uzun bo‘lsa, oraliq natijalarni nomli o‘zgaruvchilarga ajrating.

## `foreach` yoki funksiya?

Ikkalasi ham to‘g‘ri. Funksiyalar qisqa va maqsadni aniq aytadi (“filtrla”, “o‘zgartir”). Murakkab mantiq (bir nechta shart, erta chiqish) bo‘lsa — `foreach` tushunarliroq.

## Mustaqil mashq

```php
<?php
$sozlar = explode(" ", "olma non olma suv olma non");
$sanoq = array_count_values($sozlar);
arsort($sanoq);
$engKop = array_key_first($sanoq);
echo "$engKop ({$sanoq[$engKop]}), turli so‘zlar: ", count($sanoq);
```

**Kutilgan natija:** `olma (3), turli so‘zlar: 3`
