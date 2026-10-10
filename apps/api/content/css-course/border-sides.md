## Har bir tomon alohida

Chegarani to‘rt tomonning har biriga alohida berish mumkin:

```css
.iqtibos {
  border-left: 4px solid #0071dc;
}

.sarlavha {
  border-bottom: 2px dashed #ccc;
}
```

Har bir tomonning o‘z xususiyatlari ham bor: `border-top-color`, `border-right-width`, `border-bottom-style` va hokazo.

## To‘rt qiymatli yozuv

`border-width`, `border-style` va `border-color` bir nechta qiymat qabul qiladi. Tartib — **soat mili bo‘yicha**, yuqoridan boshlab:

| Qiymatlar soni | Misol                     | Ma’nosi                                    |
| -------------- | ------------------------- | ------------------------------------------ |
| 1              | `2px`                     | To‘rt tomon bir xil                        |
| 2              | `2px 4px`                 | Yuqori-past, o‘ng-chap                     |
| 3              | `2px 4px 6px`             | Yuqori, o‘ng-chap, past                    |
| 4              | `1px 2px 3px 4px`         | Yuqori, o‘ng, past, chap                   |

```css
.quti {
  border-style: solid;
  border-width: 1px 4px;           /* yuqori va past 1px, yonlar 4px */
  border-color: red green blue gold; /* yuqori, o‘ng, past, chap */
}
```

> **Eslab qolish usuli:** soat mili yo‘nalishi — 12 (yuqori), 3 (o‘ng), 6 (past), 9 (chap).

Bu tartib keyinchalik `margin` va `padding` da ham aynan shunday ishlaydi.

## Faqat bitta tomonni olib tashlash

Avval hamma tomonni berib, keyin bittasini o‘chirish qulay:

```css
.tab {
  border: 1px solid #ccc;
  border-bottom: none;
}
```

## Mantiqiy tomonlar

Zamonaviy CSS’da yozuv yo‘nalishiga bog‘liq “mantiqiy” xususiyatlar ham bor:

| Fizik           | Mantiqiy               |
| --------------- | ---------------------- |
| `border-left`   | `border-inline-start`  |
| `border-right`  | `border-inline-end`    |
| `border-top`    | `border-block-start`   |
| `border-bottom` | `border-block-end`     |

Chapdan o‘ngga yoziladigan o‘zbek tilida `border-inline-start` — chap tomon, arab tilida esa o‘ng tomon bo‘ladi.

## Amaliy misol: iqtibos bloki

```css
blockquote {
  margin: 0;
  padding: 12px 16px;
  border-left: 4px solid #0071dc;
  background-color: #f5faff;
}
```

## Xulosa

- `border-top`, `border-right`, `border-bottom`, `border-left` — har bir tomon alohida.
- Ko‘p qiymatli yozuv tartibi: yuqori, o‘ng, past, chap (soat mili bo‘yicha).
- `border-bottom: none` kabi yozuv bilan bitta tomonni o‘chirish qulay.
