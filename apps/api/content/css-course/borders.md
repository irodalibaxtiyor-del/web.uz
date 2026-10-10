## Chegara: `border`

Chegara — element atrofidagi chiziq. Uning uchta asosiy xususiyati bor:

| Xususiyat      | Vazifasi       | Misol            |
| -------------- | -------------- | ---------------- |
| `border-style` | Chiziq turi    | `solid`, `dashed` |
| `border-width` | Qalinligi      | `2px`, `thin`    |
| `border-color` | Rangi          | `#0071dc`        |

```css
.karta {
  border-style: solid;
  border-width: 2px;
  border-color: #0071dc;
}
```

> **Muhim:** `border-style` berilmasa, chegara umuman ko‘rinmaydi — uning standart qiymati `none`.

## Chiziq turlari

| Qiymat   | Ko‘rinishi                       |
| -------- | -------------------------------- |
| `solid`  | Yaxlit chiziq                    |
| `dashed` | Uzuq-uzuq (chiziqchalar)         |
| `dotted` | Nuqtalar                         |
| `double` | Qo‘sh chiziq                     |
| `groove`, `ridge` | O‘yilgan / bo‘rtib chiqqan |
| `inset`, `outset` | Botiq / qavariq            |
| `none`   | Chegara yo‘q                     |

```css
.eslatma {
  border-style: dashed;
}
```

## Qalinlik

Piksel yoki boshqa birliklarda, yoki kalit so‘zlar bilan: `thin`, `medium` (standart), `thick`.

```css
.ajratuvchi {
  border-style: solid;
  border-width: thick;
}
```

## Rang

Rang berilmasa, chegara **matn rangida** (`currentcolor`) chiziladi.

```css
.xato {
  color: crimson;
  border-style: solid; /* chegara ham qizil */
}
```

## Qisqa yozuv

Uchala xususiyatni bitta `border` bilan yozish odatiy:

```css
.karta {
  border: 2px solid #0071dc;
}
```

Tartib muhim emas, lekin odatda `qalinlik tur rang` tartibida yoziladi. Faqat `style` majburiy: `border: solid;` ham ishlaydi.

## Chegara o‘lchamga qo‘shiladi

Standart holda `width: 200px` va `border: 5px` bo‘lgan element ekranda **210px** kenglikni egallaydi. Bu “quti modeli” darsida batafsil tushuntiriladi.

## Xulosa

- Chegara = tur + qalinlik + rang; `border-style` siz ko‘rinmaydi.
- Qisqa yozuv: `border: 2px solid #0071dc;`.
- Rang berilmasa, chegara matn rangini oladi.
