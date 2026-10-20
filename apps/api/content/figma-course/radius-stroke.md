## Corner radius

Figma’da radius bitta qiymat (hamma burchak) yoki to‘rtta alohida qiymat bo‘lishi mumkin. Tartib CSS bilan bir xil: **chap-tepa, o‘ng-tepa, o‘ng-past, chap-past** (soat mili bo‘yicha).

```css
.muqova {
  border-radius: 16px 16px 0 0; /* faqat tepa burchaklar */
}
```

Karta ichidagi rasm uchun odatiy holat: karta 16px, rasmning tepa burchaklari ham 16px, pastkilari 0. Yoki kartaga `overflow: hidden` berib, rasmga radius bermaslik.

Figma’dagi **Corner smoothing** (iOS uslubidagi “silliq” burchak) CSS’da standart xususiyat sifatida yo‘q — oddiy radius yetarli yaqin.

## Stroke

Figma’da stroke’ning uchta joylashuvi bor:

| Figma       | Ma’nosi                                    | CSS                                    |
| ----------- | ------------------------------------------ | -------------------------------------- |
| **Inside**  | Chiziq element ichida, o‘lcham o‘zgarmaydi | `border` + `box-sizing: border-box`    |
| **Center**  | Yarmi ichida, yarmi tashqarida             | ko‘pincha `border` (kichik farq)       |
| **Outside** | Element tashqarisida                       | `box-shadow: 0 0 0 2px` yoki `outline` |

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

.tanlangan {
  border: 2px solid #0071dc;
}
```

`border-box` bo‘lmasa, 2px chegara tugmani 4px kattalashtiradi va tanlanganda yonidagi elementlar “sakraydi”.

Ko‘p loyihalarda holat almashganda o‘lcham o‘zgarmasligi uchun **barcha** variantlar bir xil kenglikdagi chegaraga ega bo‘ladi, faqat rangi farq qiladi (masalan, oddiy holatda `transparent`).

## Punktir chiziq

Figma’da stroke’ga **Dash** (masalan, 6/4 — chiziq va bo‘shliq) beriladi. CSS’dagi `dashed` chiziq va bo‘shliq uzunligini boshqara olmaydi — brauzer o‘zi chizadi:

```css
.yuklash {
  border: 1px dashed #94a3b8;
}
```

Aniq naqsh kerak bo‘lsa — SVG fon yoki `background-image` gradient hiylalari. Ko‘p hollarda oddiy `dashed` yetarli; dizaynerga buni ayting.

## Faqat bir tomon

Figma’da stroke’ni alohida tomonlarga berish mumkin (faqat pastki chiziq). CSS’da: `border-bottom: 1px solid`.

Mashqda burchak radiuslari, ichki stroke va punktir chiziqni yozasiz.
