## `@property` — turi aniq o‘zgaruvchilar

Oddiy CSS o‘zgaruvchisi brauzer uchun shunchaki **matn**. Brauzer `--burchak: 45deg` ni burchak ekanini bilmaydi. Shuning uchun:

- uni animatsiya qilib bo‘lmaydi (qiymat bir zumda sakraydi);
- noto‘g‘ri qiymat yozilsa, brauzer buni sezmaydi.

`@property` o‘zgaruvchiga **tur**, **boshlang‘ich qiymat** va **meros** qoidasini beradi.

```css
@property --burchak {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
```

| Qism            | Vazifasi                                   |
| --------------- | ------------------------------------------ |
| `syntax`        | Qiymat turi                                |
| `inherits`      | Bolalarga meros bo‘ladimi                  |
| `initial-value` | O‘zgaruvchi berilmasa ishlatiladigan qiymat |

## Asosiy turlar

| `syntax`        | Misol qiymat       |
| --------------- | ------------------ |
| `<length>`      | `16px`, `2rem`     |
| `<number>`      | `1.5`              |
| `<percentage>`  | `40%`              |
| `<color>`       | `#0071dc`          |
| `<angle>`       | `45deg`            |
| `<integer>`     | `3`                |
| `*`             | Istalgan (oddiy o‘zgaruvchidek) |

## Gradientni animatsiya qilish

Gradientning o‘zini animatsiya qilib bo‘lmaydi. Lekin uning ichidagi **turi aniq o‘zgaruvchini** animatsiya qilish mumkin:

```css
@property --burchak {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.karta {
  background: linear-gradient(var(--burchak), #0071dc, #fec400);
  transition: --burchak 0.6s;
}

.karta:hover {
  --burchak: 180deg;
}
```

Hover’da gradient silliq aylanadi. `@property` siz u bir zumda o‘zgarardi. (`transition` 11-modulda.)

## Himoya

```css
@property --qadam {
  syntax: "<length>";
  inherits: true;
  initial-value: 8px;
}

.karta {
  --qadam: qizil; /* noto‘g‘ri tur — e’tiborsiz, 8px qoladi */
  padding: var(--qadam);
}
```

Noto‘g‘ri qiymat `initial-value` bilan almashtiriladi, maket buzilmaydi.

## `inherits: false` qachon?

Agar o‘zgaruvchi faqat shu elementning o‘ziga tegishli bo‘lsa (masalan, animatsiya burchagi), meros o‘chiriladi — bolalarga bexosdan o‘tib ketmaydi va brauzer tezroq ishlaydi.

## Xulosa

- `@property` o‘zgaruvchiga tur, boshlang‘ich qiymat va meros qoidasini beradi.
- Turi aniq o‘zgaruvchini animatsiya qilish mumkin (masalan, gradient burchagi).
- Noto‘g‘ri qiymat `initial-value` ga qaytadi.
