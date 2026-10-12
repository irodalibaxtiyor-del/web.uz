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

## Xulosa

- `img { display: block; max-width: 100%; height: auto; }`.
- `border-radius: 50%` + `object-fit: cover` — avatar.
- `filter` — oq-qora, xiralik, yorqinlik.
