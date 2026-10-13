## Izohlar

Izoh — PHP bajarmaydigan matn. U kodni tushuntirish yoki vaqtincha o‘chirib qo‘yish uchun.

## Bir qatorli izoh

```php
<?php
// Kurs narxini hisoblaymiz
$narx = 450000;
# Bu ham bir qatorli izoh (kamroq ishlatiladi)
$chegirma = 0.1; // 10 foiz
```

`//` yoki `#` dan qator oxirigacha — izoh.

## Ko‘p qatorli izoh

```php
<?php
/*
  Bu fayl buyurtmalarni qabul qiladi.
  Muallif: WEBDIZAYN.UZ jamoasi
*/
```

## Hujjatlash izohi (DocBlock)

Funksiya va klasslar ustida `/** ... */` — muharrirlar va hujjat generatorlari uni tushunadi:

```php
<?php
/**
 * Kurs narxini chegirma bilan hisoblaydi.
 *
 * @param int   $narx     Asosiy narx, so‘mda
 * @param float $chegirma 0 dan 1 gacha
 * @return int
 */
function yakuniyNarx(int $narx, float $chegirma): int
{
    return (int) round($narx * (1 - $chegirma));
}
```

Funksiyalarni keyingi modullarda o‘rganamiz — hozircha izoh shaklini eslab qoling.

## Kodni vaqtincha o‘chirish

```php
<?php
echo "A";
// echo "B";
echo "C";
```

Natija: `AC`.

Bir nechta qatorni o‘chirish uchun `/* ... */`:

```php
<?php
echo "1";
/*
echo "2";
echo "3";
*/
echo "4";
```

Natija: `14`.

## Izoh ichida `?>` — ehtiyot bo‘ling

Bir qatorli izoh `?>` gacha davom etadi — `?>` PHP blokini **yopadi**, hatto izoh ichida bo‘lsa ham:

```php
<?php echo "A"; // izoh ?> B
```

Natija: `A B` — `B` endi PHP emas, oddiy matn sifatida chiqdi. Ko‘p qatorli izohda bu muammo yo‘q.

## Yaxshi izoh

Izoh kod **nima** qilayotganini emas, **nega** shunday qilinganini tushuntirsin:

```php
<?php
// Yomon: $i ni bittaga oshiramiz
$i++;

// Yaxshi: sahifalash 1 dan boshlanadi, massiv indeksi esa 0 dan
$sahifa = $indeks + 1;
```

## Mustaqil mashq

Quyidagi koddagi ikkinchi va uchinchi `echo` ni **o‘chirmasdan** izohga aylantiring, birinchi qatorga esa fayl haqida izoh qo‘shing:

```php
<?php
echo "Bir ";
echo "Ikki ";
echo "Uch ";
echo "To‘rt";
```

**Kutilgan natija:** `Bir To‘rt`
