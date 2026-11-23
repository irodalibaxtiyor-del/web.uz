## Range — diapazon

`<input type="range">` uchun Bootstrap 5 klassi — **`.form-range`**. U brauzerlar orasida bir xil ko‘rinadigan yo‘lak va dumaloq tutqich chizadi.

```html
<label for="hajm" class="form-label">Ovoz balandligi</label>
<input type="range" class="form-range" id="hajm">
```

## Chegaralar va qadam

```html
<label for="baho" class="form-label">Kursni baholang (1–10)</label>
<input type="range" class="form-range" min="1" max="10" step="1" value="8" id="baho">
```

| Atribut | Ma’nosi                              | Standart |
| ------- | ------------------------------------ | -------- |
| `min`   | Eng kichik qiymat                    | 0        |
| `max`   | Eng katta qiymat                     | 100      |
| `step`  | Qadam                                | 1        |
| `value` | Boshlang‘ich qiymat                  | o‘rtasi  |

Kasr qadam: `step="0.5"`.

## Qiymatni ko‘rsatish

Range o‘zi raqamni ko‘rsatmaydi. Foydalanuvchi qaysi qiymatni tanlaganini bilishi uchun yonida yozing:

```html
<label for="baho" class="form-label">Baho: <output id="natija" for="baho">8</output></label>
<input type="range" class="form-range" min="1" max="10" value="8" id="baho">
```

```js
const baho = document.getElementById('baho');
const natija = document.getElementById('natija');
baho.addEventListener('input', () => {
  natija.textContent = baho.value;
});
```

- `<output>` — hisoblangan natija uchun HTML elementi;
- `input` hodisasi — tutqich surilayotganda har lahzada, `change` — qo‘yib yuborilganda.

## Klaviatura

Range fokusda bo‘lsa ← → (yoki ↑ ↓) tugmalari bilan qadam-baqadam o‘zgaradi, **Home**/**End** — eng kichik/eng katta qiymat. Bu brauzerning o‘z xususiyati — shuning uchun haqiqiy `<input type="range">` ishlatish muhim.

## O‘chirilgan

```html
<input type="range" class="form-range" disabled>
```

## Rang

Tutqich rangi asosiy rangdan olinadi. O‘zgartirish uchun:

```css
.form-range::-webkit-slider-thumb { background-color: #198754; }
.form-range::-moz-range-thumb { background-color: #198754; }
```

```tekshir
Bootstrap 5 da diapazon (range) maydoni qaysi klass bilan?
+ `form-range`
- `custom-range`
- `form-control-range`
> `min`, `max` va `step` atributlari chegaralarni beradi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <label for="rg" class="form-label">Shrift o‘lchami: <output id="ro">16</output>px</label>
  <input type="range" class="form-range" min="12" max="32" step="2" value="16" id="rg">
  <p id="rt">Namuna matn</p>
  <script>document.getElementById('rg').oninput = (e) => { document.getElementById('ro').value = e.target.value; document.getElementById('rt').style.fontSize = e.target.value + 'px'; };</script>
</div>
```

## Xulosa

- `<input type="range" class="form-range">` + `min`, `max`, `step`, `value`.
- Qiymatni `<output>` va `input` hodisasi bilan ko‘rsating.
- Klaviatura bilan boshqarish brauzerning o‘zida bor.
