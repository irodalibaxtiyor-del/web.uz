## Rasmlarni bezash

## Asosiy qoida

```css
img {
  display: block;
  max-width: 100%;
  height: auto;
}
```

- `max-width: 100%` — rasm hech qachon otasidan kengaymaydi.
- `height: auto` — nisbat saqlanadi.
- `display: block` — rasm ostidagi kichik bo‘shliq yo‘qoladi (rasm standart holda qator element sifatida matn chizig‘ida turadi).

## Yumaloq burchak va doira

```css
.rasm {
  border-radius: 12px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}
```

Avatar rasmi kvadrat bo‘lmasa, `object-fit: cover` uni cho‘zmasdan doiraga sig‘diradi (keyingi dars).

## Ramka va soya

```css
.surat {
  padding: 8px;
  border: 1px solid #e5e7eb;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

## Filtrlar: `filter`

| Funksiya        | Natija                    |
| --------------- | ------------------------- |
| `grayscale(1)`  | Oq-qora                   |
| `blur(4px)`     | Xira                      |
| `brightness(1.2)` | Yorqinroq               |
| `contrast(1.5)` | Kontrastliroq             |
| `sepia(1)`      | Eski surat rangi          |
| `saturate(2)`   | Ranglar to‘yinganroq      |

```css
.hamkorlar img {
  filter: grayscale(1);
  opacity: 0.7;
  transition: filter 0.3s, opacity 0.3s;
}

.hamkorlar img:hover {
  filter: none;
  opacity: 1;
}
```

Hamkorlar logotiplari kulrang, ustiga kelinganda rangli bo‘ladi.

## Rasm ustidagi matn

```css
.kartochka {
  position: relative;
}

.kartochka figcaption {
  position: absolute;
  inset: auto 0 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}
```

## `alt` matni

Har bir `<img>` da `alt` bo‘lishi shart:

- ma’noli rasm — nima tasvirlanganini qisqa yozing;
- faqat bezak — `alt=""` (bo‘sh), ekran o‘quvchi uni o‘tkazib yuboradi.

```tekshir
Rasm o‘z konteyneridan kengayib ketmasligi uchun asosiy qoida qaysi?
+ `img { max-width: 100%; height: auto; }`
- `img { width: 1000px; }`
- `img { overflow: hidden; }`
> `max-width: 100%` rasmni konteynerga sig‘diradi, `height: auto` nisbatni saqlaydi.
```

```jonli
<style>
  img { display: inline-block; margin: 4px; }
  .avatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; }
  .bw { filter: grayscale(1); }
</style>
<img class="avatar" src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27200%27%20height=%27300%27%20viewBox=%270%200%20200%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%238e44ad%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ff7f50%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27200%27%20height=%27300%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27144%27%20cy=%2790%27%20r=%2732%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20300%20L0%20210%20L70%20135%20L120%20225%20L160%20180%20L200%20240%20L200%20300%20Z%27%20fill=%27%232c1b3a%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="">
<img class="bw" src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27150%27%20height=%2790%27%20viewBox=%270%200%20150%2090%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%23c0392b%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f1c40f%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27150%27%20height=%2790%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27108%27%20cy=%2727%27%20r=%2714%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%2090%20L0%2063%20L53%2041%20L90%2068%20L120%2054%20L150%2072%20L150%2090%20Z%27%20fill=%27%233b1a14%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" width="150" height="90">
```

## Xulosa

- `img { display: block; max-width: 100%; height: auto; }`.
- `border-radius: 50%` + `object-fit: cover` — avatar.
- `filter` — oq-qora, xiralik, yorqinlik.
