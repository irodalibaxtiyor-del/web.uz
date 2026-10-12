## Havolalarni bezash

Havola (`<a>`) boshqa elementlar kabi bezaladi: rang, shrift, fon, chegara. Farqi — havolaning bir nechta **holati** bor va har biriga alohida uslub berish mumkin.

| Psevdoklass      | Qachon ishlaydi                                 |
| ---------------- | ----------------------------------------------- |
| `:link`          | Hali ochilmagan havola                          |
| `:visited`       | Foydalanuvchi oldin ochgan havola               |
| `:hover`         | Sichqoncha ustida turganda                      |
| `:focus-visible` | Klaviatura bilan fokuslanganda                  |
| `:active`        | Bosilayotgan paytda                             |

```css
a {
  color: #0071dc;
}

a:visited {
  color: #6b3fa0;
}

a:hover {
  color: #0e1133;
}

a:active {
  color: crimson;
}
```

## Tartib muhim: LVHA

Holatlar bir vaqtda bir nechtasi to‘g‘ri kelishi mumkin (masalan, ochilgan havola ustida sichqoncha). Ularning maxsusligi bir xil, shuning uchun **keyin yozilgani** yutadi. Shu sababli tartib: `:link` → `:visited` → `:hover` → `:active` (inglizcha “LoVe HAte” deb eslab qolinadi).

Agar `:hover` ni `:visited` dan oldin yozsangiz, ochilgan havolalarda hover ishlamay qoladi.

## `:visited` cheklovlari

Maxfiylik uchun brauzer `:visited` da faqat ranglarni o‘zgartirishga ruxsat beradi. O‘lcham, fon rasmi yoki boshqa xususiyatlar ishlamaydi — aks holda sayt foydalanuvchi qaysi saytlarga kirganini bilib olishi mumkin edi.

## Fokusni unutmang

Sichqoncha ishlatmaydigan foydalanuvchi sahifada Tab tugmasi bilan yuradi. Hover uslubi ularga ko‘rinmaydi, shuning uchun fokus uslubi ham bo‘lsin:

```css
a:hover,
a:focus-visible {
  color: #0e1133;
}

a:focus-visible {
  outline: 3px solid #0071dc;
  outline-offset: 2px;
}
```

## Havola-tugma

Ko‘p saytlarda havola tugma ko‘rinishida bo‘ladi:

```css
.tugma {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0071dc;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}

.tugma:hover {
  background-color: #005bb0;
}
```

> **Qoida:** boshqa sahifaga olib boradigan narsa — `<a>`, sahifada biror amal bajaradigan narsa — `<button>`. Ko‘rinishi qanday bo‘lishidan qat’i nazar.

## `cursor`

`cursor: pointer` sichqoncha ko‘rsatkichini qo‘l shakliga keltiradi. Havolalarda bu standart; uni oddiy matnga bermang — foydalanuvchini chalg‘itadi.

## Xulosa

- Havola holatlari: `:link`, `:visited`, `:hover`, `:focus-visible`, `:active`.
- Tartib: LVHA.
- Hover bilan birga fokus uslubini ham yozing.
- Havola-tugma: `display: inline-block`, padding, fon, `text-decoration: none`.
