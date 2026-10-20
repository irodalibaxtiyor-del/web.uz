## Maketni “chizib” berish

`grid-template-areas` bilan maketni so‘zlar bilan chizish mumkin. Har bir qo‘shtirnoq — bitta qator, ichidagi so‘zlar — ustunlar:

```css
.sahifa {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "nav    main"
    "aside  main"
    "footer footer";
}

header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }
```

Bir xil nom yonma-yon yoki ustma-ust takrorlansa, element bir nechta katakni egallaydi. `main` ikki qatorni, `header` ikki ustunni egallaydi.

## Moslashuvchan maket

Asosiy kuch — media so‘rovda faqat **hududlar xaritasini** almashtirish:

```css
.sahifa {
  display: grid;
  gap: 16px;
  grid-template-areas: "header" "nav" "main" "aside" "footer";
}

@media (min-width: 768px) {
  .sahifa {
    grid-template-columns: 240px 1fr;
    grid-template-areas:
      "header header"
      "nav main"
      "aside main"
      "footer footer";
  }
}
```

HTML o‘zgarmaydi, elementlarning `grid-area` nomlari ham o‘zgarmaydi — faqat xarita.

## Qoidalar

- Har bir qatorda ustunlar soni bir xil bo‘lishi kerak.
- Hudud to‘rtburchak bo‘lishi kerak (“L” shakli mumkin emas).
- Bo‘sh katak nuqta bilan belgilanadi: `"header ." `.
- Nom tirnoqsiz yoziladi: `grid-area: main`, `grid-area: "main"` emas.

## Tartib va accessibility

Hududlar bilan elementni ekranda istalgan joyga qo‘yish mumkin, lekin klaviatura (Tab) va ekran o‘quvchi **HTML tartibi** bo‘yicha yuradi. Agar vizual tartib HTML tartibidan juda farq qilsa, foydalanuvchi chalkashadi. Yaxshi odat: HTML’da mantiqiy tartibni saqlang (sarlavha, menyu, asosiy kontent, yon panel, pastki qism) va hududlar bilan faqat joylashuvni o‘zgartiring.

## DevTools yordami

Chrome va Firefox DevTools’ida grid konteyner yonidagi `grid` belgisini bosing — sahifa ustida chiziqlar va hudud nomlari chiziladi. Maket kutilgandek bo‘lmasa, birinchi qarash kerak bo‘lgan joy shu.

Mashqda bir xil HTML’dan telefon va planshet uchun ikki xil maket yasaysiz.
