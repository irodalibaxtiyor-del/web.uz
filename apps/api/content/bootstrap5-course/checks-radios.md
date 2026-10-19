## Checkbox va radio

Bootstrap 5 da `.form-check` o‘zi chiroyli ko‘rinishga ega (Bootstrap 4 dagi `custom-checkbox` endi kerak emas):

```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="shart">
  <label class="form-check-label" for="shart">Shartlarga roziman</label>
</div>

<div class="form-check">
  <input class="form-check-input" type="radio" name="tolov" id="naqd" checked>
  <label class="form-check-label" for="naqd">Naqd</label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="tolov" id="karta">
  <label class="form-check-label" for="karta">Karta orqali</label>
</div>
```

- `input` va `label` yonma-yon, `id`/`for` mos;
- radio guruhida `name` bir xil;
- belgilangan holat — Bootstrap rangida (`primary`).

## Bir qatorda

```html
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="shakl" id="s1" value="onlayn">
  <label class="form-check-label" for="s1">Onlayn</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="shakl" id="s2" value="oflayn">
  <label class="form-check-label" for="s2">Oflayn</label>
</div>
```

## Switch (kalit)

```html
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="bildirishnoma" checked>
  <label class="form-check-label" for="bildirishnoma">Bildirishnomalar</label>
</div>
```

`role="switch"` — ekran o‘quvchi uni “kalit, yoqilgan” deb o‘qiydi.

## O‘ng tomonda (reverse)

```html
<div class="form-check form-check-reverse">
  <input class="form-check-input" type="checkbox" id="r">
  <label class="form-check-label" for="r">Yorliq chapda, belgi o‘ngda</label>
</div>
```

## Holatlar

```html
<input class="form-check-input" type="checkbox" id="o1" disabled>
<input class="form-check-input" type="checkbox" id="o2" checked disabled>
```

Uch holatli checkbox (qisman belgilangan) JavaScript bilan:

```js
document.getElementById('hammasi').indeterminate = true;
```

## Tugma ko‘rinishida

“Tugmalar guruhi” darsida ko‘rgan `.btn-check` ham shu yerga tegishli:

```html
<input type="checkbox" class="btn-check" id="html" autocomplete="off">
<label class="btn btn-outline-primary" for="html">HTML</label>
```

## Guruh sarlavhasi

```html
<fieldset class="mb-3">
  <legend class="col-form-label pt-0">To‘lov usuli</legend>
  <div class="form-check">…</div>
  <div class="form-check">…</div>
</fieldset>
```

## Xulosa

- `.form-check` > `.form-check-input` + `.form-check-label` (`id`/`for`).
- `.form-check-inline`, `.form-switch` (`role="switch"`), `.form-check-reverse`.
- Guruhni `fieldset` + `legend` bilan nomlang.
