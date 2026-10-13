## `switch`

Bitta qiymatni **ko‘p aniq variantlar** bilan solishtirish uchun:

```js
switch (amal) {
  case '+':
    natija = a + b;
    break;
  case '-':
    natija = a - b;
    break;
  default:
    natija = 'Noma’lum amal';
}
```

- `switch (ifoda)` — ifoda bir marta hisoblanadi;
- `case qiymat:` — ifoda shu qiymatga **qat’iy teng** (`===`) bo‘lsa, shu yerdan bajarila boshlaydi;
- `break` — `switch` dan chiqish;
- `default` — hech bir `case` mos kelmasa.

## `break` ni unutsangiz

`break` bo‘lmasa, keyingi `case` lar ham **ketma-ket** bajariladi (fall-through):

```js
switch (2) {
  case 1:
    console.log('bir');
  case 2:
    console.log('ikki');
  case 3:
    console.log('uch');
}
// ikki
// uch — break yo‘q edi!
```

## Bir nechta `case` — bitta kod

Bu xususiyatdan ataylab foydalanish mumkin:

```js
switch (kun) {
  case 'shanba':
  case 'yakshanba':
    turi = 'Dam olish kuni';
    break;
  default:
    turi = 'Ish kuni';
}
```

## Qat’iy solishtirish

`switch` `===` ishlatadi:

```js
switch ('5') {
  case 5:
    // bajarilmaydi — '5' !== 5
}
```

Input qiymatini songa aylantirish kerakmi yoki yo‘qmi — `case` dagi qiymatlarga qarang.

## Funksiyada `return` bilan

`return` funksiyani tugatgani uchun `break` kerak emas:

```js
function hisobla(a, amal, b) {
  switch (amal) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return 'Nolga bo‘lib bo‘lmaydi';
      return a / b;
    default:
      return 'Noma’lum amal';
  }
}
```

## `switch` yoki `if`?

| Holat                                          | Tanlov       |
| ---------------------------------------------- | ------------ |
| Bitta qiymat, ko‘p **aniq** variant            | `switch`     |
| Oraliqlar (`ball >= 86`), murakkab shartlar    | `if/else if` |
| Qiymatdan qiymatga moslik (kod → nom)          | obyekt       |

Oxirgi holat uchun obyekt ko‘pincha eng qisqa:

```js
const NOMLAR = { uz: 'O‘zbekcha', ru: 'Ruscha', en: 'Inglizcha' };
const nom = NOMLAR[til] ?? 'Noma’lum';
```
