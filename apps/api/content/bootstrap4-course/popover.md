## Popover

```html
<button type="button" class="btn btn-info" data-toggle="popover" title="Sertifikat"
        data-content="Yakuniy loyihani topshirgandan keyin beriladi.">
  Sertifikat haqida
</button>
```

```js
$(function () {
  $('[data-toggle="popover"]').popover();
});
```

Popover ham Popper’ga tayanadi va JavaScript bilan yoqiladi. Bootstrap 4 da popover sarlavhasi `.popover-header`, matni `.popover-body` ichida chiziladi (Bootstrap 3 da `.popover-title` va `.popover-content`).

## Joylashuv

```html
<button class="btn btn-secondary" data-toggle="popover" data-placement="top"
        title="Muddat" data-content="Har juma 23:59 gacha.">Yuqorida</button>
```

`top`, `right` (standart), `bottom`, `left`.

## Keyingi bosishda yopilish

Standart holatda popover tugmaning o‘zi qayta bosilganda yopiladi. Boshqa joyga bosilganda yopilishi uchun `data-trigger="focus"`:

```html
<a tabindex="0" class="btn btn-outline-primary" role="button" data-toggle="popover"
   data-trigger="focus" title="Eslatma" data-content="Boshqa joyga bosing — yopiladi.">
  Eslatma
</a>
```

`<button>` ba’zi brauzerlarda bosilganda fokus olmaydi, shuning uchun `<a tabindex="0">` ishlatiladi.

## Kontentni JavaScript bilan berish

```js
$('#kurs').popover({
  title: 'Bootstrap 4',
  content: '45 dars, 8 modul',
  placement: 'bottom'
});
```

## Bir yo‘la barcha popoverlarni yopish

```js
$('[data-toggle="popover"]').popover('hide');
```

## Tooltip va popover farqi

| Komponent | Ko‘rinishi              | Odatda ochilishi |
| --------- | ----------------------- | ---------------- |
| Tooltip   | Kichik qora izoh        | hover / fokus    |
| Popover   | Sarlavha + matnli quti  | bosish           |

## Xulosa

- `data-toggle="popover"` + `title` + `data-content`; yoqish: `.popover()`.
- Ichki qismlar: `.popover-header`, `.popover-body`.
- `data-trigger="focus"` — boshqa joyga bosilganda yopiladi (`tabindex="0"` bilan).
