## Sahifa qidiruvda va ulashilganda

Portfolio tayyor. Endi uni odamlar topishi va havolasi chiroyli ulashilishi kerak. Buning ko‘p qismi `<head>` dagi bir necha qatorga bog‘liq.

## Asosiylar

```html
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Aziza Karimova — frontend dasturchi</title>
    <meta
      name="description"
      content="Aziza Karimova — Toshkentdagi frontend dasturchi. Kichik bizneslar uchun tez va qulay saytlar: ishlar, tajriba va aloqa."
    />
    <link rel="canonical" href="https://aziza.example.uz/" />
  </head>
</html>
```

| Teg           | Nima uchun                                                      |
| ------------- | --------------------------------------------------------------- |
| `lang="uz"`   | Ekran o‘quvchi to‘g‘ri talaffuz qiladi, qidiruv tili aniqlanadi |
| `<title>`     | Brauzer tabida va qidiruv natijasi sarlavhasida                 |
| `description` | Qidiruv natijasidagi qisqa matn (120–160 belgi)                 |
| `canonical`   | Sahifaning “asosiy” manzili — dublikatlar bo‘lsa                |

## Open Graph

Havola Telegram, Facebook yoki LinkedIn’da ulashilganda chiqadigan kartochka Open Graph teglaridan olinadi:

```html
<meta property="og:title" content="Aziza Karimova — frontend dasturchi" />
<meta property="og:description" content="Kichik bizneslar uchun tez va qulay saytlar." />
<meta property="og:image" content="https://aziza.example.uz/og.png" />
<meta property="og:type" content="website" />
```

`og:image` — 1200 × 630 o‘lchamli rasm, to‘liq (https bilan) manzil. Unda ismingiz va bir jumla bo‘lsa, ulashilgan havola ancha jozibali ko‘rinadi.

## Favicon

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

Brauzer tabidagi kichik belgi. Bosh harflaringiz yoki oddiy shakl yetarli. SVG favicon har qanday o‘lchamda tiniq.

## Strukturaviy ma’lumot (ixtiyoriy)

Qidiruv tizimlariga “bu sahifa — shaxs haqida” deb aytish mumkin:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aziza Karimova",
    "jobTitle": "Frontend dasturchi",
    "url": "https://aziza.example.uz/"
  }
</script>
```

## Tekshirish

- Ulashish kartochkasini Telegram’da o‘zingizga havola yuborib ko‘ring.
- Google Search Console’ga saytni qo‘shib, indekslanganini kuzating.
- Sarlavha va tavsif har bir sahifada (case study sahifalari ham) o‘ziga xos bo‘lsin.

Mashqda portfolio `<head>` qismini SEO va ulashish uchun tayyorlaysiz.
