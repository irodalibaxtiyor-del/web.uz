## Noutbuk uchun setka (`lg`)

`.col-lg-*` 992px dan ishlaydi — odatdagi noutbuk ekrani. Bu yerda `.container` 960px.

```html
<div class="row">
  <div class="col-md-6 col-lg-3">Kurs 1</div>
  <div class="col-md-6 col-lg-3">Kurs 2</div>
  <div class="col-md-6 col-lg-3">Kurs 3</div>
  <div class="col-md-6 col-lg-3">Kurs 4</div>
</div>
```

| Ekran       | Bir qatorda |
| ----------- | ----------- |
| < 768px     | 1           |
| 768–991px   | 2           |
| ≥ 992px     | 4           |

## Maqola uchun tor ustun

O‘qish qulay bo‘lishi uchun matn ustunini katta ekranda toraytiring:

```html
<div class="row justify-content-center">
  <article class="col-md-10 col-lg-8">…</article>
</div>
```

Bu yerda offset o‘rniga `justify-content-center` ishlatildi — Flex setkaning afzalligi.

## Faqat `lg` yozilsa

```html
<div class="col-lg-6">…</div>
```

992px dan tor barcha ekranlarda ustun 100% bo‘ladi. Planshetda ham ikki ustun kerak bo‘lsa, `col-md-6` ni ham yozing.

## Tartibni katta ekranda o‘zgartirish

```html
<div class="row">
  <div class="col-lg-8 order-lg-2">Kontent</div>
  <div class="col-lg-4 order-lg-1">Yon panel</div>
</div>
```

Planshet va telefonda yon panel kontentdan **keyin** (HTML tartibi), noutbukda esa chapda.

## Navbar bilan moslik

Navbar ham shu sinflarga tayanadi: `.navbar-expand-lg` — 992px dan menyu ochiq. Setka va navbar uchun bir xil sinfni tanlash sahifani izchil qiladi.

## Xulosa

- `col-lg-*` — 992px dan, `.container` 960px.
- `col-md-6 col-lg-3` — 1 / 2 / 4 ustun.
- Tor matn ustuni: `justify-content-center` + `col-lg-8`.
- Tartib: `order-lg-*`.
