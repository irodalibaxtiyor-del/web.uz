## Matematik funksiyalar

CSS qiymatlarni o‘zi hisoblay oladi — hatto **har xil birliklarni** aralashtirib.

## `calc()`

```css
.asosiy {
  width: calc(100% - 280px);
}

.sarlavha {
  height: calc(100vh - 64px);
}
```

`calc()` ichida `+`, `-`, `*`, `/` ishlatiladi. Qoida: `+` va `-` atrofida **bo‘sh joy shart**.

```css
width: calc(100% - 20px);  /* to‘g‘ri */
width: calc(100%-20px);    /* xato — ishlamaydi */
```

## `min()` va `max()`

`min()` berilgan qiymatlardan eng **kichigini** tanlaydi:

```css
.konteyner {
  width: min(100% - 32px, 1100px);
}
```

Kichik ekranda kenglik `100% - 32px`, katta ekranda 1100px dan oshmaydi. Bu bitta qator `width` + `max-width` + `padding` ni almashtiradi.

`max()` eng **kattasini** tanlaydi:

```css
.matn {
  font-size: max(1rem, 14px);
}
```

## `clamp()`

`clamp(MIN, ISTALGAN, MAX)` — qiymat MIN va MAX orasida qoladi:

```css
h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
}
```

- Telefonda sarlavha `1.75rem` dan kichraymaydi;
- katta monitorda `3rem` dan kattalashmaydi;
- oradagi ekranlarda `4vw + 1rem` bo‘yicha silliq o‘sadi.

Bu **suyuq tipografiya** deyiladi: media so‘rovlarsiz shrift ekranga moslashadi.

> Shrift uchun faqat `vw` ishlatmang (`font-size: 5vw`): foydalanuvchi sahifani kattalashtirganda (zoom) matn kattalashmaydi. `vw + rem` aralashmasi buni hal qiladi.

## Boshqa funksiyalar

| Funksiya       | Vazifasi                                 |
| -------------- | ---------------------------------------- |
| `round()`      | Yaxlitlash: `round(15.6px, 4px)` → 16px  |
| `mod()`, `rem()` | Bo‘linma qoldig‘i                      |
| `abs()`, `sign()` | Mutlaq qiymat va ishora               |
| `sin()`, `cos()` | Trigonometriya (doira bo‘ylab joylashtirish) |

Bular kamroq ishlatiladi, lekin barcha zamonaviy brauzerlarda bor.

## O‘zgaruvchilar bilan

Matematik funksiyalar CSS o‘zgaruvchilari bilan ayniqsa kuchli (keyingi dars):

```css
.karta {
  padding: calc(var(--qadam) * 2);
}
```

```tekshir
`clamp(1rem, 4vw, 2rem)` qanday ishlaydi?
+ qiymat 4vw, lekin 1rem dan kichik va 2rem dan katta bo‘lmaydi
- uchta qiymatning o‘rtachasi olinadi
- har doim 2rem bo‘ladi
> `clamp(min, ideal, max)` — suyuq o‘lcham chegaralar bilan.
```

```jonli
<style>
  h2 { font-size: clamp(1rem, 6vw, 2.5rem); margin: 6px 0; }
  .c { width: calc(100% - 40px); background: #eef4fb; padding: 6px; }
  .m { width: min(100%, 300px); background: #ffe08a; padding: 6px; margin-top: 6px; }
</style>
<h2>clamp() sarlavha</h2><div class="c">calc(100% - 40px)</div><div class="m">min(100%, 300px)</div>
```

## Xulosa

- `calc()` har xil birliklarni aralashtiradi; `+`/`-` atrofida bo‘sh joy.
- `min()` — yuqori chegara, `max()` — pastki chegara.
- `clamp(min, ideal, max)` — suyuq o‘lchamlar.
