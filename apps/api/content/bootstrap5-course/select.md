## Select menyu

Bootstrap 5 da `<select>` uchun alohida klass — **`.form-select`** (Bootstrap 4 dagi `.custom-select` o‘rnida). U brauzerning standart ko‘rinishini olib tashlab, o‘ng tomonda chiroyli strelka chizadi.

```html
<label for="shahar" class="form-label">Shahar</label>
<select class="form-select" id="shahar">
  <option selected disabled value="">Shaharni tanlang…</option>
  <option value="toshkent">Toshkent</option>
  <option value="samarqand">Samarqand</option>
  <option value="buxoro">Buxoro</option>
</select>
```

`<option selected disabled value="">` — tanlash so‘rovchi birinchi band: foydalanuvchi uni qayta tanlay olmaydi, `required` bo‘lsa bo‘sh qiymat qabul qilinmaydi.

> `<select>` ga `.form-control` emas, `.form-select` bering — aks holda strelka chiqmaydi.

## O‘lcham

```html
<select class="form-select form-select-lg" aria-label="Katta">…</select>
<select class="form-select form-select-sm" aria-label="Kichik">…</select>
```

## Bir nechta tanlov va o‘lcham

```html
<select class="form-select" multiple aria-label="Qiziqishlar">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
  <option value="js">JavaScript</option>
</select>

<select class="form-select" size="3" aria-label="Yo‘nalish">…</select>
```

- `multiple` — Ctrl (yoki Cmd) bilan bir nechta band tanlanadi;
- `size="3"` — ro‘yxat ochilmay, 3 qator ko‘rinib turadi.

## Guruhlangan variantlar

```html
<select class="form-select" id="kurs">
  <optgroup label="Frontend">
    <option>HTML</option>
    <option>CSS</option>
  </optgroup>
  <optgroup label="Backend">
    <option>PHP</option>
  </optgroup>
</select>
```

## Qiymatni JavaScript bilan o‘qish

```js
const select = document.getElementById('shahar');
select.addEventListener('change', () => {
  console.log('Tanlandi:', select.value);
});
```

## Foydalanish imkoniyati

- Har bir `select` ning nomi bo‘lsin: `<label for>` yoki `aria-label`.
- Juda uzun ro‘yxat (masalan, 200 ta mamlakat) uchun qidiruvli maydon qulayroq bo‘lishi mumkin.
- 2–5 ta variant uchun radio tugmalar ko‘pincha tushunarliroq — hammasi birdaniga ko‘rinadi.

## Xulosa

- `<select class="form-select">`; o‘lcham — `-lg`, `-sm`; o‘chirilgan — `disabled`.
- `multiple`, `size`, `optgroup`; tanlash so‘rovchi band — `selected disabled value=""`.
- `select` ga nom bering (`label` yoki `aria-label`).
