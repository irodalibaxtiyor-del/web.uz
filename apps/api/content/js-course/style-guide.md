## Kod uslubi

Kod bir marta yoziladi, lekin o‘nlab marta **o‘qiladi** — sizning o‘zingiz ham, jamoadoshlaringiz ham. Yagona uslub o‘qishni tezlashtiradi va ko‘p xatolarning oldini oladi.

## Nomlar

| Nima                          | Uslub              | Misol                    |
| ----------------------------- | ------------------ | ------------------------ |
| O‘zgaruvchi, funksiya          | camelCase          | `kursNarxi`, `hisobla()` |
| O‘zgarmas sozlama              | KATTA_HARF         | `MAKS_URINISH`           |
| Klass                          | PascalCase         | `Talaba`, `BankHisobi`   |
| Boolean                        | savol shaklida     | `kirganmi`, `bormi`, `isOpen` |

Nom **ma’noli** bo‘lsin: `d` emas `kunlar`, `f()` emas `chegirmaHisobla()`.

## E’lonlar

- Default — `const`, o‘zgarsa — `let`, `var` — hech qachon.
- Har bir o‘zgaruvchi alohida qatorda.

## Taqqoslash

Doim `===` va `!==`. `==` turlarni aylantiradi va kutilmagan natijalar beradi:

```js
'' == 0     // true
'0' == 0    // true
'' === 0    // false
```

## Bo‘sh joylar va formatlash

```js
// Yomon
function chegirma(summa,kod){if(kod=='WEB10'){return summa*0.9}return summa}

// Yaxshi
function chegirma(summa, kod) {
  if (kod === 'WEB10') {
    return summa * 0.9;
  }
  return summa;
}
```

- 2 bo‘sh joy bilan chekinish;
- operatorlar va vergullardan keyin bo‘sh joy;
- ochuvchi `{` o‘sha qatorda;
- har buyruq oxirida `;`;
- qator 80–100 belgidan oshmasin.

Qo‘lda emas, **Prettier** kabi formatlovchi bilan avtomatik qilish mumkin — mashq sahifasidagi muharrir ham kodni formatlay oladi.

## Satrlar

Bitta turdagi qo‘shtirnoq (bu kursda — bittalik), qiymat qo‘yilsa — shablon satr:

```js
const xabar = `Salom, ${ism}!`;
```

## Funksiyalar

- Bitta funksiya — bitta vazifa. 30–40 qatordan uzun bo‘lsa, bo‘ling.
- Ichma-ich `if` lar o‘rniga **erta qaytish**:

```js
function chegirma(summa, kod) {
  if (kod !== 'WEB10') return summa;
  return summa * 0.9;
}
```

## Sehrli sonlar

```js
// Yomon: 0.9 nima?
return summa * 0.9;

// Yaxshi
const CHEGIRMA = 0.1;
return summa * (1 - CHEGIRMA);
```

## Linter

**ESLint** kodni avtomatik tekshiradi: ishlatilmagan o‘zgaruvchilar, `==`, e’lonsiz nomlar. Jamoalarda uslub hujjatda yozilib, linter va formatlovchi bilan majburiy qilinadi — bahslar uchun vaqt ketmaydi.
