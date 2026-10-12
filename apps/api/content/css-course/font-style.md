## Shrift uslubi, qalinligi va o‘lchami

Shriftning ko‘rinishini uchta asosiy xususiyat boshqaradi: `font-style`, `font-weight` va `font-size`.

## `font-style`

| Qiymat    | Natija                        |
| --------- | ----------------------------- |
| `normal`  | Oddiy                         |
| `italic`  | Kursiv (maxsus egik shakl)    |
| `oblique` | Oddiy harflarni qiyshaytirish |

```css
.izoh {
  font-style: italic;
}

em {
  font-style: normal; /* standart kursivni bekor qilish */
}
```

## `font-weight`

Qalinlik so‘z yoki son bilan beriladi:

| Son   | Nomi             |
| ----- | ---------------- |
| `300` | Ingichka (light) |
| `400` | Oddiy (`normal`) |
| `600` | Yarim qalin      |
| `700` | Qalin (`bold`)   |
| `900` | Juda qalin       |

```css
.narx {
  font-weight: 700;
}
```

Shriftda kerakli qalinlik bo‘lmasa, brauzer eng yaqinini tanlaydi yoki sun’iy qalinlashtiradi.

## `font-size`

Shrift o‘lchami. Asosiy birliklar:

| Birlik | Nimaga nisbatan                    | Misol            |
| ------ | ---------------------------------- | ---------------- |
| `px`   | Mutlaq piksel                      | `16px`           |
| `rem`  | Ildiz (`html`) elementning shrifti | `1.25rem` = 20px |
| `em`   | Ota elementning shrifti            | `1.5em`          |
| `%`    | Ota elementning shrifti            | `120%`           |

Brauzerning standart shrifti odatda **16px**. Foydalanuvchi uni sozlamalarda kattalashtirgan bo‘lishi mumkin — `rem` shu sozlamani hurmat qiladi, shuning uchun matn uchun `rem` tavsiya etiladi.

```css
h1 {
  font-size: 2rem; /* 32px */
}

small {
  font-size: 0.875rem; /* 14px */
}
```

### `em` ning to‘planishi

`em` ota elementga bog‘liq, shuning uchun ichma-ich ro‘yxatlarda o‘lcham ketma-ket kichrayishi mumkin:

```css
li {
  font-size: 0.8em; /* ichki ro‘yxatda 0.8 × 0.8 = 0.64 */
}
```

Shu sababli shrift o‘lchami uchun `rem` xavfsizroq. `em` esa elementning o‘z shriftiga bog‘liq bo‘lgan padding uchun qulay.

## `font-variant`

`font-variant: small-caps` kichik harflarni kichraytirilgan bosh harflar shaklida ko‘rsatadi.

## Xulosa

- `font-style: italic` — kursiv, `font-weight: 700` — qalin.
- Matn o‘lchami uchun `rem` ishlating: foydalanuvchi sozlamasini hurmat qiladi.
- `em` ota elementga bog‘liq va ichma-ich elementlarda to‘planadi.
