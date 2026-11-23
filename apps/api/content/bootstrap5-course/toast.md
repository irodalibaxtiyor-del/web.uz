## Toast

**Toast** — ekran burchagida qisqa vaqt turadigan bildirishnoma.

```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="xabar" class="toast" role="status" aria-live="polite" aria-atomic="true" data-bs-delay="5000">
    <div class="toast-header">
      <strong class="me-auto">WEBDIZAYN</strong>
      <small class="text-body-secondary">hozir</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Yopish"></button>
    </div>
    <div class="toast-body">Topshirig‘ingiz qabul qilindi.</div>
  </div>
</div>
```

| Qism / atribut          | Vazifasi                                      |
| ----------------------- | --------------------------------------------- |
| `.toast-container`      | Bir nechta toast’ni ustma-ust tizadi          |
| `position-fixed bottom-0 end-0 p-3` | O‘ng pastki burchakda              |
| `.toast`                | Bildirishnoma (boshida yashirin)              |
| `.toast-header` / `.toast-body` | Sarlavha va matn                      |
| `data-bs-dismiss="toast"` | Yopish tugmasi                              |
| `data-bs-delay`         | Necha ms ko‘rinadi (standart 5000)            |
| `data-bs-autohide="false"` | O‘zi yopilmaydi                            |

## Ko‘rsatish

Toast JavaScript bilan ko‘rsatiladi:

```js
const xabar = document.getElementById('xabar');
document.getElementById('yuborish').addEventListener('click', () => {
  bootstrap.Toast.getOrCreateInstance(xabar).show();
});
```

Bootstrap 4 bilan farq: `$('#xabar').toast('show')` → `bootstrap.Toast.getOrCreateInstance(el).show()`.

## Rangli toast

Sarlavhasiz, rangli variant:

```html
<div class="toast align-items-center text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body">Saqlandi!</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Yopish"></button>
  </div>
</div>
```

`btn-close-white` — to‘q fondagi oq yopish belgisi.

## Foydalanish imkoniyati

| Xabar turi                       | Atributlar                                  |
| -------------------------------- | ------------------------------------------- |
| Oddiy (saqlandi, nusxa olindi)   | `role="status" aria-live="polite"`          |
| Muhim (xato)                     | `role="alert" aria-live="assertive"`        |

- `aria-atomic="true"` — toast bir butun sifatida o‘qiladi;
- harakat talab qiladigan narsani (tugma, havola) avtomatik yopiladigan toastga qo‘ymang — foydalanuvchi ulgurmasligi mumkin;
- `aria-live` hudud (`.toast-container`) sahifada **oldindan** bo‘lishi kerak, toast keyin qo‘shilsa ham.

## Hodisalar

```js
xabar.addEventListener('hidden.bs.toast', () => console.log('Yopildi'));
```

```tekshir
Bootstrap 5 da toastni ko‘rsatish uchun qaysi kod?
+ `bootstrap.Toast.getOrCreateInstance(el).show()`
- `$('.toast').toast('show')` (jQuery shart)
- `el.style.display = 'toast'`
> Toast avtomatik ko‘rinmaydi; ekran o‘quvchi uchun `role="status"` va `aria-live`.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <button class="btn btn-primary" id="tb">Saqlash</button>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="tt" class="toast" role="status" aria-live="polite" aria-atomic="true">
      <div class="toast-header"><strong class="me-auto">WEBDIZAYN</strong><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Yopish"></button></div>
      <div class="toast-body">Mashq saqlandi.</div>
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script>
  document.getElementById('tb').onclick = () => bootstrap.Toast.getOrCreateInstance(document.getElementById('tt')).show();
</script>
```

## Xulosa

- `.toast` > `.toast-header` + `.toast-body`, `.toast-container` + pozitsiya utilitalari.
- Ko‘rsatish: `bootstrap.Toast.getOrCreateInstance(el).show()`.
- `data-bs-delay`, `data-bs-autohide`; `role` va `aria-live` ni to‘g‘ri tanlang.
