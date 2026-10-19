## Modal oyna

**Modal** — sahifa ustida ochiladigan dialog oyna. Orqa fon qorayadi va foydalanuvchi oynani yopmaguncha sahifa bilan ishlay olmaydi. Tasdiqlash (“Rostdan o‘chirasizmi?”), kirish formasi, batafsil ma’lumot uchun ishlatiladi.

```html
<!-- Ochuvchi tugma -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#oyna">
  Kursga yozilish
</button>

<!-- Modal -->
<div class="modal fade" id="oyna" tabindex="-1" role="dialog" aria-labelledby="oynaSarlavha">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Yopish">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title" id="oynaSarlavha">Kursga yozilish</h4>
      </div>
      <div class="modal-body">
        <p>Bootstrap 3 kursi 1-noyabrdan boshlanadi.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Bekor qilish</button>
        <button type="button" class="btn btn-primary">Tasdiqlash</button>
      </div>
    </div>
  </div>
</div>
```

## Tuzilma

| Qism                  | Vazifasi                                         |
| --------------------- | ------------------------------------------------ |
| `.modal`              | Butun ekranni qoplovchi qatlam (boshida yashirin) |
| `.fade`               | Ochilish/yopilishda xiralashish animatsiyasi      |
| `.modal-dialog`       | Oynaning kengligi va joylashuvi                  |
| `.modal-content`      | Oq quti (chegara, soya, radius)                   |
| `.modal-header` / `-body` / `-footer` | Sarlavha, asosiy qism, tugmalar  |
| `data-toggle="modal"` + `data-target` | Ochuvchi tugma                    |
| `data-dismiss="modal"` | Yopuvchi tugma                                  |

Ochilganda plagin modalga `.in` klassini va `display: block` beradi, orqaga `.modal-backdrop` qo‘shadi. Modal **Esc** tugmasi yoki orqa fonga bosish bilan ham yopiladi.

## O‘lcham

```html
<div class="modal-dialog modal-lg">...</div>  <!-- keng -->
<div class="modal-dialog modal-sm">...</div>  <!-- tor -->
```

## Foydalanish imkoniyati

- `role="dialog"` va `aria-labelledby` (sarlavha `id` si) — ekran o‘quvchi oynani nomi bilan e’lon qiladi;
- `tabindex="-1"` — modalga fokus berish mumkin bo‘ladi;
- yopish tugmasida `aria-label="Yopish"`.

Modal ichidagi matn qisqa va aniq bo‘lsin: sarlavha — savol, tugmalar — amal nomi (“O‘chirish”, “Bekor qilish”), “Ha/Yo‘q” emas.

## JavaScript orqali

```js
$('#oyna').modal('show');
$('#oyna').modal('hide');
$('#oyna').on('hidden.bs.modal', function () {
  console.log('Modal yopildi');
});
```

`show.bs.modal`, `shown.bs.modal`, `hide.bs.modal`, `hidden.bs.modal` — modal hodisalari.

## Xulosa

- `.modal.fade` > `.modal-dialog` > `.modal-content` > header/body/footer.
- Ochish: `data-toggle="modal" data-target="#id"`; yopish: `data-dismiss="modal"`.
- O‘lcham: `.modal-lg`, `.modal-sm`; accessibility: `role`, `aria-labelledby`, `tabindex`.
