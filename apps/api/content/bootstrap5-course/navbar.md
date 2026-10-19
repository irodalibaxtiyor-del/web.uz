## Navbar

```html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">WEBDIZAYN</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#asosiyMenyu"
            aria-controls="asosiyMenyu" aria-expanded="false" aria-label="Menyuni ochish">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="asosiyMenyu">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Bosh sahifa</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Kurslar</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Aloqa</a></li>
      </ul>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Qidiruv" aria-label="Qidiruv">
        <button class="btn btn-outline-light" type="submit">Qidirish</button>
      </form>
    </div>
  </div>
</nav>
```

## Bootstrap 4 dan farqlar

| Bootstrap 4                        | Bootstrap 5                                       |
| ---------------------------------- | ------------------------------------------------- |
| `.navbar-dark` / `.navbar-light`   | `data-bs-theme="dark"` (5.3) — `navbar-dark` eskirgan |
| `.bg-light` och navbar             | `.bg-body-tertiary` (qorong‘i rejimda o‘zi o‘zgaradi) |
| `data-toggle`, `data-target`       | `data-bs-toggle`, `data-bs-target`                |
| `.ml-auto` / `.mr-auto`            | `.ms-auto` / `.me-auto`                           |
| `.form-inline`                     | `.d-flex`                                         |
| konteyner ixtiyoriy                | ichida **konteyner shart** (`.container-fluid` yoki `.container`) |
| `.active` `nav-item` da            | `.active` + `aria-current="page"` `nav-link` da   |

## `navbar-expand-*`

`navbar-expand-sm | -md | -lg | -xl | -xxl` — shu sinfdan menyu ochiq, torroqda ☰ ortida. Klass yozilmasa — har doim yig‘ilgan.

## Joylashuv

```html
<nav class="navbar fixed-top bg-body-tertiary">…</nav>    <!-- body ga padding-top bering -->
<nav class="navbar sticky-top bg-body-tertiary">…</nav>   <!-- joyini egallab, yopishib qoladi -->
```

## Offcanvas menyu

Telefonda menyu yuqoridan ochilish o‘rniga yon tomondan chiqishi uchun `.collapse` o‘rniga **offcanvas** ishlatiladi:

```html
<nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">WEBDIZAYN</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#yonMenyu"
            aria-controls="yonMenyu" aria-label="Menyuni ochish">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="yonMenyu" aria-labelledby="yonMenyuSarlavha">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="yonMenyuSarlavha">Menyu</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Yopish"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav">…</ul>
      </div>
    </div>
  </div>
</nav>
```

Offcanvas’ni 5-modulda batafsil ko‘ramiz.

## Xulosa

- `nav.navbar.navbar-expand-lg` + `bg-dark data-bs-theme="dark"` (yoki `bg-body-tertiary`), ichida konteyner.
- ☰: `.navbar-toggler[data-bs-toggle="collapse"][data-bs-target]` → `.collapse.navbar-collapse`.
- `.me-auto`/`.ms-auto`, `.d-flex` forma; `.fixed-top`, `.sticky-top`.
