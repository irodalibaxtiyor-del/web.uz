## Meros olish (`extends`)

Bir klass boshqasining barcha xususiyat va metodlarini **meros** olib, ularni kengaytirishi mumkin:

```js
class Hisob {
  constructor(egasi, balans) {
    this.egasi = egasi;
    this.balans = balans;
  }
  kirim(summa) {
    this.balans += summa;
  }
  malumot() {
    return `${this.egasi}: ${this.balans} so‘m`;
  }
}

class JamgarmaHisob extends Hisob {
  constructor(egasi, balans, foiz) {
    super(egasi, balans); // ota klass konstruktori
    this.foiz = foiz;
  }
  foizQosh() {
    this.balans += Math.round((this.balans * this.foiz) / 100);
  }
  malumot() {
    return `${super.malumot()} (${this.foiz}%)`;
  }
}
```

```js
const j = new JamgarmaHisob('Dilnoza', 100000, 10);
j.kirim(50000);     // meros qilingan metod
j.foizQosh();       // o‘zining metodi
j.malumot();        // 'Dilnoza: 165000 so‘m (10%)'
```

## `super`

- `super(...)` — konstruktorda **ota** klass konstruktorini chaqiradi. Bola konstruktorida `this` ni ishlatishdan **oldin** chaqirilishi shart:

```js
constructor(egasi, balans, foiz) {
  this.foiz = foiz; // ReferenceError — super() hali chaqirilmagan
  super(egasi, balans);
}
```

- `super.metod()` — ota klassning metodini chaqiradi. Metodni **qayta yozganda** (override) ota versiyasidan foydalanish uchun qulay.

## Metodni qayta yozish

Bola klassda xuddi shu nomli metod ota metodni **almashtiradi**:

```js
malumot() {
  return `${super.malumot()} (${this.foiz}%)`; // otaniki + qo‘shimcha
}
```

## `instanceof` va meros

```js
j instanceof JamgarmaHisob // true
j instanceof Hisob         // true — u ham Hisob
new Hisob('A', 0) instanceof JamgarmaHisob // false
```

## Qachon meros?

“**X — bu Y ning bir turi**” deb aytish mumkin bo‘lsa: jamg‘arma hisobi — hisobning bir turi; admin — foydalanuvchining bir turi.

“X **ichida** Y bor” bo‘lsa — meros emas, **tarkib**: savatda mahsulotlar bor → `this.mahsulotlar = []`.

> Uzun meros zanjirlari (A → B → C → D) kodni chalkashtiradi. Bir-ikki daraja odatda yetarli.

## Tayyor klasslardan meros

```js
class TekshiruvXatosi extends Error {
  constructor(maydon, xabar) {
    super(xabar);
    this.name = 'TekshiruvXatosi';
    this.maydon = maydon;
  }
}

throw new TekshiruvXatosi('email', 'Email noto‘g‘ri');
```

O‘z xato turlaringiz — `catch` da `instanceof` bilan ajratish uchun qulay.
