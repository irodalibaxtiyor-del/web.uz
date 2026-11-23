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
  .w { background: url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27150%27%20viewBox=%270%200%20400%20150%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%232e8b57%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ffe08a%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27150%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27288%27%20cy=%2745%27%20r=%2724%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20150%20L0%20105%20L140%2068%20L240%20113%20L320%2090%20L400%20120%20L400%20150%20Z%27%20fill=%27%231b3a2b%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E) center / cover; padding: 12px; }
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
