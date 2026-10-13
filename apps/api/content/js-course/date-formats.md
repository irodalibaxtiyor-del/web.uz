## Sana formatlari

## Matndan sana: ISO format

Standart matn formati — **ISO 8601**: `YIL-OY-KUN`.

```js
new Date('2026-03-08')            // faqat sana — UTC yarim tuni deb o‘qiladi!
new Date('2026-03-08T10:30')      // sana va vaqt — mahalliy vaqt deb o‘qiladi
new Date('2026-03-08T10:30:00Z')  // Z — aniq UTC
```

Tuzoq: **faqat sana** yozilgan ISO matn UTC deb o‘qiladi. Toshkentda (UTC+5) bu muammo bermaydi, lekin Amerikada (UTC−5) `new Date('2026-03-08')` mahalliy vaqt bo‘yicha **7-mart** kechqurun bo‘lib chiqadi.

## `<input type="date">`

Sana maydonining `value` si doim `'YYYY-MM-DD'` matni:

```html
<input id="sana" type="date">
```

```js
document.getElementById('sana').value // '2026-03-08'
```

Ishonchli usul — matnni **qismlarga ajratib**, mahalliy `Date` yaratish:

```js
function sanaOqi(qiymat) {
  const q = qiymat.split('-');               // ['2026', '03', '08']
  return new Date(Number(q[0]), Number(q[1]) - 1, Number(q[2]));
}
```

`- 1` — oylar 0 dan sanalgani uchun.

## Formatlash: o‘zingiz yig‘asiz

O‘zbekistonda odatiy format `KK.OO.YYYY`:

```js
const q = '2026-03-08'.split('-');
const uzbek = q[2] + '.' + q[1] + '.' + q[0]; // '08.03.2026'
```

`Date` obyektidan (getter metodlar — keyingi darsda):

```js
function formatla(d) {
  const kun = String(d.getDate()).padStart(2, '0');
  const oy = String(d.getMonth() + 1).padStart(2, '0');
  return `${kun}.${oy}.${d.getFullYear()}`;
}
```

`padStart(2, '0')` — `8` ni `08` qiladi.

## Oy nomlari

Brauzerning o‘zbek tili qo‘llovi to‘liq emas — `toLocaleDateString('uz')` ba’zan “2026 M03 8” kabi g‘alati natija beradi. Oy nomlarini massivda saqlash ishonchli:

```js
const OYLAR = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

OYLAR[Number('03') - 1] // 'mart'
```

## `toLocaleDateString`

Boshqa tillar uchun qulay:

```js
const d = new Date(2026, 2, 8);
d.toLocaleDateString('en-GB') // '08/03/2026'
d.toLocaleDateString('ru-RU') // '08.03.2026'
d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
// 'Sunday, March 8'
```

Natija brauzer va tizimga bog‘liq bo‘lishi mumkin, shuning uchun muhim joylarda o‘zingiz formatlang.

## Xulosa

| Vazifa                              | Usul                                   |
| ----------------------------------- | -------------------------------------- |
| Input’dan sana olish                | `split('-')` → `new Date(y, m - 1, d)` |
| Serverga yuborish / saqlash         | ISO matn (`'2026-03-08'`)              |
| Foydalanuvchiga ko‘rsatish          | O‘zingiz: `KK.OO.YYYY`, oy nomi massivdan |
