## Moslashuvchan dizayn nima?

Bugun bitta sahifani odamlar 320 piksellik telefonda ham, 27 dyuymli monitorda ham ochadi. **Moslashuvchan dizayn** (inglizcha *responsive web design*) — sahifani shunday qurishki, u har qanday ekran kengligida o‘qilishi va ishlatilishi qulay bo‘lsin. Buning uchun telefonga alohida sayt yozilmaydi: bitta HTML, bitta CSS, lekin CSS ekranga qarab moslashadi.

## Uch xil yondashuv

| Yondashuv | Qanday ishlaydi | Muammosi |
| --- | --- | --- |
| Qotgan (fixed) | Kenglik `960px` kabi aniq | Telefonda yon tomonga aylantirish kerak bo‘ladi |
| Suyuq (fluid) | Kenglik foizlarda | Juda keng ekranda qatorlar haddan tashqari uzun |
| Moslashuvchan | Suyuq asos + chegaralar + media so‘rovlar | Rejalashtirishni talab qiladi |

Moslashuvchan dizayn ikkalasining yaxshi tomonini oladi: element ekranga qarab cho‘ziladi va qisqaradi, lekin belgilangan chegaradan oshmaydi.

## Uchta asosiy g‘isht

1. **Suyuq maket** — kengliklar `%`, `fr`, `min()` bilan; `width` o‘rniga ko‘pincha `max-width`.
2. **Moslashuvchan media** — rasm va video o‘z konteyneridan chiqmaydi.
3. **Media so‘rovlar** — ma’lum kenglikdan boshlab maketni o‘zgartirish.

## Eng ko‘p uchraydigan xato

```css
.sahifa {
  width: 960px; /* telefonda ekrandan chiqib ketadi */
}
```

To‘g‘risi:

```css
.sahifa {
  max-width: 960px;     /* 960px dan kengaymaydi */
  margin-inline: auto;  /* markazda */
  padding-inline: 16px; /* telefonda chetga yopishmaydi */
}

img {
  display: block;
  max-width: 100%; /* konteynerdan kengaymaydi */
  height: auto;    /* nisbat saqlanadi */
}
```

`max-width` “eng ko‘pi bilan shuncha” degani. Ekran keng bo‘lsa, blok 960px bo‘ladi; tor bo‘lsa, ekranga qadar qisqaradi.

`margin-inline` — chap va o‘ng chetlarni bir yozuvda beradigan **mantiqiy xususiyat**. U yozuv yo‘nalishiga bog‘liq: o‘ngdan chapga yoziladigan tillarda ham to‘g‘ri ishlaydi. `padding-inline`, `margin-block`, `padding-block` ham shu oiladan.

## Nega bu muhim?

- O‘zbekistonda internetga kirishning katta qismi telefondan.
- Qidiruv tizimlari mobil qurilmaga mos sahifani yuqoriroq ko‘rsatadi.
- Bitta kodni qo‘llab-quvvatlash ikki saytdan arzon.

Mashqda qotgan sahifani suyuq qilasiz: telefonda ham, kompyuterda ham to‘g‘ri ko‘rinishini tekshiring. Playground’da brauzer oynasini toraytirib ko‘ring — yon tomonga aylantirish paydo bo‘lmasligi kerak.
