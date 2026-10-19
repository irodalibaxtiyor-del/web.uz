## Progress bar

```html
<div class="progress">
  <div class="progress-bar" role="progressbar" style="width: 60%"
       aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">60%</div>
</div>
```

Tuzilma Bootstrap 3 dagidek: `.progress` — yo‘lak, `.progress-bar` — to‘lgan qism, kengligi `style="width: …"` bilan. Bootstrap 4 da bar Flexbox bilan chiziladi, standart balandligi `1rem` (16px).

## Balandlik

`.progress` ga `height` bering — bar o‘zi moslashadi:

```html
<div class="progress" style="height: 4px;">
  <div class="progress-bar" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

Ingichka bar ichiga matn yozmang — uni yonida yoki `.sr-only` bilan yozing.

## Rang

Bootstrap 4 da progress bar rangi **fon utilitasi** bilan:

```html
<div class="progress-bar bg-success" style="width: 25%">25%</div>
<div class="progress-bar bg-info" style="width: 50%">50%</div>
<div class="progress-bar bg-warning text-dark" style="width: 75%">75%</div>
<div class="progress-bar bg-danger" style="width: 100%">100%</div>
```

Bootstrap 3 dagi `.progress-bar-success` → `.bg-success`.

## Chiziqli va animatsiyali

```html
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar"
       style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

- `.progress-bar-striped` — diagonal chiziqlar;
- `.progress-bar-animated` — chiziqlar harakatlanadi (Bootstrap 3 dagi `.active`).

Foydalanuvchi tizimda “harakatni kamaytirish” sozlamasini yoqqan bo‘lsa (`prefers-reduced-motion`), Bootstrap animatsiyani o‘chiradi.

## Bir nechta qism

```html
<div class="progress">
  <div class="progress-bar bg-success" style="width: 40%">Darslar</div>
  <div class="progress-bar bg-warning text-dark" style="width: 20%">Mashqlar</div>
  <div class="progress-bar bg-danger" style="width: 10%">Qarzlar</div>
</div>
```

## Xulosa

- `.progress` > `.progress-bar` (`width`, `role`, `aria-value*`).
- Balandlik — `.progress` ning `height` i.
- Rang — `.bg-*`; chiziqli — `.progress-bar-striped`, harakat — `.progress-bar-animated`.
