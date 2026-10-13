## Assotsiativ massivlar

Kalit — son emas, **nom** bo‘lgan massiv. JavaScript’dagi obyektga o‘xshaydi:

```php
<?php
$kurs = [
    "nom" => "PHP",
    "darslar" => 63,
    "ochiq" => true,
];
echo $kurs["nom"];      // PHP
echo $kurs["darslar"];  // 63
```

`=>` — kalit va qiymatni bog‘laydi. Oxirgi elementdan keyingi vergul ruxsat etilgan va tavsiya qilinadi (git farqlari toza bo‘ladi).

## Qo‘shish va o‘zgartirish

```php
<?php
$narxlar = ["non" => 4000, "sut" => 12000];
$narxlar["choy"] = 9000;   // qo‘shish
$narxlar["non"] = 4500;    // o‘zgartirish
```

## Kalit bormi?

```php
<?php
$a = ["ism" => "Ali", "telefon" => null];
var_dump(isset($a["telefon"]));            // bool(false) — null bo‘lsa false!
var_dump(array_key_exists("telefon", $a)); // bool(true)  — kalit bor
echo $a["manzil"] ?? "ko‘rsatilmagan";     // ko‘rsatilmagan
```

`isset` kalit mavjud **va** `null` emasligini tekshiradi. Kalit mavjudligining o‘zi muhim bo‘lsa — `array_key_exists`.

## Aylanish

```php
<?php
foreach ($narxlar as $nom => $narx) {
    echo "$nom: $narx so‘m\n";
}
```

## Kalitlar va qiymatlar

```php
<?php
$p = ["non" => 4000, "sut" => 12000];
print_r(array_keys($p));    // ["non", "sut"]
print_r(array_values($p));  // [4000, 12000]
```

## Aralash kalitlar

Bitta massivda son va satr kalitlar bo‘lishi mumkin:

```php
<?php
$c = ["x" => 1, 5 => 2];
$c[] = 3; // kalit 6
echo implode(",", array_keys($c)); // x,5,6
```

`"5"` kabi butun son ko‘rinishidagi satr kalit **songa** aylanadi: `$a["5"]` va `$a[5]` — bitta element.

## Massivni “ochib” olish

```php
<?php
$talaba = ["ism" => "Ali", "ball" => 85];
["ism" => $ism, "ball" => $ball] = $talaba;
echo "$ism: $ball"; // Ali: 85

[$birinchi, $ikkinchi] = ["HTML", "CSS"];
```

## Obyekt kabi ishlatish

Oddiy ma’lumot tuzilmalari uchun assotsiativ massivlar juda qulay. Lekin xatti-harakat (metodlar) va qat’iy tuzilma kerak bo‘lsa — klasslar (OOP modulida).

## Mustaqil mashq

Lug‘at:

```php
<?php
$lugat = ["olma" => "apple", "non" => "bread", "suv" => "water"];
$lugat["kitob"] = "book";
foreach (["olma", "kitob", "anor"] as $soz) {
    echo $soz, " → ", $lugat[$soz] ?? "topilmadi", "; ";
}
echo count($lugat), " ta so‘z";
```

**Kutilgan natija:** `olma → apple; kitob → book; anor → topilmadi; 4 ta so‘z`
