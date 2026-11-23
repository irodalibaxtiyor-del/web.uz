## Katta monitor uchun setka (`xl`)

Bootstrap 4 da yangi sinf — **`xl`**: 1200px va undan keng ekran. `.container` bu yerda 1140px.

```html
<div class="row">
  <div class="col-lg-4 col-xl-3">Kurs</div>
  <div class="col-lg-4 col-xl-3">Kurs</div>
  <div class="col-lg-4 col-xl-3">Kurs</div>
  <div class="col-lg-4 col-xl-3">Kurs</div>
</div>
```

| Ekran        | Bir qatorda |
| ------------ | ----------- |
| < 992px      | 1           |
| 992–1199px   | 3           |
| ≥ 1200px     | 4           |

## Barcha beshta sinf birga

```html
<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">…</div>
```

| Ekran     | Kenglik |
| --------- | ------- |
| xs        | 12/12   |
| sm        | 6/12    |
| md        | 4/12    |
| lg        | 3/12    |
| xl        | 2/12    |

Amalda beshtasi kamdan-kam kerak bo‘ladi — odatda 2–3 ta sinf yetarli. Faqat nisbat **o‘zgaradigan** sinfni yozing.

## `row-cols` bilan qisqaroq

Bir xil ustunlar uchun klasslarni har bir bolada takrorlamasdan, qatorga yozing:

```html
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
  <div class="col">Kurs</div>
  <div class="col">Kurs</div>
  <div class="col">Kurs</div>
  <div class="col">Kurs</div>
</div>
```

Natija xuddi yuqoridagidek, lekin HTML qisqa va o‘zgartirish oson.

## Juda keng ekranlar

`.container` 1140px dan kengaymaydi — 1920px li monitorda ikki chetda katta bo‘sh joy qoladi. Bu ataylab: juda uzun qatorlarni o‘qish qiyin. To‘liq kenglik kerak bo‘lsa (masalan, admin panel), `.container-fluid` ishlating.

> Bootstrap 5 da yana bitta sinf qo‘shilgan: `xxl` (≥ 1400px, konteyner 1320px).

```tekshir
Bir qatorda har doim 3 tadan ustun bo‘lishi uchun ota `row` ga qaysi klass?
+ `row-cols-3`
- `cols-3`
- `row-3`
> `row-cols-*` bolalarga alohida `col-*` yozmasdan kenglik beradi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="row row-cols-2 row-cols-md-3">
    <div class="col"><div class="p-2 border bg-light">1</div></div>
    <div class="col"><div class="p-2 border bg-light">2</div></div>
    <div class="col"><div class="p-2 border bg-light">3</div></div>
    <div class="col"><div class="p-2 border bg-light">4</div></div>
  </div>
</div>
```

## Xulosa

- `col-xl-*` — 1200px dan, `.container` 1140px.
- Beshta sinfni birga yozish mumkin, lekin faqat kerakligini yozing.
- `row-cols-*` — bir xil ustunlar uchun qisqa yozuv.
