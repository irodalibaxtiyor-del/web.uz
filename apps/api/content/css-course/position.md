## Joylashtirish: `position`

`position` elementni oddiy oqimdan chiqarib, aniq joyga qo‘yish imkonini beradi. Joy `top`, `right`, `bottom`, `left` xususiyatlari bilan beriladi.

| Qiymat     | Nimaga nisbatan joylashadi                       | Oqimda joy qoladimi? |
| ---------- | ------------------------------------------------ | -------------------- |
| `static`   | Joylashtirilmaydi (standart)                     | Ha                   |
| `relative` | O‘zining asl joyiga nisbatan                     | Ha                   |
| `absolute` | Eng yaqin joylashtirilgan ota elementga nisbatan | Yo‘q                 |
| `fixed`    | Brauzer oynasiga nisbatan                        | Yo‘q                 |
| `sticky`   | Aylantirishgacha oddiy, keyin “yopishadi”        | Ha                   |

## `relative`

```css
.belgi {
  position: relative;
  top: -4px;
}
```

Element asl joyidan 4px yuqoriga suriladi, lekin uning asl joyi bo‘sh qoladi — qo‘shnilar surilmaydi.

`relative` ning eng muhim vazifasi boshqa: u **absolute bolalar uchun tayanch** bo‘ladi.

## `absolute`

```css
.karta {
  position: relative;
}

.karta .yorliq {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

`.yorliq` kartochkaning yuqori o‘ng burchagiga joylashadi. Qoida: `absolute` element `position` qiymati `static` bo‘lmagan **eng yaqin ota**ni qidiradi. Topilmasa — butun sahifaga nisbatan joylashadi (ko‘pincha kutilmagan natija).

`absolute` element oqimdan chiqadi: boshqa elementlar uni “ko‘rmaydi” va o‘rniga siljiydi.

## `fixed`

```css
.yuqoriga {
  position: fixed;
  right: 16px;
  bottom: 16px;
}
```

Sahifa aylantirilsa ham, element ekranning shu joyida turadi. Chat tugmalari, “yuqoriga” tugmasi shunday qilinadi.

## `sticky`

```css
.sarlavha {
  position: sticky;
  top: 0;
}
```

Element oddiy turadi, lekin aylantirilganda ekranning yuqorisiga yetgach “yopishib” qoladi. Faqat ota elementi ichida ishlaydi. `top` (yoki boshqa tomon) berilmasa, `sticky` ishlamaydi.

## `inset` qisqa yozuvi

```css
.qoplama {
  position: absolute;
  inset: 0; /* top, right, bottom, left hammasi 0 */
}
```

Ota elementni to‘liq qoplaydigan qatlam uchun qulay.

## Xulosa

- `relative` — o‘z joyidan siljish va absolute bolalar uchun tayanch.
- `absolute` — eng yaqin joylashtirilgan otaga nisbatan, oqimdan chiqadi.
- `fixed` — ekranga nisbatan, `sticky` — aylantirishda yopishadi.
