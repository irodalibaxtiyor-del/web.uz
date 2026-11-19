## `display: inline-block`

`inline-block` ikki dunyoning yaxshi tomonlarini birlashtiradi:

| Xususiyat                     | `inline` | `inline-block` | `block` |
| ----------------------------- | -------- | -------------- | ------- |
| Bir qatorda turadi            | Ha       | **Ha**         | Yo‘q    |
| `width` va `height` ishlaydi  | Yo‘q     | **Ha**         | Ha      |
| Vertikal padding/margin joy oladi | Yo‘q | **Ha**         | Ha      |

## Qachon kerak?

**Havola-tugma:**

```css
.tugma {
  display: inline-block;
  padding: 10px 20px;
}
```

Oddiy `inline` havolaga vertikal padding bersangiz, fon kattalashadi, lekin qo‘shni qatorlar bunga joy bermaydi va ustma-ust tushadi. `inline-block` bilan tugma o‘z joyini to‘g‘ri egallaydi.

**Yorliqlar (teglar):**

```css
.teg {
  display: inline-block;
  padding: 2px 10px;
  margin: 0 4px 4px 0;
  border-radius: 999px;
  background-color: #e6f1fc;
}
```

Yorliqlar qatorga sig‘maganda keyingi qatorga o‘tadi va vertikal marginlar ishlaydi.

## Gorizontal menyu

```css
nav li {
  display: inline-block;
}

nav a {
  display: inline-block;
  padding: 12px 16px;
}
```

## Bo‘sh joy muammosi

`inline-block` elementlar matn kabi joylashadi, shuning uchun HTML’dagi qator o‘tishlari ular orasida **taxminan 4px bo‘sh joy** paydo qiladi. Aniq maket kerak bo‘lsa, Flexbox (`display: flex` + `gap`) yaxshiroq — bu kamchilik u yerda yo‘q.

## Vertikal tekislash

`inline-block` elementlar matn chizig‘i (baseline) bo‘yicha tekislanadi. Har xil balandlikdagi bloklarni yuqoridan tekislash uchun:

```css
.karta {
  display: inline-block;
  vertical-align: top;
}
```

```tekshir
`inline-block` elementning `inline` dan farqi nima?
+ unga `width`, `height` va vertikal `padding` to‘liq ishlaydi
- u har doim yangi qatordan boshlanadi
- u matn qatorida tura olmaydi
> `inline-block` qatorda turadi, lekin blokdek o‘lchanadi.
```

```jonli
<style>
  span { width: 90px; height: 40px; padding: 6px; background: #ffe08a; margin: 2px; }
</style>
<p>inline: <span>A</span><span>B</span></p>
<p>inline-block: <span style="display: inline-block">A</span><span style="display: inline-block">B</span></p>
```

## Xulosa

- `inline-block` — qatorda turadi, o‘lcham va padding ishlaydi.
- Havola-tugma va yorliqlar uchun qulay.
- Murakkab qatorli maket uchun Flexbox ishlating.
