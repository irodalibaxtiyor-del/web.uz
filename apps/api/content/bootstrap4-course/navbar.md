## Navbar

```html
<nav class="navbar navbar-expand-md navbar-dark bg-dark">
  <a class="navbar-brand" href="#">WEBDIZAYN</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#asosiyMenyu"
          aria-controls="asosiyMenyu" aria-expanded="false" aria-label="Menyuni ochish">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="asosiyMenyu">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active"><a class="nav-link" href="#">Bosh sahifa <span class="sr-only">(joriy)</span></a></li>
      <li class="nav-item"><a class="nav-link" href="#">Kurslar</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Aloqa</a></li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Qidiruv" aria-label="Qidiruv">
      <button class="btn btn-outline-light my-2 my-sm-0" type="submit">Qidirish</button>
    </form>
  </div>
</nav>
```

## Asosiy klasslar

| Klass                    | Vazifasi                                                     |
| ------------------------ | ------------------------------------------------------------ |
| `.navbar`                | Flex konteyner                                               |
| `.navbar-expand-{sm\|md\|lg\|xl}` | Shu sinfdan boshlab menyu ochiq (gorizontal), torroqda ☰ ortida |
| `.navbar-light` / `.navbar-dark` | Matn va ikonka rangi (och fon uchun / to‘q fon uchun) |
| `.bg-*`                  | Fon rangi (navbar o‘zi rangsiz)                              |
| `.navbar-brand`          | Logo yoki nom                                                |
| `.navbar-toggler`        | ☰ tugmasi, `.navbar-toggler-icon` ikonka bilan              |
| `.navbar-nav`            | Menyu ro‘yxati (`.nav-item` > `.nav-link`)                   |
| `.navbar-text`           | Oddiy matn                                                   |

Bootstrap 3 bilan farq:

| Bootstrap 3                  | Bootstrap 4                              |
| ---------------------------- | ---------------------------------------- |
| `.navbar-default`/`-inverse` | `.navbar-light`/`-dark` + `.bg-*`        |
| `.navbar-toggle` + 3 ta `.icon-bar` | `.navbar-toggler` + `.navbar-toggler-icon` |
| `.navbar-header`             | kerak emas                               |
| `.navbar-right`              | `.ml-auto` (flex utilita)                |
| har doim 768px da ochiladi   | `.navbar-expand-*` bilan tanlanadi       |

`.navbar-expand-*` yozilmasa, menyu **har doim** yig‘ilgan bo‘ladi.

## Menyuni o‘ngga surish

```html
<ul class="navbar-nav ml-auto">…</ul>
```

`ml-auto` — chap margin `auto`, flex qatorda elementni o‘ng chetga suradi.

## Joylashuv

```html
<nav class="navbar fixed-top navbar-dark bg-primary">…</nav>   <!-- tepaga mahkam -->
<nav class="navbar fixed-bottom navbar-light bg-light">…</nav> <!-- pastga mahkam -->
<nav class="navbar sticky-top navbar-light bg-light">…</nav>   <!-- aylantirganda yopishadi -->
```

`.fixed-top` da `body` ga `padding-top` bering. `.sticky-top` esa `position: sticky` — joyini egallab turadi va padding kerak emas (Bootstrap 3 dagi affix o‘rnini bosadi).

## Konteyner ichida

Kontent markazda tursin desangiz:

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container">
    <a class="navbar-brand" href="#">WEBDIZAYN</a>
    …
  </div>
</nav>
```

## Xulosa

- `nav.navbar.navbar-expand-md.navbar-dark.bg-dark`.
- Mobil: `.navbar-toggler` → `.collapse.navbar-collapse`.
- Menyu: `.navbar-nav` > `.nav-item` > `.nav-link`; o‘ngga — `.ml-auto`.
- `.fixed-top`, `.fixed-bottom`, `.sticky-top`.
