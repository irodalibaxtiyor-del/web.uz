## Ustma-ustdan yonma-yonga

Bitta sinf bilan yozilgan setka: sinfdan tor ekranda ustunlar ustma-ust, keng ekranda yonma-yon.

```html
<div class="container">
  <div class="row">
    <div class="col-sm-6">Chap yarmi</div>
    <div class="col-sm-6">O‘ng yarmi</div>
  </div>
  <div class="row">
    <div class="col-sm-3">1</div>
    <div class="col-sm-3">2</div>
    <div class="col-sm-3">3</div>
    <div class="col-sm-3">4</div>
  </div>
</div>
```

| Ekran     | Natija                               |
| --------- | ------------------------------------ |
| < 576px   | Har bir ustun 100% — ustma-ust       |
| ≥ 576px   | 50% + 50% va 25% × 4                 |

## Nega 100%?

Bootstrap 5 da **har bir** qator bolasiga umumiy uslub beriladi:

```css
.row > * {
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  padding-right: calc(var(--bs-gutter-x) * .5);
  padding-left: calc(var(--bs-gutter-x) * .5);
}
```

`col-sm-6` kengligi esa `@media (min-width: 576px)` ichida. Undan tor ekranda `width: 100%` qoladi.

## Vertikal oraliq

Ustunlar ustma-ust tushganda ular orasida masofa bo‘lmaydi. Bootstrap 5 da buni bitta klass hal qiladi — `gy-*`:

```html
<div class="row gy-3">
  <div class="col-sm-6"><div class="p-3 border">1</div></div>
  <div class="col-sm-6"><div class="p-3 border">2</div></div>
</div>
```

Telefonda bloklar orasida 1rem, planshetda — yonma-yon (va keyingi qatorga tushsa, yana 1rem).

## Qaysi sinfni tanlash?

| Kontent                         | Tavsiya        |
| ------------------------------- | -------------- |
| Ikki ustunli matn + rasm        | `col-md-6`     |
| Kartalar (3–4 ta)               | `col-sm-6 col-lg-4` yoki `row-cols-*` |
| Kichik ikonkalar / statistika   | `col-6` (xs) dan |
| Forma maydonlari                | `col-md-*`     |

```tekshir
Ustunlar ustma-ust tushganda ular orasida vertikal bo‘shliq berish uchun qaysi klass?
+ `row` ga `gy-3` (yoki `g-3`)
- har ustunga `<br>`
- `row-gap-auto`
> Bootstrap 5 gutter klasslari: `g-*`, `gx-*`, `gy-*`.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="row gy-3">
    <div class="col-md-6"><div class="p-2 border bg-body-tertiary">Birinchi</div></div>
    <div class="col-md-6"><div class="p-2 border bg-body-tertiary">Ikkinchi</div></div>
  </div>
</div>
```

## Xulosa

- Bitta sinf: tor ekranda ustma-ust (`width: 100%`), keng ekranda yonma-yon.
- Ustma-ust bloklar orasidagi masofa — `gy-*`.
- Sinfni kontentga qarab tanlang.
