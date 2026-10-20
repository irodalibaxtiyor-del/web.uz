## Layout Grid

Figma freymiga **Layout Grid** qo‘shilsa, maket ustida pushti ustunlar paydo bo‘ladi. Dizayner elementlarni shu ustunlarga tekislaydi. Uch asosiy qiymat:

| Figma                  | Ma’nosi                   | CSS                                            |
| ---------------------- | ------------------------- | ---------------------------------------------- |
| Columns 12             | Ustunlar soni             | `grid-template-columns: repeat(12, 1fr)`       |
| Gutter 24              | Ustunlar orasidagi joy    | `column-gap: 24px`                             |
| Margin 72              | Freym chetidan masofa     | `padding-inline: 72px`                         |
| Type: Stretch          | Ustunlar cho‘ziladi       | `1fr`                                          |
| Type: Center, Width 80 | Qotgan ustunlar, markazda | `repeat(12, 80px)` + `justify-content: center` |

## Hisoblash

1440 freymda: `1440 − 2 × 72 = 1296` ichki kenglik. Gutterlar: `11 × 24 = 264`. Ustun: `(1296 − 264) / 12 = 86px`. CSS’dagi `1fr` aynan shuni hisoblaydi.

## Mobil to‘r

Telefonda odatda 4 ustun: 360 freymda Margin 16, Gutter 16 → `(328 − 48) / 4 = 70px`.

```css
.tor {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 16px;
  padding-inline: 16px;
}

.tor > * {
  grid-column: span 4; /* telefonda hammasi to‘liq */
}

@media (min-width: 1024px) {
  .tor {
    grid-template-columns: repeat(12, 1fr);
    column-gap: 24px;
    padding-inline: 72px;
  }

  .asosiy {
    grid-column: span 8;
  }
  .yon {
    grid-column: span 4;
  }
}
```

## Har bir elementga to‘r kerakmi?

Yo‘q. To‘r — tekislash uchun ko‘rinmas chiziqlar. Amalda ko‘p sahifalarda faqat konteyner (`max-width` + `padding-inline`) va har bir bo‘limning o‘z Grid/Flex maketi yetarli. 12 ustunli CSS Grid’ni faqat elementlar haqiqatan turli ustunlarni egallaganda ishlating.

## Ichki to‘r (subgrid)

Agar karta ichidagi elementlar ham sahifa to‘riga tekislanishi kerak bo‘lsa, CSS’da `grid-template-columns: subgrid` bor — bola grid ota grid ustunlarini “meros” oladi.

## Maketda to‘rni ko‘rish

Figma’da to‘rni **View → Layout grids** menyusi orqali yoqib-o‘chirish mumkin. Dev Mode’da freymni tanlasangiz, to‘r qiymatlari ham ko‘rsatiladi.

Mashqda maketdagi 12 va 4 ustunli to‘rni CSS Grid bilan aynan qayta yasaysiz.
