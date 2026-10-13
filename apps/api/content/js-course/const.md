## `const` kalit so‘zi

`const` bilan e’lon qilingan o‘zgaruvchiga qiymat **faqat bir marta** beriladi:

```js
const NARX = 25000;
NARX = 30000; // TypeError: Assignment to constant variable.
```

Qiymat e’lon qilish paytida berilishi shart:

```js
const NARX;   // SyntaxError: Missing initializer in const declaration
NARX = 25000;
```

`let` kabi `const` ham **blok doirasiga** ega va qayta e’lon qilinmaydi.

## Qachon `const`?

Zamonaviy kodda qoida oddiy: **default — `const`**. Qiymat haqiqatan o‘zgarishi kerak bo‘lsa (hisoblagich, yig‘indi) — `let`.

```js
const tugma = document.getElementById('hisobla'); // element o‘zgarmaydi
let jami = 0;                                     // yig‘indi o‘zgaradi
```

Bu kodni o‘qiganga yordam beradi: `const` ni ko‘rsa, qiymat pastda o‘zgarmasligini biladi.

## Nomlash

Butun dastur davomida o‘zgarmaydigan, oldindan ma’lum sozlamalar ko‘pincha **katta harflar** bilan yoziladi:

```js
const CHIPTA_NARXI = 25000;
const MAKS_URINISH = 3;
```

Hisoblangan qiymatlar esa oddiy camelCase: `const jami = soni * CHIPTA_NARXI;`.

## O‘zgarmas — bu qiymat emas, bog‘lanish

`const` o‘zgaruvchini **boshqa qiymatga bog‘lashni** taqiqlaydi. Agar qiymat obyekt yoki massiv bo‘lsa, uning **ichini** o‘zgartirish mumkin:

```js
const talaba = { ism: 'Ali', ball: 80 };
talaba.ball = 95;            // to‘g‘ri — obyekt ichi o‘zgardi
talaba = { ism: 'Vali' };    // TypeError — boshqa obyektga bog‘lab bo‘lmaydi

const ranglar = ['qizil'];
ranglar.push('yashil');      // to‘g‘ri
```

Obyekt va massivlarni keyingi modullarda o‘rganamiz.

## Yangi qiymat kerak bo‘lsa

Konstantani o‘zgartirish o‘rniga undan **yangi** o‘zgaruvchi hisoblang:

```js
const NARX = 25000;
const yangiNarx = NARX + 5000; // 30000, NARX esa 25000 ligicha
```

## Tugma bilan hisoblash

```js
const NARX = 25000;

document.getElementById('hisobla').onclick = function () {
  const soni = document.getElementById('soni').value;
  document.getElementById('jami').textContent = soni * NARX;
};
```

Har bosishda funksiya **yangidan** ishlaydi va `soni` yangi `const` bo‘lib yaratiladi — shuning uchun bu xato emas.

`value` doim matn, lekin `*` operatori matnni songa aylantiradi: `'4' * 25000` → `100000`. (`+` bilan bunday emas — buni keyingi darsda ko‘ramiz.)
