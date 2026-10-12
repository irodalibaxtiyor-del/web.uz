## O‘lchov birliklari

CSS’da uzunlik son va birlik bilan yoziladi: `16px`, `1.5rem`, `50%`. Son bilan birlik orasida bo‘sh joy bo‘lmaydi. Faqat `0` birliksiz yozilishi mumkin.

## Mutlaq birliklar

| Birlik | Ma’nosi                          |
| ------ | -------------------------------- |
| `px`   | Piksel — ekrandagi asosiy birlik |
| `cm`, `mm`, `in`, `pt` | Chop etish uchun   |

Ekran uchun mutlaq birliklardan amalda faqat `px` ishlatiladi.

## Nisbiy birliklar

| Birlik | Nimaga nisbatan                                  |
| ------ | ------------------------------------------------ |
| `em`   | Elementning shrift o‘lchami                      |
| `rem`  | Ildiz (`html`) elementning shrift o‘lchami       |
| `%`    | Ota elementning tegishli o‘lchami                |
| `vw`   | Brauzer oynasi kengligining 1%                   |
| `vh`   | Brauzer oynasi balandligining 1%                 |
| `dvh`  | Telefonda manzil paneli o‘zgarishini hisobga oluvchi `vh` |
| `ch`   | “0” belgisining kengligi                         |

## Qaysi birlik qayerda?

| Vazifa                          | Tavsiya                       |
| ------------------------------- | ----------------------------- |
| Shrift o‘lchami                 | `rem`                         |
| Tugmadagi padding               | `em` (shriftga moslashadi)    |
| Chegara qalinligi               | `px`                          |
| Konteyner kengligi              | `%` yoki `max-width` + `px`/`rem` |
| Matn ustuni kengligi            | `ch` (`max-width: 65ch`)      |
| To‘liq ekranli blok             | `min-height: 100dvh`          |

## `em` va `rem` farqi

```css
html {
  font-size: 16px;
}

.karta {
  font-size: 20px;
  padding: 1em;   /* 20px — o‘z shriftidan */
  margin: 1rem;   /* 16px — html shriftidan */
}
```

`em` padding uchun ajoyib: tugma shriftini kattalashtirsangiz, uning paddingi ham proporsional o‘sadi.

```css
.tugma {
  padding: 0.5em 1em;
}

.tugma.katta {
  font-size: 1.25rem; /* padding ham o‘zi kattalashadi */
}
```

## Foizlar nimaga nisbatan?

- `width: 50%` — ota kengligining yarmi;
- `padding` va `margin` dagi foiz — doim ota **kengligidan** (hatto yuqori/past ham);
- `font-size: 120%` — ota shriftidan;
- `height: 50%` — faqat ota balandligi aniq berilgan bo‘lsa ishlaydi.

## `vh` va telefonlar

Telefon brauzerlarida manzil paneli yashirinib-chiqadi, shuning uchun `100vh` ekrandan sal kattaroq bo‘lib qolishi mumkin. Yangi birliklar bu muammoni hal qiladi: `svh` (kichik), `lvh` (katta), `dvh` (dinamik).

## Xulosa

- Shrift — `rem`, komponent ichidagi bo‘shliq — `em`, chegaralar — `px`.
- `%` ota elementga, `vw`/`vh` oynaga nisbatan.
- Foizli padding ota kengligidan hisoblanadi.
