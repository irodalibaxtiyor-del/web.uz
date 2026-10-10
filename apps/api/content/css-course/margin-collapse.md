## Kutilmagan hodisa

Ikkita paragraf bor: birinchisining pastki margini 30px, ikkinchisining yuqori margini 20px.

```css
.birinchi { margin-bottom: 30px; }
.ikkinchi { margin-top: 20px; }
```

Ular orasidagi masofa **50px emas, 30px** bo‘ladi. Bu **margin collapse** — marginlarning “qo‘shilib ketishi”.

## Qoida

Ustma-ust turgan ikki blok elementning **vertikal** marginlari birlashadi va natijada **kattarog‘i** qoladi.

- Faqat **yuqori va pastki** marginlar qo‘shiladi. Chap va o‘ng marginlar hech qachon qo‘shilmaydi.
- Ikkala margin musbat bo‘lsa — kattasi olinadi.
- Biri manfiy bo‘lsa — ular qo‘shiladi (`30px + (-10px) = 20px`).

## Ota va bola elementi

Collapse faqat qo‘shnilar orasida emas, ota va uning birinchi (yoki oxirgi) bolasi orasida ham bo‘ladi:

```css
.karta {
  background-color: #f5faff;
}

.karta h2 {
  margin-top: 40px;
}
```

Kutilgani: sarlavha kartochka ichida 40px pastroqda. Aslida esa sarlavhaning margini kartochkadan **tashqariga** chiqib ketadi va butun kartochka 40px pastga suriladi.

## Collapse’ning oldini olish

Quyidagilardan biri ota va bola marginlarini ajratadi:

```css
.karta {
  padding-top: 1px;           /* yoki istalgan padding */
}

.karta {
  border-top: 1px solid transparent;
}

.karta {
  display: flow-root;         /* yangi “formatlash konteksti” */
}
```

Flexbox va Grid konteynerlari ichida marginlar umuman qo‘shilmaydi.

## Amaliy maslahat

Ko‘p dizaynerlar faqat **bir yo‘nalishdagi** marginlardan foydalanadi — masalan, faqat `margin-bottom`. Shunda collapse haqida o‘ylash kamroq kerak bo‘ladi:

```css
h2,
p,
ul {
  margin-top: 0;
  margin-bottom: 16px;
}
```

## Xulosa

- Ustma-ust bloklarning vertikal marginlari qo‘shilib, kattarog‘i qoladi.
- Ota va birinchi bola marginlari ham qo‘shiladi; `padding`, `border` yoki `display: flow-root` buni to‘xtatadi.
- Gorizontal marginlar va flex/grid ichidagi marginlar qo‘shilmaydi.
