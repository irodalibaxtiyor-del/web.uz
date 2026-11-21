## JSON

**JSON** (JavaScript Object Notation) — ma’lumotni **matn** sifatida saqlash va uzatish formati. Server javoblari, sozlama fayllari, `localStorage` — hammasida JSON.

```json
{
  "ism": "Ali",
  "yosh": 20,
  "talaba": true,
  "kurslar": ["HTML", "CSS"],
  "manzil": { "shahar": "Xiva" },
  "telefon": null
}
```

## JSON qoidalari

JSON JavaScript obyektiga o‘xshaydi, lekin **qat’iyroq**:

| Qoida                               | To‘g‘ri           | Noto‘g‘ri          |
| ----------------------------------- | ----------------- | ------------------ |
| Kalitlar qo‘sh qo‘shtirnoqda        | `"ism": "Ali"`    | `ism: "Ali"`       |
| Satrlar faqat qo‘sh qo‘shtirnoqda   | `"Ali"`           | `'Ali'`            |
| Oxirgi elementdan keyin vergul yo‘q | `[1, 2]`          | `[1, 2,]`          |
| Izoh yo‘q                           |                   | `// izoh`          |
| Qiymatlar: satr, son, boolean, `null`, massiv, obyekt | | `undefined`, funksiya, sana |

## `JSON.stringify` — obyektdan matnga

```js
const talaba = { ism: 'Ali', kurslar: ['HTML', 'CSS'] };
JSON.stringify(talaba);
// '{"ism":"Ali","kurslar":["HTML","CSS"]}'
```

Chiroyli (o‘qish uchun) ko‘rinish:

```js
JSON.stringify(talaba, null, 2);
// {
//   "ism": "Ali",
//   "kurslar": [
//     "HTML",
//     "CSS"
//   ]
// }
```

Nima bo‘ladi:

- funksiyalar va `undefined` qiymatli xususiyatlar **tushib qoladi**;
- `Date` ISO matnga aylanadi;
- `NaN` va `Infinity` → `null`.

## `JSON.parse` — matndan obyektga

```js
const matn = '{"ism":"Ali","kurslar":["HTML","CSS"]}';
const obj = JSON.parse(matn);
obj.kurslar.length; // 2
```

## Buzilgan JSON

Matn JSON qoidalariga mos kelmasa, `JSON.parse` `SyntaxError` tashlaydi. Tashqaridan kelgan (foydalanuvchi, server, fayl) JSON’ni **doim** `try...catch` ichida o‘qing:

```js
function xavfsizOqi(matn) {
  try {
    return JSON.parse(matn);
  } catch {
    return null;
  }
}

xavfsizOqi("{ism: 'Ali'}"); // null — kalit qo‘shtirnoqsiz, satr bittalikda
```

`catch` dan keyin `(xato)` shart emas, agar xato obyekti kerak bo‘lmasa.

## Chuqur nusxa

```js
const nusxa = JSON.parse(JSON.stringify(asl));
```

Oddiy ma’lumotlar uchun ishlaydi, lekin funksiyalar, sanalar va `undefined` yo‘qoladi. Zamonaviy usul — `structuredClone(asl)`.

## Server bilan

```js
const javob = await fetch('/api/kurslar');
const kurslar = await javob.json(); // JSON.parse ni ichida qiladi
```

`fetch` — asinxron modulda.

```tekshir
Obyektni JSON matnga aylantiradigan metod qaysi?
+ `JSON.stringify`
- `JSON.parse`
- `toString()`
> `stringify` — obyektdan matnga, `parse` — matndan obyektga.
```

```jonli
<pre id="out"></pre>
<script>
  // log() natijani shu oynaga chiqaradi (console.log o‘rniga)
  const log = (...a) => (document.getElementById('out').textContent += a.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))).join(' ') + '\n');
  const o = { ism: 'Ali', ballar: [90, 85] };
  const matn = JSON.stringify(o);
  log(matn, typeof matn);
  log(JSON.parse(matn).ballar[1]);
  try {
    JSON.parse("{ism: 'Ali'}");
  } catch (e) {
    log('Buzilgan JSON:', e.name);
  }
</script>
```
