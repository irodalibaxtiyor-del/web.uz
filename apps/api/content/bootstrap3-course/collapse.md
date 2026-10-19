## Collapse — yashirib-ochish

**Collapse** plagini kontentni yashirib qo‘yadi va tugma bosilganda silliq ochadi. FAQ (savol-javob), “Batafsil” bloklari, mobil menyu — hammasi collapse bilan ishlaydi.

```html
<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#batafsil"
        aria-expanded="false" aria-controls="batafsil">
  Batafsil
</button>

<div id="batafsil" class="collapse">
  Kurs davomida 12 ta amaliy loyiha bajarasiz.
</div>
```

- `.collapse` — kontent boshida **yashirin** (`display: none`);
- `data-toggle="collapse"` — tugma collapse’ni boshqaradi;
- `data-target="#batafsil"` — qaysi elementni (CSS selektor).

Ochilganda elementga `.in` klassi qo‘shiladi. Boshidanoq ochiq bo‘lishi uchun: `class="collapse in"`.

## Havola bilan

Tugma o‘rniga havola bo‘lsa, maqsad `href` da yoziladi:

```html
<a href="#batafsil" data-toggle="collapse" role="button" aria-expanded="false">Batafsil</a>
```

## Akkordeon

**Akkordeon** — bir vaqtda faqat bitta bo‘limi ochiq turadigan panellar guruhi. Buning uchun har bir collapse’ga `data-parent` beriladi:

```html
<div class="panel-group" id="faq">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#faq" href="#savol1">Kurs qancha davom etadi?</a>
      </h4>
    </div>
    <div id="savol1" class="panel-collapse collapse in">
      <div class="panel-body">Uch oy, haftasiga uch dars.</div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#faq" href="#savol2">Sertifikat beriladimi?</a>
      </h4>
    </div>
    <div id="savol2" class="panel-collapse collapse">
      <div class="panel-body">Ha, yakuniy loyihani topshirgandan keyin.</div>
    </div>
  </div>
</div>
```

`data-parent="#faq"` — yangi bo‘lim ochilganda shu guruhdagi ochiq bo‘lim yopiladi.

## Foydalanish imkoniyati

- `aria-controls` — tugma qaysi elementni boshqarishini bildiradi;
- `aria-expanded` — hozir ochiqmi yoki yopiq. Bootstrap uni `true/false` qilib almashtiradi.

## JavaScript orqali

Collapse’ni kod bilan ham boshqarish mumkin:

```js
$('#batafsil').collapse('show');   // ochish
$('#batafsil').collapse('hide');   // yopish
$('#batafsil').collapse('toggle'); // almashtirish
```

## Xulosa

- Yashirin kontent: `.collapse`; ochiq: `.collapse.in`.
- Boshqaruvchi: `data-toggle="collapse"` + `data-target` (yoki `href`).
- Akkordeon: `.panel-group` + har bir havolada `data-parent`.
