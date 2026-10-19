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

## Xulosa

- Bitta sinf: tor ekranda ustma-ust (`width: 100%`), keng ekranda yonma-yon.
- Ustma-ust bloklar orasidagi masofa — `gy-*`.
- Sinfni kontentga qarab tanlang.
