## Satr metodlari

Satr metodlari asl satrni **o‘zgartirmaydi** — yangi satr qaytaradi. Natijani o‘zgaruvchiga saqlashni unutmang.

## Katta va kichik harf

```js
'Toshkent'.toUpperCase() // 'TOSHKENT'
'Toshkent'.toLowerCase() // 'toshkent'
```

## Bo‘sh joylarni olib tashlash

```js
'   Ali   '.trim()      // 'Ali'
'   Ali   '.trimStart() // 'Ali   '
'   Ali   '.trimEnd()   // '   Ali'
```

Foydalanuvchi kiritgan matnni deyarli doim `trim()` qiling — ko‘pchilik tasodifan bo‘sh joy qoldiradi.

## Bo‘lak olish: `slice`

```js
const s = 'JavaScript';
s.slice(0, 4)  // 'Java'   — 0 dan 4 gacha (4 kirmaydi)
s.slice(4)     // 'Script' — 4 dan oxirigacha
s.slice(-6)    // 'Script' — oxiridan 6 ta
s.slice(-4)    // 'ript'
```

`substring(start, end)` ham bor, lekin manfiy sonlarni qabul qilmaydi — `slice` ko‘proq ishlatiladi.

### Birinchi harfni katta qilish

```js
const ism = 'aLI';
const toza = ism.trim().toLowerCase();             // 'ali'
const chiroyli = toza[0].toUpperCase() + toza.slice(1); // 'Ali'
```

## Almashtirish

```js
'Salom dunyo'.replace('dunyo', 'O‘zbekiston') // 'Salom O‘zbekiston'
'a-b-c'.replace('-', '+')     // 'a+b-c'  — faqat birinchisi
'a-b-c'.replaceAll('-', '+')  // 'a+b+c'  — hammasi
```

## Bo‘lish: `split`

Satrni **massivga** bo‘ladi:

```js
'olma,non,suv'.split(',') // ['olma', 'non', 'suv']
'Ali Valiyev'.split(' ')  // ['Ali', 'Valiyev']
```

Massivlarni keyingi modulda o‘rganamiz.

## To‘ldirish va takrorlash

```js
'5'.padStart(3, '0')   // '005'
'7'.padEnd(3, '*')     // '7**'
'ab'.repeat(3)         // 'ababab'
'5678'.padStart(16, '*') // '************5678'
```

### Karta raqamini yashirish

```js
const karta = '8600123412345678';
const yashirin = '**** **** **** ' + karta.slice(-4); // '**** **** **** 5678'
```

## Ulash: `concat`

```js
'Web'.concat('dizayn', '.uz') // 'Webdizayn.uz'
```

Amalda `+` yoki shablon satr qulayroq.

## Zanjir qilib chaqirish

Har metod satr qaytargani uchun ularni ketma-ket yozish mumkin:

```js
const login = '  Ali.VALIYEV  '.trim().toLowerCase(); // 'ali.valiyev'
```

## Metodlar jadvali

| Metod                 | Nima qiladi                       |
| --------------------- | --------------------------------- |
| `toUpperCase()`       | Hammasi katta harf                |
| `toLowerCase()`       | Hammasi kichik harf               |
| `trim()`              | Chetlardagi bo‘sh joylarni o‘chiradi |
| `slice(a, b)`         | Bo‘lak oladi                      |
| `replace(x, y)`       | Birinchi `x` ni `y` ga almashtiradi |
| `replaceAll(x, y)`    | Hammasini almashtiradi            |
| `split(ajratgich)`    | Massivga bo‘ladi                  |
| `padStart(n, belgi)`  | Boshidan to‘ldiradi               |
| `repeat(n)`           | `n` marta takrorlaydi             |
