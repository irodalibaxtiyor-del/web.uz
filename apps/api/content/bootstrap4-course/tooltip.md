## Tooltip

```html
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top"
        title="Profilni tahrirlash">
  Tahrirlash
</button>
```

Bootstrap 4 da tooltip **Popper** kutubxonasi yordamida joylashtiriladi — shuning uchun u ekran chetiga yaqin bo‘lsa ham o‘zini to‘g‘ri tutadi. Popper `bootstrap.bundle.min.js` ichida bor.

## Yoqish shart

Tooltiplar unumdorlik sababli o‘zi yoqilmaydi:

```js
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
```

Bu kod jQuery va Bootstrap’dan **keyin** bajarilishi kerak (sahifa oxiridagi skript yoki `script.js`).

## Joylashuv

`data-placement`: `top` (standart), `bottom`, `left`, `right`.

```html
<a href="#" data-toggle="tooltip" data-placement="right" title="Bosh sahifaga qaytish">Bosh sahifa</a>
```

## HTML kontent

`data-html="true"` bilan izohda HTML ishlatish mumkin:

```html
<button class="btn btn-info" data-toggle="tooltip" data-html="true"
        title="<em>Diqqat:</em> <strong>muddat</strong> ertaga">Muddat</button>
```

> `data-html="true"` ni faqat **o‘zingiz yozgan** matn bilan ishlating. Foydalanuvchi kiritgan matnni HTML sifatida chiqarish XSS xavfini tug‘diradi. Bootstrap 4.3.1 dan boshlab xavfli teglar (masalan, `<script>`) avtomatik tozalanadi (sanitizer), lekin ehtiyot bo‘lgan ma’qul.

## O‘chirilgan elementda

`disabled` tugma sichqoncha hodisalarini qabul qilmaydi. Tooltip ko‘rinishi uchun uni o‘rab turgan elementga bering:

```html
<span class="d-inline-block" tabindex="0" data-toggle="tooltip" title="Avval kursga yoziling">
  <button class="btn btn-primary" style="pointer-events: none;" type="button" disabled>Boshlash</button>
</span>
```

## JavaScript orqali

```js
$('#tugma').tooltip({ placement: 'bottom', trigger: 'hover focus' });
$('#tugma').tooltip('show');
$('#tugma').tooltip('dispose'); // butunlay o‘chirish
```

Hodisalar: `show.bs.tooltip`, `shown.bs.tooltip`, `hide.bs.tooltip`, `hidden.bs.tooltip`.

## Esda tuting

- Tooltip — qo‘shimcha izoh. Telefonda “hover” yo‘q, shuning uchun muhim ma’lumotni tooltipga yashirmang.
- Faqat ikonkadan iborat tugmaning nomi `aria-label` yoki `.sr-only` bilan berilsin — tooltip uning o‘rnini bosmaydi.

## Xulosa

- `data-toggle="tooltip"` + `title`; yoqish: `$('[data-toggle="tooltip"]').tooltip()`.
- Joylashuv — Popper; `data-placement`.
- `data-html="true"` — faqat ishonchli matn bilan.
