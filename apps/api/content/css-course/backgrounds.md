## Fon rangi: `background-color`

`background-color` elementning fonini bo‘yaydi. Fon elementning butun maydonini — matn ostini va ichki bo‘shliqni (`padding`) — egallaydi.

```css
body {
  background-color: #f5faff;
}

.eslatma {
  background-color: #fff8db;
  padding: 12px;
}
```

Standart qiymat — `transparent`: ota elementning foni ko‘rinib turadi.

## Har qanday elementga

Fon rangini istalgan elementga berish mumkin: sarlavha, paragraf, tugma, jadval katakchasi, hatto `span`:

```css
h2 {
  background-color: #0071dc;
  color: white;
}

mark,
.belgi {
  background-color: #fec400;
}
```

## Shaffof fon va `opacity` farqi

Fonni yarim shaffof qilishning ikki yo‘li bor, lekin ular bir xil emas:

```css
.a {
  background-color: rgb(0 113 220 / 0.3); /* faqat fon shaffof */
}

.b {
  background-color: rgb(0 113 220);
  opacity: 0.3; /* fon HAM, matn HAM shaffof */
}
```

`opacity` butun elementni — ichidagi matn va rasmlar bilan birga — xiralashtiradi. Faqat fon shaffof bo‘lishi kerak bo‘lsa, alfa kanalli rangdan foydalaning.

## Fon va o‘qilish

Fon rangini tanlaganda matn rangini ham o‘ylang:

```css
.tungi {
  background-color: #0e1133;
  color: #f5faff; /* to‘q fonda och matn */
}
```

## Fon va brauzer standarti

Ba’zi elementlarning standart foni bor: masalan, `button` va `input` brauzerdan kulrang yoki oq fon oladi. Ularni ham `background-color` bilan o‘zgartirish mumkin.

```tekshir
Faqat fonni yarim shaffof qilib, matnni to‘liq ko‘rinadigan qoldirish uchun nima yoziladi?
- `opacity: 0.5`
+ `background-color: rgb(0 0 0 / 0.5)`
- `background-opacity: 0.5`
> `opacity` butun elementni (matnni ham) shaffof qiladi, alfa kanalli rang esa faqat fonni.
```

```jonli
<style>
  .w { background: url(https://picsum.photos/400/150) center / cover; padding: 12px; }
  .w p { padding: 8px; color: white; }
</style>
<div class="w">
  <p style="background: rgb(0 0 0 / 0.5)">alfa kanalli fon</p>
  <p style="background: black; opacity: 0.5">opacity: 0.5</p>
</div>
```

## Xulosa

- `background-color` — elementning foni, `padding` maydonini ham qamraydi.
- Standart qiymat `transparent`.
- Faqat fon shaffof bo‘lishi uchun alfa kanalli rang, butun element uchun `opacity`.
