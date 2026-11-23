## Popover

```html
<button type="button" class="btn btn-info" data-bs-toggle="popover" data-bs-placement="right"
        data-bs-title="Sertifikat" data-bs-content="Yakuniy loyihani topshirgandan keyin beriladi.">
  Sertifikat haqida
</button>
```

```js
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach((el) => new bootstrap.Popover(el));
```

Popover sarlavhasi `.popover-header`, matni `.popover-body` ichida chiziladi.

## Boshqa joyga bosilganda yopilish

```html
<a tabindex="0" class="btn btn-outline-primary" role="button" data-bs-toggle="popover"
   data-bs-trigger="focus" data-bs-title="Eslatma" data-bs-content="Boshqa joyga bosing — yopiladi.">
  Eslatma
</a>
```

`data-bs-trigger`: `click` (standart), `hover`, `focus`, `manual` yoki birlashma: `"hover focus"`.

## Konteyner

Popover odatda `body` oxiriga qo‘shiladi. Modal ichida to‘g‘ri ko‘rinishi uchun:

```js
new bootstrap.Popover(el, { container: '#oyna' });
```

## Rang va o‘lcham

```css
.kurs-popover {
  --bs-popover-max-width: 300px;
  --bs-popover-header-bg: var(--bs-primary);
  --bs-popover-header-color: var(--bs-white);
}
```

```html
<button data-bs-toggle="popover" data-bs-custom-class="kurs-popover" …>…</button>
```

## Kontentni kod bilan berish

```js
const p = new bootstrap.Popover('#kurs', {
  title: 'Bootstrap 5',
  content: '49 dars, 8 modul',
  placement: 'bottom',
  trigger: 'hover focus'
});
```

## Tooltip va popover

| Komponent | Kontent                | Odatda           |
| --------- | ---------------------- | ---------------- |
| Tooltip   | Bir necha so‘z         | hover / fokus    |
| Popover   | Sarlavha + qisqa matn  | bosish           |

Popover ichiga forma yoki uzun matn qo‘ymang — buning uchun modal yoki offcanvas bor.

```tekshir
Bootstrap 5 da popover boshqa joyga bosilganda yopilishi uchun nima yoziladi?
+ `data-bs-trigger="focus"`
- `data-trigger="focus"`
- `data-bs-close="outside"`
> Popover ham `new bootstrap.Popover(el)` bilan yoqiladi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <p class="mt-3"><button type="button" class="btn btn-info" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-title="Popover" data-bs-content="Boshqa joyga bosing — yopiladi.">Bosing</button></p>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script>
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => new bootstrap.Popover(el));
</script>
```

## Xulosa

- `data-bs-toggle="popover"` + `data-bs-title` + `data-bs-content`.
- Yoqish: `new bootstrap.Popover(el)`; qismlar — `.popover-header`, `.popover-body`.
- `data-bs-trigger="focus"` (`tabindex="0"` bilan), `container`, `data-bs-custom-class`.
