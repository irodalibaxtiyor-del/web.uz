## Setka (grid) nima?

Bootstrap setkasi sahifani **12 ta ustunga** bo‘ladi. Har bir blok nechta ustun egallashini siz aytasiz, Bootstrap esa kenglikni foizda hisoblaydi va kichik ekranlarda bloklarni avtomatik ravishda bir-birining ostiga tushiradi.

```text
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
|       4       |       4       |       4       |
|           6           |           6           |
|     3     |               9                   |
```

Bitta qatordagi ustunlar yig‘indisi **12** bo‘lishi kerak (yoki kamroq). 12 dan oshsa, ortiqcha ustunlar keyingi qatorga tushadi.

## Asosiy tuzilma

```html
<div class="container">
  <div class="row">
    <div class="col-sm-4">Birinchi</div>
    <div class="col-sm-4">Ikkinchi</div>
    <div class="col-sm-4">Uchinchi</div>
  </div>
</div>
```

Qoidalar:

1. **`.row`** doim `.container` (yoki `.container-fluid`) ichida bo‘ladi.
2. Ustunlar (`.col-*-*`) faqat `.row` ning **bevosita** bolalari bo‘ladi.
3. Kontent ustun ichiga yoziladi, `.row` ga emas.
4. Ustunlarning ichki chekkasi (padding) 15px — qo‘shni ustunlar orasida 30px “oraliq” (gutter) hosil bo‘ladi. `.row` esa −15px margin bilan buni konteyner chetida tenglashtiradi.

## Ustun klassining tuzilishi

```text
col - sm - 4
 │    │    └── nechta ustun (1 dan 12 gacha)
 │    └─────── qaysi ekrandan boshlab (xs, sm, md, lg)
 └──────────── column — ustun
```

Bootstrap 3 da to‘rtta ekran sinfi bor:

| Prefiks   | Ekran           | Kenglik     |
| --------- | --------------- | ----------- |
| `col-xs-` | Telefon         | < 768px     |
| `col-sm-` | Planshet        | ≥ 768px     |
| `col-md-` | Noutbuk         | ≥ 992px     |
| `col-lg-` | Katta monitor   | ≥ 1200px    |

`col-sm-4` ning ma’nosi: **768px va undan keng** ekranda 4/12 (uchdan bir) kenglik. Undan tor ekranda ustun 100% kenglikka cho‘ziladi va bloklar ustma-ust tushadi.

## Misollar

**Teng uch ustun:**

```html
<div class="row">
  <div class="col-sm-4">.col-sm-4</div>
  <div class="col-sm-4">.col-sm-4</div>
  <div class="col-sm-4">.col-sm-4</div>
</div>
```

**Teng bo‘lmagan ikki ustun (yon panel + asosiy qism):**

```html
<div class="row">
  <div class="col-sm-3">Yon panel</div>
  <div class="col-sm-9">Asosiy matn</div>
</div>
```

**Ikki teng ustun:**

```html
<div class="row">
  <div class="col-md-6">Chap</div>
  <div class="col-md-6">O‘ng</div>
</div>
```

Bu yerda `md` ishlatildi: bloklar faqat 992px dan keng ekranda yonma-yon turadi.

## Telefonda ham yonma-yon

`col-xs-*` hech qachon ustma-ust tushmaydi — eng kichik ekranda ham yonma-yon turadi:

```html
<div class="row">
  <div class="col-xs-6">Chap</div>
  <div class="col-xs-6">O‘ng</div>
</div>
```

## Xulosa

- Setka 12 ustundan iborat; qatordagi ustunlar yig‘indisi 12.
- Tuzilma: `.container` → `.row` → `.col-*-*`.
- `col-sm-4`: 768px dan keng ekranda 4 ustun, torroq ekranda 100%.
- Ekran sinflari: `xs`, `sm`, `md`, `lg`.
