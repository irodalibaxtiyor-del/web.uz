## Muntazam ifodalar (RegEx)

PHP’da muntazam ifodalar `preg_` funksiyalari bilan ishlaydi. Naqsh satr ichida, ajratgichlar (`/`) orasida yoziladi:

```php
<?php
$naqsh = '/^\+998 \d{2} \d{3} \d{2} \d{2}$/';
```

Naqshlarni **bittalik qo‘shtirnoqda** yozing — aks holda `\d`, `$` kabi belgilar PHP tomonidan boshqacha o‘qilishi mumkin.

## `preg_match` — mos keladimi?

```php
<?php
var_dump(preg_match('/^\+998 \d{2} \d{3} \d{2} \d{2}$/', '+998 90 123 45 67')); // int(1)
var_dump(preg_match('/\d+/', 'abc'));                                            // int(0)
```

`1` — topildi, `0` — topilmadi (`false` — naqshda xato). `if (preg_match(...))` bilan ishlatiladi.

### Guruhlarni olish

```php
<?php
preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', '2026-03-08', $m);
echo $m[0]; // 2026-03-08 — butun moslik
echo $m[1]; // 2026
echo $m[2]; // 03
```

Nomlangan guruhlar:

```php
<?php
preg_match('/(?<yil>\d{4})/', 'yil 2026', $m);
echo $m['yil']; // 2026
```

## `preg_match_all` — hammasi

```php
<?php
preg_match_all('/\d+/', 'Narx 12 500, chegirma 10%', $m);
echo implode(',', $m[0]); // 12,500,10
```

## `preg_replace` — almashtirish

```php
<?php
echo trim(preg_replace('/\s+/', ' ', "  Salom    dunyo ")); // Salom dunyo
echo preg_replace('/\D/', '', '+998 (90) 123-45-67');       // 998901234567
```

## `preg_split` — bo‘lish

```php
<?php
print_r(preg_split('/[,;]\s*/', 'a, b;c')); // [a, b, c]
```

## Asosiy belgilar (eslatma)

| Yozuv | Ma’nosi |
| --- | --- |
| `\d` / `\D` | Raqam / raqam emas |
| `\w` | Harf, raqam, `_` (lotin) |
| `\s` | Bo‘sh joy |
| `.` | Istalgan belgi |
| `[a-z]`, `[^0-9]` | To‘plam / inkor |
| `+ * ? {2,4}` | Miqdor |
| `^ $` | Boshi / oxiri |
| `( )` | Guruh |

## Bayroqlar

```php
<?php
var_dump(preg_match('/salom/i', 'SALOM dunyo')); // int(1) — i: registrsiz
var_dump(preg_match('/^o‘z/u', 'o‘zbek'));       // u: UTF-8 rejimi
```

O‘zbekcha va kirill matn bilan doim **`u`** bayrog‘ini qo‘ying — aks holda naqsh baytlar bilan ishlaydi.

## Foydalanuvchi matni naqsh ichida

```php
<?php
$soz = 'a.b*c';
$naqsh = '/' . preg_quote($soz, '/') . '/';
```

`preg_quote` maxsus belgilarni ekranlaydi. Usiz foydalanuvchi naqshni buzishi mumkin.

## Qachon RegEx kerak emas

Oddiy vazifalar uchun satr funksiyalari tezroq va tushunarliroq: `str_contains`, `str_starts_with`, `explode`. Email va URL uchun — `filter_var` (keyingi dars).

## Mustaqil mashq

```php
<?php
$telefonlar = ['+998 90 123 45 67', '+99890 1234567', '+998 33 555 00 11'];
foreach ($telefonlar as $t) {
    echo preg_match('/^\+998 \d{2} \d{3} \d{2} \d{2}$/', $t) ? 'OK' : 'XATO', ' ';
}
```

**Kutilgan natija:** `OK XATO OK `
