## O‘tishlar: `transition`

Hover’da rang bir zumda o‘zgaradi. `transition` bu o‘zgarishni **silliq** qiladi.

```css
.tugma {
  background-color: #0071dc;
  transition: background-color 0.3s ease;
}

.tugma:hover {
  background-color: #005bb0;
}
```

`transition` **boshlang‘ich** holatga yoziladi — shunda u kirishda ham, chiqishda ham ishlaydi.

## Qismlari

| Xususiyat                    | Vazifasi                         | Misol                    |
| ---------------------------- | -------------------------------- | ------------------------ |
| `transition-property`        | Qaysi xususiyat o‘zgaradi        | `background-color`, `all` |
| `transition-duration`        | Davomiyligi                      | `0.3s`, `200ms`          |
| `transition-timing-function` | Tezlik egri chizig‘i             | `ease`, `linear`, `ease-out` |
| `transition-delay`           | Kechikish                        | `0.1s`                   |

Qisqa yozuv: `transition: xususiyat davomiylik egri kechikish;`

## Bir nechta xususiyat

```css
.karta {
  transition:
    transform 0.2s ease-out,
    box-shadow 0.2s ease-out;
}

.karta:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}
```

`transition: all 0.3s` qulay ko‘rinadi, lekin keraksiz xususiyatlarni ham animatsiya qiladi va sekinlashtirishi mumkin. Aniq ro‘yxat yozgan ma’qul.

## Tezlik egri chiziqlari

| Qiymat        | Harakat                                   |
| ------------- | ----------------------------------------- |
| `ease`        | Sekin boshlanadi, tezlashadi, sekin tugaydi (standart) |
| `linear`      | Bir xil tezlikda                          |
| `ease-in`     | Sekin boshlanadi                          |
| `ease-out`    | Sekin tugaydi — interfeys uchun eng tabiiy |
| `ease-in-out` | Ikkala uchida sekin                       |
| `cubic-bezier(…)` | O‘zingizning egri chizig‘ingiz        |

## Qanday xususiyatlar animatsiya qilinadi?

Son yoki rang bilan ifodalanadigan deyarli hamma narsa: ranglar, o‘lchamlar, `opacity`, `transform`, soyalar. `display` va `font-family` kabi “yo bor, yo yo‘q” xususiyatlar silliq o‘zgarmaydi.

**Eng silliq** ishlaydiganlari — `transform` va `opacity`: ular maketni qayta hisoblatmaydi.

## Davomiylik

- Hover va kichik o‘zgarishlar: **150–300ms**.
- Kattaroq panel ochilishi: 300–500ms.
- 1 soniyadan uzun o‘tishlar interfeysni “sekin” his qildiradi.

## Harakatni kamaytirish

Ba’zi foydalanuvchilar tizim sozlamalarida harakatni kamaytirishni yoqqan. Ularni hurmat qiling:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
```

## Xulosa

- `transition` boshlang‘ich holatga yoziladi.
- Aniq xususiyatlarni ko‘rsating, `all` dan qoching.
- `transform` va `opacity` eng silliq animatsiya qilinadi.
- `prefers-reduced-motion` ni hurmat qiling.
