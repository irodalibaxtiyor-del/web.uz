## Massivlar

**Massiv** — bir nechta qiymatni bitta nom ostida saqlaydi. PHP’da massiv juda universal: u ro‘yxat ham, lug‘at ham, stek ham bo‘la oladi.

```php
<?php
$kurslar = ["HTML", "CSS", "PHP"];
echo $kurslar[0];      // HTML
echo count($kurslar);  // 3
```

Eski yozuv `array("HTML", "CSS")` ham uchraydi — `[...]` zamonaviyroq.

## Indekslar

Oddiy (indeksli) massivda kalitlar avtomatik `0, 1, 2...`:

```php
<?php
$a = ["HTML", "CSS", "PHP"];
echo $a[2];                // PHP
echo $a[count($a) - 1];    // PHP — oxirgisi
echo end($a);              // PHP — oxirgisi (ichki ko‘rsatkichni ham suradi)
echo $a[5] ?? "yo‘q";      // yo‘q — mavjud bo‘lmagan indeks
```

`$a[5]` ni `??` siz o‘qisangiz — `Warning: Undefined array key 5`.

## Qo‘shish

```php
<?php
$a = ["HTML", "CSS"];
$a[] = "PHP";              // oxiriga
array_push($a, "JS", "SQL"); // bir nechtasini
echo count($a); // 5
```

`$a[] = ...` — eng ko‘p ishlatiladigan yozuv.

### Indeks qayerdan davom etadi?

Yangi element **eng katta butun kalit + 1** ni oladi:

```php
<?php
$b = [3 => "a"];
$b[] = "b";        // kalit 4
print_r($b);       // [3 => "a", 4 => "b"]
```

## Massivni ko‘rish

```php
<?php
print_r(["HTML", "CSS"]);
// Array ( [0] => HTML [1] => CSS )
var_dump([1, "a"]);
```

`echo $massiv` — `Array` so‘zini va ogohlantirishni chiqaradi. Massivni matnga aylantirish uchun `implode`:

```php
<?php
echo implode(", ", ["HTML", "CSS", "PHP"]); // HTML, CSS, PHP
```

## Massiv — qiymat turi!

JavaScript’dan muhim farq: PHP’da massiv tayinlanganda **nusxalanadi**:

```php
<?php
$x = [3, 1, 2];
$y = $x;      // nusxa
$y[] = 9;
sort($y);
echo implode(",", $x); // 3,1,2 — asl massiv o‘zgarmadi
```

Funksiyaga berilganda ham shunday (havola `&` bo‘lmasa).

## Massivmi?

```php
<?php
var_dump(is_array([1, 2]));  // bool(true)
var_dump(empty([]));         // bool(true) — bo‘sh
```

## Aylanish (eslatma)

```php
<?php
foreach ($kurslar as $i => $kurs) {
    echo ($i + 1) . ". $kurs ";
}
```

## Mustaqil mashq

```php
<?php
$xaridlar = ["non", "sut"];
$xaridlar[] = "tuxum";
array_push($xaridlar, "choy");
echo count($xaridlar), ": ", implode(", ", $xaridlar), " (oxirgisi: ", end($xaridlar), ")";
```

**Kutilgan natija:** `4: non, sut, tuxum, choy (oxirgisi: choy)`
