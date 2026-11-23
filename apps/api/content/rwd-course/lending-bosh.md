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

```tekshir
Lendingning bosh ekrani (hero) birinchi navbatda nimani bajarishi kerak?
+ bir qarashda nima taklif qilinayotganini aytib, asosiy harakatga undashi
- iloji boricha ko‘p ma’lumot berishi
- faqat katta rasm ko‘rsatishi
> Bitta aniq sarlavha va bitta asosiy tugma.
```

```jonli
<style>
  .h { display: grid; gap: 16px; align-items: center; padding: 24px; background: #eef4fb; }
  .h h1 { font-size: clamp(1.6rem, 1rem + 3vw, 2.8rem); margin: 0; }
  @media (min-width: 640px) { .h { grid-template-columns: 1.2fr 1fr; } }
</style>
<section class="h"><div><h1>Veb-dizaynni o‘rganing</h1><p>Amaliy darslar o‘zbek tilida.</p><a href="#">Boshlash</a></div><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27260%27%3E%3Crect%20width=%27400%27%20height=%27260%27%20fill=%27%230071dc%27/%3E%3Ccircle%20cx=%27280%27%20cy=%2791%27%20r=%2739%27%20fill=%27%23fff%27/%3E%3C/svg%3E" width="400" height="260" alt="" style="max-width: 100%; height: auto"></section>
```
