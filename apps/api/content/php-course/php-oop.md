## Obyektga yo‘naltirilgan dasturlash (OOP)

Hozirgacha ma’lumot (massivlar) va uni qayta ishlovchi funksiyalar **alohida** edi:

```php
<?php
$hisob = ['egasi' => 'Dilnoza', 'balans' => 0];

function kirim(array &$hisob, int $summa): void
{
    $hisob['balans'] += $summa;
}
```

Muammolar:

- `$hisob['balans'] = -1000000;` — hech kim to‘xtatmaydi, qoidalar chetlab o‘tiladi;
- qaysi funksiyalar qaysi massiv bilan ishlashi faqat nomdan taxmin qilinadi;
- `'balans'` o‘rniga `'balan'` yozilsa — jim xato.

**OOP** ma’lumot va u bilan ishlovchi kodni bitta **obyekt**ga birlashtiradi:

```php
<?php
class Hisob
{
    private int $balans = 0;

    public function __construct(public string $egasi) {}

    public function kirim(int $summa): void
    {
        if ($summa <= 0) {
            throw new InvalidArgumentException('Summa musbat bo‘lsin');
        }
        $this->balans += $summa;
    }

    public function balans(): int
    {
        return $this->balans;
    }
}

$h = new Hisob('Dilnoza');
$h->kirim(50000);
echo $h->balans(); // 50000
```

Endi balansni faqat `kirim` orqali, qoidaga muvofiq o‘zgartirish mumkin.

## Asosiy tushunchalar

| Tushuncha | Ma’nosi | Misol |
| --- | --- | --- |
| **Klass** | Qolip, tavsif | `class Hisob` |
| **Obyekt** | Klassdan yaratilgan nusxa | `new Hisob('Dilnoza')` |
| **Xususiyat** | Obyekt ma’lumoti | `$balans`, `$egasi` |
| **Metod** | Obyekt funksiyasi | `kirim()` |
| `$this` | Metod ichida — shu obyekt | `$this->balans` |

## OOP’ning to‘rt tamoyili

1. **Inkapsulyatsiya** — ichki holat yashiriladi (`private`), tashqi dunyo faqat metodlar orqali ishlaydi.
2. **Meros** — `JamgarmaHisob extends Hisob`: umumiy kod qayta yozilmaydi.
3. **Polimorfizm** — har xil klasslar bir xil metodga (`malumot()`) o‘zicha javob beradi.
4. **Abstraksiya** — interfeys “nima qilinadi”ni aytadi, “qanday” — klass ichida.

Keyingi darslarda har birini amalda ko‘ramiz.

## Qachon OOP?

- Ma’lumotning **qoidalari** bor (balans manfiy bo‘lmaydi, email to‘g‘ri bo‘lishi kerak).
- Bir xil turdagi ko‘p narsa (foydalanuvchilar, buyurtmalar).
- Katta loyiha va jamoa — Laravel, Symfony kabi freymvorklar to‘liq OOP’da.

Kichik skriptlar uchun funksiyalar ham yetarli — OOP maqsad emas, vosita.

## Mustaqil mashq

Yuqoridagi `Hisob` klassini yozing va sinang:

```php
<?php
$h = new Hisob('Dilnoza');
$h->kirim(50000);
$h->kirim(25000);
try {
    $h->kirim(-100);
} catch (InvalidArgumentException $e) {
    echo $e->getMessage(), ' | ';
}
echo $h->egasi, ': ', $h->balans();
```

**Kutilgan natija:** `Summa musbat bo‘lsin | Dilnoza: 75000`
