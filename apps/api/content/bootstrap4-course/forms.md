## Bootstrap 4 formalari

Asosiy qoidalar Bootstrap 3 dagidek: maydonlarga `.form-control`, guruhlarga `.form-group`. Checkbox va radio esa yangi tuzilmaga o‘tdi.

```html
<form>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" class="form-control" id="email" aria-describedby="emailYordam">
    <small id="emailYordam" class="form-text text-muted">Email’ingizni hech kimga bermaymiz.</small>
  </div>
  <div class="form-group">
    <label for="parol">Parol</label>
    <input type="password" class="form-control" id="parol">
  </div>
  <div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="eslab">
    <label class="form-check-label" for="eslab">Meni eslab qol</label>
  </div>
  <button type="submit" class="btn btn-primary">Kirish</button>
</form>
```

- Yordamchi matn — `.form-text` (Bootstrap 3 dagi `.help-block`);
- checkbox — `.form-check` > `input.form-check-input` + `label.form-check-label`. Input endi label **ichida emas**, yonida.

## Qatorli forma

```html
<form class="form-inline">
  <label class="sr-only" for="ism">Ism</label>
  <input type="text" class="form-control mb-2 mr-sm-2" id="ism" placeholder="Ism">
  <button type="submit" class="btn btn-primary mb-2">Yuborish</button>
</form>
```

Elementlar orasidagi masofa — spacing utilitalari (`mr-sm-2`, `mb-2`).

## Setkali forma

Bootstrap 4 da formani setka bilan ikki ustunga bo‘lish mumkin. `.form-row` — `.row` ning tor oraliqli varianti:

```html
<form>
  <div class="form-row">
    <div class="form-group col-md-6">
      <label for="ism">Ism</label>
      <input type="text" class="form-control" id="ism">
    </div>
    <div class="form-group col-md-6">
      <label for="familiya">Familiya</label>
      <input type="text" class="form-control" id="familiya">
    </div>
  </div>
</form>
```

## Gorizontal forma

```html
<div class="form-group row">
  <label for="email2" class="col-sm-2 col-form-label">Email</label>
  <div class="col-sm-10">
    <input type="email" class="form-control" id="email2">
  </div>
</div>
```

`.col-form-label` — yorliqni maydon bilan vertikal tekislaydi (Bootstrap 3 dagi `.control-label`).

## Tekshiruv (validation)

Bootstrap 4 brauzerning o‘z tekshiruvi (`required`, `type="email"`, `minlength`) bilan ishlaydi. Forma yuborilganda unga `.was-validated` qo‘shilsa, maydonlar yashil yoki qizil bo‘ladi va tegishli xabar chiqadi:

```html
<form class="needs-validation" novalidate>
  <div class="form-group">
    <label for="login">Login</label>
    <input type="text" class="form-control" id="login" required minlength="3">
    <div class="valid-feedback">Yaxshi!</div>
    <div class="invalid-feedback">Login kamida 3 ta belgi.</div>
  </div>
  <button class="btn btn-primary" type="submit">Yuborish</button>
</form>
```

```js
document.querySelector('.needs-validation').addEventListener('submit', function (e) {
  if (!this.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  }
  this.classList.add('was-validated');
});
```

- `novalidate` — brauzerning o‘z xabar oynachalarini o‘chiradi (Bootstrap xabarlari ko‘rinsin);
- `.valid-feedback` / `.invalid-feedback` — faqat `.was-validated` dan keyin ko‘rinadi.

Serverdan kelgan xato uchun to‘g‘ridan-to‘g‘ri `.is-invalid` (yoki `.is-valid`) klassini maydonga bering.

> Brauzerdagi tekshiruv — faqat qulaylik. Ma’lumotni albatta **serverda** ham tekshiring.

## Xulosa

- `.form-group` + `.form-control`; yordamchi matn — `.form-text`.
- Checkbox/radio: `.form-check` > `.form-check-input` + `.form-check-label`.
- Setka: `.form-row` + `.col-*`; gorizontal: `.row` + `.col-form-label`.
- Tekshiruv: `.was-validated` yoki `.is-valid`/`.is-invalid` + `.valid-feedback`/`.invalid-feedback`.
