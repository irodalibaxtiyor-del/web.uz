## Xato qidirish (debugging)

Ikki xil xato bor:

1. **Sintaksis va ish vaqti xatolari** — konsolda qizil xabar chiqadi. Ularni topish oson.
2. **Mantiq xatolari** — kod “ishlaydi”, lekin noto‘g‘ri natija beradi. Konsol jim. Bular eng qiyini.

Bu dars ikkinchi tur haqida.

## 1-qadam: muammoni aniq takrorlang

“Ishlamayapti” emas — “`4 8 15` kiritilganda o‘rtacha `9` emas, `1606.0` chiqyapti”. Aniq kiritma va kutilgan natija bo‘lmasa, xatoni qidirib bo‘lmaydi.

## 2-qadam: `console.log` bilan oraliq qiymatlar

```js
function statistika(matn) {
  const sonlar = matn.split(' ');
  console.log('sonlar:', sonlar);       // ['4', '8', '15'] — satrlar!
  let yigindi = 0;
  for (const s of sonlar) {
    yigindi += s;
    console.log('yigindi:', yigindi);   // '04', '048', '04815' — ulanib ketyapti
  }
}
```

Har qadamdagi qiymatni ko‘rganingizda xato o‘zi ko‘rinadi: satrlar qo‘shilmayapti, ulanyapti.

Foydali variantlar:

```js
console.log({ yigindi, sonlar }); // nomi bilan
console.table(talabalar);         // massiv/obyektni jadval ko‘rinishida
console.error('Bu bo‘lmasligi kerak edi');
```

## 3-qadam: brauzer debugger’i

`F12` → **Sources**: qator raqamini bossangiz — **breakpoint**. Kod o‘sha joyda to‘xtaydi va barcha o‘zgaruvchilarni ko‘rasiz, qadamma-qadam yurasiz:

- **Step over** — keyingi qator;
- **Step into** — funksiya ichiga kirish;
- **Resume** — keyingi breakpoint’gacha.

Kodda `debugger;` yozsangiz ham, DevTools ochiq bo‘lganda shu yerda to‘xtaydi.

## Ko‘p uchraydigan mantiq xatolari

| Belgisi                                   | Ehtimoliy sabab                               |
| ----------------------------------------- | --------------------------------------------- |
| Sonlar o‘rniga `'0481'` kabi matn         | `+` satrlarni ulayapti — `Number()` yo‘q      |
| `NaN`                                     | `undefined` yoki matn bilan arifmetika        |
| Oxirida `undefined`                       | Sikl `<=` bilan — bitta ortiqcha aylanish     |
| Manfiy sonlarda maksimum `0`              | Maksimum `0` dan boshlangan — birinchi elementdan boshlang |
| Shart doim bajariladi                     | `=` (tayinlash) `===` o‘rniga                 |

## 4-qadam: gipoteza → tekshirish

1. “Menimcha, `sonlar` satrlardan iborat” — taxmin.
2. `console.log(typeof sonlar[0])` — tekshirish.
3. Tuzatish va **yana** kiritma bilan sinash, jumladan chegaraviy holatlar: bo‘sh, bitta son, manfiy sonlar.

## Tuzatgandan keyin

`console.log` larni olib tashlang yoki kamaytiring — ishlab chiqarish kodida ular faqat shovqin.
