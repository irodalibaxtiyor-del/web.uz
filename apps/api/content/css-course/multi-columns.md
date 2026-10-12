## Ko‘p ustunli matn

Gazetadagidek matnni bir nechta ustunga bo‘lish mumkin. Matn birinchi ustundan ikkinchisiga **oqib o‘tadi**.

```css
.maqola {
  column-count: 3;
}
```

## Asosiy xususiyatlar

| Xususiyat       | Vazifasi                                     | Misol                  |
| --------------- | -------------------------------------------- | ---------------------- |
| `column-count`  | Ustunlar soni                                | `3`                    |
| `column-width`  | Ustunning ideal kengligi                     | `220px`                |
| `columns`       | Ikkalasining qisqa yozuvi                    | `220px 3`              |
| `column-gap`    | Ustunlar orasidagi masofa                    | `32px`                 |
| `column-rule`   | Ustunlar orasidagi chiziq                    | `1px solid #e5e7eb`    |
| `column-span`   | Element barcha ustunlar bo‘ylab cho‘ziladi    | `all`                  |

## Moslashuvchan ustunlar

```css
.maqola {
  column-width: 220px;
  column-gap: 32px;
}
```

Brauzer nechta 220px lik ustun sig‘sa, shuncha ustun yaratadi: katta ekranda 4, telefonda 1. Media so‘rov kerak emas.

## Sarlavha barcha ustunlar bo‘ylab

```css
.maqola h2 {
  column-span: all;
}
```

## Elementni bo‘lmaslik

Kartochka yoki rasm ikki ustun orasida bo‘linib qolmasligi uchun:

```css
.maqola figure {
  break-inside: avoid;
}
```

## Masonry o‘rniga

Har xil balandlikdagi kartochkalarni “g‘isht” kabi joylashtirish uchun ham ustunlar ishlatiladi:

```css
.galereya {
  columns: 240px;
  column-gap: 16px;
}

.galereya .karta {
  break-inside: avoid;
  margin-bottom: 16px;
}
```

Faqat esda tuting: tartib **ustun bo‘ylab** — yuqoridan pastga, keyin keyingi ustun.

## Qachon ishlatmaslik kerak?

Ekranda uzun matnni ustunlarga bo‘lish ko‘pincha noqulay: o‘quvchi birinchi ustun oxiriga yetib, yana yuqoriga aylantirishi kerak. Ko‘p ustunli matn qisqa bloklar (ro‘yxatlar, izohlar, kartochkalar) uchun yaxshiroq.

## Xulosa

- `column-count` — soni, `column-width` — moslashuvchan kenglik.
- `column-gap` va `column-rule` — oraliq va chiziq.
- `column-span: all` va `break-inside: avoid`.
