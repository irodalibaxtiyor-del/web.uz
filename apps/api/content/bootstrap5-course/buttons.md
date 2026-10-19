## Tugmalar

```html
<button type="button" class="btn btn-primary">Asosiy</button>
<button type="button" class="btn btn-secondary">Ikkinchi darajali</button>
<button type="button" class="btn btn-success">Muvaffaqiyat</button>
<button type="button" class="btn btn-danger">Xavf</button>
<button type="button" class="btn btn-warning">Diqqat</button>
<button type="button" class="btn btn-info">Ma’lumot</button>
<button type="button" class="btn btn-light">Och</button>
<button type="button" class="btn btn-dark">To‘q</button>
<button type="button" class="btn btn-link">Havola</button>
```

Chegarali: `.btn-outline-primary`, `.btn-outline-danger` va h.k.

## O‘lcham

```html
<button class="btn btn-primary btn-lg">Katta</button>
<button class="btn btn-primary">Oddiy</button>
<button class="btn btn-primary btn-sm">Kichik</button>
```

## Blok tugma — `.btn-block` yo‘q!

Bootstrap 5 da `.btn-block` olib tashlangan. To‘liq kenglikdagi tugmalar **grid utilitasi** bilan yasaladi:

```html
<div class="d-grid">
  <button class="btn btn-success" type="button">Ro‘yxatdan o‘tish</button>
</div>

<div class="d-grid gap-2">
  <button class="btn btn-primary" type="button">Saqlash</button>
  <button class="btn btn-outline-secondary" type="button">Bekor qilish</button>
</div>
```

- `d-grid` — tugmalar to‘liq kenglikda;
- `gap-2` — ular orasida masofa.

Moslashuvchan variant — telefonda to‘liq kenglik, `md` dan oddiy, o‘ngda:

```html
<div class="d-grid gap-2 d-md-flex justify-content-md-end">
  <button class="btn btn-outline-secondary me-md-2" type="button">Bekor qilish</button>
  <button class="btn btn-primary" type="button">Saqlash</button>
</div>
```

Faqat yarim kenglik: `<div class="d-grid gap-2 col-6 mx-auto">`.

## Holatlar

```html
<button class="btn btn-primary active" aria-pressed="true">Faol</button>
<button class="btn btn-primary" disabled>O‘chirilgan</button>
<a class="btn btn-primary disabled" role="button" aria-disabled="true">O‘chirilgan havola</a>
```

O‘chirilgan `<a>` da `href` ni olib tashlash yoki `tabindex="-1"` berish kerak — aks holda klaviatura bilan ochilishi mumkin.

## Almashtiriladigan tugma

```html
<button type="button" class="btn btn-outline-primary" data-bs-toggle="button" aria-pressed="false">
  Sevimlilarga
</button>
```

`data-bs-toggle="button"` — har bosishda `.active` va `aria-pressed` almashadi.

## Spinnerli tugma

```html
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
  <span role="status">Yuklanmoqda…</span>
</button>
```

## O‘z rangingiz: CSS o‘zgaruvchilar

Bootstrap 5.3 tugmalari CSS o‘zgaruvchilar bilan bezalgan, rangni CSS’da tez almashtirish mumkin:

```css
.btn-brend {
  --bs-btn-bg: #fec400;
  --bs-btn-color: #0e1133;
  --bs-btn-border-color: #e0ad00;
  --bs-btn-hover-bg: #e0ad00;
}
```

```html
<button class="btn btn-brend">Sariq tugma</button>
```

## Xulosa

- `.btn` + `-primary` … `-link`, chegarali `-outline-*`, o‘lcham `-lg|-sm`.
- `.btn-block` yo‘q — `d-grid` (+ `gap-2`, `d-md-flex`).
- `data-bs-toggle="button"`; o‘z rangingiz — `--bs-btn-*` o‘zgaruvchilari.
