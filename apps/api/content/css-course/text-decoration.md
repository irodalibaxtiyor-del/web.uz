## Matn bezagi: `text-decoration`

`text-decoration` matn ostiga, ustiga yoki o‘rtasiga chiziq tortadi. Eng ko‘p ishlatiladigan joyi — havolalar.

```css
a {
  text-decoration: none;
}

.eski-narx {
  text-decoration: line-through;
}
```

## Qismlari

`text-decoration` aslida to‘rtta xususiyatning qisqa yozuvi:

| Xususiyat                   | Qiymatlar                                       |
| --------------------------- | ----------------------------------------------- |
| `text-decoration-line`      | `none`, `underline`, `overline`, `line-through` |
| `text-decoration-color`     | Istalgan rang                                   |
| `text-decoration-style`     | `solid`, `double`, `dotted`, `dashed`, `wavy`   |
| `text-decoration-thickness` | `2px`, `auto`, `from-font`                      |

```css
.muhim {
  text-decoration: underline wavy crimson 2px;
}
```

Bir nechta chiziqni birga berish mumkin: `text-decoration-line: underline overline;`.

## Chiziqni matndan uzoqlashtirish

```css
a {
  text-underline-offset: 4px;
}
```

`text-underline-offset` tagchiziqni harflardan biroz pastga tushiradi — o‘qish ancha yengillashadi.

## Havolalar va foydalanish qulayligi

Ko‘pchilik havolalardan tagchiziqni olib tashlaydi. Lekin matn ichidagi havolani **faqat rang bilan** ajratish yetarli emas: rangni farqlay olmaydigan foydalanuvchi uni ko‘rmaydi.

Yaxshi yechim:

```css
.maqola a {
  color: #0071dc;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.maqola a:hover {
  text-decoration-thickness: 2px;
}
```

Menyu va tugmalardagi havolalarda tagchiziq shart emas — ular shaklidan tanib olinadi.

## Tagchiziq bilan ehtiyot bo‘ling

Havola bo‘lmagan matnga tagchiziq bermang: foydalanuvchi uni bosishga urinadi. Ajratib ko‘rsatish uchun qalin yozuv yoki rangdan foydalaning.

## Xulosa

- `text-decoration: none` havoladan tagchiziqni olib tashlaydi.
- Qisqa yozuv: chiziq turi, uslubi, rangi va qalinligi.
- `text-underline-offset` tagchiziqni harflardan uzoqlashtiradi.
- Matn ichidagi havolalar faqat rang bilan emas, chiziq bilan ham ajralib tursin.
