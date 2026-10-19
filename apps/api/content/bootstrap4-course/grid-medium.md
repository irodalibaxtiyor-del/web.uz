## Planshet uchun setka (`md`)

Bootstrap 4 da `.col-md-*` **768px** dan ishlaydi (Bootstrap 3 da 992px edi). Bu odatda planshetning vertikal holati.

```html
<div class="row">
  <div class="col-sm-6 col-md-4">Kurs 1</div>
  <div class="col-sm-6 col-md-4">Kurs 2</div>
  <div class="col-sm-6 col-md-4">Kurs 3</div>
</div>
```

| Ekran        | Bir qatorda |
| ------------ | ----------- |
| < 576px      | 1           |
| 576–767px    | 2           |
| ≥ 768px      | 3           |

## Yon panel bilan maket

```html
<div class="row">
  <aside class="col-md-4 col-lg-3">Kategoriyalar</aside>
  <main class="col-md-8 col-lg-9">Kurslar</main>
</div>
```

## Ko‘rinishni ekranga qarab o‘zgartirish

Bootstrap 4 da `hidden-*` / `visible-*` o‘rniga **display utilitalari**:

| Kerakli natija               | Klasslar                 |
| ---------------------------- | ------------------------ |
| Faqat `md` va kattada ko‘rinsin | `d-none d-md-block`   |
| `md` dan kichikda ko‘rinsin  | `d-md-none`              |
| Faqat `md` da ko‘rinsin      | `d-none d-md-block d-lg-none` |

```html
<div class="d-none d-md-block alert alert-info">Planshet va kompyuterda chegirma banneri</div>
```

## Ustunlar orasida bo‘shliq

Ustunlar orasidagi vertikal masofa uchun ustunga `mb-3` yoki `mb-md-0` kabi utilitalar beriladi:

```html
<div class="col-md-4 mb-3">…</div>
```

## Bootstrap 3 kodini ko‘chirish

Bootstrap 3 dagi `col-md-*` noutbuk uchun edi. Bootstrap 4 da noutbukka **`col-lg-*`** to‘g‘ri keladi. Ko‘chirishda:

| Bootstrap 3  | Bootstrap 4 (taxminan) |
| ------------ | ---------------------- |
| `col-xs-*`   | `col-*`                |
| `col-sm-*`   | `col-md-*`             |
| `col-md-*`   | `col-lg-*`             |
| `col-lg-*`   | `col-xl-*`             |

## Xulosa

- `col-md-*` — 768px dan (planshet).
- `col-sm-6 col-md-4` — 1 / 2 / 3 ustun.
- Ko‘rinish: `d-none d-md-block`, `d-md-none`.
- Bootstrap 3 dan ko‘chirishda sinflar bir pog‘ona siljiydi.
