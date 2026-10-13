## Muntazam ifodalar (RegExp)

**Muntazam ifoda** — matndagi **naqsh**ni tasvirlash tili: “boshida +998, keyin 9 ta raqam”, “barcha raqamlar”, “ketma-ket bo‘sh joylar”.

```js
const naqsh = /salom/i;
```

`/.../` — ifoda, oxiridagi harflar — **bayroqlar**.

## Asosiy metodlar

```js
/\d+/.test('Narx: 4000')          // true — mos keladimi?
'Narx: 4000, 12'.match(/\d+/g)    // ['4000', '12'] — hammasini topish
'a  b   c'.replace(/\s+/g, ' ')   // 'a b c' — almashtirish
'2026-03-08'.split(/-/)           // ['2026', '03', '08']
'Narx: 4000'.search(/\d/)         // 6 — birinchi moslik qayerda
```

## Bayroqlar

| Bayroq | Ma’nosi                                       |
| ------ | --------------------------------------------- |
| `g`    | Global — **barcha** mosliklar (birinchisi emas) |
| `i`    | Katta-kichik harfga qaramaslik                |
| `m`    | Ko‘p qatorli: `^` va `$` har qatorga          |

## Belgilar sinflari

| Yozuv   | Ma’nosi                                   |
| ------- | ----------------------------------------- |
| `\d`    | Raqam `0–9`                               |
| `\w`    | Harf (lotin), raqam yoki `_`              |
| `\s`    | Bo‘sh joy (probel, tab, yangi qator)      |
| `.`     | Yangi qatordan boshqa istalgan belgi      |
| `[abc]` | `a`, `b` yoki `c`                         |
| `[a-z]` | `a` dan `z` gacha                         |
| `[^0-9]`| Raqam **bo‘lmagan** belgi                 |

## Miqdor

| Yozuv    | Necha marta          |
| -------- | -------------------- |
| `+`      | 1 yoki ko‘p          |
| `*`      | 0 yoki ko‘p          |
| `?`      | 0 yoki 1             |
| `{3}`    | Aniq 3               |
| `{2,4}`  | 2 dan 4 gacha        |

## Boshi va oxiri

`^` — matn boshi, `$` — matn oxiri. Validatsiyada **butun** matn tekshirilishi uchun ikkalasi shart:

```js
/\d{4}/.test('abc12345')     // true — ichida 4 ta raqam bor
/^\d{4}$/.test('abc12345')   // false — butun matn 4 ta raqam emas
/^\d{4}$/.test('2026')       // true
```

## Telefon raqami

```js
const TEL = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;

TEL.test('+998 90 123 45 67') // true
TEL.test('+99890 1234567')    // false
```

`\+` — `+` ning o‘zi (`+` maxsus belgi, shuning uchun escape qilinadi). Maxsus belgilar: `. * + ? ^ $ ( ) [ ] { } | \ /`.

## Matnni tozalash

```js
'  Salom    dunyo  '.replace(/\s+/g, ' ').trim() // 'Salom dunyo'
'+998 (90) 123-45-67'.replace(/\D/g, '')        // '998901234567' — \D: raqam emas
```

## Guruhlar

Qavslar mos kelgan qismni alohida oladi:

```js
const m = '2026-03-08'.match(/^(\d{4})-(\d{2})-(\d{2})$/);
m[1] // '2026'
m[2] // '03'
```

## `RegExp` konstruktori

Naqsh dastur ishlayotganda tuzilsa:

```js
const soz = 'olma';
const r = new RegExp(soz, 'gi');
```

> Foydalanuvchi matnini to‘g‘ridan-to‘g‘ri `new RegExp` ga bermang — undagi `.` yoki `*` naqshni buzadi.

## Me’yorida

Muntazam ifodalar kuchli, lekin murakkablari o‘qib bo‘lmaydigan bo‘ladi. Oddiy vazifalar uchun (`startsWith`, `includes`, `split`) satr metodlari tushunarliroq.
