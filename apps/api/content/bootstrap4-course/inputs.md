## Kiritish maydonlari

```html
<div class="form-group">
  <label for="tel">Telefon</label>
  <input type="tel" class="form-control" id="tel" placeholder="+998 90 123 45 67">
</div>
<div class="form-group">
  <label for="izoh">Izoh</label>
  <textarea class="form-control" id="izoh" rows="3"></textarea>
</div>
<div class="form-group">
  <label for="shahar">Shahar</label>
  <select class="form-control" id="shahar">
    <option>Toshkent</option>
    <option>Samarqand</option>
  </select>
</div>
```

Barcha matnli maydonlar, `textarea` va `select` uchun `.form-control`.

## O‘lchamlar

```html
<input class="form-control form-control-lg" type="text" placeholder="Katta">
<input class="form-control" type="text" placeholder="Oddiy">
<input class="form-control form-control-sm" type="text" placeholder="Kichik">
```

Bootstrap 3 dagi `.input-lg` → `.form-control-lg`.

## Faqat o‘qish va statik matn

```html
<input class="form-control" type="text" value="WD-2026-0142" readonly>
<input class="form-control-plaintext" type="text" value="aziza@misol.uz" readonly>
```

`.form-control-plaintext` — maydon ramkasiz oddiy matn ko‘rinishida (Bootstrap 3 dagi `.form-control-static`).

## Checkbox va radio

```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="html">
  <label class="form-check-label" for="html">HTML</label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="daraja" id="d1" value="1" checked>
  <label class="form-check-label" for="d1">Boshlang‘ich</label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="daraja" id="d2" value="2">
  <label class="form-check-label" for="d2">O‘rta</label>
</div>
```

Bir qatorda — `.form-check-inline`:

```html
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="tur" id="t1" value="onlayn">
  <label class="form-check-label" for="t1">Onlayn</label>
</div>
```

`id` va `for` mos bo‘lishi shart — yorliq bosilganda checkbox belgilanadi va ekran o‘quvchi uni to‘g‘ri o‘qiydi.

## Fayl va diapazon

```html
<div class="form-group">
  <label for="rasm">Rasm yuklash</label>
  <input type="file" class="form-control-file" id="rasm">
</div>
<div class="form-group">
  <label for="hajm">Ovoz balandligi</label>
  <input type="range" class="form-control-range" id="hajm">
</div>
```

## Maydonlar kengligi

`.form-control` — 100% kenglik. Torroq maydon uchun setka (`.col-md-4`) yoki sizing utilitasi (`.w-50`) ishlating.

## Xulosa

- Maydonlar — `.form-control`; o‘lcham — `.form-control-lg|sm`.
- Statik matn — `.form-control-plaintext`, faqat o‘qish — `readonly`.
- Checkbox/radio — `.form-check` (+ `.form-check-inline`), `id`/`for` mos.
- Fayl — `.form-control-file`, diapazon — `.form-control-range`.
