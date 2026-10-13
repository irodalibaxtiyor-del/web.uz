## JavaScript nima?

**JavaScript** — brauzerda ishlaydigan dasturlash tili. HTML sahifaning **tuzilishini**, CSS esa **ko‘rinishini** belgilaydi. JavaScript sahifaga **xatti-harakat** beradi: tugma bosilganda nimadir bo‘lishi, forma tekshirilishi, ma’lumot yangilanishi.

| Til        | Javob beradigan savol     | Misol                          |
| ---------- | ------------------------- | ------------------------------ |
| HTML       | Sahifada **nima** bor?    | Sarlavha, tugma, rasm          |
| CSS        | U **qanday** ko‘rinadi?   | Rang, o‘lcham, joylashuv       |
| JavaScript | U **nima qiladi**?        | Bosilganda matnni o‘zgartiradi |

## Birinchi misol

```html
<p id="xabar">Tugmani bosing</p>
<button type="button" id="tugma">Bosing</button>

<script>
  document.getElementById('tugma').onclick = function () {
    document.getElementById('xabar').textContent = 'Salom!';
  };
</script>
```

Nima bo‘ldi:

1. `document.getElementById('tugma')` — sahifadan `id="tugma"` bo‘lgan elementni topadi.
2. `.onclick = function () { ... }` — u bosilganda bajariladigan kodni beradi.
3. `.textContent = 'Salom!'` — `#xabar` paragrafining matnini almashtiradi.

## JavaScript nimalarni o‘zgartira oladi?

**Matnni:**

```js
document.getElementById('xabar').textContent = 'Yangi matn';
```

**Uslubni:**

```js
document.getElementById('xabar').style.color = 'crimson';
document.getElementById('xabar').style.fontSize = '24px';
```

CSS’dagi `font-size` JavaScript’da `fontSize` deb yoziladi: chiziqcha olib tashlanadi, keyingi harf katta bo‘ladi.

**Atributni:**

```js
document.getElementById('havola').href = 'https://webdizayn.uz';
```

**Ko‘rinishni:**

```js
document.getElementById('maslahat').style.display = 'none'; // yashirish
document.getElementById('maslahat').style.display = 'block'; // ko‘rsatish
```

## JavaScript va Java

Nomlari o‘xshash, lekin bular **butunlay boshqa** tillar. JavaScript 1995 yilda brauzerlar uchun yaratilgan, rasmiy standarti **ECMAScript** deb ataladi (ES6, ES2020 va hokazo).

## Bu kursda qanday ishlaymiz

Har darsda **mashq** bor. Mashq sahifasida:

- **Ishga tushirish (RUN)** — kodingizni darhol ko‘rasiz. `console.log(...)` natijalari pastdagi **konsol** panelida chiqadi.
- **Tekshirish (CHECK)** — server kodingizni haqiqiy brauzerda sinaydi. U sahifadagi **natijani** tekshiradi, shuning uchun javobni doim sahifaga (`textContent` orqali) yozing.

> Tekshiruv ba’zan kodingizni boshqa qiymatlar bilan ham sinaydi. Shuning uchun javobni qo‘lda yozib qo‘ymang — uni kod hisoblasin.
