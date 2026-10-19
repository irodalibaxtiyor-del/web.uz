## Kichik planshet (sm)

`.col-sm-*` 576px dan ishlaydi. `.col-*` bilan birga — telefon va kichik planshetda turli nisbat:

```html
<div class="row g-2">
  <div class="col-6 col-sm-3"><div class="p-3 border text-center">Profil</div></div>
  <div class="col-6 col-sm-3"><div class="p-3 border text-center">Kurslar</div></div>
  <div class="col-6 col-sm-3"><div class="p-3 border text-center">Xabarlar</div></div>
  <div class="col-6 col-sm-3"><div class="p-3 border text-center">Sozlamalar</div></div>
</div>
```

| Ekran   | Ishlaydigan klass | Natija            |
| ------- | ----------------- | ----------------- |
| < 576px | `col-6`           | 2 × 2             |
| ≥ 576px | `col-sm-3`        | bir qatorda 4 ta  |

## `row-cols` bilan qisqaroq

```html
<div class="row row-cols-2 row-cols-sm-4 g-2">
  <div class="col">…</div>
  <div class="col">…</div>
  <div class="col">…</div>
  <div class="col">…</div>
</div>
```

Natija bir xil, lekin klasslar faqat qatorda.

## Offset va tartib ham sinfga bog‘liq

```html
<div class="row">
  <div class="col-10 offset-1 col-sm-8 offset-sm-2">Markazdagi forma</div>
</div>
<div class="row">
  <div class="col-sm-8 order-sm-last">Kontent</div>
  <div class="col-sm-4">Yon panel</div>
</div>
```

## Display bilan birga

```html
<div class="d-sm-none alert alert-info">Faqat telefonda: kattaroq ekranda ko‘proq ma’lumot bor.</div>
<div class="d-none d-sm-block">576px dan kattada ko‘rinadi</div>
```

## Xulosa

- `col-*` + `col-sm-*` — telefon va kichik planshet uchun turli nisbat.
- `row-cols-2 row-cols-sm-4` — qisqa yozuv.
- Offset, order va display ham `sm` bilan ishlaydi.
