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

```tekshir
Bootstrap 3’da tooltip nega `data-toggle="tooltip"` yozilgandan keyin ham chiqmaydi?
+ uni JavaScript bilan o‘zingiz yoqishingiz kerak: `$('[data-toggle="tooltip"]').tooltip()`
- tooltip faqat rasmlarda ishlaydi
- `title` atributi taqiqlangan
> Tezlik uchun tooltip va popover avtomatik yoqilmaydi (opt-in).
```

```jonli
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<div class="container" style="padding-top: 15px">
  <p style="margin-top: 40px"><button class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Saqlash: Ctrl + S">Ustiga olib keling</button></p>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<script>
  $('[data-toggle="tooltip"]').tooltip();
</script>
```

## Xulosa

- `data-toggle="tooltip"` + `title="…"`.
- **Yoqish shart:** `$('[data-toggle="tooltip"]').tooltip();`.
- Joylashuv: `data-placement="top|bottom|left|right"`.
