## Amaliy loyiha: maketdan sahifa

Oxirgi uch darsda kichik studiya saytining bosh sahifasini maket bo‘yicha yig‘asiz: header, hero va kartalar, footer. Har bir mashqda ikki freym (Mobile 360 va Desktop 1440) spetsifikatsiyasi beriladi — xuddi haqiqiy loyihadagidek.

## Ish tartibi

Haqiqiy loyihada maketni ochganingizda:

1. **Tokenlarni yig‘ing**: ranglar, shriftlar, oraliqlar, radiuslar, soyalar. Ular `:root` ga tushadi.
2. **Tuzilmani o‘qing**: qatlamlar daraxti → HTML. Har bir freym — semantik element (`header`, `nav`, `main`, `section`, `footer`).
3. **Maketni aniqlang**: Auto Layout → Flexbox, Layout Grid → Grid, constraints → kenglik qoidalari.
4. **Freymlarni solishtiring**: mobil va desktop orasidagi farqlar → media so‘rovlar.
5. **Komponentlarni ajrating**: tugma, karta — qayta ishlatiladigan klasslar.
6. **Solishtiring**: freym o‘lchamida maket bilan yonma-yon.

## Header

```
Header (Horizontal, Space between, Align center)
Mobile:  H 64 · Padding 0 16 · Nav hidden
Desktop: H 72 · Padding 0 72 · Nav: Horizontal, Gap 32
Stroke bottom 1 #E2E8F0
```

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding-inline: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.nav {
  display: none;
}

@media (min-width: 1024px) {
  .header {
    min-height: 72px;
    padding-inline: 72px;
  }
  .nav {
    display: flex;
    gap: 32px;
  }
}
```

## `height` yoki `min-height`?

Maketda “H 64” yozilgan. `height: 64px` yozsangiz, foydalanuvchi shriftni kattalashtirganda yoki header ichidagi narsa ikki qatorga tushganda kontent chiqib ketadi. `min-height` bilan header kamida 64px, lekin kerak bo‘lsa o‘sadi. Maketdagi aniq balandliklarni deyarli har doim `min-height` sifatida yozing.

## Telefondagi menyu

Mobil freymda nav yashirin — demak dizayner burger menyuni nazarda tutgan. Uning maketini so‘rang yoki “Moslashuvchan dizayn” kursidagi burger usulini qo‘llang. Muhimi: menyu telefonda **yo‘qolib qolmasin** — faqat boshqa ko‘rinishga o‘tsin.

## Logo

Logo odatda bosh sahifaga havola (`<a href="/">`). Agar u rasm bo‘lsa — `alt` da sayt nomi; SVG bo‘lsa — `aria-label`.

Mashqda header’ni ikki freym spetsifikatsiyasi bo‘yicha yig‘asiz.
