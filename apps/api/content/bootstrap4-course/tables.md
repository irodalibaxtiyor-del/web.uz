## Jadvallar

Bootstrap 4 da jadval uslubi `.table` klassi bilan yoqiladi:

```html
<table class="table">
  <thead>
    <tr><th scope="col">#</th><th scope="col">Talaba</th><th scope="col">Ball</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">1</th><td>Aziza</td><td>92</td></tr>
    <tr><th scope="row">2</th><td>Bekzod</td><td>85</td></tr>
  </tbody>
</table>
```

`scope="col"` va `scope="row"` — ekran o‘quvchiga sarlavha qaysi ustun yoki qatorga tegishli ekanini aytadi.

## Ko‘rinish klasslari

| Klass               | Natija                                  |
| ------------------- | --------------------------------------- |
| `.table-striped`    | “Zebra” qatorlar                        |
| `.table-bordered`   | Har bir katak chegarali                 |
| `.table-borderless` | Chegarasiz                              |
| `.table-hover`      | Sichqoncha ustidagi qator ajraladi      |
| `.table-sm`         | Ixcham (padding kamroq)                 |
| `.table-dark`       | To‘q jadval                             |

```html
<table class="table table-dark table-striped table-hover">…</table>
```

## Sarlavha qatori rangi

```html
<thead class="thead-dark">…</thead>
<thead class="thead-light">…</thead>
```

Butun jadval oq, faqat sarlavha to‘q (yoki och kulrang) bo‘ladi.

## Rangli qator va kataklar

Bootstrap 3 dagi `.success` o‘rniga endi `.table-*`:

```html
<tr class="table-success">…</tr>
<tr class="table-danger">…</tr>
<td class="table-warning">…</td>
```

`table-primary`, `table-secondary`, `table-success`, `table-danger`, `table-warning`, `table-info`, `table-light`, `table-dark`, `table-active`.

To‘q jadvalda esa `bg-*` klasslari ishlatiladi: `<tr class="bg-success">`.

## Moslashuvchan jadval

```html
<div class="table-responsive">
  <table class="table">…</table>
</div>
```

Ma’lum sinfgacha: `.table-responsive-sm`, `-md`, `-lg`, `-xl` — shu sinfdan **tor** ekranda gorizontal aylanadi.

## Jadval sarlavhasi (caption)

```html
<table class="table">
  <caption>2026-yil kuzgi imtihon natijalari</caption>
  …
</table>
```

Bootstrap `caption` ni jadval ostida, kulrang rangda ko‘rsatadi.

```tekshir
Bootstrap 4’da jadvalning sarlavha qatorini qora qilish uchun qaysi klass?
+ `thead-dark`
- `table-head-black`
- `th-dark`
> Bootstrap 5 da buning o‘rniga `table-dark` `thead` ga beriladi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="table-responsive">
  <table class="table table-striped table-hover">
    <thead class="thead-dark"><tr><th>Ism</th><th>Ball</th></tr></thead>
    <tbody><tr><td>Ali</td><td>90</td></tr><tr class="table-success"><td>Lola</td><td>97</td></tr></tbody>
  </table>
  </div>
</div>
```

## Xulosa

- `.table` + `.table-striped | -bordered | -borderless | -hover | -sm | -dark`.
- Sarlavha: `.thead-dark`, `.thead-light`.
- Rangli qator: `.table-success`, `.table-danger`…
- Keng jadval: `.table-responsive` (yoki `-sm/-md/…`).
