## Bootstrap’ni sahifaga ulash

Bootstrap’dan foydalanishning ikki yo‘li bor:

1. **CDN orqali** — fayllar tashqi serverdan (Content Delivery Network) yuklanadi. Hech narsa yuklab olish shart emas.
2. **Yuklab olib** — fayllarni loyihangiz papkasiga qo‘yasiz (masalan, `npm install bootstrap@3.4.1`).

Darslarda CDN ishlatamiz. Bootstrap 3 uchun uchta fayl kerak:

```html
<!-- <head> ichida: Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

<!-- </body> dan oldin: avval jQuery, keyin Bootstrap JS -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
```

**Tartib muhim:** Bootstrap’ning JavaScript plaginlari jQuery’ga tayanadi, shuning uchun jQuery **birinchi** ulanadi. Aks holda konsolda `Bootstrap's JavaScript requires jQuery` xatosi chiqadi.

## Birinchi Bootstrap sahifa

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bootstrap sahifa</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
</head>
<body>
  <div class="container">
    <h1>Mening birinchi Bootstrap sahifam</h1>
    <p>Bu matn markazdagi konteyner ichida.</p>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</body>
</html>
```

## Uchta muhim qism

**1. HTML5 doctype.** Bootstrap zamonaviy HTML va CSS xususiyatlaridan foydalanadi, shuning uchun sahifa `<!DOCTYPE html>` bilan boshlanishi kerak.

**2. Viewport meta tegi.** Bootstrap 3 — **mobile-first**: uslublar avval telefon uchun yozilgan. Telefon brauzeri sahifani to‘g‘ri o‘lchamda ko‘rsatishi uchun:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- `width=device-width` — sahifa kengligi qurilma ekrani kengligiga teng;
- `initial-scale=1` — sahifa ochilganda kattalashtirilmaydi.

Bu teg bo‘lmasa, telefon sahifani “kompyuter kengligida” chizib, kichraytirib ko‘rsatadi — setka moslashmaydi.

**3. Konteyner.** Bootstrap’da kontent konteyner ichiga joylanadi. Ikki turi bor:

| Klass              | Ko‘rinishi                                                        |
| ------------------ | ----------------------------------------------------------------- |
| `.container`       | Belgilangan kenglik (750 / 970 / 1170px), markazda, ikki chetda bo‘sh joy |
| `.container-fluid` | Ekranning to‘liq kengligi                                         |

```html
<div class="container">...</div>
<div class="container-fluid">...</div>
```

`.container` ning kengligi ekranga qarab o‘zgaradi:

| Ekran kengligi | `.container` kengligi |
| -------------- | --------------------- |
| < 768px        | 100% (avtomatik)      |
| ≥ 768px        | 750px                 |
| ≥ 992px        | 970px                 |
| ≥ 1200px       | 1170px                |

## Bootstrap ulanganini qanday bilish mumkin?

Bootstrap ulanganda sahifa shrifti o‘zgaradi (Helvetica/Arial), `body` chetidagi bo‘sh joy (margin) yo‘qoladi. Tekshirish uchun oddiy tugma qo‘shing:

```html
<button type="button" class="btn btn-primary">Sinov</button>
```

Agar tugma ko‘k va yumaloq bo‘lsa — CSS ulandi. Ko‘k bo‘lmasa, `<link>` dagi manzil yoki `rel="stylesheet"` ni tekshiring.

## Xulosa

- CSS — `<head>` da, jQuery va `bootstrap.min.js` — `</body>` dan oldin, shu tartibda.
- `<!DOCTYPE html>` va viewport meta tegi shart.
- Kontent `.container` (belgilangan kenglik) yoki `.container-fluid` (to‘liq kenglik) ichida.
