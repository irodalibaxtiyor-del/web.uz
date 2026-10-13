## Konstruktor va destruktor

## `__construct`

`new` paytida avtomatik chaqiriladi — obyektni **to‘g‘ri holatda** boshlash uchun:

```php
<?php
class Kurs
{
    public string $nom;
    public int $narx;

    public function __construct(string $nom, int $narx)
    {
        if ($narx < 0) {
            throw new InvalidArgumentException('Narx manfiy bo‘lmaydi');
        }
        $this->nom = $nom;
        $this->narx = $narx;
    }
}

$k = new Kurs('PHP', 450000);
```

Noto‘g‘ri obyekt umuman yaratilmaydi — keyin har joyda tekshirish shart emas.

## Konstruktor xususiyatlari (PHP 8)

Parametr oldiga kirish modifikatori yozilsa, xususiyat **avtomatik** e’lon qilinadi va qiymat beriladi:

```php
<?php
class Kurs
{
    public function __construct(
        public string $nom,
        private int $narx = 0,
    ) {}

    public function narx(): int
    {
        return $this->narx;
    }
}

$k = new Kurs('PHP', 450000);
echo $k->nom, ' ', $k->narx(); // PHP 450000
```

Yuqoridagi uzun variant bilan bir xil, lekin uch marta qisqa. Zamonaviy kodda deyarli doim shunday yoziladi.

## `readonly` xususiyatlar (PHP 8.1)

Faqat bir marta — konstruktorda — beriladi:

```php
<?php
class Pul
{
    public function __construct(public readonly int $summa) {}
}

$p = new Pul(5000);
echo $p->summa;  // 5000
$p->summa = 6000; // Error: Cannot modify readonly property Pul::$summa
```

O‘qish ochiq, o‘zgartirish — yo‘q. Qiymat obyektlari (pul, sana oralig‘i, koordinata) uchun ideal: yangi qiymat kerak bo‘lsa, yangi obyekt yaratiladi.

## `__destruct`

Obyekt yo‘qolayotganda (oxirgi havola o‘chganda yoki skript tugaganda) chaqiriladi:

```php
<?php
class Log
{
    public function __construct(public string $nom)
    {
        echo "ochildi $nom | ";
    }

    public function __destruct()
    {
        echo "yopildi $this->nom | ";
    }
}

function ish(): void
{
    $l = new Log('A');
    echo 'ish | ';
}
ish();
// ochildi A | ish | yopildi A |
```

Funksiya tugaganda mahalliy `$l` yo‘qoladi — destruktor ishlaydi. Amalda kam kerak (PHP resurslarni o‘zi yopadi).

## `__toString`

Obyekt satr sifatida ishlatilganda:

```php
<?php
class Kurs
{
    public function __construct(public string $nom, public int $narx) {}

    public function __toString(): string
    {
        return "$this->nom ($this->narx so‘m)";
    }
}
echo new Kurs('PHP', 450000); // PHP (450000 so‘m)
```

## Statik “fabrika” — yaratishning muqobil yo‘li

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

`static` metodlar — keyingi modulda.

## Mustaqil mashq

```php
<?php
class Oraliq
{
    public function __construct(
        public readonly int $boshi,
        public readonly int $oxiri,
    ) {
        if ($oxiri < $boshi) {
            throw new InvalidArgumentException('Oxiri boshidan kichik');
        }
    }

    public function uzunlik(): int
    {
        return $this->oxiri - $this->boshi;
    }
}

echo (new Oraliq(3, 10))->uzunlik(), ' | ';
try {
    new Oraliq(10, 3);
} catch (InvalidArgumentException $e) {
    echo $e->getMessage();
}
```

**Kutilgan natija:** `7 | Oxiri boshidan kichik`
