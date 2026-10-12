## Ro‘yxatlarni bezash

HTML’da ikki asosiy ro‘yxat bor: tartibsiz `<ul>` (nuqtalar) va tartibli `<ol>` (raqamlar). CSS bilan belgining turi, joyi va rangini o‘zgartirish mumkin.

## `list-style-type`

| Qiymat                 | Ko‘rinishi           |
| ---------------------- | -------------------- |
| `disc`                 | ● (ul standarti)     |
| `circle`               | ○                    |
| `square`               | ■                    |
| `decimal`              | 1, 2, 3 (ol standarti) |
| `decimal-leading-zero` | 01, 02, 03           |
| `lower-alpha`          | a, b, c              |
| `upper-roman`          | I, II, III           |
| `none`                 | Belgisiz             |

```css
ul.afzalliklar {
  list-style-type: square;
}

ol.bosqichlar {
  list-style-type: upper-roman;
}
```

Belgi sifatida istalgan matnni ham berish mumkin: `list-style-type: "✓ ";`.

## `list-style-position`

- `outside` (standart) — belgi matn chegarasidan tashqarida, qatorlar bir chiziqda tekislanadi;
- `inside` — belgi matn ichida, ikkinchi qator belgi ostidan boshlanadi.

## `list-style` qisqa yozuvi

```css
ul {
  list-style: square inside;
}
```

## Belgini bezash: `::marker`

`::marker` psevdoelementi belgining o‘zini tanlaydi:

```css
li::marker {
  color: #0071dc;
  font-weight: 700;
}
```

`::marker` da faqat bir nechta xususiyat ishlaydi: rang, shrift va `content`.

## Belgisiz ro‘yxat: menyular

Navigatsiya menyusi ma’no jihatidan havolalar ro‘yxati, shuning uchun u ko‘pincha `<ul>` bilan yoziladi. Ko‘rinishdan esa belgilar va standart chekinish olib tashlanadi:

```css
nav ul {
  list-style: none;
  margin: 0;
  padding-left: 0;
}
```

Brauzer ro‘yxatlarga standart `padding-left` (odatda 40px) beradi — belgilar shu joyda turadi. Belgilarni olib tashlaganda bu bo‘shliqni ham nolga tushiring.

## Ro‘yxat oralig‘i

Elementlar orasiga masofa berish uchun `li` ga margin yoki ota elementga `gap` (flex/grid bilan) ishlatiladi:

```css
.afzalliklar li + li {
  margin-top: 8px;
}
```

## Xulosa

- `list-style-type` — belgi turi, `list-style-position` — joyi.
- `::marker` belgining rangi va shriftini o‘zgartiradi.
- Menyular uchun `list-style: none` va `padding-left: 0`.
