## Satr ichida qidirish

## `indexOf` va `lastIndexOf`

Qidirilgan qism **qayerdan** boshlanishini qaytaradi. Topilmasa — `-1`:

```js
const email = 'ali@webdizayn.uz';
email.indexOf('@')       // 3
email.indexOf('.')       // 13
email.indexOf('#')       // -1 — yo‘q
'a.b.c'.lastIndexOf('.') // 3 — oxirgisi
```

### Email’ni bo‘lish

```js
const belgi = email.indexOf('@');
const nom = email.slice(0, belgi);     // 'ali'
const domen = email.slice(belgi + 1);  // 'webdizayn.uz'
```

`belgi + 1` — `@` ning o‘zini olmaslik uchun.

## `includes`, `startsWith`, `endsWith`

Javob — `true` yoki `false`:

```js
email.includes('@')            // true
email.startsWith('ali')        // true
email.endsWith('.uz')          // true
'+998901234567'.startsWith('+998') // true
```

Bu metodlar katta-kichik harfni farqlaydi:

```js
'Toshkent'.includes('tosh')                 // false
'Toshkent'.toLowerCase().includes('tosh')   // true
```

## `search` va `match`

Ikkalasi **muntazam ifoda** (RegExp) bilan ishlaydi — batafsil alohida darsda:

```js
'Narxi: 45000 so‘m'.search(/\d/)    // 7 — birinchi raqam qayerda
'Tel: 90 123 45 67'.match(/\d+/g)  // ['90', '123', '45', '67']
```

## Qaysi metod qachon?

| Savol                                   | Metod                      |
| --------------------------------------- | -------------------------- |
| Bormi?                                  | `includes`                 |
| Shu bilan boshlanadimi / tugaydimi?     | `startsWith` / `endsWith`  |
| Qayerda?                                | `indexOf` / `lastIndexOf`  |
| Murakkab naqsh (raqamlar, harflar)?     | `search` / `match` (RegExp) |

## Natija boolean bo‘lsa

`includes` natijasi `true`/`false`. Uni sahifaga yozish mumkin yoki shartda ishlatish mumkin (shartlar — keyingi modulda):

```js
document.getElementById('uzmi').textContent = email.endsWith('.uz'); // 'true'
```

## Birlashtirish

```js
const tel = ' +998 90 123 45 67 '.trim();
const uzbek = tel.startsWith('+998') && tel.length === 17;
```

`&&` — ikkala shart ham bajarilsa `true`.

> Email’ni haqiqatan to‘g‘riligini bunday oddiy tekshiruv bilan aniqlab bo‘lmaydi. Formalarda `type="email"` va serverdagi tekshiruv bilan birga ishlating.
