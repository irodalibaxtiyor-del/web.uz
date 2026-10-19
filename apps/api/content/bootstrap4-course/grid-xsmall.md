## Eng kichik ekran uchun setka

Bootstrap 4 da eng kichik sinf uchun prefiks yo‘q: `.col-*`. Bu klasslar **har doim** ishlaydi — telefonda ham, kompyuterda ham.

```html
<div class="row">
  <div class="col-6">Chap</div>
  <div class="col-6">O‘ng</div>
</div>
```

Har qanday ekranda ikki teng ustun.

## Avtomatik kenglik

```html
<div class="row">
  <div class="col">1</div>
  <div class="col">2</div>
  <div class="col">3</div>
</div>
```

`.col` — bo‘sh joyni teng taqsimlaydi. Bitta ustunga kenglik berilsa, qolganlari qolgan joyni bo‘lishadi:

```html
<div class="row">
  <div class="col">Avto</div>
  <div class="col-6">Yarim</div>
  <div class="col">Avto</div>
</div>
```

## Kontent kengligida: `.col-auto`

```html
<div class="row align-items-center">
  <div class="col-auto"><img src="logo.png" alt="Logo" width="40"></div>
  <div class="col">WEBDIZAYN — veb-dizayn maktabi</div>
</div>
```

`.col-auto` — ustun kontentiga qarab kenglik oladi (rasm kengligi), qolgan joy `.col` ga.

## Qachon `.col-*` (xs) kerak?

Bloklar telefonda ham yonma-yon turishi kerak bo‘lganda:

- ikonka + matn;
- kichik statistika kartalari (2 ta yonma-yon);
- tugmalar qatori;
- rasmlar galereyasi (`col-4` — uchtadan).

Katta kontent (matn, forma) telefonda ustma-ust bo‘lgani ma’qul — buning uchun kattaroq sinf (`col-sm-*`, `col-md-*`) tanlanadi.

## Bir qatorda ko‘p ustun: `row-cols-*`

Bootstrap 4.4 dan qatorning o‘ziga “bir qatorda nechta” ni aytish mumkin:

```html
<div class="row row-cols-2">
  <div class="col">1</div>
  <div class="col">2</div>
  <div class="col">3</div>
  <div class="col">4</div>
</div>
```

Natija: ikki qatorda ikkitadan. Har bir bolaga alohida `col-6` yozish shart emas.

## Xulosa

- `.col-N` — har doim ishlaydi (xs uchun prefiks yo‘q).
- `.col` — teng taqsim, `.col-auto` — kontent kengligi.
- `.row-cols-N` — bir qatordagi ustunlar soni.
