## Tugmalar guruhi

```html
<div class="btn-group" role="group" aria-label="Ko‘rinish">
  <button type="button" class="btn btn-primary">Ro‘yxat</button>
  <button type="button" class="btn btn-primary">Jadval</button>
  <button type="button" class="btn btn-primary">Kartalar</button>
</div>
```

O‘lcham: `.btn-group-lg`, `.btn-group-sm`; vertikal: `.btn-group-vertical`; bir nechta guruh — `.btn-toolbar`.

## Radio va checkbox tugmalar: `.btn-check`

Bootstrap 5 da tanlov tugmalari yangi usulda yoziladi: haqiqiy `input` (`.btn-check`) va uning ortidan `label` (`.btn`). JavaScript kerak emas — hammasi CSS `:checked` bilan ishlaydi.

```html
<div class="btn-group" role="group" aria-label="Darajangiz">
  <input type="radio" class="btn-check" name="daraja" id="d1" autocomplete="off" checked>
  <label class="btn btn-outline-primary" for="d1">Boshlang‘ich</label>

  <input type="radio" class="btn-check" name="daraja" id="d2" autocomplete="off">
  <label class="btn btn-outline-primary" for="d2">O‘rta</label>

  <input type="radio" class="btn-check" name="daraja" id="d3" autocomplete="off">
  <label class="btn btn-outline-primary" for="d3">Yuqori</label>
</div>
```

- `.btn-check` — input ko‘rinmas, lekin klaviatura bilan tanlanadi;
- `label` — `for` orqali bog‘lanadi va tugma ko‘rinishida chiziladi;
- tanlangan variant `:checked + .btn` bilan to‘liq rangga bo‘yaladi;
- `autocomplete="off"` — Firefox sahifa yangilanganda eski tanlovni eslab qolmasin.

Bootstrap 4 dagi `btn-group-toggle` + `data-toggle="buttons"` endi kerak emas.

Checkbox bilan — bir nechta variant tanlash mumkin:

```html
<input type="checkbox" class="btn-check" id="html" autocomplete="off">
<label class="btn btn-outline-success" for="html">HTML</label>
```

## Toolbar

```html
<div class="btn-toolbar" role="toolbar" aria-label="Sahifalar">
  <div class="btn-group me-2" role="group" aria-label="Raqamlar">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
  </div>
  <div class="btn-group" role="group" aria-label="O‘tish">
    <button type="button" class="btn btn-secondary">Keyingi</button>
  </div>
</div>
```

`me-2` — guruhlar orasida masofa (Bootstrap 4 dagi `mr-2`).

## Guruh ichida dropdown

```html
<div class="btn-group" role="group">
  <button type="button" class="btn btn-primary">Saqlash</button>
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Yana</button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#">Qoralama</a></li>
    </ul>
  </div>
</div>
```

## Xulosa

- `.btn-group` (+ `role`, `aria-label`), `.btn-group-vertical`, `.btn-toolbar`.
- Tanlov tugmalari: `input.btn-check` + `label.btn[for]` — JS’siz.
- Masofa — `me-2`.
