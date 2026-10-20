## Auto Layout — Figma’dagi Flexbox

Oddiy freymda qatlamlar istalgan joyda “suzib” turadi. **Auto Layout** yoqilgan freymda esa ichidagi elementlar avtomatik ketma-ket joylashadi, oraliqlar va chetlar qat’iy. Matn uzaysa, tugma o‘zi kattalashadi. Bu CSS’dagi Flexbox’ning aynan o‘zi — dasturchi uchun eng qulay maket turi.

Figma’da Auto Layout qatlamni tanlab **Shift + A** bilan yoqiladi.

## Xususiyatlar jadvali

| Figma (Auto Layout)        | CSS                                  |
| -------------------------- | ------------------------------------ |
| Direction: Horizontal →    | `display: flex; flex-direction: row` |
| Direction: Vertical ↓      | `flex-direction: column`             |
| Gap between items 8        | `gap: 8px`                           |
| Padding 10 / 16            | `padding: 10px 16px`                 |
| Alignment (9 nuqtali to‘r) | `justify-content` + `align-items`    |
| Space between              | `justify-content: space-between`     |

## Tugma misoli

```
Button/Primary
Auto layout: Horizontal → · Gap 8 · Padding 10 16 · Align: Center
├── Icon/Plus 20×20
└── Text "Yangi vazifa"
```

```css
.tugma {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
}
```

`inline-flex` — tugma qatordagi matn kabi o‘z kengligida qoladi (Figma’dagi “Hug”). Butun qatorni egallashi kerak bo‘lsa — `flex`.

## Nega bu muhim

Agar maket Auto Layout’siz chizilgan bo‘lsa, dasturchi har bir masofani o‘lchab, taxmin qilishi kerak. Auto Layout bilan esa barcha oraliqlar aniq yozilgan va ular CSS’ga bir-biriga to‘g‘ri o‘tadi. Shuning uchun ko‘p jamoalarda “har bir komponent Auto Layout’da bo‘lsin” degan qoida bor. Agar dizayner hali Auto Layout ishlatmasa — buni so‘rang, ikkalangizga ham vaqt tejaydi.

## Ichma-ich Auto Layout

Murakkab komponent bir nechta Auto Layout freymdan iborat: karta — vertikal, uning sarlavhasi — gorizontal, tugmalar qatori — gorizontal. Bu xuddi ichma-ich flex konteynerlar:

```
Card (Vertical, Gap 12)
├── Header (Horizontal, Space between)
├── Text
└── Actions (Horizontal, Gap 8)
```

Qatlamlar daraxti HTML tuzilmasining tayyor rejasi.

## Stroke va o‘lcham

Figma’da Auto Layout freymining o‘lchamiga stroke kirmaydi (sozlamaga bog‘liq). CSS’da `box-sizing: border-box` bilan chegara o‘lcham ichida hisoblanadi. Ikkalasini bir xil qilish uchun maketdagi stroke turini (Inside/Outside) tekshiring — keyingi modullarda batafsil.

Mashqda Auto Layout tugmani Flexbox bilan yasaysiz.
