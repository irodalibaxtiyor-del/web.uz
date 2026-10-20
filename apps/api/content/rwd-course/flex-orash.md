## Elementlar o‘zi qatorga tushsin

Ko‘p holatda “necha ustun bo‘lishi” ni emas, “bitta element **kamida qancha** keng bo‘lishi” ni aytish yetarli. Qolganini brauzer hal qiladi.

## `flex-wrap`

Standart holda Flexbox hamma elementni **bitta qatorga** siqadi. Joy yetmasa, elementlar kichrayadi yoki konteynerdan chiqib ketadi. `flex-wrap: wrap` ga ruxsat bersak, sig‘magan element keyingi qatorga tushadi:

```css
.xususiyatlar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
```

## `flex` qisqa yozuvi

```css
.xususiyat {
  flex: 1 1 220px;
}
```

Uchta qiymat:

| Qism | Nomi | Ma’nosi |
| --- | --- | --- |
| `1` | `flex-grow` | bo‘sh joy qolsa, kengayadi |
| `1` | `flex-shrink` | joy yetmasa, qisqaradi |
| `220px` | `flex-basis` | boshlang‘ich (orzu qilingan) o‘lcham |

Brauzer avval har bir elementga 220px beradi, qatorga nechtasi sig‘sa, shuncha qo‘yadi, keyin qolgan bo‘sh joyni ular orasida teng bo‘ladi.

## Natija

| Ekran | Qatordagi bloklar |
| --- | --- |
| 1000px | 4 ta, har biri 238px |
| 500px | 2 ta, har biri 242px |
| 375px | 1 ta, to‘liq kenglikda |

Birorta ham media so‘rov yozilmadi.

## Oxirgi qatordagi muammo

Agar 5 ta element bo‘lsa va qatorga 3 tadan sig‘sa, oxirgi qatordagi 2 ta element kengayib, yuqoridagilardan kattaroq bo‘lib qoladi. Agar barcha bloklar bir xil o‘lchamda bo‘lishi kerak bo‘lsa, Grid’dagi `auto-fit` yaxshiroq (keyingi dars).

Flexbox o‘rash qachon yaxshi:

- teglar, tugmalar, filtrlar kabi turli uzunlikdagi elementlar;
- “matn + rasm” juftligi: keng ekranda yonma-yon, tor ekranda ustma-ust.

## `gap` haqida

`gap` faqat elementlar **orasiga** joy qo‘yadi, chetlarga emas. Eski usuldagi `margin` bilan hisoblash (oxirgi elementning chetini olib tashlash va hokazo) endi kerak emas.

Mashqda qotib qolgan to‘rt blokni o‘zi qatorga tushadigan qilasiz.
