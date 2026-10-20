## Figma’da ranglar qanday saqlanadi

Tartibli maketda ranglar har bir qatlamga qo‘lda yozilmaydi. Ular **Color Styles** yoki yangiroq **Variables** sifatida nomlanadi:

```
Primary/600    #0071DC
Primary/50     #EEF6FF
Neutral/900    #0F172A
Neutral/500    #64748B
```

Qatlamni tanlasangiz, Inspect’da rang qiymati yonida uning nomi ham ko‘rinadi — “Primary/600”. Bu nom dasturchi uchun eng qimmatli ma’lumot.

## CSS’ga ko‘chirish

Nomlar CSS o‘zgaruvchilariga aylanadi. `/` va bo‘sh joylar `-` bilan almashtiriladi, harflar kichik:

```css
:root {
  --primary-600: #0071dc;
  --primary-50: #eef6ff;
  --neutral-900: #0f172a;
  --neutral-500: #64748b;
}

.belgi {
  background-color: var(--primary-50);
  color: var(--primary-600);
}
```

Endi dizayner “Primary/600” ni o‘zgartirsa, siz ham faqat bitta qatorni o‘zgartirasiz. Kod va maket bir xil tilda.

## Semantik nomlar

Katta tizimlarda Figma’da ikki qavat bo‘ladi:

- **Primitive**: `Blue/600`, `Gray/900` — faqat qiymat;
- **Semantic**: `Text/Primary`, `Surface/Card`, `Border/Default` — vazifa.

Semantik o‘zgaruvchilar Figma’da **rejimlarga** (Light/Dark) ega bo‘lishi mumkin. CSS’da bu `[data-theme="dark"]` ichida qayta aniqlangan o‘zgaruvchilarga to‘g‘ri keladi — “UI asoslari” kursidagi kabi.

## Avtomatik eksport

Figma Variables’ni JSON sifatida eksport qiluvchi plaginlar va Style Dictionary kabi vositalar tokenlarni avtomatik CSS’ga aylantiradi. Kichik loyihada qo‘lda ko‘chirish ham yetarli; muhimi — nomlar mos bo‘lsin.

## Shaffof ranglar

Figma’da rang yonida foiz bo‘ladi: `#0F172A 8%`. CSS’da: `rgb(15 23 42 / 0.08)`. HEX’ni RGB’ga o‘girish uchun: `0F` = 15, `17` = 23, `2A` = 42.

Mashqda maketdagi rang o‘zgaruvchilarini CSS o‘zgaruvchilariga ko‘chirib, komponentda ishlatasiz.
