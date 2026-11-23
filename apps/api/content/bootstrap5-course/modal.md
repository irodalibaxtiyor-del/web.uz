## Modal

```html
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#oyna">
  Kursga yozilish
</button>

<div class="modal fade" id="oyna" tabindex="-1" aria-labelledby="oynaSarlavha" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="oynaSarlavha">Kursga yozilish</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Yopish"></button>
      </div>
      <div class="modal-body">Bootstrap 5 kursi 1-noyabrdan boshlanadi.</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bekor qilish</button>
        <button type="button" class="btn btn-primary">Tasdiqlash</button>
      </div>
    </div>
  </div>
</div>
```

- ochish — `data-bs-toggle="modal"` + `data-bs-target`;
- yopish — `data-bs-dismiss="modal"` (masalan, `.btn-close`);
- ochilganda modalga `.show` qo‘shiladi, fokus modal ichiga o‘tadi, **Esc** bilan yopiladi.

## Variantlar

| Klass / atribut              | Natija                                    |
| ---------------------------- | ----------------------------------------- |
| `.modal-dialog-centered`     | Vertikal markazda                         |
| `.modal-dialog-scrollable`   | Uzun kontent modal ichida aylanadi        |
| `.modal-sm`, `.modal-lg`, `.modal-xl` | Kenglik                          |
| `.modal-fullscreen`          | To‘liq ekran (5 da yangi)                 |
| `.modal-fullscreen-md-down`  | `md` dan kichik ekranda to‘liq ekran      |
| `data-bs-backdrop="static"`  | Orqa fonga bosilganda yopilmaydi          |
| `data-bs-keyboard="false"`   | Esc bilan yopilmaydi                      |

```html
<div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">…</div>
```

Telefon uchun `modal-fullscreen-sm-down` juda qulay — kichik ekranda oyna butun ekranni egallaydi.

## Ikkita modal ketma-ket

Bir modaldan boshqasiga o‘tish (masalan, “Kirish” → “Ro‘yxatdan o‘tish”):

```html
<button class="btn btn-link" data-bs-target="#royxat" data-bs-toggle="modal">Akkauntingiz yo‘qmi?</button>
```

Bu tugma birinchi modal ichida — Bootstrap eski modalni yopib, yangisini ochadi.

## JavaScript orqali

```js
const modal = new bootstrap.Modal('#oyna', { backdrop: 'static' });
modal.show();

document.getElementById('oyna').addEventListener('hidden.bs.modal', () => {
  console.log('Modal yopildi');
});
```

Hodisa ichida modalni ochgan tugmani bilish:

```js
document.getElementById('oyna').addEventListener('show.bs.modal', (e) => {
  const tugma = e.relatedTarget;
  const nomi = tugma.getAttribute('data-kurs');
  e.target.querySelector('.modal-title').textContent = nomi + ' kursi';
});
```

```tekshir
Bootstrap 5 da modalni ochuvchi tugma qanday yoziladi?
+ `data-bs-toggle="modal" data-bs-target="#id"`
- `data-toggle="modal" data-target="#id"`
- `onclick="$('#id').modal()"` (yagona usul)
> Modalni JavaScript’da `new bootstrap.Modal(el).show()` bilan ham ochish mumkin.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#md">Modalni ochish</button>
  <div class="modal fade" id="md" tabindex="-1" aria-labelledby="mdt" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"><div class="modal-content">
      <div class="modal-header"><h1 class="modal-title fs-5" id="mdt">Salom!</h1><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Yopish"></button></div>
      <div class="modal-body">Bu markazdagi modal.</div>
      <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">Yopish</button></div>
    </div></div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

## Xulosa

- `.modal.fade` > `.modal-dialog` > `.modal-content` > header (sarlavha + `.btn-close`), body, footer.
- `data-bs-toggle="modal"` / `data-bs-dismiss="modal"`; ochilganda `.show`.
- `.modal-dialog-centered`, `-scrollable`, `.modal-fullscreen-*-down`, `data-bs-backdrop="static"`.
