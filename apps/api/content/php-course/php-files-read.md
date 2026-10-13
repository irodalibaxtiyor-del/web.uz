## Fayllarni o‘qish

## Butun faylni birdan

```php
<?php
$matn = file_get_contents(__DIR__ . '/eslatma.txt');
echo $matn;
```

Fayl yo‘q bo‘lsa — `Warning` va `false`. Avval tekshiring:

```php
<?php
$fayl = __DIR__ . '/eslatma.txt';
if (!is_file($fayl)) {
    exit('Fayl topilmadi');
}
$matn = file_get_contents($fayl);
```

## Qatorlar massivi: `file()`

```php
<?php
$qatorlar = file(__DIR__ . '/royxat.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($qatorlar as $i => $q) {
    echo ($i + 1) . ". $q\n";
}
```

`FILE_IGNORE_NEW_LINES` — har qator oxiridagi `\n` ni olib tashlaydi, `FILE_SKIP_EMPTY_LINES` — bo‘sh qatorlarni.

## Qatorma-qator: `fopen` / `fgets`

Katta fayllarni (loglar, eksportlar) butunligicha xotiraga o‘qimaslik uchun:

```php
<?php
$h = fopen(__DIR__ . '/katta.log', 'r');
if ($h === false) {
    exit('Ochib bo‘lmadi');
}
while (($qator = fgets($h)) !== false) {
    if (str_contains($qator, 'ERROR')) {
        echo $qator;
    }
}
fclose($h);
```

`fgets` fayl oxirida `false` qaytaradi. `!== false` bilan tekshiring — `"0"` qatori falsy!

## Fayl haqida ma’lumot

```php
<?php
var_dump(file_exists($f)); // fayl yoki papka bormi
var_dump(is_file($f));     // aynan fayl
var_dump(is_dir($papka));
echo filesize($f);         // baytlarda
echo date('d.m.Y', filemtime($f)); // oxirgi o‘zgartirilgan sana
```

## Yo‘llar bilan ishlash

```php
<?php
print_r(pathinfo('/uploads/rasm.Final.PNG'));
// [dirname => /uploads, basename => rasm.Final.PNG, extension => PNG, filename => rasm.Final]
echo basename('/a/b/c.txt');  // c.txt
echo dirname('/a/b/c.txt');   // /a/b
```

## CSV fayllar

Excel’dan saqlangan jadvallar uchun — `fgetcsv` (vergul ichidagi qo‘shtirnoqli qiymatlarni to‘g‘ri o‘qiydi):

```php
<?php
$h = fopen(__DIR__ . '/talabalar.csv', 'r');
fgetcsv($h); // sarlavha qatorini o‘tkazib yuborish
while (($r = fgetcsv($h)) !== false) {
    [$ism, $ball] = $r;
    echo "$ism: $ball\n";
}
fclose($h);
```

## JSON fayl

```php
<?php
$sozlamalar = json_decode(file_get_contents(__DIR__ . '/sozlamalar.json'), true);
echo $sozlamalar['sayt'];
```

`true` — natija assotsiativ massiv bo‘ladi (obyekt emas).

## Xavfsizlik

Foydalanuvchi bergan nomdagi faylni **hech qachon** to‘g‘ridan-to‘g‘ri ochmang:

```php
<?php
echo file_get_contents('fayllar/' . $_GET['nom']); // ?nom=../../config.php — XAVFLI
```

Faqat `basename()` va ruxsat etilgan ro‘yxat yoki bazadagi ID orqali.

## Mustaqil mashq

`royxat.txt` faylini yarating (har qatorda bitta kurs, bitta bo‘sh qator ham qo‘shing):

```text
HTML

CSS
PHP
```

Keyin:

```php
<?php
$q = file(__DIR__ . '/royxat.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
echo count($q), ': ', implode(', ', $q);
```

**Kutilgan natija:** `3: HTML, CSS, PHP`
