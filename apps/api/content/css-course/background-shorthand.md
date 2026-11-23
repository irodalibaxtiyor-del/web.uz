## Qisqa yozuv: `background`

Fon xususiyatlarini alohida-alohida yozish uzun bo‘ladi:

```css
.hero {
  background-color: #0e1133;
  background-image: url("tog.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
```

Ularning hammasini bitta `background` xususiyatiga jamlash mumkin:

```css
.hero {
  background: #0e1133 url("tog.jpg") no-repeat center / cover;
}
```

## Tartib

Qiymatlar odatda shu tartibda yoziladi (ba’zilarini tushirib qoldirish mumkin):

1. `background-color`
2. `background-image`
3. `background-repeat`
4. `background-attachment`
5. `background-position` / `background-size`

> **E’tibor bering:** `background-size` faqat `background-position` dan keyin, `/` orqali yoziladi: `center / cover`.

## Faqat rang

Eng ko‘p uchraydigan holat — faqat fon rangi:

```css
.karta {
  background: white;
}
```

## Qisqa yozuvning “tuzog‘i”

Qisqa yozuv **yozilmagan** qiymatlarni standartga qaytaradi. Quyidagi misolda ikkinchi qoida rasmni o‘chirib yuboradi:

```css
.hero {
  background-image: url("tog.jpg");
  background: #0e1133; /* image endi none! */
}
```

To‘g‘ri yo‘l — avval qisqa yozuv, keyin alohida xususiyatlar:

```css
.hero {
  background: #0e1133 url("tog.jpg") no-repeat center;
  background-size: cover;
}
```

## Bir nechta fon

Vergul bilan bir nechta fon qatlami beriladi — birinchisi eng ustda:

```css
.banner {
  background:
    linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)),
    url("shahar.jpg") center / cover;
}
```

Bu yerda rasm ustiga yarim shaffof qora qatlam qo‘yilgan — matn o‘qilishi osonlashadi. Rang faqat **oxirgi** qatlamda yozilishi mumkin.

```tekshir
`background` qisqa yozuvida `size` qanday yoziladi?
+ `position` dan keyin `/` bilan: `center / cover`
- vergul bilan: `center, cover`
- har doim birinchi qiymat bo‘lib
> Masalan: `background: #234 url(f.jpg) center / cover no-repeat;`.
```

```jonli
<div style="height: 120px; background: #234 url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27500%27%20height=%27200%27%20viewBox=%270%200%20500%20200%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%2316a085%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23a8e6ff%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27500%27%20height=%27200%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27360%27%20cy=%2760%27%20r=%2732%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20200%20L0%20140%20L175%2090%20L300%20150%20L400%20120%20L500%20160%20L500%20200%20Z%27%20fill=%27%230b3b33%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E) center / cover no-repeat"></div>
```

## Xulosa

- `background` — fon xususiyatlarining qisqa yozuvi.
- `size` faqat `position` dan keyin `/` bilan yoziladi.
- Qisqa yozuv tushirib qoldirilgan qiymatlarni standartga qaytaradi.
