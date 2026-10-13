## Kirish modifikatorlari

| Modifikator | Qayerdan murojaat qilish mumkin |
| --- | --- |
| `public` | Hamma joydan |
| `protected` | Klassning o‘zi va undan meros olganlar |
| `private` | Faqat klassning o‘zi |

```php
<?php
class Hisob
{
    public string $egasi;
    protected int $balans = 0;
    private string $pinKod;

    public function __construct(string $egasi, string $pinKod)
    {
        $this->egasi = $egasi;
        $this->pinKod = $pinKod;
    }
}

$h = new Hisob('Dilnoza', '1234');
echo $h->egasi;   // Dilnoza
echo $h->balans;  // Error: Cannot access protected property Hisob::$balans
echo $h->pinKod;  // Error: Cannot access private property Hisob::$pinKod
```

## Inkapsulyatsiya

Qoida: xususiyatlar — iloji boricha **`private`**, o‘zgartirish — faqat **qoidani tekshiradigan metodlar** orqali:

```php
<?php
class Hisob
{
    private int $balans = 0;

    public function kirim(int $summa): void
    {
        if ($summa <= 0) {
            throw new InvalidArgumentException('Summa musbat bo‘lsin');
        }
        $this->balans += $summa;
    }

    public function chiqim(int $summa): void
    {
        if ($summa > $this->balans) {
            throw new RuntimeException('Mablag‘ yetarli emas');
        }
        $this->balans -= $summa;
    }

    public function balans(): int
    {
        return $this->balans;
    }
}
```

Endi balans **hech qachon** manfiy bo‘lmaydi — buni klass kafolatlaydi, uni ishlatgan har bir kod emas.

## Getter va “faqat o‘qish”

O‘qish ochiq, yozish yopiq bo‘lishi kerak bo‘lsa — ikki yo‘l:

```php
<?php
// 1. private + getter metod
class A
{
    private int $id;
    public function id(): int { return $this->id; }
}

// 2. readonly (PHP 8.1)
class B
{
    public function __construct(public readonly int $id) {}
}
```

Hisoblanadigan qiymat har doim metod: `$savat->jami()`.

## Metodlar ham yopiq bo‘lishi mumkin

```php
<?php
class Buyurtma
{
    public function tasdiqla(): void
    {
        $this->tekshir();
        // ...
    }

    private function tekshir(): void
    {
        // faqat ichki yordamchi
    }
}
```

`private` metodlar — klass ichki ishining bir qismi; ularni keyin bemalol o‘zgartirish mumkin, chunki tashqaridan hech kim chaqirmaydi.

## Modifikatorsiz yozilsa

Metod modifikatorsiz bo‘lsa — `public`. Xususiyatlar uchun modifikator (yoki `var`, eskirgan) **shart**. Doim aniq yozing.

## Mustaqil mashq

Yuqoridagi `Hisob` klassini sinang:

```php
<?php
$h = new Hisob();
$h->kirim(50000);
$h->chiqim(20000);
try {
    $h->chiqim(100000);
} catch (RuntimeException $e) {
    echo $e->getMessage(), ' | ';
}
echo $h->balans();
```

**Kutilgan natija:** `Mablag‘ yetarli emas | 30000`
