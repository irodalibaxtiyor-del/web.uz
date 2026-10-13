## Getter va setter

**Getter** va **setter** — xususiyat kabi ko‘rinadigan, lekin o‘qish yoki yozishda **funksiya** ishlaydigan a’zolar.

```js
const harorat = {
  celsiyQiymat: 20,

  get farengeyt() {
    return this.celsiyQiymat * 9 / 5 + 32;
  },

  set farengeyt(f) {
    this.celsiyQiymat = (f - 32) * 5 / 9;
  },
};

harorat.farengeyt;       // 68 — getter chaqirildi
harorat.farengeyt = 212; // setter chaqirildi
harorat.celsiyQiymat;    // 100
```

Qavs yo‘q: `harorat.farengeyt`, `harorat.farengeyt()` emas.

## Hisoblanadigan xususiyat

Ma’lumot **bir joyda** saqlanadi (Selsiyda), boshqa ko‘rinish (Farengeyt) har safar hisoblanadi — ikki qiymat hech qachon bir-biriga zid bo‘lib qolmaydi.

```js
const talaba = {
  ism: 'Ali',
  familiya: 'Valiyev',
  get toliqIsm() {
    return `${this.ism} ${this.familiya}`;
  },
};
```

## Tekshiruvchi setter

Setter noto‘g‘ri qiymatni rad etishi mumkin:

```js
const harorat = {
  _c: 20,

  get celsiy() {
    return this._c;
  },

  set celsiy(qiymat) {
    if (qiymat < -273.15) {
      throw new RangeError('Absolyut noldan past bo‘lmaydi');
    }
    this._c = qiymat;
  },
};

try {
  harorat.celsiy = -300;
} catch (xato) {
  console.log(xato.message);
}
```

`_c` — “ichki, to‘g‘ridan-to‘g‘ri ishlatmang” degan kelishuv. Klasslarda buning uchun haqiqiy yopiq maydon `#c` bor.

## Klasslarda

```js
class Harorat {
  #c = 0;

  get celsiy() {
    return this.#c;
  }

  set celsiy(q) {
    if (q < -273.15) throw new RangeError('Absolyut noldan past bo‘lmaydi');
    this.#c = q;
  }

  get farengeyt() {
    return this.#c * 9 / 5 + 32;
  }

  set farengeyt(f) {
    this.celsiy = (f - 32) * 5 / 9; // tekshiruv celsiy setterida
  }
}
```

## `Object.defineProperty`

Mavjud obyektga getter qo‘shish yoki xususiyat sozlamalarini boshqarish:

```js
const kurs = { narx: 450000 };

Object.defineProperty(kurs, 'chegirmali', {
  get() {
    return this.narx * 0.8;
  },
});

kurs.chegirmali; // 360000
```

## Faqat getter bo‘lsa

Setter bo‘lmagan xususiyatga yozish oddiy rejimda e’tiborsiz qoladi, qat’iy rejimda `TypeError` beradi. Bu “faqat o‘qish uchun” xususiyat yasashning oson yo‘li.

## Ehtiyotkorlik

Getter **tez** va **yon ta’sirsiz** bo‘lsin. `obj.qiymat` ni o‘qish server so‘rovi yuborishi yoki boshqa ma’lumotni o‘zgartirishi kutilmaydi — bunday ishlar uchun oddiy metod yozing.
