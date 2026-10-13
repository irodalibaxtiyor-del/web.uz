## Taymerlar

Ba’zan kod **darhol** emas, biroz keyin yoki muntazam ravishda bajarilishi kerak: xabarni 3 soniyadan keyin yashirish, soatni har soniyada yangilash.

## `setTimeout` — bir marta, kechiktirib

```js
setTimeout(function () {
  document.getElementById('xabar').textContent = 'Yuborildi';
}, 500); // 500 millisoniya = 0.5 soniya
```

Muhim: `setTimeout` kodni **to‘xtatmaydi**. U funksiyani “keyinroq bajarish” ro‘yxatiga qo‘yadi va keyingi qatorga darhol o‘tadi:

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
// 1, 3, 2 — hatto 0 ms bo‘lsa ham!
```

Bu JavaScript’ning **asinxron** tabiatining birinchi ko‘rinishi.

## Bekor qilish: `clearTimeout`

`setTimeout` raqam (ID) qaytaradi:

```js
let taymer = null;

document.getElementById('yubor').onclick = function () {
  holat.textContent = 'Yuborilmoqda...';
  taymer = setTimeout(() => {
    holat.textContent = 'Yuborildi';
  }, 500);
};

document.getElementById('bekor').onclick = function () {
  clearTimeout(taymer);
  holat.textContent = 'Bekor qilindi';
};
```

Gmail’dagi “Yuborishni bekor qilish” tugmasi aynan shunday ishlaydi.

## `setInterval` — muntazam takrorlash

```js
let qolgan = 3;
const id = setInterval(() => {
  if (qolgan > 0) {
    sanoq.textContent = qolgan;
    qolgan--;
  } else {
    sanoq.textContent = 'Boshlandi!';
    clearInterval(id); // to‘xtatishni unutmang!
  }
}, 200);
```

`clearInterval` chaqirilmasa, interval sahifa yopilguncha ishlayveradi.

## Argumentlar uzatish

```js
setTimeout(salomlash, 1000, 'Ali'); // 1 soniyadan keyin salomlash('Ali')
```

## Funksiyani berish, chaqirmaslik

```js
setTimeout(yangila, 1000);   // to‘g‘ri — havola
setTimeout(yangila(), 1000); // xato — darhol chaqiriladi, natijasi beriladi
```

## Aniqlik

Taymerlar **kafolatlangan** vaqtda emas, “kamida shuncha vaqtdan keyin” ishlaydi. Brauzer band bo‘lsa yoki tab fonda bo‘lsa, kechikish ko‘payadi. Shuning uchun soat yoki sekundomer yasashda o‘tgan vaqtni `Date.now()` farqi bilan hisoblang, intervallar sonini sanamang.

## Cheksiz sikl va taymer

```js
while (true) {} // butun sahifani qotiradi
```

Taymer esa brauzerga “nafas olish” imkonini beradi: ishlar orasida sahifa javob beradi. Uzoq hisoblarni bo‘laklarga bo‘lish uchun ham shu g‘oya ishlatiladi.

## Animatsiya uchun

Vizual animatsiyalar uchun `setInterval` o‘rniga `requestAnimationFrame` yaxshiroq — u ekran yangilanishi bilan sinxron ishlaydi (DOM modulida ko‘ramiz).
