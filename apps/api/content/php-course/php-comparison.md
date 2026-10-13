## Taqqoslash

| Operator | Ma’nosi |
| --- | --- |
| `==` | Qiymati teng (tur aylantiriladi) |
| `===` | Qiymati **va** turi teng |
| `!=` yoki `<>` | Teng emas |
| `!==` | Qiymati yoki turi teng emas |
| `<` `>` `<=` `>=` | Kichik, katta... |
| `<=>` | -1, 0 yoki 1 |

## `==` va `===`

```php
<?php
var_dump(5 == "5");    // bool(true)
var_dump(5 === "5");   // bool(false) — int va string
var_dump(null == false); // bool(true)
var_dump(null === false); // bool(false)
```

### PHP 8 dagi muhim o‘zgarish

PHP 7 da `0 == "abc"` **true** edi (satr `0` ga aylanardi) — bu ko‘p xavfsizlik xatolariga sabab bo‘lgan. PHP 8 da son va son bo‘lmagan satr **satr sifatida** solishtiriladi:

```php
<?php
var_dump(0 == "abc"); // bool(false)
var_dump(0 == "");    // bool(false)
var_dump("1" == "01");  // bool(true) — ikkalasi son ko‘rinishida
var_dump("10" == "1e1"); // bool(true)
var_dump(100 == "1e2");  // bool(true)
```

Oxirgi uchtasi hamon kutilmagan natija beradi. Shuning uchun:

> **Doim `===` ishlating.** `==` faqat turini aniq bilganingizda va ataylab aylantirish kerak bo‘lganda.

## Parol va tokenlar

Maxfiy satrlarni `===` bilan ham emas, **`hash_equals`** bilan solishtiring — u vaqt orqali ma’lumot sizdirmaydi:

```php
<?php
var_dump(hash_equals("a1b2c3", "a1b2c3")); // bool(true)
```

Parollar esa umuman solishtirilmaydi — `password_verify` (loyihalar modulida).

## Satrlarni solishtirish

```php
<?php
var_dump("a" < "b");   // bool(true) — alifbo bo‘yicha
var_dump("Z" < "a");   // bool(true) — katta harflar oldin
var_dump("10" < "9");  // bool(false) — ikkalasi son ko‘rinishida, son sifatida!
```

PHP son ko‘rinishidagi satrlarni **son** sifatida solishtiradi. Ism yoki kod kabi matnlarni alifbo bo‘yicha solishtirish uchun `strcmp`:

```php
<?php
echo strcmp("10", "9"); // -1 — matn sifatida "1" < "9"
```

## Massivlarni solishtirish

```php
<?php
var_dump([1, 2] == [1, 2]);   // bool(true) — bir xil juftliklar
var_dump([1, 2] === [2 => 1]); // bool(false)
var_dump(["a" => 1, "b" => 2] == ["b" => 2, "a" => 1]);  // bool(true)
var_dump(["a" => 1, "b" => 2] === ["b" => 2, "a" => 1]); // bool(false) — tartib ham muhim
```

## Mustaqil mashq

Har bir taqqoslash natijasini oldin **qog‘ozda** yozing, keyin tekshiring:

```php
<?php
$natijalar = [5 == "5", 5 === "5", 0 == "abc", "1" == "01", null == false, "10" < "9"];
foreach ($natijalar as $n) {
    echo $n ? "T" : "F";
}
```

**Kutilgan natija:** `TFFTTF`
