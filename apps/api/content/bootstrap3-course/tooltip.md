## Tooltip

**Tooltip** — sichqoncha element ustiga olib borilganda (yoki element fokus olganda) chiqadigan kichik qora izoh. U qisqa tushuntirish uchun: tugma nima qilishi, qisqartmaning ma’nosi.

```html
<button type="button" class="btn btn-default" data-toggle="tooltip" title="Profilni tahrirlash">
  <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
  <span class="sr-only">Profilni tahrirlash</span>
</button>
```

Izoh matni `title` atributidan olinadi.

## Muhim: tooltip o‘zi yoqilmaydi

Boshqa plaginlardan farqli ravishda **tooltip va popover JavaScript bilan yoqiladi** (unumdorlik uchun). Sahifa oxirida, jQuery va Bootstrap’dan keyin:

```html
<script>
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
</script>
```

- `$(function () { ... })` — DOM tayyor bo‘lgandan keyin bajariladi;
- `$('[data-toggle="tooltip"]')` — atributi bor barcha elementlar;
- `.tooltip()` — har biriga tooltip plaginini ulaydi.

Bu kodsiz `data-toggle="tooltip"` hech narsa qilmaydi — faqat brauzerning oddiy `title` izohi chiqadi.

## Joylashuv

`data-placement` — `top` (standart), `bottom`, `left`, `right`:

```html
<a href="#" data-toggle="tooltip" data-placement="bottom" title="Bosh sahifaga qaytish">Bosh sahifa</a>
```

`auto` qo‘shilsa (`"auto top"`), joy yetmasa qarama-qarshi tomonga o‘tadi.

## Boshqa sozlamalar

| Atribut          | Ma’nosi                                          |
| ---------------- | ------------------------------------------------ |
| `data-trigger`   | `hover focus` (standart), `click`, `manual`      |
| `data-delay`     | Ko‘rinish kechikishi, ms                         |
| `data-container` | Tooltip qaysi elementga qo‘shiladi (`"body"`)    |

Ular JavaScript orqali ham beriladi:

```js
$('#tugma').tooltip({ placement: 'right', trigger: 'hover focus' });
$('#tugma').tooltip('show');
```

## Qachon tooltip ishlatmaslik kerak?

- **Muhim ma’lumot uchun emas.** Telefonda “hover” yo‘q — izohni hech kim ko‘rmasligi mumkin.
- O‘chirilgan (`disabled`) tugmaga to‘g‘ridan-to‘g‘ri tooltip ishlamaydi — uni o‘rab turgan `<span>` ga bering.
- Tooltip faqat qo‘shimcha tushuntirish. Elementning nomi baribir `aria-label` yoki `.sr-only` matn bilan berilishi kerak.

## Xulosa

- `data-toggle="tooltip"` + `title="…"`.
- **Yoqish shart:** `$('[data-toggle="tooltip"]').tooltip();`.
- Joylashuv: `data-placement="top|bottom|left|right"`.
