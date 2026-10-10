## Tashqi bo‘shliq: `margin`

`margin` — elementning **chegarasidan tashqaridagi** bo‘sh joy. U elementni qo‘shnilaridan uzoqlashtiradi. Margin har doim shaffof — unga fon rangi tegmaydi.

```css
.karta {
  margin: 24px;
}
```

## Tomonlar

Har bir tomon alohida: `margin-top`, `margin-right`, `margin-bottom`, `margin-left`.

```css
h2 {
  margin-top: 32px;
  margin-bottom: 8px;
}
```

Qisqa yozuv — chegaradagidek soat mili bo‘yicha:

| Yozuv                    | Ma’nosi                                   |
| ------------------------ | ----------------------------------------- |
| `margin: 16px;`          | To‘rt tomon 16px                          |
| `margin: 16px 32px;`     | Yuqori-past 16px, o‘ng-chap 32px          |
| `margin: 8px 16px 24px;` | Yuqori 8px, yonlar 16px, past 24px        |
| `margin: 1px 2px 3px 4px;` | Yuqori, o‘ng, past, chap                |

## Markazlash: `margin: 0 auto`

Kengligi berilgan blok elementni gorizontal markazga qo‘yishning klassik usuli:

```css
.konteyner {
  max-width: 960px;
  margin: 0 auto;
}
```

`auto` qolgan bo‘sh joyni chap va o‘ng tomonga teng bo‘lib beradi. Buning uchun element **blok** bo‘lishi va kengligi to‘liq bo‘lmasligi kerak.

## Manfiy margin

Margin manfiy bo‘lishi mumkin — element qo‘shnisiga “yaqinlashadi” yoki uning ustiga chiqadi:

```css
.ustma-ust {
  margin-top: -20px;
}
```

Bu ehtiyotkorlik bilan ishlatiladigan usul.

## `inherit`

Margin ota elementdan meros qolmaydi, lekin `inherit` bilan majburan olish mumkin:

```css
.ichki {
  margin-left: inherit;
}
```

## Brauzerning standart marginlari

Ko‘p elementlarda standart margin bor: `body` atrofida ~8px, `h1`–`h6` va `p` ning tepa-pastida. Shuning uchun sahifa boshida ko‘pincha shunday yoziladi:

```css
body {
  margin: 0;
}
```

## Xulosa

- `margin` — chegaradan tashqaridagi shaffof bo‘shliq.
- Qisqa yozuv soat mili bo‘yicha: yuqori, o‘ng, past, chap.
- `margin: 0 auto` — kengligi cheklangan blokni markazga qo‘yadi.
