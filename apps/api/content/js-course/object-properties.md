## Xususiyatlarga murojaat

Obyekt xususiyatini o‘qishning ikki usuli bor.

### Nuqta orqali

```js
const lugat = { olma: 'apple', non: 'bread' };
lugat.olma // 'apple'
```

Qisqa va o‘qish oson. Lekin kalit **kodda yozilgan** bo‘lishi kerak.

### Kvadrat qavs orqali

```js
lugat['olma'] // 'apple'

const soz = 'non';
lugat[soz]    // 'bread' — kalit o‘zgaruvchidan olinadi
```

Kvadrat qavs kalit **dastur ishlayotganda** ma’lum bo‘lganda kerak — masalan, foydalanuvchi kiritgan so‘z bo‘yicha qidirish:

```js
const soz = document.getElementById('soz').value;
const tarjima = lugat[soz];
```

`lugat.soz` deb yozish xato bo‘lardi — u aynan `'soz'` nomli kalitni qidiradi.

Bo‘sh joy yoki chiziqcha bor kalitlar ham faqat qavs bilan o‘qiladi:

```js
const narxlar = { 'kurs-narxi': 450000 };
narxlar['kurs-narxi'] // 450000
```

## Yo‘q xususiyat

```js
lugat.kitob // undefined
```

Standart qiymat berish uchun `??` (yoki `||`) operatori:

```js
const tarjima = lugat[soz] ?? 'Topilmadi';
```

`??` — chapdagi qiymat `undefined` yoki `null` bo‘lsa, o‘ngdagini oladi.

## Qo‘shish, o‘zgartirish, o‘chirish

```js
lugat.suv = 'water';          // qo‘shish
lugat['kitob'] = 'book';      // qo‘shish (kalit o‘zgaruvchidan ham bo‘ladi)
lugat.olma = 'an apple';      // o‘zgartirish
delete lugat.non;             // o‘chirish
```

## Kalit bormi?

```js
'olma' in lugat   // true
'anor' in lugat   // false
```

## Nechta xususiyat bor?

```js
Object.keys(lugat)          // ['olma', 'suv', 'kitob'] — kalitlar massivi
Object.keys(lugat).length   // 3
Object.values(lugat)        // qiymatlar massivi
```

## Ichma-ich obyektlar

```js
const kurs = {
  nom: 'JavaScript',
  muallif: { ism: 'Dilshod', tajriba: 7 },
};

kurs.muallif.ism         // 'Dilshod'
kurs['muallif']['ism']   // xuddi shu
kurs.tahrirchi?.ism      // undefined — xato bermaydi
```

`?.` (**optional chaining**) — oraliq qiymat yo‘q bo‘lsa, xato o‘rniga `undefined` qaytaradi. Usiz `kurs.tahrirchi.ism` `TypeError` berardi.

```tekshir
Obyektda xususiyat borligini qaysi ifoda to‘g‘ri tekshiradi?
+ `'ism' in obj`
+ `Object.hasOwn(obj, 'ism')`
- `obj.ism == true`
- `obj.has('ism')`
> `obj.ism == true` qiymat `0` yoki `''` bo‘lsa noto‘g‘ri javob beradi.
```

```jonli
<pre id="out"></pre>
<script>
  // log() natijani shu oynaga chiqaradi (console.log o‘rniga)
  const log = (...a) => (document.getElementById('out').textContent += a.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))).join(' ') + '\n');
  const kitob = { nomi: 'JS', bet: 0 };
  log('bet' in kitob, Object.hasOwn(kitob, 'muallif'));
  delete kitob.bet;
  log(Object.keys(kitob).length);
  log(kitob.muallif?.ism);
</script>
```
