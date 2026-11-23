## Setka asoslari

Bootstrap 4 setkasi **Flexbox** asosida ishlaydi va qatorni **12 ta ustunga** bo‘ladi. Tuzilma Bootstrap 3 dagidek: `.container` → `.row` → ustunlar.

```html
<div class="container">
  <div class="row">
    <div class="col-sm-4">1</div>
    <div class="col-sm-4">2</div>
    <div class="col-sm-4">3</div>
  </div>
</div>
```

## Beshta ekran sinfi

| Klass       | Ekran     | Qachondan       |
| ----------- | --------- | --------------- |
| `.col-`     | xs        | Doim            |
| `.col-sm-`  | sm        | ≥ 576px         |
| `.col-md-`  | md        | ≥ 768px         |
| `.col-lg-`  | lg        | ≥ 992px         |
| `.col-xl-`  | xl        | ≥ 1200px        |

E’tibor bering: Bootstrap 4 da eng kichik sinf uchun prefiks **yo‘q** — `col-xs-6` emas, `col-6`.

## Avtomatik ustunlar

Flexbox tufayli ustun sonini yozmasangiz ham bo‘ladi. `.col` — qatordagi bo‘sh joyni teng bo‘lib oladi:

```html
<div class="row">
  <div class="col">1</div>
  <div class="col">2</div>
  <div class="col">3</div>
</div>
<!-- 3 ta teng ustun -->

<div class="row">
  <div class="col">1</div>
  <div class="col">2</div>
  <div class="col">3</div>
  <div class="col">4</div>
</div>
<!-- 4 ta teng ustun -->
```

Ekran sinfi bilan: `.col-sm` — 576px dan boshlab teng ustunlar, undan torroqda ustma-ust.

## Aralash: bittasi belgilangan, qolgani avtomatik

```html
<div class="row">
  <div class="col-3">Menyu (3/12)</div>
  <div class="col">Kontent (qolgan 9/12)</div>
</div>
```

## Teng balandlik

Flex konteyner bo‘lgani uchun qatordagi ustunlar **avtomatik bir xil balandlikda** bo‘ladi — Bootstrap 3 da buning uchun hiyla kerak edi.

## Moslashuvchan misol

```html
<div class="row">
  <div class="col-sm-6 col-lg-3">Kurs 1</div>
  <div class="col-sm-6 col-lg-3">Kurs 2</div>
  <div class="col-sm-6 col-lg-3">Kurs 3</div>
  <div class="col-sm-6 col-lg-3">Kurs 4</div>
</div>
```

- telefonda: 1 ustun;
- 576px dan: 2 ustun;
- 992px dan: 4 ustun.

```tekshir
Bootstrap 4’da nechta ekran sinfi bor?
- 4
+ 5 (xs, sm, md, lg, xl)
- 6
> `xs` uchun prefiks yozilmaydi: `col-6`; Bootstrap 5 da `xxl` qo‘shildi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="row">
    <div class="col"><div class="p-2 border bg-light">col</div></div>
    <div class="col"><div class="p-2 border bg-light">col</div></div>
    <div class="col-6"><div class="p-2 border bg-light">col-6</div></div>
  </div>
</div>
```

## Xulosa

- `.container` > `.row` > `.col-*`; qatorda 12 ustun.
- Sinflar: `col-`, `col-sm-`, `col-md-`, `col-lg-`, `col-xl-` (`xs` prefiksi yo‘q).
- `.col` — avtomatik teng ustun; ustunlar teng balandlikda.
