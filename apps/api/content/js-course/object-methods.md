## Obyekt metodlari

**Metod** — obyektning xususiyati bo‘lgan funksiya. Obyekt nafaqat ma’lumot saqlaydi, balki o‘sha ma’lumot bilan **ish bajaradi**:

```js
const hisob = {
  egasi: 'Dilnoza',
  balans: 50000,
  kirim(summa) {
    this.balans += summa;
  },
  malumot() {
    return this.egasi + ': ' + this.balans + ' so‘m';
  },
};

hisob.kirim(20000);
hisob.malumot(); // 'Dilnoza: 70000 so‘m'
```

`kirim(summa) { ... }` — `kirim: function (summa) { ... }` ning qisqa yozuvi.

## `this`

Metod ichida `this` — metodni chaqirgan **obyektning o‘zi**. `hisob.kirim(...)` chaqirilganda `this` — `hisob`.

```js
malumot() {
  return this.egasi; // hisob.egasi
}
```

Nega `hisob.egasi` deb yozmaymiz? Chunki metod boshqa obyektga ko‘chirilsa yoki obyekt boshqa nom bilan saqlansa ham, `this` doim “o‘zini” ko‘rsatadi. (`this` ning boshqa holatlari — alohida darsda.)

## Metodni chaqirish va havola

```js
hisob.malumot()  // natija: 'Dilnoza: 70000 so‘m'
hisob.malumot    // funksiyaning o‘zi
```

Qavssiz yozsangiz, sahifada funksiya kodi chiqib qoladi — keng tarqalgan xato.

## Obyektni matnga aylantirish

### Xususiyatlarni ulash

```js
hisob.egasi + ': ' + hisob.balans
```

### `JSON.stringify`

```js
JSON.stringify({ egasi: 'Dilnoza', balans: 50000 })
// '{"egasi":"Dilnoza","balans":50000}'
```

`JSON.stringify` **metodlarni tashlab yuboradi** — faqat ma’lumot qoladi:

```js
JSON.stringify(hisob) // '{"egasi":"Dilnoza","balans":70000}'
```

Bu obyektni saqlash yoki serverga yuborish uchun asosiy usul (JSON — alohida darsda).

### `Object.values` va `Object.entries`

```js
Object.values({ a: 1, b: 2 })  // [1, 2]
Object.entries({ a: 1, b: 2 }) // [['a', 1], ['b', 2]]
```

## Tayyor metodlar

Siz allaqachon ko‘p metod ishlatgansiz:

```js
document.getElementById('x')  // document obyektining metodi
console.log('salom')          // console obyektining metodi
'salom'.toUpperCase()         // satrning metodi: 'SALOM'
```

## Metod va sahifa

Obyekt **ma’lumot va qoidalarni** saqlaydi, tugmalar esa metodlarni chaqiradi:

```js
document.getElementById('kirim').onclick = function () {
  hisob.kirim(Number(document.getElementById('summa').value));
  document.getElementById('info').textContent = hisob.malumot();
};
```

Balansni hisoblash qoidasi bir joyda — `hisob` ichida. Sahifa kodi faqat chaqiradi va ko‘rsatadi.
