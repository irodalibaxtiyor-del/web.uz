## Funksiyalar

Funksiya — nomlangan, qayta ishlatiladigan kod bloki.

```php
<?php
function salom(string $ism): string
{
    return "Salom, $ism!";
}

echo salom("Ali");    // Salom, Ali!
echo salom("Madina"); // Salom, Madina!
```

- `function` — kalit so‘z;
- `salom` — nom (katta-kichik harf farq qilmaydi, lekin doim bir xil yozing);
- `string $ism` — **tiplangan** parametr;
- `: string` — qaytariladigan qiymat turi;
- `return` — natijani qaytaradi va funksiyani tugatadi.

## Tiplar

PHP 7+ da parametr va natija turlarini yozish mumkin — va **kerak**: xatolar erta ko‘rinadi, muharrir yordam beradi.

```php
<?php
function kvadrat(int $x): int
{
    return $x * $x;
}
```

| Tur | Ma’nosi |
| --- | --- |
| `int`, `float`, `string`, `bool`, `array` | Oddiy turlar |
| `?string` | `string` yoki `null` |
| `int\|string` | Ikki turdan biri (union, PHP 8) |
| `void` | Hech narsa qaytarmaydi |
| `mixed` | Istalgan tur |

### Tur mos kelmasa

Standart rejimda PHP turni **aylantirishga** urinadi:

```php
<?php
function kvadrat(int $x): int { return $x * $x; }
echo kvadrat("5");   // 25 — "5" int ga aylandi
echo kvadrat("abc"); // TypeError
```

### `declare(strict_types=1)`

Fayl boshida yozilsa, avtomatik aylantirish **o‘chadi**:

```php
<?php
declare(strict_types=1);

function kvadrat(int $x): int { return $x * $x; }
echo kvadrat("5"); // TypeError: Argument #1 ($x) must be of type int, string given
```

Zamonaviy loyihalarning ko‘pi har faylni `declare(strict_types=1);` bilan boshlaydi. Istisno: `int` ni `float` parametrga berish qat’iy rejimda ham mumkin.

## `void` va `return`

```php
<?php
function chiqar(string $matn): void
{
    echo $matn;
}
$r = chiqar("salom");
var_dump($r); // NULL
```

`return` bo‘lmagan funksiya `null` qaytaradi.

## Funksiya e’lon qilinishidan oldin chaqirish

Oddiy funksiyalarni fayldagi istalgan joydan chaqirish mumkin — PHP ularni avvaldan tanib oladi:

```php
<?php
echo ikki(3); // 6
function ikki(int $x): int { return $x * 2; }
```

## Rekursiya

Funksiya o‘zini chaqirishi mumkin:

```php
<?php
function faktorial(int $n): int
{
    return $n <= 1 ? 1 : $n * faktorial($n - 1);
}
echo faktorial(5); // 120
```

Har rekursiyada **to‘xtash sharti** bo‘lishi shart.

## Tayyor funksiyalar

PHP’da mingdan ortiq tayyor funksiya bor: `strlen`, `count`, `date`, `json_encode`... Funksiya nomini bilmasangiz — php.net qidiruvi.

## Mustaqil mashq

```php
<?php
declare(strict_types=1);

function chegirmali(int $narx, int $foiz): int
{
    return intdiv($narx * (100 - $foiz), 100);
}

echo chegirmali(450000, 20), " ", chegirmali(99000, 15);
```

**Kutilgan natija:** `360000 84150`
