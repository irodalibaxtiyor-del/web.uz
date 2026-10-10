## Forma elementlari

`<input>` dan tashqari formada yana bir nechta element ishlatiladi.

## `<select>` — ochiladigan ro‘yxat

```html
<label for="viloyat">Viloyat</label>
<select id="viloyat" name="viloyat">
  <option value="toshkent">Toshkent</option>
  <option value="samarqand" selected>Samarqand</option>
  <option value="buxoro">Buxoro</option>
</select>
```

- `value` — serverga yuboriladigan qiymat;
- `selected` — standart tanlangan variant;
- `multiple` atributi bir nechtasini tanlash imkonini beradi.

Variantlarni guruhlash:

```html
<select name="kurs">
  <optgroup label="Frontend">
    <option>HTML</option>
    <option>CSS</option>
  </optgroup>
  <optgroup label="Dizayn">
    <option>Figma</option>
  </optgroup>
</select>
```

## `<textarea>` — ko‘p qatorli matn

```html
<label for="izoh">Izohingiz</label>
<textarea id="izoh" name="izoh" rows="4" cols="40" placeholder="Fikringizni yozing..."></textarea>
```

## `<button>`

```html
<button type="submit">Yuborish</button>
<button type="reset">Tozalash</button>
```

## `<fieldset>` va `<legend>` — guruhlash

Bog‘liq maydonlarni ramka ichida guruhlaydi:

```html
<fieldset>
  <legend>Yetkazib berish manzili</legend>
  <label for="shahar">Shahar</label>
  <input id="shahar" name="shahar">
  <label for="kocha">Ko‘cha</label>
  <input id="kocha" name="kocha">
</fieldset>
```

## `<datalist>` — takliflar ro‘yxati

Matn maydoniga avtomatik takliflar beradi, lekin erkin yozishga ham ruxsat beradi:

```html
<input list="shaharlar" name="shahar">
<datalist id="shaharlar">
  <option value="Toshkent">
  <option value="Namangan">
  <option value="Nukus">
</datalist>
```

## `<output>` — hisoblash natijasi

```html
<form oninput="natija.value = Number(a.value) + Number(b.value)">
  <input type="number" id="a" value="2"> +
  <input type="number" id="b" value="3"> =
  <output name="natija" for="a b">5</output>
</form>
```

## Xulosa

- `<select>`/`<option>` — tanlov, `<textarea>` — uzun matn.
- `<fieldset>` + `<legend>` — maydonlarni mantiqiy guruhlaydi.
- `<datalist>` — takliflar, `<output>` — hisoblash natijasi.
