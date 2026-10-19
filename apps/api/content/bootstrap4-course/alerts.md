## Alert

**Alert** — foydalanuvchiga holat haqida xabar beruvchi rangli quti. Bootstrap 4 da u sakkizta rangda bo‘ladi:

```html
<div class="alert alert-success" role="alert">
  <strong>Tayyor!</strong> Profilingiz saqlandi.
</div>
<div class="alert alert-danger" role="alert">
  <strong>Xato!</strong> Parol noto‘g‘ri.
</div>
<div class="alert alert-warning" role="alert">Topshiriq muddati ertaga tugaydi.</div>
<div class="alert alert-info" role="alert">Yangi dars qo‘shildi.</div>
<div class="alert alert-primary" role="alert">…</div>
<div class="alert alert-secondary" role="alert">…</div>
<div class="alert alert-light" role="alert">…</div>
<div class="alert alert-dark" role="alert">…</div>
```

`role="alert"` — ekran o‘quvchi xabarni darhol o‘qib beradi. Uni faqat **muhim, kutilmagan** xabarlarga qo‘ying (masalan, forma yuborilgandan keyingi xato).

## Ichidagi elementlar

```html
<div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Tabriklaymiz!</h4>
  <p>Siz HTML kursini muvaffaqiyatli tugatdingiz.</p>
  <hr>
  <p class="mb-0">Sertifikat <a href="#" class="alert-link">shaxsiy kabinetda</a>.</p>
</div>
```

- `.alert-heading` — xabar sarlavhasi (rangni meros oladi);
- `.alert-link` — xabar rangidagi qalin havola;
- `<hr>` — xabar rangidagi chiziq.

## Yopiladigan alert

```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Diqqat!</strong> Profilingiz to‘liq emas.
  <button type="button" class="close" data-dismiss="alert" aria-label="Yopish">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
```

Bootstrap 3 dan farqi:

| Bootstrap 3        | Bootstrap 4          |
| ------------------ | -------------------- |
| `.fade.in`         | `.fade.show`         |
| tugma matndan oldin | tugma oxirida ham bo‘ladi (absolute joylashadi) |

Tugma bosilganda plagin `.show` ni olib tashlaydi (xiralashadi) va keyin elementni DOM’dan o‘chiradi.

## JavaScript orqali

```js
$('#ogohlantirish').alert('close');
$('#ogohlantirish').on('closed.bs.alert', function () {
  console.log('Yopildi');
});
```

## Xulosa

- `.alert` + `.alert-primary | -secondary | -success | -danger | -warning | -info | -light | -dark`.
- `.alert-heading`, `.alert-link`.
- Yopiladigan: `.alert-dismissible.fade.show` + `button.close[data-dismiss="alert"]`.
