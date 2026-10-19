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

## Xulosa

- `.btn-group` (+ `role`, `aria-label`), o‘lcham `.btn-group-lg|sm`, vertikal `.btn-group-vertical`.
- `.btn-toolbar` + `mr-2` — bir nechta guruh.
- Radio/checkbox tugmalar: `.btn-group-toggle[data-toggle="buttons"]`.
