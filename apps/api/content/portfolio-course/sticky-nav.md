## Header doim qo‘l ostida

Uzun bir sahifali saytda menyu faqat tepada bo‘lsa, foydalanuvchi bo‘limlar orasida o‘tish uchun har safar yuqoriga qaytishi kerak. **Yopishqoq** (sticky) header aylantirilganda ham ekran tepasida qoladi.

## `position: sticky`

```css
.sarlavha {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

- `sticky` — element oddiy oqimda turadi, lekin aylantirilganda `top: 0` ga yetgach “yopishadi”;
- `top` shart — usiz sticky ishlamaydi;
- `z-index` — aylantirilgan kontent header ustidan o‘tib ketmasligi uchun.

`position: fixed` dan farqi: sticky element joyini oqimda saqlaydi, shuning uchun ostidagi kontent uning ostiga “kirib” qolmaydi.

## Shaffof va xiralashgan fon

```css
.sarlavha {
  background-color: rgb(250 250 249 / 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--chegara);
}
```

Ostidan o‘tayotgan kontent biroz ko‘rinib turadi, lekin xiralashgani uchun header matni o‘qiladi. Fon to‘liq shaffof bo‘lmasin — `backdrop-filter` ni qo‘llab-quvvatlamaydigan brauzerda ham matn o‘qilishi kerak.

## Sticky ishlamasa

Eng ko‘p uchraydigan sabablar:

- ota elementlardan birida `overflow: hidden` yoki `overflow: auto` — sticky o‘sha element ichida ishlaydi, sahifada emas;
- ota element balandligi header’ning o‘zi bilan teng — yopishadigan joy yo‘q;
- `top` berilmagan.

## Balandlikni hisobga olish

Header balandligi 64px bo‘lsa, langarlar bilan o‘tganda sarlavhalar uning ostida qolmasligi uchun 1-moduldagi `scroll-margin-top` ni header balandligidan biroz kattaroq qiling.

## Telefonda

Kichik ekranda doimiy header joy egallaydi. Ba’zi saytlar pastga aylantirganda header’ni yashirib, yuqoriga aylantirganda ko‘rsatadi (JavaScript bilan). Oddiy portfolio uchun ixcham (56–64px) sticky header yetarli.

Mashqda header’ni yopishqoq va shaffof-xira qilasiz.
