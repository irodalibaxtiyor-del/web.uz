## Telefon va planshet uchun setka

Ba’zan telefonda ham bloklar yonma-yon turishi kerak, lekin boshqa nisbatda. Buning uchun **ikki sinf** birga yoziladi: `xs` (telefon) va `sm` (planshet va undan katta).

```html
<div class="row">
  <div class="col-xs-6 col-sm-3">1</div>
  <div class="col-xs-6 col-sm-3">2</div>
  <div class="col-xs-6 col-sm-3">3</div>
  <div class="col-xs-6 col-sm-3">4</div>
</div>
```

| Ekran     | Ishlaydigan klass | Natija              |
| --------- | ----------------- | ------------------- |
| < 768px   | `col-xs-6`        | 2 ta qatorda 2 tadan |
| ≥ 768px   | `col-sm-3`        | 1 ta qatorda 4 ta   |

`col-sm-3` faqat 768px dan keyin ishlaydi va o‘sha yerda `col-xs-6` ni bosib ketadi (CSS’da keyinroq yozilgan va media so‘rov ichida).

## Teng bo‘lmagan nisbatlar

```html
<div class="row">
  <div class="col-xs-9 col-sm-6">Matn</div>
  <div class="col-xs-3 col-sm-6">Ikonka</div>
</div>
```

Telefonda matn keng, ikonka tor; planshetda — ikkalasi teng.

## Faqat `sm` yozilsa

```html
<div class="col-sm-4">...</div>
```

Telefonda ustun **100%**. Bu ko‘pincha kerakli natija: kichik ekranda bloklar ustma-ust tursa, o‘qish qulay.

## Qator 12 dan oshsa

Har bir sinf uchun yig‘indini alohida hisoblang. Yuqoridagi misolda:

- `xs`: 6 + 6 + 6 + 6 = 24 → ikki qator;
- `sm`: 3 + 3 + 3 + 3 = 12 → bir qator.

Bloklar balandligi har xil bo‘lsa, `float` tufayli “zinapoya” hosil bo‘lishi mumkin. Bunday holatda kerakli joyga **clearfix** qo‘yiladi:

```html
<div class="row">
  <div class="col-xs-6 col-sm-3">Uzun matn…</div>
  <div class="col-xs-6 col-sm-3">Qisqa</div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6 col-sm-3">3</div>
  <div class="col-xs-6 col-sm-3">4</div>
</div>
```

`.visible-xs-block` — bu `div` faqat telefonda mavjud bo‘ladi va u yerda qatorni yangidan boshlaydi.

## Xulosa

- `col-xs-*` + `col-sm-*` — telefon va planshetda turli nisbat.
- Kattaroq sinf klassi kichigini bosib ketadi.
- Har bir sinf uchun 12 ni alohida hisoblang; kerak bo‘lsa `.clearfix.visible-xs-block`.
