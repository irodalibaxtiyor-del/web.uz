## Alert

```html
<div class="alert alert-success" role="alert">
  <strong>Tayyor!</strong> Profilingiz saqlandi.
</div>
<div class="alert alert-danger" role="alert">
  <strong>Xato!</strong> Parol noto‘g‘ri.
</div>
```

Sakkizta rang: `alert-primary`, `-secondary`, `-success`, `-danger`, `-warning`, `-info`, `-light`, `-dark`. Bootstrap 5.3 da alert ranglari `-subtle` fon va `-emphasis` matn o‘zgaruvchilaridan olinadi — qorong‘i rejimda ham o‘qilishi yaxshi.

## Sarlavha va havola

```html
<div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Tabriklaymiz!</h4>
  <p>Siz HTML kursini tugatdingiz.</p>
  <hr>
  <p class="mb-0">Sertifikat <a href="#" class="alert-link">shaxsiy kabinetda</a>.</p>
</div>
```

## Ikonkali alert

Flex utilitalari va Bootstrap Icons bilan:

```html
<div class="alert alert-warning d-flex align-items-center" role="alert">
  <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
  <div>Topshiriq muddati ertaga tugaydi.</div>
</div>
```

## Yopiladigan alert

Bootstrap 5 da yopish tugmasi — yangi **`.btn-close`** komponenti (× belgisi SVG sifatida CSS ichida):

```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Diqqat!</strong> Profilingiz to‘liq emas.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Yopish"></button>
</div>
```

Bootstrap 4 dan farq:

| Bootstrap 4                                         | Bootstrap 5                                   |
| --------------------------------------------------- | --------------------------------------------- |
| `<button class="close" data-dismiss="alert">&times;</button>` | `<button class="btn-close" data-bs-dismiss="alert"></button>` |

`.btn-close` ichi bo‘sh — matn yo‘q, shuning uchun `aria-label` **majburiy**. Qorong‘i fonda oq variant: `.btn-close-white` (yoki `data-bs-theme="dark"`).

## JavaScript orqali

```js
const alertEl = document.getElementById('ogohlantirish');
const alert = bootstrap.Alert.getOrCreateInstance(alertEl);
alert.close();

alertEl.addEventListener('closed.bs.alert', () => {
  console.log('Yopildi');
});
```

Bootstrap 5 da har bir plaginning `getOrCreateInstance()` usuli bor — element uchun mavjud obyektni qaytaradi yoki yangisini yaratadi.

## Xulosa

- `.alert` + `.alert-{rang}`, `role="alert"`.
- `.alert-heading`, `.alert-link`; ikonka uchun `d-flex align-items-center`.
- Yopish: `.alert-dismissible.fade.show` + `button.btn-close[data-bs-dismiss="alert"][aria-label]`.
