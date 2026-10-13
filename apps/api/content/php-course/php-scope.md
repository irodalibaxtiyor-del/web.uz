## Ko‘rinish doirasi

## Funksiya tashqi o‘zgaruvchini ko‘rmaydi

JavaScript’dan farqli, PHP funksiyasi tashqaridagi o‘zgaruvchilarni **avtomatik ko‘rmaydi**:

```php
<?php
$kurs = "PHP";

function korsat(): string
{
    return $kurs ?? "ko‘rinmaydi"; // $kurs bu yerda mavjud emas
}
echo korsat(); // ko‘rinmaydi
```

Funksiya ichidagi o‘zgaruvchilar — **mahalliy**: har chaqiruvda yangidan yaratiladi va funksiya tugaganda yo‘qoladi.

## To‘g‘ri yo‘l: parametr

```php
<?php
function korsat(string $kurs): string
{
    return "Kurs: $kurs";
}
echo korsat("PHP");
```

Funksiya nimaga bog‘liqligi uning “imzosida” ko‘rinadi — sinash va tushunish oson.

## `global` (kamdan-kam)

```php
<?php
$x = 10;
function olish(): int
{
    global $x;
    return $x;
}
echo olish(); // 10
```

Yoki `$GLOBALS['x']`. Global o‘zgaruvchilar kodni chalkashtiradi: funksiya natijasi tashqi holatga bog‘lanib qoladi. Ulardan qoching.

## `static` o‘zgaruvchi

Chaqiruvlar orasida qiymatini **saqlaydigan** mahalliy o‘zgaruvchi:

```php
<?php
function sanoq(): int
{
    static $n = 0;
    return ++$n;
}
sanoq();
sanoq();
echo sanoq(); // 3
```

`static $n = 0` faqat **birinchi** chaqiruvda bajariladi. Kesh yoki hisoblagich uchun qulay.

## Konstantalar hamma joyda

```php
<?php
const QQS = 0.12;
function qqsBilan(int $n): float
{
    return $n * (1 + QQS); // konstanta ko‘rinadi
}
```

## Superglobal’lar hamma joyda

`$_GET`, `$_POST`, `$_SESSION`, `$_SERVER` — har qanday funksiyada ko‘rinadi (keyingi modullarda).

## Bloklar doira yaratmaydi

PHP’da `if`, `for`, `foreach` **yangi doira yaratmaydi** (JavaScript’dagi `let` dan farqli):

```php
<?php
for ($i = 0; $i < 3; $i++) {
    $oxirgi = $i;
}
echo $i, " ", $oxirgi; // 3 2 — sikldan keyin ham mavjud
```

## Mustaqil mashq

Har chaqiruvda tartib raqamli ID qaytaruvchi funksiya:

```php
<?php
function keyingiId(string $prefiks): string
{
    static $n = 0;
    $n++;
    return $prefiks . str_pad((string) $n, 3, "0", STR_PAD_LEFT);
}

echo keyingiId("B-"), " ", keyingiId("B-"), " ", keyingiId("X-");
```

**Kutilgan natija:** `B-001 B-002 X-003`
