## Loyiha: musiqa guruhi sayti

Oxirgi loyihada JavaScript komponentlarini birlashtiramiz:

1. qora navbar va **karusel** (konsert suratlari);
2. konsertlar jadvali — `list-group` va `badge`;
3. chipta sotib olish **modali**;
4. guruh a’zolari — `img-circle` va setka.

## 1. Karusel

```html
<div id="konsertlar" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner" role="listbox">
    <div class="item active">
      <img src="toshkent.jpg" alt="Toshkentdagi konsert">
      <div class="carousel-caption">
        <h3>Toshkent</h3>
        <p>Unutilmas oqshom!</p>
      </div>
    </div>
    <div class="item">…</div>
  </div>
  <a class="left carousel-control" href="#konsertlar" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Oldingi</span>
  </a>
  <a class="right carousel-control" href="#konsertlar" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Keyingi</span>
  </a>
</div>
```

Karuselni butun ekran kengligida qoldirish uchun uni `.container` dan tashqarida yozing.

## 2. Konsertlar jadvali

```html
<ul class="list-group">
  <li class="list-group-item">15-noyabr, Toshkent <span class="badge">Sotildi</span></li>
  <li class="list-group-item">22-noyabr, Samarqand <span class="badge">3 ta qoldi</span></li>
  <li class="list-group-item">29-noyabr, Buxoro</li>
</ul>
```

## 3. Chipta modali

```html
<button class="btn btn-primary" data-toggle="modal" data-target="#chipta">Chipta olish</button>

<div class="modal fade" id="chipta" tabindex="-1" role="dialog" aria-labelledby="chiptaSarlavha">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Yopish">&times;</button>
        <h4 class="modal-title" id="chiptaSarlavha">Chipta olish</h4>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="soni">Chiptalar soni</label>
            <input type="number" class="form-control" id="soni" min="1" max="10" value="1">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Bekor qilish</button>
        <button type="button" class="btn btn-success">To‘lash</button>
      </div>
    </div>
  </div>
</div>
```

## 4. Guruh a’zolari

```html
<div class="row text-center">
  <div class="col-sm-4">
    <img src="a1.png" class="img-circle" alt="Vokalchi Sardor" width="150" height="150">
    <p><strong>Sardor</strong><br>Vokal</p>
  </div>
  …
</div>
```

## Qorong‘i dizayn uchun maslahatlar

- Qora fonda oq matn — kontrast yuqori, lekin sof `#000` o‘rniga `#1b1b1b` ko‘zni kamroq charchatadi.
- Navbar uchun `.navbar-inverse` tayyor qorong‘i variant.
- Rasmlarga `alt` yozing — karusel rasmlarida ham.

## Xulosa

- Karusel, modal, list group va setkani bitta sahifada birlashtirish.
- Har bir JS komponentining `id` — `data-target`/`href` bilan mos.
- Kurs davomida o‘rgangan barcha komponentlar endi sizning qo‘lingizda!
