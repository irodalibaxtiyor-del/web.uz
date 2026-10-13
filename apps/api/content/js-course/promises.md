## Promise

**Promise** (va’da) — kelajakda tayyor bo‘ladigan natijani ifodalovchi obyekt. U uch holatdan birida bo‘ladi:

| Holat       | Ma’nosi                       |
| ----------- | ----------------------------- |
| `pending`   | Kutilmoqda                    |
| `fulfilled` | Muvaffaqiyatli, natija bor    |
| `rejected`  | Xato bilan tugadi             |

Holat bir marta o‘zgaradi va keyin qotib qoladi.

## Promise yaratish

```js
function malumotOl(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      const ism = BAZA[id];
      if (ism) resolve(ism);
      else reject(new Error('Topilmadi'));
    }, 300);
  });
}
```

- `resolve(qiymat)` — muvaffaqiyat;
- `reject(xato)` — xato (doim `Error` obyekti bering).

## Natijani olish: `then`, `catch`, `finally`

```js
holat.textContent = 'Yuklanmoqda...';

malumotOl(1)
  .then((ism) => {
    natija.textContent = ism;
  })
  .catch((xato) => {
    xatoMatni.textContent = xato.message;
  })
  .finally(() => {
    holat.textContent = 'Tayyor';
  });
```

Callback’lardan farqi — natija va xato **alohida, aniq** joylarda ishlanadi, ichma-ich darajalar yo‘q.

## Zanjir

`then` ichida qaytarilgan qiymat (yoki Promise) keyingi `then` ga o‘tadi:

```js
malumotOl(1)
  .then((ism) => kurslarOl(ism))  // yangi Promise
  .then((kurslar) => kurslar.join(', '))
  .then((matn) => {
    natija.textContent = matn;
  })
  .catch((xato) => {
    // zanjirning ISTALGAN joyidagi xato shu yerga keladi
  });
```

## Bir vaqtda bir nechta: `Promise.all`

```js
Promise.all([malumotOl(1), malumotOl(2)])
  .then((ismlar) => {
    natija.textContent = ismlar.join(', '); // 'Ali, Madina'
  });
```

- Hammasi **parallel** ishlaydi — ketma-ketdan tezroq;
- natijalar massivi so‘rovlar **tartibida**;
- bittasi xato bersa — butun `Promise.all` xato.

Boshqa variantlar:

| Metod                 | Qachon tugaydi                                       |
| --------------------- | ---------------------------------------------------- |
| `Promise.all`         | Hammasi muvaffaqiyatli (yoki birinchi xato)          |
| `Promise.allSettled`  | Hammasi tugaganda, har birining holati bilan         |
| `Promise.race`        | Birinchi tugagani (muvaffaqiyat yoki xato)           |
| `Promise.any`         | Birinchi muvaffaqiyatlisi                            |

## Ushlanmagan xato

`catch` bo‘lmasa, rad etilgan Promise konsolda `Uncaught (in promise)` xatosini beradi. Har bir Promise zanjiri `catch` bilan tugasin.

## Tayyor Promise

```js
Promise.resolve(5).then((x) => console.log(x)); // 5
Promise.reject(new Error('xato')).catch((e) => console.log(e.message));
```

## Kutish yordamchisi

```js
const kutish = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

kutish(500).then(() => console.log('yarim soniya o‘tdi'));
```
