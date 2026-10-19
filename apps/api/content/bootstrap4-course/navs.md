## Navs

Bootstrap 4 da navigatsiya bandlariga alohida klasslar bor: `.nav-item` va `.nav-link`:

```html
<ul class="nav">
  <li class="nav-item"><a class="nav-link active" href="#">Bosh sahifa</a></li>
  <li class="nav-item"><a class="nav-link" href="#">Kurslar</a></li>
  <li class="nav-item"><a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Arxiv</a></li>
</ul>
```

Bootstrap 3 dan farq: `.active` endi **havolada** (`.nav-link`), `<li>` da emas.

`<ul>` siz ham yozish mumkin:

```html
<nav class="nav">
  <a class="nav-link active" href="#">Bosh sahifa</a>
  <a class="nav-link" href="#">Kurslar</a>
</nav>
```

## Ko‘rinishlar

| Klass           | Natija                                  |
| --------------- | --------------------------------------- |
| `.nav-tabs`     | Yorliqlar                               |
| `.nav-pills`    | Yumaloq tugmalar                        |
| `.nav-fill`     | Bandlar butun kenglikni egallaydi (kengligi turlicha) |
| `.nav-justified`| Bandlar teng kenglikda                  |
| `.flex-column`  | Vertikal (Bootstrap 3 dagi `.nav-stacked`) |

Tekislash flex utilitalari bilan: `.justify-content-center`, `.justify-content-end`.

```html
<ul class="nav nav-pills flex-column">…</ul>
```

## Dinamik yorliqlar

```html
<ul class="nav nav-tabs" id="kursYorliq" role="tablist">
  <li class="nav-item" role="presentation">
    <a class="nav-link active" id="tavsif-tab" data-toggle="tab" href="#tavsif"
       role="tab" aria-controls="tavsif" aria-selected="true">Tavsif</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="dastur-tab" data-toggle="tab" href="#dastur"
       role="tab" aria-controls="dastur" aria-selected="false">Dastur</a>
  </li>
</ul>

<div class="tab-content">
  <div class="tab-pane fade show active" id="tavsif" role="tabpanel" aria-labelledby="tavsif-tab">
    Kurs haqida.
  </div>
  <div class="tab-pane fade" id="dastur" role="tabpanel" aria-labelledby="dastur-tab">
    8 modul, 45 dars.
  </div>
</div>
```

- havolada `data-toggle="tab"` (pills uchun `"pill"`);
- ochiq panel: `.tab-pane.fade.show.active` (Bootstrap 3 da `.in`);
- plagin `aria-selected` ni ham o‘zi almashtiradi.

## Dropdown’li nav

```html
<li class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">Yana</a>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Sharhlar</a>
  </div>
</li>
```

## Xulosa

- `.nav` > `.nav-item` > `.nav-link`; `.active` va `.disabled` havolada.
- `.nav-tabs`, `.nav-pills`, `.nav-fill`, `.nav-justified`, `.flex-column`.
- Dinamik: `data-toggle="tab|pill"`, `.tab-content` > `.tab-pane.fade.show.active`.
