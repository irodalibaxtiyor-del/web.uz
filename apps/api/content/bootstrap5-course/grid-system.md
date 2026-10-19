## Setka tizimi chuqurroq

Bootstrap 5 setkasi Flexbox va CSS o‘zgaruvchilar asosida:

- `.row` — `display: flex; flex-wrap: wrap;`, chetlarida manfiy margin (yarim gutter);
- ustunlar — yarim gutter padding (`calc(var(--bs-gutter-x) * .5)`), standart gutter `1.5rem` → har tomonda 12px;
- `.col-*-N` — `flex: 0 0 auto; width: N/12`.

## Oltita sinf

| Sinf | Klass         | Ekran     | `.container` |
| ---- | ------------- | --------- | ------------ |
| xs   | `.col-`       | < 576px   | 100%         |
| sm   | `.col-sm-`    | ≥ 576px   | 540px        |
| md   | `.col-md-`    | ≥ 768px   | 720px        |
| lg   | `.col-lg-`    | ≥ 992px   | 960px        |
| xl   | `.col-xl-`    | ≥ 1200px  | 1140px       |
| xxl  | `.col-xxl-`   | ≥ 1400px  | 1320px       |

## Gutter’ni boshqarish

| Klass       | Natija                                          |
| ----------- | ----------------------------------------------- |
| `.g-0` … `.g-5`  | Gorizontal va vertikal oraliq (0 … 3rem)   |
| `.gx-*`     | Faqat gorizontal (ustunlar orasida)             |
| `.gy-*`     | Faqat vertikal (qatorlar orasida)               |
| `.g-md-4`   | Ekranga qarab                                   |

```html
<div class="row gx-5 gy-3">…</div>
```

Gutter kattalashsa, qator chetlari ham ko‘proq manfiy margin oladi. Sahifa gorizontal aylanib ketmasligi uchun katta gutter ishlatilganda konteynerga `overflow-hidden` yoki mos padding bering.

## Offset va auto margin

```html
<div class="row">
  <div class="col-md-6 offset-md-3">Markazdagi ustun</div>
</div>
<div class="row">
  <div class="col-md-4">Chap</div>
  <div class="col-md-4 ms-auto">O‘ng chetda</div>
</div>
```

Bootstrap 5 da `ml-auto` → **`ms-auto`**.

## Tartib

```html
<div class="row">
  <div class="col-md-8 order-md-2">Asosiy kontent (HTML’da birinchi)</div>
  <div class="col-md-4 order-md-1">Yon panel (ekranda chapda)</div>
</div>
```

`.order-0` … `.order-5`, `.order-first`, `.order-last`.

## Tekislash va ichma-ich setka

```html
<div class="row align-items-center justify-content-between">…</div>
<div class="col">
  <div class="row">…</div>  <!-- ichki setka ham 12 ustunli -->
</div>
```

## CSS Grid varianti (tajribaviy)

Bootstrap 5.1 dan `$enable-cssgrid` Sass sozlamasi yoqilsa, `.grid` va `.g-col-*` klasslari CSS Grid bilan ishlaydi. Standart CDN faylida u o‘chirilgan — darslarda Flexbox setkasidan foydalanamiz.

## Xulosa

- 12 ustun, oltita sinf (`xxl` ≥ 1400px).
- Gutter: `g-*`, `gx-*`, `gy-*`; oraliqsiz — `g-0`.
- `offset-*`, `ms-auto`, `order-*`, `align-items-*`, `justify-content-*`.
