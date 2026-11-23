## Jadvallar

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

## Ko‘rinish klasslari

| Klass                   | Natija                                    |
| ----------------------- | ----------------------------------------- |
| `.table-striped`        | “Zebra” qatorlar                          |
| `.table-striped-columns`| “Zebra” ustunlar (5.3)                    |
| `.table-hover`          | Sichqoncha ustidagi qator ajraladi        |
| `.table-bordered`       | Hamma kataklar chegarali                  |
| `.table-borderless`     | Chegarasiz                                |
| `.table-sm`             | Ixcham                                    |
| `.table-dark`           | To‘q jadval                               |

## Rangli jadval, qator va katak

Bootstrap 5 da rang klasslari **jadvalning o‘ziga ham**, qator yoki katakka ham beriladi:

```html
<table class="table table-primary">…</table>
<tr class="table-success">…</tr>
<td class="table-danger">…</td>
```

`.thead-dark` endi yo‘q — sarlavha qatoriga to‘g‘ridan-to‘g‘ri `.table-dark` beriladi:

```html
<thead class="table-dark">…</thead>
<thead class="table-light">…</thead>
```

## Chegara rangi va guruh ajratuvchi

```html
<table class="table table-bordered border-primary">…</table>

<tbody class="table-group-divider">…</tbody>  <!-- sarlavha va tana orasida qalinroq chiziq -->
```

## Vertikal tekislash

```html
<table class="table align-middle">…</table>
```

`align-middle` — barcha kataklar vertikal markazda (rasmli yoki tugmali jadvallar uchun).

## Moslashuvchan

```html
<div class="table-responsive">
  <table class="table">…</table>
</div>
```

Ma’lum sinfgacha: `.table-responsive-sm` … `.table-responsive-xxl`.

## Sarlavha (caption)

```html
<table class="table caption-top">
  <caption>Kuzgi imtihon natijalari</caption>
  …
</table>
```

`.caption-top` — izoh jadval tepasida.

```tekshir
Bootstrap 5 da jadvalning sarlavha qatorini qora qilish uchun nima yoziladi?
+ `<thead class="table-dark">`
- `<thead class="thead-dark">`
- `<tr class="dark">`
> `thead-dark` — Bootstrap 4 dagi nomi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="table-responsive">
  <table class="table table-striped table-hover align-middle caption-top">
    <caption>Natijalar</caption>
    <thead class="table-dark"><tr><th scope="col">Ism</th><th scope="col">Ball</th></tr></thead>
    <tbody class="table-group-divider"><tr><td>Ali</td><td>90</td></tr><tr class="table-success"><td>Lola</td><td>97</td></tr></tbody>
  </table>
  </div>
</div>
```

## Xulosa

- `.table` + `-striped`, `-hover`, `-bordered`, `-borderless`, `-sm`, `-dark`.
- Rang: `.table-primary` … jadval, qator yoki katakka; sarlavha — `thead.table-dark`.
- `align-middle`, `table-group-divider`, `caption-top`, `.table-responsive`.
