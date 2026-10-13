## Hodisalar

**Hodisa** (event) — sahifada sodir bo‘lgan narsa: tugma bosildi, matn kiritildi, sichqoncha element ustiga keldi, sahifa yuklandi. JavaScript hodisaga **javob** beradi.

## Ko‘p ishlatiladigan hodisalar

| Hodisa       | Qachon sodir bo‘ladi                                  |
| ------------ | ----------------------------------------------------- |
| `click`      | Element bosildi                                       |
| `input`      | Maydondagi matn o‘zgardi (har bir belgida)            |
| `change`     | Maydon qiymati o‘zgarib, fokus chiqdi (yoki tanlandi) |
| `mouseover`  | Sichqoncha element ustiga keldi                       |
| `mouseout`   | Sichqoncha elementdan chiqdi                          |
| `keydown`    | Klaviaturada tugma bosildi                            |
| `submit`     | Forma yuborildi                                       |
| `load`       | Sahifa (yoki rasm) to‘liq yuklandi                    |

## Hodisaga funksiya berish

### HTML atributi orqali

```html
<button type="button" onclick="salomlash()">Bosing</button>
```

Kichik misollarda ko‘rasiz, lekin HTML va JavaScript aralashib ketadi — katta loyihalarda ishlatilmaydi.

### JavaScript xususiyati orqali

```js
document.getElementById('tugma').onclick = function () {
  document.getElementById('xabar').textContent = 'Bosildi';
};
```

Xususiyat nomi — `on` + hodisa nomi: `onclick`, `oninput`, `onmouseover`, `onkeydown`.

### `addEventListener` (eng to‘g‘ri usul)

```js
document.getElementById('tugma').addEventListener('click', function () {
  document.getElementById('xabar').textContent = 'Bosildi';
});
```

Bitta hodisaga bir nechta funksiya ulash mumkin. Batafsil — DOM modulida.

## Jonli kiritish: `input`

```js
const maydon = document.getElementById('maydon');

maydon.oninput = function () {
  document.getElementById('uzunlik').textContent = maydon.value.length;
};
```

Har bir harf yozilganda belgilar soni yangilanadi. `.length` — matn uzunligi.

## Sichqoncha: `mouseover` va `mouseout`

```js
const kvadrat = document.getElementById('kvadrat');

kvadrat.onmouseover = function () {
  document.getElementById('holat').textContent = 'Sichqoncha ustida';
};
kvadrat.onmouseout = function () {
  document.getElementById('holat').textContent = 'Sichqoncha tashqarida';
};
```

> Sichqoncha hodisalari sensorli ekranlarda ishlamasligi mumkin. Muhim harakatlar uchun doim `click` ham bo‘lsin.

## Hodisa obyekti

Brauzer funksiyaga hodisa haqidagi ma’lumotni **argument** sifatida beradi:

```js
maydon.onkeydown = function (event) {
  document.getElementById('tugma-nomi').textContent = event.key;
};
```

`event.key` — bosilgan tugma nomi: `'a'`, `'Enter'`, `'Escape'`, `'ArrowUp'`. `event.target` — hodisa sodir bo‘lgan element.

## Sahifa yuklanganda

```js
window.onload = function () {
  // rasmlar ham yuklangandan keyin
};
```

Skript `<body>` oxirida bo‘lsa, elementlar allaqachon tayyor — odatda `onload` shart emas.
