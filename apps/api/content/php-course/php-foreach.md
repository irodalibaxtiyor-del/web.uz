## `foreach` sikli

Massiv elementlari bo‘ylab aylanishning asosiy usuli:

```php
<?php
$kurslar = ["HTML", "CSS", "PHP"];
foreach ($kurslar as $kurs) {
    echo $kurs, " ";
}
// HTML CSS PHP
```

## Kalit va qiymat

```php
<?php
$narxlar = ["non" => 4000, "sut" => 12000];
foreach ($narxlar as $nom => $narx) {
    echo "$nom: $narx so‘m ";
}
// non: 4000 so‘m sut: 12000 so‘m
```

Oddiy massivda kalit — indeks:

```php
<?php
foreach (["a", "b"] as $i => $harf) {
    echo "$i:$harf ";
}
// 0:a 1:b
```

## Elementlarni o‘zgartirish: havola `&`

Odatda `$kurs` — **nusxa**: uni o‘zgartirish massivga ta’sir qilmaydi. O‘zgartirish uchun havola:

```php
<?php
$sonlar = [1, 2, 3];
foreach ($sonlar as &$son) {
    $son *= 2;
}
unset($son); // MUHIM!
echo implode(",", $sonlar); // 2,4,6
```

### `unset` qilinmasa — tuzoq

Sikldan keyin `$son` hamon oxirgi elementga **havola** bo‘lib qoladi:

```php
<?php
$a = [1, 2, 3];
foreach ($a as &$v) {}
foreach ($a as $v) {}   // har aylanishda oxirgi elementga yozadi!
echo implode(",", $a);  // 1,2,2
```

Havolali `foreach` dan keyin **doim** `unset($v)`. Yoki havolasiz yozing: `foreach ($a as $i => $v) { $a[$i] = $v * 2; }`.

## Obyektlar massivi

```php
<?php
$talabalar = [
    ["ism" => "Ali", "ball" => 85],
    ["ism" => "Madina", "ball" => 92],
];
foreach ($talabalar as $t) {
    echo "{$t['ism']}: {$t['ball']} ";
}
// Ali: 85 Madina: 92
```

## Shablonda

```php
<ul>
<?php foreach ($kurslar as $kurs): ?>
  <li><?= htmlspecialchars($kurs) ?></li>
<?php endforeach; ?>
</ul>
```

## Bo‘sh massiv

Bo‘sh massivda `foreach` bir marta ham aylanmaydi — xato yo‘q. Lekin massiv **emas** (masalan, `null`) bo‘lsa — ogohlantirish. Ishonchsiz manbada: `foreach ($royxat ?? [] as $x)`.

## Mustaqil mashq

O‘tgan talabalarni sanang va o‘rtacha ballni hisoblang:

```php
<?php
$ballar = ["Ali" => 85, "Madina" => 92, "Jasur" => 67, "Bobur" => 44];
$otgan = 0;
$jami = 0;
foreach ($ballar as $ism => $ball) {
    $jami += $ball;
    if ($ball >= 60) {
        $otgan++;
    }
}
echo "O‘tdi: $otgan, o‘rtacha: ", $jami / count($ballar);
```

**Kutilgan natija:** `O‘tdi: 3, o‘rtacha: 72`
