## Massivni o‘zgartirish

## Qo‘shish va olib tashlash

| Funksiya | Qayerdan | Nima qiladi | Qaytaradi |
| --- | --- | --- | --- |
| `array_push($a, $x)` / `$a[] = $x` | Oxiri | Qo‘shadi | Yangi uzunlik |
| `array_pop($a)` | Oxiri | Olib tashlaydi | Olingan element |
| `array_unshift($a, $x)` | Boshi | Qo‘shadi | Yangi uzunlik |
| `array_shift($a)` | Boshi | Olib tashlaydi | Olingan element |

```php
<?php
$a = ["HTML", "CSS", "PHP"];
array_unshift($a, "Git");      // Git, HTML, CSS, PHP
$oxirgi = array_pop($a);       // "PHP"
$birinchi = array_shift($a);   // "Git"
echo implode(",", $a);         // HTML,CSS
```

`array_shift` va `array_unshift` raqamli indekslarni **qayta raqamlaydi**.

## `unset` — kalit bo‘yicha o‘chirish

```php
<?php
$d = [1, 2, 3];
unset($d[1]);
echo implode(",", array_keys($d)); // 0,2 — teshik qoldi!
echo count($d);                    // 2
$d[] = 9;                          // kalit 3
```

`unset` indekslarni **qayta raqamlamaydi**. Keyin `for ($i = 0; $i < count($d); $i++)` bilan aylansangiz, `$d[1]` mavjud emas — xato. Qayta raqamlash:

```php
<?php
$d = array_values($d); // 0, 1, 2
```

## `array_splice` — o‘rtadan

Massivning **o‘zini** o‘zgartiradi:

```php
<?php
$e = ["a", "b", "c", "d"];
array_splice($e, 1, 2);            // 1-indeksdan 2 ta element olib tashlash
echo implode(",", $e);             // a,d
array_splice($e, 1, 0, ["x", "y"]); // hech narsa olmay, qo‘shish
echo implode(",", $e);             // a,x,y,d
```

## `array_slice` — nusxa

Asl massiv o‘zgarmaydi:

```php
<?php
echo implode(",", array_slice(["a", "b", "c", "d"], 1, 2)); // b,c
```

`array_slice(massiv, boshlanish, uzunlik)` — `substr` kabi.

## Birlashtirish: `array_merge` va `+`

```php
<?php
$a = ["a" => 1, "b" => 2];
$b = ["b" => 3, "c" => 4];
print_r(array_merge($a, $b)); // [a => 1, b => 3, c => 4] — o‘ngdagisi g‘olib
print_r($a + $b);             // [a => 1, b => 2, c => 4] — chapdagisi g‘olib
```

Indeksli massivlarda farq yanada katta:

```php
<?php
print_r(array_merge([1, 2], [3]));   // [1, 2, 3]
print_r([1, 2] + [3, 4, 5]);         // [1, 2, 5] — 0 va 1 kalitlar band edi!
```

Ro‘yxatlarni birlashtirish uchun — `array_merge` yoki spread: `[...$a, ...$b]`.

## Qidirish

```php
<?php
$a = ["HTML", "CSS"];
var_dump(in_array("CSS", $a));        // bool(true)
var_dump(array_search("CSS", $a));    // int(1)
var_dump(in_array("5", [1, 5, 9]));       // bool(true) — yumshoq solishtirish!
var_dump(in_array("5", [1, 5, 9], true)); // bool(false) — qat’iy
```

`in_array` va `array_search` uchinchi argumentsiz `==` ishlatadi. Ishonchli natija uchun `true` bering.

## Mustaqil mashq

Navbat:

```php
<?php
$navbat = ["Ali", "Vali"];
$navbat[] = "Madina";
array_unshift($navbat, "Jasur");
$chaqirildi = array_shift($navbat);
echo "Chaqirildi: $chaqirildi; navbatda: ", implode(" → ", $navbat);
```

**Kutilgan natija:** `Chaqirildi: Jasur; navbatda: Ali → Vali → Madina`
