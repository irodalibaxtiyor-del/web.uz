## Katta ekran (xl)

`.col-xl-*` 1200px dan, `.container` — 1140px.

```html
<div class="row g-4">
  <div class="col-lg-6 col-xl-3">Kurs</div>
  <div class="col-lg-6 col-xl-3">Kurs</div>
  <div class="col-lg-6 col-xl-3">Kurs</div>
  <div class="col-lg-6 col-xl-3">Kurs</div>
</div>
```

| Ekran        | Bir qatorda |
| ------------ | ----------- |
| < 992px      | 1           |
| 992–1199px   | 2           |
| ≥ 1200px     | 4           |

## Dashboard maketi

```html
<div class="container-fluid">
  <div class="row">
    <nav class="col-md-3 col-xl-2 bg-body-tertiary">Menyu</nav>
    <main class="col-md-9 col-xl-10">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
        <div class="col"><div class="card card-body">12 kurs</div></div>
        <div class="col"><div class="card card-body">340 talaba</div></div>
        <div class="col"><div class="card card-body">58 topshiriq</div></div>
        <div class="col"><div class="card card-body">4.8 reyting</div></div>
      </div>
    </main>
  </div>
</div>
```

- `xl` da menyu torroq (2/12) — kontentga ko‘proq joy;
- statistika kartalari `xl` da bir qatorda to‘rtta.

## Konteyner xl dan katta bo‘lmasin

`.container` 1200–1399px ekranda 1140px. Admin panel kabi keng interfeyslar uchun `.container-fluid`, matnli sahifalar uchun `.container` qulay.

```tekshir
`xl` sinfi qaysi kenglikdan boshlanadi?
- 992px
+ 1200px
- 1400px
> sm 576, md 768, lg 992, xl 1200, xxl 1400.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-2">
    <div class="col"><div class="p-2 border bg-body-tertiary">Talabalar</div></div>
    <div class="col"><div class="p-2 border bg-body-tertiary">Kurslar</div></div>
    <div class="col"><div class="p-2 border bg-body-tertiary">Testlar</div></div>
    <div class="col"><div class="p-2 border bg-body-tertiary">Sertifikat</div></div>
  </div>
</div>
```

## Xulosa

- `col-xl-*` — 1200px dan, `.container` 1140px.
- `col-lg-6 col-xl-3` — 1 / 2 / 4 ustun.
- Dashboard: yon menyu `col-md-3 col-xl-2`, kartalar `row-cols-xl-4`.
