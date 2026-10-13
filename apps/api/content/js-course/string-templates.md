## Shablon satrlar

**Shablon satr** (template literal) teskari qo‘shtirnoq `` ` `` bilan yoziladi va ichiga qiymat qo‘yish imkonini beradi:

```js
const ism = 'Madina';
const ball = 95;

// Eski usul
const a = 'Salom, ' + ism + '! Ballingiz: ' + ball + '.';

// Shablon satr
const b = `Salom, ${ism}! Ballingiz: ${ball}.`;
```

`${ ... }` ichidagi qiymat satrga qo‘yiladi. Uzun matnlarda `+` va qo‘shtirnoqlar chalkashmaydi.

## Ichida ifoda

`${}` ichida istalgan **ifoda** yozish mumkin:

```js
const narx = 4000;
const soni = 3;
`Jami: ${narx * soni} so‘m`          // 'Jami: 12000 so‘m'
`Ism: ${ism.toUpperCase()}`          // 'Ism: MADINA'
`Holat: ${ball >= 60 ? 'o‘tdi' : 'o‘tmadi'}` // shartli ifoda
```

## Ko‘p qatorli matn

```js
const xat = `Hurmatli talaba!
Darslar dushanba kuni boshlanadi.
Omad!`;
```

Oddiy qo‘shtirnoqda buning uchun `\n` yozish kerak edi.

## Qo‘shtirnoqlar muammosiz

```js
const gap = `U "Bilim — kuch" dedi va o‘tirdi.`;
```

Ichida `'` va `"` bemalol ishlatiladi. Teskari qo‘shtirnoqning o‘zi kerak bo‘lsa: `` \` ``.

## HTML shablonlari

Shablon satr HTML yasashda juda qulay:

```js
const kurs = { nom: 'JavaScript', narx: 450000 };

document.getElementById('karta').innerHTML = `
  <h3>${kurs.nom}</h3>
  <p>${kurs.narx} so‘m</p>
`;
```

> **Xavfsizlik:** bu usul faqat **o‘zingizning** ma’lumotlaringiz uchun. Foydalanuvchi kiritgan matnni `innerHTML` shabloniga qo‘ysangiz, u yerga HTML/skript yozilishi mumkin (XSS). Foydalanuvchi matni uchun `textContent` ishlating.

## Raqamlarni formatlash

```js
const soni = 7;
`Buyurtma №${String(soni).padStart(4, '0')}` // 'Buyurtma №0007'
```

## Qachon nima?

| Holat                                   | Tavsiya              |
| --------------------------------------- | -------------------- |
| Oddiy, o‘zgarmas matn                   | `'...'`              |
| Matn ichida qiymat yoki ifoda bor       | `` `...${x}...` ``   |
| Ko‘p qatorli matn yoki HTML bo‘lagi     | `` `...` ``          |
