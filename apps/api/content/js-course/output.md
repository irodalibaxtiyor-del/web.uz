## Natijani ko‘rsatish

JavaScript natijani bir necha joyga chiqara oladi.

| Usul                     | Qayerga chiqadi        | Qachon ishlatiladi                  |
| ------------------------ | ---------------------- | ----------------------------------- |
| `element.textContent`    | Sahifadagi elementga   | Foydalanuvchiga matn ko‘rsatish     |
| `element.innerHTML`      | Sahifaga, HTML sifatida | Teg bilan formatlangan matn         |
| `console.log()`          | Brauzer konsoliga      | Dasturchi uchun, tekshirish/xatolik |
| `alert()`                | Ogohlantirish oynasiga | Kamdan-kam, oddiy xabar             |
| `document.write()`       | Sahifa oqimiga         | **Ishlatmang** (pastda sababi)      |

## `textContent`

Elementning matnini o‘zgartiradi. Berilgan qiymat **oddiy matn** bo‘lib qoladi:

```js
document.getElementById('natija').textContent = 5 + 6; // 11
document.getElementById('natija').textContent = '<b>salom</b>'; // teglar matn bo‘lib ko‘rinadi
```

## `innerHTML`

Qiymatni **HTML** sifatida o‘qiydi:

```js
document.getElementById('natija').innerHTML = '<strong>Muhim!</strong> Darsni o‘qing.';
```

> **Xavfsizlik:** foydalanuvchi kiritgan matnni hech qachon `innerHTML` ga bermang — u yerga `<img onerror="...">` kabi zararli kod yozilishi mumkin (XSS). Oddiy matn uchun doim `textContent`.

## `console.log()`

Natijani **konsolga** yozadi. Sahifada ko‘rinmaydi — bu dasturchi uchun:

```js
console.log('Dastur boshlandi');
console.log(2 + 3); // 5
console.log('Yig‘indi:', 2 + 3); // Yig‘indi: 5
```

Mashq sahifasida **Ishga tushirish** bosilganda bu yozuvlar pastdagi **Konsol** panelida chiqadi. Haqiqiy brauzerda `F12` → **Console**.

## `alert()`

```js
alert('Ma’lumot saqlandi');
```

Oyna yopilmaguncha sahifa “muzlab” turadi, shuning uchun kam ishlatiladi. Mashq sahifasidagi preview `alert` ni konsolga yo‘naltiradi.

## `document.write()` — nega yo‘q?

U sahifa **yuklanayotganda** matnni oqimga qo‘shadi. Sahifa yuklangandan keyin chaqirilsa — **butun sahifani o‘chirib** yuboradi. Zamonaviy kodda uning o‘rniga `textContent` yoki `innerHTML` ishlatiladi.

## Ifodani hisoblab chiqarish

JavaScript qiymatni oldin hisoblaydi, keyin chiqaradi:

```js
document.getElementById('narx').textContent = 15000 * 3; // 45000
document.getElementById('xabar').textContent = 'Jami: ' + 15000 * 3; // Jami: 45000
```

Ko‘paytirish qo‘shishdan oldin bajariladi, shuning uchun `'Jami: ' + 45000` hosil bo‘ladi.
