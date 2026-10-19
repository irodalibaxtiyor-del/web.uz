## Input group

Input group maydon oldiga yoki ortiga matn, belgi yoki tugma yopishtiradi. Bootstrap 4 da tuzilma biroz o‘zgargan: qo‘shimcha `.input-group-prepend` (oldin) yoki `.input-group-append` (keyin) ichida, matn esa `.input-group-text` da yoziladi.

```html
<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="belgi">@</span>
  </div>
  <input type="text" class="form-control" placeholder="foydalanuvchi" aria-label="Foydalanuvchi nomi" aria-describedby="belgi">
</div>

<div class="input-group mb-3">
  <input type="text" class="form-control" aria-label="Narx">
  <div class="input-group-append">
    <span class="input-group-text">so‘m</span>
  </div>
</div>
```

Bootstrap 3 bilan farq:

| Bootstrap 3              | Bootstrap 4                                         |
| ------------------------ | --------------------------------------------------- |
| `.input-group-addon`     | `.input-group-prepend` / `-append` > `.input-group-text` |
| `.input-group-btn`       | `.input-group-prepend` / `-append` > `.btn`         |

## Tugmali input group

```html
<div class="input-group">
  <input type="text" class="form-control" placeholder="Kurs nomi" aria-label="Kurs nomi">
  <div class="input-group-append">
    <button class="btn btn-outline-secondary" type="button">Qidirish</button>
  </div>
</div>
```

## Ikkala tomonda

```html
<div class="input-group">
  <div class="input-group-prepend"><span class="input-group-text">$</span></div>
  <input type="text" class="form-control" aria-label="Summa">
  <div class="input-group-append"><span class="input-group-text">.00</span></div>
</div>
```

## Checkbox yoki radio bilan

```html
<div class="input-group">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="checkbox" aria-label="Yoqish">
    </div>
  </div>
  <input type="text" class="form-control" aria-label="Matn">
</div>
```

## O‘lcham

```html
<div class="input-group input-group-lg">…</div>
<div class="input-group input-group-sm">…</div>
```

## Dropdown bilan

```html
<div class="input-group">
  <div class="input-group-prepend">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Tur</button>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="#">Kurs</a>
      <a class="dropdown-item" href="#">O‘qituvchi</a>
    </div>
  </div>
  <input type="text" class="form-control" aria-label="Qidiruv">
</div>
```

## Yorliq haqida

Input group ichidagi “@” yoki “so‘m” yorliq **o‘rnini bosmaydi**. Maydonga `<label>` (kerak bo‘lsa `.sr-only`) yoki `aria-label` bering.

## Xulosa

- `.input-group` > `.input-group-prepend` / `.input-group-append` > `.input-group-text` yoki `.btn`.
- O‘lcham: `.input-group-lg|sm`.
- Maydonga baribir nom bering (`label` yoki `aria-label`).
