## Bootstrap 4 ni ulash

CDN orqali ulash uchun to‘rtta fayl tilga olinadi:

```html
<!-- <head> ichida -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">

<!-- </body> dan oldin, shu tartibda -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
```

| Fayl                       | Nima uchun                                                        |
| -------------------------- | ----------------------------------------------------------------- |
| `bootstrap.min.css`        | Barcha uslublar                                                   |
| `jquery.slim.min.js`       | Bootstrap 4 plaginlari jQuery’ga tayanadi. “Slim” — AJAX va animatsiya modullarisiz yengil versiya |
| `bootstrap.bundle.min.js`  | Bootstrap plaginlari **va** Popper (dropdown, tooltip, popover joylashuvi uchun) |

Ko‘p misollarda Popper alohida ham ulanadi (`popper.js@1.16.1`) va `bootstrap.min.js` ishlatiladi. `bootstrap.bundle.min.js` ikkalasini birlashtiradi — bittasini tanlang, ikkalasini birga emas.

**Tartib:** avval jQuery, keyin Bootstrap.

## Asosiy shablon

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bootstrap 4</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
</head>
<body>
  <div class="container">
    <h1>Mening birinchi Bootstrap 4 sahifam</h1>
    <p>Bu matn konteyner ichida.</p>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

- `<!DOCTYPE html>` — HTML5 rejimi;
- `<meta name="viewport" …>` — telefon sahifani qurilma kengligida ko‘rsatadi (mobile-first uchun shart);
- `.container` — kontent uchun markazdagi konteyner.

## Reboot

Bootstrap 4 ulanganda **Reboot** uslublari ishlaydi: brauzerlar orasidagi farqlar tekislanadi, `box-sizing: border-box` hamma elementga beriladi, `body` margin’i olib tashlanadi, shrift tizim shriftiga (`-apple-system`, `Segoe UI`, `Roboto`…) almashadi va o‘lchami **16px** bo‘ladi.

## Yuklab olish (ixtiyoriy)

Loyiha uchun fayllarni npm orqali ham o‘rnatish mumkin:

```bash
npm install bootstrap@4.6.2 jquery@3.7.1
```

Keyin fayllar `node_modules/bootstrap/dist/` dan ulanadi yoki bundler (Vite, Webpack) orqali import qilinadi.

## Tekshirish

Bootstrap ulanganini tekshirishning oson yo‘li — tugma:

```html
<button type="button" class="btn btn-success">Sinov</button>
```

Yashil, yumaloq tugma chiqsa — CSS ishlayapti. JavaScript ishlashini konsoldagi xatolar yo‘qligidan bilasiz (`Bootstrap's JavaScript requires jQuery` xatosi tartib noto‘g‘ri ekanini bildiradi).

## Xulosa

- CSS `<head>` da; jQuery (slim) va `bootstrap.bundle.min.js` `</body>` dan oldin, shu tartibda.
- `bundle` ichida Popper bor.
- Viewport meta tegi va `.container` — har bir sahifada.
