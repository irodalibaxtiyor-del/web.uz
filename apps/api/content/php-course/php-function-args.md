## Funksiya argumentlari

## Standart qiymat

```php
<?php
function salom(string $ism = "Mehmon"): string
{
    return "Salom, $ism!";
}
echo salom();      // Salom, Mehmon!
echo salom("Ali"); // Salom, Ali!
```

Standart qiymatli parametrlar **oxirida** bo‘lishi kerak.

## Nomlangan argumentlar (PHP 8)

Argumentni nomi bilan berish mumkin — tartib va o‘tkazib yuborilgan parametrlar muammosi yo‘qoladi:

```php
<?php
function narx(int $summa, float $chegirma = 0.0, bool $qqs = false): float
{
    $n = $summa * (1 - $chegirma);
    return $qqs ? $n * 1.12 : $n;
}

echo narx(100000, qqs: true);              // 112000 — chegirmani o‘tkazib yubordik
echo narx(chegirma: 0.5, summa: 1000);     // 500 — tartib muhim emas
```

`narx(100000, 0.0, true)` dan ancha tushunarli: `true` nima ekanini taxmin qilish shart emas.

## O‘zgaruvchan sondagi argumentlar `...`

```php
<?php
function yigindi(int ...$sonlar): int
{
    return array_sum($sonlar); // $sonlar — massiv
}
echo yigindi(1, 2, 3);     // 6
echo yigindi(...[4, 5]);   // 9 — massivni argumentlarga yoyish
```

## Qiymat bo‘yicha va havola bo‘yicha

Standart holatda funksiya argumentning **nusxasini** oladi:

```php
<?php
function qosh(array $a): void
{
    $a[] = 4; // faqat nusxa o‘zgaradi
}
$m = [1, 2, 3];
qosh($m);
echo count($m); // 3
```

`&` bilan — asl o‘zgaruvchi:

```php
<?php
function qoshRef(array &$a): void
{
    $a[] = 4;
}
$m = [1, 2, 3];
qoshRef($m);
echo count($m); // 4
```

Havolani kam ishlating — natija qaytarish odatda tushunarliroq: `$m = qoshilgan($m);`.

> Obyektlar boshqacha: funksiya obyektni o‘zgartirsa, tashqarida ham o‘zgaradi (obyekt “tutqichi” uzatiladi). OOP modulida.

## Union va nullable turlar

```php
<?php
function kod(int|string $id): string
{
    return "ID: $id";
}

function ism(?string $s): string
{
    return $s ?? "noma’lum";
}
echo ism(null); // noma’lum
```

## Bir nechta qiymat qaytarish

Massiv qaytaring va destrukturlang:

```php
<?php
function minMax(array $a): array
{
    return [min($a), max($a)];
}
[$kichik, $katta] = minMax([4, 9, 1]);
echo "$kichik $katta"; // 1 9
```

## Mustaqil mashq

```php
<?php
function chek(string $mahsulot, int $narx, int $soni = 1, bool $qqs = false): string
{
    $jami = $narx * $soni;
    if ($qqs) {
        $jami = (int) round($jami * 1.12);
    }
    return "$mahsulot × $soni = $jami";
}

echo chek("Non", 4000), " | ", chek("Sut", 12000, qqs: true, soni: 2);
```

**Kutilgan natija:** `Non × 1 = 4000 | Sut × 2 = 26880`
