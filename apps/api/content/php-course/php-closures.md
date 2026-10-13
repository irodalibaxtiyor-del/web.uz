## Anonim funksiyalar va callback’lar

## Anonim funksiya (closure)

Nomsiz funksiya o‘zgaruvchiga saqlanadi yoki argument sifatida beriladi:

```php
<?php
$kvadrat = function (int $x): int {
    return $x * $x;
};
echo $kvadrat(7); // 49
```

Oxiridagi `;` ga e’tibor bering — bu tayinlash buyrug‘i.

## `use` — tashqi o‘zgaruvchini olish

Anonim funksiya ham tashqi o‘zgaruvchilarni avtomatik ko‘rmaydi. `use` bilan ularni **nusxalab** oladi:

```php
<?php
$k = 2;
$kop = function (int $a) use ($k): int {
    return $a * $k;
};
$k = 3;
echo $kop(5); // 10 — yaratilgan paytdagi $k = 2 olindi
```

Havola bilan — asl o‘zgaruvchi:

```php
<?php
$sanoq = 0;
$oshir = function () use (&$sanoq): void {
    $sanoq++;
};
$oshir();
$oshir();
echo $sanoq; // 2
```

## Arrow funksiya `fn` (PHP 7.4+)

Bitta ifodali qisqa funksiya. Tashqi o‘zgaruvchilarni **avtomatik** (qiymat bo‘yicha) oladi:

```php
<?php
$k = 3;
$kop = fn(int $a): int => $a * $k;
echo $kop(5); // 15
```

`fn` faqat bitta ifoda — `return` yozilmaydi.

## Callback — funksiyaga funksiya berish

Massiv funksiyalari callback oladi:

```php
<?php
$sonlar = [1, 2, 3, 4];
$ikki = array_map(fn($x) => $x * 2, $sonlar);         // [2, 4, 6, 8]
$juft = array_filter($sonlar, fn($x) => $x % 2 === 0); // [1 => 2, 3 => 4]
usort($sonlar, fn($a, $b) => $b <=> $a);              // kamayish tartibida
```

`array_filter` **kalitlarni saqlaydi**: natija `[1 => 2, 3 => 4]`. Qayta raqamlash uchun `array_values(...)`.

## Funksiya nomi — callback sifatida

```php
<?php
echo implode(",", array_map('strtoupper', ["a", "b"])); // A,B
$f = strlen(...);  // PHP 8.1: funksiyadan closure
echo $f("abcd");   // 4
```

## O‘zingizning callback qabul qiluvchi funksiyangiz

```php
<?php
function qollash(array $a, callable $fn): array
{
    $natija = [];
    foreach ($a as $x) {
        $natija[] = $fn($x);
    }
    return $natija;
}
echo implode(" ", qollash([1, 2, 3], fn($x) => $x ** 2)); // 1 4 9
```

`callable` — “chaqirsa bo‘ladigan narsa” turi.

## Funksiya qaytaradigan funksiya

```php
<?php
function kopaytiruvchi(int $n): Closure
{
    return fn(int $x): int => $x * $n;
}
$uch = kopaytiruvchi(3);
echo $uch(7); // 21
```

## Mustaqil mashq

Narxlar ro‘yxatidan 10 000 dan arzonlarini olib, QQS qo‘shing:

```php
<?php
$narxlar = [4000, 12000, 1500, 25000];
$arzon = array_filter($narxlar, fn($n) => $n < 10000);
$qqs = array_map(fn($n) => (int) round($n * 1.12), $arzon);
echo implode(", ", $qqs);
```

**Kutilgan natija:** `4480, 1680`
