## Loyiha: kompaniya sayti

Kichik IT-kompaniya uchun bir sahifali sayt yig‘amiz:

1. tepaga mahkamlangan navbar;
2. jumbotron: kompaniya nomi va shiori;
3. xizmatlar — uch ustun;
4. narxlar — uchta panel;
5. aloqa formasi.

## 1. Mahkamlangan navbar

```html
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#menyu">
        <span class="sr-only">Menyu</span>
        <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Raqam IT</a>
    </div>
    <div class="collapse navbar-collapse" id="menyu">
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#xizmatlar">Xizmatlar</a></li>
        <li><a href="#narxlar">Narxlar</a></li>
        <li><a href="#aloqa">Aloqa</a></li>
      </ul>
    </div>
  </div>
</nav>
```

`.navbar-fixed-top` navbar’ni ekranga mahkamlaydi va oddiy oqimdan chiqaradi — sahifa kontenti uning ostida qolib ketadi. Shuning uchun:

```css
body {
  padding-top: 50px; /* navbar balandligi */
}
```

## 2. Jumbotron

```html
<div class="jumbotron text-center">
  <h1>Raqam IT</h1>
  <p>Biznesingiz uchun zamonaviy veb-saytlar</p>
</div>
```

## 3. Xizmatlar

```html
<section id="xizmatlar" class="container text-center">
  <h2>Xizmatlar</h2>
  <div class="row">
    <div class="col-sm-4">
      <span class="glyphicon glyphicon-phone" aria-hidden="true"></span>
      <h4>Moslashuvchan dizayn</h4>
    </div>
    …
  </div>
</section>
```

## 4. Narxlar paneli

O‘rtadagi (tavsiya etilgan) tarif rangli panel bilan ajratiladi:

```html
<div class="row" id="narxlar">
  <div class="col-sm-4">
    <div class="panel panel-default text-center">
      <div class="panel-heading"><h3>Boshlang‘ich</h3></div>
      <div class="panel-body"><p>5 sahifa</p><p>Mobil versiya</p></div>
      <div class="panel-footer">
        <h3>2 mln so‘m</h3>
        <button class="btn btn-default">Tanlash</button>
      </div>
    </div>
  </div>
  <div class="col-sm-4">
    <div class="panel panel-primary text-center">…</div>
  </div>
  …
</div>
```

## 5. Aloqa formasi

```html
<section id="aloqa" class="container">
  <h2 class="text-center">Aloqa</h2>
  <div class="row">
    <div class="col-sm-5">
      <p><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> Toshkent</p>
      <p><span class="glyphicon glyphicon-phone" aria-hidden="true"></span> +998 71 000 00 00</p>
    </div>
    <div class="col-sm-7">
      <form>
        <div class="form-group">
          <label for="ism">Ism</label>
          <input class="form-control" id="ism" type="text">
        </div>
        <div class="form-group">
          <label for="xabar">Xabar</label>
          <textarea class="form-control" id="xabar" rows="4"></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Yuborish</button>
      </form>
    </div>
  </div>
</section>
```

## Xulosa

- `.navbar-fixed-top` + `body { padding-top: 50px; }`.
- Xizmatlar — uch ustun; narxlar — `.panel` lar, tavsiya etilgani `.panel-primary`.
- Aloqa — setka ichida ma’lumot va forma.
