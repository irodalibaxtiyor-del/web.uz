## Moslashuvchan dizayn nima?

**Responsive (moslashuvchan) veb-dizayn** — sahifa telefon, planshet va kompyuterda birdek qulay ko‘rinishi. Bugun saytlarga tashriflarning yarmidan ko‘pi telefondan bo‘ladi, shuning uchun bu majburiy.

## 1-qadam: viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Bu teg telefonga sahifani o‘z ekran kengligida ko‘rsatishni aytadi. Busiz telefon sahifani 980 pikselli “kompyuter” sifatida chizib, kichraytirib ko‘rsatadi.

## 2-qadam: moslashuvchan rasmlar

```css
img {
  max-width: 100%;
  height: auto;
}
```

Rasm konteynerdan kengroq bo‘lmaydi va proporsiyasini saqlaydi.

Turli ekranlar uchun turli rasm berish ham mumkin:

```html
<picture>
  <source srcset="banner-katta.jpg" media="(min-width: 800px)">
  <img src="banner-kichik.jpg" alt="Yozgi chegirmalar">
</picture>
```

## 3-qadam: moslashuvchan matn

Shrift o‘lchamini ekran kengligiga bog‘lash mumkin:

```css
h1 {
  font-size: clamp(24px, 5vw, 48px);
}
```

`5vw` — ekran kengligining 5 foizi; `clamp` esa uni 24 va 48 piksel orasida ushlab turadi.

## 4-qadam: media so‘rovlar

**Media query** — ma’lum ekran o‘lchamida ishlaydigan CSS qoidalari:

```css
.ustunlar {
  display: flex;
  gap: 16px;
}

/* Ekran 600 pikseldan tor bo‘lsa — ustunlar bir-birining ostiga */
@media (max-width: 600px) {
  .ustunlar {
    flex-direction: column;
  }
  h1 {
    font-size: 24px;
  }
}
```

## Avval mobil (mobile-first)

Ko‘p dizaynerlar avval kichik ekran uchun uslub yozib, keyin `min-width` bilan katta ekranlarga qo‘shimcha qiladi:

```css
.ustunlar {
  display: block;
}

@media (min-width: 768px) {
  .ustunlar {
    display: flex;
  }
}
```

## Qanday tekshirish mumkin?

Brauzerda F12 → **qurilma rejimi** (Ctrl + Shift + M) — sahifani turli telefon o‘lchamlarida ko‘rish mumkin. Bu darsning mashqida ham server sahifangizni telefon o‘lchamida ochib tekshiradi.

## Xulosa

- `viewport` meta tegi — moslashuvchanlikning birinchi sharti.
- Rasmlar `max-width: 100%`, matn `clamp()` bilan moslashadi.
- `@media` so‘rovlari ekran o‘lchamiga qarab boshqa uslub beradi.
