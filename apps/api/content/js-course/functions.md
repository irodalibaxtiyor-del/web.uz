## Funksiyalar

**Funksiya** — nom berilgan, qayta-qayta ishlatiladigan kod bloki. Bir marta yozasiz — istalgan joyda chaqirasiz.

```js
function salomlash(ism) {
  return 'Salom, ' + ism + '!';
}

salomlash('Madina'); // 'Salom, Madina!'
salomlash('Jasur');  // 'Salom, Jasur!'
```

## Tuzilishi

```js
function nom(parametr1, parametr2) {
  // bajariladigan kod
  return natija;
}
```

- `function` — kalit so‘z;
- `nom` — funksiya nomi (o‘zgaruvchi nomlari kabi qoidalar, odatda fe’l: `hisobla`, `korsat`);
- `(parametr1, parametr2)` — funksiyaga beriladigan qiymatlar uchun nomlar;
- `{ ... }` — funksiya tanasi;
- `return` — natijani qaytaradi va funksiyani **tugatadi**.

## Parametr va argument

```js
function maydon(en, boy) {   // en, boy — parametrlar
  return en * boy;
}

maydon(4, 5); // 4 va 5 — argumentlar, natija 20
```

Parametr — funksiya ichidagi o‘zgaruvchi. Argument — chaqirishda beriladigan haqiqiy qiymat.

## `return`

```js
function celsiy(f) {
  return (f - 32) * 5 / 9;
}

const harorat = celsiy(212); // 100
document.getElementById('c').textContent = celsiy(50); // 10
```

`return` dan keyingi qatorlar bajarilmaydi. `return` bo‘lmasa, funksiya `undefined` qaytaradi.

## Chaqirish va havola

```js
celsiy(212) // funksiya CHAQIRILADI, natija: 100
celsiy      // funksiyaning O‘ZI (havola), chaqirilmaydi
```

Tugmaga funksiyani **havola** sifatida beramiz — u bosilganda chaqiriladi:

```js
function hisobla() { /* ... */ }

document.getElementById('tugma').onclick = hisobla;   // to‘g‘ri
document.getElementById('tugma').onclick = hisobla(); // xato: darhol chaqiriladi
```

## Nega funksiya kerak?

1. **Takrorlanmaslik** — bir xil kodni bir joyda yozasiz.
2. **Tushunarlilik** — `celsiy(f)` deb o‘qish formulani o‘qishdan oson.
3. **Sinash oson** — funksiyani turli qiymatlar bilan alohida tekshirish mumkin.

## Mahalliy o‘zgaruvchilar

Funksiya ichida e’lon qilingan o‘zgaruvchi faqat shu funksiya ichida mavjud:

```js
function hisob() {
  const kurs = 12600;
  return 100 * kurs;
}

console.log(kurs); // ReferenceError: kurs is not defined
```

Har chaqiruvda mahalliy o‘zgaruvchilar **yangidan** yaratiladi va funksiya tugaganda yo‘qoladi.

## Funksiya ifodasi

Funksiyani o‘zgaruvchiga ham saqlash mumkin:

```js
const kvadrat = function (x) {
  return x * x;
};

kvadrat(7); // 49
```

Tugmaga yozgan `onclick = function () { ... }` — aynan shunday **nomsiz** funksiya.

## Input bilan

```js
function celsiy(f) {
  return (f - 32) * 5 / 9;
}

document.getElementById('aylantir').onclick = function () {
  const f = Number(document.getElementById('f').value);
  document.getElementById('c').textContent = celsiy(f);
};
```

Hisob-kitob (`celsiy`) va sahifa bilan ishlash (tugma, input) **ajratilgan** — bu yaxshi uslub.
