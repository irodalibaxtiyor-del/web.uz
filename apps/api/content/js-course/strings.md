## Satrlar (string)

**Satr** — matnni saqlaydigan qiymat. U bittalik `'...'`, qo‘sh `"..."` yoki teskari `` `...` `` qo‘shtirnoqda yoziladi:

```js
const shahar = 'Samarqand';
const xabar = "Xush kelibsiz";
const shablon = `Salom, ${shahar}!`; // shablon satrlar — alohida darsda
```

Bittalik va qo‘sh qo‘shtirnoqning farqi yo‘q. Loyihada bittasini tanlang va izchil ishlating (bu kursda — bittalik).

## Qo‘shtirnoq ichida qo‘shtirnoq

Tashqaridagisidan **boshqa** turdagi qo‘shtirnoq ishlating:

```js
const a = 'Ustoz: "Bilim — kuch" dedi.';
const b = "It's fine";
```

Yoki **escape** belgisi `\` bilan:

```js
const c = 'Ustoz: \"Bilim — kuch\" dedi.';
const d = 'Bu so\'z';
```

## Maxsus belgilar

| Yozuv | Ma’nosi             |
| ----- | ------------------- |
| `\'`  | Bittalik qo‘shtirnoq |
| `\"`  | Qo‘sh qo‘shtirnoq    |
| `\\`  | Teskari chiziq      |
| `\n`  | Yangi qator         |
| `\t`  | Tabulyatsiya        |

## Uzunlik

```js
'Samarqand'.length // 9
''.length          // 0 — bo‘sh satr
```

`length` — **xususiyat**, qavssiz yoziladi.

## Belgiga murojaat

Belgilar **0 dan** boshlab raqamlanadi:

```js
const shahar = 'Samarqand';
shahar[0]                  // 'S'
shahar[1]                  // 'a'
shahar[shahar.length - 1]  // 'd' — oxirgi belgi
shahar.at(-1)              // 'd' — oxiridan sanash (yangi usul)
shahar.charAt(0)           // 'S'
shahar[50]                 // undefined
```

## Satrlar o‘zgarmas

Satrning bitta belgisini almashtirib bo‘lmaydi:

```js
let soz = 'non';
soz[0] = 'm';  // hech narsa bo‘lmaydi
soz            // 'non'
```

Satr metodlari asl satrni o‘zgartirmaydi — doim **yangi** satr qaytaradi:

```js
let soz = 'non';
soz = 'm' + soz.slice(1); // 'mon'
```

## Satrlarni solishtirish

```js
'olma' === 'olma'   // true
'Olma' === 'olma'   // false — katta-kichik harf farq qiladi
'b' > 'a'           // true — alifbo (Unicode) tartibida
'10' < '9'          // true! — matn sifatida birinchi belgilar solishtiriladi
```

Sonlarni solishtirishdan oldin `Number(...)` ga aylantiring.

## Satr va son

```js
String(2026)      // '2026'
(2026).toString() // '2026'
Number('2026')    // 2026
```
