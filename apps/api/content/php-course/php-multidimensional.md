## Ko‘p o‘lchovli massivlar

Massiv elementi o‘zi massiv bo‘lishi mumkin. Amalda eng ko‘p uchraydigan tuzilma — **yozuvlar ro‘yxati** (bazadan kelgan qatorlar shunday ko‘rinadi):

```php
<?php
$talabalar = [
    ["ism" => "Ali", "ball" => 85, "kurslar" => ["HTML", "CSS"]],
    ["ism" => "Madina", "ball" => 92, "kurslar" => ["PHP"]],
];

echo $talabalar[1]["ism"];          // Madina
echo $talabalar[0]["kurslar"][1];   // CSS
```

## Aylanish

```php
<?php
foreach ($talabalar as $t) {
    echo $t["ism"], ": ", implode(", ", $t["kurslar"]), "\n";
}
// Ali: HTML, CSS
// Madina: PHP
```

## Jadval (matritsa)

```php
<?php
$m = [
    [1, 2, 3],
    [4, 5, 6],
];
echo $m[1][2]; // 6

foreach ($m as $qator) {
    echo implode(" ", $qator), "\n";
}
```

## Ichki elementni o‘zgartirish

```php
<?php
$talabalar[0]["ball"] = 90;
$talabalar[0]["kurslar"][] = "PHP";
```

## Ustunni olish: `array_column`

```php
<?php
$ismlar = array_column($talabalar, "ism");        // ["Ali", "Madina"]
$ballar = array_column($talabalar, "ball", "ism"); // ["Ali" => 85, "Madina" => 92]
echo array_sum(array_column($talabalar, "ball"));  // 177
```

Uchinchi argument — natija kalitlari uchun ustun. Bazadan kelgan ma’lumot bilan ishlashda juda qulay.

## Guruhlash

```php
<?php
$kurslar = [
    ["nom" => "HTML", "daraja" => "boshlangich"],
    ["nom" => "PHP", "daraja" => "orta"],
    ["nom" => "CSS", "daraja" => "boshlangich"],
];
$guruh = [];
foreach ($kurslar as $k) {
    $guruh[$k["daraja"]][] = $k["nom"];
}
print_r($guruh);
// [boshlangich => [HTML, CSS], orta => [PHP]]
```

`$guruh[$kalit][] = ...` — kalit hali yo‘q bo‘lsa, ichki massiv avtomatik yaratiladi.

## JSON bilan

Ko‘p o‘lchovli massiv JSON ga to‘g‘ridan-to‘g‘ri aylanadi:

```php
<?php
echo json_encode(["ism" => "Ali", "kurslar" => ["HTML", "CSS"]]);
// {"ism":"Ali","kurslar":["HTML","CSS"]}
```

## Mustaqil mashq

Har bir kurs bo‘yicha o‘rtacha ballni hisoblang:

```php
<?php
$natijalar = [
    ["kurs" => "HTML", "ball" => 80],
    ["kurs" => "PHP", "ball" => 70],
    ["kurs" => "HTML", "ball" => 90],
];
$guruh = [];
foreach ($natijalar as $n) {
    $guruh[$n["kurs"]][] = $n["ball"];
}
foreach ($guruh as $kurs => $ballar) {
    echo "$kurs: ", array_sum($ballar) / count($ballar), "; ";
}
```

**Kutilgan natija:** `HTML: 85; PHP: 70; `
