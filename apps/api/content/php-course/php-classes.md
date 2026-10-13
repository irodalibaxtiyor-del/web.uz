## Klasslar va obyektlar

```php
<?php
class Talaba
{
    public string $ism = '';
    public int $ball = 0;

    public function baho(): string
    {
        return $this->ball >= 60 ? 'o‘tdi' : 'o‘tmadi';
    }
}

$t = new Talaba();
$t->ism = 'Ali';
$t->ball = 85;
echo $t->ism, ' ', $t->baho(); // Ali o‘tdi
```

- Klass nomi **PascalCase**: `Talaba`, `BankHisobi`.
- `->` — obyekt xususiyati yoki metodiga murojaat.
- Metod ichida `$this->ball` — **shu** obyektning xususiyati (`$` faqat `$this` da, xususiyat nomida yo‘q).

## Tiplangan xususiyatlar

```php
<?php
class Talaba
{
    public string $ism;   // standart qiymatsiz
}

$t = new Talaba();
echo $t->ism;
// Error: Typed property Talaba::$ism must not be accessed before initialization
```

Tiplangan xususiyatga qiymat berilmasa, uni o‘qish — xato. Shuning uchun majburiy qiymatlar **konstruktorda** beriladi (keyingi dars).

## Har bir obyekt — alohida

```php
<?php
$a = new Talaba();
$b = new Talaba();
$a->ball = 90;
echo $b->ball; // 0
```

## Obyektlar “tutqich” orqali uzatiladi

Massivlardan farqli, obyekt tayinlanganda yoki funksiyaga berilganda **nusxalanmaydi**:

```php
<?php
function ozgartir(Talaba $t): void
{
    $t->ball = 100;
}
$t = new Talaba();
ozgartir($t);
echo $t->ball; // 100 — funksiya asl obyektni o‘zgartirdi

$t2 = $t;      // bitta obyektga ikki nom
$t2->ball = 50;
echo $t->ball; // 50
```

Mustaqil nusxa kerak bo‘lsa — `clone`:

```php
<?php
$t3 = clone $t;
$t3->ball = 10;
echo $t->ball; // 50 — o‘zgarmadi
```

## Obyekt haqida

```php
<?php
echo get_class($t);              // Talaba
var_dump($t instanceof Talaba);  // bool(true)
var_dump(method_exists($t, 'baho')); // bool(true)
print_r($t);                     // xususiyatlar ro‘yxati
```

## Metod ichidan boshqa metod

```php
<?php
class Talaba
{
    public function __construct(public string $ism, public int $ball) {}

    public function baho(): string
    {
        return $this->ball >= 60 ? 'o‘tdi' : 'o‘tmadi';
    }

    public function malumot(): string
    {
        return "$this->ism: $this->ball ball ({$this->baho()})";
    }
}
echo (new Talaba('Madina', 92))->malumot(); // Madina: 92 ball (o‘tdi)
```

## Mustaqil mashq

```php
<?php
class Savat
{
    public array $mahsulotlar = [];

    public function qosh(string $nom, int $narx): void
    {
        $this->mahsulotlar[$nom] = $narx;
    }

    public function jami(): int
    {
        return array_sum($this->mahsulotlar);
    }
}

$s = new Savat();
$s->qosh('Non', 4000);
$s->qosh('Sut', 12000);
$nusxa = clone $s;
$nusxa->qosh('Choy', 9000);
echo $s->jami(), ' / ', $nusxa->jami();
```

**Kutilgan natija:** `16000 / 25000`
