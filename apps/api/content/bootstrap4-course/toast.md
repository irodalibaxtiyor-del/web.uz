## Toast — qisqa bildirishnoma

**Toast** — ekran burchagida qisqa vaqt ko‘rinib turadigan bildirishnoma: “Saqlandi”, “Yangi xabar”, “Nusxa olindi”. U Bootstrap 4.2 da qo‘shilgan.

```html
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000" id="xabar">
  <div class="toast-header">
    <strong class="mr-auto">WEBDIZAYN</strong>
    <small class="text-muted">hozir</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Yopish">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    Topshirig‘ingiz qabul qilindi.
  </div>
</div>
```

| Qism            | Vazifasi                                |
| --------------- | --------------------------------------- |
| `.toast`        | Bildirishnoma qutisi (boshida yashirin) |
| `.toast-header` | Sarlavha, vaqt, yopish tugmasi          |
| `.toast-body`   | Asosiy matn                             |
| `data-dismiss="toast"` | Yopish tugmasi                   |

## Ko‘rsatish

Toast **o‘zi chiqmaydi** — JavaScript bilan ko‘rsatiladi:

```js
$('#xabar').toast('show');
```

Ko‘pincha biror amaldan keyin:

```js
$('#saqlash').on('click', function () {
  $('#xabar').toast('show');
});
```

## Sozlamalar

| Atribut          | Ma’nosi                                     |
| ---------------- | ------------------------------------------- |
| `data-delay`     | Necha ms ko‘rinadi (standart 500)           |
| `data-autohide`  | `false` — foydalanuvchi yopguncha turadi    |
| `data-animation` | `false` — xiralashish animatsiyasisiz       |

Matn uzunroq bo‘lsa, `data-delay` ni oshiring — foydalanuvchi o‘qishga ulgursin (masalan, 5000–8000 ms).

## Joylashtirish

Toast oddiy blok kabi joylashadi. Burchakka chiqarish uchun o‘ram elementiga pozitsiya bering:

```html
<div aria-live="polite" aria-atomic="true" style="position: relative; min-height: 200px;">
  <div style="position: absolute; top: 1rem; right: 1rem;">
    <div class="toast" …>…</div>
    <div class="toast" …>…</div>  <!-- bir nechta toast ustma-ust tiziladi -->
  </div>
</div>
```

## Foydalanish imkoniyati

- `role="alert"` + `aria-live="assertive"` — muhim xabar, darhol o‘qiladi;
- muhim bo‘lmagan xabar uchun `role="status"` + `aria-live="polite"`;
- `aria-atomic="true"` — butun toast bir butun sifatida o‘qiladi;
- harakat talab qiladigan xabarni (masalan, “Tasdiqlang”) avtomatik yopiladigan toastga qo‘ymang.

## Hodisalar

```js
$('#xabar').on('hidden.bs.toast', function () {
  console.log('Toast yopildi');
});
```

## Xulosa

- `.toast` > `.toast-header` + `.toast-body`; yopish — `data-dismiss="toast"`.
- Ko‘rsatish faqat JS bilan: `$('#id').toast('show')`.
- `data-delay`, `data-autohide`; `role` va `aria-live` ni to‘g‘ri tanlang.
