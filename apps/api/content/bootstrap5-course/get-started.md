## Bootstrap 5 ni ulash

Bootstrap 5 uchun ikki fayl kerak — jQuery endi yo‘q:

```html
<!-- <head> ichida -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- </body> dan oldin -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

| Fayl                      | Vazifasi                                                     |
| ------------------------- | ------------------------------------------------------------ |
| `bootstrap.min.css`       | Barcha uslublar                                              |
| `bootstrap.bundle.min.js` | Plaginlar **va** Popper (dropdown, tooltip, popover joylashuvi) |

Popper’ni alohida ulamoqchi bo‘lsangiz, `bootstrap.min.js` (bundle emas) ishlatiladi va Popper undan **oldin** ulanadi. Odatda bundle qulayroq.

## Asosiy shablon

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bootstrap 5</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-4">
    <h1>Salom, Bootstrap 5!</h1>
    <p>Bu birinchi sahifa.</p>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

Uchta majburiy narsa:

1. **`<!DOCTYPE html>`** — HTML5 rejimi.
2. **`<meta name="viewport" content="width=device-width, initial-scale=1">`** — telefon sahifani qurilma kengligida ko‘rsatadi; aks holda setka moslashmaydi.
3. **Konteyner** — `.container` yoki `.container-fluid`.

## `defer` va joylashuv

Skriptni `</body>` dan oldin yozish o‘rniga `<head>` ga `defer` bilan qo‘yish ham mumkin — skript HTML o‘qib bo‘lingandan keyin bajariladi:

```html
<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

## SRI (integrity)

Bootstrap hujjatlaridagi havolalarda ko‘pincha `integrity` va `crossorigin` atributlari bo‘ladi:

```html
<link href="…/bootstrap.min.css" rel="stylesheet" integrity="sha384-…" crossorigin="anonymous">
```

`integrity` — fayl xesh qiymati. Agar CDN’dagi fayl o‘zgartirilgan (buzilgan) bo‘lsa, brauzer uni yuklamaydi. Bu tashqi fayllar uchun yaxshi xavfsizlik amaliyoti.

## npm orqali

```bash
npm install bootstrap@5.3.8
```

```js
// Vite yoki Webpack loyihasida
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
```

## Tekshirish

```html
<button type="button" class="btn btn-primary">Sinov</button>
```

Ko‘k, yumaloq tugma — CSS ulandi. Konsolda `bootstrap` obyekti mavjudligi (`typeof bootstrap` → `"object"`) — JS ulandi.

## Xulosa

- CSS `<head>` da, `bootstrap.bundle.min.js` `</body>` dan oldin (yoki `defer`).
- jQuery kerak emas; Popper bundle ichida.
- Doctype, viewport va konteyner — har bir sahifada.
