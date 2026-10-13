## Turini aniqlash

## `typeof`

```js
typeof 'salom'        // 'string'
typeof 42             // 'number'
typeof NaN            // 'number'
typeof true           // 'boolean'
typeof undefined      // 'undefined'
typeof 10n            // 'bigint'
typeof Symbol()       // 'symbol'
typeof function () {} // 'function'
typeof {}             // 'object'
typeof []             // 'object'  — massiv!
typeof null           // 'object'  — tarixiy xato!
typeof new Date()     // 'object'
```

`typeof` oddiy turlar va funksiyalar uchun aniq, lekin `null`, massiv va boshqa obyektlarni farqlamaydi.

## Massivmi?

```js
Array.isArray([1, 2])   // true
Array.isArray({})       // false
```

## `null` mi?

```js
const x = null;
x === null // true
```

## Aniqroq `turi` funksiyasi

```js
function turi(x) {
  if (x === null) return 'null';
  if (Array.isArray(x)) return 'array';
  return typeof x;
}

turi(null)    // 'null'
turi([1, 2])  // 'array'
turi({})      // 'object'
turi('a')     // 'string'
```

Avval maxsus holatlar (`null`, massiv), keyin umumiy `typeof`.

## `instanceof`

Obyekt qaysi “oila”dan (konstruktor yoki klassdan) yaratilganini tekshiradi:

```js
new Date() instanceof Date   // true
[] instanceof Array          // true
[] instanceof Object         // true — massiv ham obyekt
'salom' instanceof String    // false — oddiy satr obyekt emas
```

## `constructor`

```js
(42).constructor.name        // 'Number'
[].constructor === Array     // true
new Date().constructor.name  // 'Date'
```

## E’lon qilinmagan o‘zgaruvchi

`typeof` e’lon qilinmagan nom bilan ham xato bermaydi:

```js
typeof bunday_nom_yoq   // 'undefined'
bunday_nom_yoq          // ReferenceError
```

## Input qiymatini tasniflash

Input’dan doim satr keladi. “Son yozilganmi?” degan savol aslida turni emas, **mazmunni** tekshirish:

```js
function kiritmaTuri(value) {
  if (value.trim() === '') return 'bo‘sh';
  if (!isNaN(value)) return 'son';
  return 'matn';
}

kiritmaTuri('42')    // 'son'
kiritmaTuri('4a')    // 'matn'
kiritmaTuri('   ')   // 'bo‘sh'
```

`isNaN('42')` — `false` (`'42'` songa aylanadi). Bo‘sh satrni alohida tekshirish shart, chunki `Number('')` → `0` va `isNaN('')` → `false`.
