## Modal

```html
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#oyna">
  Kursga yozilish
</button>

<div class="modal fade" id="oyna" tabindex="-1" aria-labelledby="oynaSarlavha" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="oynaSarlavha">Kursga yozilish</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Yopish">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Bootstrap 4 kursi 1-noyabrdan boshlanadi.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Bekor qilish</button>
        <button type="button" class="btn btn-primary">Tasdiqlash</button>
      </div>
    </div>
  </div>
</div>
```

Bootstrap 4 da:

- sarlavha `modal-header` ichida **birinchi**, yopish tugmasi undan keyin (flex bilan o‘ngga suriladi);
- ochilganda modalga **`.show`** qo‘shiladi (Bootstrap 3 da `.in`);
- `.modal-footer` dagi tugmalar flex bilan o‘ngga tekislanadi.

## Joylashuv va o‘lcham

| Klass                        | Natija                                        |
| ---------------------------- | --------------------------------------------- |
| `.modal-dialog-centered`     | Ekranning vertikal markazida                  |
| `.modal-dialog-scrollable`   | Uzun kontent modal ichida aylanadi            |
| `.modal-sm` / `.modal-lg` / `.modal-xl` | Kenglik (300 / 800 / 1140px)       |

```html
<div class="modal-dialog modal-dialog-centered modal-lg">…</div>
```

## Statik fon

Foydalanuvchi faqat tugma orqali yopishi kerak bo‘lsa (masalan, muhim tasdiq):

```html
<div class="modal fade" id="tasdiq" data-backdrop="static" data-keyboard="false" tabindex="-1">…</div>
```

- `data-backdrop="static"` — orqa fonga bosilganda yopilmaydi;
- `data-keyboard="false"` — **Esc** bilan yopilmaydi.

## Bir tugma — turli kontent

`data-*` atributi va `show.bs.modal` hodisasi bilan bitta modalni turli ma’lumot bilan ochish:

```html
<button class="btn btn-link" data-toggle="modal" data-target="#kurs" data-nomi="HTML">HTML</button>
<button class="btn btn-link" data-toggle="modal" data-target="#kurs" data-nomi="CSS">CSS</button>
```

```js
$('#kurs').on('show.bs.modal', function (e) {
  var nomi = $(e.relatedTarget).data('nomi');
  $(this).find('.modal-title').text(nomi + ' kursi');
});
```

## Foydalanish imkoniyati

- `aria-labelledby` — sarlavha `id` si;
- ochilganda fokus modal ichiga o‘tadi, yopilganda ochgan tugmaga qaytadi (Bootstrap buni o‘zi qiladi);
- modal ichidagi asosiy amal tugmasi aniq nomlansin.

## Xulosa

- `.modal.fade` > `.modal-dialog` > `.modal-content` > header (sarlavha + `.close`), body, footer.
- Ochish: `data-toggle="modal" data-target`; yopish: `data-dismiss="modal"`; ochilganda `.show`.
- `.modal-dialog-centered`, `.modal-dialog-scrollable`, `.modal-sm|lg|xl`, `data-backdrop="static"`.
