## Setka tizimi chuqurroq

Bootstrap 4 setkasi Flexbox’da qurilgan:

- `.row` — `display: flex; flex-wrap: wrap;` va chap/o‘ngda −15px margin;
- har bir ustun — 15px chap va o‘ng padding (oraliq — *gutter*);
- `.col-*-N` — `flex: 0 0 N/12; max-width: N/12`.

## Beshta sinf

| Sinf | Klass        | Ekran      | `.container` |
| ---- | ------------ | ---------- | ------------ |
| xs   | `.col-`      | < 576px    | 100%         |
| sm   | `.col-sm-`   | ≥ 576px    | 540px        |
| md   | `.col-md-`   | ≥ 768px    | 720px        |
| lg   | `.col-lg-`   | ≥ 992px    | 960px        |
| xl   | `.col-xl-`   | ≥ 1200px   | 1140px       |

Qoida o‘zgarmagan: klass **o‘z sinfida va undan katta** ekranlarda ishlaydi.

## Offset

Bootstrap 4 da offset klassi qisqardi: `col-md-offset-3` → **`offset-md-3`**.

```html
<div class="row">
  <div class="col-md-6 offset-md-3">Markazdagi ustun</div>
</div>
```

Flex bo‘lgani uchun **auto margin** ham ishlaydi:

```html
<div class="row">
  <div class="col-md-4">Chap</div>
  <div class="col-md-4 ml-auto">O‘ng chetga surilgan</div>
</div>
```

## Tartib: `order-*`

Bootstrap 3 dagi push/pull o‘rniga Flexbox `order`:

```html
<div class="row">
  <div class="col-md-8 order-md-2">Asosiy kontent (HTML’da birinchi)</div>
  <div class="col-md-4 order-md-1">Yon panel (ekranda chapda)</div>
</div>
```

`order-first` va `order-last` ham bor. Ko‘rinishdagi tartib klaviatura tartibini o‘zgartirmaydi.

## Oraliqsiz qator

```html
<div class="row no-gutters">
  <div class="col-6">…</div>
  <div class="col-6">…</div>
</div>
```

`.no-gutters` — ustunlar padding’i va qator margin’i nolga tushadi (masalan, rasmlar galereyasi uchun).

## Vertikal va gorizontal tekislash

```html
<div class="row align-items-center" style="height: 200px;">…</div>   <!-- hamma ustun markazda -->
<div class="row justify-content-center">
  <div class="col-4">Markazdagi ustun (offsetsiz)</div>
</div>
<div class="row">
  <div class="col align-self-end">Faqat shu ustun pastda</div>
</div>
```

## Qatorni majburan uzish

```html
<div class="row">
  <div class="col">1</div>
  <div class="col">2</div>
  <div class="w-100"></div>  <!-- yangi qator -->
  <div class="col">3</div>
  <div class="col">4</div>
</div>
```

## Ichma-ich setka

Ustun ichida yangi `.row` — u ham 12 ga bo‘linadi.

## Xulosa

- Flex setka: `.row` (wrap), ustunlar `flex` va `max-width` bilan.
- Offset: `offset-md-3` yoki `ml-auto`; tartib: `order-*`.
- `no-gutters`, `align-items-*`, `justify-content-*`, `w-100` bilan qator uzish.
