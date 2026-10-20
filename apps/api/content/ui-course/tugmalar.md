## Tugma — eng ko‘p bosiladigan element

Interfeysda tugmalar ko‘p va ular har xil vazifada: saqlash, bekor qilish, o‘chirish. Ular bir oiladan bo‘lishi kerak — bir xil balandlik, burchak, shrift — lekin vazifasiga qarab rangi farq qiladi.

## Asos va modifikatorlar

Umumiy xususiyatlar bitta klassda, farqlar — **modifikator** klasslarda:

```css
.tugma {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: 18px;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
}

.tugma--asosiy {
  background-color: #0071dc;
  color: white;
}
.tugma--chegarali {
  background-color: white;
  color: #0f172a;
  border-color: #cbd5e1;
}
.tugma--xavfli {
  background-color: #b91c1c;
  color: white;
}
```

```html
<button class="tugma tugma--asosiy">Saqlash</button>
```

`--` bilan yozish **BEM** nomlash usulidan: `blok__element--modifikator`. Shart emas, lekin klass nimani anglatishini darhol ko‘rsatadi.

## Nega `border: 1px solid transparent`?

Chegarali variantda 1px chegara bor. Agar boshqa variantlarda chegara bo‘lmasa, chegarali tugma 2px kattaroq chiqadi va yonma-yon turganda notekis ko‘rinadi. Shaffof chegara barcha variantlarni bir xil o‘lchamda saqlaydi.

## `font: inherit`

Brauzer tugmaga o‘z shriftini beradi (ko‘pincha kichikroq). `font: inherit` tugmani sahifa shrifti bilan bir xil qiladi.

## `<button>` va `<a>`

| Element                  | Qachon                                            |
| ------------------------ | ------------------------------------------------- |
| `<button type="button">` | Amal bajaradi: oynani ochish, yuborish, o‘chirish |
| `<a href>`               | Boshqa sahifaga olib boradi                       |

Havolani tugma kabi bezash mumkin (“Kursni boshlash” → `/kurs`), lekin tugmani havola qilib yozmang: klaviatura, ekran o‘quvchi va “yangi oynada ochish” noto‘g‘ri ishlaydi.

Formadagi tugmaga doim `type` yozing: `type` siz `<button>` forma ichida standart holda **submit** bo‘ladi.

## O‘lchamlar

Ko‘p tizimlarda tugmaning 2–3 o‘lchami bor: kichik (36px — jadval ichida), o‘rta (44px — standart), katta (52px — bosh ekran). Ular ham modifikator: `.tugma--katta`.

## Matn

Tugma matni — **fe’l**, aniq harakat: “Saqlash”, “Kursga yozilish”. “OK” yoki “Ha” kabi umumiy so‘zlar tasdiqlash oynasida noaniq: “O‘chirish” va “Bekor qilish” ancha tushunarli.

Mashqda bitta asosdan uchta tugma varianti yasaysiz.
