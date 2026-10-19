## Navigatsiya: `.nav`

Bootstrap’dagi menyular `ul.nav` dan boshlanadi. Unga ko‘rinish klassi qo‘shiladi:

```html
<ul class="nav nav-tabs">
  <li class="active"><a href="#">Bosh sahifa</a></li>
  <li><a href="#">Kurslar</a></li>
  <li><a href="#">Aloqa</a></li>
</ul>
```

| Klass               | Ko‘rinishi                                   |
| ------------------- | -------------------------------------------- |
| `.nav-tabs`         | Yorliqlar (papka varaqlari kabi)             |
| `.nav-pills`        | Yumaloq “tabletka” tugmalar                  |
| `.nav-stacked`      | Pills’ni ustma-ust joylashtiradi             |
| `.nav-justified`    | Bandlar teng kenglikda, to‘liq qatorni egallaydi |

Joriy band — `.active`, o‘chirilgan band — `.disabled`.

```html
<ul class="nav nav-pills nav-stacked">
  <li class="active"><a href="#">Profil</a></li>
  <li><a href="#">Xabarlar</a></li>
</ul>
```

## Dinamik yorliqlar (tabs)

Yorliq bosilganda sahifa qayta yuklanmasdan tegishli kontent ko‘rsatilishi uchun:

1. har bir havolaga `data-toggle="tab"` (pills uchun `data-toggle="pill"`) beriladi;
2. `href` — kontent blokining `id` si;
3. kontent bloklari `.tab-content` ichida, har biri `.tab-pane`.

```html
<ul class="nav nav-tabs" role="tablist">
  <li role="presentation" class="active">
    <a href="#tavsif" data-toggle="tab" role="tab">Tavsif</a>
  </li>
  <li role="presentation">
    <a href="#dastur" data-toggle="tab" role="tab">Dastur</a>
  </li>
</ul>

<div class="tab-content">
  <div role="tabpanel" class="tab-pane fade in active" id="tavsif">
    <p>Kurs Bootstrap 3 bilan tez sahifa yaratishni o‘rgatadi.</p>
  </div>
  <div role="tabpanel" class="tab-pane fade" id="dastur">
    <p>8 modul, 44 dars.</p>
  </div>
</div>
```

- Faqat `.active` `.tab-pane` ko‘rinadi, qolganlari yashirin.
- `.fade` — almashganda xiralashish effekti; boshlang‘ich ochiq panelga `.fade.in.active`.
- `role="tablist"`, `role="tab"`, `role="tabpanel"` — ekran o‘quvchi uchun.

Yorliq bosilganda plagin bosilgan `<li>` ga va tegishli `.tab-pane` ga `.active` qo‘shadi, eskisidan olib tashlaydi.

## Dropdown’li yorliq

Yorliqlardan biri ochiladigan menyu bo‘lishi ham mumkin:

```html
<li class="dropdown">
  <a class="dropdown-toggle" data-toggle="dropdown" href="#">Yana <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li><a href="#">Sharhlar</a></li>
  </ul>
</li>
```

## Xulosa

- `ul.nav` + `.nav-tabs` yoki `.nav-pills` (`.nav-stacked`, `.nav-justified`).
- Dinamik: `data-toggle="tab|pill"`, `href="#id"`, `.tab-content` > `.tab-pane`.
- Boshlang‘ich ochiq panel: `.tab-pane.fade.in.active`.
