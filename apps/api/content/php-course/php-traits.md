## Trait’lar

PHP’da klass faqat **bitta** ota klassdan meros oladi. Bir-biriga qarindosh bo‘lmagan klasslarda bir xil kod kerak bo‘lsa (masalan, “yaratilgan vaqt”, “log yozish”) — **trait**.

```php
<?php
trait Vaqtli
{
    public ?string $yaratildi = null;

    public function belgila(): static
    {
        $this->yaratildi = date('Y-m-d');
        return $this;
    }
}

class Post
{
    use Vaqtli;
    public function __construct(public string $sarlavha) {}
}

class Izoh
{
    use Vaqtli;
}

$p = (new Post('Yangi kurs'))->belgila();
echo $p->yaratildi;
```

`use Vaqtli;` — trait kodi klassga **nusxalangandek** qo‘shiladi: xususiyatlar ham, metodlar ham.

## Bir nechta trait

```php
<?php
trait Salomlashuvchi
{
    public function salom(): string
    {
        return 'Salom, men ' . static::class;
    }
}

class Post
{
    use Vaqtli, Salomlashuvchi;
}
echo (new Post())->salom(); // Salom, men Post
```

## Nomlar to‘qnashuvi

Ikki traitda bir xil nomli metod bo‘lsa — qaysi birini tanlashni aniq aytasiz:

```php
<?php
trait A { public function x(): string { return 'A'; } }
trait B { public function x(): string { return 'B'; } }

class C
{
    use A, B {
        A::x insteadof B;  // x() — A dan
        B::x as bx;        // B nikini bx() nomi bilan
    }
}

$c = new C();
echo $c->x(), $c->bx(); // AB
```

## Abstrakt metod traitda

Trait klassdan biror narsa talab qilishi mumkin:

```php
<?php
trait JsonMumkin
{
    abstract public function maydonlar(): array;

    public function json(): string
    {
        return json_encode($this->maydonlar(), JSON_UNESCAPED_UNICODE);
    }
}
```

## Trait yoki boshqa yo‘l?

Trait — qulay, lekin ehtiyot bo‘ling:

- trait klassning yashirin bog‘liqligini oshiradi: kod qayerdan kelgani darhol ko‘rinmaydi;
- ko‘p hollarda **tarkib** (yordamchi obyektni xususiyat sifatida saqlash) aniqroq.

Laravel kabi freymvorklarda trait’lar keng ishlatiladi (`HasFactory`, `SoftDeletes`) — ularni o‘qiy olish uchun bilish shart.

## Mustaqil mashq

```php
<?php
trait Hisoblovchi
{
    private int $sanoq = 0;

    public function oshir(): static
    {
        $this->sanoq++;
        return $this;
    }

    public function sanoq(): int
    {
        return $this->sanoq;
    }
}

class Sahifa
{
    use Hisoblovchi;
}

class Tugma
{
    use Hisoblovchi;
}

$s = new Sahifa();
$t = new Tugma();
$s->oshir()->oshir()->oshir();
$t->oshir();
echo $s->sanoq(), ' ', $t->sanoq();
```

**Kutilgan natija:** `3 1` (har obyektning hisobi o‘ziniki).
