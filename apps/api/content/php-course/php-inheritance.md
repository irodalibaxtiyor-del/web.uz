## Meros (inheritance)

`extends` bilan klass boshqa klassning xususiyat va metodlarini meros oladi:

```php
<?php
class Hisob
{
    protected int $balans = 0;

    public function __construct(public string $egasi) {}

    public function kirim(int $summa): static
    {
        $this->balans += $summa;
        return $this;
    }

    public function malumot(): string
    {
        return "$this->egasi: $this->balans";
    }
}

class JamgarmaHisob extends Hisob
{
    public function __construct(string $egasi, private float $foiz)
    {
        parent::__construct($egasi);
    }

    public function foizQosh(): static
    {
        $this->balans += (int) round($this->balans * $this->foiz / 100);
        return $this;
    }

    public function malumot(): string
    {
        return parent::malumot() . " ($this->foiz%)";
    }
}

$j = new JamgarmaHisob('Dilnoza', 10);
echo $j->kirim(100000)->foizQosh()->malumot(); // Dilnoza: 110000 (10%)
```

## `parent::`

- `parent::__construct(...)` — ota klass konstruktorini chaqirish. Bola klassda konstruktor yozilsa, ota konstruktor **avtomatik chaqirilmaydi** — o‘zingiz chaqirasiz.
- `parent::malumot()` — ota klass versiyasidan foydalanib, metodni kengaytirish.

## `protected`

`$balans` `protected` — shuning uchun `JamgarmaHisob` uni o‘zgartira oladi, tashqi kod esa yo‘q. `private` bo‘lganda bola klass ham ko‘rmasdi.

## Metodni qayta yozish (override)

Bola klassda bir xil nomli metod ota versiyasini almashtiradi. Imzosi mos bo‘lishi kerak (parametrlar va qaytish turi).

## `return $this` — zanjir

`kirim()` va `foizQosh()` obyektning o‘zini qaytaradi, shuning uchun ketma-ket chaqirish mumkin: `$j->kirim(...)->foizQosh()->malumot()`. Qaytish turi `static` — “shu klass yoki bola klass”.

## `instanceof` va polimorfizm

```php
<?php
var_dump($j instanceof JamgarmaHisob); // bool(true)
var_dump($j instanceof Hisob);         // bool(true)

function chiqar(Hisob $h): void
{
    echo $h->malumot(), PHP_EOL; // har klass o‘z malumot() ini ishlatadi
}
chiqar(new Hisob('Ali'));
chiqar(new JamgarmaHisob('Vali', 5));
```

`Hisob` kutilgan joyga uning **bolasi** ham berilishi mumkin — bu polimorfizm.

## `final`

```php
<?php
final class Pul {}              // undan meros olib bo‘lmaydi
class A
{
    final public function id() {} // bu metodni qayta yozib bo‘lmaydi
}
```

## Meros yoki tarkib?

“Jamg‘arma hisobi — bu **hisobning bir turi**” — meros mos. “Buyurtma **ichida** mahsulotlar bor” — meros emas, xususiyat: `private array $mahsulotlar`. Uzun meros zanjirlaridan qoching; ko‘pincha **interfeys + tarkib** moslashuvchanroq (keyingi modul).

## Mustaqil mashq

```php
<?php
class Shakl
{
    public function nom(): string { return 'shakl'; }
    public function maydon(): float { return 0; }
    public function malumot(): string
    {
        return $this->nom() . ': ' . round($this->maydon(), 2);
    }
}

class Doira extends Shakl
{
    public function __construct(private float $r) {}
    public function nom(): string { return 'doira'; }
    public function maydon(): float { return M_PI * $this->r ** 2; }
}

class Kvadrat extends Shakl
{
    public function __construct(private float $a) {}
    public function nom(): string { return 'kvadrat'; }
    public function maydon(): float { return $this->a ** 2; }
}

foreach ([new Doira(1), new Kvadrat(3)] as $s) {
    echo $s->malumot(), '; ';
}
```

**Kutilgan natija:** `doira: 3.14; kvadrat: 9; `
