## `if`, `elseif`, `else`

```php
<?php
$ball = 75;

if ($ball >= 86) {
    echo "5 (a’lo)";
} elseif ($ball >= 71) {
    echo "4 (yaxshi)";
} elseif ($ball >= 56) {
    echo "3 (qoniqarli)";
} else {
    echo "2 (qoniqarsiz)";
}
// 4 (yaxshi)
```

Shartlar yuqoridan pastga tekshiriladi, **birinchi** to‘g‘risi bajariladi.

PHP’da `elseif` (bitta so‘z) va `else if` (ikki so‘z) — ikkalasi ham ishlaydi. Bu kursda `elseif`.

## Truthy va falsy

Shart ichida qiymat `bool` ga aylanadi. **Falsy**: `false`, `0`, `0.0`, `""`, `"0"`, `[]`, `null`. Qolganlari — truthy.

```php
<?php
if ("0") { echo "T"; } else { echo "F"; }    // F — "0" falsy!
if ("0.0") { echo "T"; } else { echo "F"; }  // T
if ([]) { echo "T"; } else { echo "F"; }     // F — bo‘sh massiv
```

`"0"` ning falsy ekanligi PHP’ning o‘ziga xosligi: formada `0` kiritilsa, `if ($_POST['soni'])` uni “bo‘sh” deb o‘ylaydi. Bunday holatda aniq tekshiring: `if ($soni !== '')` yoki `isset`.

## Avval xatolarni chiqarib tashlash

```php
<?php
function baho(int $ball): string
{
    if ($ball < 0 || $ball > 100) {
        return "Noto‘g‘ri ball";
    }
    if ($ball >= 86) return "5";
    if ($ball >= 71) return "4";
    if ($ball >= 56) return "3";
    return "2";
}
```

**Erta qaytish** ichma-ich `if` lardan toza.

## Ternar va `??`

Oddiy tanlov uchun:

```php
<?php
$holat = $ball >= 60 ? "o‘tdi" : "o‘tmadi";
$sahifa = $_GET['sahifa'] ?? 1;
```

## Muqobil sintaksis (shablonlar uchun)

HTML ichida jingalak qavslar o‘rniga `:` va `endif;`:

```php
<?php if ($kirgan): ?>
  <a href="/kabinet">Kabinet</a>
<?php else: ?>
  <a href="/kirish">Kirish</a>
<?php endif; ?>
```

Shablonlarni o‘qish ancha oson. Shunday sintaksis `foreach`/`endforeach`, `while`/`endwhile` uchun ham bor.

## Shartlarni birlashtirish

```php
<?php
$yosh = 20;
$talaba = true;
if ($yosh >= 18 && $talaba) {
    echo "Talaba chegirmasi";
}
if (!$talaba || $yosh < 7) {
    echo "Oddiy narx";
}
```

## Mustaqil mashq

`baho()` funksiyasini yozing va turli ballar bilan chaqiring:

```php
<?php
foreach ([92, 71, 55, 120] as $b) {
    echo baho($b), " ";
}
```

**Kutilgan natija:** `5 4 2 Noto‘g‘ri ball `
