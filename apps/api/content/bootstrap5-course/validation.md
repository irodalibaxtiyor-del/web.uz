## Forma tekshiruvi (validation)

Bootstrap 5 brauzerning o‘z tekshiruvi (Constraint Validation API) bilan ishlaydi: `required`, `type="email"`, `minlength`, `pattern`, `min`/`max`. Bootstrap faqat natijani **chiroyli ko‘rsatadi**.

```html
<form class="row g-3 needs-validation" novalidate>
  <div class="col-md-6">
    <label for="ism" class="form-label">Ism</label>
    <input type="text" class="form-control" id="ism" required>
    <div class="valid-feedback">Yaxshi!</div>
    <div class="invalid-feedback">Ismingizni kiriting.</div>
  </div>
  <div class="col-md-6">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" required>
    <div class="invalid-feedback">To‘g‘ri email manzil kiriting.</div>
  </div>
  <div class="col-12">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="shart" required>
      <label class="form-check-label" for="shart">Shartlarga roziman</label>
      <div class="invalid-feedback">Davom etish uchun rozilik kerak.</div>
    </div>
  </div>
  <div class="col-12">
    <button class="btn btn-primary" type="submit">Yuborish</button>
  </div>
</form>
```

```js
document.querySelectorAll('.needs-validation').forEach((forma) => {
  forma.addEventListener('submit', (e) => {
    if (!forma.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }
    forma.classList.add('was-validated');
  });
});
```

## Qanday ishlaydi?

1. `novalidate` — brauzerning o‘z xabar oynachalari o‘chiriladi.
2. Forma yuborilganda `checkValidity()` har bir maydon qoidasini tekshiradi.
3. Noto‘g‘ri bo‘lsa — yuborish to‘xtatiladi (`preventDefault`).
4. `.was-validated` qo‘shiladi — endi `:invalid` maydonlar qizil chegarali, `:valid` lar yashil bo‘ladi va `.invalid-feedback`/`.valid-feedback` xabarlari ko‘rinadi.

## Server tekshiruvidan keyin

Server xato qaytarsa, maydonga to‘g‘ridan-to‘g‘ri klass bering:

```html
<input type="text" class="form-control is-invalid" id="login" aria-describedby="loginXato" value="aziza">
<div id="loginXato" class="invalid-feedback">Bu login band.</div>
```

`.is-valid` / `.is-invalid` — `.was-validated` siz ham ishlaydi.

## Tooltip ko‘rinishidagi xabar

```html
<div class="col-md-4 position-relative">
  <label for="shahar" class="form-label">Shahar</label>
  <input type="text" class="form-control" id="shahar" required>
  <div class="invalid-tooltip">Shaharni kiriting.</div>
</div>
```

Ota elementga `position-relative` kerak.

## Foydalanish imkoniyati

- Xato xabarini maydonga `aria-describedby` bilan bog‘lang — ekran o‘quvchi maydonga kirganda xatoni o‘qiydi.
- Xatoni faqat rang bilan emas, **matn** bilan ayting.
- Xato bo‘lgan birinchi maydonga fokusni qaytarish foydali.

> Brauzerdagi tekshiruv — faqat qulaylik. Ma’lumot baribir **serverda** tekshirilishi shart: foydalanuvchi brauzer tekshiruvini osongina chetlab o‘ta oladi.

## Xulosa

- `form.needs-validation[novalidate]` + JS: `checkValidity()`, `preventDefault()`, `.was-validated`.
- Xabarlar: `.valid-feedback`, `.invalid-feedback` (yoki `-tooltip`).
- Server xatosi — `.is-invalid` + `aria-describedby`.
