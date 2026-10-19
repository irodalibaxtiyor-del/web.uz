## Input group

Bootstrap 5 da input group soddalashdi: `.input-group-prepend` va `.input-group-append` **olib tashlangan**. Qo‘shimchalar to‘g‘ridan-to‘g‘ri `.input-group` ichida, kerakli tartibda yoziladi.

```html
<div class="input-group mb-3">
  <span class="input-group-text" id="belgi">@</span>
  <input type="text" class="form-control" placeholder="foydalanuvchi" aria-label="Foydalanuvchi nomi" aria-describedby="belgi">
</div>

<div class="input-group mb-3">
  <input type="number" class="form-control" aria-label="Narx">
  <span class="input-group-text">so‘m</span>
</div>
```

| Bootstrap 4                                                 | Bootstrap 5                        |
| ----------------------------------------------------------- | ---------------------------------- |
| `<div class="input-group-prepend"><span class="input-group-text">@</span></div>` | `<span class="input-group-text">@</span>` |
| `<div class="input-group-append"><button class="btn">` | `<button class="btn">` to‘g‘ridan-to‘g‘ri |

## Tugma bilan

```html
<div class="input-group">
  <input type="text" class="form-control" placeholder="Kurs nomi" aria-label="Kurs nomi">
  <button class="btn btn-outline-secondary" type="button">Qidirish</button>
</div>
```

## Ikkala tomonda va bir nechta qo‘shimcha

```html
<div class="input-group">
  <span class="input-group-text">$</span>
  <span class="input-group-text">0.00</span>
  <input type="text" class="form-control" aria-label="Summa">
  <span class="input-group-text">.00</span>
</div>
```

## Bir nechta maydon

```html
<div class="input-group">
  <span class="input-group-text">Ism va familiya</span>
  <input type="text" aria-label="Ism" class="form-control">
  <input type="text" aria-label="Familiya" class="form-control">
</div>
```

## Checkbox, select va dropdown bilan

```html
<div class="input-group">
  <div class="input-group-text">
    <input class="form-check-input mt-0" type="checkbox" aria-label="Yoqish">
  </div>
  <input type="text" class="form-control" aria-label="Matn">
</div>

<div class="input-group">
  <label class="input-group-text" for="tur">Tur</label>
  <select class="form-select" id="tur">
    <option>Kurs</option>
    <option>O‘qituvchi</option>
  </select>
</div>
```

## Ikonkali

```html
<div class="input-group">
  <span class="input-group-text"><i class="bi bi-search" aria-hidden="true"></i></span>
  <input type="search" class="form-control" placeholder="Qidiruv" aria-label="Qidiruv">
</div>
```

## O‘lcham va qatorga o‘tmaslik

```html
<div class="input-group input-group-lg">…</div>
<div class="input-group input-group-sm">…</div>
<div class="input-group flex-nowrap">…</div>
```

`.flex-nowrap` — tor ekranda ham qo‘shimchalar maydon bilan bir qatorda qoladi.

## Xulosa

- `.input-group` ichida `.input-group-text`, `.btn`, `.form-control`, `.form-select` — kerakli tartibda.
- `prepend`/`append` yo‘q.
- O‘lcham — `.input-group-lg|sm`; qatorni ushlab turish — `.flex-nowrap`.
