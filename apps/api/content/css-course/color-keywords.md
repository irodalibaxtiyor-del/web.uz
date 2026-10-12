## Rang kalit so‘zlari

`red` yoki `navy` kabi nomlardan tashqari, CSS’da bir nechta **maxsus** rang so‘zlari bor.

## `transparent`

To‘liq shaffof rang. Aslida `rgba(0, 0, 0, 0)` ga teng.

```css
.tugma-chegara {
  background-color: transparent;
  border: 2px solid #0071dc;
}
```

Shaffof chegara ham foydali: hover’da faqat rangni o‘zgartirsangiz, element o‘lchami “sakramaydi”.

```css
.tab {
  border-bottom: 3px solid transparent;
}

.tab:hover {
  border-bottom-color: #0071dc;
}
```

## `currentColor`

Elementning joriy **matn rangi** (`color`):

```css
.ogohlantirish {
  color: crimson;
  border: 2px solid currentColor;
  box-shadow: 0 0 0 4px currentColor;
}
```

Rangni faqat bir joyda — `color` da — o‘zgartirsangiz, chegara va soya ham birga o‘zgaradi. SVG ikonkalardagi `fill: currentColor` ham shu so‘z (4-modul).

`border-color` berilmasa, chegara standart holda `currentColor` bo‘ladi.

## `inherit`, `initial`, `unset`, `revert`

Bu so‘zlar har qanday xususiyatda ishlaydi:

| So‘z      | Natija                                                         |
| --------- | -------------------------------------------------------------- |
| `inherit` | Ota elementning qiymatini oladi                                |
| `initial` | CSS spetsifikatsiyasidagi boshlang‘ich qiymat                  |
| `unset`   | Meros bo‘ladigan xususiyatda `inherit`, qolganida `initial`    |
| `revert`  | Brauzerning standart uslubiga qaytaradi                        |

```css
.karta a {
  color: inherit; /* havola kartochka matni rangida */
}
```

> `initial` ehtiyotkorlik bilan: masalan, `display: initial` — `inline`, hatto `div` uchun ham. Brauzerning odatiy qiymatiga qaytish kerak bo‘lsa, `revert` to‘g‘riroq.

## Tizim ranglari

`Canvas`, `CanvasText`, `LinkText`, `ButtonFace` kabi so‘zlar foydalanuvchi operatsion tizimining ranglarini oladi. Ular, ayniqsa, yuqori kontrast rejimida muhim.

## `color-scheme`

```css
:root {
  color-scheme: light dark;
}
```

Brauzerga sahifa ikkala rejimni qo‘llab-quvvatlashini aytadi: qorong‘i rejimda forma maydonlari, aylantirish paneli va standart fon avtomatik qorong‘i bo‘ladi.

## Xulosa

- `transparent` — shaffof, o‘lcham sakramasligi uchun qulay.
- `currentColor` — matn rangini chegara, soya, ikonkaga uzatadi.
- `inherit`, `initial`, `unset`, `revert` — har qanday xususiyat uchun.
