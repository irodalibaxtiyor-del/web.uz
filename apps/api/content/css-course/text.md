## Matnni bezash

Sahifadagi ma’lumotning katta qismi — matn. Uni o‘qish qulay bo‘lishi uchun CSS’da bir nechta asosiy xususiyat bor.

| Xususiyat        | Vazifasi                     | Misol                  |
| ---------------- | ---------------------------- | ---------------------- |
| `color`          | Matn rangi                   | `color: #0e1133;`      |
| `text-align`     | Gorizontal tekislash         | `text-align: center;`  |
| `line-height`    | Qatorlar orasidagi balandlik | `line-height: 1.6;`    |
| `letter-spacing` | Harflar orasidagi masofa     | `letter-spacing: 1px;` |
| `word-spacing`   | So‘zlar orasidagi masofa     | `word-spacing: 4px;`   |
| `text-indent`    | Birinchi qator chekinishi    | `text-indent: 2em;`    |

## Matn rangi

```css
body {
  color: #0e1133;
  background-color: white;
}
```

> **Kontrast:** matn va fon rangi orasidagi farq yetarli bo‘lishi kerak. Och kulrang fonda och kulrang matnni ko‘pchilik o‘qiy olmaydi. Oddiy matn uchun kontrast nisbati kamida **4.5:1** bo‘lishi tavsiya etiladi.

## Tekislash: `text-align`

| Qiymat    | Natija                                       |
| --------- | -------------------------------------------- |
| `left`    | Chapga (o‘zbek tilida standart)              |
| `right`   | O‘ngga                                       |
| `center`  | Markazga                                     |
| `justify` | Ikki chetga teng (qatorlar to‘liq kenglikda) |
| `start`   | Yozuv yo‘nalishining boshiga                 |

```css
h1 {
  text-align: center;
}
```

`justify` gazetadagidek ko‘rinadi, lekin tor ustunlarda so‘zlar orasida katta “teshiklar” paydo bo‘ladi. Uzun matnlarda ehtiyot bo‘ling.

`text-align` blok ichidagi **matnni** (va inline elementlarni) tekislaydi, blokning o‘zini emas. Blokni markazlash uchun `margin: 0 auto` kerak.

## Qator balandligi: `line-height`

Qatorlar bir-biriga yopishib qolsa, matnni o‘qish qiyin. Ko‘pincha **birliksiz** qiymat ishlatiladi:

```css
p {
  line-height: 1.6;
}
```

`1.6` — shrift o‘lchamining 1.6 baravari. Birliksiz qiymat bola elementlarga ham to‘g‘ri meros bo‘ladi: har biri o‘z shrift o‘lchamidan hisoblaydi.

## Harf va so‘z oralig‘i

```css
.yorliq {
  letter-spacing: 2px;
}
```

Kichik bosh harfli yorliqlarda biroz `letter-spacing` chiroyli ko‘rinadi. Oddiy matnda uni o‘zgartirmagan ma’qul.

## Birinchi qator chekinishi

```css
.maqola p {
  text-indent: 2em;
}
```

## Yo‘nalish

`direction: rtl` arab yoki ivrit kabi o‘ngdan chapga yoziladigan tillar uchun. Odatda buni HTML’dagi `dir="rtl"` atributi bilan berish to‘g‘riroq.

## Xulosa

- `color` va fon orasida yetarli kontrast bo‘lsin.
- `text-align` matnni tekislaydi, `line-height` o‘qishni osonlashtiradi.
- `line-height` uchun birliksiz qiymat (`1.5`–`1.7`) eng qulay.
