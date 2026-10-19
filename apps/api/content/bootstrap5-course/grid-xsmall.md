## Eng kichik ekran (xs)

Prefikssiz `.col-*` va `.col` har doim ishlaydi — telefonda ham:

```html
<div class="row">
  <div class="col-6">Chap</div>
  <div class="col-6">O‘ng</div>
</div>
```

## Avtomatik va kontent kengligi

```html
<div class="row align-items-center">
  <div class="col-auto"><img src="logo.png" alt="Logo" width="40" height="40"></div>
  <div class="col">WEBDIZAYN — veb-dizayn maktabi</div>
  <div class="col-auto"><button class="btn btn-sm btn-primary">Kirish</button></div>
</div>
```

| Klass       | Kenglik                           |
| ----------- | --------------------------------- |
| `.col`      | Bo‘sh joyni teng taqsimlaydi      |
| `.col-auto` | Kontent kengligida                |
| `.col-N`    | Aniq N/12                         |

## `row-cols-*`

```html
<div class="row row-cols-3 g-2">
  <div class="col"><img src="1.jpg" class="img-fluid rounded" alt="1-surat"></div>
  <div class="col"><img src="2.jpg" class="img-fluid rounded" alt="2-surat"></div>
  <div class="col"><img src="3.jpg" class="img-fluid rounded" alt="3-surat"></div>
  <div class="col"><img src="4.jpg" class="img-fluid rounded" alt="4-surat"></div>
</div>
```

Telefonda ham uchtadan — rasm galereyasi uchun qulay. `.row-cols-auto` — har bir ustun kontent kengligida.

## Telefon uchun yaxshi amaliyot

- Matn va formalarni telefonda **bitta ustunda** qoldiring — `col-*` faqat kichik bloklar uchun.
- Bosiladigan elementlar kamida 44×44px bo‘lsin — tor ustunda tugmalar mayda bo‘lib qolmasin.
- Gorizontal aylanish paydo bo‘lmasligini tekshiring (qatordagi ustunlar yig‘indisi 12 dan oshmasin, keng rasmlarga `img-fluid`).

## Xulosa

- `.col-N` — har doim; `.col` — teng; `.col-auto` — kontent kengligi.
- `.row-cols-N` — qatordagi ustunlar soni (telefonda ham).
- Telefonda katta kontent bitta ustunda bo‘lgani ma’qul.
