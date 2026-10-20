## O‘z shriftingizni ulash

Tizim shriftlari yetmasa, sahifaga maxsus shrift fayli ulanadi. Buning uchun `@font-face` qoidasi ishlatiladi:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

- `font-family` — siz bergan nom, keyin shu nom bilan ishlatasiz;
- `src` — fayl manzili. **WOFF2** — eng yengil va hozir yagona kerakli format;
- `font-weight: 100 900` — _variable font_: bitta faylda barcha qalinliklar;
- `font-display` — fayl yuklanayotganda nima bo‘lishi.

## `font-display`

| Qiymat     | Xatti-harakat                                     |
| ---------- | ------------------------------------------------- |
| `swap`     | Matn darhol zaxira shriftda, yuklangach almashadi |
| `optional` | Tez yuklansa ishlatiladi, aks holda zaxira qoladi |
| `block`    | Bir necha soniya matn ko‘rinmaydi (yomon)         |

Ko‘p holatda `swap`: foydalanuvchi matnni darhol o‘qiy boshlaydi.

## `local()`

`src: local("Georgia")` — foydalanuvchi kompyuterida o‘rnatilgan shriftni nomi bilan oladi, hech narsa yuklanmaydi. Platformadagi mashqlarda tashqi fayllar bloklangani uchun shu usuldan foydalanamiz.

## Google Fonts va boshqa xizmatlar

Tashqi xizmatdan shrift ulash oson, lekin:

- foydalanuvchi IP manzili begona serverga ketadi (maxfiylik);
- qo‘shimcha DNS so‘rovi va ulanish — sahifa sekinlashadi.

Shu sabab ko‘p loyihalar shrift faylini o‘z serverida saqlaydi (_self-hosting_). Next.js kabi freymvorklar buni avtomatik qiladi.

## Tezlik uchun

- Faqat kerakli qalinliklar va harf to‘plamlarini (_subset_: lotin, kirill) ulang.
- Muhim shriftni oldindan yuklash: `<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>`.
- Zaxira shriftni o‘lcham jihatdan yaqin tanlang — almashganda matn “sakramaydi”. `size-adjust` xususiyati bilan aniq moslash ham mumkin.

## Litsenziya

Har bir shriftning litsenziyasi bor. Bepul shriftlar (SIL Open Font License) saytda erkin ishlatiladi; pullik shriftni boshqa saytdan “olib” qo‘yish mumkin emas.

Mashqda `@font-face` bilan o‘z nomingizdagi shriftni e’lon qilib, uni zaxira bilan ishlatasiz.
