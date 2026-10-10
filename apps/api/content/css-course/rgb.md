## RGB nima?

Ekrandagi har bir rang uchta yorug‘likning aralashmasidan hosil bo‘ladi: **qizil** (Red), **yashil** (Green) va **ko‘k** (Blue). Har birining kuchi 0 dan 255 gacha bo‘ladi.

```css
p {
  color: rgb(0, 113, 220); /* qizil 0, yashil 113, ko‘k 220 */
}
```

## Asosiy qiymatlar

| Yozuv                 | Rang      |
| --------------------- | --------- |
| `rgb(255, 0, 0)`      | Qizil     |
| `rgb(0, 255, 0)`      | Yashil    |
| `rgb(0, 0, 255)`      | Ko‘k      |
| `rgb(0, 0, 0)`        | Qora      |
| `rgb(255, 255, 255)`  | Oq        |
| `rgb(255, 255, 0)`    | Sariq     |
| `rgb(128, 128, 128)`  | Kulrang   |

Qoidalar:

- uchala qiymat **0** — yorug‘lik yo‘q, ya’ni **qora**;
- uchala qiymat **255** — hammasi to‘liq, ya’ni **oq**;
- uchala qiymat teng bo‘lsa — **kulrang** tus.

## Shaffoflik: alfa kanal

To‘rtinchi qiymat — **alfa**, ya’ni shaffoflik: `0` — butunlay shaffof, `1` — to‘liq ko‘rinadi.

```css
.qoplama {
  background-color: rgb(0 0 0 / 0.5); /* yarim shaffof qora */
}
```

Eski yozuv `rgba()` ham hamon ishlaydi:

```css
.qoplama {
  background-color: rgba(0, 0, 0, 0.5);
}
```

> **Eslatma:** Zamonaviy CSS’da qiymatlar vergulsiz, bo‘sh joy bilan yoziladi va alfa `/` dan keyin keladi: `rgb(0 113 220 / 0.8)`. Ikkala yozuv ham to‘g‘ri.

## Shaffoflik qayerda kerak?

- rasm ustidagi matn uchun qoraytirilgan qatlam;
- modal oyna ortidagi fon;
- yengil soyalar: `box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);`.

```css
.banner {
  background-color: rgb(0 113 220 / 0.1); /* juda och ko‘k fon */
  color: rgb(0 113 220);
}
```

## Xulosa

- `rgb(qizil, yashil, ko‘k)` — har biri 0–255.
- Hammasi 0 — qora, hammasi 255 — oq.
- Alfa qiymati shaffoflikni beradi: `rgb(0 0 0 / 0.5)` yoki `rgba(0, 0, 0, 0.5)`.
