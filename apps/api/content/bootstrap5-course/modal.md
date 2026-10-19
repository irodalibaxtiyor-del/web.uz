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

## Xulosa

- `.modal.fade` > `.modal-dialog` > `.modal-content` > header (sarlavha + `.btn-close`), body, footer.
- `data-bs-toggle="modal"` / `data-bs-dismiss="modal"`; ochilganda `.show`.
- `.modal-dialog-centered`, `-scrollable`, `.modal-fullscreen-*-down`, `data-bs-backdrop="static"`.
