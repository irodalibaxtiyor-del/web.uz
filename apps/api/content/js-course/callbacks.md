## Callback funksiyalar

**Callback** — boshqa funksiyaga argument sifatida beriladigan va **keyinroq** chaqiriladigan funksiya. Siz ularni allaqachon ko‘p ishlatgansiz:

```js
tugma.onclick = function () { /* ... */ };       // bosilganda
[1, 2, 3].map((x) => x * 2);                      // har element uchun
setTimeout(() => console.log('vaqt'), 500);       // vaqt o‘tgach
```

## O‘z callback’li funksiyangiz

```js
function qollash(sonlar, fn) {
  const natija = [];
  for (const son of sonlar) {
    natija.push(fn(son));
  }
  return natija;
}

qollash([1, 2, 3, 4], (x) => x * x); // [1, 4, 9, 16]
qollash([1, 2, 3], (x) => x + 10);   // [11, 12, 13]
```

Funksiyani qabul qiladigan yoki qaytaradigan funksiyalar **yuqori tartibli** (higher-order) funksiyalar deyiladi. `map`, `filter`, `forEach` — shular.

## Sinxron va asinxron callback

- **Sinxron**: `map` callback’ni darhol, `map` tugaguncha chaqiradi.
- **Asinxron**: `setTimeout`, hodisalar, server javobi — callback **keyinroq** chaqiriladi, asosiy kod esa kutmasdan davom etadi.

```js
function malumotOl(id, callback) {
  setTimeout(() => {
    const ism = BAZA[id];
    if (ism) callback(null, { id, ism });
    else callback(new Error('Topilmadi'));
  }, 300);
}

holat.textContent = 'Yuklanmoqda...';
malumotOl(2, function (xato, foydalanuvchi) {
  if (xato) {
    xatoMatni.textContent = xato.message;
    return;
  }
  natija.textContent = foydalanuvchi.ism;
});
// bu yer callback’dan OLDIN bajariladi
```

### “Xato birinchi” (error-first) uslubi

Callback’ning birinchi argumenti — xato (yo‘q bo‘lsa `null`), ikkinchisi — natija. Node.js’da va eski kutubxonalarda keng tarqalgan.

## Natijani qaytarib bo‘lmaydi

```js
function ol() {
  let natija;
  malumotOl(1, (x, f) => {
    natija = f;
  });
  return natija; // undefined — callback hali chaqirilmagan!
}
```

Asinxron natija faqat **callback ichida** mavjud. Uni ishlatadigan kod ham callback ichida bo‘lishi kerak.

## Callback do‘zaxi

Bir nechta asinxron qadam ketma-ket bo‘lsa:

```js
foydalanuvchiOl(id, (x1, f) => {
  kurslarOl(f.id, (x2, kurslar) => {
    baholarOl(kurslar[0], (x3, baholar) => {
      // ... har darajada xato tekshiruvi
    });
  });
});
```

Kod o‘ngga “siljib” ketadi va xatolarni boshqarish qiyinlashadi. Bu muammoni **Promise** va **async/await** hal qiladi — keyingi darslar.
