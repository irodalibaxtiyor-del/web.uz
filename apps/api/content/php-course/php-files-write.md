## Fayllarga yozish

## `file_put_contents`

```php
<?php
$fayl = __DIR__ . '/eslatma.txt';
file_put_contents($fayl, "Birinchi\n");              // yangidan yozadi (eski mazmun o‘chadi)
file_put_contents($fayl, "Ikkinchi\n", FILE_APPEND); // oxiriga qo‘shadi
echo file_get_contents($fayl);
// Birinchi
// Ikkinchi
```

Natija — yozilgan baytlar soni yoki `false`.

### Bir vaqtda yozish

Ikki so‘rov bir vaqtda yozsa, mazmun aralashib ketishi mumkin. Qulf:

```php
<?php
file_put_contents($fayl, $qator, FILE_APPEND | LOCK_EX);
```

## `fopen` rejimlari

| Rejim | Ma’nosi |
| --- | --- |
| `r` | Faqat o‘qish |
| `w` | Yozish — faylni **tozalaydi** (yo‘q bo‘lsa yaratadi) |
| `a` | Oxiriga qo‘shish |
| `x` | Yangi fayl yaratish — mavjud bo‘lsa xato |
| `r+` | O‘qish va yozish |

```php
<?php
$h = fopen(__DIR__ . '/log.txt', 'a');
fwrite($h, date('Y-m-d H:i:s') . " — kirish\n");
fclose($h);
```

`w` rejimi faylni **darhol bo‘shatadi** — tasodifan muhim faylni ochmang.

## CSV yozish

```php
<?php
$h = fopen(__DIR__ . '/natijalar.csv', 'w');
fputcsv($h, ['ism', 'ball']);
fputcsv($h, ['Ali, Vali', 85]); // vergulli qiymat avtomatik qo‘shtirnoqqa olinadi
fclose($h);
// ism,ball
// "Ali, Vali",85
```

## JSON saqlash

Oddiy ma’lumotlar bazasi o‘rnida (kichik loyihalar uchun):

```php
<?php
$fayl = __DIR__ . '/izohlar.json';
$izohlar = is_file($fayl) ? json_decode(file_get_contents($fayl), true) : [];
$izohlar[] = ['ism' => 'Ali', 'matn' => 'Ajoyib dars!', 'vaqt' => date('c')];
file_put_contents($fayl, json_encode($izohlar, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
```

`JSON_UNESCAPED_UNICODE` — o‘zbekcha harflar `‘` emas, o‘zicha saqlanadi.

> Ko‘p foydalanuvchili saytda fayl o‘rniga **ma’lumotlar bazasi** ishlating — fayllar bir vaqtdagi yozishlar va katta hajmda muammo beradi.

## O‘chirish, nusxa, ko‘chirish

```php
<?php
unlink($fayl);                    // o‘chirish
copy($asl, $nusxa);               // nusxa
rename($eski, $yangi);            // nomini o‘zgartirish / ko‘chirish
mkdir(__DIR__ . '/yuklar', 0755, true); // papka (ichma-ich bilan)
```

## Ruxsatlar

Veb-server (masalan, `www-data` foydalanuvchisi) papkaga yoza olishi kerak. Lekin:

- yoziladigan papka **veb orqali ochiladigan joyda bo‘lmasin** (yoki u yerda PHP bajarilmasin);
- `chmod 777` qilmang — bu hamma narsaga ruxsat.

## Mustaqil mashq

Mehmonlar kitobi uchun oddiy yozuv:

```php
<?php
$fayl = __DIR__ . '/mehmonlar.txt';
file_put_contents($fayl, '');
foreach (['Ali', 'Madina', 'Jasur'] as $ism) {
    file_put_contents($fayl, "$ism\n", FILE_APPEND | LOCK_EX);
}
$qatorlar = file($fayl, FILE_IGNORE_NEW_LINES);
echo count($qatorlar), ' mehmon: ', implode(', ', array_reverse($qatorlar));
```

**Kutilgan natija:** `3 mehmon: Jasur, Madina, Ali`
