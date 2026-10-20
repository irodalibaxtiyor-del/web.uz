## Art direction

`srcset` bir rasmning **turli o‘lchamlarini** beradi — kompozitsiya bir xil. Ba’zan esa ekranga qarab **boshqa rasm** kerak: keng bannerda yozuv va mahsulot yonma-yon, telefonda esa bunday banner juda kichrayib, yozuv o‘qilmaydi. Telefonga kvadrat, qirqilgan variant tayyorlanadi. Bu **art direction** deyiladi.

## `<picture>` tuzilishi

```html
<picture>
  <source media="(min-width: 800px)" srcset="banner-keng.jpg">
  <img src="banner-kvadrat.jpg" alt="Kuzgi chegirma: barcha kurslar 20% arzon">
</picture>
```

- Brauzer `<source>` larni yuqoridan pastga tekshiradi va birinchi mos keladiganini oladi.
- Hech biri mos kelmasa, `<img>` dagi `src` ishlatiladi.
- `<img>` majburiy: aynan u ko‘rsatiladi, `alt`, `width`, `height`, `loading` ham unga yoziladi.
- CSS ham `<img>` ga beriladi — `<picture>` o‘zi faqat o‘ram.

## Format bo‘yicha tanlash

```html
<picture>
  <source type="image/avif" srcset="foto.avif">
  <source type="image/webp" srcset="foto.webp">
  <img src="foto.jpg" alt="…" width="1200" height="800">
</picture>
```

AVIF’ni tushunadigan brauzer eng yengil faylni oladi, eskisi esa JPEG’ga qaytadi.

## Ikkalasini birlashtirish

Har bir `<source>` ichida ham `srcset` + `sizes` ishlatsa bo‘ladi: keng banner uchun 1200 va 2400 piksellik, kvadrat uchun 600 va 1200 piksellik fayllar.

## Qachon nima ishlatiladi

| Vazifa | Vosita |
| --- | --- |
| Bir rasm, turli o‘lchamlar | `img` + `srcset` + `sizes` |
| Kompozitsiya ekranga qarab o‘zgaradi | `<picture>` + `<source media>` |
| Yangi formatlar, zaxira bilan | `<picture>` + `<source type>` |

## Alt matn

Ikkala rasm bir xil ma’noni beradi, shuning uchun `alt` bitta. Agar banner ustida matn bo‘lsa (masalan, “-20%”), o‘sha matn `alt` da ham bo‘lishi kerak — ko‘zi ojiz foydalanuvchi chegirma haqida bilishi kerak.

Mashqda telefon uchun kvadrat, keng ekran uchun past va keng banner ko‘rsatasiz.
