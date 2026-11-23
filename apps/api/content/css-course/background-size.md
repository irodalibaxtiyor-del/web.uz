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

```tekshir
Bir nechta fon qatlami yozilganda qaysi biri ustda turadi?
+ birinchi yozilgani
- oxirgi yozilgani
- eng kattasi
> Vergul bilan yozilgan fonlarning birinchisi eng yuqori qatlam.
```

```jonli
<style>
  .b { height: 140px; background:
      linear-gradient(rgb(0 0 0 / 0.6), transparent),
      url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27500%27%20height=%27200%27%20viewBox=%270%200%20500%20200%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230071dc%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f5a623%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27500%27%20height=%27200%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27360%27%20cy=%2760%27%20r=%2732%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20200%20L0%20140%20L175%2090%20L300%20150%20L400%20120%20L500%20160%20L500%20200%20Z%27%20fill=%27%23123456%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E) center / cover; color: white; padding: 10px; }
</style>
<div class="b">Gradient rasm ustida — matn o‘qiladi</div>
```

## Xulosa

- `cover` — to‘liq qoplash, `contain` — to‘liq ko‘rsatish.
- Bir nechta fon vergul bilan, birinchisi ustda.
- `background-clip` fon chegarasini, `background-origin` boshlanish nuqtasini belgilaydi.
