## Abstrakt klasslar va interfeyslar

## Abstrakt klass

**Abstrakt klass** — to‘liq bo‘lmagan qolip. Undan obyekt yaratib bo‘lmaydi, faqat meros olinadi. Ichida **abstrakt metodlar** bo‘ladi — ularni bola klass albatta yozishi shart:

```php
<?php
abstract class Shakl
{
    abstract public function maydon(): float;

    public function malumot(): string
    {
        return static::class . ': ' . round($this->maydon(), 1);
    }
}

class Doira extends Shakl
{
    public function __construct(private float $r) {}

    public function maydon(): float
    {
        return M_PI * $this->r ** 2;
    }
}

echo (new Doira(2))->malumot(); // Doira: 12.6
new Shakl();                    // Error: Cannot instantiate abstract class Shakl
```

Abstrakt klass **umumiy kodni** (`malumot()`) beradi va **farqli qismni** (`maydon()`) bolalarga qoldiradi. `static::class` — joriy obyektning haqiqiy klassi.

## Interfeys

**Interfeys** — faqat “nima qila olishi kerak” degan **shartnoma**: metodlar ro‘yxati, kodsiz.

```php
<?php
interface Tolov
{
    public function tola(int $summa): string;
}

class Karta implements Tolov
{
    public function tola(int $summa): string
    {
        return "Karta: $summa";
    }
}

class Naqd implements Tolov
{
    public function tola(int $summa): string
    {
        return "Naqd: $summa";
    }
}
```

Interfeysni **tur** sifatida ishlatsangiz, kod qaysi klass kelishiga bog‘liq bo‘lmay qoladi:

```php
<?php
function buyurtma(Tolov $usul, int $summa): void
{
    echo $usul->tola($summa), PHP_EOL;
}

buyurtma(new Karta(), 450000);
buyurtma(new Naqd(), 12000);
```

Ertaga yangi to‘lov tizimi qo‘shilsa, `buyurtma()` o‘zgarmaydi — yangi klassga faqat `implements Tolov` yoziladi.

## Bir nechta interfeys

Klass faqat **bitta** klassdan meros oladi, lekin **istalgancha** interfeysni amalga oshira oladi:

```php
<?php
interface Qaytarish
{
    public function qaytar(int $summa): string;
}

class Karta implements Tolov, Qaytarish
{
    public function tola(int $summa): string { return "Karta: $summa"; }
    public function qaytar(int $summa): string { return "Qaytdi: $summa"; }
}

var_dump(new Karta() instanceof Qaytarish); // bool(true)
```

## Qaysi biri?

| | Abstrakt klass | Interfeys |
| --- | --- | --- |
| Kod bormi | Ha (umumiy metodlar, xususiyatlar) | Yo‘q (faqat imzolar va konstantalar) |
| Nechtadan | Bitta (`extends`) | Ko‘p (`implements`) |
| Qachon | Yaqin qarindosh klasslar, umumiy kod | Turli klasslar uchun umumiy “qobiliyat” |

Amaliy qoida: **avval interfeys** o‘ylang (`Tolov`, `Saqlovchi`, `Xabarchi`). Umumiy kod takrorlansa — abstrakt klass yoki trait (keyingi dars).

## Mustaqil mashq

```php
<?php
interface Xabarchi
{
    public function yubor(string $kimga, string $matn): string;
}

class SmsXabarchi implements Xabarchi
{
    public function yubor(string $kimga, string $matn): string
    {
        return "SMS $kimga: $matn";
    }
}

class EmailXabarchi implements Xabarchi
{
    public function yubor(string $kimga, string $matn): string
    {
        return "Email $kimga: $matn";
    }
}

function eslat(Xabarchi $x): string
{
    return $x->yubor('Ali', 'Dars soat 18:00 da');
}

echo eslat(new SmsXabarchi()), ' | ', eslat(new EmailXabarchi());
```

**Kutilgan natija:** `SMS Ali: Dars soat 18:00 da | Email Ali: Dars soat 18:00 da`
