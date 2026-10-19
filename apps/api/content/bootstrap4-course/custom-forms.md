## Custom forma elementlari

Brauzerning standart checkbox, radio va `select` ko‘rinishi har bir tizimda boshqacha. Bootstrap 4 ularni bir xil, chiroyli ko‘rinishga keltiradigan **custom** klasslarni beradi. Ichkarida baribir haqiqiy `<input>` ishlaydi — faqat ko‘rinish CSS bilan chiziladi, shuning uchun klaviatura va ekran o‘quvchi to‘g‘ri ishlaydi.

## Custom checkbox va radio

```html
<div class="custom-control custom-checkbox">
  <input type="checkbox" class="custom-control-input" id="shart">
  <label class="custom-control-label" for="shart">Shartlarga roziman</label>
</div>

<div class="custom-control custom-radio">
  <input type="radio" id="r1" name="tolov" class="custom-control-input" checked>
  <label class="custom-control-label" for="r1">Naqd</label>
</div>
<div class="custom-control custom-radio">
  <input type="radio" id="r2" name="tolov" class="custom-control-input">
  <label class="custom-control-label" for="r2">Karta orqali</label>
</div>
```

- haqiqiy `input` ko‘rinmas bo‘ladi (`opacity: 0`, ustma-ust);
- `label` ning `::before`/`::after` psevdoelementlari belgi chizadi;
- `id` va `for` **albatta** mos bo‘lishi kerak — aks holda bosish ishlamaydi.

Bir qatorda: `.custom-control-inline`.

## Switch (kalit)

```html
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="bildirishnoma" checked>
  <label class="custom-control-label" for="bildirishnoma">Bildirishnomalar</label>
</div>
```

Switch — yoqish/o‘chirish sozlamalari uchun: darhol kuchga kiradigan bitta holat.

## Custom select

```html
<select class="custom-select" aria-label="Shahar">
  <option selected>Shaharni tanlang</option>
  <option value="1">Toshkent</option>
  <option value="2">Samarqand</option>
</select>
```

O‘lcham: `.custom-select-lg`, `.custom-select-sm`.

## Custom range

```html
<label for="baho">Baho: 1–10</label>
<input type="range" class="custom-range" min="1" max="10" step="1" id="baho">
```

## Custom file

```html
<div class="custom-file">
  <input type="file" class="custom-file-input" id="fayl">
  <label class="custom-file-label" for="fayl">Faylni tanlang</label>
</div>
```

Tanlangan fayl nomi o‘zi yorliqqa yozilmaydi — buning uchun kichik skript yoki `bs-custom-file-input` kutubxonasi kerak.

## Bootstrap 5 da

> Bootstrap 5 da custom klasslar asosiy klasslarga birlashtirilgan: `.form-check` endi o‘zi chiroyli, `.form-switch`, `.form-select`, `.form-range`. Bootstrap 4 loyihalarida esa `custom-*` keng tarqalgan.

## Xulosa

- `.custom-control` + `.custom-checkbox | .custom-radio | .custom-switch` > `.custom-control-input` + `.custom-control-label`.
- `.custom-select`, `.custom-range`, `.custom-file`.
- `id`/`for` mos bo‘lishi shart.
