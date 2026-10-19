## Noutbuk (lg)

`.col-lg-*` 992px dan, `.container` — 960px.

```html
<div class="row g-4">
  <div class="col-md-6 col-lg-3">Kurs 1</div>
  <div class="col-md-6 col-lg-3">Kurs 2</div>
  <div class="col-md-6 col-lg-3">Kurs 3</div>
  <div class="col-md-6 col-lg-3">Kurs 4</div>
</div>
```

| Ekran       | Bir qatorda |
| ----------- | ----------- |
| < 768px     | 1           |
| 768–991px   | 2           |
| ≥ 992px     | 4           |

## O‘qish uchun qulay ustun

```html
<div class="row justify-content-center">
  <article class="col-md-10 col-lg-8">…</article>
</div>
```

Bir qatorda 60–80 belgi o‘qish uchun eng qulay. Keng ekranda matnni torroq ustunga joylang.

## Faqat `lg` dan yonma-yon

```html
<div class="row">
  <div class="col-lg-7">Video</div>
  <div class="col-lg-5">Dars rejasi</div>
</div>
```

Planshetda video va reja ustma-ust (har biri to‘liq kenglikda), noutbukda yonma-yon.

## Yopishqoq yon panel

```html
<div class="row">
  <aside class="col-lg-3">
    <div class="sticky-lg-top pt-3">Mundarija</div>
  </aside>
  <main class="col-lg-9">…</main>
</div>
```

`.sticky-lg-top` — faqat `lg` dan aylantirganda tepada yopishib qoladi; telefonda oddiy blok.

## Xulosa

- `col-lg-*` — 992px dan, `.container` 960px.
- `col-md-6 col-lg-3` — 1 / 2 / 4 ustun.
- Tor matn ustuni: `justify-content-center` + `col-lg-8`; `.sticky-lg-top`.
