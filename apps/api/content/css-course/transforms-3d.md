## 3D transformatsiyalar

CSS elementlarni uch o‘lchamli fazoda ham aylantira oladi. Uchinchi o‘q — **Z** — ekrandan sizga qarab yo‘nalgan.

| Funksiya        | Vazifasi                               |
| --------------- | -------------------------------------- |
| `rotateX()`     | Gorizontal o‘q atrofida (oldinga-orqaga egiladi) |
| `rotateY()`     | Vertikal o‘q atrofida (eshikdek buriladi)        |
| `rotateZ()`     | `rotate()` bilan bir xil                         |
| `translateZ()`  | Ko‘ruvchiga yaqinlashtirish/uzoqlashtirish       |
| `rotate3d()`, `matrix3d()` | Murakkab holatlar uchun               |

## Perspektiva

Perspektivasiz 3D aylanish “yassi” ko‘rinadi: `rotateY(60deg)` element shunchaki torayadi. Chuqurlik hissi uchun **perspektiva** kerak:

```css
.sahna {
  perspective: 800px;
}

.karta {
  transform: rotateY(30deg);
}
```

`perspective` — ko‘ruvchi ekrandan qancha uzoqda turgani. Kichik qiymat (300px) — kuchli, “keng burchakli” effekt; katta qiymat (1500px) — yumshoq effekt.

Perspektiva **ota elementga** beriladi va barcha bolalar uchun umumiy bo‘ladi. Faqat bitta element uchun funksiya sifatida ham yozish mumkin: `transform: perspective(800px) rotateY(30deg)`.

## Ag‘dariladigan kartochka

```html
<div class="sahna">
  <div class="karta">
    <div class="old">Savol</div>
    <div class="orqa">Javob</div>
  </div>
</div>
```

```css
.sahna {
  perspective: 800px;
}

.karta {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.sahna:hover .karta {
  transform: rotateY(180deg);
}

.old,
.orqa {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

.orqa {
  transform: rotateY(180deg);
}
```

- `transform-style: preserve-3d` — bolalar ham 3D fazoda qoladi (aks holda ular otaning tekisligiga “yassilanadi”).
- `backface-visibility: hidden` — orqasi bilan qaragan tomon ko‘rinmaydi.
- Orqa tomon oldindan 180° burib qo‘yiladi; kartochka ag‘darilganda u to‘g‘ri ko‘rinadi.

## Ehtiyot bo‘ling

- 3D effektlar bezak uchun. Muhim ma’lumot faqat ag‘darilgandagina ko‘rinsa, klaviatura va sensorli ekran foydalanuvchilari uni ko‘rmasligi mumkin.
- Ba’zi foydalanuvchilarda kuchli harakat bosh aylanishiga sabab bo‘ladi — animatsiyalar darsida `prefers-reduced-motion` ni ko‘ramiz.

## Xulosa

- 3D uchun `rotateX`, `rotateY`, `translateZ`.
- Chuqurlik uchun otaga `perspective`.
- Ag‘dariladigan kartochka: `preserve-3d` + `backface-visibility: hidden`.
