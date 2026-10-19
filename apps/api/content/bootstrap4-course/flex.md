## Flex utilitalari

Bootstrap 4 Flexbox’ni klasslar bilan boshqarish imkonini beradi. Avval konteynerni flex qilamiz:

```html
<div class="d-flex p-2 bg-light">
  <div class="p-2 border">1</div>
  <div class="p-2 border">2</div>
  <div class="p-2 border">3</div>
</div>
```

`.d-inline-flex` — konteynerning o‘zi qator ichida.

## Yo‘nalish

| Klass                | Natija            |
| -------------------- | ----------------- |
| `.flex-row`          | Qator (standart)  |
| `.flex-row-reverse`  | Teskari qator     |
| `.flex-column`       | Ustun             |
| `.flex-column-reverse` | Teskari ustun   |

Ekranga qarab: `.flex-column .flex-md-row` — telefonda ustun, `md` dan qator.

## Asosiy o‘q bo‘ylab: `justify-content-*`

```html
<div class="d-flex justify-content-start">…</div>
<div class="d-flex justify-content-end">…</div>
<div class="d-flex justify-content-center">…</div>
<div class="d-flex justify-content-between">…</div>
<div class="d-flex justify-content-around">…</div>
```

`between` — chetdagilar chetga, qolgan joy orasida teng. Navbar, karta sarlavhasi, ro‘yxat bandi uchun juda ko‘p ishlatiladi.

## Kesuvchi o‘q bo‘ylab: `align-items-*`

`align-items-start`, `-end`, `-center`, `-baseline`, `-stretch` (standart).

```html
<div class="d-flex align-items-center" style="height: 100px;">
  <span>Vertikal markazda</span>
</div>
```

Bitta element uchun: `.align-self-center`, `.align-self-end` va h.k.

## Elementlarning o‘lchami

| Klass          | Natija                                        |
| -------------- | --------------------------------------------- |
| `.flex-fill`   | Elementlar bo‘sh joyni kontentiga qarab taqsimlaydi |
| `.flex-grow-1` | Element qolgan joyni egallaydi               |
| `.flex-shrink-1` / `-0` | Siqilishi mumkin/mumkin emas         |

```html
<div class="d-flex">
  <input class="form-control flex-grow-1 mr-2" aria-label="Qidiruv">
  <button class="btn btn-primary">Qidirish</button>
</div>
```

## Auto margin

Flex konteynerda `ml-auto` elementni va undan keyingilarni o‘ng chetga suradi:

```html
<div class="d-flex">
  <div class="p-2">Logo</div>
  <div class="p-2">Kurslar</div>
  <div class="p-2 ml-auto">Kirish</div>
</div>
```

## Tartib va qatorga o‘tish

```html
<div class="d-flex flex-wrap">…</div>           <!-- sig‘masa keyingi qatorga -->
<div class="order-3">Birinchi yozilgan</div>    <!-- ko‘rinishda uchinchi -->
<div class="order-1">…</div>
```

`order-0` … `order-12`, ekranga qarab `order-md-1`. Tartibni ko‘rinishda o‘zgartirish klaviatura tartibini o‘zgartirmaydi — muhim kontentni HTML’da ham to‘g‘ri tartibda yozing.

## Xulosa

- `d-flex` → `flex-row|column`, `justify-content-*`, `align-items-*`.
- `flex-fill`, `flex-grow-1`, `ml-auto`, `flex-wrap`, `order-*`.
- Ekran sinflari bilan: `flex-md-row`, `justify-content-lg-between`.
