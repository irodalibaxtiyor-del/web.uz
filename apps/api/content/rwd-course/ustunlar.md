## Ustunli to‘r g‘oyasi

Ko‘p saytlar sahifani tasavvurdagi **12 ustunli to‘r** ustiga quradi. 12 soni qulay: u 2, 3, 4 va 6 ga bo‘linadi. Asosiy kontent 9 ustun, yon panel 3 ustun; uchta karta 4 tadan; ikkita blok 6 tadan.

| Ustunlar | Foiz |
| --- | --- |
| 12 / 12 | 100% |
| 9 / 12 | 75% |
| 6 / 12 | 50% |
| 4 / 12 | 33.33…% |
| 3 / 12 | 25% |

## Eski usul: `float`

Flexbox va Grid paydo bo‘lishidan oldin ustunlar `float: left` va foizli kenglik bilan qurilardi:

```css
.ustun-9 { float: left; width: 75%; }
.ustun-3 { float: left; width: 25%; }
```

Bu usulning muammolari ko‘p: ota element balandligini “yo‘qotadi” (*clearfix* kerak bo‘ladi), ustunlarni bir xil balandlikka keltirish qiyin, vertikal tekislash deyarli imkonsiz. Eski loyihalarda uchrab turgani uchun tanib olish foydali, lekin yangi kodda ishlatilmaydi.

## Zamonaviy usul: Flexbox va avval mobil

```css
.qator {
  display: flex;
  flex-wrap: wrap;
}

.ustun {
  width: 100%; /* telefonda har bir ustun to‘liq kenglikda */
}

@media (min-width: 768px) {
  .ustun-9 { width: 75%; }
  .ustun-3 { width: 25%; }
}
```

Telefonda ustunlar ustma-ust turadi, planshetdan boshlab yonma-yon.

## `box-sizing: border-box` nega kerak?

Standart holda `width` faqat kontentni o‘lchaydi: `width: 25%` + `padding: 12px` 25% dan **kengroq** blok beradi va ustunlar qatorga sig‘may qoladi. `border-box` da `padding` va `border` kenglik ichiga kiradi:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Bu qoidani deyarli har bir loyihaning boshiga yozib qo‘yishadi.

## Kasrli foizlar haqida

`33.3333%` kabi qiymatlar uchta ustunni to‘liq to‘ldirmasligi mumkin — piksel bo‘laklari yo‘qoladi. Aniq bo‘lish uchun `calc(100% / 3)` yoki Grid’dagi `fr` birligi qulayroq. Brauzer baribir pikselni mayda bo‘laklarga yaxlitlaydi, shuning uchun ba’zan 299.98px kabi qiymatlarni ko‘rasiz — bu xato emas.

## Tayyor tizimlar

Bootstrap kabi freymvorklar aynan shu g‘oyani klasslarga aylantirgan: `col-md-9`, `col-md-3`. Ularni ishlatish uchun to‘r qanday ishlashini tushunish kifoya — mashqda o‘zingiz kichik versiyasini yozasiz.
