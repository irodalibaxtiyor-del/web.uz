## Ustma-ustdan yonma-yonga

Bitta ekran sinfi bilan yozilgan setka: shu sinfdan tor ekranda ustunlar ustma-ust, keng ekranda yonma-yon.

```html
<div class="container">
  <div class="row">
    <div class="col-sm-6">Chap yarmi</div>
    <div class="col-sm-6">O‘ng yarmi</div>
  </div>
  <div class="row">
    <div class="col-sm-4">1</div>
    <div class="col-sm-4">2</div>
    <div class="col-sm-4">3</div>
  </div>
</div>
```

| Ekran     | Natija                                   |
| --------- | ---------------------------------------- |
| < 576px   | Har bir ustun 100%, ustma-ust            |
| ≥ 576px   | Yonma-yon: 50% + 50%, 33% × 3            |

## Nega 100% bo‘ladi?

`.col-sm-6` uslubi `@media (min-width: 576px)` ichida. Undan tor ekranda ustunda faqat umumiy uslublar qoladi: `position: relative; width: 100%; padding: 0 15px;`. Shuning uchun u qatorning to‘liq kengligini egallaydi.

## Bootstrap 3 bilan solishtirish

| Bootstrap 3      | Bootstrap 4      | Chegarasi |
| ---------------- | ---------------- | --------- |
| `.col-xs-*`      | `.col-*`         | doim      |
| `.col-sm-*`      | `.col-sm-*`      | 768 → **576px** |
| `.col-md-*`      | `.col-md-*`      | 992 → **768px** |
| `.col-lg-*`      | `.col-lg-*`      | 1200 → **992px** |
| —                | `.col-xl-*`      | **1200px** |

Bootstrap 3 kodini ko‘chirganda shuni yodda tuting: bir xil nomli klass Bootstrap 4 da **kichikroq** ekrandan boshlab ishlaydi.

## Teng balandlik bonus

Flex qatorda ustunlar avtomatik bir xil balandlikda. Ichidagi kartani ham cho‘zish uchun kartaga `h-100` bering:

```html
<div class="row">
  <div class="col-sm-4"><div class="card h-100">Qisqa</div></div>
  <div class="col-sm-4"><div class="card h-100">Uzunroq matn…</div></div>
</div>
```

```tekshir
Bootstrap 4 da qatordagi ustunlar nega bir xil balandlikda bo‘ladi?
+ `.row` flex konteyner, flex elementlar standart holda cho‘ziladi
- har ustunga `height` beriladi
- JavaScript balandlikni tenglaydi
> `align-items: stretch` — flex’ning standart qiymati.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="row">
    <div class="col-md-6"><div class="p-2 border bg-light h-100">Qisqa</div></div>
    <div class="col-md-6"><div class="p-2 border bg-light h-100">Uzun matn<br>ikkinchi qator<br>uchinchi qator</div></div>
  </div>
</div>
```

## Xulosa

- Bitta sinf: tor ekranda ustma-ust, keng ekranda yonma-yon.
- Bootstrap 4 chegaralari: 576 / 768 / 992 / 1200px.
- Flex tufayli ustunlar teng balandlikda; kartaga `h-100`.
