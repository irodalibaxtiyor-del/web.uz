## Viewport nima?

**Viewport** — brauzerning sahifa ko‘rinadigan qismi. Kompyuterda bu oyna kengligi. Telefonda esa qiziqroq: viewport meta tegi bo‘lmasa, mobil brauzer sahifani taxminan 980 piksellik “virtual” ekranda chizadi va keyin uni kichraytirib ko‘rsatadi. Natijada matn mayda, tugmalarni bosish qiyin.

## To‘g‘ri meta teg

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- `width=device-width` — viewport kengligi qurilma kengligiga teng (masalan, 390 CSS piksel).
- `initial-scale=1` — sahifa kattalashtirilmagan holda ochiladi.

Bu teg har bir moslashuvchan sahifaning `<head>` qismida bo‘lishi shart.

## Nima qilmaslik kerak

```html
<!-- Yomon: foydalanuvchi sahifani kattalashtira olmaydi -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

Ko‘zi yaxshi ko‘rmaydigan odamlar barmoq bilan kattalashtirishga muhtoj. `user-scalable=no` va `maximum-scale=1` foydalanish imkoniyatini (accessibility) buzadi.

## CSS piksel va qurilma pikseli

Telefon ekranida jismoniy nuqtalar CSS piksellardan ko‘p. Masalan, ekran kengligi 1170 jismoniy nuqta, lekin CSS uchun u 390 piksel. Nisbat **devicePixelRatio** (DPR) deyiladi: bu misolda 3.

| Qurilma | CSS kenglik | DPR |
| --- | --- | --- |
| Oddiy noutbuk | 1366 | 1 |
| Zamonaviy telefon | 360–430 | 2–3 |
| Retina monitor | 1440 | 2 |

Amaliy xulosa: CSS’da doim **CSS piksellarda** o‘ylang. DPR faqat rasm sifatiga ta’sir qiladi (bu haqda “srcset” darsida).

## Bosish maydoni

Barmoq sichqoncha kursoridan ancha yo‘g‘on. Tugma va havolalarning bosish maydoni kamida **44×44** CSS piksel bo‘lsin:

```css
.tugma {
  min-height: 44px;
  padding-inline: 20px;
}
```

## Qanday sinab ko‘rish

Brauzerda **F12** → qurilma rejimi (Device toolbar, `Ctrl+Shift+M`). U yerda iPhone, Galaxy kabi o‘lchamlarni tanlash, ekranni burish va sekin internetni sinash mumkin. Lekin u faqat taqlid: imkon bo‘lsa, sahifani haqiqiy telefonda ham oching.

Mashqda viewport tegini tuzatasiz, rasmni ekranga sig‘diradigan qilasiz va tugmaga yetarli bosish maydoni berasiz.
