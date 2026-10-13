## Xatolarni boshqarish

Dasturda xato bo‘lishi mumkin: foydalanuvchi noto‘g‘ri ma’lumot kiritadi, server javob bermaydi, kutilmagan qiymat keladi. Xato **ushlanmasa**, skript to‘xtaydi va sahifaning qolgan qismi ishlamay qoladi.

## `try...catch`

```js
try {
  // xato chiqishi mumkin bo‘lgan kod
} catch (xato) {
  // xato chiqsa — shu yer bajariladi
}
```

```js
try {
  const obyekt = JSON.parse('{noto‘g‘ri json}');
} catch (xato) {
  document.getElementById('xato').textContent = 'Ma’lumot buzilgan';
  console.error(xato.name, xato.message); // SyntaxError ...
}
// skript davom etadi
```

## Xato obyekti

| Xususiyat      | Ma’nosi                                  |
| -------------- | ---------------------------------------- |
| `name`         | Turi: `TypeError`, `ReferenceError`…     |
| `message`      | Tushuntirish matni                       |
| `stack`        | Qayerda sodir bo‘lgani (dasturchi uchun) |

## Asosiy xato turlari

| Tur              | Qachon                                         |
| ---------------- | ---------------------------------------------- |
| `ReferenceError` | E’lon qilinmagan nom: `nomaLum()`              |
| `TypeError`      | Noto‘g‘ri turdagi amal: `null.ism`, `5()`      |
| `SyntaxError`    | Yozuv xatosi (yoki `JSON.parse` dagi)          |
| `RangeError`     | Ruxsat etilmagan oraliq: `(1).toFixed(200)`    |

## O‘z xatoingizni tashlash: `throw`

Funksiya noto‘g‘ri ma’lumot olsa, jimgina noto‘g‘ri natija qaytarishdan ko‘ra **xato tashlagani** yaxshi:

```js
function bol(a, b) {
  if (isNaN(a) || isNaN(b)) throw new TypeError('Son kiriting');
  if (b === 0) throw new Error('Nolga bo‘lib bo‘lmaydi');
  return a / b;
}
```

Xatoni chaqiruvchi tomon ushlaydi va foydalanuvchiga tushunarli xabar ko‘rsatadi:

```js
try {
  natija.textContent = bol(a, b);
  xatoMatni.textContent = '';
} catch (xato) {
  natija.textContent = '';
  xatoMatni.textContent = xato.message;
}
```

## `finally`

Xato bo‘ladimi yoki yo‘qmi — **har doim** bajariladi:

```js
try {
  // ...
} catch (xato) {
  // ...
} finally {
  holat.textContent = 'Tekshirildi';
}
```

Tozalash ishlari uchun: yuklanish belgisini yashirish, tugmani yana faollashtirish.

## Xato turiga qarab

```js
catch (xato) {
  if (xato instanceof TypeError) {
    // ma’lumot turi bilan muammo
  } else {
    throw xato; // biz kutmagan xato — yuqoriga uzatamiz
  }
}
```

> Barcha xatolarni “yutib yuborish” (bo‘sh `catch {}`) yomon odat: muammo yashirinadi va keyin topish qiyin bo‘ladi. Kutilgan xatolarni ushlang, qolganini uzating yoki hech bo‘lmasa `console.error` qiling.

## Ushlangan xato konsolni bulg‘amaydi

Ushlanmagan xato konsolda qizil bo‘lib chiqadi va CHECK’dagi “Konsolda xato yo‘q” tekshiruvini yiqitadi. `try...catch` bilan to‘g‘ri ishlangan xato esa dasturning **odatiy** holatiga aylanadi.
