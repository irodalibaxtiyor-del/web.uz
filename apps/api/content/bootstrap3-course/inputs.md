## Kiritish maydonlari

Bootstrap barcha HTML5 `type` larini qo‘llab-quvvatlaydi: `text`, `password`, `email`, `number`, `tel`, `url`, `date`, `search`, `color` va boshqalar. Maydon to‘g‘ri uslublanishi uchun `type` doim yozilishi va `.form-control` berilishi kerak.

```html
<div class="form-group">
  <label for="telefon">Telefon:</label>
  <input type="tel" class="form-control" id="telefon" placeholder="+998 90 123 45 67">
</div>
```

To‘g‘ri `type` telefonda mos klaviaturani ochadi: `email` — `@` bilan, `tel` — raqamlar bilan.

## Textarea

```html
<div class="form-group">
  <label for="izoh">Izoh:</label>
  <textarea class="form-control" rows="4" id="izoh"></textarea>
</div>
```

`rows` — ko‘rinadigan qatorlar soni.

## Checkbox

Har bir checkbox `.checkbox` ichida, `<label>` bilan o‘ralgan:

```html
<div class="checkbox">
  <label><input type="checkbox" value="html"> HTML</label>
</div>
<div class="checkbox">
  <label><input type="checkbox" value="css"> CSS</label>
</div>
<div class="checkbox disabled">
  <label><input type="checkbox" disabled> PHP (tez kunda)</label>
</div>
```

Bir qatorda: `<label class="checkbox-inline">`.

## Radio

Bir guruhdagi radio tugmalarning `name` atributi bir xil — shunda faqat bittasini tanlash mumkin:

```html
<div class="radio">
  <label><input type="radio" name="daraja" value="boshlang" checked> Boshlang‘ich</label>
</div>
<div class="radio">
  <label><input type="radio" name="daraja" value="orta"> O‘rta</label>
</div>
```

Bir qatorda: `<label class="radio-inline">`.

## Select (ro‘yxatdan tanlash)

```html
<div class="form-group">
  <label for="shahar">Shahar:</label>
  <select class="form-control" id="shahar">
    <option>Toshkent</option>
    <option>Samarqand</option>
    <option>Buxoro</option>
  </select>
</div>
```

Bir nechta variant tanlash uchun `multiple` atributi qo‘shiladi.

## Checkbox va radio guruhiga sarlavha

Bir nechta checkbox yoki radio bitta savolga tegishli bo‘lsa, ularni `<fieldset>` va `<legend>` bilan guruhlang:

```html
<fieldset>
  <legend>Qaysi kurslar qiziq?</legend>
  <div class="checkbox"><label><input type="checkbox"> HTML</label></div>
  <div class="checkbox"><label><input type="checkbox"> CSS</label></div>
</fieldset>
```

Ekran o‘quvchi har bir variantni “Qaysi kurslar qiziq? HTML” deb o‘qiydi.

## Xulosa

- `input` larga to‘g‘ri `type` va `.form-control`.
- `textarea` va `select` ham `.form-control`.
- Checkbox — `.checkbox` > `label` > `input`; radio — `.radio`, `name` bir xil.
- Bir qatorda: `.checkbox-inline`, `.radio-inline`.
