## Chiziqli gradient

Gradient — bir rangdan boshqasiga silliq o‘tish. CSS’da gradient **rasm** hisoblanadi, shuning uchun u `background-image` (yoki `background`) da yoziladi.

```css
.banner {
  background-image: linear-gradient(#0071dc, #00b4d8);
}
```

Standart yo‘nalish — yuqoridan pastga.

## Yo‘nalish

```css
linear-gradient(to right, #0071dc, #fec400)      /* chapdan o‘ngga */
linear-gradient(to bottom right, #0071dc, #fec400) /* burchakka */
linear-gradient(135deg, #0071dc, #fec400)        /* burchak bilan */
```

| Burchak  | Yo‘nalish         |
| -------- | ----------------- |
| `0deg`   | Pastdan yuqoriga  |
| `90deg`  | Chapdan o‘ngga    |
| `180deg` | Yuqoridan pastga  |
| `270deg` | O‘ngdan chapga    |

## Ko‘p ranglar va to‘xtash nuqtalari

```css
linear-gradient(90deg, #0071dc, #16a34a, #fec400)
```

Har bir rangga **joy** berish mumkin:

```css
linear-gradient(90deg, #0071dc 0%, #0071dc 30%, #fec400 100%)
```

Birinchi 30% qismi to‘liq ko‘k, keyin sariqqa o‘tadi.

## Keskin chegara: chiziqlar

Ikki rang bir xil nuqtada to‘xtasa, o‘tish bo‘lmaydi — keskin chiziq hosil bo‘ladi:

```css
.bayroq {
  background: linear-gradient(
    #0099b5 0 33%,
    white 33% 67%,
    #1eb53a 67% 100%
  );
}
```

`#0099b5 0 33%` — rang 0 dan 33% gacha (ikki nuqtali qisqa yozuv).

## Takrorlanuvchi gradient

```css
.ogohlantirish-chiziq {
  background: repeating-linear-gradient(
    45deg,
    #fec400 0 10px,
    #0e1133 10px 20px
  );
}
```

Har 20px da takrorlanadigan qiya chiziqlar.

## Shaffoflik bilan

```css
.rasm-qatlami {
  background-image:
    linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent),
    url("rasm.jpg");
}
```

Rasm pastki qismi qorayadi — u yerdagi oq matn o‘qiladi.

## Xulosa

- `linear-gradient(yo‘nalish, rang1, rang2, …)` — `background-image` da.
- Yo‘nalish: `to right` yoki burchak (`90deg`).
- Bir xil nuqtada to‘xtagan ranglar — keskin chiziq.
- `repeating-linear-gradient` — takrorlanuvchi naqsh.
