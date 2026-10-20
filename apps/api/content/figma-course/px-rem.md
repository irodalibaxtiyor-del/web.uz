## Maketda piksel, kodda rem

Figma barcha o‘lchamlarni pikselda ko‘rsatadi. Kodda esa shrift va oraliqlarni `rem` da yozish foydalanuvchi uchun yaxshiroq: agar u brauzerda standart shriftni kattalashtirsa, sahifa ham mutanosib kattalashadi.

## Formula

```
rem = px ÷ 16
```

| Maket (px) | rem      |
| ---------- | -------- |
| 12         | 0.75rem  |
| 14         | 0.875rem |
| 16         | 1rem     |
| 20         | 1.25rem  |
| 24         | 1.5rem   |
| 28         | 1.75rem  |
| 32         | 2rem     |
| 40         | 2.5rem   |

16 — brauzerlarning standart shrift o‘lchami. `html { font-size: 62.5% }` kabi “hiylalar” bilan asosni 10px qilish tavsiya etilmaydi: u foydalanuvchi sozlamasini buzadi va uchinchi tomon komponentlari noto‘g‘ri o‘lchanadi.

## Tokenlarga yig‘ish

Har safar bo‘lishni hisoblamaslik uchun maketdagi o‘lchamlar bir marta tokenlarga aylantiriladi:

```css
:root {
  --t-h2: 1.75rem; /* 28 */
  --t-matn: 1rem; /* 16 */
  --t-izoh: 0.875rem; /* 14 */
  --s-6: 1.5rem; /* 24 */
}
```

Izohda asl piksel qiymatini qoldirish maket bilan solishtirishni osonlashtiradi.

## Nima rem’da, nima px’da

| Xususiyat                  | Odatda                                       |
| -------------------------- | -------------------------------------------- |
| `font-size`                | rem                                          |
| `padding`, `margin`, `gap` | rem (yoki px — loyiha bo‘yicha bitta tanlov) |
| `border-width`             | px (1px chiziq 1px qolsin)                   |
| `border-radius`            | px yoki rem                                  |
| `box-shadow`               | px                                           |
| Media so‘rov chegaralari   | em                                           |

## Figma’da rem ko‘rish

Dev Mode sozlamalarida birlikni `rem` ga o‘zgartirish mumkin — u holda Inspect qiymatlarni o‘zi bo‘lib ko‘rsatadi. Lekin formulani bilish baribir foydali: maketdan tashqari ham (masalan, skrinshotdan) ishlay olasiz.

## Kasrli qiymatlar

Maketda 15px bo‘lsa, 0.9375rem chiqadi. Bunday qiymatlar tizimda yo‘qligining belgisi — yaqin tokenni (14 yoki 16) tanlang.

Mashqda maketdagi piksellarni rem tokenlariga aylantirasiz.
