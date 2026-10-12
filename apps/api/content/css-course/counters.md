## CSS hisoblagichlari

CSS o‘zi son sanay oladi. Bu bo‘limlar, qadamlar yoki rasmlarni avtomatik raqamlash uchun qulay.

Uchta asosiy qism bor:

| Qism                | Vazifasi                           |
| ------------------- | ---------------------------------- |
| `counter-reset`     | Hisoblagichni yaratadi (0 dan)     |
| `counter-increment` | Qiymatni oshiradi (standart 1 ga)  |
| `counter()`         | Joriy qiymatni `content` da chiqaradi |

## Bo‘limlarni raqamlash

```css
.maqola {
  counter-reset: bolim;
}

.maqola h2 {
  counter-increment: bolim;
}

.maqola h2::before {
  content: counter(bolim) ". ";
  color: #0071dc;
}
```

Natija:

```text
1. Kirish
2. Asosiy qism
3. Xulosa
```

Yangi `h2` qo‘shsangiz yoki o‘rnini almashtirsangiz, raqamlar o‘zi yangilanadi.

## Ichma-ich raqamlash

```css
.maqola {
  counter-reset: bolim;
}

.maqola h2 {
  counter-increment: bolim;
  counter-reset: kichik;
}

.maqola h3 {
  counter-increment: kichik;
}

.maqola h3::before {
  content: counter(bolim) "." counter(kichik) " ";
}
```

`2.1`, `2.2`… — har yangi `h2` da kichik hisoblagich noldan boshlanadi.

## Raqam turi

`counter()` ning ikkinchi parametri — ro‘yxat belgilari kabi turi:

```css
content: counter(bolim, upper-roman) ". "; /* I. II. III. */
```

## Qadamlar

Hisoblagich ko‘pincha chiroyli doiracha ichidagi raqamlar uchun ishlatiladi:

```css
.qadamlar {
  counter-reset: qadam;
  list-style: none;
  padding: 0;
}

.qadamlar li {
  counter-increment: qadam;
}

.qadamlar li::before {
  content: counter(qadam);
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: #0071dc;
  color: white;
}
```

> Raqamlar ma’noli bo‘lsa (masalan, ko‘rsatma qadamlari), HTML’da `<ol>` ishlating. `<ol>` o‘zi raqamlanadi va ekran o‘quvchi buni biladi — CSS hisoblagichi faqat ko‘rinishni o‘zgartiradi.

## Xulosa

- `counter-reset` → `counter-increment` → `content: counter(nom)`.
- Ichma-ich raqamlash uchun ikki hisoblagich.
- Ma’noli raqamlar uchun asos — `<ol>`.
