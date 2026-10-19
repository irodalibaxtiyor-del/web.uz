## Katta ekran uchun setka (`lg`)

`col-lg-*` 1200px va undan keng ekranlarda ishlaydi. Bu yerda `.container` kengligi 1170px — ko‘proq ustun sig‘adi.

```html
<div class="row">
  <div class="col-sm-6 col-md-4 col-lg-3">Kurs</div>
  <div class="col-sm-6 col-md-4 col-lg-3">Kurs</div>
  <div class="col-sm-6 col-md-4 col-lg-3">Kurs</div>
  <div class="col-sm-6 col-md-4 col-lg-3">Kurs</div>
</div>
```

| Ekran          | Bir qatorda |
| -------------- | ----------- |
| < 768px        | 1           |
| 768–991px      | 2           |
| 992–1199px     | 3           |
| ≥ 1200px       | 4           |

## Faqat `lg` yozilsa

```html
<div class="col-lg-6">...</div>
<div class="col-lg-6">...</div>
```

1200px dan tor **barcha** ekranlarda (noutbuk ham!) bloklar ustma-ust bo‘ladi. Ko‘pincha bu kutilgan natija emas — `md` yoki `sm` yetarli bo‘lishini tekshiring.

## Bir xil sinf takrorlansa

```html
<div class="col-md-6 col-lg-6">...</div>
```

`col-lg-6` ortiqcha: `col-md-6` allaqachon katta ekranlarda ham ishlaydi. Klassni faqat **nisbat o‘zgaradigan** sinf uchun yozing.

## Katta ekrandagi push/pull

```html
<div class="row">
  <div class="col-md-8 col-lg-9 col-lg-push-3">Asosiy kontent</div>
  <div class="col-md-4 col-lg-3 col-lg-pull-9">Yon panel</div>
</div>
```

Noutbukda yon panel o‘ngda, katta monitorda — chapda.

## Kenglik juda katta bo‘lmasin

Juda keng qatorda matnni o‘qish qiyin: ko‘z qator oxiridan keyingisining boshini topishga qiynaladi. Qulay qator uzunligi — 60–80 belgi. Katta ekranda matn ustunini torroq qoldirish uchun offset ishlating:

```html
<div class="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
  <article>…</article>
</div>
```

## Xulosa

- `col-lg-*` — 1200px va undan katta ekran (`.container` 1170px).
- Faqat `lg` yozilsa, noutbukda ham ustma-ust — ehtiyot bo‘ling.
- Klassni nisbat o‘zgaradigan sinf uchungina yozing.
- Matn ustuni uchun qulay kenglik — 60–80 belgi.
