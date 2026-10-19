## Bootstrap 5 formalari

Bootstrap 5 da formalar soddalashdi: `.form-group` **olib tashlangan** — guruhlar orasidagi masofani spacing utilitasi (`mb-3`) beradi. Yorliqlar uchun yangi klass — `.form-label`.

```html
<form>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" aria-describedby="emailYordam">
    <div id="emailYordam" class="form-text">Email’ingizni hech kimga bermaymiz.</div>
  </div>
  <div class="mb-3">
    <label for="parol" class="form-label">Parol</label>
    <input type="password" class="form-control" id="parol">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="eslab">
    <label class="form-check-label" for="eslab">Meni eslab qol</label>
  </div>
  <button type="submit" class="btn btn-primary">Kirish</button>
</form>
```

| Bootstrap 4            | Bootstrap 5                    |
| ---------------------- | ------------------------------ |
| `.form-group`          | `.mb-3` (yoki boshqa margin)   |
| `<label>` (klassiz)    | `<label class="form-label">`   |
| `.form-row`            | `.row` + `g-*` gutter          |
| `.form-inline`         | setka va `col-auto`            |
| `small.form-text`      | `div.form-text`                |

## O‘lcham va holatlar

```html
<input class="form-control form-control-lg" type="text" placeholder="Katta">
<input class="form-control form-control-sm" type="text" placeholder="Kichik">
<input class="form-control" type="text" value="WD-2026-0142" readonly>
<input class="form-control-plaintext" type="text" value="aziza@misol.uz" readonly>
<input class="form-control" type="text" placeholder="O‘chirilgan" disabled>
<input class="form-control form-control-color" type="color" value="#0d6efd" title="Rang tanlang">
```

## Setkali forma

```html
<form class="row g-3">
  <div class="col-md-6">
    <label for="ism" class="form-label">Ism</label>
    <input type="text" class="form-control" id="ism">
  </div>
  <div class="col-md-6">
    <label for="familiya" class="form-label">Familiya</label>
    <input type="text" class="form-control" id="familiya">
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary">Saqlash</button>
  </div>
</form>
```

`row g-3` — maydonlar orasida gorizontal va vertikal 1rem oraliq.

## Gorizontal forma

```html
<div class="row mb-3">
  <label for="email2" class="col-sm-2 col-form-label">Email</label>
  <div class="col-sm-10">
    <input type="email" class="form-control" id="email2">
  </div>
</div>
```

## Qatorli forma

```html
<form class="row row-cols-lg-auto g-3 align-items-center">
  <div class="col-12">
    <label class="visually-hidden" for="qidiruv">Qidiruv</label>
    <input type="search" class="form-control" id="qidiruv" placeholder="Kurs nomi">
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary">Qidirish</button>
  </div>
</form>
```

## Fayl maydoni

Bootstrap 5 da `custom-file` kerak emas — oddiy `form-control`:

```html
<label for="fayl" class="form-label">Rasm yuklash</label>
<input class="form-control" type="file" id="fayl">
```

## Xulosa

- `.form-group` yo‘q → `.mb-3`; yorliq — `.form-label`; yordam — `.form-text`.
- Setka: `row g-3` + `col-*`; gorizontal — `.col-form-label`.
- `form-control-lg|sm`, `-plaintext`, `-color`; fayl — oddiy `.form-control`.
