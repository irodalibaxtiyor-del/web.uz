## Setka asoslari

Bootstrap 5 setkasi — Flexbox asosidagi 12 ustunli tizim. Tuzilma o‘zgarmagan: `.container` → `.row` → `.col-*`.

```html
<div class="container">
  <div class="row">
    <div class="col-sm-4">1</div>
    <div class="col-sm-4">2</div>
    <div class="col-sm-4">3</div>
  </div>
</div>
```

## Oltita ekran sinfi

| Klass        | Sinf | Qachondan  |
| ------------ | ---- | ---------- |
| `.col-`      | xs   | Doim       |
| `.col-sm-`   | sm   | ≥ 576px    |
| `.col-md-`   | md   | ≥ 768px    |
| `.col-lg-`   | lg   | ≥ 992px    |
| `.col-xl-`   | xl   | ≥ 1200px   |
| `.col-xxl-`  | xxl  | ≥ 1400px   |

## Avtomatik ustunlar

```html
<div class="row">
  <div class="col">1</div>
  <div class="col">2</div>
  <div class="col">3</div>
</div>
```

`.col` — bo‘sh joyni teng bo‘ladi. Bittasiga kenglik bersangiz, qolganlari qolgan joyni taqsimlaydi:

```html
<div class="row">
  <div class="col-4">Menyu</div>
  <div class="col">Kontent</div>
</div>
```

## Bir qatorda nechta: `row-cols-*`

```html
<div class="row row-cols-2 row-cols-md-4">
  <div class="col">1</div>
  <div class="col">2</div>
  <div class="col">3</div>
  <div class="col">4</div>
</div>
```

Telefonda ikkitadan, `md` dan to‘rttadan.

## Gutter — ustunlar orasidagi masofa

Bootstrap 5 da gutter **CSS o‘zgaruvchi** (`--bs-gutter-x`, standart `1.5rem`) orqali ishlaydi va `g-*` klasslari bilan o‘zgaradi:

```html
<div class="row g-4">…</div>   <!-- gorizontal va vertikal oraliq 1.5rem -->
<div class="row gx-5">…</div>  <!-- faqat gorizontal 3rem -->
<div class="row gy-3">…</div>  <!-- faqat qatorlar orasida 1rem -->
<div class="row g-0">…</div>   <!-- oraliqsiz (Bootstrap 4 dagi no-gutters) -->
```

`gy-*` ayniqsa qulay: kartalar keyingi qatorga tushganda ular orasida vertikal masofa paydo bo‘ladi, har biriga `mb-3` yozish shart emas.

## Moslashuvchan misol

```html
<div class="row g-3">
  <div class="col-sm-6 col-lg-3"><div class="p-3 border bg-light">Kurs 1</div></div>
  <div class="col-sm-6 col-lg-3"><div class="p-3 border bg-light">Kurs 2</div></div>
  <div class="col-sm-6 col-lg-3"><div class="p-3 border bg-light">Kurs 3</div></div>
  <div class="col-sm-6 col-lg-3"><div class="p-3 border bg-light">Kurs 4</div></div>
</div>
```

Ustunning o‘ziga fon bermang — fon ichki blokda bo‘lsin, shunda gutter oraliq bo‘lib ko‘rinadi.

## Xulosa

- `.container` > `.row` > `.col-*`; oltita sinf, `xxl` — yangi.
- `.col` — avtomatik; `row-cols-*` — qatordagi ustunlar soni.
- Gutter: `g-*`, `gx-*`, `gy-*`, oraliqsiz — `g-0`.
