## Bitta rasm — bir nechta fayl

Telefon 400px kenglikdagi rasmni ko‘rsatadi, lekin unga 2000 piksellik fayl yuklansa, internet trafigi va vaqt behuda ketadi. `srcset` bilan brauzerga bir nechta variant taklif qilinadi, u o‘ziga moslini tanlaydi.

## Kenglik deskriptori: `w`

```html
<img
  src="registon-400.jpg"
  srcset="registon-400.jpg 400w, registon-1200.jpg 1200w"
  sizes="(min-width: 800px) 50vw, 100vw"
  width="1200" height="750"
  alt="Registon maydoni">
```

- `400w` — “bu fayl 400 piksel kenglikda”;
- `sizes` — “rasm sahifada qancha joy egallaydi”: 800px dan keng ekranda viewport’ning yarmi, aks holda to‘liq kenglik;
- `src` — `srcset` ni tushunmaydigan brauzer uchun zaxira.

Brauzer `sizes` dan kerakli kenglikni, ekranning piksel zichligini (DPR) va internet sharoitini hisobga olib faylni tanlaydi. Bu **maslahat**, buyruq emas: masalan, katta fayl allaqachon keshda bo‘lsa, brauzer uni ishlatishi mumkin.

`sizes` berilmasa, `100vw` deb olinadi — keng ekranda yarim joy egallaydigan rasm uchun ortiqcha katta fayl yuklanadi.

## Zichlik deskriptori: `x`

Faqat kenglik o‘zgarmaydigan rasmlar (logotip, ikonka) uchun:

```html
<img src="logo.png" srcset="logo.png 1x, logo@2x.png 2x" width="120" height="40" alt="WEBDIZAYN.UZ">
```

Retina ekran `2x` faylni oladi.

## Kechiktirib yuklash

```html
<img src="…" loading="lazy" alt="…">
```

Brauzer rasmni foydalanuvchi unga yaqinlashganda yuklaydi. Lekin sahifaning eng yuqorisidagi asosiy rasm (*hero*) uchun `loading="lazy"` yozmang — u darhol kerak.

## Formatlar

| Format | Qachon |
| --- | --- |
| JPEG | Fotosuratlar |
| PNG | Shaffoflik kerak bo‘lgan rasm, skrinshot |
| WebP / AVIF | Zamonaviy, 25–50% yengilroq |
| SVG | Logotip, ikonka, diagramma — har qanday o‘lchamda tiniq |

Format bo‘yicha tanlash `<picture>` bilan qilinadi (keyingi dars).

## Tekshirish

DevTools → **Network** panelida “Img” filtrini tanlang va oynani kichraytirib sahifani yangilang — qaysi fayl yuklanganini ko‘rasiz. Elementlar panelida `img` ni tanlab, konsolda `$0.currentSrc` deb yozsangiz, tanlangan fayl manzili chiqadi.

Mashqda rasmga `srcset`, `sizes`, o‘lchamlar va kechiktirib yuklashni qo‘shasiz.
