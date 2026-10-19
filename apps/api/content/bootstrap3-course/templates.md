## Shablondan boshlash

Bootstrap bilan sayt odatda **asosiy shablondan** boshlanadi: doctype, viewport, CSS va skriptlar allaqachon joyida. Siz faqat kontent va maketni qo‘shasiz.

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sayt nomi</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- 1. Navbar -->
  <!-- 2. Bosh qism (jumbotron yoki banner) -->
  <!-- 3. Kontent bo‘limlari -->
  <!-- 4. Footer -->

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</body>
</html>
```

E’tibor bering: o‘zingizning `style.css` faylingiz Bootstrap’dan **keyin** ulanadi — shunda sizning qoidalaringiz Bootstrap’nikini bosib keta oladi.

## Bootstrap uslubini o‘zgartirish

Bootstrap faylining o‘zini tahrirlamang. Uning o‘rniga o‘z faylingizda shu klassni qayta yozing:

```css
/* style.css */
.navbar-inverse {
  background-color: #0e1133;
  border-color: #0e1133;
}
.jumbotron {
  background-color: #0071dc;
  color: #fff;
}
.btn-primary {
  background-color: #fec400;
  border-color: #e0ad00;
  color: #0e1133;
}
```

Agar qoida ishlamasa, odatda sabab — **spesifiklik**: Bootstrap’dagi selektor kuchliroq. Masalan, navbar havolasi rangi `.navbar-inverse .navbar-nav > li > a` bilan yozilgan, shuning uchun siz ham shunday kuchli selektor yozasiz.

Har bir komponentni noldan bezamang — o‘z ranglaringizni bir necha joyda o‘zgartirish ko‘pincha yetarli.

## Sahifani rejalashtirish

Kod yozishdan oldin qog‘ozda (yoki boshingizda) bo‘limlarni belgilang:

| Bo‘lim       | Bootstrap komponenti                       |
| ------------ | ------------------------------------------ |
| Menyu        | `.navbar` (mobil uchun `.navbar-toggle`)   |
| Bosh qism    | `.jumbotron` yoki to‘liq kenglikdagi banner |
| Xizmatlar    | `.row` + `.col-sm-4` × 3                    |
| Portfolio    | `.thumbnail` lar setkada                    |
| Narxlar      | `.panel` lar                               |
| Aloqa        | `.form-horizontal` yoki oddiy forma         |
| Footer       | `.container-fluid` + `.text-center`         |

## Bir sahifali sayt (one-page)

Ko‘p shablonlar bitta uzun sahifadan iborat. Navbar havolalari bo‘limlarga olib boradi (`href="#aloqa"`), scrollspy esa joriy bo‘limni ko‘rsatadi. Bo‘limlar orasini ochiq qilish uchun ularga katta ichki bo‘shliq bering:

```css
section {
  padding: 60px 0;
}
.bg-och {
  background-color: #f5faff;
}
```

## Keyingi uch dars

Keyingi darslarda uchta to‘liq sahifa yig‘amiz:

1. **Shaxsiy sahifa** — rezyume uslubidagi bir sahifali sayt;
2. **Kompaniya sayti** — xizmatlar, narxlar va aloqa formasi;
3. **Musiqa guruhi sayti** — karusel, konsertlar jadvali va modal.

Har birida o‘rgangan komponentlaringizni birlashtirasiz.

## Xulosa

- Asosiy shablon: doctype, viewport, Bootstrap CSS, o‘z CSS’ingiz, oxirida jQuery va Bootstrap JS.
- O‘z uslublaringizni Bootstrap’dan keyin ulangan faylda yozing; spesifiklikka e’tibor bering.
- Sahifani bo‘limlarga bo‘lib, har biriga mos komponent tanlang.
