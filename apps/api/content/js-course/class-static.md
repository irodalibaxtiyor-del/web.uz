## Statik a’zolar va yopiq maydonlar

## `static` — klassning o‘ziga tegishli

Oddiy metodlar **nusxa**da chaqiriladi (`ali.malumot()`). `static` metod va xususiyatlar esa **klassning o‘zida**:

```js
class Buyurtma {
  static prefiks = 'B-';

  static formatla(raqam) {
    return Buyurtma.prefiks + String(raqam).padStart(4, '0');
  }
}

Buyurtma.formatla(42); // 'B-0042'
```

Nusxadan chaqirib bo‘lmaydi:

```js
new Buyurtma().formatla(1); // TypeError
```

Qachon `static`:

- nusxaga bog‘liq bo‘lmagan yordamchi funksiyalar (`Math.round` kabi — `Math` ham shunday ishlaydi);
- barcha nusxalar uchun **umumiy** hisoblagich yoki sozlama;
- “fabrika” metodlari: `Talaba.jsondan(matn)`.

## Umumiy hisoblagich

```js
class Buyurtma {
  static #oxirgi = 0;

  constructor(mahsulot) {
    Buyurtma.#oxirgi++;
    this.raqam = Buyurtma.formatla(Buyurtma.#oxirgi);
    this.mahsulot = mahsulot;
  }

  static soni() {
    return Buyurtma.#oxirgi;
  }

  static formatla(raqam) {
    return 'B-' + String(raqam).padStart(4, '0');
  }
}

new Buyurtma('Non').raqam;  // 'B-0001'
new Buyurtma('Sut').raqam;  // 'B-0002'
Buyurtma.soni();            // 2
```

## `#` — yopiq (private) maydonlar

`#` bilan boshlangan maydonlarga **faqat klass ichidan** murojaat qilish mumkin:

```js
class Hamyon {
  #balans = 0;

  kirim(summa) {
    if (summa <= 0) throw new Error('Summa musbat bo‘lsin');
    this.#balans += summa;
  }

  get balans() {
    return this.#balans;
  }
}

const h = new Hamyon();
h.kirim(5000);
h.balans;          // 5000 — getter orqali o‘qish mumkin
h.#balans = 1e9;   // SyntaxError — tashqaridan yozib bo‘lmaydi
h.balans = 1e9;    // setter yo‘q: qat’iy rejimda TypeError, aks holda e’tiborsiz
```

Bu **inkapsulyatsiya**: balansni faqat `kirim` orqali, qoidaga muvofiq o‘zgartirish mumkin. Hech kim tasodifan (yoki ataylab) manfiy summa yoza olmaydi.

## Yopiq metodlar

```js
class Forma {
  #tekshir(qiymat) {
    return qiymat.trim() !== '';
  }
  yubor(qiymat) {
    if (!this.#tekshir(qiymat)) return 'Bo‘sh';
    return 'Yuborildi';
  }
}
```

## Eski usul: `_` bilan

`#` dan oldin “yopiq” degan kelishuv sifatida `_balans` yozilardi. Bu faqat **ogohlantirish** — tilda himoya yo‘q. Yangi kodda `#` ishlating.

```tekshir
`static` metod qanday chaqiriladi?
+ klass orqali: `Klass.metod()`
- nusxa orqali: `nusxa.metod()`
- faqat konstruktor ichida
> Statik a’zo klassning o‘ziga tegishli, nusxalarga emas.
```

```jonli
<pre id="out"></pre>
<script>
  // log() natijani shu oynaga chiqaradi (console.log o‘rniga)
  const log = (...a) => (document.getElementById('out').textContent += a.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))).join(' ') + '\n');
  class Hisob {
    static soni = 0;
    #balans = 0;
    constructor() { Hisob.soni++; }
    qosh(s) { this.#balans += s; return this.#balans; }
  }
  const a = new Hisob();
  new Hisob();
  log(Hisob.soni, a.qosh(100));
  log(a.balans);
</script>
```

## Xulosa

| Yozuv              | Kimga tegishli     | Qayerdan murojaat           |
| ------------------ | ------------------ | --------------------------- |
| `metod()`          | Nusxaga            | `nusxa.metod()`             |
| `static metod()`   | Klassga            | `Klass.metod()`             |
| `#maydon`          | Nusxaga, yopiq     | Faqat klass ichidan         |
| `static #maydon`   | Klassga, yopiq     | Faqat klass ichidan         |
