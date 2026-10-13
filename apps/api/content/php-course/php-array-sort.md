## Massivlarni saralash

Barcha saralash funksiyalari massivning **o‘zini** o‘zgartiradi (havola orqali) va `true` qaytaradi.

## Oddiy massivlar

```php
<?php
$n = [5, 12, 3, 40];
sort($n);   // 3, 5, 12, 40 — o‘sish
rsort($n);  // 40, 12, 5, 3 — kamayish
```

Saralangandan keyin kalitlar `0, 1, 2...` qilib **qayta beriladi**.

JavaScript’dan farqli, PHP sonlarni **son sifatida** saralaydi. Son ko‘rinishidagi satrlar ham:

```php
<?php
$s = ["10", "9", "2"];
sort($s);
echo implode(",", $s);  // 2,9,10
sort($s, SORT_STRING);
echo implode(",", $s);  // 10,2,9 — matn sifatida
```

## Assotsiativ massivlar

`sort` kalitlarni yo‘qotadi. Kalitlarni saqlash uchun:

| Funksiya | Nima bo‘yicha | Tartib |
| --- | --- | --- |
| `asort` | Qiymat | O‘sish |
| `arsort` | Qiymat | Kamayish |
| `ksort` | Kalit | O‘sish |
| `krsort` | Kalit | Kamayish |

```php
<?php
$p = ["non" => 4000, "sut" => 12000, "tuxum" => 1500];
asort($p);
echo implode(",", array_keys($p)); // tuxum,non,sut — arzondan qimmatga
ksort($p);
echo implode(",", array_keys($p)); // non,sut,tuxum — alifbo bo‘yicha
```

## O‘z qoidangiz bilan: `usort`

Solishtirish funksiyasi manfiy, nol yoki musbat son qaytaradi — `<=>` aynan shunday:

```php
<?php
$talabalar = [
    ["ism" => "Ali", "ball" => 85],
    ["ism" => "Madina", "ball" => 92],
    ["ism" => "Jasur", "ball" => 67],
];
usort($talabalar, fn($a, $b) => $b["ball"] <=> $a["ball"]);
echo implode(", ", array_column($talabalar, "ism")); // Madina, Ali, Jasur
```

- `$a <=> $b` — o‘sish;
- `$b <=> $a` — kamayish.

Kalitlarni saqlab o‘z qoidangiz bilan — `uasort`, kalit bo‘yicha — `uksort`.

### Bir nechta mezon

```php
<?php
usort($talabalar, fn($a, $b) => [$b["ball"], $a["ism"]] <=> [$a["ball"], $b["ism"]]);
```

Massivlarni `<=>` bilan solishtirish elementma-element: avval ball (kamayish), teng bo‘lsa ism (o‘sish).

## Nusxani saralash

Saralash asl massivni o‘zgartiradi. Asl kerak bo‘lsa — avval nusxa (PHP’da tayinlash nusxalaydi):

```php
<?php
$asl = [3, 1, 2];
$saralangan = $asl;
sort($saralangan);
echo implode(",", $asl); // 3,1,2
```

## Aralashtirish

```php
<?php
shuffle($savollar); // tasodifiy tartib
```

## Mustaqil mashq

```php
<?php
$reyting = ["Ali" => 85, "Madina" => 92, "Jasur" => 67, "Bobur" => 92];
arsort($reyting);
$orin = 1;
foreach ($reyting as $ism => $ball) {
    echo "$orin. $ism ($ball) ";
    $orin++;
}
```

**Kutilgan natija:** `1. Madina (92) 2. Bobur (92) 3. Ali (85) 4. Jasur (67) `

(Teng ballilar asl tartibini saqlaydi — PHP 8 da saralash **barqaror**.)
