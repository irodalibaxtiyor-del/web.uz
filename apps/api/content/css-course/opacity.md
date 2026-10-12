## Shaffoflik: `opacity`

`opacity` elementning qanchalik ko‘rinishini belgilaydi: `1` — to‘liq ko‘rinadi, `0` — butunlay shaffof.

```css
.xira {
  opacity: 0.5;
}
```

Qiymat `0` dan `1` gacha son yoki foiz (`50%`) bo‘ladi.

## Hover effekti

```css
.galereya img {
  opacity: 0.8;
}

.galereya img:hover {
  opacity: 1;
}
```

Keyinroq (11-modul) `transition` qo‘shib, o‘zgarishni silliq qilamiz.

## `opacity` hamma narsaga ta’sir qiladi

`opacity` elementning **o‘zi va barcha bolalariga** — matnga, rasmlarga, chegaraga — ta’sir qiladi. Bolaga `opacity: 1` berib buni bekor qilib bo‘lmaydi.

```css
.banner {
  background-color: #0071dc;
  opacity: 0.6; /* matn ham xira bo‘lib qoladi */
}
```

Agar faqat **fon** shaffof bo‘lishi kerak bo‘lsa, rangning alfa kanalidan foydalaning:

```css
.banner {
  background-color: rgba(0, 113, 220, 0.6); /* matn to‘liq ko‘rinadi */
}
```

| Usul                     | Nimaga ta’sir qiladi        |
| ------------------------ | --------------------------- |
| `opacity: 0.6`           | Butun element va bolalari   |
| `rgba(…, 0.6)` / `#0071dc99` | Faqat shu rang          |

## Rasm ustidagi matn

Fotosurat ustiga matn yozilganda o‘qilishi uchun yarim shaffof qatlam qo‘yiladi:

```css
.kartochka {
  position: relative;
}

.kartochka .izoh {
  position: absolute;
  inset: auto 0 0 0;
  padding: 12px;
  background-color: rgba(14, 17, 51, 0.7);
  color: white;
}
```

## `opacity: 0` va yashirish

`opacity: 0` elementni ko‘rinmas qiladi, lekin u **joyida qoladi** va hali ham bosiladi, fokus oladi, ekran o‘quvchi uni o‘qiydi. Elementni haqiqatan yashirish kerak bo‘lsa, `display: none` yoki `visibility: hidden` ishlating.

## Xulosa

- `opacity` 0 dan 1 gacha, butun elementga ta’sir qiladi.
- Faqat fonni shaffof qilish uchun `rgba()` ishlating.
- `opacity: 0` element hali ham bosiladi va o‘qiladi.
