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

```tekshir
`opacity: 0` bo‘lgan tugma haqida to‘g‘ri gap qaysi?
+ u ko‘rinmaydi, lekin joy egallaydi va bosilishi mumkin
- u sahifadan butunlay olib tashlanadi
- u avtomatik `disabled` bo‘ladi
> Ko‘rinmas, lekin faol element foydalanuvchini chalg‘itadi — kerak bo‘lsa `visibility: hidden` yoki `display: none`.
```

```jonli
<style>
  img { transition: opacity .3s; }
  img:hover { opacity: 0.4; }
</style>
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27200%27%20height=%27120%27%20viewBox=%270%200%20200%20120%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230071dc%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f5a623%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27200%27%20height=%27120%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27144%27%20cy=%2736%27%20r=%2719%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20120%20L0%2084%20L70%2054%20L120%2090%20L160%2072%20L200%2096%20L200%20120%20Z%27%20fill=%27%23123456%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" width="200" height="120"> <span>Rasm ustiga olib keling</span>
```

## Xulosa

- `opacity` 0 dan 1 gacha, butun elementga ta’sir qiladi.
- Faqat fonni shaffof qilish uchun `rgba()` ishlating.
- `opacity: 0` element hali ham bosiladi va o‘qiladi.
