## Planshet (md)

`.col-md-*` 768px dan (planshetning vertikal holati). Bu yerda `.container` — 720px.

```html
<div class="row g-3">
  <div class="col-sm-6 col-md-3">Kurs 1</div>
  <div class="col-sm-6 col-md-3">Kurs 2</div>
  <div class="col-sm-6 col-md-3">Kurs 3</div>
  <div class="col-sm-6 col-md-3">Kurs 4</div>
</div>
```

| Ekran       | Bir qatorda |
| ----------- | ----------- |
| < 576px     | 1           |
| 576–767px   | 2           |
| ≥ 768px     | 4           |

## Yon panelli maket

```html
<div class="row">
  <aside class="col-md-4 col-lg-3">Kategoriyalar</aside>
  <main class="col-md-8 col-lg-9">Kurslar</main>
</div>
```

## Ekranga qarab yashirish

```html
<div class="d-none d-md-block">Planshet va kompyuterda</div>
<div class="d-md-none">Faqat telefonda</div>
```

## Planshet navbarni ham hisobga oling

Navbar ham shu sinflarga qaraydi: `navbar-expand-md` — 768px dan menyu ochiq. Setka va navbar bir xil sinfda “ochilsa”, sahifa izchil ko‘rinadi.

## Ekranlarni sinash

DevTools’dagi qurilma rejimi (Ctrl + Shift + M) bilan 575, 576, 767, 768px kengliklarni sinab ko‘ring — chegaralarda maket qanday o‘zgarishini ko‘rasiz. Platforma CHECK’i ham mashqlarni turli kengliklarda tekshiradi.

```tekshir
Elementni faqat `md` va undan katta ekranda ko‘rsatish uchun qaysi klasslar?
+ `d-none d-md-block`
- `hidden-sm`
- `visible-md`
> Bootstrap 5 da ko‘rinish `d-*` utilitalari bilan boshqariladi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="row g-2">
    <div class="col-md-8"><div class="p-2 border bg-body-tertiary">Kontent</div></div>
    <div class="col-md-4 d-none d-md-block"><div class="p-2 border bg-body-tertiary">Yon panel (md dan)</div></div>
  </div>
</div>
```

## Xulosa

- `col-md-*` — 768px dan, `.container` 720px.
- `col-sm-6 col-md-3` — 1 / 2 / 4 ustun.
- `d-none d-md-block`, `d-md-none`; navbar bilan mos sinf tanlang.
