## Formalarni bezash

Forma — foydalanuvchi bilan “suhbat”. U tushunarli va qulay bo‘lishi kerak.

## Asosiy maydon uslubi

```css
input,
select,
textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
  background-color: white;
}
```

- `width: 100%` + `box-sizing: border-box` — maydon ota kengligidan chiqmaydi.
- `font: inherit` — maydon sahifa shriftida (standart holda u kichikroq tizim shriftida bo‘ladi).
- `padding` — matn chegaraga yopishmaydi, bosish oson.

## Yorliq va oraliq

```css
label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.maydon + .maydon {
  margin-top: 16px;
}
```

Har bir maydonning `<label>` i bo‘lishi shart. Placeholder yorliq o‘rnini bosmaydi: yozish boshlanganda u yo‘qoladi.

## Fokus holati

```css
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 1px;
  border-color: #0071dc;
}
```

Fokus ko‘rinmasa, foydalanuvchi qaysi maydonga yozayotganini bilmaydi. `outline: none` deb qoldirmang.

## Xato holati

```css
input:user-invalid {
  border-color: crimson;
}
```

`:user-invalid` foydalanuvchi maydon bilan ishlagandan **keyin** ishlaydi. `:invalid` esa sahifa ochilishi bilanoq bo‘sh majburiy maydonlarni qizil qilib qo‘yadi — bu foydalanuvchini qo‘rqitadi.

Xatoni faqat rang bilan emas, **matn** bilan ham ko‘rsating: “Email noto‘g‘ri kiritilgan”.

## Tugma

```css
button {
  padding: 10px 20px;
  border: 0;
  border-radius: 8px;
  background-color: #0071dc;
  color: white;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Checkbox va radio rangi

```css
input[type="checkbox"],
input[type="radio"] {
  accent-color: #0071dc;
  width: auto;
}
```

`accent-color` bitta qator bilan brauzerning standart checkbox, radio va slayderlariga brend rangini beradi.

## `textarea`

```css
textarea {
  min-height: 120px;
  resize: vertical; /* faqat balandligini o‘zgartirish mumkin */
}
```

```tekshir
Forma maydoni `width: 100%` bo‘lib, padding qo‘shilganda ham chetdan chiqmasligi uchun nima kerak?
+ `box-sizing: border-box`
- `overflow: hidden`
- `max-width: none`
> `border-box` padding va chegarani 100% ichida hisoblaydi.
```

```jonli
<style>
  label { display: block; margin-top: 8px; }
  input { width: 100%; box-sizing: border-box; padding: 8px; font: inherit; border: 1px solid #999; border-radius: 6px; }
  input:focus-visible { outline: 3px solid #0071dc55; border-color: #0071dc; }
  input:user-invalid { border-color: crimson; }
  [type=checkbox] { width: auto; accent-color: seagreen; }
</style>
<label for="e">Email</label><input id="e" type="email" required>
<label><input type="checkbox" checked> Eslab qolish</label>
```

## Xulosa

- Maydonlar: `width: 100%`, `box-sizing: border-box`, `padding`, `font: inherit`.
- Har maydonning `label` i bo‘lsin, fokus ko‘rinib tursin.
- Xatolar uchun `:user-invalid` va tushunarli matn.
- `accent-color` — checkbox va radio rangi.
