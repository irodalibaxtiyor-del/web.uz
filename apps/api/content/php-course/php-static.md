## Statik a’zolar va konstantalar

## `static` — klassning o‘ziga tegishli

Oddiy xususiyat har **obyekt**da alohida. `static` xususiyat esa **klassda bitta** — barcha obyektlar uchun umumiy:

```php
<?php
class Hisoblagich
{
    public static int $soni = 0;

    public function __construct()
    {
        self::$soni++;
    }
}

new Hisoblagich();
new Hisoblagich();
echo Hisoblagich::$soni; // 2
```

- Murojaat `::` orqali: `Klass::$xususiyat`, `Klass::metod()`.
- Klass ichida — `self::` (yoki `static::`).
- `$this` statik metodda **yo‘q** — obyekt yo‘q.

## Statik metodlar

Obyekt holatiga bog‘liq bo‘lmagan yordamchi funksiyalar:

```php
<?php
class Format
{
    public static function som(int $summa): string
    {
        return number_format($summa, 0, '.', ' ') . ' so‘m';
    }
}
echo Format::som(1500000); // 1 500 000 so‘m
```

### Fabrika metodlari

```php
<?php
class Pul
{
    private function __construct(public readonly int $tiyin) {}

    public static function somdan(float $som): self
    {
        return new self((int) round($som * 100));
    }
}
echo Pul::somdan(12.5)->tiyin; // 1250
```

Konstruktor `private` — obyekt faqat ma’noli nomli fabrika orqali yaratiladi.

## Klass konstantalari

```php
<?php
class Buyurtma
{
    public const MAKS_SONI = 10;
    public const HOLATLAR = ['yangi', 'tolangan', 'yetkazildi'];

    public function tekshir(int $soni): bool
    {
        return $soni <= self::MAKS_SONI;
    }
}
echo Buyurtma::MAKS_SONI; // 10
```

Konstantalar o‘zgarmaydi va ko‘pincha “sehrli son”lar o‘rnida ishlatiladi.

## `self` va `static` farqi

```php
<?php
class Ota
{
    public static function yarat(): static
    {
        return new static();   // chaqirilgan klass
    }

    public static function selfYarat(): self
    {
        return new self();     // doim Ota
    }
}

class Bola extends Ota {}

echo get_class(Bola::yarat());     // Bola
echo get_class(Bola::selfYarat()); // Ota
```

`static::` — “**kech bog‘lanish**”: qaysi klass orqali chaqirilgan bo‘lsa, o‘sha. Merosga mo‘ljallangan kodda `static` ishlating.

## Ehtiyot bo‘ling

Statik xususiyatlar — aslida **global o‘zgaruvchi**lar klass ichida. Ularni o‘zgartiradigan kodni sinash va tushunish qiyin. Statik — o‘zgarmas konstantalar, yordamchi funksiyalar va fabrikalar uchun; holat — obyektlarda.

## Mustaqil mashq

```php
<?php
class Id
{
    private static int $oxirgi = 0;
    public const PREFIKS = 'B-';

    public static function keyingi(): string
    {
        self::$oxirgi++;
        return self::PREFIKS . str_pad((string) self::$oxirgi, 4, '0', STR_PAD_LEFT);
    }
}

echo Id::keyingi(), ' ', Id::keyingi(), ' ', Id::keyingi();
```

**Kutilgan natija:** `B-0001 B-0002 B-0003`
