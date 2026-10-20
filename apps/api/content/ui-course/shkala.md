## O‘lchamlar tasodifiy bo‘lmasin

Ko‘p sahifalarda shrift o‘lchamlari “ko‘zga qarab” tanlanadi: 37px, 29px, 21px, 13px… Natijada sarlavhalar orasidagi farq notekis, sahifa beqaror ko‘rinadi. Yechim — **tipografik shkala**.

## Modulli shkala

Asos (masalan, 16px) bitta koeffitsientga ketma-ket ko‘paytiriladi:

| Koeffitsient | Nomi         | Qadamlar (16px dan) |
| ------------ | ------------ | ------------------- |
| 1.2          | kichik terts | 16, 19, 23, 28, 33  |
| 1.25         | katta terts  | 16, 20, 25, 31, 39  |
| 1.333        | kvarta       | 16, 21, 28, 38, 51  |
| 1.5          | kvinta       | 16, 24, 36, 54, 81  |

Kichik koeffitsient — matnga boy ilovalar uchun; kattasi — lending va sarlavhali sahifalar uchun.

## Amaliy shkala

Amalda qiymatlar qulay sonlarga yaxlitlanadi va tokenlarga aylantiriladi:

```css
:root {
  --t-sm: 0.875rem; /* 14px — izoh, yorliq */
  --t-base: 1rem; /* 16px — matn */
  --t-lg: 1.125rem; /* 18px — kirish matni */
  --t-xl: 1.5rem; /* 24px — h3 */
  --t-2xl: 2rem; /* 32px — h2 */
  --t-3xl: 2.5rem; /* 40px — h1 */
}

h1 {
  font-size: var(--t-3xl);
}
h2 {
  font-size: var(--t-2xl);
}
```

Endi butun loyihada faqat shu oltita o‘lcham bor. Yangi element qo‘shilganda “qaysi o‘lcham?” degan savolga javob tayyor.

## Moslashuvchan shkala

Telefonda katta sarlavhalar joy egallaydi. Shkala tokenlarini `clamp()` bilan suyuq qilish mumkin:

```css
:root {
  --t-3xl: clamp(2rem, 1.5rem + 2vw, 2.5rem);
}
```

Yoki telefonda kichikroq koeffitsient (1.2), kompyuterda kattaroq (1.25) olinadi.

## O‘lcham — yagona vosita emas

Ierarxiya uchun hamma narsani kattalashtirish shart emas. Qalinlik, rang, oraliq va joylashuv ham “bu muhim” deb aytadi. Shkaladagi 5–6 qadam ko‘pincha yetarli; 12 xil o‘lcham — tizim yo‘qligining belgisi.

Mashqda tasodifiy o‘lchamlarni shkala tokenlari bilan almashtirasiz.
