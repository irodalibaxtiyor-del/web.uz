## `if`, `else if`, `else`

Shart bajarilsa — bitta kod, bajarilmasa — boshqa kod.

```js
if (shart) {
  // shart true bo‘lsa
}
```

```js
const ball = 75;

if (ball >= 60) {
  natija = 'O‘tdi';
} else {
  natija = 'O‘tmadi';
}
```

## Bir nechta shart: `else if`

```js
if (ball >= 86) {
  baho = '5 (a’lo)';
} else if (ball >= 71) {
  baho = '4 (yaxshi)';
} else if (ball >= 56) {
  baho = '3 (qoniqarli)';
} else {
  baho = '2 (qoniqarsiz)';
}
```

Shartlar **yuqoridan pastga** tekshiriladi va **birinchi** to‘g‘ri kelgani bajariladi. Shuning uchun tartib muhim: `ball >= 56` ni birinchi yozsangiz, 92 ball ham “3” olardi.

## Avval noto‘g‘ri holatlarni chiqarib tashlash

Foydalanuvchi har narsa yozishi mumkin: `-5`, `120`, `abc`. Bunday holatlarni **boshida** tekshiring:

```js
const ball = Number(document.getElementById('ball').value);

if (isNaN(ball) || ball < 0 || ball > 100) {
  baho = 'Noto‘g‘ri ball';
} else if (ball >= 86) {
  baho = '5 (a’lo)';
}
// ...
```

## Erta qaytish (early return)

Funksiyada `return` bilan shartlarni tekisroq yozish mumkin:

```js
function baho(ball) {
  if (isNaN(ball) || ball < 0 || ball > 100) return 'Noto‘g‘ri ball';
  if (ball >= 86) return '5 (a’lo)';
  if (ball >= 71) return '4 (yaxshi)';
  if (ball >= 56) return '3 (qoniqarli)';
  return '2 (qoniqarsiz)';
}
```

`return` funksiyani tugatgani uchun `else` kerak emas. Bu uslub ichma-ich `if` lardan o‘qishga osonroq.

## Chegaraviy qiymatlar

Shartlarda `>` va `>=` ni adashtirish — eng ko‘p uchraydigan xato. Chegaradagi qiymatlarni doim alohida sinab ko‘ring: 85 va 86, 70 va 71, 55 va 56, 0 va 100.

## Jingalak qavslar

Bitta buyruq bo‘lsa, `{}` ni tushirib qoldirish mumkin:

```js
if (ball > 100) baho = 'Noto‘g‘ri';
```

Lekin keyin ikkinchi qator qo‘shilsa, u shartdan **tashqarida** qoladi. Ko‘p qatorli shartlarda doim `{}` yozing.

## Truthy shartlar

```js
const ism = document.getElementById('ism').value.trim();

if (!ism) {
  xabar = 'Ismni kiriting';
}
```

`!ism` — bo‘sh satr uchun `true`.

## Ichma-ich shartlar

```js
if (kirgan) {
  if (admin) {
    menyu = 'Boshqaruv paneli';
  } else {
    menyu = 'Kabinet';
  }
} else {
  menyu = 'Kirish';
}
```

Ikki darajadan chuqurroq bo‘lsa, erta qaytish yoki alohida funksiyalar bilan soddalashtiring.

```tekshir
`ball = 85` bo‘lsa, `if (ball >= 90) natija = 'A'; else if (ball >= 80) natija = 'B'; else natija = 'C';` dan keyin `natija` nima?
- `A`
+ `B`
- `C`
> Birinchi rost shartning bloki bajariladi, qolganlari tekshirilmaydi.
```

```jonli
<pre id="out"></pre>
<script>
  // log() natijani shu oynaga chiqaradi (console.log o‘rniga)
  const log = (...a) => (document.getElementById('out').textContent += a.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))).join(' ') + '\n');
  function baho(ball) {
    if (ball < 0 || ball > 100) return 'noto‘g‘ri';
    if (ball >= 90) return 'A';
    if (ball >= 80) return 'B';
    return 'C';
  }
  log(baho(95), baho(85), baho(40), baho(120));
</script>
```
