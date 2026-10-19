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

## Xulosa

- `col-md-*` — 768px dan, `.container` 720px.
- `col-sm-6 col-md-3` — 1 / 2 / 4 ustun.
- `d-none d-md-block`, `d-md-none`; navbar bilan mos sinf tanlang.
