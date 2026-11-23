## Juda katta ekran (xxl)

Bootstrap 5 da qo‘shilgan oltinchi sinf — **`xxl`**: 1400px va undan keng ekran (katta monitorlar, 1440p va 4K). `.container` bu yerda **1320px**.

```html
<div class="row g-4">
  <div class="col-xl-6 col-xxl-3">Kurs</div>
  <div class="col-xl-6 col-xxl-3">Kurs</div>
  <div class="col-xl-6 col-xxl-3">Kurs</div>
  <div class="col-xl-6 col-xxl-3">Kurs</div>
</div>
```

| Ekran         | Bir qatorda |
| ------------- | ----------- |
| < 1200px      | 1           |
| 1200–1399px   | 2           |
| ≥ 1400px      | 4           |

## `xxl` bilan ishlaydigan boshqa klasslar

Barcha moslashuvchan klasslarda `xxl` varianti bor:

```html
<div class="container-xxl">1400px gacha 100%, keyin 1320px</div>
<nav class="navbar navbar-expand-xxl">…</nav>
<div class="d-none d-xxl-block">Faqat juda katta ekranda</div>
<div class="row row-cols-xxl-6">…</div>
<div class="offset-xxl-1 col-xxl-10">…</div>
<p class="text-xxl-center">…</p>
```

## Qachon kerak?

Ko‘p saytlar uchun `xl` yetarli. `xxl` foydali bo‘ladigan holatlar:

- katta galereyalar va kataloglar — keng ekranda ko‘proq kartochka;
- dashboard va admin panellar;
- katta monitorlarda chetlardagi bo‘sh joyni kamaytirish.

Matnli sahifalarda ustunlar sonini ko‘paytirmang — o‘qish qulayligi uchun matn ustuni baribir tor bo‘lishi kerak.

## Barcha sinflar birga

```html
<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1">…</div>
```

Bu juda kamdan-kam kerak. Odatda 2–3 ta sinf yetarli; yoki `row-cols-*` bilan qatorga yozing.

```tekshir
`col-xxl-3` qaysi ekranda chorak kenglik bo‘ladi?
+ 1400px va undan keng
- 1200px va undan keng
- har qanday ekranda
> Kichikroq ekranlarda ustun butun kenglikni egallaydi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="row g-2">
    <div class="col-xxl-3 col-md-6"><div class="p-2 border bg-body-tertiary">xxl-3 md-6</div></div>
    <div class="col-xxl-3 col-md-6"><div class="p-2 border bg-body-tertiary">xxl-3 md-6</div></div>
    <div class="col-xxl-6"><div class="p-2 border bg-body-tertiary">xxl-6</div></div>
  </div>
</div>
```

## Xulosa

- `xxl` — ≥ 1400px, `.container` 1320px.
- `col-xxl-*`, `container-xxl`, `navbar-expand-xxl`, `d-xxl-*`, `row-cols-xxl-*`.
- Asosan katalog va dashboardlar uchun.
