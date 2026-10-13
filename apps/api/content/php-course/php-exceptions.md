## Istisnolar (exceptions)

Xato holatini qaytarilgan qiymat (`false`, `null`) bilan bildirish oson unutiladi. **Istisno** esa e’tibordan chetda qolmaydi: ushlanmasa, skript to‘xtaydi.

## `throw` va `try...catch`

```php
<?php
function bol(int $a, int $b): float
{
    if ($b === 0) {
        throw new InvalidArgumentException('Nolga bo‘lib bo‘lmaydi');
    }
    return $a / $b;
}

try {
    echo bol(10, 2), ' ';
    echo bol(1, 0);
    echo 'bu chiqmaydi';
} catch (InvalidArgumentException $e) {
    echo 'Xato: ', $e->getMessage();
} finally {
    echo ' | tamom';
}
// 5 Xato: Nolga bo‘lib bo‘lmaydi | tamom
```

- istisno tashlangandan keyin `try` ning qolgan qismi **bajarilmaydi**;
- `catch` — mos turdagi istisnoni ushlaydi;
- `finally` — har doim (hatto `return` bo‘lsa ham).

## Istisnolar ierarxiyasi

```text
Throwable
├── Exception          — dastur mantiqidagi kutilgan xatolar
│   ├── LogicException — kod xatosi (noto‘g‘ri argument, qiymat)
│   │   ├── InvalidArgumentException
│   │   └── DomainException
│   ├── RuntimeException — bajarilish paytidagi muammo
│   ├── JsonException
│   └── PDOException
└── Error              — PHP’ning o‘zi tashlaydigan jiddiy xatolar
    ├── TypeError
    ├── ArgumentCountError
    ├── DivisionByZeroError
    └── UnhandledMatchError
```

`catch (Exception $e)` **`Error`larni ushlamaydi**. Hammasini ushlash kerak bo‘lsa (masalan, eng yuqori darajada log yozish uchun) — `catch (Throwable $e)`.

## Bir nechta `catch`

```php
<?php
try {
    // ...
} catch (JsonException $e) {
    // noto‘g‘ri JSON
} catch (PDOException $e) {
    // baza xatosi
} catch (InvalidArgumentException | DomainException $e) {
    // ikki tur bitta blokda
}
```

Tartib muhim: aniqroq tur **oldin**.

## O‘z istisnoingiz

```php
<?php
class TekshiruvXatosi extends Exception
{
    public function __construct(public string $maydon, string $xabar)
    {
        parent::__construct($xabar);
    }
}

try {
    throw new TekshiruvXatosi('email', 'Email noto‘g‘ri');
} catch (TekshiruvXatosi $e) {
    echo $e->maydon, ': ', $e->getMessage(); // email: Email noto‘g‘ri
}
```

## Foydalanuvchiga — umumiy, logga — batafsil

```php
<?php
try {
    // ... bazaga yozish
} catch (Throwable $e) {
    error_log($e->getMessage() . "\n" . $e->getTraceAsString()); // faqat server logiga
    http_response_code(500);
    echo 'Xatolik yuz berdi. Keyinroq urinib ko‘ring.';
}
```

Xato matni, fayl yo‘llari, SQL so‘rovlari foydalanuvchiga **ko‘rsatilmaydi** — ular hujumchiga ma’lumot beradi.

## `finally` va `return`

```php
<?php
function f(): string
{
    try {
        return 'try';
    } finally {
        echo 'finally ';
    }
}
echo f(); // finally try
```

`finally` qaytarishdan **oldin** bajariladi — fayl yoki ulanishni yopish uchun ishonchli joy.

## Mustaqil mashq

```php
<?php
function yosh(string $k): int
{
    $y = filter_var($k, FILTER_VALIDATE_INT);
    if ($y === false) {
        throw new InvalidArgumentException("'$k' son emas");
    }
    if ($y < 0) {
        throw new DomainException('Yosh manfiy bo‘lmaydi');
    }
    return $y;
}

foreach (['25', 'abc', '-3'] as $k) {
    try {
        echo yosh($k);
    } catch (InvalidArgumentException | DomainException $e) {
        echo get_class($e);
    }
    echo '; ';
}
```

**Kutilgan natija:** `25; InvalidArgumentException; DomainException; `
