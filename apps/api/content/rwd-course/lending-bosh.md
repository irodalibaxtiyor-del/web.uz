## Lending nima?

**Lending** (*landing page*) — bitta maqsadga qaratilgan sahifa: kursga yozilish, mahsulot sotib olish, tadbirga ro‘yxatdan o‘tish. Uni ko‘pincha reklamadan, ya’ni **telefondan** ochishadi. Shuning uchun lending — moslashuvchan dizaynni sinash uchun ideal loyiha.

Oxirgi uch darsda kichik lending yig‘asiz: bosh ekran, tariflar va yakuniy sinov.

## Bosh ekran (hero) vazifasi

Foydalanuvchi birinchi 3–5 soniyada uchta savolga javob olishi kerak:

1. Bu nima? — aniq sarlavha.
2. Menga nima foyda? — bir-ikki qator izoh.
3. Nima qilishim kerak? — ko‘zga tashlanadigan asosiy tugma.

Rasm qo‘shimcha, lekin sarlavha va tugmadan muhim emas.

## Maket

```css
.hero {
  display: grid;
  gap: 32px;
  align-content: center;
  min-height: min(100dvh, 720px);
  padding: 48px 16px;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
}
```

- Telefonda matn tepada, rasm pastda — sarlavha va tugma birinchi ekranda ko‘rinadi.
- `min(100dvh, 720px)` — bo‘lim ekranni to‘ldiradi, lekin 1440px balandlikdagi monitorda bo‘sh “cho‘l” bo‘lib qolmaydi.
- `align-content: center` — kontent vertikal markazda.

## Tugmalar

```css
.tugmalar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tugma {
  min-height: 44px;
  padding-inline: 20px;
  white-space: nowrap;
}
```

Ikki tugma 320px ekranga sig‘masa, ikkinchisi keyingi qatorga tushadi. `white-space: nowrap` tugma matnini sindirmaydi.

Asosiy va ikkinchi darajali harakatni ajrating: biri to‘ldirilgan, ikkinchisi faqat chegarali. Ikkita bir xil tugma foydalanuvchini o‘ylantirib qo‘yadi.

## Sarlavha

```css
h1 {
  font-size: clamp(2rem, 1.25rem + 3vw, 3.5rem);
  line-height: 1.1;
}
```

Telefonda 32px dan kam emas, katta ekranda 56px gacha.

## Rasm

- Bosh ekrandagi rasmga `loading="lazy"` yozmang — u darhol kerak. Aksincha, `fetchpriority="high"` qo‘shish mumkin.
- `width`/`height` atributlari bilan joy oldindan ajratilsin.
- Telefonda rasmni matndan keyin qo‘yish (HTML tartibi) — asosiy xabar birinchi.

Mashqda bosh ekranni telefon va kompyuter uchun moslashtirasiz.
