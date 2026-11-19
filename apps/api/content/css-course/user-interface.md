## Interfeys xususiyatlari

Bir nechta CSS xususiyati foydalanuvchining sahifa bilan **o‘zaro ta’siriga** taalluqli.

## `cursor`

| Qiymat        | Ko‘rinishi / ma’nosi              |
| ------------- | --------------------------------- |
| `default`     | Oddiy strelka                     |
| `pointer`     | Qo‘l — bosiladigan narsa          |
| `text`        | Matn kursori                      |
| `not-allowed` | Taqiq belgisi — o‘chirilgan       |
| `grab`, `grabbing` | Sudrash mumkin / sudralmoqda |
| `wait`, `progress` | Kutish                       |
| `help`        | So‘roq belgisi                    |

Kursor foydalanuvchiga **nima bo‘lishini** aytadi. Bosilmaydigan narsaga `pointer` bermang.

## `resize`

Standart holda faqat `textarea` ning o‘lchamini o‘zgartirish mumkin. `resize` buni boshqaradi:

```css
textarea {
  resize: vertical; /* none | both | horizontal | vertical */
}

.panel {
  overflow: auto;
  resize: both; /* oddiy blokda ham — overflow kerak */
}
```

## `user-select`

```css
.tugma {
  user-select: none; /* ikki marta bosilganda matn belgilanmaydi */
}

.kod {
  user-select: all; /* bir bosishda hammasi belgilanadi */
}
```

Oddiy matnda `user-select: none` ishlatmang — foydalanuvchi nusxa olishni xohlashi mumkin.

## `pointer-events`

```css
.qoplama {
  pointer-events: none;
}
```

Element sichqonchani “sezmaydi”: bosish uning ostidagi elementga o‘tadi. Ko‘rinmas tooltiplar va bezak qatlamlari uchun.

## `accent-color` va `caret-color`

```css
:root {
  accent-color: #0071dc; /* checkbox, radio, slayder */
}

input {
  caret-color: #0071dc; /* yozish kursori */
}
```

## `scroll-behavior` va `scroll-margin`

```css
html {
  scroll-behavior: smooth;
}

h2 {
  scroll-margin-top: 80px;
}
```

- `smooth` — `#bolim` havolasi bosilganda sahifa silliq aylanadi.
- `scroll-margin-top` — yopishqoq sarlavha ostida qolib ketmaslik uchun bo‘lim biroz pastda to‘xtaydi.

Harakatni kamaytirishni yoqqan foydalanuvchilar uchun `smooth` ni o‘chiring:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

## `appearance`

```css
select {
  appearance: none;
}
```

Brauzerning standart ko‘rinishini olib tashlaydi — elementni noldan bezash uchun. Shundan keyin fokus, strelka va holatlarni o‘zingiz qo‘shishingiz kerak.

```tekshir
Ichki havolaga (`#bolim`) o‘tishda sahifa silliq aylanishi uchun nima yoziladi?
+ `html { scroll-behavior: smooth; }`
- `a { transition: scroll 1s; }`
- `body { overflow: smooth; }`
> Mahkamlangan header ostida qolmasligi uchun bo‘limga `scroll-margin-top` ham beriladi.
```

```jonli
<style>
  textarea { resize: vertical; width: 100%; }
  .nosel { user-select: none; background: #eef4fb; padding: 6px; }
  .k { cursor: help; text-decoration: underline dotted; }
</style>
<textarea rows="3">Faqat balandligini o‘zgartirish mumkin</textarea>
<p class="nosel">Bu matnni belgilab bo‘lmaydi</p>
<p>Sichqonchani <span class="k">bu so‘z</span> ustiga olib keling.</p>
```

## Xulosa

- `cursor` — nima bo‘lishini ko‘rsatadi.
- `resize`, `user-select`, `pointer-events` — o‘zaro ta’sirni boshqaradi.
- `scroll-behavior: smooth` + `scroll-margin-top` — qulay ichki havolalar.
