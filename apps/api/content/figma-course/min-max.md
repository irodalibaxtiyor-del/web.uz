## Cheklangan o‘lcham

Yangi Figma’da Auto Layout elementiga **Min width** va **Max width** berish mumkin: “karta konteynerni to‘ldirsin, lekin 280 dan tor va 480 dan keng bo‘lmasin”. CSS’da bu uchlik:

```css
.karta {
  width: 100%;
  min-width: 280px;
  max-width: 480px;
}
```

| Ekran  | Natija                       |
| ------ | ---------------------------- |
| 1000px | 480px (max)                  |
| 360px  | 360px (to‘ldiradi)           |
| 240px  | 280px (min — chiqib ketadi!) |

## `min-width` ehtiyotkorlik bilan

`min-width` ota konteynerdan katta bo‘lsa, element chiqib ketadi va gorizontal aylanish paydo bo‘ladi. Maketda “Min W 280” ko‘rsangiz, 320px ekranda nima bo‘lishini o‘ylab ko‘ring: ko‘p hollarda `min-width: min(280px, 100%)` xavfsizroq.

## Matnni qisqartirish

Figma’da matn qatlami uchun “Truncate text” sozlamasi bor: matn sig‘masa, oxiri “…” bilan kesiladi.

Bir qator:

```css
.nomi {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

Uch shart ham kerak: qatorga sinmaslik, ortiqchani yashirish va uch nuqta. Element blok bo‘lishi va kengligi cheklangan bo‘lishi kerak (flex ichida — `min-width: 0`).

Bir necha qator:

```css
.tavsif {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

`line-clamp` — ko‘p qatorli kesish, barcha zamonaviy brauzerlarda ishlaydi.

## Qisqartirish va accessibility

Kesilgan matnning to‘liq varianti foydalanuvchiga qandaydir yo‘l bilan yetib borishi kerak: sarlavha havola bo‘lsa — ochilgan sahifada; yoki `title` atributi (sichqoncha uchun). Muhim ma’lumotni (narx, sana) kesmang.

## Balandlik cheklovlari

Min/max height ham shunday: `min-height` — bo‘sh holatda ham karta bir xil balandlikda; `max-height` + `overflow-y: auto` — uzun ro‘yxat ichida aylanadi.

Mashqda kartaga min/max kenglik va bir qatorli sarlavha berasiz.
