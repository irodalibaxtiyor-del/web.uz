## Gorizontal menyu

Saytning yuqori menyusi odatda gorizontal bo‘ladi. HTML vertikal menyu bilan bir xil — faqat CSS boshqacha.

## Flexbox bilan

```css
.menyu ul {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menyu a {
  display: block;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
}

.menyu {
  background-color: #0e1133;
}
```

`display: flex` ro‘yxat bandlarini bir qatorga qo‘yadi, `gap` ular orasiga bo‘shliq beradi. Flexbox 13-modulda batafsil, hozircha shu ikki qator yetarli.

## Logo chapda, menyu o‘ngda

```css
.sarlavha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}
```

```html
<header class="sarlavha">
  <a class="logo" href="/">WEBDIZAYN.UZ</a>
  <nav class="menyu">…</nav>
</header>
```

Birinchi bola chapga, oxirgisi o‘ngga suriladi.

## Bitta bandni o‘ngga surish

Faqat “Kirish” havolasi o‘ng chetda tursin desangiz:

```css
.menyu .kirish {
  margin-left: auto;
}
```

Flex konteynerda `margin-left: auto` qolgan bo‘sh joyni o‘zi egallaydi va elementni o‘ngga itaradi.

## Yopishqoq sarlavha

```css
.sarlavha {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

## Kichik ekranlar

Telefonda gorizontal menyu sig‘masligi mumkin. Oddiy yechimlar:

- bandlar keyingi qatorga o‘tsin: `flex-wrap: wrap`;
- menyu gorizontal aylantirilsin: `overflow-x: auto`;
- “☰” tugmasi bilan ochiladigan menyu (bunga ozgina JavaScript kerak).

## Xulosa

- `display: flex` + `gap` — gorizontal menyu.
- `justify-content: space-between` — logo chapda, menyu o‘ngda.
- `margin-left: auto` — bitta bandni o‘ngga surish.
