## Son metodlari

## `toFixed` — verguldan keyingi xonalar

Sonni **matnga** aylantiradi va berilgan xonagacha yaxlitlaydi:

```js
(12.3456).toFixed(2)  // '12.35'
(5).toFixed(2)        // '5.00'
(126500).toFixed(2)   // '126500.00'
(0.1 + 0.2).toFixed(1) // '0.3'
```

Pul summalarini ko‘rsatish uchun eng ko‘p ishlatiladi. Natija — matn, unga son qo‘shmang.

## `toString` — sanoq tizimi

```js
(255).toString()    // '255'
(10).toString(2)    // '1010'  — ikkilik
(255).toString(16)  // 'ff'    — o‘n oltilik (CSS ranglaridagi kabi)
```

## `toPrecision`

Umumiy raqamlar soni:

```js
(123.456).toPrecision(4) // '123.5'
```

## Matndan songa: uch usul

| Funksiya           | `'45.7 kg'` | `'12px'` | `'abc'` | `''` |
| ------------------ | ----------- | -------- | ------- | ---- |
| `Number(x)`        | `NaN`       | `NaN`    | `NaN`   | `0`  |
| `parseFloat(x)`    | `45.7`      | `12`     | `NaN`   | `NaN` |
| `parseInt(x)`      | `45`        | `12`     | `NaN`   | `NaN` |

- `Number` — **butun** matn son bo‘lishini talab qiladi.
- `parseFloat` / `parseInt` — boshidan imkon qadar ko‘p raqam oladi, qolganini tashlaydi.

```js
parseFloat('45.7 kg') // 45.7
parseInt('45.7 kg')   // 45
parseInt('ff', 16)    // 255 — sanoq tizimini berish mumkin
```

CSS qiymatlari bilan ishlashda qulay:

```js
parseInt('24px') + 8 // 32
```

## `Number` xususiyatlari

```js
Number.MAX_SAFE_INTEGER  // 9007199254740991
Number.MIN_SAFE_INTEGER  // -9007199254740991
Number.EPSILON           // 2.220446049250313e-16 — eng kichik farq
Number.isInteger(7)      // true
Number.isNaN(NaN)        // true
Number.isFinite(1 / 0)   // false
```

### Kasrlarni solishtirish

```js
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true — “deyarli teng”
```

## Mahalliy formatlash

```js
(1234567.891).toLocaleString('en-US') // '1,234,567.891'
```

Natija tilga va brauzerga bog‘liq: turli tillarda ajratgich turlicha. Aniq format kerak bo‘lsa, `toFixed` va satr metodlari ishonchliroq.

## Valyuta hisob-kitobi

```js
const KURS = 12650;

function somga(dollar) {
  return (dollar * KURS).toFixed(2);
}

somga(10)   // '126500.00'
somga(2.5)  // '31625.00'
```
