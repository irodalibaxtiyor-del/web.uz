## `while` va `do...while`

## `while`

Shart rost ekan, takrorlanadi:

```php
<?php
$i = 0;
while ($i < 3) {
    echo $i;
    $i++;
}
// 012
```

Necha marta aylanishi oldindan noma’lum bo‘lganda: “fayl tugaguncha o‘qi”, “maqsadga yetguncha”.

### Jamg‘arma

```php
<?php
$summa = 1_000_000;
$yillar = 0;
while ($summa < 2_000_000) {
    $summa *= 1.12;
    $yillar++;
}
echo $yillar; // 7
```

## Cheksiz sikl

Shart hech qachon `false` bo‘lmasa, skript to‘xtamaydi. PHP uni `max_execution_time` (standart 30 soniya) dan keyin to‘xtatadi: `Fatal error: Maximum execution time exceeded`. Har `while` uchun tekshiring: shartdagi qiymat har aylanishda maqsadga **yaqinlashyaptimi**?

## `do...while`

Tana **kamida bir marta** bajariladi, shart oxirida tekshiriladi:

```php
<?php
$j = 10;
do {
    echo $j;
} while ($j < 3);
// 10 — shart yolg‘on bo‘lsa ham bir marta bajarildi
```

## Raqamlarga ajratish

```php
<?php
$son = 2026;
$yigindi = 0;
while ($son > 0) {
    $yigindi += $son % 10;      // oxirgi raqam
    $son = intdiv($son, 10);    // oxirgi raqamni olib tashlash
}
echo $yigindi; // 10
```

## `break` va `continue`

```php
<?php
$i = 0;
while (true) {
    $i++;
    if ($i % 2 === 0) continue; // juftlarni o‘tkazib yuborish
    if ($i > 7) break;          // to‘xtatish
    echo $i;
}
// 1357
```

`while (true)` + `break` — chiqish sharti sikl o‘rtasida bo‘lganda qulay.

## Muqobil sintaksis

```php
<?php while ($qator = fgets($fayl)): ?>
  <p><?= htmlspecialchars($qator) ?></p>
<?php endwhile; ?>
```

## Mustaqil mashq

1 dan boshlab sonlar kvadratini, kvadrat 50 dan oshmaguncha chiqaring:

```php
<?php
$n = 1;
while ($n * $n <= 50) {
    echo $n * $n, " ";
    $n++;
}
```

**Kutilgan natija:** `1 4 9 16 25 36 49 `
