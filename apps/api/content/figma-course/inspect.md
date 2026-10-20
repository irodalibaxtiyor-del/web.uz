## Inspect va Dev Mode

Qatlamni tanlab, o‘ng paneldagi **Inspect** (yoki Dev Mode) bo‘limiga o‘tsangiz, uning xususiyatlari raqam va CSS ko‘rinishida chiqadi:

```
Card/Lesson
W 327   H Hug
Padding 16   Gap 4
Fill  #FFFFFF
Stroke  1  Inside  #E2E8F0
Radius  12
Drop shadow  X 0  Y 4  Blur 12  Spread 0  #0F172A 8%
```

## Qiymatlarni CSS’ga o‘girish

| Figma                       | CSS                                              |
| --------------------------- | ------------------------------------------------ |
| W 327 (Fixed)               | `width: 327px` (ko‘pincha `max-width` yaxshiroq) |
| H Hug                       | balandlik berilmaydi (kontentga qarab)           |
| Padding 16                  | `padding: 16px`                                  |
| Gap 4 (Auto layout)         | `gap: 4px`                                       |
| Fill                        | `background-color` (matnda — `color`)            |
| Stroke 1 Inside             | `border: 1px solid` (+ `box-sizing: border-box`) |
| Radius 12                   | `border-radius: 12px`                            |
| Drop shadow X Y Blur Spread | `box-shadow: X Y Blur Spread rang`               |
| `#0F172A` 8%                | `rgb(15 23 42 / 0.08)`                           |

## Inspect’dan nusxa olish — ehtiyotkorlik bilan

Dev Mode tayyor CSS ham beradi. U foydali, lekin ko‘r-ko‘rona nusxalamang:

```css
/* Figma bergan CSS */
position: absolute;
left: 24px;
top: 312px;
width: 327px;
height: 88px;
```

Bu — qotgan joylashuv: matn uzunroq bo‘lsa, karta kattalashmaydi; ekran kengligi o‘zgarsa, karta joyida qoladi. Siz faqat **vizual xususiyatlarni** (rang, radius, soya, shrift) olasiz, joylashuvni esa o‘zingiz Flexbox va Grid bilan qurasiz.

## Masofalarni o‘lchash

Figma’da qatlamni tanlab, **Alt** (macOS’da Option) tugmasini bosib turib boshqa qatlamga olib borsangiz, ular orasidagi masofa qizil raqamlarda ko‘rinadi. Agar maketda Auto Layout ishlatilgan bo‘lsa, oraliq `Gap` sifatida aniq yozilgan bo‘ladi.

## Noaniqlik bo‘lsa

Maketda 15px va 17px kabi “g‘alati” qiymatlar ko‘rsangiz, bu ko‘pincha dizayner xatosi: ehtimol 16px nazarda tutilgan. Bunday hollarda tizimdagi eng yaqin qiymatni oling yoki dizaynerdan so‘rang — taxmin qilmang.

Mashqda kartani Inspect paneli bo‘yicha piksellarigacha aniq yasaysiz.
