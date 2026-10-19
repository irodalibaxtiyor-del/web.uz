## Telefon va kichik planshet

`.col-sm-*` 576px va undan keng ekranda ishlaydi. Uni `.col-*` bilan birga yozib, telefon va kichik planshet uchun turli nisbat beriladi.

```html
<div class="row">
  <div class="col-6 col-sm-3">Profil</div>
  <div class="col-6 col-sm-3">Kurslar</div>
  <div class="col-6 col-sm-3">Xabarlar</div>
  <div class="col-6 col-sm-3">Sozlamalar</div>
</div>
```

| Ekran     | Klass       | Natija       |
| --------- | ----------- | ------------ |
| < 576px   | `col-6`     | 2 × 2 to‘r   |
| ≥ 576px   | `col-sm-3`  | Bir qatorda 4 ta |

## `.col-sm` — avtomatik, lekin sm dan

```html
<div class="row">
  <div class="col-sm">1</div>
  <div class="col-sm">2</div>
  <div class="col-sm">3</div>
</div>
```

Telefonda ustma-ust, 576px dan uchta teng ustun.

## Offset ham sinfga bog‘liq

```html
<div class="col-10 offset-1 col-sm-8 offset-sm-2">Forma</div>
```

Telefonda 10/12 va chetdan 1 ustun, kichik planshetda 8/12 va chetdan 2 ustun — ikkala holatda ham markazda.

Kattaroq ekranda offset’ni bekor qilish: `offset-md-0`.

## Muhim: yig‘indini har sinf uchun hisoblang

`col-6 col-sm-3` × 4:

- xs: 6 × 4 = 24 → ikki qator;
- sm: 3 × 4 = 12 → bir qator.

Flex qatorda balandliklar turlicha bo‘lsa ham “zinapoya” muammosi yo‘q (Bootstrap 3 dagi `clearfix` kerak emas).

## Xulosa

- `col-*` + `col-sm-*` — telefon va kichik planshetda turli nisbat.
- `.col-sm` — 576px dan teng ustunlar.
- Offset: `offset-1 offset-sm-2`; bekor qilish — `offset-md-0`.
