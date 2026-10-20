## Uch xil o‘lcham rejimi

Auto Layout ichidagi har bir element kenglik va balandlik uchun uch rejimdan birini oladi. Bu Figma’dan CSS’ga o‘tishdagi eng muhim jadval.

| Figma              | Ma’nosi                | CSS (flex qatorida)              |
| ------------------ | ---------------------- | -------------------------------- |
| **Fixed** 120      | Aniq o‘lcham           | `width: 120px; flex-shrink: 0`   |
| **Hug contents**   | Kontentga qarab        | kenglik berilmaydi; `flex: none` |
| **Fill container** | Qolgan joyni egallaydi | `flex: 1; min-width: 0`          |

## Misol: asboblar paneli

```
Toolbar (Horizontal, Gap 16, Align center)
├── Logo — W Fixed 120
├── Search — W Fill container
└── Button — W Hug contents
```

```css
.logo {
  width: 120px;
  flex-shrink: 0;
}
.qidiruv {
  flex: 1;
  min-width: 0;
}
.tugma {
  flex: none;
  white-space: nowrap;
}
```

Ekran kengaysa — faqat qidiruv kengayadi. Torayganda ham logo va tugma o‘zgarmaydi, faqat qidiruv kichrayadi.

## `flex-shrink: 0` nega kerak

Flexbox’da standart holda **hamma** element joy yetmaganda qisqaradi. Figma’dagi “Fixed” esa hech qachon qisqarmaydi. Shuning uchun `width` yetarli emas — `flex-shrink: 0` ham kerak.

## `min-width: 0` nega kerak

Flex elementining minimal kengligi standart holda uning kontentiga teng (`min-width: auto`). Uzun matnli “Fill” element shu sababli kerakli darajada torayolmay, qatorni toshirib yuborishi mumkin. `min-width: 0` unga to‘liq qisqarishga ruxsat beradi.

## Balandlik ham shunday

Vertikal Auto Layout’da xuddi shu rejimlar balandlikka tegishli: “Fill” — `flex: 1` ustun ichida; “Hug” — balandlik berilmaydi. Grid’da “Fill” ko‘pincha `1fr` ga to‘g‘ri keladi.

## Min va max

Yangi Figma’da Fill yoki Hug elementga **Min width / Max width** ham berish mumkin: “qidiruv to‘ldirsin, lekin 480 dan oshmasin”. CSS’da: `flex: 1; max-width: 480px`.

## Hug va matn

Hug tugmada matn uzaysa, tugma kengayadi. Lekin juda tor joyda matn qatorga sinib ketmasligi uchun `white-space: nowrap` yozing — aks holda “Yangi vazifa qo‘shish” ikki qatorga bo‘linib, tugma balandligi o‘zgaradi.

Mashqda asboblar panelidagi uch elementga to‘g‘ri o‘lcham rejimini berasiz.
