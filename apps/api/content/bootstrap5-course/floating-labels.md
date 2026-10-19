## Floating labels — suzuvchi yorliqlar

**Floating label** — maydon ichida yozilgan yorliq. Maydon bo‘sh bo‘lsa yorliq maydon o‘rtasida turadi, foydalanuvchi yozishni boshlashi (yoki fokus berishi) bilan u yuqoriga “suzib” chiqadi va kichrayadi. Bootstrap 5 da yangi.

```html
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="email" placeholder="ism@misol.uz">
  <label for="email">Email manzil</label>
</div>
<div class="form-floating">
  <input type="password" class="form-control" id="parol" placeholder="Parol">
  <label for="parol">Parol</label>
</div>
```

## Uchta qat’iy qoida

1. **`input` birinchi, `label` keyin** — CSS `input ~ label` selektori ishlashi uchun tartib muhim.
2. **`placeholder` bo‘lishi shart** — Bootstrap `:placeholder-shown` holatiga qarab yorliqni joylashtiradi. Placeholder matni ko‘rinmaydi, shuning uchun istalgan matn bo‘lishi mumkin.
3. Ikkalasi `.form-floating` o‘ramining ichida.

## Textarea

```html
<div class="form-floating">
  <textarea class="form-control" placeholder="Izoh" id="izoh" style="height: 100px"></textarea>
  <label for="izoh">Izohingiz</label>
</div>
```

Balandlik `rows` bilan emas, `style="height"` bilan beriladi.

## Select

```html
<div class="form-floating">
  <select class="form-select" id="shahar" aria-label="Shahar">
    <option selected>Tanlang</option>
    <option value="1">Toshkent</option>
    <option value="2">Samarqand</option>
  </select>
  <label for="shahar">Shahar</label>
</div>
```

Select’da yorliq doim yuqorida turadi.

## Setkada

```html
<div class="row g-2">
  <div class="col-md">
    <div class="form-floating">
      <input type="text" class="form-control" id="ism" placeholder="Ism">
      <label for="ism">Ism</label>
    </div>
  </div>
  <div class="col-md">
    <div class="form-floating">
      <input type="text" class="form-control" id="familiya" placeholder="Familiya">
      <label for="familiya">Familiya</label>
    </div>
  </div>
</div>
```

## Input group ichida

```html
<div class="input-group">
  <span class="input-group-text">@</span>
  <div class="form-floating">
    <input type="text" class="form-control" id="login" placeholder="Login">
    <label for="login">Login</label>
  </div>
</div>
```

## Nima uchun foydali?

- Joy tejaladi: yorliq va maydon bitta qutida.
- Yorliq hech qachon yo‘qolmaydi — oddiy `placeholder` dan farqli ravishda yozilgandan keyin ham ko‘rinib turadi (yuqorida).
- U haqiqiy `<label>` — ekran o‘quvchi uni to‘g‘ri o‘qiydi.

## Xulosa

- `.form-floating` > `input.form-control[placeholder]` + `label[for]` — shu tartibda.
- Textarea balandligi — `style="height"`; select bilan ham ishlaydi.
- Setkada `row g-2` + `col-md`; input group ichida ham bo‘ladi.
