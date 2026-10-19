## Dropdown

Bootstrap 4 da menyu bandlari `<li>` emas, to‘g‘ridan-to‘g‘ri `.dropdown-item` klassli havola yoki tugma:

```html
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="kursMenyu"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Kurslar
  </button>
  <div class="dropdown-menu" aria-labelledby="kursMenyu">
    <a class="dropdown-item" href="#">HTML</a>
    <a class="dropdown-item" href="#">CSS</a>
    <a class="dropdown-item" href="#">JavaScript</a>
  </div>
</div>
```

- `.dropdown-toggle` — o‘zi kichik strelka chizadi (Bootstrap 3 dagi `.caret` kerak emas);
- ochilganda `.dropdown-menu` ga **`.show`** klassi qo‘shiladi (Bootstrap 3 da ota elementga `.open`);
- joylashuvni **Popper** hisoblaydi — menyu ekrandan chiqib ketmaydi.

## Menyu ichida

```html
<div class="dropdown-menu">
  <h6 class="dropdown-header">Frontend</h6>
  <a class="dropdown-item" href="#">HTML</a>
  <a class="dropdown-item active" href="#">CSS</a>
  <div class="dropdown-divider"></div>
  <h6 class="dropdown-header">Backend</h6>
  <a class="dropdown-item disabled" href="#" tabindex="-1" aria-disabled="true">Python</a>
  <span class="dropdown-item-text">Bosilmaydigan matn</span>
</div>
```

## Yo‘nalish

```html
<div class="btn-group dropup">…</div>     <!-- yuqoriga -->
<div class="btn-group dropright">…</div>  <!-- o‘ngga -->
<div class="btn-group dropleft">…</div>   <!-- chapga -->
```

Menyuni o‘ng chetga tekislash: `.dropdown-menu-right` (yoki ekranga qarab `.dropdown-menu-lg-right`).

## Split button

```html
<div class="btn-group">
  <button type="button" class="btn btn-danger">Saqlash</button>
  <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="sr-only">Boshqa variantlar</span>
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Qoralama</a>
  </div>
</div>
```

## O‘lcham

Tugma o‘lchami bilan: `.btn-lg`, `.btn-sm` — menyu o‘zgarmaydi.

## JavaScript orqali

```js
$('#kursMenyu').dropdown('toggle');
$('.dropdown').on('shown.bs.dropdown', function () { /* … */ });
```

## Xulosa

- `.dropdown` > `button.dropdown-toggle[data-toggle="dropdown"]` + `div.dropdown-menu` > `a.dropdown-item`.
- Ochilganda menyuga `.show` qo‘shiladi.
- `.dropdown-header`, `.dropdown-divider`, `.dropdown-item.active|.disabled`.
- Yo‘nalish: `.dropup`, `.dropright`, `.dropleft`; tekislash: `.dropdown-menu-right`.
