## Formani tekshirish (validatsiya)

Brauzerdagi `required` va JavaScript tekshiruvi — qulaylik. Uni chetlab o‘tish oson, shuning uchun **server har doim qayta tekshiradi**.

## Xatolar massivi

```php
<?php
$xatolar = [];
$ism = trim($_POST['ism'] ?? '');
$email = trim($_POST['email'] ?? '');
$yosh = trim($_POST['yosh'] ?? '');

if ($ism === '') {
    $xatolar['ism'] = 'Ismni kiriting';
} elseif (mb_strlen($ism) > 50) {
    $xatolar['ism'] = 'Ism 50 belgidan oshmasin';
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $xatolar['email'] = 'Email noto‘g‘ri';
}

$yoshSon = filter_var($yosh, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 7, 'max_range' => 100],
]);
if ($yoshSon === false) {
    $xatolar['yosh'] = 'Yosh 7 dan 100 gacha butun son bo‘lsin';
}

if ($xatolar === []) {
    // hammasi to‘g‘ri — saqlash
}
```

Har bir maydon xatosi alohida kalitda — formada xatoni aynan o‘sha maydon yonida ko‘rsatish mumkin:

```php
<input name="email" value="<?= htmlspecialchars($email) ?>">
<?php if (isset($xatolar['email'])): ?>
  <p class="xato"><?= $xatolar['email'] ?></p>
<?php endif; ?>
```

## `filter_var`

| Filtr | Muvaffaqiyatda | Xatoda |
| --- | --- | --- |
| `FILTER_VALIDATE_INT` | `int` | `false` |
| `FILTER_VALIDATE_FLOAT` | `float` | `false` |
| `FILTER_VALIDATE_EMAIL` | email satri | `false` |
| `FILTER_VALIDATE_URL` | URL satri | `false` |
| `FILTER_VALIDATE_BOOLEAN` | `true`/`false` | `false` (yoki `null` — `FILTER_NULL_ON_FAILURE` bilan) |

### `=== false` bilan tekshiring

```php
<?php
var_dump(filter_var("0", FILTER_VALIDATE_INT)); // int(0)
```

`0` — to‘g‘ri butun son, lekin falsy! `if (!filter_var(...))` uni xato deb o‘ylaydi. Doim `=== false`.

## Bo‘sh joylar va uzunlik

- Avval `trim`.
- Uzunlikni `mb_strlen` bilan (o‘zbekcha harflar!).
- Maksimal uzunlikni doim cheklang — 10 MB lik “ism” bazani to‘ldirib yuborishi mumkin.

## Ruxsat etilgan qiymatlar

```php
<?php
if (!in_array($daraja, ['boshlangich', 'orta', 'yuqori'], true)) {
    $xatolar['daraja'] = 'Darajani tanlang';
}
```

## Parol

```php
<?php
if (mb_strlen($parol) < 8) {
    $xatolar['parol'] = 'Parol kamida 8 belgi';
} elseif ($parol !== $parol2) {
    $xatolar['parol2'] = 'Parollar mos emas';
}
```

## Tekshirish funksiyasi

Tekshiruvni alohida funksiyaga ajratish — uni formadan mustaqil sinash mumkin:

```php
<?php
function tekshir(array $d): array
{
    $x = [];
    if (trim($d['ism'] ?? '') === '') {
        $x['ism'] = 'Ismni kiriting';
    }
    if (filter_var($d['email'] ?? '', FILTER_VALIDATE_EMAIL) === false) {
        $x['email'] = 'Email noto‘g‘ri';
    }
    return $x;
}

print_r(tekshir(['ism' => ' ', 'email' => 'ali@']));
// [ism => Ismni kiriting, email => Email noto‘g‘ri]
```

## Mustaqil mashq

`tekshir()` ni yosh bilan kengaytiring va sinang:

```php
<?php
function yoshTekshir(string $yosh): string
{
    $son = filter_var($yosh, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 7, 'max_range' => 100],
    ]);
    return $son === false ? 'xato' : "ok:$son";
}

foreach (['25', '0', '150', 'abc', '7'] as $y) {
    echo yoshTekshir($y), ' ';
}
```

**Kutilgan natija:** `ok:25 xato xato xato ok:7 `
