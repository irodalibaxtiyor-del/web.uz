## Klassik maket

“Muqaddas grail” (*holy grail*) — veb-dizayndagi eng mashhur maket: tepada sarlavha, o‘rtada uch ustun (chap menyu, asosiy kontent, o‘ng panel), pastda footer. Talablar:

1. Asosiy kontent o‘rtada va eng keng.
2. Yon ustunlar belgilangan kenglikda.
3. Kontent kam bo‘lsa ham footer ekran pastida turadi.
4. HTML’da asosiy kontent imkon qadar oldin keladi.

Float davrida bu maketni yasash haqiqiy jumboq edi — nomi shundan. Grid bilan bir necha qator.

## Kompyuter uchun

```css
.sahifa {
  display: grid;
  gap: 8px;
  min-height: 100dvh;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}

.bosh,
.oxir {
  grid-column: 1 / -1; /* birinchi chiziqdan oxirgisigacha */
}
```

- `min-height: 100dvh` — sahifa kamida bitta ekran balandligida;
- `grid-template-rows: auto 1fr auto` — sarlavha va footer o‘z balandligida, o‘rtadagi qator qolgan joyni egallaydi. Shu sabab footer pastga “yopishadi”;
- `-1` — oxirgi to‘r chizig‘i, ustunlar soni o‘zgarsa ham to‘g‘ri ishlaydi.

## Telefon uchun

Telefonda hamma narsa bitta ustunda. Foydalanuvchi sahifani ochganda menyuni emas, avval maqolani ko‘rishi yaxshiroq. `order` bilan vizual tartibni o‘zgartirish mumkin:

```css
.bosh   { order: -2; }
.markaz { order: -1; }
```

`order` ning standart qiymati 0; kichik raqam oldinroq turadi.

**Muhim:** `order` faqat ko‘rinishni o‘zgartiradi. Tab tugmasi va ekran o‘quvchi HTML tartibida yuradi. Agar maqola haqiqatan birinchi bo‘lishi kerak bo‘lsa, eng yaxshisi — HTML’da uni oldinroq yozish.

## Flexbox bilan ham bo‘ladimi?

Ha, lekin footer’ni pastga bosish va uch ustunni bir vaqtda boshqarish uchun ichma-ich flex konteynerlar kerak bo‘ladi. Ikki o‘lchamli maket — Grid’ning ishi; bir o‘lchamli qatorlar (menyu, tugmalar) — Flexbox’ning ishi.

## Sticky footer’ning boshqa usuli

Faqat “footer pastda tursin” kerak bo‘lsa:

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

main { flex: 1; }
```

Mashqda to‘liq “muqaddas grail” maketini telefon va kompyuter uchun yasaysiz.
