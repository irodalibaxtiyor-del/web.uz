## Noutbuk uchun setka (`md`)

`col-md-*` 992px va undan keng ekranlarda ishlaydi. U `sm` bilan birga yozilsa, planshet va noutbuk uchun turli maket olinadi.

```html
<div class="row">
  <div class="col-sm-6 col-md-4">Kurs 1</div>
  <div class="col-sm-6 col-md-4">Kurs 2</div>
  <div class="col-sm-6 col-md-4">Kurs 3</div>
</div>
```

| Ekran          | Klass       | Bir qatorda |
| -------------- | ----------- | ----------- |
| < 768px        | —           | 1 ta        |
| 768–991px      | `col-sm-6`  | 2 ta        |
| ≥ 992px        | `col-md-4`  | 3 ta        |

## Uch sinfni birga yozish

```html
<div class="col-xs-12 col-sm-6 col-md-3">...</div>
```

`col-xs-12` — standart holat bilan bir xil (100%), shuning uchun uni yozmasa ham bo‘ladi. Lekin ba’zi jamoalar o‘qish oson bo‘lishi uchun yozadi.

## Yon panel bilan maket

```html
<div class="row">
  <aside class="col-md-3">Kategoriyalar</aside>
  <main class="col-md-9">
    <div class="row">
      <div class="col-sm-6">Kurs</div>
      <div class="col-sm-6">Kurs</div>
    </div>
  </main>
</div>
```

- Noutbukda: chapda yon panel (25%), o‘ngda kontent (75%);
- planshetda: yon panel kontent ustida, kurslar ikki ustunda;
- telefonda: hammasi bitta ustunda.

## Offset faqat bir sinfda

Offset ham sinfga bog‘liq. `col-md-offset-2` faqat 992px dan keyin suradi:

```html
<div class="col-sm-8 col-md-6 col-md-offset-3">Forma</div>
```

Planshetda forma 8/12 kenglikda va chapga yopishgan, noutbukda — 6/12 va markazda.

Kichikroq ekranda offset’ni bekor qilish uchun `col-sm-offset-0` ishlatiladi:

```html
<div class="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-0">...</div>
```

## Ko‘rinishni yashirish

Ba’zi elementlar kichik ekranda kerak emas (masalan, katta reklama banneri):

```html
<div class="hidden-xs hidden-sm">Faqat noutbuk va katta ekranda</div>
<div class="visible-xs-block">Faqat telefonda</div>
```

## Xulosa

- `col-md-*` — 992px va undan katta ekran.
- `sm` + `md` birga: planshet va noutbukda turli ustunlar soni.
- Offset ham sinfga bog‘liq; bekor qilish — `col-*-offset-0`.
- `hidden-*` va `visible-*-block` — ekranga qarab ko‘rsatish/yashirish.
