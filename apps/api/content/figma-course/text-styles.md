## Text Styles

Tartibli maketda har bir matn qatlamiga shrift qo‘lda berilmaydi — u nomlangan **Text Style**’dan oladi: `Heading/H1`, `Body/Regular`, `Caption`. Matnni tanlasangiz, Inspect’da uslub nomi va qiymatlari chiqadi:

```
Heading/H1
Font: Inter · Bold · 40
Line height: 120%
Letter spacing: -2%
```

## O‘girish jadvali

| Figma                               | CSS                                         |
| ----------------------------------- | ------------------------------------------- |
| Font: Inter                         | `font-family: Inter, system-ui, sans-serif` |
| Bold / Semi Bold / Medium / Regular | `font-weight: 700 / 600 / 500 / 400`        |
| Size 40                             | `font-size: 40px` (yoki `2.5rem`)           |
| Line height 120%                    | `line-height: 1.2`                          |
| Line height 48 (px)                 | `line-height: 48px` yoki `1.2`              |
| Line height Auto                    | `line-height: normal` (yaxshisi aniq son)   |
| Letter spacing −2%                  | `letter-spacing: -0.02em`                   |
| Letter spacing 0.5 (px)             | `letter-spacing: 0.5px`                     |
| Paragraph spacing 16                | `p + p { margin-top: 16px }`                |
| Text case: Upper                    | `text-transform: uppercase`                 |

## Foizlarga diqqat

Figma’dagi foizlar **shrift o‘lchamiga** nisbatan:

- Line height 120% → `1.2` (birliksiz), 40px shriftda 48px.
- Letter spacing −2% → `-0.02em`, 40px shriftda −0.8px.

`letter-spacing: -2%` deb yozish xato — CSS’da harf oralig‘i foizni qabul qilmaydi. `em` aynan shriftga nisbiy, shuning uchun to‘g‘ri tarjima.

## Line height — birliksiz

Figma’da qator balandligi px yoki % bo‘lishi mumkin. CSS’da birliksiz qiymat yozish odatda yaxshiroq: element ichidagi kichikroq matn o‘z o‘lchamiga mos qator balandligini oladi. `48px` qotgan qiymat esa ichidagi 14px’li izohga ham 48px beradi.

## Tokenlarga yig‘ish

```css
:root {
  --font-sans: Inter, system-ui, sans-serif;
}

.h1 {
  font: 700 2.5rem/1.2 var(--font-sans);
  letter-spacing: -0.02em;
}
```

`font` qisqa yozuvi: qalinlik, o‘lcham/qator balandligi, oila. Har bir Text Style — bitta CSS klass yoki element uslubi.

## Shrift topilmasa

Maketdagi shrift (masalan, Inter) loyihaga ulanmagan bo‘lsa, Figma’dagi ko‘rinish va sahifa farq qiladi: kengroq/torroq harflar matnni boshqa qatorlarga bo‘ladi. Avval shriftni ulang (`@font-face`), keyin maket bilan solishtiring.

## Matn qutisi o‘lchami

Figma matn qutisida yuqori va pastda qator balandligi tufayli bo‘sh joy bo‘ladi (_leading_). CSS’da ham xuddi shunday, shuning uchun Figma’dagi “matn qutisidan matn qutisigacha” masofa CSS’dagi `margin` bilan odatda mos keladi.

Mashqda uch Text Style’ni CSS’ga aniq o‘girasiz.
