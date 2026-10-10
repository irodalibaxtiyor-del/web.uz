## HTML va JavaScript

**JavaScript** sahifaga “jon” beradi: tugma bosilganda xabar chiqarish, ma’lumotni tekshirish, kontentni o‘zgartirish. HTML’ga u `<script>` tegi orqali qo‘shiladi.

## Sahifa ichida yozish

```html
<p id="xabar">Kutilmoqda...</p>

<script>
  document.getElementById('xabar').textContent = 'JavaScript ishladi!';
</script>
```

`document.getElementById` — `id` bo‘yicha elementni topadi, `textContent` — uning matnini o‘zgartiradi.

## Tashqi faylda yozish

Katta loyihalarda kod alohida `.js` faylga chiqariladi:

```html
<script src="js/app.js"></script>
```

`js/app.js`:

```js
const tugma = document.querySelector('#tugma');
tugma.addEventListener('click', () => {
  alert('Tugma bosildi');
});
```

## `<script>` qayerga yoziladi?

Brauzer HTML’ni yuqoridan pastga o‘qiydi. Skript elementlardan **oldin** ishlasa, ularni topa olmaydi. Ikki yechim bor:

1. `<script>` ni `<body>` ning **oxiriga** qo‘yish;
2. `<head>` da `defer` atributi bilan ulash — skript sahifa to‘liq o‘qilgandan keyin ishlaydi:

```html
<head>
  <script src="js/app.js" defer></script>
</head>
```

## JavaScript nimalar qila oladi?

```html
<p id="matn">Salom</p>
<img id="rasm" src="kun.png" alt="Kun">
<button type="button" onclick="almashtir()">O‘zgartirish</button>

<script>
  function almashtir() {
    document.getElementById('matn').style.color = 'crimson'; // uslubni
    document.getElementById('matn').textContent = 'Xayr'; // matnni
    document.getElementById('rasm').alt = 'Oy'; // atributni
  }
</script>
```

## JavaScript o‘chirilgan bo‘lsa

`<noscript>` ichidagi matn faqat JavaScript ishlamaganda ko‘rinadi:

```html
<noscript>Bu sahifa to‘liq ishlashi uchun JavaScript’ni yoqing.</noscript>
```

## Konsol

Platformamizdagi muharrirda “Konsol” bo‘limi bor. `console.log('...')` bilan chiqargan barcha ma’lumotlar va xatolar shu yerda ko‘rinadi — dasturchilarning eng yaxshi do‘sti.

## Xulosa

- JavaScript `<script>` ichida yoki `<script src>` orqali tashqi fayldan ulanadi.
- Elementlardan keyin joylang yoki `defer` ishlating.
- JavaScript matn, uslub va atributlarni o‘zgartira oladi.
