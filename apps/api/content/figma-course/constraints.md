## Freym kattalashganda

Dizayner maketni bitta freym o‘lchamida chizadi. Lekin brauzer oynasi har xil. Figma’da freymni cho‘zsangiz, ichidagi qatlamlar o‘zini qanday tutishini **constraints** belgilaydi. Bu dasturchi uchun dizaynerning “moslashuv niyati” haqidagi eng aniq ma’lumot.

Constraints faqat Auto Layout’siz freymlarda (yoki Auto Layout ichidagi absolyut elementlarda) ishlaydi.

## Gorizontal constraints

| Figma            | Xatti-harakat                           | CSS                                  |
| ---------------- | --------------------------------------- | ------------------------------------ |
| **Left**         | Chap chetdan masofa o‘zgarmaydi         | standart oqim                        |
| **Right**        | O‘ng chetga yopishgan                   | `margin-left: auto` yoki `right`     |
| **Left & Right** | Ikkala chet qotgan — element cho‘ziladi | kenglik yo‘q, `margin-inline: 24px`  |
| **Center**       | Markazda qoladi                         | `margin-inline: auto` + o‘z kengligi |
| **Scale**        | Freym bilan mutanosib                   | `width: 50%`                         |

Vertikal constraints (Top, Bottom, Top & Bottom, Center, Scale) ham xuddi shunday.

## Misol

```
Mobile 375
├── Banner — W 327, Left & Right (24 / 24)
├── Image — W 300, Scale
└── Button — W 200, Center
```

```css
.banner {
  margin-inline: 24px;
} /* 1000px da: 952px */
.rasm {
  width: 50%;
} /* 1000px da: 500px */
.tugma {
  width: 200px;
  margin-inline: auto;
}
```

## Kenglikni nusxalash — xato

Maketda banner kengligi 327 bo‘lsa, `width: 327px` yozish oson. Lekin Left & Right constraint “bu blok cho‘ziladi” deydi. `width: 327px` esa kengroq ekranda chap tomonda qotib qoladi. Har bir qiymatni yozishdan oldin so‘rang: **bu son qotgan o‘lchammi yoki shunchaki shu freymdagi natijami?**

## Constraints yo‘q bo‘lsa

Ko‘p maketlarda constraints o‘rnatilmagan (standart: Left + Top). Bu dizayner moslashuvni o‘ylamaganini bildiradi. Bunday holatda odatiy amaliyot:

- matn va konteynerlar — Left & Right (cho‘ziladi);
- tugmalar va ikonkalar — o‘z o‘lchamida;
- rasmlar — konteynerga mutanosib.

Shubha bo‘lsa — dizaynerdan katta ekran uchun ham freym so‘rang (keyingi darslar).

## Figma’da sinash

Freymni burchagidan tortib kattalashtiring — elementlar qanday harakat qilishini ko‘rasiz. Bu dizayner bilan suhbatda ham foydali: “Freymni 1024 ga cho‘zsak, banner nima bo‘ladi?”

Mashqda uch xil constraint’ni CSS’ga o‘girasiz.
