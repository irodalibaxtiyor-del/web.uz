## Tugmalar guruhi

```html
<div class="btn-group" role="group" aria-label="Ko‘rinish">
  <button type="button" class="btn btn-secondary">Ro‘yxat</button>
  <button type="button" class="btn btn-secondary">Jadval</button>
  <button type="button" class="btn btn-secondary">Kartalar</button>
</div>
```

Tugmalar bir-biriga yopishadi, faqat chetki burchaklar yumaloq qoladi. `role="group"` va `aria-label` — ekran o‘quvchi uchun.

## O‘lcham

```html
<div class="btn-group btn-group-lg" role="group">…</div>
<div class="btn-group" role="group">…</div>
<div class="btn-group btn-group-sm" role="group">…</div>
```

## Vertikal guruh

```html
<div class="btn-group-vertical" role="group" aria-label="Bo‘limlar">
  <button type="button" class="btn btn-outline-primary">Profil</button>
  <button type="button" class="btn btn-outline-primary">Kurslar</button>
</div>
```

## Toolbar

```html
<div class="btn-toolbar" role="toolbar" aria-label="Sahifalar">
  <div class="btn-group mr-2" role="group" aria-label="Raqamlar">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
  </div>
  <div class="btn-group" role="group" aria-label="O‘tish">
    <button type="button" class="btn btn-secondary">Keyingi</button>
  </div>
</div>
```

Guruhlar orasidagi masofa `mr-2` (margin-right) utilitasi bilan beriladi.

## Checkbox va radio guruhi

Tugma ko‘rinishidagi tanlovlar:

```html
<div class="btn-group btn-group-toggle" data-toggle="buttons">
  <label class="btn btn-outline-secondary active">
    <input type="radio" name="daraja" id="d1" checked> Boshlang‘ich
  </label>
  <label class="btn btn-outline-secondary">
    <input type="radio" name="daraja" id="d2"> O‘rta
  </label>
  <label class="btn btn-outline-secondary">
    <input type="radio" name="daraja" id="d3"> Yuqori
  </label>
</div>
```

`data-toggle="buttons"` bilan Bootstrap tanlangan `<label>` ga `.active` qo‘yadi, radio esa yashirin bo‘lib qoladi.

## Guruh ichida dropdown

```html
<div class="btn-group" role="group">
  <button type="button" class="btn btn-primary">Saqlash</button>
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
      Yana
    </button>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="#">Qoralama</a>
    </div>
  </div>
</div>
```

Bootstrap 4 da `.btn-group-justified` yo‘q — to‘liq kenglik uchun guruhga `d-flex` va tugmalarga `w-100` yoki `flex-fill` bering.

```tekshir
Bootstrap 4’da tugmalar guruhi ekran o‘quvchiga qanday tanishtiriladi?
+ `role="group"` va `aria-label`
- `title` atributi bilan
- hech narsa kerak emas
> `aria-label` guruh nima uchun ekanini aytadi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="btn-group" role="group" aria-label="Matn uslubi">
    <button class="btn btn-secondary">Q</button>
    <button class="btn btn-secondary">K</button>
    <button class="btn btn-secondary">T</button>
  </div>
  <div class="btn-group-vertical ml-3" role="group" aria-label="Vertikal">
    <button class="btn btn-outline-primary">1</button>
    <button class="btn btn-outline-primary">2</button>
  </div>
</div>
```

## Xulosa

- `.btn-group` (+ `role`, `aria-label`), o‘lcham `.btn-group-lg|sm`, vertikal `.btn-group-vertical`.
- `.btn-toolbar` + `mr-2` — bir nechta guruh.
- Radio/checkbox tugmalar: `.btn-group-toggle[data-toggle="buttons"]`.
