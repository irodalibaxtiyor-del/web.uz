## Sana va vaqt

## Vaqt zonasi — birinchi qadam

Server boshqa mamlakatda bo‘lishi mumkin. Vaqt zonasini aniq belgilang (yoki `php.ini` da `date.timezone`):

```php
<?php
date_default_timezone_set('Asia/Tashkent');
```

## `date()` — formatlash

```php
<?php
echo date('d.m.Y');        // 13.10.2026 — bugun
echo date('d.m.Y H:i');    // 13.10.2026 14:05
echo date('Y-m-d');        // 2026-10-13 — bazalar uchun standart
```

| Belgi | Ma’nosi | Misol |
| --- | --- | --- |
| `d` / `j` | Kun (nol bilan / nolsiz) | `08` / `8` |
| `m` / `n` | Oy (raqam) | `03` / `3` |
| `Y` | Yil | `2026` |
| `H:i:s` | Soat:daqiqa:soniya (24 soat) | `14:05:00` |
| `D` / `l` | Hafta kuni (ingliz) | `Sun` / `Sunday` |
| `N` | Hafta kuni raqami (1 — dushanba, 7 — yakshanba) | `7` |
| `t` | Oydagi kunlar soni | `31` |
| `L` | Kabisa yilimi (1/0) | `0` |

## Timestamp

Ichkarida vaqt — 1970-yil 1-yanvardan beri o‘tgan **soniyalar**:

```php
<?php
echo time();                               // hozirgi timestamp
$t = mktime(14, 5, 0, 3, 8, 2026);         // soat, daqiqa, soniya, oy, kun, yil
echo date('d.m.Y H:i', $t);                // 08.03.2026 14:05
echo date('d.m.Y', strtotime('2026-03-08 +30 days')); // 07.04.2026
```

## `DateTime` va `DateTimeImmutable`

Zamonaviy, obyektga asoslangan usul:

```php
<?php
$d = new DateTimeImmutable('2026-09-01');
$keyin = $d->add(new DateInterval('P1M')); // +1 oy
echo $d->format('d.m.Y'), ' → ', $keyin->format('d.m.Y'); // 01.09.2026 → 01.10.2026
```

`DateTimeImmutable` asl sanani o‘zgartirmaydi (yangi obyekt qaytaradi) — xatolardan himoya qiladi. `DateTime` esa `modify()` bilan o‘zini o‘zgartiradi.

`P1M` — **interval**: `P` (period), `1M` (1 oy). `P10D` — 10 kun, `PT2H` — 2 soat.

## Farq

```php
<?php
$farq = (new DateTime('2026-09-01'))->diff(new DateTime('2026-12-31'));
echo $farq->days;  // 121 — jami kunlar
echo $farq->m;     // 3 — to‘liq oylar

$yosh = (new DateTime('2006-05-20'))->diff(new DateTime('2026-10-13'))->y; // 20
```

`diff()->y` — to‘liq yillar, tug‘ilgan kunni to‘g‘ri hisobga oladi.

## Oy oxiri tuzoqlari

```php
<?php
echo date('d.m.Y', strtotime('2026-01-31 +1 month')); // 03.03.2026 — fevralda 31 kun yo‘q!
echo date('Y-m-d', strtotime('last day of february 2026')); // 2026-02-28
```

## Kiritilgan sanani tekshirish

```php
<?php
var_dump(checkdate(2, 29, 2026)); // bool(false) — 2026 kabisa emas
$d = DateTime::createFromFormat('d.m.Y', '31.02.2026');
echo $d->format('Y-m-d'); // 2026-03-03 — jimgina keyingi oyga o‘tdi!
```

`createFromFormat` mavjud bo‘lmagan sanani ham “to‘g‘irlab” yuboradi. Foydalanuvchi sanasini avval `checkdate` bilan tekshiring.

## Mustaqil mashq

```php
<?php
date_default_timezone_set('Asia/Tashkent');
$berilgan = new DateTimeImmutable('2026-10-01');
$muddat = $berilgan->modify('+14 days');
$bugun = new DateTimeImmutable('2026-10-13');
echo 'Muddat: ', $muddat->format('d.m.Y'), ', qoldi: ', $bugun->diff($muddat)->days, ' kun';
```

**Kutilgan natija:** `Muddat: 15.10.2026, qoldi: 2 kun`
