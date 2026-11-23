## Tooltip

```html
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-title="Profilni tahrirlash">
  Tahrirlash
</button>
```

Matn `data-bs-title` (yoki oddiy `title`) dan olinadi, joylashuv `data-bs-placement`: `top`, `bottom`, `left`, `right`.

## Yoqish — jQuery’siz

Tooltiplar avtomatik yoqilmaydi. Bootstrap 5 da sof JavaScript bilan:

```js
const elementlar = document.querySelectorAll('[data-bs-toggle="tooltip"]');
elementlar.forEach((el) => new bootstrap.Tooltip(el));
```

yoki:

```js
document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach((el) => bootstrap.Tooltip.getOrCreateInstance(el));
```

Bu kod `bootstrap.bundle.min.js` dan **keyin** bajarilishi kerak (masalan, o‘z `script.js` faylingizda).

Bootstrap 4 bilan solishtiring:

```js
// Bootstrap 4 (jQuery)
$('[data-toggle="tooltip"]').tooltip();
// Bootstrap 5
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
```

## Rangli tooltip

5.3 da CSS o‘zgaruvchilar bilan:

```css
.qizil-tooltip {
  --bs-tooltip-bg: var(--bs-danger);
  --bs-tooltip-color: var(--bs-white);
}
```

```html
<button class="btn btn-danger" data-bs-toggle="tooltip" data-bs-custom-class="qizil-tooltip"
        data-bs-title="Bu amalni qaytarib bo‘lmaydi">O‘chirish</button>
```

`data-bs-custom-class` — tooltip elementiga qo‘shimcha klass beradi.

## HTML kontent va xavfsizlik

`data-bs-html="true"` bilan HTML ishlatish mumkin, lekin faqat ishonchli matn bilan. Bootstrap’ning ichki **sanitizer**i ruxsat etilmagan teg va atributlarni (masalan, `<script>`, `onclick`) olib tashlaydi.

## O‘chirilgan element

```html
<span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" data-bs-title="Avval kursga yoziling">
  <button class="btn btn-primary" type="button" disabled>Boshlash</button>
</span>
```

## JavaScript usullari

```js
const t = bootstrap.Tooltip.getInstance('#tugma');
t.show();
t.hide();
t.setContent({ '.tooltip-inner': 'Yangi matn' }); // 5.2 dan
t.dispose();
```

```tekshir
Bootstrap 5 da sahifadagi barcha tooltiplarni qanday yoqish mumkin?
+ `document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el))`
- `$('[data-toggle="tooltip"]').tooltip()` (jQuery shart)
- ular avtomatik yoqiladi
> Bootstrap 5 jQuery’siz: har element uchun `new bootstrap.Tooltip(el)`.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <p class="mt-4"><button class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Saqlash: Ctrl + S">Ustiga olib keling</button></p>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script>
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
</script>
```

## Xulosa

- `data-bs-toggle="tooltip"` + `data-bs-title` + `data-bs-placement`.
- Yoqish: `querySelectorAll(...).forEach(el => new bootstrap.Tooltip(el))`.
- `data-bs-custom-class`, `--bs-tooltip-*`; HTML — faqat ishonchli matn.
