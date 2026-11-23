## Navbar

**Navbar** — saytning yuqorisidagi asosiy navigatsiya paneli: logo (brand), menyu, qidiruv, kirish tugmasi. Kichik ekranda menyu “gamburger” tugmasi ortiga yashirinadi.

```html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">WEBDIZAYN</a>
    </div>
    <ul class="nav navbar-nav">
      <li class="active"><a href="#">Bosh sahifa</a></li>
      <li><a href="#">Kurslar</a></li>
      <li><a href="#">Aloqa</a></li>
    </ul>
  </div>
</nav>
```

| Qism            | Vazifasi                               |
| --------------- | -------------------------------------- |
| `.navbar`       | Panelning o‘zi                         |
| `.navbar-default` / `.navbar-inverse` | Och yoki qora ko‘rinish |
| `.navbar-header`| Logo va mobil tugma uchun joy          |
| `.navbar-brand` | Sayt nomi yoki logo                    |
| `ul.nav.navbar-nav` | Menyu bandlari                     |

## O‘ng tomondagi menyu

```html
<ul class="nav navbar-nav navbar-right">
  <li><a href="#"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Ro‘yxatdan o‘tish</a></li>
  <li><a href="#"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span> Kirish</a></li>
</ul>
```

Navbar ichidagi forma — `.navbar-form`, oddiy matn — `.navbar-text`, tugma — `.navbar-btn`.

## Moslashuvchan (yig‘iladigan) navbar

Telefon ekranida menyu sig‘maydi. Uni collapse ichiga olib, “gamburger” tugmasi qo‘shiladi:

```html
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#asosiyMenyu"
              aria-expanded="false" aria-controls="asosiyMenyu">
        <span class="sr-only">Menyuni ochish</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">WEBDIZAYN</a>
    </div>
    <div class="collapse navbar-collapse" id="asosiyMenyu">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Bosh sahifa</a></li>
        <li><a href="#">Kurslar</a></li>
      </ul>
    </div>
  </div>
</nav>
```

- `.navbar-toggle` — faqat 768px dan tor ekranda ko‘rinadigan tugma;
- uchta `.icon-bar` — tugmadagi uchta chiziq (☰);
- `.navbar-collapse` — keng ekranda doim ochiq, tor ekranda tugma bilan ochiladi.

## Joylashuv

| Klass                  | Natija                                                   |
| ---------------------- | -------------------------------------------------------- |
| `.navbar-fixed-top`    | Ekran tepasiga mahkamlanadi (`body` ga `padding-top: 70px` bering) |
| `.navbar-fixed-bottom` | Ekran pastiga mahkamlanadi                               |
| `.navbar-static-top`   | To‘liq kenglik, burchaklarsiz, lekin sahifa bilan aylanadi |

## Navbar ichida dropdown

```html
<li class="dropdown">
  <a class="dropdown-toggle" data-toggle="dropdown" href="#">Kurslar <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li><a href="#">HTML</a></li>
    <li><a href="#">CSS</a></li>
  </ul>
</li>
```

```tekshir
Navbar kichik ekranda “gamburger” tugmaga yig‘ilishi uchun menyu qaysi blokka o‘raladi?
+ `collapse navbar-collapse`
- `navbar-hidden`
- `navbar-mobile`
> `navbar-toggle` tugmasi `data-target` orqali shu blokni ochib-yopadi.
```

```jonli
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<div class="container" style="padding-top: 15px">
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu" aria-expanded="false"><span class="sr-only">Menyu</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
        <a class="navbar-brand" href="#">WEBDIZAYN</a>
      </div>
      <div class="collapse navbar-collapse" id="menu">
        <ul class="nav navbar-nav"><li class="active"><a href="#">Bosh</a></li><li><a href="#">Kurslar</a></li></ul>
        <ul class="nav navbar-nav navbar-right"><li><a href="#">Kirish</a></li></ul>
      </div>
    </div>
  </nav>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
```

## Xulosa

- `nav.navbar.navbar-default|inverse` > `.container-fluid` > `.navbar-header` + menyu.
- Menyu: `ul.nav.navbar-nav`, o‘ngda — `.navbar-right`.
- Mobil: `.navbar-toggle[data-toggle="collapse"]` + `.collapse.navbar-collapse`.
- `.navbar-fixed-top` — tepaga mahkamlash.
