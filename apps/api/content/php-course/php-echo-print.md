## `echo` va `print`

Natijani chiqarishning ikki asosiy usuli.

## `echo`

```php
<?php
echo "Salom!";
echo "Bir", "Ikki", "Uch";  // bir nechta qiymat — vergul bilan
echo "<h1>Sarlavha</h1>";   // HTML ham chiqariladi
```

Natija: `Salom!BirIkkiUch<h1>Sarlavha</h1>`

`echo` — funksiya emas, til konstruktsiyasi: qavs shart emas. Bir nechta qiymatni vergul bilan chiqara oladi.

## `print`

```php
<?php
print "Salom!";
$natija = print "A"; // print doim 1 qaytaradi
```

`print` faqat **bitta** qiymat oladi va `1` qaytaradi. Amalda deyarli doim `echo` ishlatiladi.

| | `echo` | `print` |
| --- | --- | --- |
| Bir nechta qiymat | Ha (vergul bilan) | Yo‘q |
| Qaytaradigan qiymat | Yo‘q | `1` |
| Tezlik | Biroz tezroq | — |

## Qator ko‘chirish

Brauzer uchun — HTML teg, terminal uchun — `"\n"`:

```php
<?php
echo "Birinchi qator<br>";  // brauzerda
echo "Birinchi qator\n";    // terminalda (qo‘sh qo‘shtirnoqda!)
echo PHP_EOL;               // tizimga mos qator oxiri
```

`'\n'` (bittalik qo‘shtirnoqda) — ikki belgi: teskari chiziq va `n`.

## Nuqta yoki vergul?

```php
<?php
$a = 2;
echo "Natija: " . $a + 3;
```

Bu kod `Natija: 5` chiqaradi: PHP 8 da `+` va `-` nuqtadan (`.`) **oldin** bajariladi — `"Natija: " . ($a + 3)`. Lekin bunday kodni o‘qish qiyin. Aniqlik uchun qavs qo‘ying yoki vergul ishlating:

```php
<?php
$a = 2;
echo "Natija: ", $a + 3;     // Natija: 5
echo "Natija: " . ($a + 3);  // Natija: 5
```

## Ma’lumotni ko‘rish (debug)

```php
<?php
$kurs = ["HTML", "CSS"];
print_r($kurs);   // o‘qish uchun qulay
var_dump($kurs);  // turi va uzunligi bilan
```

`var_dump(5)` → `int(5)`, `var_dump("5")` → `string(1) "5"`. Turlarni aniqlashda `var_dump` eng ishonchli.

## HTML ichida qisqa yozuv

```php
<p>Ism: <?= $ism ?></p>
```

`<?=` — `<?php echo` ning qisqartmasi.

## Xavfsizlik: foydalanuvchi matni

Foydalanuvchidan kelgan matnni HTML’ga chiqarishdan oldin **doim** `htmlspecialchars` dan o‘tkazing:

```php
<?php
$izoh = '<script>alert(1)</script>';
echo htmlspecialchars($izoh); // &lt;script&gt;alert(1)&lt;/script&gt;
```

Aks holda sahifangizda begona skript ishga tushadi (XSS). Formalar modulida bunga qaytamiz.

## Mustaqil mashq

`chek.php` — vergul bilan bir nechta qiymat chiqaring:

```php
<?php
$mahsulot = "Non";
$narx = 4000;
$soni = 3;
echo $mahsulot, " × ", $soni, " = ", $narx * $soni, " so‘m";
```

**Kutilgan natija:** `Non × 3 = 12000 so‘m`
