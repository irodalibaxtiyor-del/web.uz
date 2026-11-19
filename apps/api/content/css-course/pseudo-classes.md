## Psevdoklasslar

Psevdoklass elementni uning **holati** yoki **joyi** bo‘yicha tanlaydi. U ikki nuqta bilan yoziladi: `a:hover`.

## Holat psevdoklasslari

| Psevdoklass      | Qachon                                      |
| ---------------- | ------------------------------------------- |
| `:hover`         | Sichqoncha ustida                           |
| `:focus`         | Fokusda (har qanday usulda)                 |
| `:focus-visible` | Klaviatura bilan fokuslanganda              |
| `:active`        | Bosilayotganda                              |
| `:checked`       | Belgilangan checkbox yoki radio             |
| `:disabled`      | O‘chirilgan forma elementi                  |
| `:invalid`       | Qiymati noto‘g‘ri bo‘lgan maydon            |
| `:placeholder-shown` | Maydon bo‘sh, placeholder ko‘rinyapti  |

```css
input:disabled {
  background-color: #eeeeee;
  cursor: not-allowed;
}

input:checked + label {
  font-weight: 700;
}
```

## Tuzilma psevdoklasslari

| Psevdoklass          | Nimani tanlaydi                          |
| -------------------- | ---------------------------------------- |
| `:first-child`       | Otasining birinchi bolasi                |
| `:last-child`        | Otasining oxirgi bolasi                  |
| `:nth-child(n)`      | n-o‘rindagi bola                         |
| `:nth-child(odd)`    | Toq o‘rindagilar (1, 3, 5…)             |
| `:nth-child(3n)`     | Har uchinchisi (3, 6, 9…)              |
| `:first-of-type`     | Shu turdagi birinchi element             |
| `:only-child`        | Yagona bola                              |
| `:empty`             | Ichi bo‘sh element                       |

```css
li:last-child {
  border-bottom: none;
}

tr:nth-child(odd) {
  background-color: #f5faff;
}
```

`:nth-child(2n + 1)` formulasi: `n` 0, 1, 2… qiymatlarni oladi, natijada 1, 3, 5… o‘rinlar tanlanadi.

## Mantiqiy psevdoklasslar

**`:not()`** — mos kelmaydiganlarni tanlaydi:

```css
.menyu a:not(.faol) {
  opacity: 0.7;
}
```

**`:is()`** — ro‘yxatni qisqartiradi:

```css
:is(h1, h2, h3) a {
  text-decoration: none;
}
```

**`:has()`** — ichida ma’lum element **bor** bo‘lgan otani tanlaydi:

```css
.karta:has(img) {
  padding-top: 0;
}

label:has(input:checked) {
  background-color: #e6f1fc;
}
```

`:has()` yillar davomida “ota selektori” deb kutilgan imkoniyat — u hozir barcha zamonaviy brauzerlarda ishlaydi.

```tekshir
Ro‘yxatning oxirgi bandi qaysi selektor bilan tanlanadi?
+ `li:last-child`
- `li::last`
- `li:end`
> Tuzilmaviy psevdoklasslar: `:first-child`, `:last-child`, `:nth-child()`.
```

```jonli
<style>
  li:first-child { font-weight: bold; }
  li:last-child { color: crimson; }
  li:nth-child(2n) { background: #eef4fb; }
  input:checked + label { color: seagreen; }
</style>
<ul><li>Bir</li><li>Ikki</li><li>Uch</li><li>To‘rt</li></ul>
<input type="checkbox" id="c"><label for="c">Belgilang</label>
```

## Xulosa

- Holat: `:hover`, `:focus-visible`, `:checked`, `:disabled`.
- Tuzilma: `:first-child`, `:last-child`, `:nth-child()`.
- Mantiq: `:not()`, `:is()`, `:has()`.
