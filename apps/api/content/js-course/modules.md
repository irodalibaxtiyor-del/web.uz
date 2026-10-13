## Modullar

Loyiha kattalashgani sari bitta `script.js` minglab qatorga aylanadi. **Modullar** kodni mantiqiy fayllarga bo‘lish va ular orasida aniq bog‘lanish yaratish imkonini beradi.

## Eksport

`matematika.js`:

```js
export const PI = 3.14159;

export function doiraMaydoni(r) {
  return PI * r ** 2;
}

function ichkiYordamchi() {
  // eksport qilinmagan — boshqa fayllar ko‘rmaydi
}
```

Faqat `export` qilingan narsalar tashqariga ochiq. Qolgani — modulning **ichki** ishi.

## Import

`main.js`:

```js
import { doiraMaydoni, PI } from './matematika.js';

document.getElementById('natija').textContent = doiraMaydoni(3).toFixed(2);
```

- Nomlar jingalak qavsda va eksportdagi nom bilan **aynan** bir xil;
- yo‘l `./` bilan boshlanadi va **kengaytma** (`.js`) yoziladi.

### Boshqa nom bilan

```js
import { doiraMaydoni as maydon } from './matematika.js';
```

### Hammasini bitta obyektga

```js
import * as mat from './matematika.js';
mat.doiraMaydoni(3);
```

## Default eksport

Modul **bitta asosiy** narsa eksport qilsa:

```js
// Talaba.js
export default class Talaba {
  /* ... */
}
```

```js
// main.js
import Talaba from './Talaba.js'; // jingalak qavssiz, nomni o‘zingiz tanlaysiz
```

Bitta modulda bitta `default` va istalgancha nomli eksport bo‘lishi mumkin.

## HTML’da ulash

```html
<script type="module" src="main.js"></script>
```

`type="module"` majburiy. Faqat **kirish nuqtasi** (`main.js`) ulanadi — qolganlarini brauzer `import` lar bo‘yicha o‘zi yuklaydi.

## Modullarning xususiyatlari

| Xususiyat                            | Oddiy skript    | Modul                        |
| ------------------------------------ | --------------- | ---------------------------- |
| Qat’iy rejim                         | `'use strict'` kerak | **doim** yoqilgan        |
| Yuqori darajadagi o‘zgaruvchilar     | Global          | Faqat shu modulda            |
| Bajarilish vaqti                     | Darhol          | `defer` kabi — sahifa o‘qilgandan keyin |
| Necha marta bajariladi               | Har ulanishda   | **Bir marta**, keyin keshdan |
| `file://` dan ochish                 | Ishlaydi        | Server kerak (CORS)          |

Modul o‘zgaruvchilari global bo‘lmagani uchun nom to‘qnashuvi muammosi yo‘qoladi.

## Dinamik import

Kod faqat kerak bo‘lganda yuklanadi:

```js
document.getElementById('grafik').onclick = async function () {
  const { chiz } = await import('./grafik.js');
  chiz();
};
```

## Mashq sahifasida

Mashq muharriridagi **Ishga tushirish** preview’i loyihani bitta hujjatga yig‘adi, shuning uchun fayllar orasidagi `import` u yerda ishlamaydi. Modullarni sinash uchun kompyuteringizda kichik server ishga tushiring, masalan VS Code’dagi **Live Server** kengaytmasi yoki `npx serve`.

## Loyihani bo‘lish namunasi

```text
js/
  main.js          — kirish nuqtasi: hodisalarni ulaydi
  api.js           — server bilan ishlash
  savat.js         — savat mantig‘i (DOM’siz)
  korinish.js      — DOM’ga chizish
  yordamchi.js     — formatlash, sana funksiyalari
```

Mantiq (`savat.js`) va ko‘rinish (`korinish.js`) ajratilsa, mantiqni brauzersiz sinash ham oson bo‘ladi.
