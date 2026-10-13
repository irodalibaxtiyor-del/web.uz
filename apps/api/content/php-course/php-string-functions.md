## Satr funksiyalari

PHP’da satrlar uchun yuzdan ortiq tayyor funksiya bor. Eng keraklilari:

## Katta-kichik harf

```php
<?php
echo strtoupper("JavaScript"); // JAVASCRIPT
echo strtolower("JavaScript"); // javascript
echo ucfirst("php");           // Php
echo ucwords("ali valiyev");   // Ali Valiyev
```

O‘zbekcha va kirill harflar uchun: `mb_strtoupper("o‘zbek")` → `O‘ZBEK`.

## Bo‘sh joylarni olib tashlash

```php
<?php
echo trim("  Ali  ");   // "Ali"
echo ltrim("  Ali");    // chapdan
echo rtrim("Ali  ");    // o‘ngdan
echo rtrim("1,2,3,", ","); // "1,2,3" — boshqa belgilarni ham
```

Formadan kelgan har qanday matnni `trim` qiling.

## Bo‘lak olish: `substr`

```php
<?php
echo substr("JavaScript", 0, 4);  // Java
echo substr("JavaScript", 4);     // Script
echo substr("JavaScript", -6);    // Script
echo substr("JavaScript", 4, 3);  // Scr
```

`substr(satr, boshlanish, uzunlik)` — **uzunlik**, oxirgi indeks emas (JS’dagi `slice` dan farqi!).

## Qidirish

```php
<?php
echo strpos("ali@webdizayn.uz", "@");          // 3
var_dump(strpos("abc", "z"));                   // bool(false)
var_dump(str_contains("webdizayn.uz", ".uz"));  // bool(true)
var_dump(str_starts_with("+998901", "+998"));   // bool(true)
var_dump(str_ends_with("rasm.png", ".png"));    // bool(true)
echo substr_count("olma olma non", "olma");     // 2
```

### `strpos` tuzog‘i

Topilgan joy `0` bo‘lsa, `0` — falsy:

```php
<?php
if (strpos("PHP kursi", "PHP")) {
    echo "topildi";      // CHIQMAYDI — strpos 0 qaytardi!
}
if (strpos("PHP kursi", "PHP") !== false) {
    echo "topildi";      // to‘g‘ri
}
```

Faqat “bormi?” kerak bo‘lsa — `str_contains` (PHP 8) ishlating.

## Almashtirish

```php
<?php
echo str_replace("dunyo", "O‘zbekiston", "Salom dunyo"); // Salom O‘zbekiston
echo str_replace([" ", "-"], "", "+998 90-123");           // +99890123
echo str_ireplace("PHP", "JS", "php va PHP");              // JS va JS
```

## Bo‘lish va birlashtirish

```php
<?php
$qismlar = explode(",", "olma,non,suv"); // ["olma", "non", "suv"]
echo implode(", ", $qismlar);           // olma, non, suv
```

`explode` — satrdan massiv, `implode` — massivdan satr. Massivlarni keyingi modullarda o‘rganamiz.

## Boshqalar

```php
<?php
echo strrev("PHP");              // PHP — teskari
echo str_repeat("ab", 3);        // ababab
echo str_pad("7", 3, "0", STR_PAD_LEFT); // 007
echo strstr("ali@web.uz", "@");  // @web.uz
echo wordwrap("Bu juda uzun matn", 8, "<br>", true);
```

## Zanjir emas — ichma-ich

PHP funksiyalari metod emas, shuning uchun ichma-ich yoziladi:

```php
<?php
$login = strtolower(trim("  Ali.VALIYEV  ")); // ali.valiyev
```

Ichkaridan tashqariga o‘qing: avval `trim`, keyin `strtolower`.

## Mustaqil mashq

Ism va familiyani chiroyli formatlang:

```php
<?php
$ism = "  aLI ";
$familiya = "vALIyev";
$toliq = ucfirst(strtolower(trim($ism))) . " " . ucfirst(strtolower(trim($familiya)));
$login = strtolower(trim($ism) . "." . trim($familiya));
echo $toliq, " | ", $login;
```

**Kutilgan natija:** `Ali Valiyev | ali.valiyev`
