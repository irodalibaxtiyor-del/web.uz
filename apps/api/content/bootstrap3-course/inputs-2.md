## Statik matn

Gorizontal formada o‘zgartirib bo‘lmaydigan qiymatni ko‘rsatish uchun `<p class="form-control-static">`:

```html
<div class="form-group">
  <label class="col-sm-2 control-label">Email</label>
  <div class="col-sm-10">
    <p class="form-control-static">aziza@webdizayn.uz</p>
  </div>
</div>
```

## Maydon holatlari

| Holat        | Qanday yoziladi        | Ko‘rinishi                                  |
| ------------ | ---------------------- | ------------------------------------------- |
| Fokus        | (avtomatik)            | Ko‘k chegara va yengil soya                 |
| O‘chirilgan  | `disabled` atributi    | Kulrang fon, kursor `not-allowed`, yuborilmaydi |
| Faqat o‘qish | `readonly` atributi    | Kulrang fon, tanlash mumkin, forma bilan yuboriladi |

```html
<input class="form-control" type="text" value="WD-2026-0142" readonly>
<input class="form-control" type="text" placeholder="Hozircha mavjud emas" disabled>
```

Butun formani bir yo‘la o‘chirish: `<fieldset disabled>`.

## Yordamchi matn

Maydon ostidagi tushuntirish `.help-block` bilan yoziladi. Uni maydonga `aria-describedby` orqali bog‘lang — ekran o‘quvchi maydonga kirganda izohni ham o‘qiydi:

```html
<label for="parol">Parol</label>
<input type="password" class="form-control" id="parol" aria-describedby="parolYordam">
<span id="parolYordam" class="help-block">Kamida 8 ta belgi, bitta raqam bilan.</span>
```

## Tekshiruv holatlari (validation)

`.form-group` ga holat klassi beriladi — yorliq, chegara va yordamchi matn shu rangga bo‘yaladi:

| Klass          | Rangi        | Ma’nosi              |
| -------------- | ------------ | -------------------- |
| `.has-success` | Yashil       | Qiymat to‘g‘ri       |
| `.has-warning` | Sariq-jigarrang | E’tibor bering    |
| `.has-error`   | Qizil        | Xato                 |

```html
<div class="form-group has-error">
  <label class="control-label" for="email">Email</label>
  <input type="email" class="form-control" id="email" aria-describedby="emailXato" aria-invalid="true">
  <span id="emailXato" class="help-block">Email manzil noto‘g‘ri yozilgan.</span>
</div>
```

`.control-label` yozilmasa, yorliq bo‘yalmaydi.

## Ikonkali holat (feedback)

`.has-feedback` qo‘shilsa, maydon ichida o‘ng tomonda ikonka chiqadi:

```html
<div class="form-group has-success has-feedback">
  <label class="control-label" for="login">Login</label>
  <input type="text" class="form-control" id="login" aria-describedby="loginHolat">
  <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
  <span id="loginHolat" class="sr-only">(to‘g‘ri)</span>
</div>
```

Faqat rang yoki ikonka bilan xatoni bildirish yetarli emas — xatoning **matni** bo‘lishi kerak.

> Bootstrap klasslari faqat ko‘rinish. Ma’lumotni haqiqatan tekshirish brauzerda (`required`, `type="email"`) va albatta **serverda** bajariladi.

## Xulosa

- `.form-control-static` — statik qiymat; `disabled` va `readonly` holatlari.
- `.help-block` + `aria-describedby` — yordamchi matn.
- `.has-success | -warning | -error` (+ `.control-label`), ikonka uchun `.has-feedback` va `.form-control-feedback`.
