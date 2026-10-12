## Veb-shriftlar: `@font-face`

Foydalanuvchi kompyuterida bo‘lmagan shriftni ishlatish uchun shrift faylini sayt bilan birga yuborish mumkin. Buning uchun `@font-face` qoidasi yoziladi:

```css
@font-face {
  font-family: "Mening Shriftim";
  src: url("fonts/mening-shriftim.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Mening Shriftim", Arial, sans-serif;
}
```

| Qism           | Vazifasi                                     |
| -------------- | -------------------------------------------- |
| `font-family`  | Shriftga beriladigan nom (o‘zingiz tanlaysiz) |
| `src`          | Fayl manzili va formati                      |
| `font-weight`  | Bu fayl qaysi qalinlik uchun                 |
| `font-style`   | Bu fayl oddiy yoki kursiv uchun              |
| `font-display` | Shrift yuklanguncha matn qanday ko‘rsatiladi |

## Formatlar

Bugun faqat **WOFF2** yetarli: u siqilgan va barcha zamonaviy brauzerlarda ishlaydi. Eski TTF/EOT formatlari kerak emas.

## Qalinliklar uchun alohida fayllar

Har bir qalinlik va uslub — alohida fayl va alohida `@font-face`. Nom bir xil qoladi:

```css
@font-face {
  font-family: "Mening Shriftim";
  src: url("fonts/regular.woff2") format("woff2");
  font-weight: 400;
}

@font-face {
  font-family: "Mening Shriftim";
  src: url("fonts/bold.woff2") format("woff2");
  font-weight: 700;
}
```

Endi `font-weight: 700` bo‘lgan matn avtomatik `bold.woff2` ni oladi.

## `font-display: swap`

Shrift yuklanayotganda matn ko‘rinmay turishi mumkin. `swap` qiymati avval zaxira shriftda ko‘rsatadi, shrift kelgach almashtiradi. Foydalanuvchi bo‘sh sahifaga qarab o‘tirmaydi.

## `local()` — kompyuterdagi shrift

`src` da avval kompyuterda bor shriftni sinab ko‘rish mumkin:

```css
@font-face {
  font-family: "Sarlavha";
  src: local("Georgia"), url("fonts/georgia.woff2") format("woff2");
}
```

## Tayyor shrift xizmatlari

Google Fonts kabi xizmatlar `<link>` orqali tayyor `@font-face` qoidalarini beradi. Qulay, lekin har bir tashrifda tashqi serverga so‘rov ketadi. Ko‘p loyihalar shrift fayllarini o‘z serverida saqlaydi (self-hosting) — tezroq va maxfiylik uchun yaxshiroq.

> **Litsenziya:** har qanday shriftni saytga qo‘yib bo‘lmaydi. Shriftning litsenziyasi veb uchun ruxsat berishini tekshiring. Ochiq litsenziyali (masalan, SIL Open Font License) shriftlar bepul ishlatiladi.

> **WEBDIZAYN.UZ sandbox’ida** tashqi fayllar bloklangan. Mashqlarda `local()` va zaxira shriftlardan foydalanamiz.

## Xulosa

- `@font-face` shriftga nom beradi va faylini ko‘rsatadi.
- WOFF2 formati yetarli; har qalinlik — alohida `@font-face`.
- `font-display: swap` matnni darhol ko‘rsatadi.
- Shriftning litsenziyasini tekshiring.
