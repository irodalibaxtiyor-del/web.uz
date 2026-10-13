## Operatorlar

## Arifmetik

| Operator | Ma’nosi | Misol | Natija |
| --- | --- | --- | --- |
| `+ - * /` | To‘rt amal | `7 * 3` | `21` |
| `%` | Qoldiq | `17 % 5` | `2` |
| `**` | Daraja | `2 ** 10` | `1024` |
| `-$x` | Ishorani o‘zgartirish | `-5` | `-5` |

## Tayinlash

```php
<?php
$a = 10;
$a += 5;   // 15
$a -= 3;   // 12
$a *= 2;   // 24
$a /= 4;   // 6
$a %= 4;   // 2
$s = "a";
$s .= "b"; // "ab" — satrga qo‘shish
```

## Inkrement va dekrement

```php
<?php
$x = 5;
echo $x++; // 5 — avval qiymat, keyin oshiradi
echo $x;   // 6
echo ++$x; // 7 — avval oshiradi, keyin qiymat
```

Bitta ifodada `$x++` va `++$x` ni aralashtirmang — o‘qish juda qiyin.

## Mantiqiy

| Operator | Ma’nosi |
| --- | --- |
| `&&` (`and`) | VA |
| `\|\|` (`or`) | YOKI |
| `!` | EMAS |
| `xor` | Faqat bittasi rost |

### `and`/`or` tuzog‘i

So‘z shaklidagi `and`, `or` ustuvorligi `=` dan **past**:

```php
<?php
$r = false or true;
var_dump($r); // bool(false)! Aslida: ($r = false) or true
```

Doim `&&` va `||` ishlating.

## Satr operatorlari

`.` — ulash, `.=` — oxiriga qo‘shish.

## Null bilan ishlash

```php
<?php
$ism = null;
echo $ism ?? "Mehmon";   // Mehmon — null yoki mavjud emas bo‘lsa
echo $yoq ?? "yo‘q";     // yo‘q — ogohlantirishsiz!

$sozlama = null;
$sozlama ??= "standart"; // faqat null bo‘lsa beradi
echo $sozlama;           // standart
```

`??` formadan kelmagan maydonlarni o‘qishda juda qulay: `$_GET['sahifa'] ?? 1`.

## Ternar operator

```php
<?php
$yosh = 20;
echo $yosh >= 18 ? "katta" : "kichik"; // katta
```

### Qisqa ternar `?:`

Chap tomon truthy bo‘lsa — o‘zi, aks holda o‘ng tomon:

```php
<?php
echo 0 ?: "nol";       // nol
echo "Ali" ?: "Mehmon"; // Ali
```

`??` faqat `null` ni, `?:` esa barcha **falsy** qiymatlarni (`0`, `""`, `"0"`) almashtiradi.

## Kosmik kema `<=>`

Uch xil natija: chap kichik — `-1`, teng — `0`, katta — `1`:

```php
<?php
echo 7 <=> 3; // 1
echo 3 <=> 7; // -1
echo 5 <=> 5; // 0
```

Saralashda juda qulay (massivlar modulida).

## Ustuvorlik

`**` → `* / %` → `+ -` → `.`(PHP 8) → taqqoslash → `&&` → `||` → `??` → `? :` → `=` → `and`/`or`.

Shubha bo‘lsa — **qavs**.

## Mustaqil mashq

```php
<?php
$narx = 450000;
$promokod = "";
$chegirma = $promokod === "WEB10" ? 0.1 : 0;
$tolov = $narx * (1 - $chegirma);
$mijoz = $_GET['ism'] ?? "Mehmon";
echo "$mijoz: $tolov so‘m";
```

Brauzerda `?ism=Ali` bilan va usiz oching.

**Kutilgan natija:** `Mehmon: 450000 so‘m` (parametr bilan — `Ali: 450000 so‘m`).
