## Fon o‘lchami va bir nechta fon

## `background-size`

Fon rasmi standart holda o‘zining asl o‘lchamida chiziladi. `background-size` buni o‘zgartiradi:

| Qiymat        | Natija                                                       |
| ------------- | ------------------------------------------------------------ |
| `auto`        | Asl o‘lcham (standart)                                       |
| `cover`       | Elementni **to‘liq qoplaydi**, ortiqchasi kesiladi           |
| `contain`     | Rasm **to‘liq ko‘rinadi**, bo‘sh joy qolishi mumkin          |
| `200px 100px` | Aniq kenglik va balandlik                                    |
| `50% auto`    | Element kengligining yarmi, balandlik nisbatga qarab         |

```css
.qahramon {
  background-image: url("manzara.jpg");
  background-size: cover;
  background-position: center;
}
```

`cover` + `center` — bannerlar uchun eng ko‘p ishlatiladigan juftlik: rasm cho‘zilmaydi, markaziy qismi doim ko‘rinadi.

## Bir nechta fon

Bitta elementga bir nechta fon qatlami berish mumkin. Ular vergul bilan yoziladi, **birinchisi eng ustda**:

```css
.banner {
  background-image:
    linear-gradient(rgba(14, 17, 51, 0.6), rgba(14, 17, 51, 0.6)),
    url("shahar.jpg");
  background-size: cover;
  background-position: center;
}
```

Rasm ustiga yarim shaffof qatlam — oq matn har qanday rasmda o‘qiladi.

Har qatlam uchun alohida qiymat ham berish mumkin:

```css
.naqsh {
  background-image: url("burchak.svg"), url("fon.png");
  background-position: right bottom, left top;
  background-repeat: no-repeat, repeat;
}
```

## `background-origin` va `background-clip`

| Xususiyat           | Savol                                   | Qiymatlar                                  |
| ------------------- | --------------------------------------- | ------------------------------------------ |
| `background-origin` | Fon rasmi **qayerdan boshlanadi**?      | `padding-box` (standart), `border-box`, `content-box` |
| `background-clip`   | Fon **qayergacha chiziladi**?           | `border-box` (standart), `padding-box`, `content-box`, `text` |

```css
.quti {
  border: 8px dashed rgba(0, 0, 0, 0.3);
  padding: 16px;
  background-color: #fec400;
  background-clip: padding-box; /* uzuq chegara ostida fon yo‘q */
}
```

`background-clip: text` matn harflari ichiga fon chizadi — buni matn effektlari darsida ko‘ramiz.

## Xulosa

- `cover` — to‘liq qoplash, `contain` — to‘liq ko‘rsatish.
- Bir nechta fon vergul bilan, birinchisi ustda.
- `background-clip` fon chegarasini, `background-origin` boshlanish nuqtasini belgilaydi.
