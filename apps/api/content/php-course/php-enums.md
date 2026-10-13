## Enum’lar (PHP 8.1)

Ko‘p qiymatlar faqat **cheklangan ro‘yxat**dan bo‘ladi: buyurtma holati, foydalanuvchi roli, to‘lov usuli. Ularni satr sifatida saqlash xatoga olib keladi:

```php
<?php
$holat = 'tolangan';
if ($holat === 'to‘langan') { /* hech qachon bajarilmaydi — imlo xatosi */ }
```

**Enum** — mumkin bo‘lgan qiymatlar ro‘yxatining o‘zi:

```php
<?php
enum Rang
{
    case Qizil;
    case Yashil;
}

$r = Rang::Qizil;
echo $r->name;                  // Qizil
var_dump($r instanceof Rang);   // bool(true)
var_dump($r === Rang::Qizil);   // bool(true)
```

`Rang` turidagi parametrga boshqa narsa berib bo‘lmaydi — xato kompilyatsiya/bajarilish paytida darhol ko‘rinadi.

## Qiymatli enum (backed enum)

Bazada yoki JSON’da saqlash uchun har bir holatga satr yoki son biriktiriladi:

```php
<?php
enum Holat: string
{
    case Faol = 'faol';
    case Bloklangan = 'bloklangan';
}

echo Holat::Faol->value;                // faol
$h = Holat::from('bloklangan');         // Holat::Bloklangan
var_dump(Holat::tryFrom('yoq'));        // NULL — noma’lum qiymat
Holat::from('yoq');                     // ValueError: "yoq" is not a valid backing value for enum Holat
echo count(Holat::cases());             // 2
```

- `from()` — noma’lum qiymatda **xato**;
- `tryFrom()` — `null` (foydalanuvchi kiritmasi uchun qulay).

## Metodlar

Enum ichida metod yozish mumkin — `match($this)` bilan:

```php
<?php
enum Holat: string
{
    case Faol = 'faol';
    case Bloklangan = 'bloklangan';

    public function nom(): string
    {
        return match ($this) {
            self::Faol => 'Faol',
            self::Bloklangan => 'Bloklangan',
        };
    }
}

echo Holat::from('bloklangan')->nom(); // Bloklangan
```

`match` barcha holatlarni sanab o‘tmasa va `default` bo‘lmasa — yangi holat qo‘shilganda xato darhol chiqadi. Bu yaxshi.

## Amalda

```php
<?php
enum Rol: string
{
    case Talaba = 'talaba';
    case Oqituvchi = 'oqituvchi';
    case Admin = 'admin';
}

function boshqaraOladimi(Rol $rol): bool
{
    return $rol === Rol::Oqituvchi || $rol === Rol::Admin;
}

$rol = Rol::tryFrom($_POST['rol'] ?? '') ?? Rol::Talaba;
```

Formadan kelgan noma’lum qiymat xavfsiz standartga tushadi.

## Mustaqil mashq

```php
<?php
enum BuyurtmaHolati: string
{
    case Yangi = 'yangi';
    case Tolangan = 'tolangan';
    case Yetkazildi = 'yetkazildi';

    public function keyingi(): ?self
    {
        return match ($this) {
            self::Yangi => self::Tolangan,
            self::Tolangan => self::Yetkazildi,
            self::Yetkazildi => null,
        };
    }
}

$h = BuyurtmaHolati::Yangi;
while ($h !== null) {
    echo $h->value, ' ';
    $h = $h->keyingi();
}
```

**Kutilgan natija:** `yangi tolangan yetkazildi `
