## Rang qanday yoziladi

Ekrandagi har bir rang uchta yorug‘lik — qizil, yashil va ko‘k aralashmasidan hosil bo‘ladi. CSS shu rangni bir necha usulda yozishga imkon beradi. Natija bir xil, farqi — qaysi biri bilan ishlash qulayligida.

## HEX

```css
color: #0071dc;
```

Oltita o‘n oltilik raqam: juft-juft qizil (`00`), yashil (`71`), ko‘k (`dc`). Har biri `00` dan `ff` gacha (0–255). Qisqa yozuv ham bor: `#fff` = `#ffffff`. Sakkiz belgili yozuvda oxirgi juftlik shaffoflik: `#0071dc80`.

HEX dizayn dasturlaridan nusxa olishda qulay, lekin unga qarab rang qanday ekanini taxmin qilish qiyin.

## RGB

```css
color: rgb(254 196 0);
color: rgb(0 113 220 / 0.5); /* 50% shaffof */
```

Uchta son 0–255 oralig‘ida. Zamonaviy yozuvda vergul shart emas, shaffoflik `/` dan keyin beriladi. Eski yozuv `rgba(0, 113, 220, 0.5)` ham ishlaydi.

## HSL

```css
color: hsl(150 60% 35%);
```

Inson tushunchasiga eng yaqin model:

| Qism             | Ma’nosi                     | Qiymat                                 |
| ---------------- | --------------------------- | -------------------------------------- |
| H — ton (_hue_)  | Rang g‘ildiragidagi burchak | 0–360° (0 qizil, 120 yashil, 240 ko‘k) |
| S — to‘yinganlik | Qanchalik “jonli”           | 0% kulrang — 100% to‘liq rang          |
| L — yorug‘lik    | Qanchalik och               | 0% qora — 50% sof rang — 100% oq       |

HSL’ning kuchi: rangni o‘zgartirish oson. “Biroz ochroq” — L ni oshirish; “xiraroq” — S ni kamaytirish. HEX’da buning uchun kalkulyator kerak.

## Rang nomlari

`red`, `white`, `tomato` kabi 148 ta nom bor. Tez sinab ko‘rish uchun qulay, lekin haqiqiy loyihada brend ranglari aniq qiymat bilan yoziladi.

## Shaffoflik va `currentColor`

- `transparent` — to‘liq shaffof.
- `opacity: 0.5` — **butun elementni** (matni bilan) shaffof qiladi; faqat fonni shaffof qilish uchun rangning o‘zida alfa bering.
- `currentColor` — elementning joriy `color` qiymati. Chegara yoki ikonka matn bilan bir xil rangda bo‘lishi kerak bo‘lsa juda qulay.

## Zamonaviy modellar

Yangi brauzerlarda `oklch()` ham bor: unda yorug‘lik inson ko‘zi sezishiga mos o‘zgaradi, shuning uchun bir xil L dagi sariq va ko‘k bir xil yorug‘ ko‘rinadi. Hozircha HSL’ni yaxshi o‘rganib olish yetarli.

Mashqda to‘rtta namunaga turli yozuvlarda rang berasiz.
