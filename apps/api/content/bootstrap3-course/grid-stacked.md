## Ustma-ustdan yonma-yonga

Eng oddiy moslashuvchan setka bitta ekran sinfidan foydalanadi. Bu sinfdan **kichik** ekranda ustunlar ustma-ust (stacked) turadi, **katta** ekranda esa yonma-yon (horizontal) tiziladi.

```html
<div class="container">
  <div class="row">
    <div class="col-sm-6">Chap yarmi</div>
    <div class="col-sm-6">O‘ng yarmi</div>
  </div>
  <div class="row">
    <div class="col-sm-4">1</div>
    <div class="col-sm-4">2</div>
    <div class="col-sm-4">3</div>
  </div>
</div>
```

| Ekran         | Natija                                      |
| ------------- | ------------------------------------------- |
| < 768px       | Har bir blok to‘liq kenglikda, ustma-ust    |
| ≥ 768px       | Bloklar yonma-yon, foizdagi kenglikda       |

## Nega bu ishlaydi?

`col-sm-*` uslublari CSS’da media so‘rov ichida yozilgan:

```css
@media (min-width: 768px) {
  .col-sm-6 { float: left; width: 50%; }
}
```

768px dan tor ekranda bu qoida umuman ishlamaydi: blok oddiy `div` kabi — `float` yo‘q, kenglik 100%. Shu sababli bloklar tabiiy ravishda ustma-ust tushadi.

## Qaysi sinfni tanlash kerak?

Bloklar **qachondan boshlab** yonma-yon tursin, shuni o‘ylang:

| Klass       | Yonma-yon bo‘ladi | Qachon qulay                              |
| ----------- | ----------------- | ----------------------------------------- |
| `.col-xs-*` | Doim              | Kichik elementlar: ikonka va matn, tugmalar |
| `.col-sm-*` | ≥ 768px           | Ko‘pchilik maketlar                       |
| `.col-md-*` | ≥ 992px           | Ko‘p ustunli, zich kontent                |
| `.col-lg-*` | ≥ 1200px          | Faqat juda keng ekranda yonma-yon kerak bo‘lsa |

## Konteyner va to‘liq kenglik

Xuddi shu setka `.container-fluid` ichida ham ishlaydi — farqi faqat tashqi kenglikda:

```html
<div class="container-fluid">
  <div class="row">
    <div class="col-sm-3" style="background: #f5f5f5;">Menyu</div>
    <div class="col-sm-9">Asosiy kontent</div>
  </div>
</div>
```

## Brauzerda sinab ko‘ring

Natijani tekshirishning eng yaxshi usuli — oynani toraytirib-kengaytirish yoki DevTools’dagi “qurilma rejimi” (Ctrl + Shift + M). 768px chegarasida bloklar qanday “sakrashini” kuzating.

## Xulosa

- Bitta sinf: kichik ekranda ustma-ust, katta ekranda yonma-yon.
- Sababi — ustun uslublari `min-width` media so‘rov ichida.
- Sinfni bloklar qachondan yonma-yon bo‘lishi kerakligiga qarab tanlang.
