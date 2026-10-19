## Bootstrap formalari

Bootstrap forma elementlariga bir xil balandlik, chegara, yumaloq burchak va fokus effekti beradi. Asosiy qoidalar:

- har bir `<input>`, `<textarea>`, `<select>` ga **`.form-control`** klassi beriladi — u elementni 100% kenglikka cho‘zadi;
- yorliq (`<label>`) va maydon **`.form-group`** ichiga olinadi — guruhlar orasida bo‘sh joy hosil bo‘ladi.

## Vertikal forma (standart)

```html
<form>
  <div class="form-group">
    <label for="email">Email:</label>
    <input type="email" class="form-control" id="email" placeholder="ism@misol.uz">
  </div>
  <div class="form-group">
    <label for="parol">Parol:</label>
    <input type="password" class="form-control" id="parol">
  </div>
  <div class="checkbox">
    <label><input type="checkbox"> Meni eslab qol</label>
  </div>
  <button type="submit" class="btn btn-primary">Kirish</button>
</form>
```

Yorliq maydon ustida, maydon to‘liq kenglikda turadi. Telefon uchun eng qulay ko‘rinish.

## Qatorli forma (inline)

`<form class="form-inline">` — barcha elementlar bitta qatorda (768px dan keng ekranda):

```html
<form class="form-inline">
  <div class="form-group">
    <label for="qidiruv" class="sr-only">Qidiruv</label>
    <input type="text" class="form-control" id="qidiruv" placeholder="Kurs nomi">
  </div>
  <button type="submit" class="btn btn-default">Qidirish</button>
</form>
```

Yorliqni ko‘rsatmasangiz ham uni yozing va `.sr-only` bilan yashiring — `placeholder` yorliq o‘rnini bosmaydi (u yozish boshlanganda yo‘qoladi va ekran o‘quvchi uni har doim ham o‘qimaydi).

## Gorizontal forma

`<form class="form-horizontal">` — yorliq chapda, maydon o‘ngda. Bunda `.form-group` setka qatori (`.row`) kabi ishlaydi va yorliq hamda maydon ustunlarga bo‘linadi:

```html
<form class="form-horizontal">
  <div class="form-group">
    <label class="control-label col-sm-2" for="ism">Ism:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="ism">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-primary">Yuborish</button>
    </div>
  </div>
</form>
```

- `.control-label` — yorliqni o‘ngga tekislaydi va maydon bilan bir balandlikka keltiradi;
- `.col-sm-offset-2` — tugmani yorliqlar ustuni kengligicha suradi.

## Uch turni solishtirish

| Klass              | Ko‘rinish                       | Qachon                      |
| ------------------ | ------------------------------- | --------------------------- |
| (yo‘q)             | Yorliq ustida, maydon to‘liq    | Ko‘pchilik formalar, mobil  |
| `.form-inline`     | Hammasi bir qatorda             | Qidiruv, obuna, filtr       |
| `.form-horizontal` | Yorliq chapda, maydon o‘ngda    | Sozlamalar, uzun formalar   |

## Xulosa

- Maydon — `.form-control`, guruh — `.form-group`.
- `label for` va maydon `id` mos bo‘lsin.
- `.form-inline` — bir qator, `.form-horizontal` — setka bilan ikki ustun (`.control-label`).
